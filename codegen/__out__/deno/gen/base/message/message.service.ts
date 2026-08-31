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
  findByIdOkUsr,
} from "/gen/base/usr/usr.dao.ts";

import * as messageDao from "./message.dao.ts";

async function setSearchQuery(
  search: MessageSearch,
) {
  
  const usr_id = search.auth_usr_id || await get_usr_id(false);
  const org_id = await get_org_id();
  const usr_model = await findByIdOkUsr(usr_id);
  const org_ids: OrgId[] = [ ];
  if (!search.auth_usr_id && org_id) {
    org_ids.push(org_id);
  } else {
    org_ids.push(...usr_model.org_ids);
    org_ids.push("" as OrgId);
  }
  
  search.org_id = org_ids;
  
}

/**
 * 根据条件查找消息总数
 */
export async function findCountMessage(
  search?: MessageSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const message_num = await messageDao.findCountMessage(search);
  
  return message_num;
}

/**
 * 根据搜索条件和分页查找消息列表
 */
export async function findAllMessage(
  search?: MessageSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<MessageModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const message_models = await messageDao.findAllMessage(search, page, sort);
  
  return message_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblMessage(
  input: MessageInput,
): Promise<void> {
  await messageDao.setIdByLblMessage(input);
}

/**
 * 根据条件查找第一个消息
 */
export async function findOneMessage(
  search?: MessageSearch,
  sort?: SortInput[],
): Promise<MessageModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const message_model = await messageDao.findOneMessage(search, sort);
  
  return message_model;
}

/**
 * 根据条件查找第一个消息, 如果不存在则抛错
 */
export async function findOneOkMessage(
  search?: MessageSearch,
  sort?: SortInput[],
): Promise<MessageModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const message_model = await messageDao.findOneOkMessage(search, sort);
  
  return message_model;
}

/**
 * 根据 id 查找消息
 */
export async function findByIdMessage(
  message_id: MessageId,
): Promise<MessageModel | undefined> {
  
  const message_model = await messageDao.findByIdMessage(message_id);
  
  return message_model;
}

/**
 * 根据 id 查找消息, 如果不存在则抛错
 */
export async function findByIdOkMessage(
  message_id: MessageId,
): Promise<MessageModel> {
  
  const message_model = await messageDao.findByIdOkMessage(message_id);
  
  return message_model;
}

/**
 * 根据 ids 查找消息
 */
export async function findByIdsMessage(
  message_ids: MessageId[],
): Promise<MessageModel[]> {
  
  const message_models = await messageDao.findByIdsMessage(message_ids);
  
  return message_models;
}

/**
 * 根据 ids 查找消息, 出现查询不到的 id 则报错
 */
export async function findByIdsOkMessage(
  message_ids: MessageId[],
): Promise<MessageModel[]> {
  
  const message_models = await messageDao.findByIdsOkMessage(message_ids);
  
  return message_models;
}

/**
 * 根据搜索条件查找消息是否存在
 */
export async function existMessage(
  search?: MessageSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const message_exist = await messageDao.existMessage(search);
  
  return message_exist;
}

/**
 * 根据 id 查找消息是否存在
 */
export async function existByIdMessage(
  message_id?: MessageId | null,
): Promise<boolean> {
  
  const message_exist = await messageDao.existByIdMessage(message_id);
  
  return message_exist;
}

/**
 * 增加和修改时校验消息
 */
export async function validateMessage(
  input: MessageInput,
): Promise<void> {
  await messageDao.validateMessage(input);
}

/**
 * 批量创建消息
 */
export async function createsMessage(
  inputs: MessageInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<MessageId[]> {
  const message_ids = await messageDao.createsMessage(inputs, options);
  
  return message_ids;
}

/**
 * 根据 id 修改消息
 */
export async function updateByIdMessage(
  message_id: MessageId,
  input: MessageInput,
): Promise<MessageId> {
  
  message_id = await messageDao.updateByIdMessage(message_id, input);
  
  return message_id;
}

/** 校验消息是否存在 */
export async function validateOptionMessage(
  model0?: MessageModel,
): Promise<MessageModel> {
  const message_model = await messageDao.validateOptionMessage(model0);
  return message_model;
}

/**
 * 根据 ids 删除消息
 */
export async function deleteByIdsMessage(
  message_ids: MessageId[],
): Promise<number> {
  
  const message_num = await messageDao.deleteByIdsMessage(message_ids);
  return message_num;
}

/**
 * 根据 ids 还原消息
 */
export async function revertByIdsMessage(
  message_ids: MessageId[],
): Promise<number> {
  
  const message_num = await messageDao.revertByIdsMessage(message_ids);
  
  return message_num;
}

/**
 * 根据 ids 彻底删除消息
 */
export async function forceDeleteByIdsMessage(
  message_ids: MessageId[],
): Promise<number> {
  
  const message_num = await messageDao.forceDeleteByIdsMessage(message_ids);
  
  return message_num;
}

/**
 * 获取消息字段注释
 */
export async function getFieldCommentsMessage(): Promise<MessageFieldComment> {
  const message_fields = await messageDao.getFieldCommentsMessage();
  return message_fields;
}
