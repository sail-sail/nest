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
  
  const seo_num = await seoDao.findCount(search);
  
  return seo_num;
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
  
  const seo_models = await seoDao.findAll(search, page, sort);
  
  return seo_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: SeoInput,
): Promise<void> {
  await seoDao.setIdByLbl(input);
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
  
  const seo_model = await seoDao.findOne(search, sort);
  
  return seo_model;
}

/**
 * 根据 id 查找SEO优化
 */
export async function findById(
  seo_id?: SeoId | null,
): Promise<SeoModel | undefined> {
  
  const seo_model = await seoDao.findById(seo_id);
  
  return seo_model;
}

/**
 * 根据 ids 查找SEO优化
 */
export async function findByIds(
  seo_ids: SeoId[],
): Promise<SeoModel[]> {
  
  const seo_models = await seoDao.findByIds(seo_ids);
  
  return seo_models;
}

/**
 * 根据搜索条件查找SEO优化是否存在
 */
export async function exist(
  search?: SeoSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const seo_exist = await seoDao.exist(search);
  
  return seo_exist;
}

/**
 * 根据 id 查找SEO优化是否存在
 */
export async function existById(
  seo_id?: SeoId | null,
): Promise<boolean> {
  
  const seo_exist = await seoDao.existById(seo_id);
  
  return seo_exist;
}

/**
 * 增加和修改时校验SEO优化
 */
export async function validate(
  input: SeoInput,
): Promise<void> {
  await seoDao.validate(input);
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
  const seo_ids = await seoDao.creates(inputs, options);
  
  return seo_ids;
}

/**
 * 根据 id 修改SEO优化
 */
export async function updateById(
  seo_id: SeoId,
  input: SeoInput,
): Promise<SeoId> {
  
  const is_locked = await seoDao.getIsLockedById(seo_id);
  if (is_locked) {
    throw "不能修改已经锁定的 SEO优化";
  }
  
  const seo_id2 = await seoDao.updateById(seo_id, input);
  
  return seo_id2;
}

/** 校验SEO优化是否存在 */
export async function validateOption(
  model0?: SeoModel,
): Promise<SeoModel> {
  const seo_model = await seoDao.validateOption(model0);
  return seo_model;
}

/**
 * 根据 ids 删除SEO优化
 */
export async function deleteByIds(
  seo_ids: SeoId[],
): Promise<number> {
  
  const old_models = await seoDao.findByIds(seo_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 SEO优化";
    }
  }
  
  const seo_num = await seoDao.deleteByIds(seo_ids);
  return seo_num;
}

/**
 * 根据 id 设置默认SEO优化
 */
export async function defaultById(
  id: SeoId,
): Promise<number> {
  const seo_num = await seoDao.defaultById(id);
  return seo_num;
}

/**
 * 根据 ids 锁定或者解锁SEO优化
 */
export async function lockByIds(
  seo_ids: SeoId[],
  is_locked: 0 | 1,
): Promise<number> {
  const seo_num = await seoDao.lockByIds(seo_ids, is_locked);
  return seo_num;
}

/**
 * 根据 ids 还原SEO优化
 */
export async function revertByIds(
  seo_ids: SeoId[],
): Promise<number> {
  
  const seo_num = await seoDao.revertByIds(seo_ids);
  
  return seo_num;
}

/**
 * 根据 ids 彻底删除SEO优化
 */
export async function forceDeleteByIds(
  seo_ids: SeoId[],
): Promise<number> {
  
  const seo_num = await seoDao.forceDeleteByIds(seo_ids);
  
  return seo_num;
}

/**
 * 获取SEO优化字段注释
 */
export async function getFieldComments(): Promise<SeoFieldComment> {
  const seo_fields = await seoDao.getFieldComments();
  return seo_fields;
}

/**
 * 查找 SEO优化 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const seo_sort = await seoDao.findLastOrderBy();
  return seo_sort;
}
