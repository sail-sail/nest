import { type Context } from "/lib/context.ts";
import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import * as usrService from "./usr.service.ts";

import {
  type UsrModel,
  type UsrSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountUsr(
  context: Context,
  search?: UsrSearch & { $extra?: SearchExtra[] },
) {
  const result = await usrService.findCount(context, search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllUsr(
  context: Context,
  search?: UsrSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await usrService.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelUsr(
  context: Context,
  search?: UsrSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await usrService.exportExcel(context, search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneUsr(
  context: Context,
  search?: UsrSearch & { $extra?: SearchExtra[] },
) {
  const result = await usrService.findOne(context, search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdUsr(
  context: Context,
  id: string,
) {
  const result = await usrService.findById(context, id);
  return result;
}

/**
 * 创建一条数据
 */
export async function createUsr(
  context: Context,
  model: UsrModel,
) {
  context.is_tran = true;
  const result = await usrService.create(context, model);
  return result;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdUsr(
  context: Context,
  id: string,
  model: UsrModel,
) {
  context.is_tran = true;
  const result = await usrService.updateById(context, id, model);
  return result;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsUsr(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await usrService.deleteByIds(context, ids);
  return result;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsUsr(
  context: Context,
  ids: string[],
  is_locked: 0 | 1,
) {
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsUsr.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const result = await usrService.lockByIds(context, ids, is_locked);
  return result;
}

/**
 * 导入用户
 */
export async function importFileUsr(
  context: Context,
  id: string,
) {
  const result = await usrService.importFile(context, id);
  return result;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsUsr(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await usrService.revertByIds(context, ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsUsr(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await usrService.forceDeleteByIds(context, ids);
  return result;
}
