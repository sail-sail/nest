import { Application } from "@oak/oak";

import { createContext } from "./create_context.ts";
import { timing } from "./timing.ts";
import { gqlRouter } from "./gql.ts";

import tmpfileRouter from "/lib/tmpfile/tmpfile.router.ts";
import ossRouter from "/lib/oss/oss.router.ts";
import websocketRouter from "../websocket/websocket.router.ts";
import healthRouter from "/lib/health/health.router.ts";

import wx_usrRouter from "/src/wx/wx_usr/wx_usr.router.ts";
import wx_pay_noticeRouter from "/src/wx/wx_pay_notice/wx_pay_notice.router.ts";

export function initApp() {
  const app = new Application();
  
  app.use(createContext());
  app.use(timing());
  
  app.use(gqlRouter.routes());
  app.use(tmpfileRouter.routes());
  app.use(ossRouter.routes());
  app.use(websocketRouter.routes());
  app.use(healthRouter.routes());
  
  app.use(wx_usrRouter.routes());
  app.use(wx_pay_noticeRouter.routes());
  
  return app;
}
