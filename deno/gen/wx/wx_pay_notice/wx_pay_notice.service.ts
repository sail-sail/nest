import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  get_usr_id,
  get_org_id,
} from "/lib/auth/auth.dao.ts";

import {
  findById as findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import * as wx_pay_noticeDao from "./wx_pay_notice.dao.ts";

async function setSearchQuery(
  search: WxPayNoticeSearch,
) {
  
  const usr_id = await get_usr_id();
  const org_id = await get_org_id();
  const usr_model = await findByIdUsr(usr_id);
  if (!usr_id || !usr_model) {
    throw new Error("usr_id can not be null");
  }
  const org_ids: OrgId[] = [ ];
  if (org_id) {
    org_ids.push(org_id);
  } else {
    org_ids.push(...usr_model.org_ids);
    org_ids.push("" as OrgId);
  }
  const username = usr_model.username;
  
  if (username !== "admin") {
    search.org_id = org_ids;
  }
  
}

/**
 * 根据条件查找微信支付通知总数
 */
export async function findCount(
  search?: WxPayNoticeSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wx_pay_noticeDao.findCount(search);
  return data;
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
  
  const models: WxPayNoticeModel[] = await wx_pay_noticeDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxPayNoticeInput,
) {
  const data = await wx_pay_noticeDao.setIdByLbl(input);
  return data;
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
  
  const model = await wx_pay_noticeDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找微信支付通知
 */
export async function findById(
  id?: WxPayNoticeId | null,
): Promise<WxPayNoticeModel | undefined> {
  const model = await wx_pay_noticeDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找微信支付通知是否存在
 */
export async function exist(
  search?: WxPayNoticeSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wx_pay_noticeDao.exist(search);
  return data;
}

/**
 * 根据 id 查找微信支付通知是否存在
 */
export async function existById(
  id?: WxPayNoticeId | null,
): Promise<boolean> {
  const data = await wx_pay_noticeDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验微信支付通知
 */
export async function validate(
  input: WxPayNoticeInput,
): Promise<void> {
  const data = await wx_pay_noticeDao.validate(input);
  return data;
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
  const ids = await wx_pay_noticeDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改微信支付通知
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
 */
export async function deleteByIds(
  ids: WxPayNoticeId[],
): Promise<number> {
  
  const data = await wx_pay_noticeDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原微信支付通知
 */
export async function revertByIds(
  ids: WxPayNoticeId[],
): Promise<number> {
  const data = await wx_pay_noticeDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除微信支付通知
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
