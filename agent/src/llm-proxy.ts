import { Hono } from "hono";
import { AuthError, decodeClaims, extractBearer } from "./auth.ts";
import { config } from "./config.ts";
import { ModelConfigError, resolveModelRoute, type ModelRoute } from "./llm-config.ts";
import { errorMessage, log } from "./logger.ts";

/**
 * PageAgent 的模型代理。
 *
 * 浏览器里的 PageAgent 不持有 DEEPSEEK_API_KEY，它把 OpenAI 兼容请求发到这里，
 * 由宿主补上服务端 key 再转发。鉴权仍用当前登录用户的 JWT。
 *
 * 挂载点：/agent/llm，PageAgent 的 baseURL 配成 ${origin}/agent/llm/v1
 */
export const llmProxy = new Hono();

function originAllowed(origin: string | undefined): boolean {
  if (!origin) return true;
  return (
    origin === config.publicOrigin ||
    origin === "http://localhost:4000" ||
    origin === "http://127.0.0.1:4000"
  );
}

llmProxy.post("/v1/chat/completions", async (c) => {
  if (!config.llmProxyEnabled) {
    return c.json({ error: "LLM 代理已关闭（AGENT_LLM_PROXY=false）" }, 404);
  }
  if (!originAllowed(c.req.header("origin"))) {
    return c.json({ error: "origin not allowed" }, 403);
  }

  let route: ModelRoute;
  try {
    route = resolveModelRoute();
  } catch (error) {
    const message = error instanceof ModelConfigError ? error.message : "模型未配置";
    return c.json({ error: message }, 500);
  }

  const token = extractBearer(c.req.header("authorization"));
  if (!token) return c.json({ error: "unauthorized" }, 401);
  try {
    decodeClaims(token);
  } catch (error) {
    if (error instanceof AuthError) return c.json({ error: "unauthorized" }, 401);
    throw error;
  }

  const body = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return c.json({ error: "invalid json body" }, 400);

  // 模型固定，避免代理被当成任意模型的免费出口
  const payload = { ...body, model: route.model };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120_000);

  try {
    const upstream = await fetch(`${route.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${route.apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      log.warn("llm proxy upstream failed", {
        status: upstream.status,
        detail: detail.slice(0, 300),
      });
      return c.json({ error: `上游模型调用失败（HTTP ${upstream.status}）` }, 502);
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    log.warn("llm proxy failed", { error: errorMessage(error) });
    return c.json({ error: "模型代理请求失败" }, 502);
  } finally {
    clearTimeout(timer);
  }
});
