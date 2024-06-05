import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as seoDao from "./seo.dao.ts";

async function setSearchQuery(
  search: SeoSearch,
) {
  
}

/**
 * 根据条件查找SEO优化总数
 * @param {SeoSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: SeoSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await seoDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找SEO优化列表
 * @param {SeoSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<SeoModel[]>} 
 */
export async function findAll(
  search?: SeoSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<SeoModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: SeoModel[] = await seoDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: SeoInput,
) {
  const data = await seoDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个SEO优化
 * @param {SeoSearch} search? 搜索条件
 */
export async function findOne(
  search?: SeoSearch,
  sort?: SortInput|SortInput[],
): Promise<SeoModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await seoDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找SEO优化
 * @param {SeoId} id
 */
export async function findById(
  id?: SeoId | null,
): Promise<SeoModel | undefined> {
  const model = await seoDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找SEO优化是否存在
 * @param {SeoSearch} search? 搜索条件
 */
export async function exist(
  search?: SeoSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await seoDao.exist(search);
  return data;
}

/**
 * 根据 id 查找SEO优化是否存在
 * @param {SeoId} id
 */
export async function existById(
  id?: SeoId | null,
): Promise<boolean> {
  const data = await seoDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验SEO优化
 * @param input 
 */
export async function validate(
  input: SeoInput,
): Promise<void> {
  const data = await seoDao.validate(input);
  return data;
}

/**
 * 批量创建SEO优化
 * @param {SeoInput[]} inputs
 * @return {Promise<SeoId[]>} ids
 */
export async function creates(
  inputs: SeoInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<SeoId[]> {
  const ids = await seoDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改SEO优化
 * @param {SeoId} id
 * @param {SeoInput} input
 * @return {Promise<SeoId>}
 */
export async function updateById(
  id: SeoId,
  input: SeoInput,
): Promise<SeoId> {
  
  const is_locked = await seoDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2 = await seoDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除SEO优化
 * @param {SeoId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: SeoId[],
): Promise<number> {
  
  {
    const models = await seoDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw await ns("不能删除已经锁定的 {0}", "SEO优化");
      }
    }
  }
  
  const data = await seoDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 id 设置默认SEO优化
 * @param {SeoId} id
 * @return {Promise<number>}
 */
export async function defaultById(
  id: SeoId,
): Promise<number> {
  const data = await seoDao.defaultById(id);
  return data;
}

/**
 * 根据 ids 锁定或者解锁SEO优化
 * @param {SeoId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: SeoId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await seoDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原SEO优化
 * @param {SeoId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: SeoId[],
): Promise<number> {
  const data = await seoDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除SEO优化
 * @param {SeoId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: SeoId[],
): Promise<number> {
  const data = await seoDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取SEO优化字段注释
 */
export async function getFieldComments(): Promise<SeoFieldComment> {
  const data = await seoDao.getFieldComments();
  return data;
}

/**
 * 查找 SEO优化 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await seoDao.findLastOrderBy();
  return data;
}
