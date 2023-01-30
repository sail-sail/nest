import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as dictbiz_detailService
} from "./dictbiz_detail.service.ts";

import {
  type Dictbiz_DetailModel,
  type Dictbiz_DetailSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

export const _internals = {
  findCountDictbiz_detail,
  findAllDictbiz_detail,
  exportExcelDictbiz_detail,
  findOneDictbiz_detail,
  findByIdDictbiz_detail,
  createDictbiz_detail,
  updateByIdDictbiz_detail,
  deleteByIdsDictbiz_detail,lockByIdsDictbiz_detail,
  importFileDictbiz_detail,
  revertByIdsDictbiz_detail,
  forceDeleteByIdsDictbiz_detail,
  findLastOrderByDictbiz_detail,
};

/**
 * 根据条件查找据数总数
 */
async function findCountDictbiz_detail(
  search?: Dictbiz_DetailSearch & { $extra?: SearchExtra[] },
) {
  const result = await dictbiz_detailService.findCount(search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllDictbiz_detail(
  search?: Dictbiz_DetailSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await dictbiz_detailService.findAll(search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelDictbiz_detail(
  search?: Dictbiz_DetailSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await dictbiz_detailService.exportExcel(search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneDictbiz_detail(
  search?: Dictbiz_DetailSearch & { $extra?: SearchExtra[] },
) {
  const result = await dictbiz_detailService.findOne(search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdDictbiz_detail(
  id: string,
) {
  const result = await dictbiz_detailService.findById(id);
  return result;
}

/**
 * 创建一条数据
 */
async function createDictbiz_detail(
  model: Dictbiz_DetailModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dictbiz_detailService.create(model);
  return result;
}

/**
 * 根据id修改一条数据
 */
async function updateByIdDictbiz_detail(
  id: string,
  model: Dictbiz_DetailModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dictbiz_detailService.updateById(id, model);
  return result;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsDictbiz_detail(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dictbiz_detailService.deleteByIds(ids);
  return result;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
async function lockByIdsDictbiz_detail(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDictbiz_detail.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const result = await dictbiz_detailService.lockByIds(ids, is_locked);
  return result;
}

/**
 * 导入业务字典明细
 */
async function importFileDictbiz_detail(
  id: string,
) {
  const result = await dictbiz_detailService.importFile(id);
  return result;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsDictbiz_detail(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dictbiz_detailService.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsDictbiz_detail(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await dictbiz_detailService.forceDeleteByIds(ids);
  return result;
}

/**
 * 查找 order_by 字段的最大值
 */
async function findLastOrderByDictbiz_detail() {
  const result = await dictbiz_detailService.findLastOrderBy();
  return result;
}
