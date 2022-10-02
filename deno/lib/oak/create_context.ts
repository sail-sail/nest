import {
  type Context as OakContext,
  type Middleware,
} from "oak";

import {
  newContext,
} from "/lib/context.ts";

export function createContext(): Middleware {
  return async function createCtx(ctx: OakContext, next) {
    const context = newContext(ctx);
    try {
      await next();
    } catch (err) {
      context.error(err);
      ctx.response.body = {
        code: 1,
        errMsg: err?.message || err?.toString() || "",
      };
    }
  };
}
