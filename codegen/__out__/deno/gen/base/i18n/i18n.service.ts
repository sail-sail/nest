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
  
  const data = await i18nDao.findCount(search);
  return data;
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
  
  const models: I18nModel[] = await i18nDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: I18nInput,
) {
  const data = await i18nDao.setIdByLbl(input);
  return data;
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
  
  const model = await i18nDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找国际化
 */
export async function findById(
  id?: I18nId | null,
): Promise<I18nModel | undefined> {
  const model = await i18nDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找国际化是否存在
 */
export async function exist(
  search?: I18nSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await i18nDao.exist(search);
  return data;
}

/**
 * 根据 id 查找国际化是否存在
 */
export async function existById(
  id?: I18nId | null,
): Promise<boolean> {
  const data = await i18nDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验国际化
 */
export async function validate(
  input: I18nInput,
): Promise<void> {
  const data = await i18nDao.validate(input);
  return data;
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
  const ids = await i18nDao.creates(inputs, options);
  
  await update_i18n_version();
  return ids;
}

/**
 * 根据 id 修改国际化
 */
export async function updateById(
  id: I18nId,
  input: I18nInput,
): Promise<I18nId> {
  
  const id2 = await i18nDao.updateById(id, input);
  
  await update_i18n_version();
  return id2;
}

/** 校验国际化是否存在 */
export async function validateOption(
  model0?: I18nModel,
): Promise<I18nModel> {
  const model = await i18nDao.validateOption(model0);
  return model;
}

/**
 * 根据 ids 删除国际化
 */
export async function deleteByIds(
  ids: I18nId[],
): Promise<number> {
  
  const data = await i18nDao.deleteByIds(ids);
  
  await update_i18n_version();
  return data;
}

/**
 * 根据 ids 还原国际化
 */
export async function revertByIds(
  ids: I18nId[],
): Promise<number> {
  const data = await i18nDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除国际化
 */
export async function forceDeleteByIds(
  ids: I18nId[],
): Promise<number> {
  const data = await i18nDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取国际化字段注释
 */
export async function getFieldComments(): Promise<I18nFieldComment> {
  const data = await i18nDao.getFieldComments();
  return data;
}
