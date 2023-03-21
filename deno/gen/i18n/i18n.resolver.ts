import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import * as i18nService from "./i18n.service.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type I18nModel,
  type I18nSearch,
} from "./i18n.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountI18n(
  search?: I18nSearch & { $extra?: SearchExtra[] },
) {
  const data = await i18nService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllI18n(
  search?: I18nSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const data = await i18nService.findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelI18n(
  search?: I18nSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await i18nService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneI18n(
  search?: I18nSearch & { $extra?: SearchExtra[] },
) {
  const data = await i18nService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdI18n(
  id: string,
) {
  const data = await i18nService.findById(id);
  return data;
}

/**
 * 创建一条数据
 */
export async function createI18n(
  model: I18nModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await i18nService.create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdI18n(
  id: string,
  model: I18nModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await i18nService.updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsI18n(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await i18nService.deleteByIds(ids);
  return data;
}

/**
 * 导入国际化
 */
export async function importFileI18n(
  id: string,
) {
  const data = await i18nService.importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsI18n(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await i18nService.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsI18n(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await i18nService.forceDeleteByIds(ids);
  return data;
}
