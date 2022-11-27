import {
  _internals as deptService,
} from "./dept.service.ts";

export const _internals = {
  deptLoginSelect,
};

async function deptLoginSelect(
  dept_id: string,
) {
  const token = await deptService.deptLoginSelect(dept_id);
  return token;
}
