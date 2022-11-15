import * as deptService from "./dept.service.ts";

export async function deptLoginSelect(
  dept_id: string,
) {
  const token = await deptService.deptLoginSelect(dept_id);
  return token;
}
