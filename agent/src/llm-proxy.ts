import { Hono } from "hono";
import { AuthError, decodeClaims, extractBearer } from "./auth.ts";
import { config, isAllowedOrigin } from "./config.ts";
import { ModelConfigError, resolveModelRoute, type ModelRoute } from "./llm-config.ts";
import { errorMessage, log } from "./logger.ts";

/**
 * PageAgent 的模型代理。
 *
 * 浏览器里的 PageAgent 不持有 DEEPSEEK_API_KEY，它把 OpenAI 兼容请求发到这里，
 * 由宿主补上服务端 key 再转发。鉴权仍用当前登录用户的 JWT。
 *
 * 挂载点：/agent/llm，PageAgent 的 baseURL 配成 ${origin}/agent/llm/v1
 *
 * 防滥用：
 *   - 模型固定为宿主配置，避免被当成任意模型的出口
 *   - 单请求 max_tokens 封顶（AGENT_LLM_MAX_TOKENS）
 *   - 每用户每日 token 封顶（AGENT_LLM_DAILY_TOKENS），从响应 usage 记账
 *   - 客户端断开时同步取消上游请求，不再白烧 token
 */
export const llmProxy = new Hono();

interface TokenUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

interface DailyUsage {
  day: string;
  used: number;
  reserved: number;
}

/** 进程内按用户统计的每日用量；跨日自动重置，重启清零（软限制） */
const dailyUsage = new Map<string, DailyUsage>();

function today(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function usageOfToday(usrId: string): DailyUsage {
  const day = today();
  const existing = dailyUsage.get(usrId);
  if (existing && existing.day === day) return existing;
  const reset: DailyUsage = { day, used: 0, reserved: 0 };
  dailyUsage.set(usrId, reset);
  return reset;
}

function usedToday(usrId: string): number {
  const usage = usageOfToday(usrId);
  return usage.used + usage.reserved;
}

function tryReserveTokens(usrId: string, tokens: number): boolean {
  const reserve = Number.isFinite(tokens) && tokens > 0 ? Math.ceil(tokens) : 0;
  const usage = usageOfToday(usrId);
  if (usage.used + usage.reserved + reserve > config.llmDailyTokens) return false;
  usage.reserved += reserve;
  return true;
}

function settleReservedTokens(usrId: string, reserved: number, charged: number): void {
  const reservedSafe = Number.isFinite(reserved) && reserved > 0 ? Math.ceil(reserved) : 0;
  const usage = usageOfToday(usrId);
  usage.reserved = Math.max(0, usage.reserved - reservedSafe);

  if (!Number.isFinite(charged) || charged <= 0) return;
  usage.used += Math.ceil(charged);
}

/**
 * 从透传流的副本里尽力提取 usage：
 * 流式响应取最后一个带 usage 的 data 帧；非流式整体 JSON 解析。
 * 上游没有回 usage 时按输出上限粗估，宁可高估也不漏记。
 */
async function countUsage(
  body: ReadableStream<Uint8Array>,
  isStream: boolean,
  fallback: number,
): Promise<number> {
  let usage: TokenUsage | undefined;
  try {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      if (!isStream) continue;
      let newline = buffer.indexOf("\n");
      while (newline !== -1) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (line.startsWith("data:")) {
          const payload = line.slice(5).trim();
          if (payload && payload !== "[DONE]") {
            try {
              const parsed = JSON.parse(payload) as { usage?: TokenUsage };
              if (parsed.usage && typeof parsed.usage === "object") usage = parsed.usage;
            } catch {
              // 半截 JSON 忽略，等下一帧
            }
          }
        }
        newline = buffer.indexOf("\n");
      }
    }
    if (!isStream && buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer) as { usage?: TokenUsage };
        if (parsed.usage && typeof parsed.usage === "object") usage = parsed.usage;
      } catch {
        // ignore
      }
    }
  } catch {
    // 统计失败不影响客户端
  }
  const total =
    usage?.total_tokens ?? (usage?.prompt_tokens ?? 0) + (usage?.completion_tokens ?? 0);
  return usage ? total : fallback;
}

llmProxy.post("/v1/chat/completions", async (c) => {
  if (!config.llmProxyEnabled) {
    return c.json({ error: "LLM 代理已关闭（AGENT_LLM_PROXY=false）" }, 404);
  }
  if (!isAllowedOrigin(c.req.header("origin"))) {
    return c.json({ error: "origin not allowed" }, 403);
  }
  if (!config.deepseekKey) {
    return c.json({ error: "DEEPSEEK_API_KEY 未配置" }, 500);
  }

  const token = extractBearer(c.req.header("authorization"));
  if (!token) return c.json({ error: "unauthorized" }, 401);
  let usrId: string;
  try {
    usrId = decodeClaims(token).id;
  } catch (error) {
    if (error instanceof AuthError) return c.json({ error: "unauthorized" }, 401);
    throw error;
  }

  const body = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return c.json({ error: "invalid json body" }, 400);

  // 每用户每日 token 封顶（在途请求也会计入保守预占，避免并发穿透）
  if (usedToday(usrId) >= config.llmDailyTokens) {
    log.warn("llm proxy daily quota exceeded", { usrId });
    return c.json({ error: "今日模型用量已达上限，请明天再试" }, 429);
  }

  // 模型固定；无论客户端是否传 max_tokens，都按服务端上限封顶
  const payload: Record<string, unknown> = { ...body, model: route.model };
  let outputCap = config.llmMaxTokensCap;
  if (typeof body.max_tokens === "number" && body.max_tokens > 0) {
    outputCap = Math.min(body.max_tokens, config.llmMaxTokensCap);
  }
  payload.max_tokens = outputCap;

  if (!tryReserveTokens(usrId, outputCap)) {
    log.warn("llm proxy daily quota exceeded on reserve", { usrId, reserve: outputCap });
    return c.json({ error: "今日模型用量已达上限，请明天再试" }, 429);
  }

  let settled = false;
  const settleUsage = (charged: number) => {
    if (settled) return;
    settled = true;
    settleReservedTokens(usrId, outputCap, charged);
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120_000);
  // 客户端断开（SSE/页面关闭）时同步取消上游，避免继续消耗 token
  const signal = AbortSignal.any([controller.signal, c.req.raw.signal]);

  try {
    const upstream = await fetch(`${config.deepseekBase}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.deepseekKey}`,
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!upstream.ok || !upstream.body) {
      settleUsage(0);
      const detail = await upstream.text().catch(() => "");
      log.warn("llm proxy upstream failed", {
        status: upstream.status,
        detail: detail.slice(0, 300),
      });
      return c.json({ error: `上游模型调用失败（HTTP ${upstream.status}）` }, 502);
    }

    // 一路透传给客户端，一路异步统计 usage
    const [toClient, toCount] = upstream.body.tee();
    void countUsage(toCount, body.stream === true, outputCap)
      .then((charged) => settleUsage(charged))
      .catch(() => settleUsage(outputCap));

    return new Response(toClient, {
      status: 200,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    settleUsage(0);
    log.warn("llm proxy failed", { error: errorMessage(error) });
    return c.json({ error: "模型代理请求失败" }, 502);
  } finally {
    clearTimeout(timer);
  }
});
