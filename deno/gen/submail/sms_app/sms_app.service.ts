import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as sms_appDao from "./sms_app.dao.ts";

async function setSearchQuery(
  _search: SmsAppSearch,
) {
  
}

/**
 * 根据条件查找短信应用总数
 */
export async function findCount(
  search?: SmsAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await sms_appDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找短信应用列表
 */
export async function findAll(
  search?: SmsAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<SmsAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: SmsAppModel[] = await sms_appDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: SmsAppInput,
) {
  const data = await sms_appDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个短信应用
 */
export async function findOne(
  search?: SmsAppSearch,
  sort?: SortInput[],
): Promise<SmsAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await sms_appDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找短信应用
 */
export async function findById(
  id?: SmsAppId | null,
): Promise<SmsAppModel | undefined> {
  const model = await sms_appDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找短信应用是否存在
 */
export async function exist(
  search?: SmsAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await sms_appDao.exist(search);
  return data;
}

/**
 * 根据 id 查找短信应用是否存在
 */
export async function existById(
  id?: SmsAppId | null,
): Promise<boolean> {
  const data = await sms_appDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验短信应用
 */
export async function validate(
  input: SmsAppInput,
): Promise<void> {
  const data = await sms_appDao.validate(input);
  return data;
}

/**
 * 批量创建短信应用
 */
export async function creates(
  inputs: SmsAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<SmsAppId[]> {
  const ids = await sms_appDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改短信应用
 */
export async function updateById(
  id: SmsAppId,
  input: SmsAppInput,
): Promise<SmsAppId> {
  
  const is_locked = await sms_appDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2 = await sms_appDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除短信应用
 */
export async function deleteByIds(
  ids: SmsAppId[],
): Promise<number> {
  
  {
    const models = await sms_appDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw await ns("不能删除已经锁定的 {0}", "短信应用");
      }
    }
  }
  
  const data = await sms_appDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用短信应用
 */
export async function enableByIds(
  ids: SmsAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await sms_appDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁短信应用
 */
export async function lockByIds(
  ids: SmsAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await sms_appDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原短信应用
 */
export async function revertByIds(
  ids: SmsAppId[],
): Promise<number> {
  const data = await sms_appDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除短信应用
 */
export async function forceDeleteByIds(
  ids: SmsAppId[],
): Promise<number> {
  const data = await sms_appDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取短信应用字段注释
 */
export async function getFieldComments(): Promise<SmsAppFieldComment> {
  const data = await sms_appDao.getFieldComments();
  return data;
}

/**
 * 查找 短信应用 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await sms_appDao.findLastOrderBy();
  return data;
}
