import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as dictService
} from "./dict.service.ts";

import {
  type DictModel,
  type DictSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

export const _internals = {
  findCountDict,
  findAllDict,
  exportExcelDict,
  findOneDict,
  findByIdDict,
  createDict,
  updateByIdDict,
  deleteByIdsDict,lockByIdsDict,
  importFileDict,
  revertByIdsDict,
  forceDeleteByIdsDict,
  findLastOrderByDict,
};

/**
 * 根据条件查找据数总数
 */
async function findCountDict(
  search?: DictSearch & { $extra?: SearchExtra[] },
) {
  const result = await dictService.findCount(search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllDict(
  search?: DictSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await dictService.findAll(search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelDict(
  search?: DictSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await dictService.exportExcel(search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneDict(
  search?: DictSearch & { $extra?: SearchExtra[] },
) {
  const result = await dictService.findOne(search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdDict(
  id: string,
) {
  const result = await dictService.findById(id);
  return result;
}

/**
 * 创建一条数据
 */
async function createDict(
  model: DictModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dictService.create(model);
  return result;
}

/**
 * 根据id修改一条数据
 */
async function updateByIdDict(
  id: string,
  model: DictModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dictService.updateById(id, model);
  return result;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsDict(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dictService.deleteByIds(ids);
  return result;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
async function lockByIdsDict(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDict.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const result = await dictService.lockByIds(ids, is_locked);
  return result;
}

/**
 * 导入系统字典
 */
async function importFileDict(
  id: string,
) {
  const result = await dictService.importFile(id);
  return result;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsDict(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dictService.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsDict(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dictService.forceDeleteByIds(ids);
  return result;
}

/**
 * 查找 order_by 字段的最大值
 */
async function findLastOrderByDict() {
  const result = await dictService.findLastOrderBy();
  return result;
}
