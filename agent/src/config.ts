import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * 开发时源码在 src/，项目根是上一级；构建后 dist 本身就是部署根（直接上传 dist 的内容）。
 * 也可以用 AGENT_HOME 显式指定（systemd/容器里更稳）。
 */
export const rootDir = process.env.AGENT_HOME
  ? path.resolve(process.env.AGENT_HOME)
  : path.basename(here) === "src"
    ? path.resolve(here, "..")
    : here;

// Node 22: 读取 agent/.env；不存在时忽略，交由外部环境变量
try {
  process.loadEnvFile(path.join(rootDir, ".env"));
} catch {
  // ignore
}

const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);
const FALSE_VALUES = new Set(["0", "false", "no", "off"]);

function envNum(
  name: string,
  fallback: number,
  min = 1,
  max = Number.MAX_SAFE_INTEGER,
): number {
  const raw = process.env[name];
  if (raw === undefined || !raw.trim()) return fallback;
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(
      `${name} 必须是 ${min} 到 ${max} 之间的整数，当前为 ${JSON.stringify(raw)}`,
    );
  }
  return parsed;
}

function envBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined || !raw.trim()) return fallback;
  const normalized = raw.trim().toLowerCase();
  if (TRUE_VALUES.has(normalized)) return true;
  if (FALSE_VALUES.has(normalized)) return false;
  throw new Error(
    `${name} 必须是 true/false、1/0、yes/no 或 on/off，当前为 ${JSON.stringify(raw)}`,
  );
}

export const config = {
  rootDir,
  host: process.env.AGENT_HOST || "127.0.0.1",
  port: envNum("AGENT_PORT", 4002, 1, 65_535),
  publicOrigin: (process.env.AGENT_PUBLIC_ORIGIN || "http://localhost:4000").replace(/\/$/, ""),
  mcpUrl: process.env.APP_MCP_URL || "http://localhost:4001/mcp",
  model: process.env.DSH_MODEL || "deepseek-v4-flash",
  deepseekKey: process.env.DEEPSEEK_API_KEY || "",
  // 自定义模型（OpenAI 兼容网关）：仅在 DEEPSEEK_API_KEY 缺失时启用
  customLlmKey: process.env.CUSTOM_LLM_API_KEY || "",
  customLlmBase: (process.env.CUSTOM_LLM_BASE_URL || "").replace(/\/$/, ""),
  customLlmModel: process.env.CUSTOM_LLM_MODEL || "",
  customLlmProvider: process.env.CUSTOM_LLM_PROVIDER || "custom",
  customLlmDisplayName: process.env.CUSTOM_LLM_NAME || "",
  customLlmContextWindow: envNum("CUSTOM_LLM_CONTEXT_WINDOW", 131_072),
  readonly: envBool("AGENT_TOOL_READONLY", true),
  // SSE 心跳：默认关闭，防止浏览器/宿主间持续 ping
  heartbeatEnabled: envBool("AGENT_HEARTBEAT", false),
  // 页面操作（PageAgent）：单次任务最长等待、最多步数
  pageEnabled: envBool("AGENT_PAGE_OPERATE", true),
  pageTimeoutMs: envNum("AGENT_PAGE_TIMEOUT_MS", 180_000),
  pageMaxSteps: envNum("AGENT_PAGE_MAX_STEPS", 20, 1, 40),
  // LLM 代理（PageAgent 浏览器侧模型调用）：单请求输出上限与每用户每日 token 封顶
  llmProxyEnabled: envBool("AGENT_LLM_PROXY", true),
  llmMaxTokensCap: envNum("AGENT_LLM_MAX_TOKENS", 8_192),
  llmDailyTokens: envNum("AGENT_LLM_DAILY_TOKENS", 1_000_000),
  // 跨会话记忆：按用户隔离，存 .dsh/memory.json
  memoryEnabled: envBool("AGENT_MEMORY", true),
  memoryFile: path.join(rootDir, ".dsh", "memory.json"),
  memoryDigestLimit: envNum("AGENT_MEMORY_DIGEST_LIMIT", 10),
  // 附件暂存：浏览器直传宿主，模型只拿 attachmentId，base64 不进模型上下文
  attachmentEnabled: envBool("AGENT_ATTACHMENT", true),
  attachmentDir: path.join(rootDir, ".dsh", "attachments"),
  attachmentMaxBytes: envNum("AGENT_ATTACHMENT_MAX_BYTES", 10 * 1024 * 1024),
  attachmentMaxPerUser: envNum("AGENT_ATTACHMENT_MAX_FILES", 5),
  attachmentTtlMs: envNum("AGENT_ATTACHMENT_TTL_MS", 30 * 60_000),
  // 工具参数内联 base64 的字符上限（≈6KB 二进制），超过必须走附件
  inlineBase64MaxChars: envNum("AGENT_INLINE_BASE64_MAX", 8_192),
  // 单次工具输出进入模型上下文的 token 预算（dsh 子进程按此裁剪）
  toolOutputTokens: envNum("AGENT_TOOL_OUTPUT_TOKENS", 6_000),
  // 会话句柄生命周期：空闲多久释放、最多同时驻留多少个
  sessionTtlMs: envNum("AGENT_SESSION_TTL_MS", 30 * 60_000),
  sessionMax: envNum("AGENT_SESSION_MAX", 32),
  // 用量记账：按天落盘，保留天数
  usageDir: path.join(rootDir, ".dsh", "usage"),
  usageRetentionDays: envNum("AGENT_USAGE_RETENTION_DAYS", 30),
  deepseekBase: (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1").replace(
    /\/$/,
    "",
  ),
  dshHome: path.join(rootDir, ".dsh"),
  workspace: path.join(rootDir, "workspace"),
  patchFile: path.join(rootDir, "dsh", "patch.yml"),
  dataFile: path.join(rootDir, ".dsh", "conversations.json"),
} as const;

export const TOOL_NAMES = [
  "session_me",
  "schema_search",
  "schema_get",
  "graphql_execute",
  "oss_upload",
  "oss_download_url",
  "oss_image_url",
] as const;

export type ToolName = (typeof TOOL_NAMES)[number];

/**
 * 统一的 Origin 白名单：主应用同源才放行。
 * 缺 Origin 头（非浏览器客户端）不拦，真正的防线是 Bearer token；
 * index.ts 与 llm-proxy.ts 共用这一份逻辑，避免两处实现漂移。
 */
export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  return (
    origin === config.publicOrigin ||
    origin === "http://localhost:4000" ||
    origin === "http://127.0.0.1:4000"
  );
}
