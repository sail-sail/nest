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
  checkSortMessageReceiver,
  intoInputMessageReceiver,
} from "./message_receiver.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找消息接收人总数
 */
export async function findCountMessageReceiver(
  search?: MessageReceiverSearch,
): Promise<number> {
  
  const {
    findCountMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const {
    getPagePathMessageReceiver,
  } = await import("./message_receiver.model.ts");
  
  await usePermit(
    getPagePathMessageReceiver(),
    "find",
  );
  
  const num = await findCountMessageReceiver(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找消息接收人列表
 */
export async function findAllMessageReceiver(
  search?: MessageReceiverSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<MessageReceiverModel[]> {
  
  const {
    findAllMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const {
    getPagePathMessageReceiver,
  } = await import("./message_receiver.model.ts");
  
  await usePermit(
    getPagePathMessageReceiver(),
    "find",
  );
  
  checkSortMessageReceiver(sort);
  
  const models = await findAllMessageReceiver(search, page, sort);
  
  return models;
}

/**
 * 获取消息接收人字段注释
 */
export async function getFieldCommentsMessageReceiver(): Promise<MessageReceiverFieldComment> {
  
  const {
    getFieldCommentsMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const field_comment = await getFieldCommentsMessageReceiver();
  
  return field_comment;
}

/**
 * 根据条件查找第一个消息接收人
 */
export async function findOneMessageReceiver(
  search?: MessageReceiverSearch,
  sort?: SortInput[],
): Promise<MessageReceiverModel | undefined> {
  
  const {
    findOneMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const {
    getPagePathMessageReceiver,
  } = await import("./message_receiver.model.ts");
  
  await usePermit(
    getPagePathMessageReceiver(),
    "find",
  );
  
  checkSortMessageReceiver(sort);
  
  const model = await findOneMessageReceiver(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个消息接收人, 如果不存在则抛错
 */
export async function findOneOkMessageReceiver(
  search?: MessageReceiverSearch,
  sort?: SortInput[],
): Promise<MessageReceiverModel> {
  
  const {
    findOneOkMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const {
    getPagePathMessageReceiver,
  } = await import("./message_receiver.model.ts");
  
  await usePermit(
    getPagePathMessageReceiver(),
    "find",
  );
  
  checkSortMessageReceiver(sort);
  
  const model = await findOneOkMessageReceiver(search, sort);
  
  return model;
}

/**
 * 根据 id 查找消息接收人
 */
export async function findByIdMessageReceiver(
  id: MessageReceiverId,
): Promise<MessageReceiverModel | undefined> {
  
  const {
    findByIdMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const {
    getPagePathMessageReceiver,
  } = await import("./message_receiver.model.ts");
  
  await usePermit(
    getPagePathMessageReceiver(),
    "find",
  );
  
  const model = await findByIdMessageReceiver(id);
  
  return model;
}

/**
 * 根据 id 查找消息接收人, 如果不存在则抛错
 */
export async function findByIdOkMessageReceiver(
  id: MessageReceiverId,
): Promise<MessageReceiverModel | undefined> {
  
  const {
    findByIdOkMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const {
    getPagePathMessageReceiver,
  } = await import("./message_receiver.model.ts");
  
  await usePermit(
    getPagePathMessageReceiver(),
    "find",
  );
  
  const model = await findByIdOkMessageReceiver(id);
  
  return model;
}

/**
 * 根据 ids 查找消息接收人
 */
export async function findByIdsMessageReceiver(
  ids: MessageReceiverId[],
): Promise<MessageReceiverModel[]> {
  
  const {
    findByIdsMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const {
    getPagePathMessageReceiver,
  } = await import("./message_receiver.model.ts");
  
  await usePermit(
    getPagePathMessageReceiver(),
    "find",
  );
  
  const models = await findByIdsMessageReceiver(ids);
  
  return models;
}

/**
 * 根据 ids 查找消息接收人, 出现查询不到的 id 则报错
 */
export async function findByIdsOkMessageReceiver(
  ids: MessageReceiverId[],
): Promise<MessageReceiverModel[]> {
  
  const {
    findByIdsOkMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const {
    getPagePathMessageReceiver,
  } = await import("./message_receiver.model.ts");
  
  await usePermit(
    getPagePathMessageReceiver(),
    "find",
  );
  
  const models = await findByIdsOkMessageReceiver(ids);
  
  return models;
}

/**
 * 批量创建消息接收人
 */
export async function createsMessageReceiver(
  inputs: MessageReceiverInput[],
  unique_type?: UniqueType,
): Promise<MessageReceiverId[]> {
  
  const {
    validateMessageReceiver,
    setIdByLblMessageReceiver,
    createsMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const {
    getPagePathMessageReceiver,
  } = await import("./message_receiver.model.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    getPagePathMessageReceiver(),
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputMessageReceiver(input);
    
    await setIdByLblMessageReceiver(input);
    
    await validateMessageReceiver(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsMessageReceiver(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改消息接收人
 */
export async function updateByIdMessageReceiver(
  id: MessageReceiverId,
  input: MessageReceiverInput,
): Promise<MessageReceiverId> {
  
  const {
    setIdByLblMessageReceiver,
    validateMessageReceiver,
    updateByIdMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const {
    getPagePathMessageReceiver,
  } = await import("./message_receiver.model.ts");
  
  set_is_tran(true);
  
  intoInputMessageReceiver(input);
  
  await setIdByLblMessageReceiver(input);
  
  await validateMessageReceiver(input);
  
  await usePermit(
    getPagePathMessageReceiver(),
    "edit",
  );
  
  id = await updateByIdMessageReceiver(id, input);
  
  return id;
}

/**
 * 根据 ids 删除消息接收人
 */
export async function deleteByIdsMessageReceiver(
  ids: MessageReceiverId[],
): Promise<number> {
  
  const {
    deleteByIdsMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const {
    getPagePathMessageReceiver,
  } = await import("./message_receiver.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathMessageReceiver(),
    "delete",
  );
  
  const num = await deleteByIdsMessageReceiver(ids);
  
  return num;
}

/**
 * 根据 ids 还原消息接收人
 */
export async function revertByIdsMessageReceiver(
  ids: MessageReceiverId[],
): Promise<number> {
  
  const {
    revertByIdsMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const {
    getPagePathMessageReceiver,
  } = await import("./message_receiver.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathMessageReceiver(),
    "delete",
  );
  
  const res = await revertByIdsMessageReceiver(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除消息接收人
 */
export async function forceDeleteByIdsMessageReceiver(
  ids: MessageReceiverId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsMessageReceiver,
  } = await import("./message_receiver.service.ts");
  
  const {
    getPagePathMessageReceiver,
  } = await import("./message_receiver.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathMessageReceiver(),
    "force_delete",
  );
  
  const res = await forceDeleteByIdsMessageReceiver(ids);
  
  return res;
}
