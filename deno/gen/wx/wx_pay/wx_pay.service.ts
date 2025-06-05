import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wx_payDao from "./wx_pay.dao.ts";

async function setSearchQuery(
  _search: WxPaySearch,
) {
  
}

/**
 * 根据条件查找微信支付设置总数
 */
export async function findCountWxPay(
  search?: WxPaySearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_num = await wx_payDao.findCountWxPay(search);
  
  return wx_pay_num;
}

/**
 * 根据搜索条件和分页查找微信支付设置列表
 */
export async function findAllWxPay(
  search?: WxPaySearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxPayModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_models = await wx_payDao.findAllWxPay(search, page, sort);
  
  return wx_pay_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxPay(
  input: WxPayInput,
): Promise<void> {
  await wx_payDao.setIdByLblWxPay(input);
}

/**
 * 根据条件查找第一个微信支付设置
 */
export async function findOneWxPay(
  search?: WxPaySearch,
  sort?: SortInput[],
): Promise<WxPayModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_model = await wx_payDao.findOneWxPay(search, sort);
  
  return wx_pay_model;
}

/**
 * 根据条件查找第一个微信支付设置, 如果不存在则抛错
 */
export async function findOneOkWxPay(
  search?: WxPaySearch,
  sort?: SortInput[],
): Promise<WxPayModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_model = await wx_payDao.findOneOkWxPay(search, sort);
  
  return wx_pay_model;
}

/**
 * 根据 id 查找微信支付设置
 */
export async function findByIdWxPay(
  wx_pay_id: WxPayId,
): Promise<WxPayModel | undefined> {
  
  const wx_pay_model = await wx_payDao.findByIdWxPay(wx_pay_id);
  
  return wx_pay_model;
}

/**
 * 根据 id 查找微信支付设置, 如果不存在则抛错
 */
export async function findByIdOkWxPay(
  wx_pay_id: WxPayId,
): Promise<WxPayModel> {
  
  const wx_pay_model = await wx_payDao.findByIdOkWxPay(wx_pay_id);
  
  return wx_pay_model;
}

/**
 * 根据 ids 查找微信支付设置
 */
export async function findByIdsWxPay(
  wx_pay_ids: WxPayId[],
): Promise<WxPayModel[]> {
  
  const wx_pay_models = await wx_payDao.findByIdsWxPay(wx_pay_ids);
  
  return wx_pay_models;
}

/**
 * 根据 ids 查找微信支付设置, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxPay(
  wx_pay_ids: WxPayId[],
): Promise<WxPayModel[]> {
  
  const wx_pay_models = await wx_payDao.findByIdsOkWxPay(wx_pay_ids);
  
  return wx_pay_models;
}

/**
 * 根据搜索条件查找微信支付设置是否存在
 */
export async function existWxPay(
  search?: WxPaySearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_exist = await wx_payDao.existWxPay(search);
  
  return wx_pay_exist;
}

/**
 * 根据 id 查找微信支付设置是否存在
 */
export async function existByIdWxPay(
  wx_pay_id?: WxPayId | null,
): Promise<boolean> {
  
  const wx_pay_exist = await wx_payDao.existByIdWxPay(wx_pay_id);
  
  return wx_pay_exist;
}

/**
 * 增加和修改时校验微信支付设置
 */
export async function validateWxPay(
  input: WxPayInput,
): Promise<void> {
  await wx_payDao.validateWxPay(input);
}

/**
 * 批量创建微信支付设置
 */
export async function createsWxPay(
  inputs: WxPayInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxPayId[]> {
  const wx_pay_ids = await wx_payDao.createsWxPay(inputs, options);
  
  return wx_pay_ids;
}

/**
 * 根据 id 修改微信支付设置
 */
export async function updateByIdWxPay(
  wx_pay_id: WxPayId,
  input: WxPayInput,
): Promise<WxPayId> {
  
  const is_locked = await wx_payDao.getIsLockedByIdWxPay(wx_pay_id);
  if (is_locked) {
    throw "不能修改已经锁定的 微信支付设置";
  }
  
  const wx_pay_id2 = await wx_payDao.updateByIdWxPay(wx_pay_id, input);
  
  return wx_pay_id2;
}

/** 校验微信支付设置是否存在 */
export async function validateOptionWxPay(
  model0?: WxPayModel,
): Promise<WxPayModel> {
  const wx_pay_model = await wx_payDao.validateOptionWxPay(model0);
  return wx_pay_model;
}

/**
 * 根据 ids 删除微信支付设置
 */
export async function deleteByIdsWxPay(
  wx_pay_ids: WxPayId[],
): Promise<number> {
  
  const old_models = await wx_payDao.findByIdsWxPay(wx_pay_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 微信支付设置";
    }
  }
  
  const wx_pay_num = await wx_payDao.deleteByIdsWxPay(wx_pay_ids);
  return wx_pay_num;
}

/**
 * 根据 ids 启用或者禁用微信支付设置
 */
export async function enableByIdsWxPay(
  ids: WxPayId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const wx_pay_num = await wx_payDao.enableByIdsWxPay(ids, is_enabled);
  return wx_pay_num;
}

/**
 * 根据 ids 锁定或者解锁微信支付设置
 */
export async function lockByIdsWxPay(
  wx_pay_ids: WxPayId[],
  is_locked: 0 | 1,
): Promise<number> {
  const wx_pay_num = await wx_payDao.lockByIdsWxPay(wx_pay_ids, is_locked);
  return wx_pay_num;
}

/**
 * 根据 ids 还原微信支付设置
 */
export async function revertByIdsWxPay(
  wx_pay_ids: WxPayId[],
): Promise<number> {
  
  const wx_pay_num = await wx_payDao.revertByIdsWxPay(wx_pay_ids);
  
  return wx_pay_num;
}

/**
 * 根据 ids 彻底删除微信支付设置
 */
export async function forceDeleteByIdsWxPay(
  wx_pay_ids: WxPayId[],
): Promise<number> {
  
  const wx_pay_num = await wx_payDao.forceDeleteByIdsWxPay(wx_pay_ids);
  
  return wx_pay_num;
}

/**
 * 获取微信支付设置字段注释
 */
export async function getFieldCommentsWxPay(): Promise<WxPayFieldComment> {
  const wx_pay_fields = await wx_payDao.getFieldCommentsWxPay();
  return wx_pay_fields;
}

/**
 * 查找 微信支付设置 order_by 字段的最大值
 */
export async function findLastOrderByWxPay(
): Promise<number> {
  const wx_pay_sort = await wx_payDao.findLastOrderByWxPay();
  return wx_pay_sort;
}
