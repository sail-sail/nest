import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import * as dictbizService from "./dictbiz.service.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type DictbizModel,
  type DictbizSearch,
} from "./dictbiz.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountDictbiz(
  search?: DictbizSearch & { $extra?: SearchExtra[] },
) {
  const data = await dictbizService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllDictbiz(
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
export async function exportExcelDictbiz(
  search?: DictbizSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await dictbizService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneDictbiz(
  search?: DictbizSearch & { $extra?: SearchExtra[] },
) {
  const data = await dictbizService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdDictbiz(
  id: string,
) {
  const data = await dictbizService.findById(id);
  return data;
}

/**
 * 创建一条数据
 */
export async function createDictbiz(
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
export async function updateByIdDictbiz(
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
export async function deleteByIdsDictbiz(
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
export async function lockByIdsDictbiz(
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
export async function importFileDictbiz(
  id: string,
) {
  const data = await dictbizService.importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsDictbiz(
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
export async function forceDeleteByIdsDictbiz(
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
export async function findLastOrderByDictbiz() {
  const data = await dictbizService.findLastOrderBy();
  return data;
}
