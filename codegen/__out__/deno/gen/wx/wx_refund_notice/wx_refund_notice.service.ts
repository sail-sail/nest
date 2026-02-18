import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wx_refund_noticeDao from "./wx_refund_notice.dao.ts";

async function setSearchQuery(
  _search: WxRefundNoticeSearch,
) {
  
}

/**
 * 根据条件查找微信退款通知总数
 */
export async function findCountWxRefundNotice(
  search?: WxRefundNoticeSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_refund_notice_num = await wx_refund_noticeDao.findCountWxRefundNotice(search);
  
  return wx_refund_notice_num;
}

/**
 * 根据搜索条件和分页查找微信退款通知列表
 */
export async function findAllWxRefundNotice(
  search?: WxRefundNoticeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxRefundNoticeModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_refund_notice_models = await wx_refund_noticeDao.findAllWxRefundNotice(search, page, sort);
  
  return wx_refund_notice_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxRefundNotice(
  input: WxRefundNoticeInput,
): Promise<void> {
  await wx_refund_noticeDao.setIdByLblWxRefundNotice(input);
}

/**
 * 根据条件查找第一个微信退款通知
 */
export async function findOneWxRefundNotice(
  search?: WxRefundNoticeSearch,
  sort?: SortInput[],
): Promise<WxRefundNoticeModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_refund_notice_model = await wx_refund_noticeDao.findOneWxRefundNotice(search, sort);
  
  return wx_refund_notice_model;
}

/**
 * 根据条件查找第一个微信退款通知, 如果不存在则抛错
 */
export async function findOneOkWxRefundNotice(
  search?: WxRefundNoticeSearch,
  sort?: SortInput[],
): Promise<WxRefundNoticeModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_refund_notice_model = await wx_refund_noticeDao.findOneOkWxRefundNotice(search, sort);
  
  return wx_refund_notice_model;
}

/**
 * 根据 id 查找微信退款通知
 */
export async function findByIdWxRefundNotice(
  wx_refund_notice_id: WxRefundNoticeId,
): Promise<WxRefundNoticeModel | undefined> {
  
  const wx_refund_notice_model = await wx_refund_noticeDao.findByIdWxRefundNotice(wx_refund_notice_id);
  
  return wx_refund_notice_model;
}

/**
 * 根据 id 查找微信退款通知, 如果不存在则抛错
 */
export async function findByIdOkWxRefundNotice(
  wx_refund_notice_id: WxRefundNoticeId,
): Promise<WxRefundNoticeModel> {
  
  const wx_refund_notice_model = await wx_refund_noticeDao.findByIdOkWxRefundNotice(wx_refund_notice_id);
  
  return wx_refund_notice_model;
}

/**
 * 根据 ids 查找微信退款通知
 */
export async function findByIdsWxRefundNotice(
  wx_refund_notice_ids: WxRefundNoticeId[],
): Promise<WxRefundNoticeModel[]> {
  
  const wx_refund_notice_models = await wx_refund_noticeDao.findByIdsWxRefundNotice(wx_refund_notice_ids);
  
  return wx_refund_notice_models;
}

/**
 * 根据 ids 查找微信退款通知, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxRefundNotice(
  wx_refund_notice_ids: WxRefundNoticeId[],
): Promise<WxRefundNoticeModel[]> {
  
  const wx_refund_notice_models = await wx_refund_noticeDao.findByIdsOkWxRefundNotice(wx_refund_notice_ids);
  
  return wx_refund_notice_models;
}

/**
 * 根据搜索条件查找微信退款通知是否存在
 */
export async function existWxRefundNotice(
  search?: WxRefundNoticeSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_refund_notice_exist = await wx_refund_noticeDao.existWxRefundNotice(search);
  
  return wx_refund_notice_exist;
}

/**
 * 根据 id 查找微信退款通知是否存在
 */
export async function existByIdWxRefundNotice(
  wx_refund_notice_id?: WxRefundNoticeId | null,
): Promise<boolean> {
  
  const wx_refund_notice_exist = await wx_refund_noticeDao.existByIdWxRefundNotice(wx_refund_notice_id);
  
  return wx_refund_notice_exist;
}

/**
 * 增加和修改时校验微信退款通知
 */
export async function validateWxRefundNotice(
  input: WxRefundNoticeInput,
): Promise<void> {
  await wx_refund_noticeDao.validateWxRefundNotice(input);
}

/**
 * 批量创建微信退款通知
 */
export async function createsWxRefundNotice(
  inputs: WxRefundNoticeInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxRefundNoticeId[]> {
  const wx_refund_notice_ids = await wx_refund_noticeDao.createsWxRefundNotice(inputs, options);
  
  return wx_refund_notice_ids;
}

/**
 * 根据 id 修改微信退款通知
 */
export async function updateByIdWxRefundNotice(
  wx_refund_notice_id: WxRefundNoticeId,
  input: WxRefundNoticeInput,
): Promise<WxRefundNoticeId> {
  
  const wx_refund_notice_id2 = await wx_refund_noticeDao.updateByIdWxRefundNotice(wx_refund_notice_id, input);
  
  return wx_refund_notice_id2;
}

/** 校验微信退款通知是否存在 */
export async function validateOptionWxRefundNotice(
  model0?: WxRefundNoticeModel,
): Promise<WxRefundNoticeModel> {
  const wx_refund_notice_model = await wx_refund_noticeDao.validateOptionWxRefundNotice(model0);
  return wx_refund_notice_model;
}

/**
 * 根据 ids 删除微信退款通知
 */
export async function deleteByIdsWxRefundNotice(
  wx_refund_notice_ids: WxRefundNoticeId[],
): Promise<number> {
  
  const wx_refund_notice_num = await wx_refund_noticeDao.deleteByIdsWxRefundNotice(wx_refund_notice_ids);
  return wx_refund_notice_num;
}

/**
 * 获取微信退款通知字段注释
 */
export async function getFieldCommentsWxRefundNotice(): Promise<WxRefundNoticeFieldComment> {
  const wx_refund_notice_fields = await wx_refund_noticeDao.getFieldCommentsWxRefundNotice();
  return wx_refund_notice_fields;
}
