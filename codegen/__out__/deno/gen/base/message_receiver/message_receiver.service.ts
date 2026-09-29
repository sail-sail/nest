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

import * as message_receiverDao from "./message_receiver.dao.ts";

async function setSearchQuery(
  search: MessageReceiverSearch,
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
 * 根据条件查找消息接收人总数
 */
export async function findCountMessageReceiver(
  search?: MessageReceiverSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const message_receiver_num = await message_receiverDao.findCountMessageReceiver(search);
  
  return message_receiver_num;
}

/**
 * 根据搜索条件和分页查找消息接收人列表
 */
export async function findAllMessageReceiver(
  search?: MessageReceiverSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<MessageReceiverModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const message_receiver_models = await message_receiverDao.findAllMessageReceiver(search, page, sort);
  
  return message_receiver_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblMessageReceiver(
  input: MessageReceiverInput,
): Promise<void> {
  await message_receiverDao.setIdByLblMessageReceiver(input);
}

/**
 * 根据条件查找第一个消息接收人
 */
export async function findOneMessageReceiver(
  search?: MessageReceiverSearch,
  sort?: SortInput[],
): Promise<MessageReceiverModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const message_receiver_model = await message_receiverDao.findOneMessageReceiver(search, sort);
  
  return message_receiver_model;
}

/**
 * 根据条件查找第一个消息接收人, 如果不存在则抛错
 */
export async function findOneOkMessageReceiver(
  search?: MessageReceiverSearch,
  sort?: SortInput[],
): Promise<MessageReceiverModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const message_receiver_model = await message_receiverDao.findOneOkMessageReceiver(search, sort);
  
  return message_receiver_model;
}

/**
 * 根据 id 查找消息接收人
 */
export async function findByIdMessageReceiver(
  message_receiver_id: MessageReceiverId,
): Promise<MessageReceiverModel | undefined> {
  
  const message_receiver_model = await message_receiverDao.findByIdMessageReceiver(message_receiver_id);
  
  return message_receiver_model;
}

/**
 * 根据 id 查找消息接收人, 如果不存在则抛错
 */
export async function findByIdOkMessageReceiver(
  message_receiver_id: MessageReceiverId,
): Promise<MessageReceiverModel> {
  
  const message_receiver_model = await message_receiverDao.findByIdOkMessageReceiver(message_receiver_id);
  
  return message_receiver_model;
}

/**
 * 根据 ids 查找消息接收人
 */
export async function findByIdsMessageReceiver(
  message_receiver_ids: MessageReceiverId[],
): Promise<MessageReceiverModel[]> {
  
  const message_receiver_models = await message_receiverDao.findByIdsMessageReceiver(message_receiver_ids);
  
  return message_receiver_models;
}

/**
 * 根据 ids 查找消息接收人, 出现查询不到的 id 则报错
 */
export async function findByIdsOkMessageReceiver(
  message_receiver_ids: MessageReceiverId[],
): Promise<MessageReceiverModel[]> {
  
  const message_receiver_models = await message_receiverDao.findByIdsOkMessageReceiver(message_receiver_ids);
  
  return message_receiver_models;
}

/**
 * 根据搜索条件查找消息接收人是否存在
 */
export async function existsMessageReceiver(
  search?: MessageReceiverSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const message_receiver_exist = await message_receiverDao.existsMessageReceiver(search);
  
  return message_receiver_exist;
}

/**
 * 根据 id 查找消息接收人是否存在
 */
export async function existByIdMessageReceiver(
  message_receiver_id?: MessageReceiverId | null,
): Promise<boolean> {
  
  const message_receiver_exist = await message_receiverDao.existByIdMessageReceiver(message_receiver_id);
  
  return message_receiver_exist;
}

/**
 * 增加和修改时校验消息接收人
 */
export async function validateMessageReceiver(
  input: MessageReceiverInput,
): Promise<void> {
  await message_receiverDao.validateMessageReceiver(input);
}

/**
 * 批量创建消息接收人
 */
export async function createsMessageReceiver(
  inputs: MessageReceiverInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<MessageReceiverId[]> {
  const message_receiver_ids = await message_receiverDao.createsMessageReceiver(inputs, options);
  
  return message_receiver_ids;
}

/**
 * 根据 id 修改消息接收人
 */
export async function updateByIdMessageReceiver(
  message_receiver_id: MessageReceiverId,
  input: MessageReceiverInput,
): Promise<MessageReceiverId> {
  
  message_receiver_id = await message_receiverDao.updateByIdMessageReceiver(message_receiver_id, input);
  
  return message_receiver_id;
}

/** 校验消息接收人是否存在 */
export async function validateOptionMessageReceiver(
  model0?: MessageReceiverModel,
): Promise<MessageReceiverModel> {
  const message_receiver_model = await message_receiverDao.validateOptionMessageReceiver(model0);
  return message_receiver_model;
}

/**
 * 根据 ids 删除消息接收人
 */
export async function deleteByIdsMessageReceiver(
  message_receiver_ids: MessageReceiverId[],
): Promise<number> {
  
  const message_receiver_num = await message_receiverDao.deleteByIdsMessageReceiver(message_receiver_ids);
  return message_receiver_num;
}

/**
 * 根据 ids 还原消息接收人
 */
export async function revertByIdsMessageReceiver(
  message_receiver_ids: MessageReceiverId[],
): Promise<number> {
  
  const message_receiver_num = await message_receiverDao.revertByIdsMessageReceiver(message_receiver_ids);
  
  return message_receiver_num;
}

/**
 * 根据 ids 彻底删除消息接收人
 */
export async function forceDeleteByIdsMessageReceiver(
  message_receiver_ids: MessageReceiverId[],
): Promise<number> {
  
  const message_receiver_num = await message_receiverDao.forceDeleteByIdsMessageReceiver(message_receiver_ids);
  
  return message_receiver_num;
}

/**
 * 获取消息接收人字段注释
 */
export async function getFieldCommentsMessageReceiver(): Promise<MessageReceiverFieldComment> {
  const message_receiver_fields = await message_receiverDao.getFieldCommentsMessageReceiver();
  return message_receiver_fields;
}
