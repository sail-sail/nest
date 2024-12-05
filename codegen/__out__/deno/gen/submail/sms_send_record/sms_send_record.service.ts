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
  
  const data = await sms_send_recordDao.findCount(search);
  return data;
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
  
  const models: SmsSendRecordModel[] = await sms_send_recordDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: SmsSendRecordInput,
) {
  const data = await sms_send_recordDao.setIdByLbl(input);
  return data;
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
  
  const model = await sms_send_recordDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找短信发送记录
 */
export async function findById(
  id?: SmsSendRecordId | null,
): Promise<SmsSendRecordModel | undefined> {
  const model = await sms_send_recordDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找短信发送记录是否存在
 */
export async function exist(
  search?: SmsSendRecordSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await sms_send_recordDao.exist(search);
  return data;
}

/**
 * 根据 id 查找短信发送记录是否存在
 */
export async function existById(
  id?: SmsSendRecordId | null,
): Promise<boolean> {
  const data = await sms_send_recordDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验短信发送记录
 */
export async function validate(
  input: SmsSendRecordInput,
): Promise<void> {
  const data = await sms_send_recordDao.validate(input);
  return data;
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
  const ids = await sms_send_recordDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改短信发送记录
 */
export async function updateById(
  id: SmsSendRecordId,
  input: SmsSendRecordInput,
): Promise<SmsSendRecordId> {
  
  const id2 = await sms_send_recordDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除短信发送记录
 */
export async function deleteByIds(
  ids: SmsSendRecordId[],
): Promise<number> {
  
  const data = await sms_send_recordDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原短信发送记录
 */
export async function revertByIds(
  ids: SmsSendRecordId[],
): Promise<number> {
  const data = await sms_send_recordDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除短信发送记录
 */
export async function forceDeleteByIds(
  ids: SmsSendRecordId[],
): Promise<number> {
  const data = await sms_send_recordDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取短信发送记录字段注释
 */
export async function getFieldComments(): Promise<SmsSendRecordFieldComment> {
  const data = await sms_send_recordDao.getFieldComments();
  return data;
}
