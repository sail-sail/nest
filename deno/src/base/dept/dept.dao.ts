import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  findById as findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  findAll as findAllDept,
} from "/gen/base/dept/dept.dao.ts";

export async function getAuthDeptIds() {
  const authModel = await getAuthModel(false);
  if (!authModel) {
    return [ ];
  }
  const usr_id = authModel.id;
  const usrModel = await findByIdUsr(usr_id);
  if (!usrModel || !usrModel.is_enabled) {
    return [ ];
  }
  const dept_ids = usrModel.dept_ids || [ ];
  return dept_ids;
}

// 获取指定用户的部门ID列表
export async function getDeptIds(
  usr_id?: UsrId,
) {
  const usrModel = await findByIdUsr(usr_id);
  if (!usrModel || !usrModel.is_enabled) {
    return [ ];
  }
  const dept_ids = usrModel.dept_ids || [ ];
  return dept_ids;
}

export async function getParentsById(
  ids: DeptId[],
  parent_ids: DeptId[],
) {
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

/**
 * 获取指定用户及其所有父部门的id
 */
export async function getParentsDeptIds(
  usr_id?: UsrId,
) {
  
  const dept_ids: DeptId[] = await getDeptIds(usr_id);
  
  const parent_ids: DeptId[] = [
    ...dept_ids,
  ];
  
  await getParentsById(dept_ids || [ ], parent_ids);
  return parent_ids;
}
