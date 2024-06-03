import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as langDao from "./lang.dao.ts";

async function setSearchQuery(
  search: LangSearch,
) {
  
}

/**
 * 根据条件查找语言总数
 * @param {LangSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: LangSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await langDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找语言列表
 * @param {LangSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<LangModel[]>} 
 */
export async function findAll(
  search?: LangSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<LangModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: LangModel[] = await langDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: LangInput,
) {
  const data = await langDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个语言
 * @param {LangSearch} search? 搜索条件
 */
export async function findOne(
  search?: LangSearch,
  sort?: SortInput|SortInput[],
): Promise<LangModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await langDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找语言
 * @param {LangId} id
 */
export async function findById(
  id?: LangId | null,
): Promise<LangModel | undefined> {
  const model = await langDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找语言是否存在
 * @param {LangSearch} search? 搜索条件
 */
export async function exist(
  search?: LangSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await langDao.exist(search);
  return data;
}

/**
 * 根据 id 查找语言是否存在
 * @param {LangId} id
 */
export async function existById(
  id?: LangId | null,
): Promise<boolean> {
  const data = await langDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验语言
 * @param input 
 */
export async function validate(
  input: LangInput,
): Promise<void> {
  const data = await langDao.validate(input);
  return data;
}

/**
 * 批量创建语言
 * @param {LangInput[]} inputs
 * @return {Promise<LangId[]>} ids
 */
export async function creates(
  inputs: LangInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<LangId[]> {
  const ids = await langDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改语言
 * @param {LangId} id
 * @param {LangInput} input
 * @return {Promise<LangId>}
 */
export async function updateById(
  id: LangId,
  input: LangInput,
): Promise<LangId> {
  
  // 不能修改系统记录的系统字段
  const model = await langDao.findById(id);
  if (model && model.is_sys === 1) {
  }
  
  const id2 = await langDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除语言
 * @param {LangId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: LangId[],
): Promise<number> {
  
  {
    const models = await langDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw await ns("不能删除系统记录");
      }
    }
  }
  
  const data = await langDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用语言
 * @param {LangId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: LangId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await langDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 还原语言
 * @param {LangId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: LangId[],
): Promise<number> {
  const data = await langDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除语言
 * @param {LangId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: LangId[],
): Promise<number> {
  const data = await langDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取语言字段注释
 */
export async function getFieldComments(): Promise<LangFieldComment> {
  const data = await langDao.getFieldComments();
  return data;
}

/**
 * 查找 语言 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await langDao.findLastOrderBy();
  return data;
}
