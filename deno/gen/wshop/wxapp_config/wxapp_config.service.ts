import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  get_usr_id,
  get_org_id,
} from "/lib/auth/auth.dao.ts";

import {
  findByIdUsr,
  validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  isAdmin,
} from "/src/base/usr/usr.dao.ts";

import * as wxapp_configDao from "./wxapp_config.dao.ts";

async function setSearchQuery(
  search: WxappConfigSearch,
) {
  
  const usr_id = await get_usr_id(false);
  const org_id = await get_org_id();
  const usr_model = await validateOptionUsr(
    await findByIdUsr(usr_id),
  );
  const org_ids: OrgId[] = [ ];
  if (org_id) {
    org_ids.push(org_id);
  } else {
    org_ids.push(...usr_model.org_ids);
    org_ids.push("" as OrgId);
  }
  
  if (!await isAdmin(usr_id)) {
    search.org_id = org_ids;
  }
  
}

/**
 * 根据条件查找小程序配置总数
 */
export async function findCountWxappConfig(
  search?: WxappConfigSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxapp_config_num = await wxapp_configDao.findCountWxappConfig(search);
  
  return wxapp_config_num;
}

/**
 * 根据搜索条件和分页查找小程序配置列表
 */
export async function findAllWxappConfig(
  search?: WxappConfigSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxappConfigModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxapp_config_models = await wxapp_configDao.findAllWxappConfig(search, page, sort);
  
  return wxapp_config_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxappConfig(
  input: WxappConfigInput,
): Promise<void> {
  await wxapp_configDao.setIdByLblWxappConfig(input);
}

/**
 * 根据条件查找第一个小程序配置
 */
export async function findOneWxappConfig(
  search?: WxappConfigSearch,
  sort?: SortInput[],
): Promise<WxappConfigModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxapp_config_model = await wxapp_configDao.findOneWxappConfig(search, sort);
  
  return wxapp_config_model;
}

/**
 * 根据 id 查找小程序配置
 */
export async function findByIdWxappConfig(
  wxapp_config_id?: WxappConfigId | null,
): Promise<WxappConfigModel | undefined> {
  
  const wxapp_config_model = await wxapp_configDao.findByIdWxappConfig(wxapp_config_id);
  
  return wxapp_config_model;
}

/**
 * 根据 ids 查找小程序配置
 */
export async function findByIdsWxappConfig(
  wxapp_config_ids: WxappConfigId[],
): Promise<WxappConfigModel[]> {
  
  const wxapp_config_models = await wxapp_configDao.findByIdsWxappConfig(wxapp_config_ids);
  
  return wxapp_config_models;
}

/**
 * 根据搜索条件查找小程序配置是否存在
 */
export async function existWxappConfig(
  search?: WxappConfigSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxapp_config_exist = await wxapp_configDao.existWxappConfig(search);
  
  return wxapp_config_exist;
}

/**
 * 根据 id 查找小程序配置是否存在
 */
export async function existByIdWxappConfig(
  wxapp_config_id?: WxappConfigId | null,
): Promise<boolean> {
  
  const wxapp_config_exist = await wxapp_configDao.existByIdWxappConfig(wxapp_config_id);
  
  return wxapp_config_exist;
}

/**
 * 增加和修改时校验小程序配置
 */
export async function validateWxappConfig(
  input: WxappConfigInput,
): Promise<void> {
  await wxapp_configDao.validateWxappConfig(input);
}

/**
 * 批量创建小程序配置
 */
export async function createsWxappConfig(
  inputs: WxappConfigInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxappConfigId[]> {
  const wxapp_config_ids = await wxapp_configDao.createsWxappConfig(inputs, options);
  
  return wxapp_config_ids;
}

/**
 * 根据 id 修改小程序配置
 */
export async function updateByIdWxappConfig(
  wxapp_config_id: WxappConfigId,
  input: WxappConfigInput,
): Promise<WxappConfigId> {
  
  const old_model = await wxapp_configDao.validateOptionWxappConfig(
    await wxapp_configDao.findByIdWxappConfig(wxapp_config_id),
  );
  
  const is_locked = await wxapp_configDao.getIsLockedByIdWxappConfig(wxapp_config_id);
  if (is_locked) {
    throw "不能修改已经锁定的 小程序配置";
  }
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 名称
    input.lbl = undefined;
  }
  
  const wxapp_config_id2 = await wxapp_configDao.updateByIdWxappConfig(wxapp_config_id, input);
  
  return wxapp_config_id2;
}

/** 校验小程序配置是否存在 */
export async function validateOptionWxappConfig(
  model0?: WxappConfigModel,
): Promise<WxappConfigModel> {
  const wxapp_config_model = await wxapp_configDao.validateOptionWxappConfig(model0);
  return wxapp_config_model;
}

/**
 * 根据 ids 删除小程序配置
 */
export async function deleteByIdsWxappConfig(
  wxapp_config_ids: WxappConfigId[],
): Promise<number> {
  
  const old_models = await wxapp_configDao.findByIdsWxappConfig(wxapp_config_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 小程序配置";
    }
  }
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const wxapp_config_num = await wxapp_configDao.deleteByIdsWxappConfig(wxapp_config_ids);
  return wxapp_config_num;
}

/**
 * 根据 ids 启用或者禁用小程序配置
 */
export async function enableByIdsWxappConfig(
  ids: WxappConfigId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const wxapp_config_num = await wxapp_configDao.enableByIdsWxappConfig(ids, is_enabled);
  return wxapp_config_num;
}

/**
 * 根据 ids 锁定或者解锁小程序配置
 */
export async function lockByIdsWxappConfig(
  wxapp_config_ids: WxappConfigId[],
  is_locked: 0 | 1,
): Promise<number> {
  const wxapp_config_num = await wxapp_configDao.lockByIdsWxappConfig(wxapp_config_ids, is_locked);
  return wxapp_config_num;
}

/**
 * 根据 ids 还原小程序配置
 */
export async function revertByIdsWxappConfig(
  wxapp_config_ids: WxappConfigId[],
): Promise<number> {
  
  const wxapp_config_num = await wxapp_configDao.revertByIdsWxappConfig(wxapp_config_ids);
  
  return wxapp_config_num;
}

/**
 * 根据 ids 彻底删除小程序配置
 */
export async function forceDeleteByIdsWxappConfig(
  wxapp_config_ids: WxappConfigId[],
): Promise<number> {
  
  const wxapp_config_num = await wxapp_configDao.forceDeleteByIdsWxappConfig(wxapp_config_ids);
  
  return wxapp_config_num;
}

/**
 * 获取小程序配置字段注释
 */
export async function getFieldCommentsWxappConfig(): Promise<WxappConfigFieldComment> {
  const wxapp_config_fields = await wxapp_configDao.getFieldCommentsWxappConfig();
  return wxapp_config_fields;
}
