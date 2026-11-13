import fs from "node:fs";
import path from "node:path";
import { config } from "./config.ts";
import { errorMessage, log } from "./logger.ts";

export type McpTransport = "streamable-http" | "stdio";

export interface McpServerConfig {
  name: string;
  enabled?: boolean;
  transport: McpTransport;
  /** streamable-http */
  url?: string;
  headers?: Record<string, string>;
  /** stdio */
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  toolCallTimeoutMs?: number;
  failOnStartupError?: boolean;
}

interface McpConfigFile {
  servers?: McpServerConfig[];
}

const NAME_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;
const ENV_PATTERN = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g;

function expandEnv(value: string): string {
  return value.replace(ENV_PATTERN, (_match, key: string) => process.env[key] ?? "");
}

function expandRecord(
  record: Record<string, string> | undefined,
): Record<string, string> | undefined {
  if (!record) return undefined;
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    if (typeof value !== "string") continue;
    out[key] = expandEnv(value);
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * 读取 agent/mcp.config.json，生成一个只包含 mcp-client insert 行的 overlay。
 * 返回值是 patch 文件路径；没有启用的 server 时返回 undefined。
 *
 * 注意：这里会把 ${ENV} 展开后写到 .dsh/runtime/mcp.patch.json，
 * 所以该目录要和 .env 一样按敏感数据保护（已在 .gitignore 里）。
 */
export function prepareMcpPatch(): string | undefined {
  const configFile = path.join(config.rootDir, "mcp.config.json");
  if (!fs.existsSync(configFile)) return undefined;

  let parsed: McpConfigFile;
  try {
    parsed = JSON.parse(fs.readFileSync(configFile, "utf8")) as McpConfigFile;
  } catch (error) {
    log.error("mcp.config.json 解析失败，已跳过外接 MCP", { error: errorMessage(error) });
    return undefined;
  }

  const servers = (parsed.servers ?? []).filter(
    (server) => server && server.enabled !== false,
  );
  if (servers.length === 0) return undefined;

  const seen = new Set<string>();
  const rows: Array<Record<string, unknown>> = [];

  for (const server of servers) {
    if (!server?.name || !NAME_PATTERN.test(server.name)) {
      log.warn("跳过外接 MCP：name 必须匹配 [A-Za-z0-9_-]{1,32}", { name: server?.name });
      continue;
    }
    if (seen.has(server.name)) {
      log.warn("跳过外接 MCP：name 重复", { name: server.name });
      continue;
    }
    seen.add(server.name);

    const rowConfig: Record<string, unknown> = {
      serverName: server.name,
      transport: server.transport,
    };

    if (server.transport === "streamable-http") {
      if (!server.url) {
        log.warn("跳过外接 MCP：streamable-http 缺少 url", { name: server.name });
        continue;
      }
      rowConfig.url = expandEnv(server.url);
      const headers = expandRecord(server.headers);
      if (headers) rowConfig.headers = headers;
    } else if (server.transport === "stdio") {
      if (!server.command) {
        log.warn("跳过外接 MCP：stdio 缺少 command", { name: server.name });
        continue;
      }
      rowConfig.command = expandEnv(server.command);
      if (server.args?.length) rowConfig.args = server.args.map(expandEnv);
      const env = expandRecord(server.env);
      if (env) rowConfig.env = env;
      if (server.cwd) rowConfig.cwd = expandEnv(server.cwd);
    } else {
      log.warn("跳过外接 MCP：未知 transport", {
        name: server.name,
        transport: server.transport,
      });
      continue;
    }

    if (server.toolCallTimeoutMs && server.toolCallTimeoutMs > 0) {
      rowConfig.toolCallTimeoutMs = server.toolCallTimeoutMs;
    }
    if (server.failOnStartupError !== undefined) {
      rowConfig.failOnStartupError = server.failOnStartupError;
    }

    rows.push({
      id: `mcp-${server.name}`,
      name: "@deepseek-ai/dsh-mcp-client",
      config: rowConfig,
    });
  }

  if (rows.length === 0) return undefined;

  // JSON 是合法 YAML；dsh 的 patch 解析器直接按 YAML 读取
  const patch = [{ insert: rows }];
  const outFile = path.join(config.dshHome, "runtime", "mcp.patch.json");
  try {
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(patch, null, 2), "utf8");
  } catch (error) {
    log.error("写入外接 MCP patch 失败", { error: errorMessage(error) });
    return undefined;
  }

  log.info("external mcp configured", { servers: rows.map((row) => row.id) });
  return outFile;
}
