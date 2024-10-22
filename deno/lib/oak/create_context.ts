import type {
  Context as OakContext,
  Middleware,
} from "@oak/oak";

import {
  error,
  newContext,
  runInAsyncHooks,
} from "/lib/context.ts";

export function createContext(): Middleware {
  return async function createCtx(ctx: OakContext, next) {
    const request = ctx.request;
    const url = request.url;
    const pathname = url.pathname;
    if (pathname === "/graphql" || pathname === "/api/graphql") {
      try {
        return await next();
      } catch (err0) {
        const err = err0 as Error;
        error(err);
        ctx.response.body = {
          code: 1,
          msg: err?.message || err?.toString() || "",
        };
        return;
      }
    }
    const context = newContext(ctx);
    return await runInAsyncHooks(context, async function() {
      try {
        await next();
      } catch (err0) {
        const err = err0 as Error;
        error(err);
        ctx.response.body = {
          code: 1,
          msg: err?.message || err?.toString() || "",
        };
      }
    });
  };
}
