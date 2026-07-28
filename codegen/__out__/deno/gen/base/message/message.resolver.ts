import {
  set_is_tran,
  set_is_creating,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortMessage,
  intoInputMessage,
} from "./message.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找消息总数
 */
export async function findCountMessage(
  search?: MessageSearch,
): Promise<number> {
  
  const {
    findCountMessage,
  } = await import("./message.service.ts");
  
  const num = await findCountMessage(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找消息列表
 */
export async function findAllMessage(
  search?: MessageSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<MessageModel[]> {
  
  const {
    findAllMessage,
  } = await import("./message.service.ts");
  
  checkSortMessage(sort);
  
  const models = await findAllMessage(search, page, sort);
  
  return models;
}

/**
 * 获取消息字段注释
 */
export async function getFieldCommentsMessage(): Promise<MessageFieldComment> {
  
  const {
    getFieldCommentsMessage,
  } = await import("./message.service.ts");
  
  const field_comment = await getFieldCommentsMessage();
  
  return field_comment;
}

/**
 * 根据条件查找第一个消息
 */
export async function findOneMessage(
  search?: MessageSearch,
  sort?: SortInput[],
): Promise<MessageModel | undefined> {
  
  const {
    findOneMessage,
  } = await import("./message.service.ts");
  
  checkSortMessage(sort);
  
  const model = await findOneMessage(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个消息, 如果不存在则抛错
 */
export async function findOneOkMessage(
  search?: MessageSearch,
  sort?: SortInput[],
): Promise<MessageModel> {
  
  const {
    findOneOkMessage,
  } = await import("./message.service.ts");
  
  checkSortMessage(sort);
  
  const model = await findOneOkMessage(search, sort);
  
  return model;
}

/**
 * 根据 id 查找消息
 */
export async function findByIdMessage(
  id: MessageId,
): Promise<MessageModel | undefined> {
  
  const {
    findByIdMessage,
  } = await import("./message.service.ts");
  
  const model = await findByIdMessage(id);
  
  return model;
}

/**
 * 根据 id 查找消息, 如果不存在则抛错
 */
export async function findByIdOkMessage(
  id: MessageId,
): Promise<MessageModel | undefined> {
  
  const {
    findByIdOkMessage,
  } = await import("./message.service.ts");
  
  const model = await findByIdOkMessage(id);
  
  return model;
}

/**
 * 根据 ids 查找消息
 */
export async function findByIdsMessage(
  ids: MessageId[],
): Promise<MessageModel[]> {
  
  const {
    findByIdsMessage,
  } = await import("./message.service.ts");
  
  const models = await findByIdsMessage(ids);
  
  return models;
}

/**
 * 根据 ids 查找消息, 出现查询不到的 id 则报错
 */
export async function findByIdsOkMessage(
  ids: MessageId[],
): Promise<MessageModel[]> {
  
  const {
    findByIdsOkMessage,
  } = await import("./message.service.ts");
  
  const models = await findByIdsOkMessage(ids);
  
  return models;
}

/**
 * 批量创建消息
 */
export async function createsMessage(
  inputs: MessageInput[],
  unique_type?: UniqueType,
): Promise<MessageId[]> {
  
  const {
    validateMessage,
    setIdByLblMessage,
    createsMessage,
  } = await import("./message.service.ts");
  
  const {
    getPagePathMessage,
  } = await import("./message.model.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    getPagePathMessage(),
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputMessage(input);
    
    await setIdByLblMessage(input);
    
    await validateMessage(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsMessage(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改消息
 */
export async function updateByIdMessage(
  id: MessageId,
  input: MessageInput,
): Promise<MessageId> {
  
  const {
    setIdByLblMessage,
    validateMessage,
    updateByIdMessage,
  } = await import("./message.service.ts");
  
  const {
    getPagePathMessage,
  } = await import("./message.model.ts");
  
  set_is_tran(true);
  
  intoInputMessage(input);
  
  await setIdByLblMessage(input);
  
  await validateMessage(input);
  
  await usePermit(
    getPagePathMessage(),
    "edit",
  );
  
  id = await updateByIdMessage(id, input);
  
  return id;
}

/**
 * 根据 ids 删除消息
 */
export async function deleteByIdsMessage(
  ids: MessageId[],
): Promise<number> {
  
  const {
    deleteByIdsMessage,
  } = await import("./message.service.ts");
  
  const {
    getPagePathMessage,
  } = await import("./message.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathMessage(),
    "delete",
  );
  
  const num = await deleteByIdsMessage(ids);
  
  return num;
}

/**
 * 根据 ids 还原消息
 */
export async function revertByIdsMessage(
  ids: MessageId[],
): Promise<number> {
  
  const {
    revertByIdsMessage,
  } = await import("./message.service.ts");
  
  const {
    getPagePathMessage,
  } = await import("./message.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathMessage(),
    "delete",
  );
  
  const res = await revertByIdsMessage(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除消息
 */
export async function forceDeleteByIdsMessage(
  ids: MessageId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsMessage,
  } = await import("./message.service.ts");
  
  const {
    getPagePathMessage,
  } = await import("./message.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathMessage(),
    "force_delete",
  );
  
  const res = await forceDeleteByIdsMessage(ids);
  
  return res;
}
