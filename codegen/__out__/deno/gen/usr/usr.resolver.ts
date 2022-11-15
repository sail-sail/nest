import {
  useContext,
} from "/lib/context.ts";

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
  search?: UsrSearch & { $extra?: SearchExtra[] },
) {
  const result = await usrService.findCount(search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllUsr(
  search?: UsrSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await usrService.findAll(search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelUsr(
  search?: UsrSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await usrService.exportExcel(search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneUsr(
  search?: UsrSearch & { $extra?: SearchExtra[] },
) {
  const result = await usrService.findOne(search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdUsr(
  id: string,
) {
  const result = await usrService.findById(id);
  return result;
}

/**
 * 创建一条数据
 */
export async function createUsr(
  model: UsrModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await usrService.create(model);
  return result;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdUsr(
  id: string,
  model: UsrModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await usrService.updateById(id, model);
  return result;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsUsr(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await usrService.deleteByIds(ids);
  return result;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsUsr(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsUsr.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const result = await usrService.lockByIds(ids, is_locked);
  return result;
}

/**
 * 导入用户
 */
export async function importFileUsr(
  id: string,
) {
  const result = await usrService.importFile(id);
  return result;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsUsr(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await usrService.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsUsr(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await usrService.forceDeleteByIds(ids);
  return result;
}
