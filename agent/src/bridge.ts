import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { randomBytes } from "node:crypto";
import { TOOL_NAMES, config, type ToolName } from "./config.ts";
import { errorMessage, log } from "./logger.ts";
import { McpToolError, mcpPool } from "./mcp-pool.ts";
import { MemoryRejected, memory } from "./memory.ts";
import { PageBusyError, PageOfflineError, pageHub } from "./page-hub.ts";
import { ReadonlyViolation, assertReadonlyQuery } from "./readonly.ts";
import { sanitizeToken } from "./sanitize.ts";
import { store } from "./store.ts";

export interface BridgeHandle {
  url: string;
  secret: string;
  close: () => Promise<void>;
}

interface BridgeBody {
  sessionId?: unknown;
  tool?: unknown;
  args?: unknown;
}

function isToolName(value: unknown): value is ToolName {
  return typeof value === "string" && (TOOL_NAMES as readonly string[]).includes(value);
}

/** 页面操作工具：不经 Rust /mcp，而是转发给浏览器里的 PageAgent */
const PAGE_TOOLS = ["page_operate", "page_status"] as const;

type PageToolName = (typeof PAGE_TOOLS)[number];

function isPageTool(value: unknown): value is PageToolName {
  return typeof value === "string" && (PAGE_TOOLS as readonly string[]).includes(value);
}

/** 跨会话记忆工具：按用户隔离，存在宿主进程里 */
const MEMORY_TOOLS = ["memory_save", "memory_search", "memory_list", "memory_forget"] as const;

type MemoryToolName = (typeof MEMORY_TOOLS)[number];

function isMemoryTool(value: unknown): value is MemoryToolName {
  return typeof value === "string" && (MEMORY_TOOLS as readonly string[]).includes(value);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

/**
 * 写操作不重试：网络抖动时重发可能造成重复上传 / 重复写入。
 * 只读模式下 graphql_execute 已被 AST 闸门拦住 mutation，全部可安全重试。
 */
function isRetryable(tool: ToolName): boolean {
  if (config.readonly) return true;
  return tool !== "graphql_execute" && tool !== "oss_upload";
}

export async function startBridge(): Promise<BridgeHandle> {
  const secret = randomBytes(32).toString("hex");
  const app = new Hono();

  app.post("/call", async (c) => {
    if (c.req.header("x-bridge-secret") !== secret) {
      return c.json({ ok: false, error: "unauthorized", code: "BRIDGE_UNAUTHORIZED" }, 401);
    }

    const body = (await c.req.json().catch(() => ({}))) as BridgeBody;
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
    const tool = body.tool;
    const args = asRecord(body.args);

    if (!sessionId) {
      return c.json({ ok: false, error: "缺少 sessionId", code: "BAD_REQUEST" }, 400);
    }

    if (isMemoryTool(tool)) {
      if (!config.memoryEnabled) {
        return c.json({ ok: false, error: "记忆功能已关闭（AGENT_MEMORY=false）", code: "MEMORY_DISABLED" }, 403);
      }

      const usrId = store.usrIdFor(sessionId);
      if (!usrId) {
        return c.json({ ok: false, error: "会话未绑定用户", code: "TOKEN_MISSING" }, 409);
      }

      try {
        if (tool === "memory_save") {
          const text = typeof args.text === "string" ? args.text : "";
          const tags = Array.isArray(args.tags) ? args.tags.map(String) : [];
          const item = memory.save(usrId, { text, tags, source: "assistant" });
          return c.json({ ok: true, result: item });
        }

        if (tool === "memory_search") {
          const query = typeof args.query === "string" ? args.query : "";
          const limit = typeof args.limit === "number" ? args.limit : 10;
          return c.json({ ok: true, result: { items: memory.search(usrId, query, limit) } });
        }

        if (tool === "memory_list") {
          const limit = typeof args.limit === "number" ? args.limit : 50;
          return c.json({ ok: true, result: { items: memory.list(usrId, limit) } });
        }

        const removed = memory.forget(usrId, {
          id: typeof args.id === "string" ? args.id : undefined,
          query: typeof args.query === "string" ? args.query : undefined,
        });
        return c.json({ ok: true, result: { removed } });
      } catch (error) {
        if (error instanceof MemoryRejected) {
          return c.json({ ok: false, error: error.message, code: "MEMORY_REJECTED" }, 400);
        }
        log.warn("memory tool failed", { tool, error: errorMessage(error) });
        return c.json({ ok: false, error: errorMessage(error), code: "MEMORY_FAILED" });
      }
    }

    if (isPageTool(tool)) {
      if (!config.pageEnabled) {
        return c.json({ ok: false, error: "页面操作已关闭（AGENT_PAGE_OPERATE=false）", code: "PAGE_DISABLED" }, 403);
      }

      const usrId = store.usrIdFor(sessionId);
      if (!usrId) {
        return c.json({ ok: false, error: "会话未绑定用户", code: "TOKEN_MISSING" }, 409);
      }

      if (tool === "page_status") {
        return c.json({
          ok: true,
          result: { ...pageHub.status(usrId), timeoutMs: config.pageTimeoutMs },
        });
      }

      const instruction = typeof args.instruction === "string" ? args.instruction.trim() : "";
      if (!instruction) {
        return c.json({ ok: false, error: "instruction 不能为空", code: "BAD_REQUEST" }, 400);
      }

      try {
        const result = await pageHub.runTask(usrId, {
          instruction,
          maxSteps: typeof args.max_steps === "number" ? args.max_steps : undefined,
        });
        return c.json({ ok: true, result });
      } catch (error) {
        const message = errorMessage(error);
        if (error instanceof PageOfflineError) {
          return c.json({ ok: false, error: message, code: "PAGE_OFFLINE" }, 409);
        }
        if (error instanceof PageBusyError) {
          return c.json({ ok: false, error: message, code: "PAGE_BUSY" }, 409);
        }
        log.warn("page tool failed", { tool, error: message });
        return c.json({ ok: false, error: message, code: "PAGE_FAILED" });
      }
    }

    if (!isToolName(tool)) {
      return c.json({ ok: false, error: "未知工具", code: "UNKNOWN_TOOL" }, 400);
    }

    const token = store.tokenFor(sessionId);
    if (!token) {
      return c.json(
        { ok: false, error: "会话未绑定登录态，请刷新后重试", code: "TOKEN_MISSING" },
        409,
      );
    }

    try {
      if (tool === "graphql_execute" && config.readonly) {
        const query = typeof args.query === "string" ? args.query : "";
        assertReadonlyQuery(query);
      }

      const result = await mcpPool.call(token, tool, args, { retryable: isRetryable(tool) });
      return c.json({ ok: true, result });
    } catch (error) {
      if (error instanceof ReadonlyViolation) {
        return c.json({ ok: false, error: error.message, code: "READONLY" });
      }
      if (error instanceof McpToolError) {
        return c.json({
          ok: false,
          error: sanitizeToken(error.message, token),
          code: error.code,
        });
      }
      const message = sanitizeToken(errorMessage(error), token);
      log.error("bridge tool call failed", { tool, error: message });
      return c.json({ ok: false, error: message, code: "TOOL_FAILED" });
    }
  });

  app.get("/health", (c) => c.json({ ok: true }));

  const server = await new Promise<ReturnType<typeof serve>>((resolve, reject) => {
    const instance = serve(
      { fetch: app.fetch, hostname: "127.0.0.1", port: 0 },
      (info) => {
        log.info("bridge listening", { port: info.port });
        resolve(instance);
      },
    );
    instance.once("error", reject);
  });

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  const url = `http://127.0.0.1:${port}`;

  return {
    url,
    secret,
    close: async () => {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    },
  };
}
