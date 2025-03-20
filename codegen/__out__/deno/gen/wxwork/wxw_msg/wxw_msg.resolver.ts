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
    findCount,
  } = await import("./wxw_msg.service.ts");
  
  const num = await findCount(search);
  
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
    findAll,
  } = await import("./wxw_msg.service.ts");
  
  checkSortWxwMsg(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取企微消息字段注释
 */
export async function getFieldCommentsWxwMsg(): Promise<WxwMsgFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./wxw_msg.service.ts");
  
  const field_comment = await getFieldComments();
  
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
    findOne,
  } = await import("./wxw_msg.service.ts");
  
  checkSortWxwMsg(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找企微消息
 */
export async function findByIdWxwMsg(
  id: WxwMsgId,
): Promise<WxwMsgModel | undefined> {
  
  const {
    findById,
  } = await import("./wxw_msg.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找企微消息
 */
export async function findByIdsWxwMsg(
  ids: WxwMsgId[],
): Promise<WxwMsgModel[]> {
  
  const {
    findByIds,
  } = await import("./wxw_msg.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 删除企微消息
 */
export async function deleteByIdsWxwMsg(
  ids: WxwMsgId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wxw_msg.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原企微消息
 */
export async function revertByIdsWxwMsg(
  ids: WxwMsgId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wxw_msg.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除企微消息
 */
export async function forceDeleteByIdsWxwMsg(
  ids: WxwMsgId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./wxw_msg.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
