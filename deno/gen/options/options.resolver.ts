import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as optionsService
} from "./options.service.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type OptionsModel,
  type OptionsSearch,
} from "./options.model.ts";

export const _internals = {
  findCountOptions,
  findAllOptions,
  exportExcelOptions,
  findOneOptions,
  findByIdOptions,
  createOptions,
  updateByIdOptions,
  deleteByIdsOptions,lockByIdsOptions,
  importFileOptions,
  revertByIdsOptions,
  forceDeleteByIdsOptions,
  findLastOrderByOptions,
};

/**
 * 根据条件查找据数总数
 */
async function findCountOptions(
  search?: OptionsSearch & { $extra?: SearchExtra[] },
) {
  const data = await optionsService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllOptions(
  search?: OptionsSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const data = await optionsService.findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelOptions(
  search?: OptionsSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await optionsService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneOptions(
  search?: OptionsSearch & { $extra?: SearchExtra[] },
) {
  const data = await optionsService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdOptions(
  id: string,
) {
  const data = await optionsService.findById(id);
  return data;
}

/**
 * 创建一条数据
 */
async function createOptions(
  model: OptionsModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await optionsService.create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
async function updateByIdOptions(
  id: string,
  model: OptionsModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await optionsService.updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsOptions(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await optionsService.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
async function lockByIdsOptions(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsOptions.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const data = await optionsService.lockByIds(ids, is_locked);
  return data;
}

/**
 * 导入系统选项
 */
async function importFileOptions(
  id: string,
) {
  const data = await optionsService.importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsOptions(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await optionsService.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsOptions(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await optionsService.forceDeleteByIds(ids);
  return data;
}

/**
 * 查找 order_by 字段的最大值
 */
async function findLastOrderByOptions() {
  const data = await optionsService.findLastOrderBy();
  return data;
}
