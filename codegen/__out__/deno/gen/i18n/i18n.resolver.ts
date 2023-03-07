import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as i18nService
} from "./i18n.service.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type I18nModel,
  type I18nSearch,
} from "./i18n.model.ts";

export const _internals = {
  findCountI18n,
  findAllI18n,
  exportExcelI18n,
  findOneI18n,
  findByIdI18n,
  createI18n,
  updateByIdI18n,
  deleteByIdsI18n,
  importFileI18n,
  revertByIdsI18n,
  forceDeleteByIdsI18n,
};

/**
 * 根据条件查找据数总数
 */
async function findCountI18n(
  search?: I18nSearch & { $extra?: SearchExtra[] },
) {
  const data = await i18nService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllI18n(
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
async function exportExcelI18n(
  search?: I18nSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await i18nService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneI18n(
  search?: I18nSearch & { $extra?: SearchExtra[] },
) {
  const data = await i18nService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdI18n(
  id: string,
) {
  const data = await i18nService.findById(id);
  return data;
}

/**
 * 创建一条数据
 */
async function createI18n(
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
async function updateByIdI18n(
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
async function deleteByIdsI18n(
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
async function importFileI18n(
  id: string,
) {
  const data = await i18nService.importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsI18n(
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
async function forceDeleteByIdsI18n(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await i18nService.forceDeleteByIds(ids);
  return data;
}
