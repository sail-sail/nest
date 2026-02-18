import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortWxRefundNotice,
  intoInputWxRefundNotice,
} from "./wx_refund_notice.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找微信退款通知总数
 */
export async function findCountWxRefundNotice(
  search?: WxRefundNoticeSearch,
): Promise<number> {
  
  const {
    findCountWxRefundNotice,
  } = await import("./wx_refund_notice.service.ts");
  
  const num = await findCountWxRefundNotice(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找微信退款通知列表
 */
export async function findAllWxRefundNotice(
  search?: WxRefundNoticeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxRefundNoticeModel[]> {
  
  const {
    findAllWxRefundNotice,
  } = await import("./wx_refund_notice.service.ts");
  
  checkSortWxRefundNotice(sort);
  
  const models = await findAllWxRefundNotice(search, page, sort);
  
  return models;
}

/**
 * 获取微信退款通知字段注释
 */
export async function getFieldCommentsWxRefundNotice(): Promise<WxRefundNoticeFieldComment> {
  
  const {
    getFieldCommentsWxRefundNotice,
  } = await import("./wx_refund_notice.service.ts");
  
  const field_comment = await getFieldCommentsWxRefundNotice();
  
  return field_comment;
}

/**
 * 根据条件查找第一个微信退款通知
 */
export async function findOneWxRefundNotice(
  search?: WxRefundNoticeSearch,
  sort?: SortInput[],
): Promise<WxRefundNoticeModel | undefined> {
  
  const {
    findOneWxRefundNotice,
  } = await import("./wx_refund_notice.service.ts");
  
  checkSortWxRefundNotice(sort);
  
  const model = await findOneWxRefundNotice(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个微信退款通知, 如果不存在则抛错
 */
export async function findOneOkWxRefundNotice(
  search?: WxRefundNoticeSearch,
  sort?: SortInput[],
): Promise<WxRefundNoticeModel> {
  
  const {
    findOneOkWxRefundNotice,
  } = await import("./wx_refund_notice.service.ts");
  
  checkSortWxRefundNotice(sort);
  
  const model = await findOneOkWxRefundNotice(search, sort);
  
  return model;
}

/**
 * 根据 id 查找微信退款通知
 */
export async function findByIdWxRefundNotice(
  id: WxRefundNoticeId,
): Promise<WxRefundNoticeModel | undefined> {
  
  const {
    findByIdWxRefundNotice,
  } = await import("./wx_refund_notice.service.ts");
  
  const model = await findByIdWxRefundNotice(id);
  
  return model;
}

/**
 * 根据 id 查找微信退款通知, 如果不存在则抛错
 */
export async function findByIdOkWxRefundNotice(
  id: WxRefundNoticeId,
): Promise<WxRefundNoticeModel | undefined> {
  
  const {
    findByIdOkWxRefundNotice,
  } = await import("./wx_refund_notice.service.ts");
  
  const model = await findByIdOkWxRefundNotice(id);
  
  return model;
}

/**
 * 根据 ids 查找微信退款通知
 */
export async function findByIdsWxRefundNotice(
  ids: WxRefundNoticeId[],
): Promise<WxRefundNoticeModel[]> {
  
  const {
    findByIdsWxRefundNotice,
  } = await import("./wx_refund_notice.service.ts");
  
  const models = await findByIdsWxRefundNotice(ids);
  
  return models;
}

/**
 * 根据 ids 查找微信退款通知, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxRefundNotice(
  ids: WxRefundNoticeId[],
): Promise<WxRefundNoticeModel[]> {
  
  const {
    findByIdsOkWxRefundNotice,
  } = await import("./wx_refund_notice.service.ts");
  
  const models = await findByIdsOkWxRefundNotice(ids);
  
  return models;
}
