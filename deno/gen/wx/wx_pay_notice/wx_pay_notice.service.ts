import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wx_pay_noticeDao from "./wx_pay_notice.dao.ts";

async function setSearchQuery(
  _search: WxPayNoticeSearch,
) {
  
}

/**
 * 根据条件查找微信支付通知总数
 */
export async function findCountWxPayNotice(
  search?: WxPayNoticeSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_notice_num = await wx_pay_noticeDao.findCountWxPayNotice(search);
  
  return wx_pay_notice_num;
}

/**
 * 根据搜索条件和分页查找微信支付通知列表
 */
export async function findAllWxPayNotice(
  search?: WxPayNoticeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxPayNoticeModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_notice_models = await wx_pay_noticeDao.findAllWxPayNotice(search, page, sort);
  
  return wx_pay_notice_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxPayNotice(
  input: WxPayNoticeInput,
): Promise<void> {
  await wx_pay_noticeDao.setIdByLblWxPayNotice(input);
}

/**
 * 根据条件查找第一个微信支付通知
 */
export async function findOneWxPayNotice(
  search?: WxPayNoticeSearch,
  sort?: SortInput[],
): Promise<WxPayNoticeModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_notice_model = await wx_pay_noticeDao.findOneWxPayNotice(search, sort);
  
  return wx_pay_notice_model;
}

/**
 * 根据 id 查找微信支付通知
 */
export async function findByIdWxPayNotice(
  wx_pay_notice_id?: WxPayNoticeId | null,
): Promise<WxPayNoticeModel | undefined> {
  
  const wx_pay_notice_model = await wx_pay_noticeDao.findByIdWxPayNotice(wx_pay_notice_id);
  
  return wx_pay_notice_model;
}

/**
 * 根据 ids 查找微信支付通知
 */
export async function findByIdsWxPayNotice(
  wx_pay_notice_ids: WxPayNoticeId[],
): Promise<WxPayNoticeModel[]> {
  
  const wx_pay_notice_models = await wx_pay_noticeDao.findByIdsWxPayNotice(wx_pay_notice_ids);
  
  return wx_pay_notice_models;
}

/**
 * 根据搜索条件查找微信支付通知是否存在
 */
export async function existWxPayNotice(
  search?: WxPayNoticeSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_notice_exist = await wx_pay_noticeDao.existWxPayNotice(search);
  
  return wx_pay_notice_exist;
}

/**
 * 根据 id 查找微信支付通知是否存在
 */
export async function existByIdWxPayNotice(
  wx_pay_notice_id?: WxPayNoticeId | null,
): Promise<boolean> {
  
  const wx_pay_notice_exist = await wx_pay_noticeDao.existByIdWxPayNotice(wx_pay_notice_id);
  
  return wx_pay_notice_exist;
}

/**
 * 增加和修改时校验微信支付通知
 */
export async function validateWxPayNotice(
  input: WxPayNoticeInput,
): Promise<void> {
  await wx_pay_noticeDao.validateWxPayNotice(input);
}

/**
 * 批量创建微信支付通知
 */
export async function createsWxPayNotice(
  inputs: WxPayNoticeInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxPayNoticeId[]> {
  const wx_pay_notice_ids = await wx_pay_noticeDao.createsWxPayNotice(inputs, options);
  
  return wx_pay_notice_ids;
}

/**
 * 根据 id 修改微信支付通知
 */
export async function updateByIdWxPayNotice(
  wx_pay_notice_id: WxPayNoticeId,
  input: WxPayNoticeInput,
): Promise<WxPayNoticeId> {
  
  const wx_pay_notice_id2 = await wx_pay_noticeDao.updateByIdWxPayNotice(wx_pay_notice_id, input);
  
  return wx_pay_notice_id2;
}

/** 校验微信支付通知是否存在 */
export async function validateOptionWxPayNotice(
  model0?: WxPayNoticeModel,
): Promise<WxPayNoticeModel> {
  const wx_pay_notice_model = await wx_pay_noticeDao.validateOptionWxPayNotice(model0);
  return wx_pay_notice_model;
}

/**
 * 根据 ids 删除微信支付通知
 */
export async function deleteByIdsWxPayNotice(
  wx_pay_notice_ids: WxPayNoticeId[],
): Promise<number> {
  
  const wx_pay_notice_num = await wx_pay_noticeDao.deleteByIdsWxPayNotice(wx_pay_notice_ids);
  return wx_pay_notice_num;
}

/**
 * 根据 ids 还原微信支付通知
 */
export async function revertByIdsWxPayNotice(
  wx_pay_notice_ids: WxPayNoticeId[],
): Promise<number> {
  
  const wx_pay_notice_num = await wx_pay_noticeDao.revertByIdsWxPayNotice(wx_pay_notice_ids);
  
  return wx_pay_notice_num;
}

/**
 * 根据 ids 彻底删除微信支付通知
 */
export async function forceDeleteByIdsWxPayNotice(
  wx_pay_notice_ids: WxPayNoticeId[],
): Promise<number> {
  
  const wx_pay_notice_num = await wx_pay_noticeDao.forceDeleteByIdsWxPayNotice(wx_pay_notice_ids);
  
  return wx_pay_notice_num;
}

/**
 * 获取微信支付通知字段注释
 */
export async function getFieldCommentsWxPayNotice(): Promise<WxPayNoticeFieldComment> {
  const wx_pay_notice_fields = await wx_pay_noticeDao.getFieldCommentsWxPayNotice();
  return wx_pay_notice_fields;
}
