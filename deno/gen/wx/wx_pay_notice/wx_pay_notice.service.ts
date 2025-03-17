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
export async function findCount(
  search?: WxPayNoticeSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_notice_num = await wx_pay_noticeDao.findCount(search);
  
  return wx_pay_notice_num;
}

/**
 * 根据搜索条件和分页查找微信支付通知列表
 */
export async function findAll(
  search?: WxPayNoticeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxPayNoticeModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_notice_models = await wx_pay_noticeDao.findAll(search, page, sort);
  
  return wx_pay_notice_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxPayNoticeInput,
): Promise<void> {
  await wx_pay_noticeDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个微信支付通知
 */
export async function findOne(
  search?: WxPayNoticeSearch,
  sort?: SortInput[],
): Promise<WxPayNoticeModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_notice_model = await wx_pay_noticeDao.findOne(search, sort);
  
  return wx_pay_notice_model;
}

/**
 * 根据 id 查找微信支付通知
 */
export async function findById(
  wx_pay_notice_id?: WxPayNoticeId | null,
): Promise<WxPayNoticeModel | undefined> {
  
  const wx_pay_notice_model = await wx_pay_noticeDao.findById(wx_pay_notice_id);
  
  return wx_pay_notice_model;
}

/**
 * 根据 ids 查找微信支付通知
 */
export async function findByIds(
  wx_pay_notice_ids: WxPayNoticeId[],
): Promise<WxPayNoticeModel[]> {
  
  const wx_pay_notice_models = await wx_pay_noticeDao.findByIds(wx_pay_notice_ids);
  
  return wx_pay_notice_models;
}

/**
 * 根据搜索条件查找微信支付通知是否存在
 */
export async function exist(
  search?: WxPayNoticeSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_notice_exist = await wx_pay_noticeDao.exist(search);
  
  return wx_pay_notice_exist;
}

/**
 * 根据 id 查找微信支付通知是否存在
 */
export async function existById(
  wx_pay_notice_id?: WxPayNoticeId | null,
): Promise<boolean> {
  
  const wx_pay_notice_exist = await wx_pay_noticeDao.existById(wx_pay_notice_id);
  
  return wx_pay_notice_exist;
}

/**
 * 增加和修改时校验微信支付通知
 */
export async function validate(
  input: WxPayNoticeInput,
): Promise<void> {
  await wx_pay_noticeDao.validate(input);
}

/**
 * 批量创建微信支付通知
 */
export async function creates(
  inputs: WxPayNoticeInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxPayNoticeId[]> {
  const wx_pay_notice_ids = await wx_pay_noticeDao.creates(inputs, options);
  
  return wx_pay_notice_ids;
}

/**
 * 根据 id 修改微信支付通知
 */
export async function updateById(
  wx_pay_notice_id: WxPayNoticeId,
  input: WxPayNoticeInput,
): Promise<WxPayNoticeId> {
  
  const wx_pay_notice_id2 = await wx_pay_noticeDao.updateById(wx_pay_notice_id, input);
  
  return wx_pay_notice_id2;
}

/** 校验微信支付通知是否存在 */
export async function validateOption(
  model0?: WxPayNoticeModel,
): Promise<WxPayNoticeModel> {
  const wx_pay_notice_model = await wx_pay_noticeDao.validateOption(model0);
  return wx_pay_notice_model;
}

/**
 * 根据 ids 删除微信支付通知
 */
export async function deleteByIds(
  wx_pay_notice_ids: WxPayNoticeId[],
): Promise<number> {
  
  const wx_pay_notice_num = await wx_pay_noticeDao.deleteByIds(wx_pay_notice_ids);
  return wx_pay_notice_num;
}

/**
 * 根据 ids 还原微信支付通知
 */
export async function revertByIds(
  wx_pay_notice_ids: WxPayNoticeId[],
): Promise<number> {
  
  const wx_pay_notice_num = await wx_pay_noticeDao.revertByIds(wx_pay_notice_ids);
  
  return wx_pay_notice_num;
}

/**
 * 根据 ids 彻底删除微信支付通知
 */
export async function forceDeleteByIds(
  wx_pay_notice_ids: WxPayNoticeId[],
): Promise<number> {
  
  const wx_pay_notice_num = await wx_pay_noticeDao.forceDeleteByIds(wx_pay_notice_ids);
  
  return wx_pay_notice_num;
}

/**
 * 获取微信支付通知字段注释
 */
export async function getFieldComments(): Promise<WxPayNoticeFieldComment> {
  const wx_pay_notice_fields = await wx_pay_noticeDao.getFieldComments();
  return wx_pay_notice_fields;
}
