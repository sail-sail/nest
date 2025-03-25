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
  findByIdUsr,
  validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  isAdmin,
} from "/src/base/usr/usr.dao.ts";

import * as orderDao from "./order.dao.ts";

async function setSearchQuery(
  search: OrderSearch,
) {
  
  const usr_id = await get_usr_id(false);
  const org_id = await get_org_id();
  const usr_model = await validateOptionUsr(
    await findByIdUsr(usr_id),
  );
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
export async function findCountOrder(
  search?: OrderSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const order_num = await orderDao.findCountOrder(search);
  
  return order_num;
}

/**
 * 根据搜索条件和分页查找订单列表
 */
export async function findAllOrder(
  search?: OrderSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OrderModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const order_models = await orderDao.findAllOrder(search, page, sort);
  
  return order_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblOrder(
  input: OrderInput,
): Promise<void> {
  await orderDao.setIdByLblOrder(input);
}

/**
 * 根据条件查找第一个订单
 */
export async function findOneOrder(
  search?: OrderSearch,
  sort?: SortInput[],
): Promise<OrderModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const order_model = await orderDao.findOneOrder(search, sort);
  
  return order_model;
}

/**
 * 根据 id 查找订单
 */
export async function findByIdOrder(
  order_id?: OrderId | null,
): Promise<OrderModel | undefined> {
  
  const order_model = await orderDao.findByIdOrder(order_id);
  
  return order_model;
}

/**
 * 根据 ids 查找订单
 */
export async function findByIdsOrder(
  order_ids: OrderId[],
): Promise<OrderModel[]> {
  
  const order_models = await orderDao.findByIdsOrder(order_ids);
  
  return order_models;
}

/**
 * 根据搜索条件查找订单是否存在
 */
export async function existOrder(
  search?: OrderSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const order_exist = await orderDao.existOrder(search);
  
  return order_exist;
}

/**
 * 根据 id 查找订单是否存在
 */
export async function existByIdOrder(
  order_id?: OrderId | null,
): Promise<boolean> {
  
  const order_exist = await orderDao.existByIdOrder(order_id);
  
  return order_exist;
}

/**
 * 增加和修改时校验订单
 */
export async function validateOrder(
  input: OrderInput,
): Promise<void> {
  await orderDao.validateOrder(input);
}

/**
 * 批量创建订单
 */
export async function createsOrder(
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
  
  const order_ids = await orderDao.createsOrder(inputs, options);
  
  return order_ids;
}

/**
 * 根据 id 修改订单
 */
export async function updateByIdOrder(
  order_id: OrderId,
  input: OrderInput,
): Promise<OrderId> {
  
  const is_locked = await orderDao.getIsLockedByIdOrder(order_id);
  if (is_locked) {
    throw "不能修改已经锁定的 订单";
  }
  
  const order_id2 = await orderDao.updateByIdOrder(order_id, input);
  
  return order_id2;
}

/** 校验订单是否存在 */
export async function validateOptionOrder(
  model0?: OrderModel,
): Promise<OrderModel> {
  const order_model = await orderDao.validateOptionOrder(model0);
  return order_model;
}

/**
 * 根据 ids 删除订单
 */
export async function deleteByIdsOrder(
  order_ids: OrderId[],
): Promise<number> {
  
  const old_models = await orderDao.findByIdsOrder(order_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 订单";
    }
  }
  
  const order_num = await orderDao.deleteByIdsOrder(order_ids);
  return order_num;
}

/**
 * 根据 ids 启用或者禁用订单
 */
export async function enableByIdsOrder(
  ids: OrderId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const order_num = await orderDao.enableByIdsOrder(ids, is_enabled);
  return order_num;
}

/**
 * 根据 ids 锁定或者解锁订单
 */
export async function lockByIdsOrder(
  order_ids: OrderId[],
  is_locked: 0 | 1,
): Promise<number> {
  const order_num = await orderDao.lockByIdsOrder(order_ids, is_locked);
  return order_num;
}

/**
 * 根据 ids 还原订单
 */
export async function revertByIdsOrder(
  order_ids: OrderId[],
): Promise<number> {
  
  const order_num = await orderDao.revertByIdsOrder(order_ids);
  
  return order_num;
}

/**
 * 根据 ids 彻底删除订单
 */
export async function forceDeleteByIdsOrder(
  order_ids: OrderId[],
): Promise<number> {
  
  const order_num = await orderDao.forceDeleteByIdsOrder(order_ids);
  
  return order_num;
}

/**
 * 获取订单字段注释
 */
export async function getFieldCommentsOrder(): Promise<OrderFieldComment> {
  const order_fields = await orderDao.getFieldCommentsOrder();
  return order_fields;
}
