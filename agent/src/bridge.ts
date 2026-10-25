import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { randomBytes } from "node:crypto";
import { AttachmentError, attachments } from "./attachments.ts";
import { hashToken } from "./auth.ts";
import { TOOL_NAMES, config, type ToolName } from "./config.ts";
import { errorMessage, log } from "./logger.ts";
import { McpToolError, mcpPool } from "./mcp-pool.ts";
import { MemoryRejected, memory } from "./memory.ts";
import { PageBusyError, PageOfflineError, pageHub } from "./page-hub.ts";
import { ReadonlyViolation, assertReadonlyQuery } from "./readonly.ts";
import { sandbox, SandboxError } from "./sandbox.ts";
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

/** 代码执行沙箱：不经 Rust /mcp，由宿主按 (用户, 会话) 起受限子进程 */
const SANDBOX_TOOLS = ["exec_node"] as const;

type SandboxToolName = (typeof SANDBOX_TOOLS)[number];

function isSandboxTool(value: unknown): value is SandboxToolName {
  return typeof value === "string" && (SANDBOX_TOOLS as readonly string[]).includes(value);
}

/**
 * exec_node 不经 Rust，等于绕开了 MCP 那条链路上的 token 校验；
 * 而它的能力比任何业务工具都大（本地代码执行 + 落盘）。
 * 所以每次执行前都要拿同一个 token 调一次 session_me：既让 Rust 验签，
 * 也把返回的 usr_id 与目录归属比对一次——光验签只能证明"token 有效"，
 * 证明不了"这个 token 就是这条会话的人"。
 * 结果按 token 缓存 TTL，省掉同一会话里的重复往返。
 */
const sandboxVerified = new Map<string, { at: number; usrId: string }>();

/** MCP 返回的 loginInfo 形如 { usr_id, lbl, username, role_codes, tenant_id, ... } */
function loginUsrId(result: unknown): string | undefined {
  const loginInfo = (result as { loginInfo?: { usr_id?: unknown } } | null)?.loginInfo;
  const value = loginInfo?.usr_id;
  return typeof value === "string" && value ? value : undefined;
}

async function assertSandboxAuthorized(token: string, usrId: string): Promise<void> {
  const key = hashToken(token);
  const now = Date.now();
  const cached = sandboxVerified.get(key);
  // 缓存必须同时命中会话归属：同一个 token 换了 usrId 也要重新比对
  if (cached && cached.usrId === usrId && now - cached.at < config.sandboxVerifyTtlMs) return;

  let result: unknown;
  try {
    result = await mcpPool.call(token, "session_me", {}, { retryable: true });
  } catch (error) {
    // 失败不缓存：连不上 Rust 时不能退化成"放行"，也不能退化成永久拒绝
    throw new SandboxError(
      `代码执行需要有效登录态，校验未通过：${errorMessage(error)}`,
      "SANDBOX_TOKEN_INVALID",
      401,
    );
  }

  const actual = loginUsrId(result);
  if (!actual) {
    throw new SandboxError(
      "登录校验没有返回 usr_id，无法确认会话归属，已拒绝执行",
      "SANDBOX_VERIFY_BAD_RESPONSE",
      502,
    );
  }
  if (actual !== usrId) {
    log.warn("sandbox identity mismatch", {
      expected: usrId.slice(0, 6),
      actual: actual.slice(0, 6),
    });
    throw new SandboxError(
      "登录身份与当前会话归属不一致，已拒绝执行",
      "SANDBOX_IDENTITY_MISMATCH",
      403,
    );
  }

  sandboxVerified.set(key, { at: now, usrId });
  if (sandboxVerified.size > 512) {
    for (const [cachedKey, entry] of sandboxVerified) {
      if (now - entry.at >= config.sandboxVerifyTtlMs) sandboxVerified.delete(cachedKey);
    }
  }
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

    if (isSandboxTool(tool)) {
      if (!config.sandboxEnabled) {
        return c.json(
          { ok: false, error: "代码执行已关闭（AGENT_SANDBOX=false）", code: "SANDBOX_DISABLED" },
          403,
        );
      }

      // 目录按 (usrId, conversationId) 分桶，所以两条身份都必须拿到
      const record = store.recordFor(sessionId);
      if (!record) {
        return c.json({ ok: false, error: "会话未绑定用户", code: "TOKEN_MISSING" }, 409);
      }

      const code = typeof args.code === "string" ? args.code : "";
      if (!code.trim()) {
        return c.json({ ok: false, error: "code 不能为空", code: "BAD_REQUEST" }, 400);
      }

      const token = store.tokenFor(sessionId);
      if (!token) {
        return c.json(
          { ok: false, error: "会话未绑定登录态，请刷新后重试", code: "TOKEN_MISSING" },
          409,
        );
      }

      try {
        // 先验签 + 比对归属再建目录：校验不过就什么都不落地
        await assertSandboxAuthorized(token, record.usrId);
        const result = await sandbox.run({
          usrId: record.usrId,
          conversationId: record.id,
          code,
          timeoutMs: typeof args.timeoutMs === "number" ? args.timeoutMs : undefined,
        });
        return c.json({ ok: true, result });
      } catch (error) {
        if (error instanceof SandboxError) {
          return c.json({ ok: false, error: error.message, code: error.code }, error.status as 400);
        }
        const message = errorMessage(error);
        log.error("sandbox tool failed", { error: message });
        return c.json({ ok: false, error: message, code: "SANDBOX_FAILED" });
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
