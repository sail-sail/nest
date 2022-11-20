import {
  type Middleware,
  type Context as OakContext,
} from "oak";

import {
  log,
} from "/lib/context.ts";

export function timing(): Middleware {
  return async function logger(ctx: OakContext, next) {
    // deno-lint-ignore no-explicit-any
    if ((window as any).process.env.NODE_ENV !== "production") {
      console.log();
    }
    const start = performance.now();
    await next();
    const rt = Math.floor(performance.now() - start);
    ctx.response.headers.set("X-Response-Time", `${ rt }ms`);
    log(`${ rt }ms`);
  };
}
