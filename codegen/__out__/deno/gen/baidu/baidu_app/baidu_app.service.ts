import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as baidu_appDao from "./baidu_app.dao.ts";

async function setSearchQuery(
  _search: BaiduAppSearch,
) {
  
}

/**
 * 根据条件查找百度应用总数
 */
export async function findCountBaiduApp(
  search?: BaiduAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_num = await baidu_appDao.findCountBaiduApp(search);
  
  return baidu_app_num;
}

/**
 * 根据搜索条件和分页查找百度应用列表
 */
export async function findAllBaiduApp(
  search?: BaiduAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<BaiduAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_models = await baidu_appDao.findAllBaiduApp(search, page, sort);
  
  return baidu_app_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblBaiduApp(
  input: BaiduAppInput,
): Promise<void> {
  await baidu_appDao.setIdByLblBaiduApp(input);
}

/**
 * 根据条件查找第一个百度应用
 */
export async function findOneBaiduApp(
  search?: BaiduAppSearch,
  sort?: SortInput[],
): Promise<BaiduAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_model = await baidu_appDao.findOneBaiduApp(search, sort);
  
  return baidu_app_model;
}

/**
 * 根据条件查找第一个百度应用, 如果不存在则抛错
 */
export async function findOneOkBaiduApp(
  search?: BaiduAppSearch,
  sort?: SortInput[],
): Promise<BaiduAppModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_model = await baidu_appDao.findOneOkBaiduApp(search, sort);
  
  return baidu_app_model;
}

/**
 * 根据 id 查找百度应用
 */
export async function findByIdBaiduApp(
  baidu_app_id: BaiduAppId,
): Promise<BaiduAppModel | undefined> {
  
  const baidu_app_model = await baidu_appDao.findByIdBaiduApp(baidu_app_id);
  
  return baidu_app_model;
}

/**
 * 根据 id 查找百度应用, 如果不存在则抛错
 */
export async function findByIdOkBaiduApp(
  baidu_app_id: BaiduAppId,
): Promise<BaiduAppModel> {
  
  const baidu_app_model = await baidu_appDao.findByIdOkBaiduApp(baidu_app_id);
  
  return baidu_app_model;
}

/**
 * 根据 ids 查找百度应用
 */
export async function findByIdsBaiduApp(
  baidu_app_ids: BaiduAppId[],
): Promise<BaiduAppModel[]> {
  
  const baidu_app_models = await baidu_appDao.findByIdsBaiduApp(baidu_app_ids);
  
  return baidu_app_models;
}

/**
 * 根据 ids 查找百度应用, 出现查询不到的 id 则报错
 */
export async function findByIdsOkBaiduApp(
  baidu_app_ids: BaiduAppId[],
): Promise<BaiduAppModel[]> {
  
  const baidu_app_models = await baidu_appDao.findByIdsOkBaiduApp(baidu_app_ids);
  
  return baidu_app_models;
}

/**
 * 根据搜索条件查找百度应用是否存在
 */
export async function existBaiduApp(
  search?: BaiduAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_exist = await baidu_appDao.existBaiduApp(search);
  
  return baidu_app_exist;
}

/**
 * 根据 id 查找百度应用是否存在
 */
export async function existByIdBaiduApp(
  baidu_app_id?: BaiduAppId | null,
): Promise<boolean> {
  
  const baidu_app_exist = await baidu_appDao.existByIdBaiduApp(baidu_app_id);
  
  return baidu_app_exist;
}

/**
 * 增加和修改时校验百度应用
 */
export async function validateBaiduApp(
  input: BaiduAppInput,
): Promise<void> {
  await baidu_appDao.validateBaiduApp(input);
}

/**
 * 批量创建百度应用
 */
export async function createsBaiduApp(
  inputs: BaiduAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<BaiduAppId[]> {
  const baidu_app_ids = await baidu_appDao.createsBaiduApp(inputs, options);
  
  return baidu_app_ids;
}

/**
 * 根据 id 修改百度应用
 */
export async function updateByIdBaiduApp(
  baidu_app_id: BaiduAppId,
  input: BaiduAppInput,
): Promise<BaiduAppId> {
  
  const is_locked = await baidu_appDao.getIsLockedByIdBaiduApp(baidu_app_id);
  if (is_locked) {
    throw "不能修改已经锁定的 百度应用";
  }
  
  const baidu_app_id2 = await baidu_appDao.updateByIdBaiduApp(baidu_app_id, input);
  
  return baidu_app_id2;
}

/** 校验百度应用是否存在 */
export async function validateOptionBaiduApp(
  model0?: BaiduAppModel,
): Promise<BaiduAppModel> {
  const baidu_app_model = await baidu_appDao.validateOptionBaiduApp(model0);
  return baidu_app_model;
}

/**
 * 根据 ids 删除百度应用
 */
export async function deleteByIdsBaiduApp(
  baidu_app_ids: BaiduAppId[],
): Promise<number> {
  
  const old_models = await baidu_appDao.findByIdsBaiduApp(baidu_app_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 百度应用";
    }
  }
  
  const baidu_app_num = await baidu_appDao.deleteByIdsBaiduApp(baidu_app_ids);
  return baidu_app_num;
}

/**
 * 根据 ids 启用或者禁用百度应用
 */
export async function enableByIdsBaiduApp(
  ids: BaiduAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const baidu_app_num = await baidu_appDao.enableByIdsBaiduApp(ids, is_enabled);
  return baidu_app_num;
}

/**
 * 根据 ids 锁定或者解锁百度应用
 */
export async function lockByIdsBaiduApp(
  baidu_app_ids: BaiduAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const baidu_app_num = await baidu_appDao.lockByIdsBaiduApp(baidu_app_ids, is_locked);
  return baidu_app_num;
}

/**
 * 根据 ids 还原百度应用
 */
export async function revertByIdsBaiduApp(
  baidu_app_ids: BaiduAppId[],
): Promise<number> {
  
  const baidu_app_num = await baidu_appDao.revertByIdsBaiduApp(baidu_app_ids);
  
  return baidu_app_num;
}

/**
 * 根据 ids 彻底删除百度应用
 */
export async function forceDeleteByIdsBaiduApp(
  baidu_app_ids: BaiduAppId[],
): Promise<number> {
  
  const baidu_app_num = await baidu_appDao.forceDeleteByIdsBaiduApp(baidu_app_ids);
  
  return baidu_app_num;
}

/**
 * 获取百度应用字段注释
 */
export async function getFieldCommentsBaiduApp(): Promise<BaiduAppFieldComment> {
  const baidu_app_fields = await baidu_appDao.getFieldCommentsBaiduApp();
  return baidu_app_fields;
}

/**
 * 查找 百度应用 order_by 字段的最大值
 */
export async function findLastOrderByBaiduApp(
): Promise<number> {
  const baidu_app_sort = await baidu_appDao.findLastOrderByBaiduApp();
  return baidu_app_sort;
}
