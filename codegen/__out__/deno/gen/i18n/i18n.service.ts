import {
  ns,
} from "/src/i18n/i18n.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import {
  type I18nInput,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type I18nModel,
  type I18nSearch,
} from "./i18n.model.ts";

import * as i18nDao from "./i18n.dao.ts";

/**
 * 根据条件查找总数
 * @param {I18nSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: I18nSearch,
): Promise<number> {
  search = search || { };
  const data = await i18nDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
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
  const data: I18nModel[] = await i18nDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {I18nSearch} search? 搜索条件
 */
export async function findOne(
  search?: I18nSearch,
  sort?: SortInput|SortInput[],
) {
  search = search || { };
  const data = await i18nDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await i18nDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {I18nSearch} search? 搜索条件
 */
export async function exist(
  search?: I18nSearch,
) {
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
) {
  const data = await i18nDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {I18nModel} model
 * @return {Promise<string>} id
 */
export async function create(
  model: I18nModel,
): Promise<string> {
  const data = await i18nDao.create(model);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {I18nModel} model
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  model: I18nModel,
): Promise<string> {
  const data = await i18nDao.updateById(id, model);
  
  {
    const optionsSrcDao = await import("/src/options/options.dao.ts");
    await optionsSrcDao.updateI18n_version();
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
    const optionsSrcDao = await import("/src/options/options.dao.ts");
    await optionsSrcDao.updateI18n_version();
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
 * 批量导入
 * @param {I18nInput[]} models
 */
export async function importModels(
  models: I18nInput[],
) {
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      await i18nDao.create(model, { uniqueType: "update" });
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(await ns("第 {0} 行: {1}", (i + 1).toString(), err.message || err.toString()));
    }
  }
  
  let data = "";
  if (succNum > 0) {
    data = await ns("导入成功 {0} 条", succNum.toString());
    data += "\n";
  }
  if (failNum > 0) {
    data += await ns("导入失败 {0} 条", failNum.toString());
    data += "\n";
  }
  if (failErrMsgs.length > 0) {
    data += failErrMsgs.join("\n");
  }
  
  if (succNum > 0) {
    const optionsSrcDao = await import("/src/options/options.dao.ts");
    await optionsSrcDao.updateI18n_version();
  }
  
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const data = await i18nDao.getFieldComments();
  return data;
}
