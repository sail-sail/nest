import { Application } from "oak";
// import { multiParser } from "oak-multiparser";

import createCtx from "./create_context.ts";
import timing from "./timing.ts";

import { gqlRouter } from "./gql.ts";
import tmpfileRouter from "../tmpfile/tmpfile.router.ts";

export function initApp() {
  const app = new Application();

  app.use(createCtx.factory());
  // app.use(etag.factory());
  app.use(timing.factory());

  app.use(gqlRouter.routes());
  app.use(tmpfileRouter.routes());
  // app.use(gqlRouter.allowedMethods());
  
  return app;
}
