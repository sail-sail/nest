import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type DeptModel,
  type DeptSearch,
} from "./dept.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountDept(
  search?: DeptSearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./dept.service.ts");
  const data = await findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllDept(
  search?: DeptSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const { findAll } = await import("./dept.service.ts");
  const data = await findAll(search, page, sort);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsDept() {
  const { getFieldComments } = await import("./dept.service.ts");
  const data = await getFieldComments();
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneDept(
  search?: DeptSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./dept.service.ts");
  const data = await findOne(search, sort);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdDept(
  id: string,
) {
  const { findById } = await import("./dept.service.ts");
  const data = await findById(id);
  return data;
}

/**
 * 创建一条数据
 */
export async function createDept(
  model: DeptModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const { create } = await import("./dept.service.ts");
  const data = await create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdDept(
  id: string,
  model: DeptModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const { updateById } = await import("./dept.service.ts");
  const data = await updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsDept(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { deleteByIds } = await import("./dept.service.ts");
  const data = await deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsDept(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDept.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const { lockByIds } = await import("./dept.service.ts");
  const data = await lockByIds(ids, is_locked);
  return data;
}

/**
 * 导入部门
 */
export async function importFileDept(
  id: string,
) {
  const { importFile } = await import("./dept.service.ts");
  const data = await importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsDept(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { revertByIds } = await import("./dept.service.ts");
  const data = await revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsDept(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { forceDeleteByIds } = await import("./dept.service.ts");
  const data = await forceDeleteByIds(ids);
  return data;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByDept() {
  const { findLastOrderBy } = await import("./dept.service.ts");
  const data = findLastOrderBy();
  return data;
}
