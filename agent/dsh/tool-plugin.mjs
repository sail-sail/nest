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

const renderJson = (_args, value) => {
  let text = JSON.stringify(value, null, 2) ?? "null";
  if (text.length > 60_000) {
    text = `${text.slice(0, 60_000)}\n...（结果过大，已截断）`;
  }
  return [{ type: "text", text }];
};

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
        "缺 page 会被拒绝，pgSize 缺省 20、超过 2000 自动降到 2000。",
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
      "上传附件。contentBase64 为文件内容的 base64；返回附件 id 等信息。",
      {
        id: { type: "string", description: "可选：指定附件 id" },
        filename: { type: "string", required: true, description: "文件名" },
        contentBase64: { type: "string", required: true, description: "文件内容的 base64" },
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
