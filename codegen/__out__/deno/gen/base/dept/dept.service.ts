import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  get_usr_id,
  get_org_id,
} from "/lib/auth/auth.dao.ts";

import {
  findByIdUsr,
  validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  isAdmin,
} from "/src/base/usr/usr.dao.ts";

import * as deptDao from "./dept.dao.ts";

async function setSearchQuery(
  search: DeptSearch,
) {
  
  const usr_id = await get_usr_id(false);
  const org_id = await get_org_id();
  const usr_model = await validateOptionUsr(
    await findByIdUsr(usr_id),
  );
  const org_ids: OrgId[] = [ ];
  if (org_id) {
    org_ids.push(org_id);
  } else {
    org_ids.push(...usr_model.org_ids);
    org_ids.push("" as OrgId);
  }
  
  if (!await isAdmin(usr_id)) {
    search.org_id = org_ids;
  }
  
}

/**
 * 根据条件查找部门总数
 */
export async function findCountDept(
  search?: DeptSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dept_num = await deptDao.findCountDept(search);
  
  return dept_num;
}

/**
 * 根据搜索条件和分页查找部门列表
 */
export async function findAllDept(
  search?: DeptSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DeptModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dept_models = await deptDao.findAllDept(search, page, sort);
  
  return dept_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblDept(
  input: DeptInput,
): Promise<void> {
  await deptDao.setIdByLblDept(input);
}

/**
 * 根据条件查找第一个部门
 */
export async function findOneDept(
  search?: DeptSearch,
  sort?: SortInput[],
): Promise<DeptModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dept_model = await deptDao.findOneDept(search, sort);
  
  return dept_model;
}

/**
 * 根据条件查找第一个部门, 如果不存在则抛错
 */
export async function findOneOkDept(
  search?: DeptSearch,
  sort?: SortInput[],
): Promise<DeptModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dept_model = await deptDao.findOneOkDept(search, sort);
  
  return dept_model;
}

/**
 * 根据 id 查找部门
 */
export async function findByIdDept(
  dept_id: DeptId,
): Promise<DeptModel | undefined> {
  
  const dept_model = await deptDao.findByIdDept(dept_id);
  
  return dept_model;
}

/**
 * 根据 id 查找部门, 如果不存在则抛错
 */
export async function findByIdOkDept(
  dept_id: DeptId,
): Promise<DeptModel> {
  
  const dept_model = await deptDao.findByIdOkDept(dept_id);
  
  return dept_model;
}

/**
 * 根据 ids 查找部门
 */
export async function findByIdsDept(
  dept_ids: DeptId[],
): Promise<DeptModel[]> {
  
  const dept_models = await deptDao.findByIdsDept(dept_ids);
  
  return dept_models;
}

/**
 * 根据 ids 查找部门, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDept(
  dept_ids: DeptId[],
): Promise<DeptModel[]> {
  
  const dept_models = await deptDao.findByIdsOkDept(dept_ids);
  
  return dept_models;
}

/**
 * 根据搜索条件查找部门是否存在
 */
export async function existDept(
  search?: DeptSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dept_exist = await deptDao.existDept(search);
  
  return dept_exist;
}

/**
 * 根据 id 查找部门是否存在
 */
export async function existByIdDept(
  dept_id?: DeptId | null,
): Promise<boolean> {
  
  const dept_exist = await deptDao.existByIdDept(dept_id);
  
  return dept_exist;
}

/**
 * 增加和修改时校验部门
 */
export async function validateDept(
  input: DeptInput,
): Promise<void> {
  await deptDao.validateDept(input);
}

/**
 * 批量创建部门
 */
export async function createsDept(
  inputs: DeptInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DeptId[]> {
  const dept_ids = await deptDao.createsDept(inputs, options);
  
  return dept_ids;
}

/**
 * 根据 id 修改部门
 */
export async function updateByIdDept(
  dept_id: DeptId,
  input: DeptInput,
): Promise<DeptId> {
  
  const is_locked = await deptDao.getIsLockedByIdDept(dept_id);
  if (is_locked) {
    throw "不能修改已经锁定的 部门";
  }
  
  const dept_id2 = await deptDao.updateByIdDept(dept_id, input);
  
  return dept_id2;
}

/** 校验部门是否存在 */
export async function validateOptionDept(
  model0?: DeptModel,
): Promise<DeptModel> {
  const dept_model = await deptDao.validateOptionDept(model0);
  return dept_model;
}

/**
 * 根据 ids 删除部门
 */
export async function deleteByIdsDept(
  dept_ids: DeptId[],
): Promise<number> {
  
  const old_models = await deptDao.findByIdsDept(dept_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 部门";
    }
  }
  
  const dept_num = await deptDao.deleteByIdsDept(dept_ids);
  return dept_num;
}

/**
 * 根据 ids 启用或者禁用部门
 */
export async function enableByIdsDept(
  ids: DeptId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const dept_num = await deptDao.enableByIdsDept(ids, is_enabled);
  return dept_num;
}

/**
 * 根据 ids 锁定或者解锁部门
 */
export async function lockByIdsDept(
  dept_ids: DeptId[],
  is_locked: 0 | 1,
): Promise<number> {
  const dept_num = await deptDao.lockByIdsDept(dept_ids, is_locked);
  return dept_num;
}

/**
 * 根据 ids 还原部门
 */
export async function revertByIdsDept(
  dept_ids: DeptId[],
): Promise<number> {
  
  const dept_num = await deptDao.revertByIdsDept(dept_ids);
  
  return dept_num;
}

/**
 * 根据 ids 彻底删除部门
 */
export async function forceDeleteByIdsDept(
  dept_ids: DeptId[],
): Promise<number> {
  
  const dept_num = await deptDao.forceDeleteByIdsDept(dept_ids);
  
  return dept_num;
}

/**
 * 获取部门字段注释
 */
export async function getFieldCommentsDept(): Promise<DeptFieldComment> {
  const dept_fields = await deptDao.getFieldCommentsDept();
  return dept_fields;
}

/**
 * 查找 部门 order_by 字段的最大值
 */
export async function findLastOrderByDept(
): Promise<number> {
  const dept_sort = await deptDao.findLastOrderByDept();
  return dept_sort;
}
