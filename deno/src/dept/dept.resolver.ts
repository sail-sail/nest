import {
  type Context,
} from "/lib/context.ts";

import * as deptService from "./dept.service.ts";

export async function deptLoginSelect(
  context: Context,
  dept_id: string,
) {
  const token = await deptService.deptLoginSelect(context, dept_id);
  return token;
}
