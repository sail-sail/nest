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
  
  const data = await wx_payDao.findCount(search);
  return data;
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
  
  const models: WxPayModel[] = await wx_payDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxPayInput,
) {
  const data = await wx_payDao.setIdByLbl(input);
  return data;
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
  
  const model = await wx_payDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找微信支付设置
 */
export async function findById(
  id?: WxPayId | null,
): Promise<WxPayModel | undefined> {
  const model = await wx_payDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找微信支付设置是否存在
 */
export async function exist(
  search?: WxPaySearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wx_payDao.exist(search);
  return data;
}

/**
 * 根据 id 查找微信支付设置是否存在
 */
export async function existById(
  id?: WxPayId | null,
): Promise<boolean> {
  const data = await wx_payDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验微信支付设置
 */
export async function validate(
  input: WxPayInput,
): Promise<void> {
  const data = await wx_payDao.validate(input);
  return data;
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
  const ids = await wx_payDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改微信支付设置
 */
export async function updateById(
  id: WxPayId,
  input: WxPayInput,
): Promise<WxPayId> {
  
  const is_locked = await wx_payDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 微信支付设置";
  }
  
  const id2 = await wx_payDao.updateById(id, input);
  return id2;
}

/** 校验微信支付设置是否存在 */
export async function validateOption(
  model0?: WxPayModel,
): Promise<WxPayModel> {
  const model = await wx_payDao.validateOption(model0);
  return model;
}

/**
 * 根据 ids 删除微信支付设置
 */
export async function deleteByIds(
  ids: WxPayId[],
): Promise<number> {
  
  {
    const models = await wx_payDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 微信支付设置";
      }
    }
  }
  
  const data = await wx_payDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用微信支付设置
 */
export async function enableByIds(
  ids: WxPayId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await wx_payDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁微信支付设置
 */
export async function lockByIds(
  ids: WxPayId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await wx_payDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原微信支付设置
 */
export async function revertByIds(
  ids: WxPayId[],
): Promise<number> {
  const data = await wx_payDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除微信支付设置
 */
export async function forceDeleteByIds(
  ids: WxPayId[],
): Promise<number> {
  const data = await wx_payDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取微信支付设置字段注释
 */
export async function getFieldComments(): Promise<WxPayFieldComment> {
  const data = await wx_payDao.getFieldComments();
  return data;
}

/**
 * 查找 微信支付设置 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await wx_payDao.findLastOrderBy();
  return data;
}
