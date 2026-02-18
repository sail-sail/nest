import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wx_refundDao from "./wx_refund.dao.ts";

async function setSearchQuery(
  _search: WxRefundSearch,
) {
  
}

/**
 * 根据条件查找微信退款申请总数
 */
export async function findCountWxRefund(
  search?: WxRefundSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_refund_num = await wx_refundDao.findCountWxRefund(search);
  
  return wx_refund_num;
}

/**
 * 根据搜索条件和分页查找微信退款申请列表
 */
export async function findAllWxRefund(
  search?: WxRefundSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxRefundModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_refund_models = await wx_refundDao.findAllWxRefund(search, page, sort);
  
  return wx_refund_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxRefund(
  input: WxRefundInput,
): Promise<void> {
  await wx_refundDao.setIdByLblWxRefund(input);
}

/**
 * 根据条件查找第一个微信退款申请
 */
export async function findOneWxRefund(
  search?: WxRefundSearch,
  sort?: SortInput[],
): Promise<WxRefundModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_refund_model = await wx_refundDao.findOneWxRefund(search, sort);
  
  return wx_refund_model;
}

/**
 * 根据条件查找第一个微信退款申请, 如果不存在则抛错
 */
export async function findOneOkWxRefund(
  search?: WxRefundSearch,
  sort?: SortInput[],
): Promise<WxRefundModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_refund_model = await wx_refundDao.findOneOkWxRefund(search, sort);
  
  return wx_refund_model;
}

/**
 * 根据 id 查找微信退款申请
 */
export async function findByIdWxRefund(
  wx_refund_id: WxRefundId,
): Promise<WxRefundModel | undefined> {
  
  const wx_refund_model = await wx_refundDao.findByIdWxRefund(wx_refund_id);
  
  return wx_refund_model;
}

/**
 * 根据 id 查找微信退款申请, 如果不存在则抛错
 */
export async function findByIdOkWxRefund(
  wx_refund_id: WxRefundId,
): Promise<WxRefundModel> {
  
  const wx_refund_model = await wx_refundDao.findByIdOkWxRefund(wx_refund_id);
  
  return wx_refund_model;
}

/**
 * 根据 ids 查找微信退款申请
 */
export async function findByIdsWxRefund(
  wx_refund_ids: WxRefundId[],
): Promise<WxRefundModel[]> {
  
  const wx_refund_models = await wx_refundDao.findByIdsWxRefund(wx_refund_ids);
  
  return wx_refund_models;
}

/**
 * 根据 ids 查找微信退款申请, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxRefund(
  wx_refund_ids: WxRefundId[],
): Promise<WxRefundModel[]> {
  
  const wx_refund_models = await wx_refundDao.findByIdsOkWxRefund(wx_refund_ids);
  
  return wx_refund_models;
}

/**
 * 根据搜索条件查找微信退款申请是否存在
 */
export async function existWxRefund(
  search?: WxRefundSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_refund_exist = await wx_refundDao.existWxRefund(search);
  
  return wx_refund_exist;
}

/**
 * 根据 id 查找微信退款申请是否存在
 */
export async function existByIdWxRefund(
  wx_refund_id?: WxRefundId | null,
): Promise<boolean> {
  
  const wx_refund_exist = await wx_refundDao.existByIdWxRefund(wx_refund_id);
  
  return wx_refund_exist;
}

/**
 * 增加和修改时校验微信退款申请
 */
export async function validateWxRefund(
  input: WxRefundInput,
): Promise<void> {
  await wx_refundDao.validateWxRefund(input);
}

/**
 * 批量创建微信退款申请
 */
export async function createsWxRefund(
  inputs: WxRefundInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxRefundId[]> {
  const wx_refund_ids = await wx_refundDao.createsWxRefund(inputs, options);
  
  return wx_refund_ids;
}

/**
 * 根据 id 修改微信退款申请
 */
export async function updateByIdWxRefund(
  wx_refund_id: WxRefundId,
  input: WxRefundInput,
): Promise<WxRefundId> {
  
  const wx_refund_id2 = await wx_refundDao.updateByIdWxRefund(wx_refund_id, input);
  
  return wx_refund_id2;
}

/** 校验微信退款申请是否存在 */
export async function validateOptionWxRefund(
  model0?: WxRefundModel,
): Promise<WxRefundModel> {
  const wx_refund_model = await wx_refundDao.validateOptionWxRefund(model0);
  return wx_refund_model;
}

/**
 * 根据 ids 删除微信退款申请
 */
export async function deleteByIdsWxRefund(
  wx_refund_ids: WxRefundId[],
): Promise<number> {
  
  const wx_refund_num = await wx_refundDao.deleteByIdsWxRefund(wx_refund_ids);
  return wx_refund_num;
}

/**
 * 获取微信退款申请字段注释
 */
export async function getFieldCommentsWxRefund(): Promise<WxRefundFieldComment> {
  const wx_refund_fields = await wx_refundDao.getFieldCommentsWxRefund();
  return wx_refund_fields;
}
