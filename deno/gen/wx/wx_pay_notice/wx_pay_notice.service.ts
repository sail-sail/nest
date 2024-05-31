import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import * as wx_pay_noticeDao from "./wx_pay_notice.dao.ts";

/**
 * 根据条件查找微信支付通知总数
 * @param {WxPayNoticeSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxPayNoticeSearch,
): Promise<number> {
  search = search || { };
  
  const authModel = await getAuthModel();
  const org_id = authModel?.org_id;
  
  if (org_id) {
    search.org_id = [ org_id ];
  }
  const data = await wx_pay_noticeDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找微信支付通知列表
 * @param {WxPayNoticeSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<WxPayNoticeModel[]>} 
 */
export async function findAll(
  search?: WxPayNoticeSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<WxPayNoticeModel[]> {
  search = search || { };
  
  const authModel = await getAuthModel();
  const org_id = authModel?.org_id;
  
  if (org_id) {
    search.org_id = [ org_id ];
  }
  const models: WxPayNoticeModel[] = await wx_pay_noticeDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxPayNoticeInput,
) {
  const data = await wx_pay_noticeDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个微信支付通知
 * @param {WxPayNoticeSearch} search? 搜索条件
 */
export async function findOne(
  search?: WxPayNoticeSearch,
  sort?: SortInput|SortInput[],
): Promise<WxPayNoticeModel | undefined> {
  search = search || { };
  
  const authModel = await getAuthModel();
  const org_id = authModel?.org_id;
  
  if (org_id) {
    search.org_id = [ org_id ];
  }
  const model = await wx_pay_noticeDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找微信支付通知
 * @param {WxPayNoticeId} id
 */
export async function findById(
  id?: WxPayNoticeId | null,
): Promise<WxPayNoticeModel | undefined> {
  const model = await wx_pay_noticeDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找微信支付通知是否存在
 * @param {WxPayNoticeSearch} search? 搜索条件
 */
export async function exist(
  search?: WxPayNoticeSearch,
): Promise<boolean> {
  search = search || { };
  
  const authModel = await getAuthModel();
  const org_id = authModel?.org_id;
  
  if (org_id) {
    search.org_id = [ org_id ];
  }
  const data = await wx_pay_noticeDao.exist(search);
  return data;
}

/**
 * 根据 id 查找微信支付通知是否存在
 * @param {WxPayNoticeId} id
 */
export async function existById(
  id?: WxPayNoticeId | null,
): Promise<boolean> {
  const data = await wx_pay_noticeDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验微信支付通知
 * @param input 
 */
export async function validate(
  input: WxPayNoticeInput,
): Promise<void> {
  const data = await wx_pay_noticeDao.validate(input);
  return data;
}

/**
 * 创建微信支付通知
 * @param {WxPayNoticeInput} input
 * @return {Promise<WxPayNoticeId>} id
 */
export async function create(
  input: WxPayNoticeInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxPayNoticeId> {
  const id = await wx_pay_noticeDao.create(input, options);
  return id;
}

/**
 * 批量创建微信支付通知
 * @param {WxPayNoticeInput[]} inputs
 * @return {Promise<WxPayNoticeId[]>} ids
 */
export async function creates(
  inputs: WxPayNoticeInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxPayNoticeId[]> {
  const ids = await wx_pay_noticeDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改微信支付通知
 * @param {WxPayNoticeId} id
 * @param {WxPayNoticeInput} input
 * @return {Promise<WxPayNoticeId>}
 */
export async function updateById(
  id: WxPayNoticeId,
  input: WxPayNoticeInput,
): Promise<WxPayNoticeId> {
  
  const id2 = await wx_pay_noticeDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除微信支付通知
 * @param {WxPayNoticeId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxPayNoticeId[],
): Promise<number> {
  
  const data = await wx_pay_noticeDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原微信支付通知
 * @param {WxPayNoticeId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxPayNoticeId[],
): Promise<number> {
  const data = await wx_pay_noticeDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除微信支付通知
 * @param {WxPayNoticeId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxPayNoticeId[],
): Promise<number> {
  const data = await wx_pay_noticeDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取微信支付通知字段注释
 */
export async function getFieldComments(): Promise<WxPayNoticeFieldComment> {
  const data = await wx_pay_noticeDao.getFieldComments();
  return data;
}
