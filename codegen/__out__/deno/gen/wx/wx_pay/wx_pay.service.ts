import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import type {
  WxPayInput,
  WxPayModel,
  WxPaySearch,
  WxPayFieldComment,
  WxPayId,
} from "./wx_pay.model.ts";

import * as wx_payDao from "./wx_pay.dao.ts";

/**
 * 根据条件查找微信支付设置总数
 * @param {WxPaySearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxPaySearch,
): Promise<number> {
  search = search || { };
  const data = await wx_payDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找微信支付设置列表
 * @param {WxPaySearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<WxPayModel[]>} 
 */
export async function findAll(
  search?: WxPaySearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<WxPayModel[]> {
  search = search || { };
  const models: WxPayModel[] = await wx_payDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxPayInput,
) {
  const data = await wx_payDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个微信支付设置
 * @param {WxPaySearch} search? 搜索条件
 */
export async function findOne(
  search?: WxPaySearch,
  sort?: SortInput|SortInput[],
): Promise<WxPayModel | undefined> {
  search = search || { };
  const model = await wx_payDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找微信支付设置
 * @param {WxPayId} id
 */
export async function findById(
  id?: WxPayId | null,
): Promise<WxPayModel | undefined> {
  const model = await wx_payDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找微信支付设置是否存在
 * @param {WxPaySearch} search? 搜索条件
 */
export async function exist(
  search?: WxPaySearch,
): Promise<boolean> {
  search = search || { };
  const data = await wx_payDao.exist(search);
  return data;
}

/**
 * 根据 id 查找微信支付设置是否存在
 * @param {WxPayId} id
 */
export async function existById(
  id?: WxPayId | null,
): Promise<boolean> {
  const data = await wx_payDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验微信支付设置
 * @param input 
 */
export async function validate(
  input: WxPayInput,
): Promise<void> {
  const data = await wx_payDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {WxPayInput} input
 * @return {Promise<WxPayId>} id
 */
export async function create(
  input: WxPayInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxPayId> {
  const id: WxPayId = await wx_payDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改微信支付设置
 * @param {WxPayId} id
 * @param {WxPayInput} input
 * @return {Promise<WxPayId>}
 */
export async function updateById(
  id: WxPayId,
  input: WxPayInput,
): Promise<WxPayId> {
  
  const is_locked = await wx_payDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2: WxPayId = await wx_payDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除微信支付设置
 * @param {WxPayId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxPayId[],
): Promise<number> {
  
  {
    const ids2: WxPayId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: WxPayId = ids[i];
      const is_locked = await wx_payDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  const data = await wx_payDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用微信支付设置
 * @param {WxPayId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
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
 * @param {WxPayId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
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
 * @param {WxPayId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxPayId[],
): Promise<number> {
  const data = await wx_payDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除微信支付设置
 * @param {WxPayId[]} ids
 * @return {Promise<number>}
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
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await wx_payDao.findLastOrderBy();
  return data;
}
