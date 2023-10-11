

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  I18Ninput,
  I18Nmodel,
  I18Nsearch,
  I18NfieldComment,
} from "./i18n.model.ts";

import * as i18nDao from "./i18n.dao.ts";

/**
 * 根据条件查找总数
 * @param {I18Nsearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: I18Nsearch,
): Promise<number> {
  search = search || { };
  const data = await i18nDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {I18Nsearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<I18Nmodel[]>} 
 */
export async function findAll(
  search?: I18Nsearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<I18Nmodel[]> {
  search = search || { };
  const models: I18Nmodel[] = await i18nDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: I18Ninput,
) {
  const data = await i18nDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {I18Nsearch} search? 搜索条件
 */
export async function findOne(
  search?: I18Nsearch,
  sort?: SortInput|SortInput[],
): Promise<I18Nmodel | undefined> {
  search = search || { };
  const model = await i18nDao.findOne(search, sort);
  return model;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
): Promise<I18Nmodel | undefined> {
  const model = await i18nDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {I18Nsearch} search? 搜索条件
 */
export async function exist(
  search?: I18Nsearch,
): Promise<boolean> {
  search = search || { };
  const data = await i18nDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
): Promise<boolean> {
  const data = await i18nDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: I18Ninput,
): Promise<void> {
  const data = await i18nDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {I18Ninput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: I18Ninput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const data = await i18nDao.create(input, options);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {I18Ninput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: I18Ninput,
): Promise<string> {
  
  const data = await i18nDao.updateById(id, input);
  
  {
    const optionsDaoSrc = await import("/src/base/options/options.dao.ts");
    await optionsDaoSrc.updateI18n_version();
  }
  return data;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
): Promise<number> {
  
  const data = await i18nDao.deleteByIds(ids);
  
  {
    const optionsDaoSrc = await import("/src/base/options/options.dao.ts");
    await optionsDaoSrc.updateI18n_version();
  }
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
): Promise<number> {
  const data = await i18nDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: string[],
): Promise<number> {
  const data = await i18nDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<I18NfieldComment> {
  const data = await i18nDao.getFieldComments();
  return data;
}
