import {
  Router,
} from "@oak/oak";

import {
  error,
} from "/lib/context.ts";

const KEY = "lLpR1EKETWSb5x7TR4R32Q";

const router = new Router({
  prefix: "/api/",
});

router.get("health", async function(ctx) {
  const request = ctx.request;
  const response = ctx.response;
  try {
    const {
      healthCheck,
    } = await import("./health.service.ts");
    
    const searchParams = request.url.searchParams;
    const key = searchParams.get("key");
    if (key !== KEY) {
      response.status = 401;
      response.body = "Unauthorized";
      return;
    }
    
    await healthCheck();
    
    response.status = 200;
    response.body = "OK";
  } catch (err0) {
    const err = err0 as Error;
    error(err);
    const errMsg = err?.message || err?.toString() || err || "";
    response.status = 500;
    response.body = errMsg;
    return;
  }
});

export default router;
