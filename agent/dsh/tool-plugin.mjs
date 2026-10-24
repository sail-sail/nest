/**
 * 把 Rust 侧 7 个 MCP 工具注册成 dsh 工具。
 *
 * 关键点：插件运行在 dsh 子进程里，拿不到浏览器 token。
 * 它只把 dsh 的 sessionId（exec.agent.id）发给宿主内部的工具桥，
 * 由宿主按会话取 token 后再调 Rust /mcp。
 *
 * schema 以 rust/app/base/mcp/mcp_model.rs 为准，Rust 侧字段变更时必须同步这里。
 */
import { defineTool } from "@deepseek-ai/dsh-tools";

const BRIDGE_URL = process.env.AGENT_BRIDGE_URL;
const BRIDGE_SECRET = process.env.AGENT_BRIDGE_SECRET;

function bridgeUrl(path) {
  if (!BRIDGE_URL) throw new Error("AGENT_BRIDGE_URL 未配置");
  return `${BRIDGE_URL}${path}`;
}

async function callBridge(exec, tool, args) {
  const sessionId = exec?.agent?.id;
  if (!sessionId) throw new Error("缺少 dsh session 身份");
  if (!BRIDGE_SECRET) throw new Error("AGENT_BRIDGE_SECRET 未配置");

  const response = await fetch(bridgeUrl("/call"), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-bridge-secret": BRIDGE_SECRET,
    },
    body: JSON.stringify({ sessionId, tool, args }),
    signal: exec.signal,
  });

  const payload = await response.json().catch(() => ({}));
  if (!payload?.ok) {
    throw new Error(payload?.error || `工具桥调用失败（HTTP ${response.status}）`);
  }
  return payload.result ?? null;
}

/**
 * 单次工具输出的 token 预算。宿主通过 AGENT_TOOL_OUTPUT_TOKENS 注入，
 * 与 src/config.ts 的默认值保持一致；插件单独运行时退回 6,000。
 */
const OUTPUT_TOKEN_BUDGET = (() => {
  const parsed = Number(process.env.AGENT_TOOL_OUTPUT_TOKENS);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 6_000;
})();

/**
 * 保守估算 token：CJK/全角字符按 1 字符 1 token，其余按 4 字符 1 token。
 * 没有 tokenizer，宁可高估——高估只会多裁一点，低估会直接撑爆上下文。
 */
export function estimateTokens(text) {
  let chars = 0;
  let wide = 0;
  for (const ch of text) {
    chars += 1;
    if (ch.codePointAt(0) >= 0x2e80) wide += 1;
  }
  return wide + Math.ceil((chars - wide) / 4);
}

function compactValue(value, limits, stats, depth = 0) {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    if (value.length <= limits.maxString) return value;
    stats.truncatedStrings += 1;
    return `${value.slice(0, limits.maxString)}…（已省略 ${value.length - limits.maxString} 字符）`;
  }
  if (typeof value !== "object") return value;
  if (depth >= 8) return "[层级过深已省略]";
  if (Array.isArray(value)) {
    const kept = value
      .slice(0, limits.maxArray)
      .map((item) => compactValue(item, limits, stats, depth + 1));
    if (value.length > limits.maxArray) {
      stats.droppedItems += value.length - limits.maxArray;
      kept.push(`…（另有 ${value.length - limits.maxArray} 项）`);
    }
    return kept;
  }
  const out = {};
  for (const [key, item] of Object.entries(value)) {
    out[key] = compactValue(item, limits, stats, depth + 1);
  }
  return out;
}

function budgetNotice(stats, budget) {
  const parts = [];
  if (stats.droppedItems > 0) parts.push(`省略数组项 ${stats.droppedItems} 个`);
  if (stats.truncatedStrings > 0) parts.push(`截断长字符串 ${stats.truncatedStrings} 个`);
  if (parts.length === 0) return "";
  return `[工具输出超出 ${budget} tokens 预算，已裁剪：${parts.join("，")}。需要完整数据请缩小 pgSize 或只取必要字段]\n`;
}

/**
 * 把工具输出裁到 token 预算内：优先按数组/字符串结构化裁剪，
 * 只有遇到单个巨型字符串等病态输入才退化成硬截断。
 */
export function renderWithinBudget(value, budget = OUTPUT_TOKEN_BUDGET) {
  const full = JSON.stringify(value, null, 2) ?? "null";
  if (estimateTokens(full) <= budget) return full;

  const attempts = [
    { maxArray: 50, maxString: 4_000 },
    { maxArray: 20, maxString: 1_500 },
    { maxArray: 5, maxString: 400 },
  ];

  for (const limits of attempts) {
    const stats = { droppedItems: 0, truncatedStrings: 0 };
    const compacted = compactValue(value, limits, stats);
    const body = JSON.stringify(compacted, null, 2) ?? "null";
    const text = `${budgetNotice(stats, budget)}${body}`;
    if (estimateTokens(text) <= budget) return text;
  }

  const notice = `[工具输出超出 ${budget} tokens 预算，已硬截断；请缩小 pgSize、只取必要字段或改用聚合查询]\n`;
  const suffixOf = (kept) => `\n…（以下省略 ${full.length - kept} 字符）`;
  // 预留尾部说明的 token，否则加完说明会重新超出预算
  const room = Math.max(1, budget - estimateTokens(notice) - 20);
  const tokensPerChar = estimateTokens(full) / Math.max(1, full.length);
  let keep = Math.max(1, Math.floor(room / tokensPerChar));
  for (let i = 0; i < 20 && keep > 1; i += 1) {
    if (estimateTokens(`${notice}${full.slice(0, keep)}${suffixOf(keep)}`) <= budget) break;
    keep = Math.floor(keep * 0.85);
  }
  return `${notice}${full.slice(0, keep)}${suffixOf(keep)}`;
}

const renderJson = (_args, value) => [{ type: "text", text: renderWithinBudget(value) }];

function tool(name, description, parameters, options = {}) {
  return defineTool({
    name,
    description,
    parameters,
    output: { schema: { type: "json" }, render: renderJson },
    timeoutMs: options.timeoutMs ?? 180_000,
    isConcurrencySafe: () => options.concurrencySafe ?? true,
    async execute(args, exec) {
      return callBridge(exec, name, args);
    },
  });
}

export const name = "app-tools";
export const inject = ["tools"];

export function apply(ctx) {
  ctx.tools.register(
    tool(
      "session_me",
      "查看当前登录用户的身份、租户与 token 相关信息。开始任何业务查询前可先调用它确认登录态。",
      {},
    ),
  );

  ctx.tools.register(
    tool(
      "schema_search",
      "搜索当前服务的 GraphQL schema，定位 Query、Mutation、Input、返回类型和字段签名。不清楚表名/字段名时先用它。",
      {
        keyword: { type: "string", required: true, description: "搜索关键词，例如 usr、order、tenant" },
        kind: { type: "string", description: "可选：按类型种类过滤，例如 type、input、enum、scalar" },
        scope: { type: "string", description: "可选：definition / member / all，默认 all" },
        limit: { type: "number", description: "可选：返回条数上限" },
        includeSdl: { type: "boolean", description: "可选：是否在结果里附带 SDL" },
      },
    ),
  );

  ctx.tools.register(
    tool(
      "schema_get",
      "按精确类型名返回完整 SDL。先用 schema_search 找到类型名，再用它看完整定义；过大的聚合类型会被拒绝。",
      {
        name: { type: "string", required: true, description: "精确类型名，例如 Usr、FindAllUsrInput" },
        kind: { type: "string", description: "可选：类型种类" },
      },
    ),
  );

  ctx.tools.register(
    tool(
      "graphql_execute",
      "在进程内直接执行 GraphQL query / mutation（当前默认只读，mutation 会被拒绝）。" +
        "对任何 findAll* 查询必须显式传 page: { pgOffset, pgSize, isResultLimit: true }；" +
        "缺 page 会被拒绝，pgSize 缺省 20、超过 2000 自动降到 2000。" +
        "只取回答需要的字段；结果超出 token 预算会被裁剪，需要更多数据时用聚合或分页。",
      {
        query: { type: "string", required: true, description: "GraphQL 查询文本" },
        variables: { type: "object", additionalProperties: true, description: "可选：变量对象" },
        operationName: { type: "string", description: "可选：多操作时的 operationName" },
        clientTenantId: { type: "string", description: "可选：客户端指定的租户 id" },
      },
    ),
  );

  ctx.tools.register(
    tool(
      "oss_upload",
      [
        "把附件上传到业务系统，返回附件 id 等信息。",
        "文件字节不要内联进参数：内容超过 8,192 字符时必须先由前端 POST 到 /agent/api/attachments 拿到 attachmentId，调用时只传 attachmentId。",
        "contentBase64 仅用于极小的文本内容；超过上限会被宿主直接拒绝，不要把文件转成 base64 传进来。",
      ].join("\n"),
      {
        id: { type: "string", description: "可选：指定附件 id" },
        filename: { type: "string", description: "可选：文件名；传 attachmentId 时可省略，默认用附件原名" },
        attachmentId: {
          type: "string",
          description: "宿主暂存附件 id（att_ 开头）。上传文件时必须用它，不要用 contentBase64",
        },
        contentBase64: {
          type: "string",
          description: "仅限 ≤8,192 字符的极小内容；文件请先上传成附件再传 attachmentId",
        },
        contentType: { type: "string", description: "可选：MIME 类型" },
        isPublic: { type: "boolean", description: "可选：是否公开" },
        db: { type: "string", description: "可选：目标库" },
      },
    ),
  );

  ctx.tools.register(
    tool(
      "oss_download_url",
      "生成附件下载链接（链接本身带业务 authorization，直接返回给用户即可）。",
      {
        id: { type: "string", required: true, description: "附件 id" },
        filename: { type: "string", description: "可选：下载时使用的文件名" },
        inline: { type: "string", description: "可选：是否内联展示" },
      },
    ),
  );

  ctx.tools.register(
    tool(
      "oss_image_url",
      "生成图片预览链接，支持宽高与质量参数。",
      {
        id: { type: "string", required: true, description: "附件 id" },
        filename: { type: "string", description: "可选：文件名" },
        inline: { type: "string", description: "可选：是否内联展示" },
        format: { type: "string", description: "可选：输出格式" },
        width: { type: "number", description: "可选：宽度" },
        height: { type: "number", description: "可选：高度" },
        quality: { type: "number", description: "可选：质量 1-100" },
      },
    ),
  );

  ctx.tools.register(
    tool(
      "page_status",
      "查看用户浏览器里的页面操作通道是否在线、当前停留在哪个路由。准备做页面操作但不确定用户是否打开页面时，先调用它。",
      {},
      { timeoutMs: 15_000 },
    ),
  );

  ctx.tools.register(
    tool(
      "page_operate",
      [
        "直接操作用户当前浏览器里的系统页面：点击按钮、填写表单、选择下拉、滚动、切换菜单、提交或关闭弹窗。",
        "instruction 用自然语言描述目标（例如：进入用户管理页，搜索 admin，点击第一行的编辑），不要写成代码。",
        "只用于 UI 操作。查数据、看字段、改数据请用 graphql_execute 等业务工具，不要用页面操作绕路。",
        "执行前会自动收起右下角的智能助手抽屉，避免遮挡页面；不需要用户再确认。",
      ].join("\n"),
      {
        instruction: {
          type: "string",
          required: true,
          description: "要在当前页面上完成的操作，描述目标与关键文案",
        },
        max_steps: {
          type: "number",
          description: "可选：最大操作步数，默认 20，上限 40",
        },
      },
      { timeoutMs: 300_000, concurrencySafe: false },
    ),
  );

  ctx.tools.register(
    tool(
      "memory_save",
      [
        "把用户的稳定偏好、背景、约定写入长期记忆（跨会话生效）。",
        "用户说“记住 / 以后都 / 我的习惯是”时必须调用；发现稳定的偏好或身份信息也可以主动写入。",
        "不要保存密码、token、手机号、身份证、银行卡等敏感信息，也不要保存一次性的任务细节。",
      ].join("\n"),
      {
        text: { type: "string", required: true, description: "一句话描述要记住的内容，用第三人称" },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "可选：标签，便于检索，例如 ['偏好', '报表']",
        },
      },
      { timeoutMs: 15_000 },
    ),
  );

  ctx.tools.register(
    tool(
      "memory_search",
      "在长期记忆里检索该用户以前说过的偏好、背景、约定。用户问“我之前说过什么”或需要个性化回答时先用它；首轮对话已自动注入最近记忆，缺细节时再搜。",
      {
        query: { type: "string", required: true, description: "检索词，例如 报表 偏好 客户" },
        limit: { type: "number", description: "可选：返回条数，默认 10" },
      },
      { timeoutMs: 15_000 },
    ),
  );

  ctx.tools.register(
    tool(
      "memory_list",
      "列出当前用户的长期记忆，用于核对有哪些记忆、或准备清理。",
      {
        limit: { type: "number", description: "可选：返回条数，默认 50" },
      },
      { timeoutMs: 15_000 },
    ),
  );

  ctx.tools.register(
    tool(
      "memory_forget",
      "删除长期记忆：按 id 精确删除，或按 query 模糊删除；两者都不传会清空该用户的全部记忆，必须确认用户确实要求清空。",
      {
        id: { type: "string", description: "可选：记忆 id（mem_ 开头）" },
        query: { type: "string", description: "可选：按关键词删除匹配的记忆" },
      },
      { timeoutMs: 15_000, concurrencySafe: false },
    ),
  );
}
