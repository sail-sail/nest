import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wxw_appDao from "./wxw_app.dao.ts";

async function setSearchQuery(
  _search: WxwAppSearch,
) {
  
}

/**
 * 根据条件查找企微应用总数
 */
export async function findCount(
  search?: WxwAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_app_num = await wxw_appDao.findCount(search);
  
  return wxw_app_num;
}

/**
 * 根据搜索条件和分页查找企微应用列表
 */
export async function findAll(
  search?: WxwAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_app_models = await wxw_appDao.findAll(search, page, sort);
  
  return wxw_app_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxwAppInput,
): Promise<void> {
  await wxw_appDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个企微应用
 */
export async function findOne(
  search?: WxwAppSearch,
  sort?: SortInput[],
): Promise<WxwAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_app_model = await wxw_appDao.findOne(search, sort);
  
  return wxw_app_model;
}

/**
 * 根据 id 查找企微应用
 */
export async function findById(
  wxw_app_id?: WxwAppId | null,
): Promise<WxwAppModel | undefined> {
  
  const wxw_app_model = await wxw_appDao.findById(wxw_app_id);
  
  return wxw_app_model;
}

/**
 * 根据 ids 查找企微应用
 */
export async function findByIds(
  wxw_app_ids: WxwAppId[],
): Promise<WxwAppModel[]> {
  
  const wxw_app_models = await wxw_appDao.findByIds(wxw_app_ids);
  
  return wxw_app_models;
}

/**
 * 根据搜索条件查找企微应用是否存在
 */
export async function exist(
  search?: WxwAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_app_exist = await wxw_appDao.exist(search);
  
  return wxw_app_exist;
}

/**
 * 根据 id 查找企微应用是否存在
 */
export async function existById(
  wxw_app_id?: WxwAppId | null,
): Promise<boolean> {
  
  const wxw_app_exist = await wxw_appDao.existById(wxw_app_id);
  
  return wxw_app_exist;
}

/**
 * 增加和修改时校验企微应用
 */
export async function validate(
  input: WxwAppInput,
): Promise<void> {
  await wxw_appDao.validate(input);
}

/**
 * 批量创建企微应用
 */
export async function creates(
  inputs: WxwAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxwAppId[]> {
  const wxw_app_ids = await wxw_appDao.creates(inputs, options);
  
  return wxw_app_ids;
}

/**
 * 根据 id 修改企微应用
 */
export async function updateById(
  wxw_app_id: WxwAppId,
  input: WxwAppInput,
): Promise<WxwAppId> {
  
  const is_locked = await wxw_appDao.getIsLockedById(wxw_app_id);
  if (is_locked) {
    throw "不能修改已经锁定的 企微应用";
  }
  
  const wxw_app_id2 = await wxw_appDao.updateById(wxw_app_id, input);
  
  return wxw_app_id2;
}

/** 校验企微应用是否存在 */
export async function validateOption(
  model0?: WxwAppModel,
): Promise<WxwAppModel> {
  const wxw_app_model = await wxw_appDao.validateOption(model0);
  return wxw_app_model;
}

/**
 * 根据 ids 删除企微应用
 */
export async function deleteByIds(
  wxw_app_ids: WxwAppId[],
): Promise<number> {
  
  const old_models = await wxw_appDao.findByIds(wxw_app_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 企微应用";
    }
  }
  
  const wxw_app_num = await wxw_appDao.deleteByIds(wxw_app_ids);
  return wxw_app_num;
}

/**
 * 根据 ids 启用或者禁用企微应用
 */
export async function enableByIds(
  ids: WxwAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const wxw_app_num = await wxw_appDao.enableByIds(ids, is_enabled);
  return wxw_app_num;
}

/**
 * 根据 ids 锁定或者解锁企微应用
 */
export async function lockByIds(
  wxw_app_ids: WxwAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const wxw_app_num = await wxw_appDao.lockByIds(wxw_app_ids, is_locked);
  return wxw_app_num;
}

/**
 * 根据 ids 还原企微应用
 */
export async function revertByIds(
  wxw_app_ids: WxwAppId[],
): Promise<number> {
  
  const wxw_app_num = await wxw_appDao.revertByIds(wxw_app_ids);
  
  return wxw_app_num;
}

/**
 * 根据 ids 彻底删除企微应用
 */
export async function forceDeleteByIds(
  wxw_app_ids: WxwAppId[],
): Promise<number> {
  
  const wxw_app_num = await wxw_appDao.forceDeleteByIds(wxw_app_ids);
  
  return wxw_app_num;
}

/**
 * 获取企微应用字段注释
 */
export async function getFieldComments(): Promise<WxwAppFieldComment> {
  const wxw_app_fields = await wxw_appDao.getFieldComments();
  return wxw_app_fields;
}

/**
 * 查找 企微应用 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const wxw_app_sort = await wxw_appDao.findLastOrderBy();
  return wxw_app_sort;
}
