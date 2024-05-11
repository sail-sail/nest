import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as wxapp_configDao from "./wxapp_config.dao.ts";

/**
 * 根据条件查找小程序配置总数
 * @param {WxappConfigSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxappConfigSearch,
): Promise<number> {
  search = search || { };
  const data = await wxapp_configDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找小程序配置列表
 * @param {WxappConfigSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<WxappConfigModel[]>} 
 */
export async function findAll(
  search?: WxappConfigSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<WxappConfigModel[]> {
  search = search || { };
  const models: WxappConfigModel[] = await wxapp_configDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxappConfigInput,
) {
  const data = await wxapp_configDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个小程序配置
 * @param {WxappConfigSearch} search? 搜索条件
 */
export async function findOne(
  search?: WxappConfigSearch,
  sort?: SortInput|SortInput[],
): Promise<WxappConfigModel | undefined> {
  search = search || { };
  const model = await wxapp_configDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找小程序配置
 * @param {WxappConfigId} id
 */
export async function findById(
  id?: WxappConfigId | null,
): Promise<WxappConfigModel | undefined> {
  const model = await wxapp_configDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找小程序配置是否存在
 * @param {WxappConfigSearch} search? 搜索条件
 */
export async function exist(
  search?: WxappConfigSearch,
): Promise<boolean> {
  search = search || { };
  const data = await wxapp_configDao.exist(search);
  return data;
}

/**
 * 根据 id 查找小程序配置是否存在
 * @param {WxappConfigId} id
 */
export async function existById(
  id?: WxappConfigId | null,
): Promise<boolean> {
  const data = await wxapp_configDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验小程序配置
 * @param input 
 */
export async function validate(
  input: WxappConfigInput,
): Promise<void> {
  const data = await wxapp_configDao.validate(input);
  return data;
}

/**
 * 批量创建小程序配置
 * @param {WxappConfigInput[]} inputs
 * @return {Promise<WxappConfigId[]>} ids
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
 * @param {WxappConfigId} id
 * @param {WxappConfigInput} input
 * @return {Promise<WxappConfigId>}
 */
export async function updateById(
  id: WxappConfigId,
  input: WxappConfigInput,
): Promise<WxappConfigId> {
  
  const is_locked = await wxapp_configDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  // 不能修改系统记录的系统字段
  const model = await wxapp_configDao.findById(id);
  if (model && model.is_sys === 1) {
    // 名称
    input.lbl = undefined;
  }
  
  const id2: WxappConfigId = await wxapp_configDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除小程序配置
 * @param {WxappConfigId[]} ids
 * @return {Promise<number>}
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
        throw await ns("不能删除已经锁定的 {0}", "小程序配置");
      }
    }
  }
  
  {
    const models = await wxapp_configDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw await ns("不能删除系统记录");
      }
    }
  }
  
  const data = await wxapp_configDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用小程序配置
 * @param {WxappConfigId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
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
 * @param {WxappConfigId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
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
 * @param {WxappConfigId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxappConfigId[],
): Promise<number> {
  const data = await wxapp_configDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除小程序配置
 * @param {WxappConfigId[]} ids
 * @return {Promise<number>}
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
