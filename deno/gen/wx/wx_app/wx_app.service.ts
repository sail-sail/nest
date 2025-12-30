import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wx_appDao from "./wx_app.dao.ts";

async function setSearchQuery(
  _search: WxAppSearch,
) {
  
}

/**
 * 根据条件查找小程序设置总数
 */
export async function findCountWxApp(
  search?: WxAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_num = await wx_appDao.findCountWxApp(search);
  
  return wx_app_num;
}

/**
 * 根据搜索条件和分页查找小程序设置列表
 */
export async function findAllWxApp(
  search?: WxAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_models = await wx_appDao.findAllWxApp(search, page, sort);
  
  return wx_app_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxApp(
  input: WxAppInput,
): Promise<void> {
  await wx_appDao.setIdByLblWxApp(input);
}

/**
 * 根据条件查找第一个小程序设置
 */
export async function findOneWxApp(
  search?: WxAppSearch,
  sort?: SortInput[],
): Promise<WxAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_model = await wx_appDao.findOneWxApp(search, sort);
  
  return wx_app_model;
}

/**
 * 根据条件查找第一个小程序设置, 如果不存在则抛错
 */
export async function findOneOkWxApp(
  search?: WxAppSearch,
  sort?: SortInput[],
): Promise<WxAppModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_model = await wx_appDao.findOneOkWxApp(search, sort);
  
  return wx_app_model;
}

/**
 * 根据 id 查找小程序设置
 */
export async function findByIdWxApp(
  wx_app_id: WxAppId,
): Promise<WxAppModel | undefined> {
  
  const wx_app_model = await wx_appDao.findByIdWxApp(wx_app_id);
  
  return wx_app_model;
}

/**
 * 根据 id 查找小程序设置, 如果不存在则抛错
 */
export async function findByIdOkWxApp(
  wx_app_id: WxAppId,
): Promise<WxAppModel> {
  
  const wx_app_model = await wx_appDao.findByIdOkWxApp(wx_app_id);
  
  return wx_app_model;
}

/**
 * 根据 ids 查找小程序设置
 */
export async function findByIdsWxApp(
  wx_app_ids: WxAppId[],
): Promise<WxAppModel[]> {
  
  const wx_app_models = await wx_appDao.findByIdsWxApp(wx_app_ids);
  
  return wx_app_models;
}

/**
 * 根据 ids 查找小程序设置, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxApp(
  wx_app_ids: WxAppId[],
): Promise<WxAppModel[]> {
  
  const wx_app_models = await wx_appDao.findByIdsOkWxApp(wx_app_ids);
  
  return wx_app_models;
}

/**
 * 根据搜索条件查找小程序设置是否存在
 */
export async function existWxApp(
  search?: WxAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_exist = await wx_appDao.existWxApp(search);
  
  return wx_app_exist;
}

/**
 * 根据 id 查找小程序设置是否存在
 */
export async function existByIdWxApp(
  wx_app_id?: WxAppId | null,
): Promise<boolean> {
  
  const wx_app_exist = await wx_appDao.existByIdWxApp(wx_app_id);
  
  return wx_app_exist;
}

/**
 * 增加和修改时校验小程序设置
 */
export async function validateWxApp(
  input: WxAppInput,
): Promise<void> {
  await wx_appDao.validateWxApp(input);
}

/**
 * 批量创建小程序设置
 */
export async function createsWxApp(
  inputs: WxAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxAppId[]> {
  const wx_app_ids = await wx_appDao.createsWxApp(inputs, options);
  
  return wx_app_ids;
}

/**
 * 根据 id 修改小程序设置
 */
export async function updateByIdWxApp(
  wx_app_id: WxAppId,
  input: WxAppInput,
): Promise<WxAppId> {
  
  const is_locked = await wx_appDao.getIsLockedByIdWxApp(wx_app_id);
  if (is_locked) {
    throw "不能修改已经锁定的 小程序设置";
  }
  
  const wx_app_id2 = await wx_appDao.updateByIdWxApp(wx_app_id, input);
  
  return wx_app_id2;
}

/** 校验小程序设置是否存在 */
export async function validateOptionWxApp(
  model0?: WxAppModel,
): Promise<WxAppModel> {
  const wx_app_model = await wx_appDao.validateOptionWxApp(model0);
  return wx_app_model;
}

/**
 * 根据 ids 删除小程序设置
 */
export async function deleteByIdsWxApp(
  wx_app_ids: WxAppId[],
): Promise<number> {
  
  const old_models = await wx_appDao.findByIdsWxApp(wx_app_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 小程序设置";
    }
  }
  
  const wx_app_num = await wx_appDao.deleteByIdsWxApp(wx_app_ids);
  return wx_app_num;
}

/**
 * 根据 ids 启用或者禁用小程序设置
 */
export async function enableByIdsWxApp(
  ids: WxAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const wx_app_num = await wx_appDao.enableByIdsWxApp(ids, is_enabled);
  return wx_app_num;
}

/**
 * 根据 ids 锁定或者解锁小程序设置
 */
export async function lockByIdsWxApp(
  wx_app_ids: WxAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const wx_app_num = await wx_appDao.lockByIdsWxApp(wx_app_ids, is_locked);
  return wx_app_num;
}

/**
 * 根据 ids 还原小程序设置
 */
export async function revertByIdsWxApp(
  wx_app_ids: WxAppId[],
): Promise<number> {
  
  const wx_app_num = await wx_appDao.revertByIdsWxApp(wx_app_ids);
  
  return wx_app_num;
}

/**
 * 根据 ids 彻底删除小程序设置
 */
export async function forceDeleteByIdsWxApp(
  wx_app_ids: WxAppId[],
): Promise<number> {
  
  const wx_app_num = await wx_appDao.forceDeleteByIdsWxApp(wx_app_ids);
  
  return wx_app_num;
}

/**
 * 获取小程序设置字段注释
 */
export async function getFieldCommentsWxApp(): Promise<WxAppFieldComment> {
  const wx_app_fields = await wx_appDao.getFieldCommentsWxApp();
  return wx_app_fields;
}

/**
 * 查找 小程序设置 order_by 字段的最大值
 */
export async function findLastOrderByWxApp(
  search?: WxAppSearch,
): Promise<number> {
  
  const order_by = await wx_appDao.findLastOrderByWxApp(search);
  
  return order_by;
}
