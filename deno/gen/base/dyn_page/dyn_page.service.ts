import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as dyn_pageDao from "./dyn_page.dao.ts";

async function setSearchQuery(
  _search: DynPageSearch,
) {
  
}

/**
 * 根据条件查找动态页面总数
 */
export async function findCountDynPage(
  search?: DynPageSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_num = await dyn_pageDao.findCountDynPage(search);
  
  return dyn_page_num;
}

/**
 * 根据搜索条件和分页查找动态页面列表
 */
export async function findAllDynPage(
  search?: DynPageSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DynPageModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_models = await dyn_pageDao.findAllDynPage(search, page, sort);
  
  return dyn_page_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblDynPage(
  input: DynPageInput,
): Promise<void> {
  await dyn_pageDao.setIdByLblDynPage(input);
}

/**
 * 根据条件查找第一个动态页面
 */
export async function findOneDynPage(
  search?: DynPageSearch,
  sort?: SortInput[],
): Promise<DynPageModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_model = await dyn_pageDao.findOneDynPage(search, sort);
  
  return dyn_page_model;
}

/**
 * 根据条件查找第一个动态页面, 如果不存在则抛错
 */
export async function findOneOkDynPage(
  search?: DynPageSearch,
  sort?: SortInput[],
): Promise<DynPageModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_model = await dyn_pageDao.findOneOkDynPage(search, sort);
  
  return dyn_page_model;
}

/**
 * 根据 id 查找动态页面
 */
export async function findByIdDynPage(
  dyn_page_id: DynPageId,
): Promise<DynPageModel | undefined> {
  
  const dyn_page_model = await dyn_pageDao.findByIdDynPage(dyn_page_id);
  
  return dyn_page_model;
}

/**
 * 根据 id 查找动态页面, 如果不存在则抛错
 */
export async function findByIdOkDynPage(
  dyn_page_id: DynPageId,
): Promise<DynPageModel> {
  
  const dyn_page_model = await dyn_pageDao.findByIdOkDynPage(dyn_page_id);
  
  return dyn_page_model;
}

/**
 * 根据 ids 查找动态页面
 */
export async function findByIdsDynPage(
  dyn_page_ids: DynPageId[],
): Promise<DynPageModel[]> {
  
  const dyn_page_models = await dyn_pageDao.findByIdsDynPage(dyn_page_ids);
  
  return dyn_page_models;
}

/**
 * 根据 ids 查找动态页面, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDynPage(
  dyn_page_ids: DynPageId[],
): Promise<DynPageModel[]> {
  
  const dyn_page_models = await dyn_pageDao.findByIdsOkDynPage(dyn_page_ids);
  
  return dyn_page_models;
}

/**
 * 根据搜索条件查找动态页面是否存在
 */
export async function existDynPage(
  search?: DynPageSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_exist = await dyn_pageDao.existDynPage(search);
  
  return dyn_page_exist;
}

/**
 * 根据 id 查找动态页面是否存在
 */
export async function existByIdDynPage(
  dyn_page_id?: DynPageId | null,
): Promise<boolean> {
  
  const dyn_page_exist = await dyn_pageDao.existByIdDynPage(dyn_page_id);
  
  return dyn_page_exist;
}

/**
 * 增加和修改时校验动态页面
 */
export async function validateDynPage(
  input: DynPageInput,
): Promise<void> {
  await dyn_pageDao.validateDynPage(input);
}

/**
 * 批量创建动态页面
 */
export async function createsDynPage(
  inputs: DynPageInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DynPageId[]> {
  const dyn_page_ids = await dyn_pageDao.createsDynPage(inputs, options);
  
  return dyn_page_ids;
}

/**
 * 根据 id 修改动态页面
 */
export async function updateByIdDynPage(
  dyn_page_id: DynPageId,
  input: DynPageInput,
): Promise<DynPageId> {
  
  const dyn_page_id2 = await dyn_pageDao.updateByIdDynPage(dyn_page_id, input);
  
  return dyn_page_id2;
}

/** 校验动态页面是否存在 */
export async function validateOptionDynPage(
  model0?: DynPageModel,
): Promise<DynPageModel> {
  const dyn_page_model = await dyn_pageDao.validateOptionDynPage(model0);
  return dyn_page_model;
}

/**
 * 根据 ids 删除动态页面
 */
export async function deleteByIdsDynPage(
  dyn_page_ids: DynPageId[],
): Promise<number> {
  
  const dyn_page_num = await dyn_pageDao.deleteByIdsDynPage(dyn_page_ids);
  return dyn_page_num;
}

/**
 * 根据 ids 启用或者禁用动态页面
 */
export async function enableByIdsDynPage(
  ids: DynPageId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const dyn_page_num = await dyn_pageDao.enableByIdsDynPage(ids, is_enabled);
  return dyn_page_num;
}

/**
 * 根据 ids 还原动态页面
 */
export async function revertByIdsDynPage(
  dyn_page_ids: DynPageId[],
): Promise<number> {
  
  const dyn_page_num = await dyn_pageDao.revertByIdsDynPage(dyn_page_ids);
  
  return dyn_page_num;
}

/**
 * 根据 ids 彻底删除动态页面
 */
export async function forceDeleteByIdsDynPage(
  dyn_page_ids: DynPageId[],
): Promise<number> {
  
  const dyn_page_num = await dyn_pageDao.forceDeleteByIdsDynPage(dyn_page_ids);
  
  return dyn_page_num;
}

/**
 * 获取动态页面字段注释
 */
export async function getFieldCommentsDynPage(): Promise<DynPageFieldComment> {
  const dyn_page_fields = await dyn_pageDao.getFieldCommentsDynPage();
  return dyn_page_fields;
}

/**
 * 查找 动态页面 order_by 字段的最大值
 */
export async function findLastOrderByDynPage(
): Promise<number> {
  const dyn_page_sort = await dyn_pageDao.findLastOrderByDynPage();
  return dyn_page_sort;
}
