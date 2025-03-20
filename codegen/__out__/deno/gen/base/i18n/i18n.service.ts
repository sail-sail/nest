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
export async function findCount(
  search?: I18nSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const i18n_num = await i18nDao.findCount(search);
  
  return i18n_num;
}

/**
 * 根据搜索条件和分页查找国际化列表
 */
export async function findAll(
  search?: I18nSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<I18nModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const i18n_models = await i18nDao.findAll(search, page, sort);
  
  return i18n_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: I18nInput,
): Promise<void> {
  await i18nDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个国际化
 */
export async function findOne(
  search?: I18nSearch,
  sort?: SortInput[],
): Promise<I18nModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const i18n_model = await i18nDao.findOne(search, sort);
  
  return i18n_model;
}

/**
 * 根据 id 查找国际化
 */
export async function findById(
  i18n_id?: I18nId | null,
): Promise<I18nModel | undefined> {
  
  const i18n_model = await i18nDao.findById(i18n_id);
  
  return i18n_model;
}

/**
 * 根据 ids 查找国际化
 */
export async function findByIds(
  i18n_ids: I18nId[],
): Promise<I18nModel[]> {
  
  const i18n_models = await i18nDao.findByIds(i18n_ids);
  
  return i18n_models;
}

/**
 * 根据搜索条件查找国际化是否存在
 */
export async function exist(
  search?: I18nSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const i18n_exist = await i18nDao.exist(search);
  
  return i18n_exist;
}

/**
 * 根据 id 查找国际化是否存在
 */
export async function existById(
  i18n_id?: I18nId | null,
): Promise<boolean> {
  
  const i18n_exist = await i18nDao.existById(i18n_id);
  
  return i18n_exist;
}

/**
 * 增加和修改时校验国际化
 */
export async function validate(
  input: I18nInput,
): Promise<void> {
  await i18nDao.validate(input);
}

/**
 * 批量创建国际化
 */
export async function creates(
  inputs: I18nInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<I18nId[]> {
  const i18n_ids = await i18nDao.creates(inputs, options);
  
  await update_i18n_version();
  
  return i18n_ids;
}

/**
 * 根据 id 修改国际化
 */
export async function updateById(
  i18n_id: I18nId,
  input: I18nInput,
): Promise<I18nId> {
  
  const i18n_id2 = await i18nDao.updateById(i18n_id, input);
  
  await update_i18n_version();
  
  return i18n_id2;
}

/** 校验国际化是否存在 */
export async function validateOption(
  model0?: I18nModel,
): Promise<I18nModel> {
  const i18n_model = await i18nDao.validateOption(model0);
  return i18n_model;
}

/**
 * 根据 ids 删除国际化
 */
export async function deleteByIds(
  i18n_ids: I18nId[],
): Promise<number> {
  
  const i18n_num = await i18nDao.deleteByIds(i18n_ids);
  
  await update_i18n_version();
  return i18n_num;
}

/**
 * 根据 ids 还原国际化
 */
export async function revertByIds(
  i18n_ids: I18nId[],
): Promise<number> {
  
  const i18n_num = await i18nDao.revertByIds(i18n_ids);
  
  return i18n_num;
}

/**
 * 根据 ids 彻底删除国际化
 */
export async function forceDeleteByIds(
  i18n_ids: I18nId[],
): Promise<number> {
  
  const i18n_num = await i18nDao.forceDeleteByIds(i18n_ids);
  
  return i18n_num;
}

/**
 * 获取国际化字段注释
 */
export async function getFieldComments(): Promise<I18nFieldComment> {
  const i18n_fields = await i18nDao.getFieldComments();
  return i18n_fields;
}
