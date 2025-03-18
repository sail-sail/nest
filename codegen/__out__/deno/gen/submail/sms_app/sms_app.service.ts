import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

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
  
  const sms_app_num = await sms_appDao.findCount(search);
  
  return sms_app_num;
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
  
  const sms_app_models = await sms_appDao.findAll(search, page, sort);
  
  return sms_app_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: SmsAppInput,
): Promise<void> {
  await sms_appDao.setIdByLbl(input);
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
  
  const sms_app_model = await sms_appDao.findOne(search, sort);
  
  return sms_app_model;
}

/**
 * 根据 id 查找短信应用
 */
export async function findById(
  sms_app_id?: SmsAppId | null,
): Promise<SmsAppModel | undefined> {
  
  const sms_app_model = await sms_appDao.findById(sms_app_id);
  
  return sms_app_model;
}

/**
 * 根据 ids 查找短信应用
 */
export async function findByIds(
  sms_app_ids: SmsAppId[],
): Promise<SmsAppModel[]> {
  
  const sms_app_models = await sms_appDao.findByIds(sms_app_ids);
  
  return sms_app_models;
}

/**
 * 根据搜索条件查找短信应用是否存在
 */
export async function exist(
  search?: SmsAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_app_exist = await sms_appDao.exist(search);
  
  return sms_app_exist;
}

/**
 * 根据 id 查找短信应用是否存在
 */
export async function existById(
  sms_app_id?: SmsAppId | null,
): Promise<boolean> {
  
  const sms_app_exist = await sms_appDao.existById(sms_app_id);
  
  return sms_app_exist;
}

/**
 * 增加和修改时校验短信应用
 */
export async function validate(
  input: SmsAppInput,
): Promise<void> {
  await sms_appDao.validate(input);
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
  const sms_app_ids = await sms_appDao.creates(inputs, options);
  
  return sms_app_ids;
}

/**
 * 根据 id 修改短信应用
 */
export async function updateById(
  sms_app_id: SmsAppId,
  input: SmsAppInput,
): Promise<SmsAppId> {
  
  const is_locked = await sms_appDao.getIsLockedById(sms_app_id);
  if (is_locked) {
    throw "不能修改已经锁定的 短信应用";
  }
  
  const sms_app_id2 = await sms_appDao.updateById(sms_app_id, input);
  
  return sms_app_id2;
}

/** 校验短信应用是否存在 */
export async function validateOption(
  model0?: SmsAppModel,
): Promise<SmsAppModel> {
  const sms_app_model = await sms_appDao.validateOption(model0);
  return sms_app_model;
}

/**
 * 根据 ids 删除短信应用
 */
export async function deleteByIds(
  sms_app_ids: SmsAppId[],
): Promise<number> {
  
  const old_models = await sms_appDao.findByIds(sms_app_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 短信应用";
    }
  }
  
  const sms_app_num = await sms_appDao.deleteByIds(sms_app_ids);
  return sms_app_num;
}

/**
 * 根据 ids 启用或者禁用短信应用
 */
export async function enableByIds(
  ids: SmsAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const sms_app_num = await sms_appDao.enableByIds(ids, is_enabled);
  return sms_app_num;
}

/**
 * 根据 ids 锁定或者解锁短信应用
 */
export async function lockByIds(
  sms_app_ids: SmsAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const sms_app_num = await sms_appDao.lockByIds(sms_app_ids, is_locked);
  return sms_app_num;
}

/**
 * 根据 ids 还原短信应用
 */
export async function revertByIds(
  sms_app_ids: SmsAppId[],
): Promise<number> {
  
  const sms_app_num = await sms_appDao.revertByIds(sms_app_ids);
  
  return sms_app_num;
}

/**
 * 根据 ids 彻底删除短信应用
 */
export async function forceDeleteByIds(
  sms_app_ids: SmsAppId[],
): Promise<number> {
  
  const sms_app_num = await sms_appDao.forceDeleteByIds(sms_app_ids);
  
  return sms_app_num;
}

/**
 * 获取短信应用字段注释
 */
export async function getFieldComments(): Promise<SmsAppFieldComment> {
  const sms_app_fields = await sms_appDao.getFieldComments();
  return sms_app_fields;
}

/**
 * 查找 短信应用 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const sms_app_sort = await sms_appDao.findLastOrderBy();
  return sms_app_sort;
}
