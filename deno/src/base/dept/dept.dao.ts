import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  findAllDept,
} from "/gen/base/dept/dept.dao.ts";

export async function getAuthDeptIds() {
  const authModel = await getAuthModel(false);
  if (!authModel) {
    return [ ];
  }
  const usr_id = authModel.id;
  const usrModel = await findByIdUsr(
    usr_id,
    {
      is_debug: false,
    },
  );
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
  const usrModel = usr_id ? await findByIdUsr(
    usr_id,
    {
      is_debug: false,
    },
  ) : undefined;
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
  const deptModels = await findAllDept(
    {
      ids,
      is_enabled: [ 1 ],
    },
    undefined,
    undefined,
    {
      is_debug: false,
    },
  );
  const ids2 = deptModels.map((deptModel) => deptModel.parent_id);
  parent_ids.push(...ids2);
  await getParentsById(ids2, parent_ids);
}

/**
 * 获取当前用户及其所有父部门的id
 */
export async function getAuthAndParentsDeptIds() {
  
  const dept_ids = await getAuthDeptIds();
  
  const parent_ids = [
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
  
  const dept_ids = await getDeptIds(usr_id);
  
  const parent_ids = [
    ...dept_ids,
  ];
  
  await getParentsById(dept_ids || [ ], parent_ids);
  return parent_ids;
}

/**
 * 获取当前用户所在部门及其全部子部门的id
 */
export async function getAuthAndChildrenDeptIds() {
  const dept_ids = await getAuthDeptIds();
  const children_ids: DeptId[] = [ ];
  for (const id of dept_ids) {
    await getChildrenAllDeptIds(id, children_ids);
  }
  return children_ids;
}

/**
 * 递归获取指定部门子部门的id列表
 */
async function getChildrenAllDeptIds(
  parent_id: DeptId,
  children_ids: DeptId[],
) {
  children_ids.push(parent_id);
  const deptModels = await findAllDept(
    {
      parent_id: [ parent_id ],
      is_enabled: [ 1 ],
    },
    undefined,
    undefined,
    {
      is_debug: false,
    },
  );
  const ids = deptModels.map((deptModel) => deptModel.id);
  for (const id of ids) {
    await getChildrenAllDeptIds(id, children_ids);
  }
}
