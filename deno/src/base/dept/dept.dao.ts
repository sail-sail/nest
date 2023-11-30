import * as authDao from "/lib/auth/auth.dao.ts";

import {
  findById as findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  findAll as findAllDept,
} from "/gen/base/dept/dept.dao.ts";

import type {
  DeptId,
} from "/gen/base/dept/dept.model.ts";

export async function getAuthDeptIds() {
  const authModel = await authDao.getAuthModel(false);
  if (!authModel) {
    return [ ];
  }
  const usrModel = await findByIdUsr(authModel.id);
  if (!usrModel || !usrModel.is_enabled) {
    return [ ];
  }
  const dept_ids = usrModel.dept_ids || [ ];
  return dept_ids;
}

export async function getParentsById(ids: DeptId[], parent_ids: DeptId[]) {
  if (ids.length === 0) {
    return;
  }
  const deptModels = await findAllDept({
    ids,
    is_enabled: [ 1 ],
  });
  const ids2: DeptId[] = deptModels.map((deptModel) => deptModel.parent_id);
  parent_ids.push(...ids2);
  await getParentsById(ids2, parent_ids);
}

/**
 * 获取当前用户及其所有父部门的id
 */
export async function getAuthAndParentsDeptIds() {
  
  const dept_ids: DeptId[] = await getAuthDeptIds();
  
  const parent_ids: DeptId[] = [
    ...dept_ids,
  ];
  
  await getParentsById(dept_ids || [ ], parent_ids);
  return parent_ids;
}
