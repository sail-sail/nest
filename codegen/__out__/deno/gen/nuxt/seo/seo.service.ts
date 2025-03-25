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
export async function findCountSeo(
  search?: SeoSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const seo_num = await seoDao.findCountSeo(search);
  
  return seo_num;
}

/**
 * 根据搜索条件和分页查找SEO优化列表
 */
export async function findAllSeo(
  search?: SeoSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<SeoModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const seo_models = await seoDao.findAllSeo(search, page, sort);
  
  return seo_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblSeo(
  input: SeoInput,
): Promise<void> {
  await seoDao.setIdByLblSeo(input);
}

/**
 * 根据条件查找第一个SEO优化
 */
export async function findOneSeo(
  search?: SeoSearch,
  sort?: SortInput[],
): Promise<SeoModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const seo_model = await seoDao.findOneSeo(search, sort);
  
  return seo_model;
}

/**
 * 根据 id 查找SEO优化
 */
export async function findByIdSeo(
  seo_id?: SeoId | null,
): Promise<SeoModel | undefined> {
  
  const seo_model = await seoDao.findByIdSeo(seo_id);
  
  return seo_model;
}

/**
 * 根据 ids 查找SEO优化
 */
export async function findByIdsSeo(
  seo_ids: SeoId[],
): Promise<SeoModel[]> {
  
  const seo_models = await seoDao.findByIdsSeo(seo_ids);
  
  return seo_models;
}

/**
 * 根据搜索条件查找SEO优化是否存在
 */
export async function existSeo(
  search?: SeoSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const seo_exist = await seoDao.existSeo(search);
  
  return seo_exist;
}

/**
 * 根据 id 查找SEO优化是否存在
 */
export async function existByIdSeo(
  seo_id?: SeoId | null,
): Promise<boolean> {
  
  const seo_exist = await seoDao.existByIdSeo(seo_id);
  
  return seo_exist;
}

/**
 * 增加和修改时校验SEO优化
 */
export async function validateSeo(
  input: SeoInput,
): Promise<void> {
  await seoDao.validateSeo(input);
}

/**
 * 批量创建SEO优化
 */
export async function createsSeo(
  inputs: SeoInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<SeoId[]> {
  const seo_ids = await seoDao.createsSeo(inputs, options);
  
  return seo_ids;
}

/**
 * 根据 id 修改SEO优化
 */
export async function updateByIdSeo(
  seo_id: SeoId,
  input: SeoInput,
): Promise<SeoId> {
  
  const is_locked = await seoDao.getIsLockedByIdSeo(seo_id);
  if (is_locked) {
    throw "不能修改已经锁定的 SEO优化";
  }
  
  const seo_id2 = await seoDao.updateByIdSeo(seo_id, input);
  
  return seo_id2;
}

/** 校验SEO优化是否存在 */
export async function validateOptionSeo(
  model0?: SeoModel,
): Promise<SeoModel> {
  const seo_model = await seoDao.validateOptionSeo(model0);
  return seo_model;
}

/**
 * 根据 ids 删除SEO优化
 */
export async function deleteByIdsSeo(
  seo_ids: SeoId[],
): Promise<number> {
  
  const old_models = await seoDao.findByIdsSeo(seo_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 SEO优化";
    }
  }
  
  const seo_num = await seoDao.deleteByIdsSeo(seo_ids);
  return seo_num;
}

/**
 * 根据 id 设置默认SEO优化
 */
export async function defaultByIdSeo(
  id: SeoId,
): Promise<number> {
  const seo_num = await seoDao.defaultByIdSeo(id);
  return seo_num;
}

/**
 * 根据 ids 锁定或者解锁SEO优化
 */
export async function lockByIdsSeo(
  seo_ids: SeoId[],
  is_locked: 0 | 1,
): Promise<number> {
  const seo_num = await seoDao.lockByIdsSeo(seo_ids, is_locked);
  return seo_num;
}

/**
 * 根据 ids 还原SEO优化
 */
export async function revertByIdsSeo(
  seo_ids: SeoId[],
): Promise<number> {
  
  const seo_num = await seoDao.revertByIdsSeo(seo_ids);
  
  return seo_num;
}

/**
 * 根据 ids 彻底删除SEO优化
 */
export async function forceDeleteByIdsSeo(
  seo_ids: SeoId[],
): Promise<number> {
  
  const seo_num = await seoDao.forceDeleteByIdsSeo(seo_ids);
  
  return seo_num;
}

/**
 * 获取SEO优化字段注释
 */
export async function getFieldCommentsSeo(): Promise<SeoFieldComment> {
  const seo_fields = await seoDao.getFieldCommentsSeo();
  return seo_fields;
}

/**
 * 查找 SEO优化 order_by 字段的最大值
 */
export async function findLastOrderBySeo(
): Promise<number> {
  const seo_sort = await seoDao.findLastOrderBySeo();
  return seo_sort;
}
