import {
  type Context,
} from "/lib/context.ts";

import * as deptService from "./dept.service.ts";

export async function findDeptsByToken(
  context: Context,
) {
  const models = await deptService.findDeptsByToken(context);
  return models;
}
