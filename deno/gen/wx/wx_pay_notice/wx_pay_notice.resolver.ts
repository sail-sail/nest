import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortWxPayNotice,
  intoInputWxPayNotice,
} from "./wx_pay_notice.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找微信支付通知总数
 */
export async function findCountWxPayNotice(
  search?: WxPayNoticeSearch,
): Promise<number> {
  
  const {
    findCountWxPayNotice,
  } = await import("./wx_pay_notice.service.ts");
  
  const num = await findCountWxPayNotice(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找微信支付通知列表
 */
export async function findAllWxPayNotice(
  search?: WxPayNoticeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxPayNoticeModel[]> {
  
  const {
    findAllWxPayNotice,
  } = await import("./wx_pay_notice.service.ts");
  
  checkSortWxPayNotice(sort);
  
  const models = await findAllWxPayNotice(search, page, sort);
  
  return models;
}

/**
 * 获取微信支付通知字段注释
 */
export async function getFieldCommentsWxPayNotice(): Promise<WxPayNoticeFieldComment> {
  
  const {
    getFieldCommentsWxPayNotice,
  } = await import("./wx_pay_notice.service.ts");
  
  const field_comment = await getFieldCommentsWxPayNotice();
  
  return field_comment;
}

/**
 * 根据条件查找第一个微信支付通知
 */
export async function findOneWxPayNotice(
  search?: WxPayNoticeSearch,
  sort?: SortInput[],
): Promise<WxPayNoticeModel | undefined> {
  
  const {
    findOneWxPayNotice,
  } = await import("./wx_pay_notice.service.ts");
  
  checkSortWxPayNotice(sort);
  
  const model = await findOneWxPayNotice(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个微信支付通知, 如果不存在则抛错
 */
export async function findOneOkWxPayNotice(
  search?: WxPayNoticeSearch,
  sort?: SortInput[],
): Promise<WxPayNoticeModel> {
  
  const {
    findOneOkWxPayNotice,
  } = await import("./wx_pay_notice.service.ts");
  
  checkSortWxPayNotice(sort);
  
  const model = await findOneOkWxPayNotice(search, sort);
  
  return model;
}

/**
 * 根据 id 查找微信支付通知
 */
export async function findByIdWxPayNotice(
  id: WxPayNoticeId,
): Promise<WxPayNoticeModel | undefined> {
  
  const {
    findByIdWxPayNotice,
  } = await import("./wx_pay_notice.service.ts");
  
  const model = await findByIdWxPayNotice(id);
  
  return model;
}

/**
 * 根据 id 查找微信支付通知, 如果不存在则抛错
 */
export async function findByIdOkWxPayNotice(
  id: WxPayNoticeId,
): Promise<WxPayNoticeModel | undefined> {
  
  const {
    findByIdOkWxPayNotice,
  } = await import("./wx_pay_notice.service.ts");
  
  const model = await findByIdOkWxPayNotice(id);
  
  return model;
}

/**
 * 根据 ids 查找微信支付通知
 */
export async function findByIdsWxPayNotice(
  ids: WxPayNoticeId[],
): Promise<WxPayNoticeModel[]> {
  
  const {
    findByIdsWxPayNotice,
  } = await import("./wx_pay_notice.service.ts");
  
  const models = await findByIdsWxPayNotice(ids);
  
  return models;
}

/**
 * 根据 ids 查找微信支付通知, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxPayNotice(
  ids: WxPayNoticeId[],
): Promise<WxPayNoticeModel[]> {
  
  const {
    findByIdsOkWxPayNotice,
  } = await import("./wx_pay_notice.service.ts");
  
  const models = await findByIdsOkWxPayNotice(ids);
  
  return models;
}
