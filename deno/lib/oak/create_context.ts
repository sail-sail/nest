import { Context as OakContext, Middleware } from "oak";
import { Context } from "/lib/context.ts";

export function factory<S>(): Middleware<S> {
  return async function createCtx(ctx: OakContext<S>, next) {
    const context = new Context(ctx);
    // deno-lint-ignore no-explicit-any
    (ctx as any)._context = context;
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

export default { factory };
