import { Application } from "oak";

import createCtx from "./create_context.ts";
// import timing from "./timing.ts";

import { gqlRouter } from "./gql.ts";
import tmpfileRouter from "/lib/tmpfile/tmpfile.router.ts";
import ossRouter from "/lib/oss/oss.router.ts";

export function initApp() {
  const app = new Application();
  
  app.use(createCtx.factory());
  // app.use(timing.factory());
  
  app.use(gqlRouter.routes());
  app.use(tmpfileRouter.routes());
  app.use(ossRouter.routes());
  
  return app;
}
