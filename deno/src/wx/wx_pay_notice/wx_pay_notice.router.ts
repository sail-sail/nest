import {
  useContext,
} from "/lib/context.ts";

import {
  Router,
} from "@oak/oak";

import * as wx_pay_noticeService from "./wx_pay_notice.service.ts";

const routerPrefix = "/api/wx_pay_notice/";

const router = new Router({
  prefix: routerPrefix,
});

router.post("pay_notice", async function(ctx) {
  const request = ctx.request;
  const response = ctx.response;
  const headers = request.headers;
  const context = useContext();
  context.notVerifyToken = true;
  try {
    const body = await request.body.json();
    const params = {
      body,
      signature: headers.get("wechatpay-signature")!,
      serial: headers.get("wechatpay-serial")!,
      nonce: headers.get("wechatpay-nonce")!,
      timestamp: headers.get("wechatpay-timestamp")!,
    };
    const notify_url = request.url.pathname;
    await wx_pay_noticeService.pay_notice(notify_url, params);
  } catch (err) {
    throw err;
  } finally {
    response.status = 200;
  }
});

export default router;
