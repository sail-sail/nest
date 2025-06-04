import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";
  
import {
  update_i18n_version,
} from "/src/base/options/options.dao.ts";

import * as i18nDao from "./i18n.dao.ts";

async function setSearchQuery(
  _search: I18nSearch,
) {
  
}

/**
 * 根据条件查找国际化总数
 */
export async function findCountI18n(
  search?: I18nSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const i18n_num = await i18nDao.findCountI18n(search);
  
  return i18n_num;
}

/**
 * 根据搜索条件和分页查找国际化列表
 */
export async function findAllI18n(
  search?: I18nSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<I18nModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const i18n_models = await i18nDao.findAllI18n(search, page, sort);
  
  return i18n_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblI18n(
  input: I18nInput,
): Promise<void> {
  await i18nDao.setIdByLblI18n(input);
}

/**
 * 根据条件查找第一个国际化
 */
export async function findOneI18n(
  search?: I18nSearch,
  sort?: SortInput[],
): Promise<I18nModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const i18n_model = await i18nDao.findOneI18n(search, sort);
  
  return i18n_model;
}

/**
 * 根据条件查找第一个国际化, 如果不存在则抛错
 */
export async function findOneOkI18n(
  search?: I18nSearch,
  sort?: SortInput[],
): Promise<I18nModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const i18n_model = await i18nDao.findOneOkI18n(search, sort);
  
  return i18n_model;
}

/**
 * 根据 id 查找国际化
 */
export async function findByIdI18n(
  i18n_id: I18nId,
): Promise<I18nModel | undefined> {
  
  const i18n_model = await i18nDao.findByIdI18n(i18n_id);
  
  return i18n_model;
}

/**
 * 根据 id 查找国际化, 如果不存在则抛错
 */
export async function findByIdOkI18n(
  i18n_id: I18nId,
): Promise<I18nModel> {
  
  const i18n_model = await i18nDao.findByIdOkI18n(i18n_id);
  
  return i18n_model;
}

/**
 * 根据 ids 查找国际化
 */
export async function findByIdsI18n(
  i18n_ids: I18nId[],
): Promise<I18nModel[]> {
  
  const i18n_models = await i18nDao.findByIdsI18n(i18n_ids);
  
  return i18n_models;
}

/**
 * 根据 ids 查找国际化, 出现查询不到的 id 则报错
 */
export async function findByIdsOkI18n(
  i18n_ids: I18nId[],
): Promise<I18nModel[]> {
  
  const i18n_models = await i18nDao.findByIdsOkI18n(i18n_ids);
  
  return i18n_models;
}

/**
 * 根据搜索条件查找国际化是否存在
 */
export async function existI18n(
  search?: I18nSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const i18n_exist = await i18nDao.existI18n(search);
  
  return i18n_exist;
}

/**
 * 根据 id 查找国际化是否存在
 */
export async function existByIdI18n(
  i18n_id?: I18nId | null,
): Promise<boolean> {
  
  const i18n_exist = await i18nDao.existByIdI18n(i18n_id);
  
  return i18n_exist;
}

/**
 * 增加和修改时校验国际化
 */
export async function validateI18n(
  input: I18nInput,
): Promise<void> {
  await i18nDao.validateI18n(input);
}

/**
 * 批量创建国际化
 */
export async function createsI18n(
  inputs: I18nInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<I18nId[]> {
  const i18n_ids = await i18nDao.createsI18n(inputs, options);
  
  await update_i18n_version();
  
  return i18n_ids;
}

/**
 * 根据 id 修改国际化
 */
export async function updateByIdI18n(
  i18n_id: I18nId,
  input: I18nInput,
): Promise<I18nId> {
  
  const i18n_id2 = await i18nDao.updateByIdI18n(i18n_id, input);
  
  await update_i18n_version();
  
  return i18n_id2;
}

/** 校验国际化是否存在 */
export async function validateOptionI18n(
  model0?: I18nModel,
): Promise<I18nModel> {
  const i18n_model = await i18nDao.validateOptionI18n(model0);
  return i18n_model;
}

/**
 * 根据 ids 删除国际化
 */
export async function deleteByIdsI18n(
  i18n_ids: I18nId[],
): Promise<number> {
  
  const i18n_num = await i18nDao.deleteByIdsI18n(i18n_ids);
  
  await update_i18n_version();
  return i18n_num;
}

/**
 * 根据 ids 还原国际化
 */
export async function revertByIdsI18n(
  i18n_ids: I18nId[],
): Promise<number> {
  
  const i18n_num = await i18nDao.revertByIdsI18n(i18n_ids);
  
  return i18n_num;
}

/**
 * 根据 ids 彻底删除国际化
 */
export async function forceDeleteByIdsI18n(
  i18n_ids: I18nId[],
): Promise<number> {
  
  const i18n_num = await i18nDao.forceDeleteByIdsI18n(i18n_ids);
  
  return i18n_num;
}

/**
 * 获取国际化字段注释
 */
export async function getFieldCommentsI18n(): Promise<I18nFieldComment> {
  const i18n_fields = await i18nDao.getFieldCommentsI18n();
  return i18n_fields;
}
