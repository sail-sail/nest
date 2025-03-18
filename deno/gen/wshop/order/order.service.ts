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
  validateOption as validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  isAdmin,
} from "/src/base/usr/usr.dao.ts";

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
  
  if (!await isAdmin(usr_id)) {
    search.org_id = org_ids;
  }
  
}

/**
 * 根据条件查找订单总数
 */
export async function findCount(
  search?: OrderSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const order_num = await orderDao.findCount(search);
  
  return order_num;
}

/**
 * 根据搜索条件和分页查找订单列表
 */
export async function findAll(
  search?: OrderSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OrderModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const order_models = await orderDao.findAll(search, page, sort);
  
  return order_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: OrderInput,
): Promise<void> {
  await orderDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个订单
 */
export async function findOne(
  search?: OrderSearch,
  sort?: SortInput[],
): Promise<OrderModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const order_model = await orderDao.findOne(search, sort);
  
  return order_model;
}

/**
 * 根据 id 查找订单
 */
export async function findById(
  order_id?: OrderId | null,
): Promise<OrderModel | undefined> {
  
  const order_model = await orderDao.findById(order_id);
  
  return order_model;
}

/**
 * 根据 ids 查找订单
 */
export async function findByIds(
  order_ids: OrderId[],
): Promise<OrderModel[]> {
  
  const order_models = await orderDao.findByIds(order_ids);
  
  return order_models;
}

/**
 * 根据搜索条件查找订单是否存在
 */
export async function exist(
  search?: OrderSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const order_exist = await orderDao.exist(search);
  
  return order_exist;
}

/**
 * 根据 id 查找订单是否存在
 */
export async function existById(
  order_id?: OrderId | null,
): Promise<boolean> {
  
  const order_exist = await orderDao.existById(order_id);
  
  return order_exist;
}

/**
 * 增加和修改时校验订单
 */
export async function validate(
  input: OrderInput,
): Promise<void> {
  await orderDao.validate(input);
}

/**
 * 批量创建订单
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
  
  const order_ids = await orderDao.creates(inputs, options);
  
  return order_ids;
}

/**
 * 根据 id 修改订单
 */
export async function updateById(
  order_id: OrderId,
  input: OrderInput,
): Promise<OrderId> {
  
  const is_locked = await orderDao.getIsLockedById(order_id);
  if (is_locked) {
    throw "不能修改已经锁定的 订单";
  }
  
  const order_id2 = await orderDao.updateById(order_id, input);
  
  return order_id2;
}

/** 校验订单是否存在 */
export async function validateOption(
  model0?: OrderModel,
): Promise<OrderModel> {
  const order_model = await orderDao.validateOption(model0);
  return order_model;
}

/**
 * 根据 ids 删除订单
 */
export async function deleteByIds(
  order_ids: OrderId[],
): Promise<number> {
  
  const old_models = await orderDao.findByIds(order_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 订单";
    }
  }
  
  const order_num = await orderDao.deleteByIds(order_ids);
  return order_num;
}

/**
 * 根据 ids 启用或者禁用订单
 */
export async function enableByIds(
  ids: OrderId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const order_num = await orderDao.enableByIds(ids, is_enabled);
  return order_num;
}

/**
 * 根据 ids 锁定或者解锁订单
 */
export async function lockByIds(
  order_ids: OrderId[],
  is_locked: 0 | 1,
): Promise<number> {
  const order_num = await orderDao.lockByIds(order_ids, is_locked);
  return order_num;
}

/**
 * 根据 ids 还原订单
 */
export async function revertByIds(
  order_ids: OrderId[],
): Promise<number> {
  
  const order_num = await orderDao.revertByIds(order_ids);
  
  return order_num;
}

/**
 * 根据 ids 彻底删除订单
 */
export async function forceDeleteByIds(
  order_ids: OrderId[],
): Promise<number> {
  
  const order_num = await orderDao.forceDeleteByIds(order_ids);
  
  return order_num;
}

/**
 * 获取订单字段注释
 */
export async function getFieldComments(): Promise<OrderFieldComment> {
  const order_fields = await orderDao.getFieldComments();
  return order_fields;
}
