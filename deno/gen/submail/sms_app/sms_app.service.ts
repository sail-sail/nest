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
export async function findCountSmsApp(
  search?: SmsAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_app_num = await sms_appDao.findCountSmsApp(search);
  
  return sms_app_num;
}

/**
 * 根据搜索条件和分页查找短信应用列表
 */
export async function findAllSmsApp(
  search?: SmsAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<SmsAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_app_models = await sms_appDao.findAllSmsApp(search, page, sort);
  
  return sms_app_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblSmsApp(
  input: SmsAppInput,
): Promise<void> {
  await sms_appDao.setIdByLblSmsApp(input);
}

/**
 * 根据条件查找第一个短信应用
 */
export async function findOneSmsApp(
  search?: SmsAppSearch,
  sort?: SortInput[],
): Promise<SmsAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_app_model = await sms_appDao.findOneSmsApp(search, sort);
  
  return sms_app_model;
}

/**
 * 根据 id 查找短信应用
 */
export async function findByIdSmsApp(
  sms_app_id?: SmsAppId | null,
): Promise<SmsAppModel | undefined> {
  
  const sms_app_model = await sms_appDao.findByIdSmsApp(sms_app_id);
  
  return sms_app_model;
}

/**
 * 根据 ids 查找短信应用
 */
export async function findByIdsSmsApp(
  sms_app_ids: SmsAppId[],
): Promise<SmsAppModel[]> {
  
  const sms_app_models = await sms_appDao.findByIdsSmsApp(sms_app_ids);
  
  return sms_app_models;
}

/**
 * 根据搜索条件查找短信应用是否存在
 */
export async function existSmsApp(
  search?: SmsAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_app_exist = await sms_appDao.existSmsApp(search);
  
  return sms_app_exist;
}

/**
 * 根据 id 查找短信应用是否存在
 */
export async function existByIdSmsApp(
  sms_app_id?: SmsAppId | null,
): Promise<boolean> {
  
  const sms_app_exist = await sms_appDao.existByIdSmsApp(sms_app_id);
  
  return sms_app_exist;
}

/**
 * 增加和修改时校验短信应用
 */
export async function validateSmsApp(
  input: SmsAppInput,
): Promise<void> {
  await sms_appDao.validateSmsApp(input);
}

/**
 * 批量创建短信应用
 */
export async function createsSmsApp(
  inputs: SmsAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<SmsAppId[]> {
  const sms_app_ids = await sms_appDao.createsSmsApp(inputs, options);
  
  return sms_app_ids;
}

/**
 * 根据 id 修改短信应用
 */
export async function updateByIdSmsApp(
  sms_app_id: SmsAppId,
  input: SmsAppInput,
): Promise<SmsAppId> {
  
  const is_locked = await sms_appDao.getIsLockedByIdSmsApp(sms_app_id);
  if (is_locked) {
    throw "不能修改已经锁定的 短信应用";
  }
  
  const sms_app_id2 = await sms_appDao.updateByIdSmsApp(sms_app_id, input);
  
  return sms_app_id2;
}

/** 校验短信应用是否存在 */
export async function validateOptionSmsApp(
  model0?: SmsAppModel,
): Promise<SmsAppModel> {
  const sms_app_model = await sms_appDao.validateOptionSmsApp(model0);
  return sms_app_model;
}

/**
 * 根据 ids 删除短信应用
 */
export async function deleteByIdsSmsApp(
  sms_app_ids: SmsAppId[],
): Promise<number> {
  
  const old_models = await sms_appDao.findByIdsSmsApp(sms_app_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 短信应用";
    }
  }
  
  const sms_app_num = await sms_appDao.deleteByIdsSmsApp(sms_app_ids);
  return sms_app_num;
}

/**
 * 根据 ids 启用或者禁用短信应用
 */
export async function enableByIdsSmsApp(
  ids: SmsAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const sms_app_num = await sms_appDao.enableByIdsSmsApp(ids, is_enabled);
  return sms_app_num;
}

/**
 * 根据 ids 锁定或者解锁短信应用
 */
export async function lockByIdsSmsApp(
  sms_app_ids: SmsAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const sms_app_num = await sms_appDao.lockByIdsSmsApp(sms_app_ids, is_locked);
  return sms_app_num;
}

/**
 * 根据 ids 还原短信应用
 */
export async function revertByIdsSmsApp(
  sms_app_ids: SmsAppId[],
): Promise<number> {
  
  const sms_app_num = await sms_appDao.revertByIdsSmsApp(sms_app_ids);
  
  return sms_app_num;
}

/**
 * 根据 ids 彻底删除短信应用
 */
export async function forceDeleteByIdsSmsApp(
  sms_app_ids: SmsAppId[],
): Promise<number> {
  
  const sms_app_num = await sms_appDao.forceDeleteByIdsSmsApp(sms_app_ids);
  
  return sms_app_num;
}

/**
 * 获取短信应用字段注释
 */
export async function getFieldCommentsSmsApp(): Promise<SmsAppFieldComment> {
  const sms_app_fields = await sms_appDao.getFieldCommentsSmsApp();
  return sms_app_fields;
}

/**
 * 查找 短信应用 order_by 字段的最大值
 */
export async function findLastOrderBySmsApp(
): Promise<number> {
  const sms_app_sort = await sms_appDao.findLastOrderBySmsApp();
  return sms_app_sort;
}
