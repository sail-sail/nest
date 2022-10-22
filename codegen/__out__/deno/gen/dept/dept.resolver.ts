import { type Context } from "/lib/context.ts";
import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import * as deptService from "./dept.service.ts";

import {
  type DeptModel,
  type DeptSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountDept(
  context: Context,
  search?: DeptSearch & { $extra?: SearchExtra[] },
) {
  const result = await deptService.findCount(context, search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllDept(
  context: Context,
  search?: DeptSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await deptService.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelDept(
  context: Context,
  search?: DeptSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await deptService.exportExcel(context, search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneDept(
  context: Context,
  search?: DeptSearch & { $extra?: SearchExtra[] },
) {
  const result = await deptService.findOne(context, search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdDept(
  context: Context,
  id: string,
) {
  const result = await deptService.findById(context, id);
  return result;
}

/**
 * 创建一条数据
 */
export async function createDept(
  context: Context,
  model: DeptModel,
) {
  context.is_tran = true;
  const result = await deptService.create(context, model);
  return result;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdDept(
  context: Context,
  id: string,
  model: DeptModel,
) {
  context.is_tran = true;
  const result = await deptService.updateById(context, id, model);
  return result;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsDept(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await deptService.deleteByIds(context, ids);
  return result;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsDept(
  context: Context,
  ids: string[],
  is_locked: 0 | 1,
) {
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDept.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const result = await deptService.lockByIds(context, ids, is_locked);
  return result;
}

/**
 * 导入部门
 */
export async function importFileDept(
  context: Context,
  id: string,
) {
  const result = await deptService.importFile(context, id);
  return result;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsDept(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await deptService.revertByIds(context, ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsDept(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await deptService.forceDeleteByIds(context, ids);
  return result;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByDept(
  context: Context,
) {
  const result = await deptService.findLastOrderBy(context);
  return result;
}
