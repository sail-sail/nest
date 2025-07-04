import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortWxwMsg,
} from "./wxw_msg.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./wxw_msg.model.ts";

/**
 * 根据条件查找企微消息总数
 */
export async function findCountWxwMsg(
  search?: WxwMsgSearch,
): Promise<number> {
  
  const {
    findCountWxwMsg,
  } = await import("./wxw_msg.service.ts");
  
  const num = await findCountWxwMsg(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找企微消息列表
 */
export async function findAllWxwMsg(
  search?: WxwMsgSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwMsgModel[]> {
  
  const {
    findAllWxwMsg,
  } = await import("./wxw_msg.service.ts");
  
  checkSortWxwMsg(sort);
  
  const models = await findAllWxwMsg(search, page, sort);
  
  return models;
}

/**
 * 获取企微消息字段注释
 */
export async function getFieldCommentsWxwMsg(): Promise<WxwMsgFieldComment> {
  
  const {
    getFieldCommentsWxwMsg,
  } = await import("./wxw_msg.service.ts");
  
  const field_comment = await getFieldCommentsWxwMsg();
  
  return field_comment;
}

/**
 * 根据条件查找第一个企微消息
 */
export async function findOneWxwMsg(
  search?: WxwMsgSearch,
  sort?: SortInput[],
): Promise<WxwMsgModel | undefined> {
  
  const {
    findOneWxwMsg,
  } = await import("./wxw_msg.service.ts");
  
  checkSortWxwMsg(sort);
  
  const model = await findOneWxwMsg(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个企微消息, 如果不存在则抛错
 */
export async function findOneOkWxwMsg(
  search?: WxwMsgSearch,
  sort?: SortInput[],
): Promise<WxwMsgModel> {
  
  const {
    findOneOkWxwMsg,
  } = await import("./wxw_msg.service.ts");
  
  checkSortWxwMsg(sort);
  
  const model = await findOneOkWxwMsg(search, sort);
  
  return model;
}

/**
 * 根据 id 查找企微消息
 */
export async function findByIdWxwMsg(
  id: WxwMsgId,
): Promise<WxwMsgModel | undefined> {
  
  const {
    findByIdWxwMsg,
  } = await import("./wxw_msg.service.ts");
  
  const model = await findByIdWxwMsg(id);
  
  return model;
}

/**
 * 根据 id 查找企微消息, 如果不存在则抛错
 */
export async function findByIdOkWxwMsg(
  id: WxwMsgId,
): Promise<WxwMsgModel | undefined> {
  
  const {
    findByIdOkWxwMsg,
  } = await import("./wxw_msg.service.ts");
  
  const model = await findByIdOkWxwMsg(id);
  
  return model;
}

/**
 * 根据 ids 查找企微消息
 */
export async function findByIdsWxwMsg(
  ids: WxwMsgId[],
): Promise<WxwMsgModel[]> {
  
  const {
    findByIdsWxwMsg,
  } = await import("./wxw_msg.service.ts");
  
  const models = await findByIdsWxwMsg(ids);
  
  return models;
}

/**
 * 根据 ids 查找企微消息, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxwMsg(
  ids: WxwMsgId[],
): Promise<WxwMsgModel[]> {
  
  const {
    findByIdsOkWxwMsg,
  } = await import("./wxw_msg.service.ts");
  
  const models = await findByIdsOkWxwMsg(ids);
  
  return models;
}

/**
 * 根据 ids 删除企微消息
 */
export async function deleteByIdsWxwMsg(
  ids: WxwMsgId[],
): Promise<number> {
  
  const {
    deleteByIdsWxwMsg,
  } = await import("./wxw_msg.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsWxwMsg(ids);
  
  return num;
}

/**
 * 根据 ids 还原企微消息
 */
export async function revertByIdsWxwMsg(
  ids: WxwMsgId[],
): Promise<number> {
  
  const {
    revertByIdsWxwMsg,
  } = await import("./wxw_msg.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsWxwMsg(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除企微消息
 */
export async function forceDeleteByIdsWxwMsg(
  ids: WxwMsgId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsWxwMsg,
  } = await import("./wxw_msg.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsWxwMsg(ids);
  
  return res;
}
