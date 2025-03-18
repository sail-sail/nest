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
export async function findCount(
  search?: WxPaySearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_num = await wx_payDao.findCount(search);
  
  return wx_pay_num;
}

/**
 * 根据搜索条件和分页查找微信支付设置列表
 */
export async function findAll(
  search?: WxPaySearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxPayModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_models = await wx_payDao.findAll(search, page, sort);
  
  return wx_pay_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxPayInput,
): Promise<void> {
  await wx_payDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个微信支付设置
 */
export async function findOne(
  search?: WxPaySearch,
  sort?: SortInput[],
): Promise<WxPayModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_model = await wx_payDao.findOne(search, sort);
  
  return wx_pay_model;
}

/**
 * 根据 id 查找微信支付设置
 */
export async function findById(
  wx_pay_id?: WxPayId | null,
): Promise<WxPayModel | undefined> {
  
  const wx_pay_model = await wx_payDao.findById(wx_pay_id);
  
  return wx_pay_model;
}

/**
 * 根据 ids 查找微信支付设置
 */
export async function findByIds(
  wx_pay_ids: WxPayId[],
): Promise<WxPayModel[]> {
  
  const wx_pay_models = await wx_payDao.findByIds(wx_pay_ids);
  
  return wx_pay_models;
}

/**
 * 根据搜索条件查找微信支付设置是否存在
 */
export async function exist(
  search?: WxPaySearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_pay_exist = await wx_payDao.exist(search);
  
  return wx_pay_exist;
}

/**
 * 根据 id 查找微信支付设置是否存在
 */
export async function existById(
  wx_pay_id?: WxPayId | null,
): Promise<boolean> {
  
  const wx_pay_exist = await wx_payDao.existById(wx_pay_id);
  
  return wx_pay_exist;
}

/**
 * 增加和修改时校验微信支付设置
 */
export async function validate(
  input: WxPayInput,
): Promise<void> {
  await wx_payDao.validate(input);
}

/**
 * 批量创建微信支付设置
 */
export async function creates(
  inputs: WxPayInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxPayId[]> {
  const wx_pay_ids = await wx_payDao.creates(inputs, options);
  
  return wx_pay_ids;
}

/**
 * 根据 id 修改微信支付设置
 */
export async function updateById(
  wx_pay_id: WxPayId,
  input: WxPayInput,
): Promise<WxPayId> {
  
  const is_locked = await wx_payDao.getIsLockedById(wx_pay_id);
  if (is_locked) {
    throw "不能修改已经锁定的 微信支付设置";
  }
  
  const wx_pay_id2 = await wx_payDao.updateById(wx_pay_id, input);
  
  return wx_pay_id2;
}

/** 校验微信支付设置是否存在 */
export async function validateOption(
  model0?: WxPayModel,
): Promise<WxPayModel> {
  const wx_pay_model = await wx_payDao.validateOption(model0);
  return wx_pay_model;
}

/**
 * 根据 ids 删除微信支付设置
 */
export async function deleteByIds(
  wx_pay_ids: WxPayId[],
): Promise<number> {
  
  const old_models = await wx_payDao.findByIds(wx_pay_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 微信支付设置";
    }
  }
  
  const wx_pay_num = await wx_payDao.deleteByIds(wx_pay_ids);
  return wx_pay_num;
}

/**
 * 根据 ids 启用或者禁用微信支付设置
 */
export async function enableByIds(
  ids: WxPayId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const wx_pay_num = await wx_payDao.enableByIds(ids, is_enabled);
  return wx_pay_num;
}

/**
 * 根据 ids 锁定或者解锁微信支付设置
 */
export async function lockByIds(
  wx_pay_ids: WxPayId[],
  is_locked: 0 | 1,
): Promise<number> {
  const wx_pay_num = await wx_payDao.lockByIds(wx_pay_ids, is_locked);
  return wx_pay_num;
}

/**
 * 根据 ids 还原微信支付设置
 */
export async function revertByIds(
  wx_pay_ids: WxPayId[],
): Promise<number> {
  
  const wx_pay_num = await wx_payDao.revertByIds(wx_pay_ids);
  
  return wx_pay_num;
}

/**
 * 根据 ids 彻底删除微信支付设置
 */
export async function forceDeleteByIds(
  wx_pay_ids: WxPayId[],
): Promise<number> {
  
  const wx_pay_num = await wx_payDao.forceDeleteByIds(wx_pay_ids);
  
  return wx_pay_num;
}

/**
 * 获取微信支付设置字段注释
 */
export async function getFieldComments(): Promise<WxPayFieldComment> {
  const wx_pay_fields = await wx_payDao.getFieldComments();
  return wx_pay_fields;
}

/**
 * 查找 微信支付设置 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const wx_pay_sort = await wx_payDao.findLastOrderBy();
  return wx_pay_sort;
}
