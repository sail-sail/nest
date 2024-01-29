import type {
  Middleware,
  Context as OakContext,
} from "oak";

export function timing(): Middleware {
  return async function timing(ctx: OakContext, next) {
    const start = performance.now();
    await next();
    const rt = Math.floor(performance.now() - start);
    ctx.response.headers.set("Server-Timing", `app;dur=${ rt }`);
  };
}
