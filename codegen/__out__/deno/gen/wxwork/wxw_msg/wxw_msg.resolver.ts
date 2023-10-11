import {
  useContext,
} from "/lib/context.ts";

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  WxwMsgInput,
  WxwMsgModel,
  WxwMsgSearch,
  WxwMsgFieldComment,
} from "./wxw_msg.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountWxwMsg(
  search?: WxwMsgSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const { findCount } = await import("./wxw_msg.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllWxwMsg(
  search?: WxwMsgSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwMsgModel[]> {
  const { findAll } = await import("./wxw_msg.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsWxwMsg(): Promise<WxwMsgFieldComment> {
  const { getFieldComments } = await import("./wxw_msg.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneWxwMsg(
  search?: WxwMsgSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<WxwMsgModel | undefined> {
  const { findOne } = await import("./wxw_msg.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdWxwMsg(
  id: string,
): Promise<WxwMsgModel | undefined> {
  const { findById } = await import("./wxw_msg.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsWxwMsg(
  ids: string[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wxw_msg.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wxwork/wxw_msg",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsWxwMsg(
  ids: string[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wxw_msg.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wxwork/wxw_msg",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsWxwMsg(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wxwork/wxw_msg",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./wxw_msg.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
