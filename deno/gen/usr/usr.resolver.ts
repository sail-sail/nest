import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as usrService
} from "./usr.service.ts";

import {
  type UsrModel,
  type UsrSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

export const _internals = {
  findCountUsr,
  findAllUsr,
  exportExcelUsr,
  findOneUsr,
  findByIdUsr,
  createUsr,
  updateByIdUsr,
  deleteByIdsUsr,lockByIdsUsr,
  importFileUsr,
  revertByIdsUsr,
  forceDeleteByIdsUsr,
};

/**
 * 根据条件查找据数总数
 */
async function findCountUsr(
  search?: UsrSearch & { $extra?: SearchExtra[] },
) {
  const data = await usrService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllUsr(
  search?: UsrSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const data = await usrService.findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelUsr(
  search?: UsrSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await usrService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneUsr(
  search?: UsrSearch & { $extra?: SearchExtra[] },
) {
  const data = await usrService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdUsr(
  id: string,
) {
  const data = await usrService.findById(id);
  return data;
}

/**
 * 创建一条数据
 */
async function createUsr(
  model: UsrModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await usrService.create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
async function updateByIdUsr(
  id: string,
  model: UsrModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await usrService.updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsUsr(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await usrService.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
async function lockByIdsUsr(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsUsr.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const data = await usrService.lockByIds(ids, is_locked);
  return data;
}

/**
 * 导入用户
 */
async function importFileUsr(
  id: string,
) {
  const data = await usrService.importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsUsr(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await usrService.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsUsr(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await usrService.forceDeleteByIds(ids);
  return data;
}
