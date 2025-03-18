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
export async function findCount(
  search?: BaiduAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_num = await baidu_appDao.findCount(search);
  
  return baidu_app_num;
}

/**
 * 根据搜索条件和分页查找百度应用列表
 */
export async function findAll(
  search?: BaiduAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<BaiduAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_models = await baidu_appDao.findAll(search, page, sort);
  
  return baidu_app_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: BaiduAppInput,
): Promise<void> {
  await baidu_appDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个百度应用
 */
export async function findOne(
  search?: BaiduAppSearch,
  sort?: SortInput[],
): Promise<BaiduAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_model = await baidu_appDao.findOne(search, sort);
  
  return baidu_app_model;
}

/**
 * 根据 id 查找百度应用
 */
export async function findById(
  baidu_app_id?: BaiduAppId | null,
): Promise<BaiduAppModel | undefined> {
  
  const baidu_app_model = await baidu_appDao.findById(baidu_app_id);
  
  return baidu_app_model;
}

/**
 * 根据 ids 查找百度应用
 */
export async function findByIds(
  baidu_app_ids: BaiduAppId[],
): Promise<BaiduAppModel[]> {
  
  const baidu_app_models = await baidu_appDao.findByIds(baidu_app_ids);
  
  return baidu_app_models;
}

/**
 * 根据搜索条件查找百度应用是否存在
 */
export async function exist(
  search?: BaiduAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_exist = await baidu_appDao.exist(search);
  
  return baidu_app_exist;
}

/**
 * 根据 id 查找百度应用是否存在
 */
export async function existById(
  baidu_app_id?: BaiduAppId | null,
): Promise<boolean> {
  
  const baidu_app_exist = await baidu_appDao.existById(baidu_app_id);
  
  return baidu_app_exist;
}

/**
 * 增加和修改时校验百度应用
 */
export async function validate(
  input: BaiduAppInput,
): Promise<void> {
  await baidu_appDao.validate(input);
}

/**
 * 批量创建百度应用
 */
export async function creates(
  inputs: BaiduAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<BaiduAppId[]> {
  const baidu_app_ids = await baidu_appDao.creates(inputs, options);
  
  return baidu_app_ids;
}

/**
 * 根据 id 修改百度应用
 */
export async function updateById(
  baidu_app_id: BaiduAppId,
  input: BaiduAppInput,
): Promise<BaiduAppId> {
  
  const is_locked = await baidu_appDao.getIsLockedById(baidu_app_id);
  if (is_locked) {
    throw "不能修改已经锁定的 百度应用";
  }
  
  const baidu_app_id2 = await baidu_appDao.updateById(baidu_app_id, input);
  
  return baidu_app_id2;
}

/** 校验百度应用是否存在 */
export async function validateOption(
  model0?: BaiduAppModel,
): Promise<BaiduAppModel> {
  const baidu_app_model = await baidu_appDao.validateOption(model0);
  return baidu_app_model;
}

/**
 * 根据 ids 删除百度应用
 */
export async function deleteByIds(
  baidu_app_ids: BaiduAppId[],
): Promise<number> {
  
  const old_models = await baidu_appDao.findByIds(baidu_app_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 百度应用";
    }
  }
  
  const baidu_app_num = await baidu_appDao.deleteByIds(baidu_app_ids);
  return baidu_app_num;
}

/**
 * 根据 ids 启用或者禁用百度应用
 */
export async function enableByIds(
  ids: BaiduAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const baidu_app_num = await baidu_appDao.enableByIds(ids, is_enabled);
  return baidu_app_num;
}

/**
 * 根据 ids 锁定或者解锁百度应用
 */
export async function lockByIds(
  baidu_app_ids: BaiduAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const baidu_app_num = await baidu_appDao.lockByIds(baidu_app_ids, is_locked);
  return baidu_app_num;
}

/**
 * 根据 ids 还原百度应用
 */
export async function revertByIds(
  baidu_app_ids: BaiduAppId[],
): Promise<number> {
  
  const baidu_app_num = await baidu_appDao.revertByIds(baidu_app_ids);
  
  return baidu_app_num;
}

/**
 * 根据 ids 彻底删除百度应用
 */
export async function forceDeleteByIds(
  baidu_app_ids: BaiduAppId[],
): Promise<number> {
  
  const baidu_app_num = await baidu_appDao.forceDeleteByIds(baidu_app_ids);
  
  return baidu_app_num;
}

/**
 * 获取百度应用字段注释
 */
export async function getFieldComments(): Promise<BaiduAppFieldComment> {
  const baidu_app_fields = await baidu_appDao.getFieldComments();
  return baidu_app_fields;
}

/**
 * 查找 百度应用 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const baidu_app_sort = await baidu_appDao.findLastOrderBy();
  return baidu_app_sort;
}
