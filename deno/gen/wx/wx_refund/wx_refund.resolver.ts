import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortWxRefund,
  intoInputWxRefund,
} from "./wx_refund.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找微信退款申请总数
 */
export async function findCountWxRefund(
  search?: WxRefundSearch,
): Promise<number> {
  
  const {
    findCountWxRefund,
  } = await import("./wx_refund.service.ts");
  
  const num = await findCountWxRefund(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找微信退款申请列表
 */
export async function findAllWxRefund(
  search?: WxRefundSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxRefundModel[]> {
  
  const {
    findAllWxRefund,
  } = await import("./wx_refund.service.ts");
  
  checkSortWxRefund(sort);
  
  const models = await findAllWxRefund(search, page, sort);
  
  return models;
}

/**
 * 获取微信退款申请字段注释
 */
export async function getFieldCommentsWxRefund(): Promise<WxRefundFieldComment> {
  
  const {
    getFieldCommentsWxRefund,
  } = await import("./wx_refund.service.ts");
  
  const field_comment = await getFieldCommentsWxRefund();
  
  return field_comment;
}

/**
 * 根据条件查找第一个微信退款申请
 */
export async function findOneWxRefund(
  search?: WxRefundSearch,
  sort?: SortInput[],
): Promise<WxRefundModel | undefined> {
  
  const {
    findOneWxRefund,
  } = await import("./wx_refund.service.ts");
  
  checkSortWxRefund(sort);
  
  const model = await findOneWxRefund(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个微信退款申请, 如果不存在则抛错
 */
export async function findOneOkWxRefund(
  search?: WxRefundSearch,
  sort?: SortInput[],
): Promise<WxRefundModel> {
  
  const {
    findOneOkWxRefund,
  } = await import("./wx_refund.service.ts");
  
  checkSortWxRefund(sort);
  
  const model = await findOneOkWxRefund(search, sort);
  
  return model;
}

/**
 * 根据 id 查找微信退款申请
 */
export async function findByIdWxRefund(
  id: WxRefundId,
): Promise<WxRefundModel | undefined> {
  
  const {
    findByIdWxRefund,
  } = await import("./wx_refund.service.ts");
  
  const model = await findByIdWxRefund(id);
  
  return model;
}

/**
 * 根据 id 查找微信退款申请, 如果不存在则抛错
 */
export async function findByIdOkWxRefund(
  id: WxRefundId,
): Promise<WxRefundModel | undefined> {
  
  const {
    findByIdOkWxRefund,
  } = await import("./wx_refund.service.ts");
  
  const model = await findByIdOkWxRefund(id);
  
  return model;
}

/**
 * 根据 ids 查找微信退款申请
 */
export async function findByIdsWxRefund(
  ids: WxRefundId[],
): Promise<WxRefundModel[]> {
  
  const {
    findByIdsWxRefund,
  } = await import("./wx_refund.service.ts");
  
  const models = await findByIdsWxRefund(ids);
  
  return models;
}

/**
 * 根据 ids 查找微信退款申请, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxRefund(
  ids: WxRefundId[],
): Promise<WxRefundModel[]> {
  
  const {
    findByIdsOkWxRefund,
  } = await import("./wx_refund.service.ts");
  
  const models = await findByIdsOkWxRefund(ids);
  
  return models;
}
