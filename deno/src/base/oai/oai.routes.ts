import {
  validateOaiRoutes,
} from "./oai.registry.ts";

import {
  systemRoutes,
} from "/src/base/system/system.oai.ts";

/** 所有对外暴露的 openapi 业务接口, 新增模块只在这里登记一次 */
export const oaiRoutes = validateOaiRoutes([
  ...systemRoutes,
]);
