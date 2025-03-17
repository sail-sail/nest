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
export async function findCount(
  search?: WxAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_num = await wx_appDao.findCount(search);
  
  return wx_app_num;
}

/**
 * 根据搜索条件和分页查找小程序设置列表
 */
export async function findAll(
  search?: WxAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_models = await wx_appDao.findAll(search, page, sort);
  
  return wx_app_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxAppInput,
): Promise<void> {
  await wx_appDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个小程序设置
 */
export async function findOne(
  search?: WxAppSearch,
  sort?: SortInput[],
): Promise<WxAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_model = await wx_appDao.findOne(search, sort);
  
  return wx_app_model;
}

/**
 * 根据 id 查找小程序设置
 */
export async function findById(
  wx_app_id?: WxAppId | null,
): Promise<WxAppModel | undefined> {
  
  const wx_app_model = await wx_appDao.findById(wx_app_id);
  
  return wx_app_model;
}

/**
 * 根据 ids 查找小程序设置
 */
export async function findByIds(
  wx_app_ids: WxAppId[],
): Promise<WxAppModel[]> {
  
  const wx_app_models = await wx_appDao.findByIds(wx_app_ids);
  
  return wx_app_models;
}

/**
 * 根据搜索条件查找小程序设置是否存在
 */
export async function exist(
  search?: WxAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_exist = await wx_appDao.exist(search);
  
  return wx_app_exist;
}

/**
 * 根据 id 查找小程序设置是否存在
 */
export async function existById(
  wx_app_id?: WxAppId | null,
): Promise<boolean> {
  
  const wx_app_exist = await wx_appDao.existById(wx_app_id);
  
  return wx_app_exist;
}

/**
 * 增加和修改时校验小程序设置
 */
export async function validate(
  input: WxAppInput,
): Promise<void> {
  await wx_appDao.validate(input);
}

/**
 * 批量创建小程序设置
 */
export async function creates(
  inputs: WxAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxAppId[]> {
  const wx_app_ids = await wx_appDao.creates(inputs, options);
  
  return wx_app_ids;
}

/**
 * 根据 id 修改小程序设置
 */
export async function updateById(
  wx_app_id: WxAppId,
  input: WxAppInput,
): Promise<WxAppId> {
  
  const is_locked = await wx_appDao.getIsLockedById(wx_app_id);
  if (is_locked) {
    throw "不能修改已经锁定的 小程序设置";
  }
  
  const wx_app_id2 = await wx_appDao.updateById(wx_app_id, input);
  
  return wx_app_id2;
}

/** 校验小程序设置是否存在 */
export async function validateOption(
  model0?: WxAppModel,
): Promise<WxAppModel> {
  const wx_app_model = await wx_appDao.validateOption(model0);
  return wx_app_model;
}

/**
 * 根据 ids 删除小程序设置
 */
export async function deleteByIds(
  wx_app_ids: WxAppId[],
): Promise<number> {
  
  const old_models = await wx_appDao.findByIds(wx_app_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 小程序设置";
    }
  }
  
  const wx_app_num = await wx_appDao.deleteByIds(wx_app_ids);
  return wx_app_num;
}

/**
 * 根据 ids 启用或者禁用小程序设置
 */
export async function enableByIds(
  ids: WxAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const wx_app_num = await wx_appDao.enableByIds(ids, is_enabled);
  return wx_app_num;
}

/**
 * 根据 ids 锁定或者解锁小程序设置
 */
export async function lockByIds(
  wx_app_ids: WxAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const wx_app_num = await wx_appDao.lockByIds(wx_app_ids, is_locked);
  return wx_app_num;
}

/**
 * 根据 ids 还原小程序设置
 */
export async function revertByIds(
  wx_app_ids: WxAppId[],
): Promise<number> {
  
  const wx_app_num = await wx_appDao.revertByIds(wx_app_ids);
  
  return wx_app_num;
}

/**
 * 根据 ids 彻底删除小程序设置
 */
export async function forceDeleteByIds(
  wx_app_ids: WxAppId[],
): Promise<number> {
  
  const wx_app_num = await wx_appDao.forceDeleteByIds(wx_app_ids);
  
  return wx_app_num;
}

/**
 * 获取小程序设置字段注释
 */
export async function getFieldComments(): Promise<WxAppFieldComment> {
  const wx_app_fields = await wx_appDao.getFieldComments();
  return wx_app_fields;
}

/**
 * 查找 小程序设置 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const wx_app_sort = await wx_appDao.findLastOrderBy();
  return wx_app_sort;
}
