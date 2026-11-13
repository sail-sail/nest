import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { hashToken } from "./auth.ts";
import { config } from "./config.ts";
import { errorMessage, log } from "./logger.ts";
import { sanitizeToken } from "./sanitize.ts";

interface PoolEntry {
  client: Client;
  transport: StreamableHTTPClientTransport;
  lastUsed: number;
}

interface McpContentBlock {
  type?: string;
  text?: string;
}

interface McpCallResult {
  content?: McpContentBlock[];
  structuredContent?: unknown;
  isError?: boolean;
}

export class McpToolError extends Error {
  readonly code: string;

  constructor(message: string, code = "MCP_TOOL_ERROR") {
    super(message);
    this.name = "McpToolError";
    this.code = code;
  }
}

function textOf(result: McpCallResult): string {
  const blocks = result.content ?? [];
  const texts = blocks
    .filter((block) => block?.type === "text" && typeof block.text === "string")
    .map((block) => block.text as string);
  return texts.join("\n").trim();
}

function canonical(result: McpCallResult): unknown {
  if (result.structuredContent !== undefined) return result.structuredContent;
  const text = textOf(result);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * 按 token 复用 MCP 连接。key 只存 hash，token 本身留在内存里供请求头使用。
 */
export class McpPool {
  private readonly entries = new Map<string, PoolEntry>();
  /** 相同 token 的首次并发调用共享一次连接创建，避免覆盖后泄漏未纳管的连接 */
  private readonly creations = new Map<string, Promise<PoolEntry>>();
  private readonly sweeper: NodeJS.Timeout;

  constructor(private readonly url: string) {
    this.sweeper = setInterval(() => void this.sweep(), 60_000);
    this.sweeper.unref();
  }

  private async create(token: string): Promise<PoolEntry> {
    const transport = new StreamableHTTPClientTransport(new URL(this.url), {
      requestInit: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });
    const client = new Client({ name: "app-agent", version: "0.0.0" });
    await client.connect(transport);
    return { client, transport, lastUsed: Date.now() };
  }

  private async entryFor(token: string): Promise<{ key: string; entry: PoolEntry }> {
    const key = hashToken(token);
    const existing = this.entries.get(key);
    if (existing) {
      existing.lastUsed = Date.now();
      return { key, entry: existing };
    }

    const pending = this.creations.get(key);
    if (pending) {
      const entry = await pending;
      entry.lastUsed = Date.now();
      return { key, entry };
    }

    const creating = this.create(token);
    this.creations.set(key, creating);
    try {
      const entry = await creating;
      this.entries.set(key, entry);
      return { key, entry };
    } finally {
      if (this.creations.get(key) === creating) this.creations.delete(key);
    }
  }

  /**
   * 释放连接。传入 expected 时做身份校验：并发重试期间该 key 可能已被
   * 另一次调用重建为新连接，此时不能把别人的新连接关掉。
   */
  private async dispose(key: string, expected?: PoolEntry): Promise<void> {
    const entry = this.entries.get(key);
    if (!entry) return;
    if (expected && entry !== expected) return;
    this.entries.delete(key);
    try {
      await entry.transport.close();
    } catch {
      // ignore
    }
  }

  private async sweep(): Promise<void> {
    const deadline = Date.now() - 4 * 60_000;
    const stale = [...this.entries.entries()].filter(([, entry]) => entry.lastUsed < deadline);
    await Promise.all(stale.map(([key, entry]) => this.dispose(key, entry)));
  }

  async call(
    token: string,
    name: string,
    args: Record<string, unknown>,
    options: { retryable: boolean },
  ): Promise<unknown> {
    let { key, entry } = await this.entryFor(token);

    const invoke = async (): Promise<unknown> => {
      const result = (await entry.client.callTool(
        { name, arguments: args },
        undefined,
        { timeout: 180_000 },
      )) as McpCallResult;
      if (result.isError) {
        throw new McpToolError(textOf(result) || `${name} 执行失败`);
      }
      return canonical(result);
    };

    try {
      return await invoke();
    } catch (error) {
      if (error instanceof McpToolError) throw error;
      if (!options.retryable) throw error;
      log.warn("mcp call failed, retrying with a fresh session", {
        tool: name,
        error: sanitizeToken(errorMessage(error), token),
      });
      await this.dispose(key, entry);
      ({ key, entry } = await this.entryFor(token));
      return invoke();
    }
  }

  async closeAll(): Promise<void> {
    clearInterval(this.sweeper);
    // 关闭前等待已在创建的连接登记进池，避免关闭完成后又遗留新连接
    await Promise.allSettled([...this.creations.values()]);
    await Promise.all([...this.entries.keys()].map((key) => this.dispose(key)));
  }
}

export const mcpPool = new McpPool(config.mcpUrl);
