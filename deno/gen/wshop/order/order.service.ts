import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import {
  get_usr_id,
  get_org_id,
} from "/lib/auth/auth.dao.ts";

import {
  findById as findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import * as orderDao from "./order.dao.ts";

async function setSearchQuery(
  search: OrderSearch,
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
 * 根据条件查找订单总数
 * @param {OrderSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: OrderSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await orderDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找订单列表
 * @param {OrderSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<OrderModel[]>} 
 */
export async function findAll(
  search?: OrderSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<OrderModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: OrderModel[] = await orderDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: OrderInput,
) {
  const data = await orderDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个订单
 * @param {OrderSearch} search? 搜索条件
 */
export async function findOne(
  search?: OrderSearch,
  sort?: SortInput|SortInput[],
): Promise<OrderModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await orderDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找订单
 * @param {OrderId} id
 */
export async function findById(
  id?: OrderId | null,
): Promise<OrderModel | undefined> {
  const model = await orderDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找订单是否存在
 * @param {OrderSearch} search? 搜索条件
 */
export async function exist(
  search?: OrderSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await orderDao.exist(search);
  return data;
}

/**
 * 根据 id 查找订单是否存在
 * @param {OrderId} id
 */
export async function existById(
  id?: OrderId | null,
): Promise<boolean> {
  const data = await orderDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验订单
 * @param input 
 */
export async function validate(
  input: OrderInput,
): Promise<void> {
  const data = await orderDao.validate(input);
  return data;
}

/**
 * 批量创建订单
 * @param {OrderInput[]} inputs
 * @return {Promise<OrderId[]>} ids
 */
export async function creates(
  inputs: OrderInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<OrderId[]> {
  
  const {
    getLblSeq,
  } = await import("/src/wshop/order/order.dao.ts");
  
  // 自动生成订单编号
  for (const input of inputs) {
    const model = await getLblSeq();
    input.lbl = model.lbl;
    input.lbl_seq = model.lbl_seq;
    input.lbl_date_seq = model.lbl_date_seq;
  }
  
  const ids = await orderDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改订单
 * @param {OrderId} id
 * @param {OrderInput} input
 * @return {Promise<OrderId>}
 */
export async function updateById(
  id: OrderId,
  input: OrderInput,
): Promise<OrderId> {
  
  const is_locked = await orderDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2 = await orderDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除订单
 * @param {OrderId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: OrderId[],
): Promise<number> {
  
  {
    const models = await orderDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw await ns("不能删除已经锁定的 {0}", "订单");
      }
    }
  }
  
  const data = await orderDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用订单
 * @param {OrderId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: OrderId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await orderDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁订单
 * @param {OrderId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: OrderId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await orderDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原订单
 * @param {OrderId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: OrderId[],
): Promise<number> {
  const data = await orderDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除订单
 * @param {OrderId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: OrderId[],
): Promise<number> {
  const data = await orderDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取订单字段注释
 */
export async function getFieldComments(): Promise<OrderFieldComment> {
  const data = await orderDao.getFieldComments();
  return data;
}
