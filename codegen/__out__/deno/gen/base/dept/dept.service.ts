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
  findById as findByIdUsr,
  validateOption as validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import * as deptDao from "./dept.dao.ts";

async function setSearchQuery(
  search: DeptSearch,
) {
  
  const usr_id = await get_usr_id();
  const org_id = await get_org_id();
  const usr_model = await findByIdUsr(usr_id);
  if (!usr_id || !usr_model) {
    throw new Error("usr_id can not be null");
  }
  const org_ids: OrgId[] = [ ];
  if (org_id) {
    org_ids.push(org_id);
  } else {
    org_ids.push(...usr_model.org_ids);
    org_ids.push("" as OrgId);
  }
  const username = usr_model.username;
  
  if (username !== "admin") {
    search.org_id = org_ids;
  }
  
}

/**
 * 根据条件查找部门总数
 */
export async function findCount(
  search?: DeptSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dept_num = await deptDao.findCount(search);
  
  return dept_num;
}

/**
 * 根据搜索条件和分页查找部门列表
 */
export async function findAll(
  search?: DeptSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DeptModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dept_models = await deptDao.findAll(search, page, sort);
  
  return dept_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: DeptInput,
): Promise<void> {
  await deptDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个部门
 */
export async function findOne(
  search?: DeptSearch,
  sort?: SortInput[],
): Promise<DeptModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dept_model = await deptDao.findOne(search, sort);
  
  return dept_model;
}

/**
 * 根据 id 查找部门
 */
export async function findById(
  id?: DeptId | null,
): Promise<DeptModel | undefined> {
  
  const dept_model = await deptDao.findById(id);
  
  return dept_model;
}

/**
 * 根据搜索条件查找部门是否存在
 */
export async function exist(
  search?: DeptSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dept_exist = await deptDao.exist(search);
  
  return dept_exist;
}

/**
 * 根据 id 查找部门是否存在
 */
export async function existById(
  id?: DeptId | null,
): Promise<boolean> {
  
  const dept_exist = await deptDao.existById(id);
  
  return dept_exist;
}

/**
 * 增加和修改时校验部门
 */
export async function validate(
  input: DeptInput,
): Promise<void> {
  await deptDao.validate(input);
}

/**
 * 批量创建部门
 */
export async function creates(
  inputs: DeptInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DeptId[]> {
  const dept_ids = await deptDao.creates(inputs, options);
  
  return dept_ids;
}

/**
 * 根据 id 修改部门
 */
export async function updateById(
  dept_id: DeptId,
  input: DeptInput,
): Promise<DeptId> {
  
  const is_locked = await deptDao.getIsLockedById(dept_id);
  if (is_locked) {
    throw "不能修改已经锁定的 部门";
  }
  
  const dept_id2 = await deptDao.updateById(dept_id, input);
  
  return dept_id2;
}

/** 校验部门是否存在 */
export async function validateOption(
  model0?: DeptModel,
): Promise<DeptModel> {
  const dept_model = await deptDao.validateOption(model0);
  return dept_model;
}

/**
 * 根据 ids 删除部门
 */
export async function deleteByIds(
  ids: DeptId[],
): Promise<number> {
  
  const old_models = await deptDao.findAll({
    ids,
  });
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 部门";
    }
  }
  
  const dept_num = await deptDao.deleteByIds(ids);
  return dept_num;
}

/**
 * 根据 ids 启用或者禁用部门
 */
export async function enableByIds(
  ids: DeptId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const dept_num = await deptDao.enableByIds(ids, is_enabled);
  return dept_num;
}

/**
 * 根据 ids 锁定或者解锁部门
 */
export async function lockByIds(
  ids: DeptId[],
  is_locked: 0 | 1,
): Promise<number> {
  const dept_num = await deptDao.lockByIds(ids, is_locked);
  return dept_num;
}

/**
 * 根据 ids 还原部门
 */
export async function revertByIds(
  ids: DeptId[],
): Promise<number> {
  
  const dept_num = await deptDao.revertByIds(ids);
  
  return dept_num;
}

/**
 * 根据 ids 彻底删除部门
 */
export async function forceDeleteByIds(
  ids: DeptId[],
): Promise<number> {
  
  const dept_num = await deptDao.forceDeleteByIds(ids);
  
  return dept_num;
}

/**
 * 获取部门字段注释
 */
export async function getFieldComments(): Promise<DeptFieldComment> {
  const dept_fields = await deptDao.getFieldComments();
  return dept_fields;
}

/**
 * 查找 部门 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const dept_sort = await deptDao.findLastOrderBy();
  return dept_sort;
}
