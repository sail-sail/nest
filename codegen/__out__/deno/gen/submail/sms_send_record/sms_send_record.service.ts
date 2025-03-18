import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as sms_send_recordDao from "./sms_send_record.dao.ts";

async function setSearchQuery(
  _search: SmsSendRecordSearch,
) {
  
}

/**
 * 根据条件查找短信发送记录总数
 */
export async function findCount(
  search?: SmsSendRecordSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_send_record_num = await sms_send_recordDao.findCount(search);
  
  return sms_send_record_num;
}

/**
 * 根据搜索条件和分页查找短信发送记录列表
 */
export async function findAll(
  search?: SmsSendRecordSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<SmsSendRecordModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_send_record_models = await sms_send_recordDao.findAll(search, page, sort);
  
  return sms_send_record_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: SmsSendRecordInput,
): Promise<void> {
  await sms_send_recordDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个短信发送记录
 */
export async function findOne(
  search?: SmsSendRecordSearch,
  sort?: SortInput[],
): Promise<SmsSendRecordModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_send_record_model = await sms_send_recordDao.findOne(search, sort);
  
  return sms_send_record_model;
}

/**
 * 根据 id 查找短信发送记录
 */
export async function findById(
  sms_send_record_id?: SmsSendRecordId | null,
): Promise<SmsSendRecordModel | undefined> {
  
  const sms_send_record_model = await sms_send_recordDao.findById(sms_send_record_id);
  
  return sms_send_record_model;
}

/**
 * 根据 ids 查找短信发送记录
 */
export async function findByIds(
  sms_send_record_ids: SmsSendRecordId[],
): Promise<SmsSendRecordModel[]> {
  
  const sms_send_record_models = await sms_send_recordDao.findByIds(sms_send_record_ids);
  
  return sms_send_record_models;
}

/**
 * 根据搜索条件查找短信发送记录是否存在
 */
export async function exist(
  search?: SmsSendRecordSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_send_record_exist = await sms_send_recordDao.exist(search);
  
  return sms_send_record_exist;
}

/**
 * 根据 id 查找短信发送记录是否存在
 */
export async function existById(
  sms_send_record_id?: SmsSendRecordId | null,
): Promise<boolean> {
  
  const sms_send_record_exist = await sms_send_recordDao.existById(sms_send_record_id);
  
  return sms_send_record_exist;
}

/**
 * 增加和修改时校验短信发送记录
 */
export async function validate(
  input: SmsSendRecordInput,
): Promise<void> {
  await sms_send_recordDao.validate(input);
}

/**
 * 批量创建短信发送记录
 */
export async function creates(
  inputs: SmsSendRecordInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<SmsSendRecordId[]> {
  const sms_send_record_ids = await sms_send_recordDao.creates(inputs, options);
  
  return sms_send_record_ids;
}

/**
 * 根据 id 修改短信发送记录
 */
export async function updateById(
  sms_send_record_id: SmsSendRecordId,
  input: SmsSendRecordInput,
): Promise<SmsSendRecordId> {
  
  const sms_send_record_id2 = await sms_send_recordDao.updateById(sms_send_record_id, input);
  
  return sms_send_record_id2;
}

/** 校验短信发送记录是否存在 */
export async function validateOption(
  model0?: SmsSendRecordModel,
): Promise<SmsSendRecordModel> {
  const sms_send_record_model = await sms_send_recordDao.validateOption(model0);
  return sms_send_record_model;
}

/**
 * 根据 ids 删除短信发送记录
 */
export async function deleteByIds(
  sms_send_record_ids: SmsSendRecordId[],
): Promise<number> {
  
  const sms_send_record_num = await sms_send_recordDao.deleteByIds(sms_send_record_ids);
  return sms_send_record_num;
}

/**
 * 根据 ids 还原短信发送记录
 */
export async function revertByIds(
  sms_send_record_ids: SmsSendRecordId[],
): Promise<number> {
  
  const sms_send_record_num = await sms_send_recordDao.revertByIds(sms_send_record_ids);
  
  return sms_send_record_num;
}

/**
 * 根据 ids 彻底删除短信发送记录
 */
export async function forceDeleteByIds(
  sms_send_record_ids: SmsSendRecordId[],
): Promise<number> {
  
  const sms_send_record_num = await sms_send_recordDao.forceDeleteByIds(sms_send_record_ids);
  
  return sms_send_record_num;
}

/**
 * 获取短信发送记录字段注释
 */
export async function getFieldComments(): Promise<SmsSendRecordFieldComment> {
  const sms_send_record_fields = await sms_send_recordDao.getFieldComments();
  return sms_send_record_fields;
}
