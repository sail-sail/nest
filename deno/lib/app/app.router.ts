import {
  Router,
} from "@oak/oak";

import {
  error,
  log,
} from "/lib/context.ts";

import {
  handleRequestId,
} from "/lib/oak/request_id.ts";

import {
  getRequestOrigin,
  redirect,
} from "./app.redirect.ts";

const router = new Router({
  prefix: "/api/app/",
});

/** 统一跳转: 按 User-Agent 决定跳电脑端还是手机端, 不需要登录校验 */
router.get("redirect", async function(ctx) {
  const request = ctx.request;
  const response = ctx.response;
  if (await handleRequestId(
    response,
    request.headers.get("x-request-id"),
  )) {
    return;
  }
  try {
    const searchParams = request.url.searchParams;
    const {
      location,
      message,
    } = redirect({
      route_path: searchParams.get("route_path"),
      route_query: searchParams.get("route_query"),
      uni_path: searchParams.get("uni_path"),
      target: searchParams.get("target"),
      message_id: searchParams.get("message_id"),
    }, request.headers.get("user-agent") ?? "", getRequestOrigin(request.headers));
    if (!location) {
      response.status = 400;
      response.body = message || "bad_request";
      return;
    }
    log(`统一跳转: ${ request.url.pathname } -> ${ location }`);
    response.redirect(location);
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
