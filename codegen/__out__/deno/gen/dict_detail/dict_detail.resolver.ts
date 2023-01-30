import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as dict_detailService
} from "./dict_detail.service.ts";

import {
  type Dict_DetailModel,
  type Dict_DetailSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

export const _internals = {
  findCountDict_detail,
  findAllDict_detail,
  exportExcelDict_detail,
  findOneDict_detail,
  findByIdDict_detail,
  createDict_detail,
  updateByIdDict_detail,
  deleteByIdsDict_detail,lockByIdsDict_detail,
  importFileDict_detail,
  revertByIdsDict_detail,
  forceDeleteByIdsDict_detail,
  findLastOrderByDict_detail,
};

/**
 * 根据条件查找据数总数
 */
async function findCountDict_detail(
  search?: Dict_DetailSearch & { $extra?: SearchExtra[] },
) {
  const result = await dict_detailService.findCount(search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllDict_detail(
  search?: Dict_DetailSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await dict_detailService.findAll(search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelDict_detail(
  search?: Dict_DetailSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await dict_detailService.exportExcel(search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneDict_detail(
  search?: Dict_DetailSearch & { $extra?: SearchExtra[] },
) {
  const result = await dict_detailService.findOne(search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdDict_detail(
  id: string,
) {
  const result = await dict_detailService.findById(id);
  return result;
}

/**
 * 创建一条数据
 */
async function createDict_detail(
  model: Dict_DetailModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dict_detailService.create(model);
  return result;
}

/**
 * 根据id修改一条数据
 */
async function updateByIdDict_detail(
  id: string,
  model: Dict_DetailModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dict_detailService.updateById(id, model);
  return result;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsDict_detail(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dict_detailService.deleteByIds(ids);
  return result;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
async function lockByIdsDict_detail(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDict_detail.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const result = await dict_detailService.lockByIds(ids, is_locked);
  return result;
}

/**
 * 导入系统字典明细
 */
async function importFileDict_detail(
  id: string,
) {
  const result = await dict_detailService.importFile(id);
  return result;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsDict_detail(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dict_detailService.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsDict_detail(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dict_detailService.forceDeleteByIds(ids);
  return result;
}

/**
 * 查找 order_by 字段的最大值
 */
async function findLastOrderByDict_detail() {
  const result = await dict_detailService.findLastOrderBy();
  return result;
}
