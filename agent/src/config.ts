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

function num(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const config = {
  rootDir,
  host: process.env.AGENT_HOST || "127.0.0.1",
  port: num(process.env.AGENT_PORT, 4002),
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
  customLlmContextWindow: num(process.env.CUSTOM_LLM_CONTEXT_WINDOW, 131_072),
  readonly: process.env.AGENT_TOOL_READONLY !== "false",
  // 页面操作（PageAgent）：单次任务最长等待、最多步数
  pageEnabled: process.env.AGENT_PAGE_OPERATE !== "false",
  pageTimeoutMs: num(process.env.AGENT_PAGE_TIMEOUT_MS, 180_000),
  pageMaxSteps: num(process.env.AGENT_PAGE_MAX_STEPS, 20),
  // LLM 代理（PageAgent 浏览器侧模型调用）：单请求输出上限与每用户每日 token 封顶
  llmProxyEnabled: process.env.AGENT_LLM_PROXY !== "false",
  llmMaxTokensCap: num(process.env.AGENT_LLM_MAX_TOKENS, 8_192),
  llmDailyTokens: num(process.env.AGENT_LLM_DAILY_TOKENS, 1_000_000),
  // 跨会话记忆：按用户隔离，存 .dsh/memory.json
  memoryEnabled: process.env.AGENT_MEMORY !== "false",
  memoryFile: path.join(rootDir, ".dsh", "memory.json"),
  memoryDigestLimit: num(process.env.AGENT_MEMORY_DIGEST_LIMIT, 10),
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
