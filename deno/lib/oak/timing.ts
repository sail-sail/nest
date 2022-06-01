import { Context, Middleware } from "oak";

export function factory<S>(): Middleware<S> {
  return async function logger(ctx: Context<S>, next) {
    // deno-lint-ignore no-explicit-any
    if ((window as any).process.env.NODE_ENV !== "production") {
      console.log();
    }
    const start = performance.now();
    await next();
    const rt = Math.floor(performance.now() - start);
    ctx.response.headers.set("X-Response-Time", `${ rt }ms`);
    // deno-lint-ignore no-explicit-any
    const context = (ctx as any)._context;
    if (context) {
      context.log(`${ rt }ms`);
    }
  };
}

export default { factory };
