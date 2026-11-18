import {
  Router,
  type Context as OakContext,
  type Middleware,
} from "@oak/oak";

import {
  error,
} from "/lib/context.ts";

import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  matchOaiRoute,
} from "./oai.match.ts";

import {
  failFromError,
  invokeOaiRoute,
} from "./oai.run.ts";

import {
  getOaiSpec,
} from "./oai.spec.ts";

/** openapi 文档入口 */
export const oaiRouter = new Router();

oaiRouter.get("/openapi.json", function(ctx) {
  try {
    ctx.response.type = "application/json; charset=utf-8";
    ctx.response.body = getOaiSpec();
  } catch (err0) {
    const err = err0 as Error;
    error(err);
    ctx.response.status = 500;
    ctx.response.type = "application/json; charset=utf-8";
    ctx.response.body = {
      error: err.message || "openapi 规范生成失败",
    };
  }
});

/** /api/oai 业务接口分发中间件 */
export function oaiMiddleware(): Middleware {
  return async function oaiDispatch(ctx: OakContext, next) {
    if (!ctx.request.url.pathname.startsWith("/api/oai/")) {
      await next();
      return;
    }

    const method = ctx.request.method.toUpperCase();
    const matched = matchOaiRoute(method, ctx.request.url.pathname);
    if (!matched) {
      await next();
      return;
    }

    let result;
    try {
      const body = await readJsonBody(ctx);
      result = await invokeOaiRoute(matched.route, {
        oakCtx: ctx,
        params: matched.params,
        query: Object.fromEntries(ctx.request.url.searchParams),
        body,
        headers: ctx.request.headers,
      });
    } catch (err0) {
      error(err0);
      result = failFromError(err0);
    }

    ctx.response.status = 200;
    ctx.response.type = "application/json; charset=utf-8";
    ctx.response.body = result;
  };
}

async function readJsonBody(
  ctx: OakContext,
) {
  if (!ctx.request.hasBody) {
    return undefined;
  }
  const type = ctx.request.body.type();
  if (type !== "json") {
    throw new ServiceException("请求体必须是 application/json", "invalid_content_type");
  }
  try {
    return await ctx.request.body.json();
  } catch {
    throw new ServiceException("请求体不是合法 JSON", "invalid_json");
  }
}
