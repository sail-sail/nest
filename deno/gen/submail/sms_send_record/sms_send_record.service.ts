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
export async function findCountSmsSendRecord(
  search?: SmsSendRecordSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_send_record_num = await sms_send_recordDao.findCountSmsSendRecord(search);
  
  return sms_send_record_num;
}

/**
 * 根据搜索条件和分页查找短信发送记录列表
 */
export async function findAllSmsSendRecord(
  search?: SmsSendRecordSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<SmsSendRecordModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_send_record_models = await sms_send_recordDao.findAllSmsSendRecord(search, page, sort);
  
  return sms_send_record_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblSmsSendRecord(
  input: SmsSendRecordInput,
): Promise<void> {
  await sms_send_recordDao.setIdByLblSmsSendRecord(input);
}

/**
 * 根据条件查找第一个短信发送记录
 */
export async function findOneSmsSendRecord(
  search?: SmsSendRecordSearch,
  sort?: SortInput[],
): Promise<SmsSendRecordModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_send_record_model = await sms_send_recordDao.findOneSmsSendRecord(search, sort);
  
  return sms_send_record_model;
}

/**
 * 根据条件查找第一个短信发送记录, 如果不存在则抛错
 */
export async function findOneOkSmsSendRecord(
  search?: SmsSendRecordSearch,
  sort?: SortInput[],
): Promise<SmsSendRecordModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_send_record_model = await sms_send_recordDao.findOneOkSmsSendRecord(search, sort);
  
  return sms_send_record_model;
}

/**
 * 根据 id 查找短信发送记录
 */
export async function findByIdSmsSendRecord(
  sms_send_record_id: SmsSendRecordId,
): Promise<SmsSendRecordModel | undefined> {
  
  const sms_send_record_model = await sms_send_recordDao.findByIdSmsSendRecord(sms_send_record_id);
  
  return sms_send_record_model;
}

/**
 * 根据 id 查找短信发送记录, 如果不存在则抛错
 */
export async function findByIdOkSmsSendRecord(
  sms_send_record_id: SmsSendRecordId,
): Promise<SmsSendRecordModel> {
  
  const sms_send_record_model = await sms_send_recordDao.findByIdOkSmsSendRecord(sms_send_record_id);
  
  return sms_send_record_model;
}

/**
 * 根据 ids 查找短信发送记录
 */
export async function findByIdsSmsSendRecord(
  sms_send_record_ids: SmsSendRecordId[],
): Promise<SmsSendRecordModel[]> {
  
  const sms_send_record_models = await sms_send_recordDao.findByIdsSmsSendRecord(sms_send_record_ids);
  
  return sms_send_record_models;
}

/**
 * 根据 ids 查找短信发送记录, 出现查询不到的 id 则报错
 */
export async function findByIdsOkSmsSendRecord(
  sms_send_record_ids: SmsSendRecordId[],
): Promise<SmsSendRecordModel[]> {
  
  const sms_send_record_models = await sms_send_recordDao.findByIdsOkSmsSendRecord(sms_send_record_ids);
  
  return sms_send_record_models;
}

/**
 * 根据搜索条件查找短信发送记录是否存在
 */
export async function existSmsSendRecord(
  search?: SmsSendRecordSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const sms_send_record_exist = await sms_send_recordDao.existSmsSendRecord(search);
  
  return sms_send_record_exist;
}

/**
 * 根据 id 查找短信发送记录是否存在
 */
export async function existByIdSmsSendRecord(
  sms_send_record_id?: SmsSendRecordId | null,
): Promise<boolean> {
  
  const sms_send_record_exist = await sms_send_recordDao.existByIdSmsSendRecord(sms_send_record_id);
  
  return sms_send_record_exist;
}

/**
 * 增加和修改时校验短信发送记录
 */
export async function validateSmsSendRecord(
  input: SmsSendRecordInput,
): Promise<void> {
  await sms_send_recordDao.validateSmsSendRecord(input);
}

/**
 * 批量创建短信发送记录
 */
export async function createsSmsSendRecord(
  inputs: SmsSendRecordInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<SmsSendRecordId[]> {
  const sms_send_record_ids = await sms_send_recordDao.createsSmsSendRecord(inputs, options);
  
  return sms_send_record_ids;
}

/**
 * 根据 id 修改短信发送记录
 */
export async function updateByIdSmsSendRecord(
  sms_send_record_id: SmsSendRecordId,
  input: SmsSendRecordInput,
): Promise<SmsSendRecordId> {
  
  const sms_send_record_id2 = await sms_send_recordDao.updateByIdSmsSendRecord(sms_send_record_id, input);
  
  return sms_send_record_id2;
}

/** 校验短信发送记录是否存在 */
export async function validateOptionSmsSendRecord(
  model0?: SmsSendRecordModel,
): Promise<SmsSendRecordModel> {
  const sms_send_record_model = await sms_send_recordDao.validateOptionSmsSendRecord(model0);
  return sms_send_record_model;
}

/**
 * 根据 ids 删除短信发送记录
 */
export async function deleteByIdsSmsSendRecord(
  sms_send_record_ids: SmsSendRecordId[],
): Promise<number> {
  
  const sms_send_record_num = await sms_send_recordDao.deleteByIdsSmsSendRecord(sms_send_record_ids);
  return sms_send_record_num;
}

/**
 * 根据 ids 还原短信发送记录
 */
export async function revertByIdsSmsSendRecord(
  sms_send_record_ids: SmsSendRecordId[],
): Promise<number> {
  
  const sms_send_record_num = await sms_send_recordDao.revertByIdsSmsSendRecord(sms_send_record_ids);
  
  return sms_send_record_num;
}

/**
 * 根据 ids 彻底删除短信发送记录
 */
export async function forceDeleteByIdsSmsSendRecord(
  sms_send_record_ids: SmsSendRecordId[],
): Promise<number> {
  
  const sms_send_record_num = await sms_send_recordDao.forceDeleteByIdsSmsSendRecord(sms_send_record_ids);
  
  return sms_send_record_num;
}

/**
 * 获取短信发送记录字段注释
 */
export async function getFieldCommentsSmsSendRecord(): Promise<SmsSendRecordFieldComment> {
  const sms_send_record_fields = await sms_send_recordDao.getFieldCommentsSmsSendRecord();
  return sms_send_record_fields;
}
