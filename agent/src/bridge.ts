import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { randomBytes } from "node:crypto";
import { AttachmentError, attachments } from "./attachments.ts";
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

interface ResolvedUpload {
  args: Record<string, unknown>;
  /** 成功后要清掉的暂存附件 id */
  stagedId?: string;
}

/**
 * oss_upload 的参数分流：文件字节由宿主从暂存目录读，模型只传 attachmentId。
 * 内联 base64 只保留给极小内容，超过上限直接拒绝——截断会损坏文件，
 * 而放行会让几十万 token 的文件内容永久留在模型上下文里。
 */
export async function resolveUploadArgs(
  usrId: string | undefined,
  args: Record<string, unknown>,
): Promise<ResolvedUpload> {
  const attachmentId = typeof args.attachmentId === "string" ? args.attachmentId.trim() : "";

  if (attachmentId) {
    if (!usrId) throw new AttachmentError("会话未绑定用户", "TOKEN_MISSING", 409);
    const staged = await attachments.read(usrId, attachmentId);
    if (!staged) {
      throw new AttachmentError(
        "附件不存在或已过期，请让前端重新上传后再试",
        "ATTACHMENT_NOT_FOUND",
        404,
      );
    }
    const { attachmentId: _ignored, ...rest } = args;
    return {
      args: {
        ...rest,
        filename:
          typeof args.filename === "string" && args.filename.trim()
            ? args.filename
            : staged.meta.filename,
        contentType:
          typeof args.contentType === "string" && args.contentType.trim()
            ? args.contentType
            : staged.meta.contentType,
        contentBase64: staged.data.toString("base64"),
      },
      stagedId: attachmentId,
    };
  }

  const inline = typeof args.contentBase64 === "string" ? args.contentBase64 : "";
  if (!inline.trim()) {
    throw new AttachmentError(
      "缺少文件内容：请先把文件上传为附件，再用 attachmentId 调用；不要把文件转成 base64 内联",
      "BAD_REQUEST",
      400,
    );
  }
  if (inline.length > config.inlineBase64MaxChars) {
    const kb = Math.round((config.inlineBase64MaxChars * 3) / 4 / 1024);
    throw new AttachmentError(
      `contentBase64 超过 ${config.inlineBase64MaxChars} 字符上限（约 ${kb}KB 文件）。` +
        "请先 POST 到 /agent/api/attachments 拿到 attachmentId，再用 attachmentId 调用。",
      "INLINE_BASE64_TOO_LARGE",
      413,
    );
  }
  return { args };
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

    const usrId = store.usrIdFor(sessionId);

    try {
      let callArgs = args;
      let stagedId: string | undefined;
      if (tool === "oss_upload") {
        const resolved = await resolveUploadArgs(usrId, args);
        callArgs = resolved.args;
        stagedId = resolved.stagedId;
      }

      if (tool === "graphql_execute" && config.readonly) {
        const query = typeof callArgs.query === "string" ? callArgs.query : "";
        assertReadonlyQuery(query);
      }

      const result = await mcpPool.call(token, tool, callArgs, { retryable: isRetryable(tool) });
      if (stagedId) await attachments.remove(stagedId);
      return c.json({ ok: true, result });
    } catch (error) {
      if (error instanceof AttachmentError) {
        return c.json({ ok: false, error: error.message, code: error.code }, error.status as 400);
      }
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
