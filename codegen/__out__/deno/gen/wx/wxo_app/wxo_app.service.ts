import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wxo_appDao from "./wxo_app.dao.ts";

async function setSearchQuery(
  _search: WxoAppSearch,
) {
  
}

/**
 * 根据条件查找公众号设置总数
 */
export async function findCount(
  search?: WxoAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_num = await wxo_appDao.findCount(search);
  
  return wxo_app_num;
}

/**
 * 根据搜索条件和分页查找公众号设置列表
 */
export async function findAll(
  search?: WxoAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxoAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_models = await wxo_appDao.findAll(search, page, sort);
  
  return wxo_app_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxoAppInput,
): Promise<void> {
  await wxo_appDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个公众号设置
 */
export async function findOne(
  search?: WxoAppSearch,
  sort?: SortInput[],
): Promise<WxoAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_model = await wxo_appDao.findOne(search, sort);
  
  return wxo_app_model;
}

/**
 * 根据 id 查找公众号设置
 */
export async function findById(
  wxo_app_id?: WxoAppId | null,
): Promise<WxoAppModel | undefined> {
  
  const wxo_app_model = await wxo_appDao.findById(wxo_app_id);
  
  return wxo_app_model;
}

/**
 * 根据 ids 查找公众号设置
 */
export async function findByIds(
  wxo_app_ids: WxoAppId[],
): Promise<WxoAppModel[]> {
  
  const wxo_app_models = await wxo_appDao.findByIds(wxo_app_ids);
  
  return wxo_app_models;
}

/**
 * 根据搜索条件查找公众号设置是否存在
 */
export async function exist(
  search?: WxoAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_exist = await wxo_appDao.exist(search);
  
  return wxo_app_exist;
}

/**
 * 根据 id 查找公众号设置是否存在
 */
export async function existById(
  wxo_app_id?: WxoAppId | null,
): Promise<boolean> {
  
  const wxo_app_exist = await wxo_appDao.existById(wxo_app_id);
  
  return wxo_app_exist;
}

/**
 * 增加和修改时校验公众号设置
 */
export async function validate(
  input: WxoAppInput,
): Promise<void> {
  await wxo_appDao.validate(input);
}

/**
 * 批量创建公众号设置
 */
export async function creates(
  inputs: WxoAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxoAppId[]> {
  const wxo_app_ids = await wxo_appDao.creates(inputs, options);
  
  return wxo_app_ids;
}

/**
 * 根据 id 修改公众号设置
 */
export async function updateById(
  wxo_app_id: WxoAppId,
  input: WxoAppInput,
): Promise<WxoAppId> {
  
  const is_locked = await wxo_appDao.getIsLockedById(wxo_app_id);
  if (is_locked) {
    throw "不能修改已经锁定的 公众号设置";
  }
  
  const wxo_app_id2 = await wxo_appDao.updateById(wxo_app_id, input);
  
  return wxo_app_id2;
}

/** 校验公众号设置是否存在 */
export async function validateOption(
  model0?: WxoAppModel,
): Promise<WxoAppModel> {
  const wxo_app_model = await wxo_appDao.validateOption(model0);
  return wxo_app_model;
}

/**
 * 根据 ids 删除公众号设置
 */
export async function deleteByIds(
  wxo_app_ids: WxoAppId[],
): Promise<number> {
  
  const old_models = await wxo_appDao.findByIds(wxo_app_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 公众号设置";
    }
  }
  
  const wxo_app_num = await wxo_appDao.deleteByIds(wxo_app_ids);
  return wxo_app_num;
}

/**
 * 根据 ids 启用或者禁用公众号设置
 */
export async function enableByIds(
  ids: WxoAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const wxo_app_num = await wxo_appDao.enableByIds(ids, is_enabled);
  return wxo_app_num;
}

/**
 * 根据 ids 锁定或者解锁公众号设置
 */
export async function lockByIds(
  wxo_app_ids: WxoAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const wxo_app_num = await wxo_appDao.lockByIds(wxo_app_ids, is_locked);
  return wxo_app_num;
}

/**
 * 根据 ids 还原公众号设置
 */
export async function revertByIds(
  wxo_app_ids: WxoAppId[],
): Promise<number> {
  
  const wxo_app_num = await wxo_appDao.revertByIds(wxo_app_ids);
  
  return wxo_app_num;
}

/**
 * 根据 ids 彻底删除公众号设置
 */
export async function forceDeleteByIds(
  wxo_app_ids: WxoAppId[],
): Promise<number> {
  
  const wxo_app_num = await wxo_appDao.forceDeleteByIds(wxo_app_ids);
  
  return wxo_app_num;
}

/**
 * 获取公众号设置字段注释
 */
export async function getFieldComments(): Promise<WxoAppFieldComment> {
  const wxo_app_fields = await wxo_appDao.getFieldComments();
  return wxo_app_fields;
}

/**
 * 查找 公众号设置 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const wxo_app_sort = await wxo_appDao.findLastOrderBy();
  return wxo_app_sort;
}
