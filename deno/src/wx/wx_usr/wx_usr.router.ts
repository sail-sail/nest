import {
  resSuc,
  useContext,
} from "/lib/context.ts";
 
import {
  Router,
} from "@oak/oak";

import * as wx_usrService from "./wx_usr.service.ts";
 
const router = new Router({
  prefix: "/api",
});
 
router.post("/wx_usr/code2Session", async function(ctx) {
  const request = ctx.request;
  const response = ctx.response;
  const body = request.body;
  const input: {
    appid: string;
    code: string;
    lang: string;
  } = await body.json();
  const context = useContext();
  context.notVerifyToken = true;
  context.lang = input.lang;
  try {
    const loginModel = await wx_usrService.code2Session(input);
    response.headers.set("authorization", loginModel.authorization);
    response.body = resSuc(loginModel);
  } catch (err) {
    response.headers.set("authorization", "");
    response.status = 401;
    throw err;
  }
});

export default router;
 