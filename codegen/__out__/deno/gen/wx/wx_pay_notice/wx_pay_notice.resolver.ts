import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortWxPayNotice,
} from "./wx_pay_notice.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./wx_pay_notice.model.ts";

/**
 * 根据条件查找微信支付通知总数
 */
export async function findCountWxPayNotice(
  search?: WxPayNoticeSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wx_pay_notice.service.ts");
  
  const num = await findCount(search);
  
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
    findAll,
  } = await import("./wx_pay_notice.service.ts");
  
  checkSortWxPayNotice(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取微信支付通知字段注释
 */
export async function getFieldCommentsWxPayNotice(): Promise<WxPayNoticeFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./wx_pay_notice.service.ts");
  
  const field_comment = await getFieldComments();
  
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
    findOne,
  } = await import("./wx_pay_notice.service.ts");
  
  checkSortWxPayNotice(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找微信支付通知
 */
export async function findByIdWxPayNotice(
  id: WxPayNoticeId,
): Promise<WxPayNoticeModel | undefined> {
  
  const {
    findById,
  } = await import("./wx_pay_notice.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找微信支付通知
 */
export async function findByIdsWxPayNotice(
  ids: WxPayNoticeId[],
): Promise<WxPayNoticeModel[]> {
  
  const {
    findByIds,
  } = await import("./wx_pay_notice.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}
