import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { AuthError, decodeClaims, extractBearer } from "./auth.ts";
import { startBridge } from "./bridge.ts";
import { config } from "./config.ts";
import { closeHarness, initHarness, runTurn } from "./harness.ts";
import { llmProxy } from "./llm-proxy.ts";
import { errorMessage, log } from "./logger.ts";
import { memory } from "./memory.ts";
import { mcpPool } from "./mcp-pool.ts";
import { pageHub } from "./page-hub.ts";
import { store } from "./store.ts";
import { mapNotification, type SseFrame } from "./stream.ts";
import { sanitizeToken } from "./sanitize.ts";
import { appendTranscript, clearTranscript, readTranscript } from "./transcript.ts";

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

function allowedOrigins(): Set<string> {
  const origins = new Set<string>([config.publicOrigin]);
  origins.add("http://localhost:4000");
  origins.add("http://127.0.0.1:4000");
  return origins;
}

const origins = allowedOrigins();
const app = new Hono<{ Variables: Variables }>();

app.use("/agent/api/*", async (c, next) => {
  if (c.req.path === "/agent/api/health") return next();

  const origin = c.req.header("origin");
  if (origin && !origins.has(origin)) {
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

app.get("/agent/api/health", (c) =>
  c.json({ ok: true, model: config.model, readonly: config.readonly }),
);

// 浏览器里的 PageAgent 模型请求走宿主代理，key 不下发到前端
app.route("/agent/llm", llmProxy);

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

    const heartbeat = setInterval(() => {
      if (closed) return;
      void stream.writeSSE({ event: "ping", data: "{}" }).catch(() => undefined);
    }, 15_000);

    const cleanup = () => {
      if (closed) return;
      closed = true;
      clearInterval(heartbeat);
      pageHub.detach(channel);
      resolveClosed?.();
    };

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

app.get("/agent/api/conversations/:id/messages", (c) => {
  const record = store.get(c.req.param("id"), c.get("usrId"));
  if (!record) return c.json({ error: "not found" }, 404);
  return c.json({ messages: readTranscript(record.id) });
});

app.delete("/agent/api/conversations/:id", (c) => {
  const record = store.get(c.req.param("id"), c.get("usrId"));
  if (!record) return c.json({ error: "not found" }, 404);
  clearTranscript(record.id);
  store.remove(record.id, c.get("usrId"));
  return c.json({ ok: true });
});

app.post("/agent/api/conversations/:id/messages", async (c) => {
  const record = store.get(c.req.param("id"), c.get("usrId"));
  if (!record) return c.json({ error: "not found" }, 404);

  const body = (await c.req.json().catch(() => ({}))) as { text?: unknown };
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) return c.json({ error: "text 不能为空" }, 400);
  if (text.length > 20_000) return c.json({ error: "text 过长" }, 413);

  const token = c.get("token");
  store.bindToken(record, token);
  store.touch(record, text);
  appendTranscript(record.id, { role: "user", text });

  // 第一轮把长期记忆注入模型上下文；前端与转录仍只保留用户原文
  const firstTurn = readTranscript(record.id).length === 1;
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

    const heartbeat = setInterval(() => {
      if (!aborted) queue.push({ event: "ping", data: {} });
    }, 15_000);
    heartbeat.unref?.();

    queue.push({ event: "ready", data: { conversationId: record.id } });

    const runPromise = runTurn(record, promptText, (notification) => {
      const frame = mapNotification(notification, record.dshSessionId);
      if (!frame) return;
      // 前端断开后仍要把结果写进转录，保证下次打开能看到完整回答
      if (!aborted) queue.push(frame);

      if (frame.event === "assistant") {
        appendTranscript(record.id, {
          role: "assistant",
          text: typeof frame.data.text === "string" ? frame.data.text : "",
          reasoning: typeof frame.data.reasoning === "string" ? frame.data.reasoning : undefined,
        });
      } else if (frame.event === "tool_call") {
        appendTranscript(record.id, {
          role: "tool_call",
          name: typeof frame.data.name === "string" ? frame.data.name : "unknown",
          callId: typeof frame.data.callId === "string" ? frame.data.callId : undefined,
          args: frame.data.arguments,
        });
      } else if (frame.event === "tool_result") {
        appendTranscript(record.id, {
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
      })
      .catch((error: unknown) => {
        failure = sanitizeToken(errorMessage(error), token);
        log.error("agent turn failed", { conversationId: record.id, error: failure });
      })
      .finally(() => {
        clearInterval(heartbeat);
        queue.close();
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
    }
  });
});

async function main(): Promise<void> {
  store.load();
  memory.load();
  const bridge = await startBridge();
  initHarness(bridge);

  serve(
    { fetch: app.fetch, hostname: config.host, port: config.port },
    (info) => {
      log.info("agent listening", {
        url: `http://${config.host}:${info.port}/agent`,
        mcp: config.mcpUrl,
        model: config.model,
        readonly: config.readonly,
      });
    },
  );

  const shutdown = async (signal: string) => {
    log.info("shutting down", { signal });
    await closeHarness();
    await bridge.close();
    await mcpPool.closeAll();
    store.save();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((error) => {
  log.error("agent failed to start", { error: errorMessage(error) });
  process.exit(1);
});
