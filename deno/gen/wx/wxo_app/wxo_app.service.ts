import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wxo_appDao from "./wxo_app.dao.ts";

import {
  findByIdsOkRole,
  findAllRole,
} from "/gen/base/role/role.dao.ts";

async function setSearchQuery(
  _search: WxoAppSearch,
) {
  
}

/**
 * 根据条件查找公众号设置总数
 */
export async function findCountWxoApp(
  search?: WxoAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_num = await wxo_appDao.findCountWxoApp(search);
  
  return wxo_app_num;
}

/**
 * 根据搜索条件和分页查找公众号设置列表
 */
export async function findAllWxoApp(
  search?: WxoAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxoAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_models = await wxo_appDao.findAllWxoApp(search, page, sort);
  
  // default_role_codes 转 default_role_ids
  for (const wxo_app_model of wxo_app_models) {
    const default_role_codes = wxo_app_model.default_role_codes;
    const role_models = await to_default_role_models(default_role_codes);
    wxo_app_model.default_role_ids = role_models.map((x) => x.id);
    wxo_app_model.default_role_ids_lbl = role_models.map((x) => x.lbl).join(",");
  }
  
  return wxo_app_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxoApp(
  input: WxoAppInput,
): Promise<void> {
  await wxo_appDao.setIdByLblWxoApp(input);
}

/**
 * 根据条件查找第一个公众号设置
 */
export async function findOneWxoApp(
  search?: WxoAppSearch,
  sort?: SortInput[],
): Promise<WxoAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_model = await wxo_appDao.findOneWxoApp(search, sort);
  
  // default_role_codes 转 default_role_ids
  if (wxo_app_model) {
    const default_role_codes = wxo_app_model.default_role_codes;
    const role_models = await to_default_role_models(default_role_codes);
    wxo_app_model.default_role_ids = role_models.map((x) => x.id);
    wxo_app_model.default_role_ids_lbl = role_models.map((x) => x.lbl).join(",");
  }
  
  return wxo_app_model;
}

/**
 * 根据条件查找第一个公众号设置, 如果不存在则抛错
 */
export async function findOneOkWxoApp(
  search?: WxoAppSearch,
  sort?: SortInput[],
): Promise<WxoAppModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_model = await wxo_appDao.findOneOkWxoApp(search, sort);
  
  // default_role_codes 转 default_role_ids
  const default_role_codes = wxo_app_model.default_role_codes;
  const role_models = await to_default_role_models(default_role_codes);
  wxo_app_model.default_role_ids = role_models.map((x) => x.id);
  wxo_app_model.default_role_ids_lbl = role_models.map((x) => x.lbl).join(",");
  
  return wxo_app_model;
}

/**
 * 根据 id 查找公众号设置
 */
export async function findByIdWxoApp(
  wxo_app_id: WxoAppId,
): Promise<WxoAppModel | undefined> {
  
  const wxo_app_model = await wxo_appDao.findByIdWxoApp(wxo_app_id);
  
  // default_role_codes 转 default_role_ids
  if (wxo_app_model) {
    const default_role_codes = wxo_app_model.default_role_codes;
    const role_models = await to_default_role_models(default_role_codes);
    wxo_app_model.default_role_ids = role_models.map((x) => x.id);
    wxo_app_model.default_role_ids_lbl = role_models.map((x) => x.lbl).join(",");
  }
  
  return wxo_app_model;
}

/**
 * 根据 id 查找公众号设置, 如果不存在则抛错
 */
export async function findByIdOkWxoApp(
  wxo_app_id: WxoAppId,
): Promise<WxoAppModel> {
  
  const wxo_app_model = await wxo_appDao.findByIdOkWxoApp(wxo_app_id);
  
  // default_role_codes 转 default_role_ids
  const default_role_codes = wxo_app_model.default_role_codes;
  const role_models = await to_default_role_models(default_role_codes);
  wxo_app_model.default_role_ids = role_models.map((x) => x.id);
  wxo_app_model.default_role_ids_lbl = role_models.map((x) => x.lbl).join(",");
  
  return wxo_app_model;
}

/**
 * 根据 ids 查找公众号设置
 */
export async function findByIdsWxoApp(
  wxo_app_ids: WxoAppId[],
): Promise<WxoAppModel[]> {
  
  const wxo_app_models = await wxo_appDao.findByIdsWxoApp(wxo_app_ids);
  
  // default_role_codes 转 default_role_ids
  for (const wxo_app_model of wxo_app_models) {
    const default_role_codes = wxo_app_model.default_role_codes;
    const role_models = await to_default_role_models(default_role_codes);
    wxo_app_model.default_role_ids = role_models.map((x) => x.id);
    wxo_app_model.default_role_ids_lbl = role_models.map((x) => x.lbl).join(",");
  }
  
  return wxo_app_models;
}

/**
 * 根据 ids 查找公众号设置, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxoApp(
  wxo_app_ids: WxoAppId[],
): Promise<WxoAppModel[]> {
  
  const wxo_app_models = await wxo_appDao.findByIdsOkWxoApp(wxo_app_ids);
  
  // default_role_codes 转 default_role_ids
  for (const wxo_app_model of wxo_app_models) {
    const default_role_codes = wxo_app_model.default_role_codes;
    const role_models = await to_default_role_models(default_role_codes);
    wxo_app_model.default_role_ids = role_models.map((x) => x.id);
    wxo_app_model.default_role_ids_lbl = role_models.map((x) => x.lbl).join(",");
  }
  
  return wxo_app_models;
}

/**
 * 根据搜索条件查找公众号设置是否存在
 */
export async function existWxoApp(
  search?: WxoAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_exist = await wxo_appDao.existWxoApp(search);
  
  return wxo_app_exist;
}

/**
 * 根据 id 查找公众号设置是否存在
 */
export async function existByIdWxoApp(
  wxo_app_id?: WxoAppId | null,
): Promise<boolean> {
  
  const wxo_app_exist = await wxo_appDao.existByIdWxoApp(wxo_app_id);
  
  return wxo_app_exist;
}

/**
 * 增加和修改时校验公众号设置
 */
export async function validateWxoApp(
  input: WxoAppInput,
): Promise<void> {
  await wxo_appDao.validateWxoApp(input);
}

/**
 * default_role_ids 转 default_role_codes
 */
async function to_default_role_codes(
  default_role_ids?: RoleId[] | null,
): Promise<string[]> {
  
  if (!default_role_ids || default_role_ids.length === 0) {
    return [ ];
  }
  
  const role_models = await findByIdsOkRole(default_role_ids);
  
  const role_codes = role_models.map((x) => x.code);
  
  return role_codes;
}

/**
 * default_role_codes 转 default_role_ids
 */
async function to_default_role_models(
  default_role_codes?: string | null,
): Promise<RoleModel[]> {
  
  if (!default_role_codes || default_role_codes.length === 0) {
    return [ ];
  }
  
  const codes = default_role_codes.split(",").map((x) => x.trim()).filter((x) => x.length > 0);
  
  if (codes.length === 0) {
    return [ ];
  }
  
  const role_models = await findAllRole({
    codes,
  });
  
  return role_models;
}

/**
 * 批量创建公众号设置
 */
export async function createsWxoApp(
  inputs: WxoAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxoAppId[]> {
  
  // default_role_ids 转 default_role_codes
  for (const input of inputs) {
    const default_role_ids = input.default_role_ids;
    const default_role_codes = await to_default_role_codes(default_role_ids);
    input.default_role_codes = default_role_codes.join(",");
  }
  
  const wxo_app_ids = await wxo_appDao.createsWxoApp(inputs, options);
  
  return wxo_app_ids;
}

/**
 * 根据 id 修改公众号设置
 */
export async function updateByIdWxoApp(
  wxo_app_id: WxoAppId,
  input: WxoAppInput,
): Promise<WxoAppId> {
  
  const is_locked = await wxo_appDao.getIsLockedByIdWxoApp(wxo_app_id);
  if (is_locked) {
    throw "不能修改已经锁定的 公众号设置";
  }
  
  // default_role_ids 转 default_role_codes
  {
    const default_role_ids = input.default_role_ids;
    const default_role_codes = await to_default_role_codes(default_role_ids);
    input.default_role_codes = default_role_codes.join(",");
  }
  
  const wxo_app_id2 = await wxo_appDao.updateByIdWxoApp(wxo_app_id, input);
  
  return wxo_app_id2;
}

/** 校验公众号设置是否存在 */
export async function validateOptionWxoApp(
  model0?: WxoAppModel,
): Promise<WxoAppModel> {
  const wxo_app_model = await wxo_appDao.validateOptionWxoApp(model0);
  return wxo_app_model;
}

/**
 * 根据 ids 删除公众号设置
 */
export async function deleteByIdsWxoApp(
  wxo_app_ids: WxoAppId[],
): Promise<number> {
  
  const old_models = await wxo_appDao.findByIdsWxoApp(wxo_app_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 公众号设置";
    }
  }
  
  const wxo_app_num = await wxo_appDao.deleteByIdsWxoApp(wxo_app_ids);
  return wxo_app_num;
}

/**
 * 根据 ids 启用或者禁用公众号设置
 */
export async function enableByIdsWxoApp(
  ids: WxoAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const wxo_app_num = await wxo_appDao.enableByIdsWxoApp(ids, is_enabled);
  return wxo_app_num;
}

/**
 * 根据 ids 锁定或者解锁公众号设置
 */
export async function lockByIdsWxoApp(
  wxo_app_ids: WxoAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const wxo_app_num = await wxo_appDao.lockByIdsWxoApp(wxo_app_ids, is_locked);
  return wxo_app_num;
}

/**
 * 根据 ids 还原公众号设置
 */
export async function revertByIdsWxoApp(
  wxo_app_ids: WxoAppId[],
): Promise<number> {
  
  const wxo_app_num = await wxo_appDao.revertByIdsWxoApp(wxo_app_ids);
  
  return wxo_app_num;
}

/**
 * 根据 ids 彻底删除公众号设置
 */
export async function forceDeleteByIdsWxoApp(
  wxo_app_ids: WxoAppId[],
): Promise<number> {
  
  const wxo_app_num = await wxo_appDao.forceDeleteByIdsWxoApp(wxo_app_ids);
  
  return wxo_app_num;
}

/**
 * 获取公众号设置字段注释
 */
export async function getFieldCommentsWxoApp(): Promise<WxoAppFieldComment> {
  const wxo_app_fields = await wxo_appDao.getFieldCommentsWxoApp();
  return wxo_app_fields;
}

/**
 * 查找 公众号设置 order_by 字段的最大值
 */
export async function findLastOrderByWxoApp(
): Promise<number> {
  const wxo_app_sort = await wxo_appDao.findLastOrderByWxoApp();
  return wxo_app_sort;
}
