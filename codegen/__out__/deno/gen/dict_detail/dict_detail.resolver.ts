import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import * as dict_detailService from "./dict_detail.service.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type Dict_DetailModel,
  type Dict_DetailSearch,
} from "./dict_detail.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountDict_detail(
  search?: Dict_DetailSearch & { $extra?: SearchExtra[] },
) {
  const data = await dict_detailService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllDict_detail(
  search?: Dict_DetailSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const data = await dict_detailService.findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelDict_detail(
  search?: Dict_DetailSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await dict_detailService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneDict_detail(
  search?: Dict_DetailSearch & { $extra?: SearchExtra[] },
) {
  const data = await dict_detailService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdDict_detail(
  id: string,
) {
  const data = await dict_detailService.findById(id);
  return data;
}

/**
 * 创建一条数据
 */
export async function createDict_detail(
  model: Dict_DetailModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await dict_detailService.create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdDict_detail(
  id: string,
  model: Dict_DetailModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await dict_detailService.updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsDict_detail(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await dict_detailService.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsDict_detail(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDict_detail.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const data = await dict_detailService.lockByIds(ids, is_locked);
  return data;
}

/**
 * 导入系统字典明细
 */
export async function importFileDict_detail(
  id: string,
) {
  const data = await dict_detailService.importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsDict_detail(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await dict_detailService.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsDict_detail(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await dict_detailService.forceDeleteByIds(ids);
  return data;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByDict_detail() {
  const data = await dict_detailService.findLastOrderBy();
  return data;
}
