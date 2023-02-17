import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as dictbizService
} from "./dictbiz.service.ts";

import {
  type DictbizModel,
  type DictbizSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

export const _internals = {
  findCountDictbiz,
  findAllDictbiz,
  exportExcelDictbiz,
  findOneDictbiz,
  findByIdDictbiz,
  createDictbiz,
  updateByIdDictbiz,
  deleteByIdsDictbiz,lockByIdsDictbiz,
  importFileDictbiz,
  revertByIdsDictbiz,
  forceDeleteByIdsDictbiz,
  findLastOrderByDictbiz,
};

/**
 * 根据条件查找据数总数
 */
async function findCountDictbiz(
  search?: DictbizSearch & { $extra?: SearchExtra[] },
) {
  const data = await dictbizService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllDictbiz(
  search?: DictbizSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const data = await dictbizService.findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelDictbiz(
  search?: DictbizSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await dictbizService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneDictbiz(
  search?: DictbizSearch & { $extra?: SearchExtra[] },
) {
  const data = await dictbizService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdDictbiz(
  id: string,
) {
  const data = await dictbizService.findById(id);
  return data;
}

/**
 * 创建一条数据
 */
async function createDictbiz(
  model: DictbizModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await dictbizService.create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
async function updateByIdDictbiz(
  id: string,
  model: DictbizModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await dictbizService.updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsDictbiz(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await dictbizService.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
async function lockByIdsDictbiz(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDictbiz.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const data = await dictbizService.lockByIds(ids, is_locked);
  return data;
}

/**
 * 导入业务字典
 */
async function importFileDictbiz(
  id: string,
) {
  const data = await dictbizService.importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsDictbiz(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await dictbizService.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsDictbiz(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await dictbizService.forceDeleteByIds(ids);
  return data;
}

/**
 * 查找 order_by 字段的最大值
 */
async function findLastOrderByDictbiz() {
  const data = await dictbizService.findLastOrderBy();
  return data;
}
