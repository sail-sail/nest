import {
  Router,
} from "oak";

import {
  error,
} from "/lib/context.ts";

const router = new Router({
  prefix: "/api/",
});

router.get("health", async function(ctx) {
  const response = ctx.response;
  try {
    const {
      healthCheck,
    } = await import("./health.service.ts");
    
    await healthCheck();
    
    response.status = 200;
    response.body = "OK";
  } catch (err) {
    error(err);
    const errMsg = err?.message || err?.toString() || err || "";
    response.status = 500;
    response.body = errMsg;
    return;
  }
});

export default router;
