import { serve } from "@hono/node-server";
import { deriveTurnTokenUsage } from "@deepseek-ai/dsh-token-meter/client";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { AttachmentError, attachments, stripAttachmentHints } from "./attachments.ts";
import { AuthError, decodeClaims, extractBearer } from "./auth.ts";
import { startBridge } from "./bridge.ts";
import { config, isAllowedOrigin } from "./config.ts";
import { closeHarness, initHarness, runTurn } from "./harness.ts";
import { llmProxy } from "./llm-proxy.ts";
import { resolveModelRoute } from "./llm-config.ts";
import { errorMessage, log } from "./logger.ts";
import { memory } from "./memory.ts";
import { mcpPool } from "./mcp-pool.ts";
import { pageHub } from "./page-hub.ts";
import { store } from "./store.ts";
import { mapNotification, type SseFrame } from "./stream.ts";
import { sanitizeToken } from "./sanitize.ts";
import {
  appendTranscript,
  clearTranscript,
  readTranscript,
  waitForTranscripts,
} from "./transcript.ts";
import { usage } from "./usage.ts";

type Variables = {
  token: string;
  usrId: string;
};

class FrameQueue implements AsyncIterable<SseFrame> {
  private readonly items: SseFrame[] = [];
  private waiter: (() => void) | undefined;
  private closed = false;

  push(item: SseFrame): void {
    if (this.closed) return;
    this.items.push(item);
    this.waiter?.();
    this.waiter = undefined;
  }

  close(): void {
    this.closed = true;
    this.waiter?.();
    this.waiter = undefined;
  }

  async *[Symbol.asyncIterator](): AsyncIterator<SseFrame> {
    for (;;) {
      if (this.items.length > 0) {
        yield this.items.shift() as SseFrame;
        continue;
      }
      if (this.closed) return;
      await new Promise<void>((resolve) => {
        this.waiter = resolve;
      });
    }
  }
}

const app = new Hono<{ Variables: Variables }>();

app.use("/agent/api/*", async (c, next) => {
  if (c.req.path === "/agent/api/health") return next();

  if (!isAllowedOrigin(c.req.header("origin"))) {
    return c.json({ error: "origin not allowed" }, 403);
  }

  const token = extractBearer(c.req.header("authorization"));
  if (!token) return c.json({ error: "unauthorized" }, 401);

  try {
    const claims = decodeClaims(token);
    c.set("token", token);
    c.set("usrId", claims.id);
  } catch (error) {
    if (error instanceof AuthError) return c.json({ error: error.message }, 401);
    throw error;
  }

  await next();
});

app.get("/agent/api/health", (c) => {
  const sessions = store.sessionStats();
  try {
    const route = resolveModelRoute();
    return c.json({
      ok: true,
      provider: route.provider,
      model: route.model,
      readonly: config.readonly,
      sessions,
    });
  } catch (error) {
    return c.json({
      ok: true,
      provider: "none",
      model: "",
      readonly: config.readonly,
      sessions,
      warning: errorMessage(error),
    });
  }
});

/** 当前用户的用量：按天聚合的轮次、token、工具调用与耗时 */
app.get("/agent/api/usage", (c) => {
  const days = Number(c.req.query("days") ?? 7);
  return c.json({ days: usage.summary(c.get("usrId"), Number.isFinite(days) ? days : 7) });
});

// 浏览器里的 PageAgent 模型请求走宿主代理，key 不下发到前端
app.route("/agent/llm", llmProxy);

/**
 * 附件暂存：浏览器把文件直传宿主，返回 attachmentId。
 * 模型只引用 id，文件字节不进模型上下文，也不进转录。
 */
app.post("/agent/api/attachments", async (c) => {
  if (!config.attachmentEnabled) {
    return c.json({ error: "附件功能已关闭（AGENT_ATTACHMENT=false）" }, 403);
  }

  const usrId = c.get("usrId");
  const declared = Number(c.req.header("content-length"));
  if (Number.isFinite(declared) && declared > config.attachmentMaxBytes) {
    const bytes = config.attachmentMaxBytes;
    const limit =
      bytes >= 1024 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(1)}MB`
        : `${Math.round(bytes / 1024)}KB`;
    return c.json({ error: `附件超过上限 ${limit}`, code: "ATTACHMENT_TOO_LARGE" }, 413);
  }

  try {
    const staged = await attachments.put(usrId, {
      filename: c.req.query("name") || c.req.header("x-filename") || "attachment.bin",
      contentType: c.req.header("content-type"),
      body: c.req.raw.body,
    });
    return c.json({
      ok: true,
      attachment: staged,
      hint: `在用户消息里带上 [附件 ${staged.id} ${staged.filename}]，模型即可据此调用 oss_upload`,
    });
  } catch (error) {
    if (error instanceof AttachmentError) {
      return c.json({ error: error.message, code: error.code }, error.status as 400);
    }
    log.warn("attachment upload failed", { usrId, error: errorMessage(error) });
    return c.json({ error: "附件上传失败" }, 500);
  }
});

/**
 * 页面操作通道：浏览器保持一条 SSE，宿主把任务帧推下去，执行完由浏览器 POST 回来。
 * 用 SSE + POST 而不是 WebSocket，是为了沿用同一套 Bearer 鉴权，避免 token 进 query。
 */
app.get("/agent/api/page-agent/stream", (c) => {
  const usrId = c.get("usrId");

  return streamSSE(c, async (stream) => {
    let closed = false;
    let resolveClosed: (() => void) | undefined;
    const closedPromise = new Promise<void>((resolve) => {
      resolveClosed = resolve;
    });

    const channel = pageHub.attach(usrId, (event, data) => {
      if (closed) return;
      void stream
        .writeSSE({ event, data: JSON.stringify(data) })
        .catch(() => undefined);
    });

    const heartbeat = config.heartbeatEnabled
      ? setInterval(() => {
          if (closed) return;
          void stream.writeSSE({ event: "ping", data: "{}" }).catch(() => undefined);
        }, 15_000)
      : undefined;

    const cleanup = () => {
      if (closed) return;
      closed = true;
      clearInterval(heartbeat);
      pageHub.detach(channel);
      resolveClosed?.();
    };

    heartbeat?.unref?.();

    stream.onAbort(cleanup);
    c.req.raw.signal.addEventListener("abort", cleanup, { once: true });

    await stream.writeSSE({
      event: "ready",
      data: JSON.stringify({
        usrId,
        channelId: channel.id,
        timeoutMs: config.pageTimeoutMs,
      }),
    });

    await closedPromise;
  });
});

app.get("/agent/api/page-agent/status", (c) => c.json(pageHub.status(c.get("usrId"))));

app.post("/agent/api/page-agent/tasks/:id/result", async (c) => {
  const usrId = c.get("usrId");
  const taskId = c.req.param("id");
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;

  const data = typeof body.data === "string" ? body.data : "";
  const path = typeof body.path === "string" ? body.path : "";
  const result = {
    success: body.success === true,
    data: data.length > 8_000 ? `${data.slice(0, 8_000)}\n...（结果过长，已截断）` : data,
    steps: typeof body.steps === "number" ? body.steps : undefined,
    path: path || undefined,
  };

  const accepted = pageHub.complete(usrId, taskId, result);
  log.info("page task result", {
    usrId,
    taskId,
    accepted,
    success: result.success,
    steps: result.steps ?? 0,
  });
  return c.json({ ok: accepted });
});

app.post("/agent/api/page-agent/heartbeat", async (c) => {
  const usrId = c.get("usrId");
  const body = (await c.req.json().catch(() => ({}))) as {
    path?: unknown;
    channelId?: unknown;
    visible?: unknown;
    focused?: unknown;
  };
  pageHub.touch(
    usrId,
    typeof body.channelId === "string" ? body.channelId : "",
    typeof body.path === "string" ? body.path : "",
    typeof body.visible === "boolean" ? body.visible : undefined,
    typeof body.focused === "boolean" ? body.focused : undefined,
  );
  return c.json({ ok: true, ...pageHub.status(usrId) });
});

app.get("/agent/api/conversations", (c) => {
  const list = store.list(c.get("usrId"));
  return c.json({ conversations: list });
});

app.post("/agent/api/conversations", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as { title?: unknown };
  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : "新会话";
  const record = store.create(c.get("usrId"), title);
  return c.json({
    conversation: {
      id: record.id,
      title: record.title,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    },
  });
});

app.get("/agent/api/conversations/:id", (c) => {
  const record = store.get(c.req.param("id"), c.get("usrId"));
  if (!record) return c.json({ error: "not found" }, 404);
  return c.json({
    conversation: {
      id: record.id,
      title: record.title,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    },
  });
});

app.get("/agent/api/conversations/:id/messages", async (c) => {
  const record = store.get(c.req.param("id"), c.get("usrId"));
  if (!record) return c.json({ error: "not found" }, 404);
  return c.json({ messages: await readTranscript(record.id) });
});

app.delete("/agent/api/conversations/:id", async (c) => {
  const record = store.get(c.req.param("id"), c.get("usrId"));
  if (!record) return c.json({ error: "not found" }, 404);

  // 删除也持有会话独占锁：生成中拒绝删除，删除期间新消息也无法进入
  if (!store.tryMarkBusy(record.id)) {
    return c.json(
      { error: "当前会话正在生成或删除，请稍候", code: "CONVERSATION_BUSY" },
      409,
    );
  }

  try {
    await clearTranscript(record.id);
    store.remove(record.id, c.get("usrId"));
    return c.json({ ok: true });
  } catch (error) {
    store.clearBusy(record.id);
    log.warn("conversation delete failed", {
      conversationId: record.id,
      error: errorMessage(error),
    });
    return c.json({ error: "会话删除失败" }, 500);
  }
});

app.post("/agent/api/conversations/:id/messages", async (c) => {
  const record = store.get(c.req.param("id"), c.get("usrId"));
  if (!record) return c.json({ error: "not found" }, 404);

  const body = (await c.req.json().catch(() => ({}))) as { text?: unknown };
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) return c.json({ error: "text 不能为空" }, 400);
  if (text.length > 20_000) return c.json({ error: "text 过长" }, 413);

  // 生成与删除共用会话独占锁；「断开」只关 SSE，上一轮仍占用会话到结束
  if (!store.tryMarkBusy(record.id)) {
    return c.json(
      { error: "当前会话正在生成或删除，请稍候再发", code: "CONVERSATION_BUSY" },
      409,
    );
  }
  const startedAt = Date.now();

  const token = c.get("token");
  store.bindToken(record, token);
  // 标题只用真实文本，不把 [附件 att_xxx ...] 引用带进会话列表
  store.touch(record, stripAttachmentHints(text) || "附件消息");
  const messageCount = await appendTranscript(record.id, { role: "user", text });

  // 第一轮把长期记忆注入模型上下文；前端与转录仍只保留用户原文
  const firstTurn = messageCount === 1;
  const digest =
    firstTurn && config.memoryEnabled ? memory.digest(record.usrId, config.memoryDigestLimit) : "";
  const promptText = digest ? `${digest}\n\n${text}` : text;

  c.header("Cache-Control", "no-cache, no-transform");
  c.header("X-Accel-Buffering", "no");

  return streamSSE(c, async (stream) => {
    const queue = new FrameQueue();
    let aborted = false;
    let failure: string | undefined;
    let finalResponse = "";
    let runSessionId = record.dshSessionId;

    stream.onAbort(() => {
      aborted = true;
      queue.close();
    });

    const heartbeat = config.heartbeatEnabled
      ? setInterval(() => {
          if (!aborted) queue.push({ event: "ping", data: {} });
        }, 15_000)
      : undefined;
    heartbeat?.unref?.();

    queue.push({ event: "ready", data: { conversationId: record.id } });

    let toolCalls = 0;
    let turnUsage: ReturnType<typeof deriveTurnTokenUsage>;

    const runPromise = runTurn(record, promptText, (notification) => {
      const frame = mapNotification(notification, record.dshSessionId);
      if (!frame) return;
      if (frame.event === "tool_call") toolCalls += 1;
      // 前端断开后仍要把结果写进转录，保证下次打开能看到完整回答
      if (!aborted) queue.push(frame);

      if (frame.event === "assistant") {
        void appendTranscript(record.id, {
          role: "assistant",
          text: typeof frame.data.text === "string" ? frame.data.text : "",
          reasoning: typeof frame.data.reasoning === "string" ? frame.data.reasoning : undefined,
        });
      } else if (frame.event === "tool_call") {
        void appendTranscript(record.id, {
          role: "tool_call",
          name: typeof frame.data.name === "string" ? frame.data.name : "unknown",
          callId: typeof frame.data.callId === "string" ? frame.data.callId : undefined,
          args: frame.data.arguments,
        });
      } else if (frame.event === "tool_result") {
        void appendTranscript(record.id, {
          role: "tool_result",
          callId: typeof frame.data.callId === "string" ? frame.data.callId : undefined,
          content: typeof frame.data.content === "string" ? frame.data.content : "",
          isError: frame.data.isError === true,
        });
      }
    })
      .then((result) => {
        finalResponse = result.finalResponse;
        runSessionId = result.sessionId;
        try {
          turnUsage = deriveTurnTokenUsage(result.events);
        } catch (error) {
          log.warn("derive turn usage failed", {
            conversationId: record.id,
            error: errorMessage(error),
          });
        }
      })
      .catch((error: unknown) => {
        failure = sanitizeToken(errorMessage(error), token);
        log.error("agent turn failed", { conversationId: record.id, error: failure });
      })
      .finally(async () => {
        // 轮次结束前排空该会话的异步转录，busy 锁释放后不会再有滞留写入
        await waitForTranscripts(record.id);
        clearInterval(heartbeat);
        queue.close();

        // 一轮一条账：没有精确用量时记 null，不用估算值冒充
        try {
          const route = resolveModelRoute();
          await usage.record({
            usrId: record.usrId,
            conversationId: record.id,
            sessionId: runSessionId,
            provider: route.provider,
            model: route.model,
            ms: Date.now() - startedAt,
            ok: !failure,
            aborted,
            toolCalls,
            tokens: turnUsage
              ? {
                  input: turnUsage.uncachedInputTokens,
                  output: turnUsage.outputTokens,
                  total: turnUsage.totalTokens,
                  cacheRead: turnUsage.cacheReadTokens,
                  cacheWrite: turnUsage.cacheWriteTokens,
                  reasoning: turnUsage.reasoningTokens,
                }
              : null,
          });
        } catch (error) {
          // 记账失败不能影响轮次结果
          log.warn("usage record failed", {
            conversationId: record.id,
            error: errorMessage(error),
          });
        }
      });

    try {
      for await (const frame of queue) {
        if (aborted) break;
        await stream.writeSSE({ event: frame.event, data: JSON.stringify(frame.data) });
      }
      await runPromise;
      if (!aborted) {
        if (failure) {
          await stream.writeSSE({
            event: "error",
            data: JSON.stringify({ message: failure }),
          });
        } else {
          await stream.writeSSE({
            event: "done",
            data: JSON.stringify({ sessionId: runSessionId, finalResponse }),
          });
        }
      }
    } catch (error) {
      log.warn("sse write failed", { error: errorMessage(error) });
    } finally {
      clearInterval(heartbeat);
      queue.close();
      await runPromise.catch(() => {});
      store.clearBusy(record.id);
      log.info("chat turn finished", {
        usrId: record.usrId,
        conversationId: record.id,
        textLength: text.length,
        ms: Date.now() - startedAt,
        ok: !failure,
        aborted,
      });
    }
  });
});

async function main(): Promise<void> {
  // 启动即校验模型配置：官方 DeepSeek 优先，其次自定义网关，都没有直接失败
  const route = resolveModelRoute();
  log.info("model route", {
    kind: route.kind,
    provider: route.provider,
    model: route.model,
    base: route.kind === "custom" ? route.baseUrl : undefined,
  });

  store.load();
  memory.load();
  usage.load();
  attachments.init();
  const bridge = await startBridge();
  initHarness(bridge);

  serve(
    { fetch: app.fetch, hostname: config.host, port: config.port },
    (info) => {
      log.info("agent listening", {
        url: `http://${config.host}:${info.port}/agent`,
        mcp: config.mcpUrl,
        provider: route.provider,
        model: route.model,
        readonly: config.readonly,
      });
    },
  );

  const shutdown = async (signal: string) => {
    log.info("shutting down", { signal });
    await closeHarness();
    await waitForTranscripts();
    await usage.flush();
    await memory.flush();
    await bridge.close();
    await mcpPool.closeAll();
    attachments.close();
    await store.save();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((error) => {
  log.error("agent failed to start", { error: errorMessage(error) });
  process.exit(1);
});
