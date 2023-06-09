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
  type DeptInput,
  type DeptSearch,
} from "./dept.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountDept(
  search?: DeptSearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./dept.service.ts");
  const res = await findCount(search);
  return res;
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
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsDept() {
  const { getFieldComments } = await import("./dept.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneDept(
  search?: DeptSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./dept.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdDept(
  id: string,
) {
  const { findById } = await import("./dept.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createDept(
  input: DeptInput,
) {
  const context = useContext();
  
  context.is_tran = true;
  const {
    findById,
    create,
  } = await import("./dept.service.ts");
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");
  const res = await create(input);
  
  const new_data = await findById(res);
  
  await log({
    module: "base_dept",
    module_lbl: "部门",
    method: "create",
    method_lbl: "创建",
    lbl: "创建",
    old_data: "{}",
    new_data: JSON.stringify(new_data),
  });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdDept(
  id: string,
  input: DeptInput,
) {
  const context = useContext();
  
  context.is_tran = true;
  const {
    findById,
    updateById,
  } = await import("./dept.service.ts");
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");
  const old_data = await findByIdDept(id);
  const res = await updateById(id, input);
  
  const new_data = await findById(res);
  
  await log({
    module: "base_dept",
    module_lbl: "部门",
    method: "updateById",
    method_lbl: "修改",
    lbl: "修改",
    old_data: JSON.stringify(old_data),
    new_data: JSON.stringify(new_data),
  });
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsDept(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const {
    findAll,
    deleteByIds,
  } = await import("./dept.service.ts");
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");
  const old_data = await findAll({
    ids,
  });
  const res = await deleteByIds(ids);
  
  await log({
    module: "base_dept",
    module_lbl: "部门",
    method: "deleteByIds",
    method_lbl: "删除",
    lbl: "删除",
    old_data: JSON.stringify(old_data),
    new_data: "{}",
  });
  return res;
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
  const {
    lockByIds,
  } = await import("./dept.service.ts");
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");
  const res = await lockByIds(ids, is_locked);
  
  await log({
    module: "base_dept",
    module_lbl: "部门",
    method: "lockByIds",
    method_lbl: "锁定",
    lbl: "锁定",
    old_data: JSON.stringify(ids),
    new_data: "[]",
  });
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsDept(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const {
    revertByIds,
  } = await import("./dept.service.ts");
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");
  const res = await revertByIds(ids);
  
  await log({
    module: "base_dept",
    module_lbl: "部门",
    method: "revertByIds",
    method_lbl: "还原",
    lbl: "还原",
    old_data: JSON.stringify(ids),
    new_data: "[]",
  });
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsDept(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const {
    forceDeleteByIds,
  } = await import("./dept.service.ts");
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");
  const res = await forceDeleteByIds(ids);
  
  await log({
    module: "base_dept",
    module_lbl: "部门",
    method: "forceDeleteByIds",
    method_lbl: "彻底删除",
    lbl: "彻底删除",
    old_data: JSON.stringify(ids),
    new_data: "[]",
  });
  return res;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByDept() {
  const { findLastOrderBy } = await import("./dept.service.ts");
  const res = findLastOrderBy();
  return res;
}
