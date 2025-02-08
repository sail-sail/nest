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
  findById as findByIdUsr,
  validateOption as validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import * as wxapp_configDao from "./wxapp_config.dao.ts";

async function setSearchQuery(
  search: WxappConfigSearch,
) {
  
  const usr_id = await get_usr_id();
  const org_id = await get_org_id();
  const usr_model = await findByIdUsr(usr_id);
  if (!usr_id || !usr_model) {
    throw new Error("usr_id can not be null");
  }
  const org_ids: OrgId[] = [ ];
  if (org_id) {
    org_ids.push(org_id);
  } else {
    org_ids.push(...usr_model.org_ids);
    org_ids.push("" as OrgId);
  }
  const username = usr_model.username;
  
  if (username !== "admin") {
    search.org_id = org_ids;
  }
  
}

/**
 * 根据条件查找小程序配置总数
 */
export async function findCount(
  search?: WxappConfigSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wxapp_configDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找小程序配置列表
 */
export async function findAll(
  search?: WxappConfigSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxappConfigModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: WxappConfigModel[] = await wxapp_configDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxappConfigInput,
) {
  const data = await wxapp_configDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个小程序配置
 */
export async function findOne(
  search?: WxappConfigSearch,
  sort?: SortInput[],
): Promise<WxappConfigModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await wxapp_configDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找小程序配置
 */
export async function findById(
  id?: WxappConfigId | null,
): Promise<WxappConfigModel | undefined> {
  const model = await wxapp_configDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找小程序配置是否存在
 */
export async function exist(
  search?: WxappConfigSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wxapp_configDao.exist(search);
  return data;
}

/**
 * 根据 id 查找小程序配置是否存在
 */
export async function existById(
  id?: WxappConfigId | null,
): Promise<boolean> {
  const data = await wxapp_configDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验小程序配置
 */
export async function validate(
  input: WxappConfigInput,
): Promise<void> {
  const data = await wxapp_configDao.validate(input);
  return data;
}

/**
 * 批量创建小程序配置
 */
export async function creates(
  inputs: WxappConfigInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxappConfigId[]> {
  const ids = await wxapp_configDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改小程序配置
 */
export async function updateById(
  id: WxappConfigId,
  input: WxappConfigInput,
): Promise<WxappConfigId> {
  
  const old_model = await wxapp_configDao.validateOption(
    await wxapp_configDao.findById(id),
  );
  
  const is_locked = await wxapp_configDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 小程序配置";
  }
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 名称
    input.lbl = undefined;
  }
  
  const id2 = await wxapp_configDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除小程序配置
 */
export async function deleteByIds(
  ids: WxappConfigId[],
): Promise<number> {
  
  {
    const models = await wxapp_configDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 小程序配置";
      }
    }
  }
  
  {
    const models = await wxapp_configDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw "不能删除系统记录";
      }
    }
  }
  
  const data = await wxapp_configDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用小程序配置
 */
export async function enableByIds(
  ids: WxappConfigId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await wxapp_configDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁小程序配置
 */
export async function lockByIds(
  ids: WxappConfigId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await wxapp_configDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原小程序配置
 */
export async function revertByIds(
  ids: WxappConfigId[],
): Promise<number> {
  const data = await wxapp_configDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除小程序配置
 */
export async function forceDeleteByIds(
  ids: WxappConfigId[],
): Promise<number> {
  const data = await wxapp_configDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取小程序配置字段注释
 */
export async function getFieldComments(): Promise<WxappConfigFieldComment> {
  const data = await wxapp_configDao.getFieldComments();
  return data;
}
