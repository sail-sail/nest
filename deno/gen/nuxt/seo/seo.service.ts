import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as seoDao from "./seo.dao.ts";

async function setSearchQuery(
  _search: SeoSearch,
) {
  
}

/**
 * 根据条件查找SEO优化总数
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
 */
export async function findAll(
  search?: SeoSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<SeoModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: SeoModel[] = await seoDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: SeoInput,
) {
  const data = await seoDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个SEO优化
 */
export async function findOne(
  search?: SeoSearch,
  sort?: SortInput[],
): Promise<SeoModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await seoDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找SEO优化
 */
export async function findById(
  id?: SeoId | null,
): Promise<SeoModel | undefined> {
  const model = await seoDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找SEO优化是否存在
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
 */
export async function existById(
  id?: SeoId | null,
): Promise<boolean> {
  const data = await seoDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验SEO优化
 */
export async function validate(
  input: SeoInput,
): Promise<void> {
  const data = await seoDao.validate(input);
  return data;
}

/**
 * 批量创建SEO优化
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
 */
export async function updateById(
  id: SeoId,
  input: SeoInput,
): Promise<SeoId> {
  
  const is_locked = await seoDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 SEO优化";
  }
  
  const id2 = await seoDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除SEO优化
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
        throw "不能删除已经锁定的 SEO优化";
      }
    }
  }
  
  const data = await seoDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 id 设置默认SEO优化
 */
export async function defaultById(
  id: SeoId,
): Promise<number> {
  const data = await seoDao.defaultById(id);
  return data;
}

/**
 * 根据 ids 锁定或者解锁SEO优化
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
 */
export async function revertByIds(
  ids: SeoId[],
): Promise<number> {
  const data = await seoDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除SEO优化
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
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await seoDao.findLastOrderBy();
  return data;
}
