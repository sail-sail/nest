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
  readonly: process.env.AGENT_TOOL_READONLY !== "false",
  maxToolCalls: num(process.env.AGENT_MAX_TOOL_CALLS, 24),
  // 页面操作（PageAgent）：单次任务最长等待、最多步数
  pageEnabled: process.env.AGENT_PAGE_OPERATE !== "false",
  pageTimeoutMs: num(process.env.AGENT_PAGE_TIMEOUT_MS, 180_000),
  pageMaxSteps: num(process.env.AGENT_PAGE_MAX_STEPS, 20),
  // 跨会话记忆：按用户隔离，存 .dsh/memory.json
  memoryEnabled: process.env.AGENT_MEMORY !== "false",
  memoryFile: path.join(rootDir, ".dsh", "memory.json"),
  memoryDigestLimit: num(process.env.AGENT_MEMORY_DIGEST_LIMIT, 10),
  // 浏览器里的 PageAgent 不持有模型 key，走宿主代理
  llmProxyEnabled: process.env.AGENT_LLM_PROXY !== "false",
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
