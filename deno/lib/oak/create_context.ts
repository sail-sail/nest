import {
  type Context as OakContext,
  type Middleware,
} from "oak";

import {
  newContext,
  runInAsyncHooks,
} from "/lib/context.ts";

export function createContext(): Middleware {
  return async function createCtx(ctx: OakContext, next) {
    const context = newContext(ctx);
    return await runInAsyncHooks(context, async function() {
      try {
        await next();
      } catch (err) {
        context.error(err);
        ctx.response.body = {
          code: 1,
          msg: err?.message || err?.toString() || "",
        };
      }
    });
  };
}
