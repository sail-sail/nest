import { Application } from "oak";

import { createContext } from "./create_context.ts";
import { timing } from "./timing.ts";
import { gqlRouter } from "./gql.ts";

import tmpfileRouter from "/lib/tmpfile/tmpfile.router.ts";
import ossRouter from "/lib/oss/oss.router.ts";
import websocketRouter from "../websocket/websocket.router.ts";

export function initApp() {
  const app = new Application();
  
  app.use(createContext());
  app.use(timing());
  
  app.use(gqlRouter.routes());
  app.use(tmpfileRouter.routes());
  app.use(ossRouter.routes());
  app.use(websocketRouter.routes());
  
  return app;
}
