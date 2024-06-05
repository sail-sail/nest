import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as i18nDao from "./i18n.dao.ts";

async function setSearchQuery(
  search: I18nSearch,
) {
  
}

/**
 * 根据条件查找国际化总数
 * @param {I18nSearch} search? 搜索条件
 * @return {Promise<number>}
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
 * @param {I18nSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<I18nModel[]>} 
 */
export async function findAll(
  search?: I18nSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<I18nModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: I18nModel[] = await i18nDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: I18nInput,
) {
  const data = await i18nDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个国际化
 * @param {I18nSearch} search? 搜索条件
 */
export async function findOne(
  search?: I18nSearch,
  sort?: SortInput|SortInput[],
): Promise<I18nModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await i18nDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找国际化
 * @param {I18nId} id
 */
export async function findById(
  id?: I18nId | null,
): Promise<I18nModel | undefined> {
  const model = await i18nDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找国际化是否存在
 * @param {I18nSearch} search? 搜索条件
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
 * @param {I18nId} id
 */
export async function existById(
  id?: I18nId | null,
): Promise<boolean> {
  const data = await i18nDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验国际化
 * @param input 
 */
export async function validate(
  input: I18nInput,
): Promise<void> {
  const data = await i18nDao.validate(input);
  return data;
}

/**
 * 批量创建国际化
 * @param {I18nInput[]} inputs
 * @return {Promise<I18nId[]>} ids
 */
export async function creates(
  inputs: I18nInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<I18nId[]> {
  const ids = await i18nDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改国际化
 * @param {I18nId} id
 * @param {I18nInput} input
 * @return {Promise<I18nId>}
 */
export async function updateById(
  id: I18nId,
  input: I18nInput,
): Promise<I18nId> {
  
  const id2 = await i18nDao.updateById(id, input);
  
  {
    const {
      updateI18n_version,
    } = await import("/src/base/options/options.dao.ts");
    
    await updateI18n_version();
  }
  return id2;
}

/**
 * 根据 ids 删除国际化
 * @param {I18nId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: I18nId[],
): Promise<number> {
  
  const data = await i18nDao.deleteByIds(ids);
  
  {
    const optionsDaoSrc = await import("/src/base/options/options.dao.ts");
    await optionsDaoSrc.updateI18n_version();
  }
  return data;
}

/**
 * 根据 ids 还原国际化
 * @param {I18nId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: I18nId[],
): Promise<number> {
  const data = await i18nDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除国际化
 * @param {I18nId[]} ids
 * @return {Promise<number>}
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
