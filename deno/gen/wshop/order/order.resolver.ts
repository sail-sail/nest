import {
  useContext,
} from "/lib/context.ts";

import Decimal from "decimal.js";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找订单总数
 */
export async function findCountOrder(
  search?: OrderSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./order.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找订单列表
 */
export async function findAllOrder(
  search?: OrderSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OrderModel[]> {
  
  const {
    findAll,
  } = await import("./order.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取订单字段注释
 */
export async function getFieldCommentsOrder(): Promise<OrderFieldComment> {
  const { getFieldComments } = await import("./order.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个订单
 */
export async function findOneOrder(
  search?: OrderSearch,
  sort?: SortInput[],
): Promise<OrderModel | undefined> {
  
  const {
    findOne,
  } = await import("./order.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找订单
 */
export async function findByIdOrder(
  id: OrderId,
): Promise<OrderModel | undefined> {
  const { findById } = await import("./order.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建订单
 */
export async function createOrder(
  input: OrderInput,
  unique_type?: UniqueType,
): Promise<OrderId> {
  
  input.id = undefined;
  
  // 订单金额
  if (input.price != null) {
    input.price = new Decimal(input.price);
  }
  
  // 消费充值金额
  if (input.amt != null) {
    input.amt = new Decimal(input.amt);
  }
  
  // 消费赠送金额
  if (input.give_amt != null) {
    input.give_amt = new Decimal(input.give_amt);
  }
  
  // 消费后充值余额
  if (input.balance != null) {
    input.balance = new Decimal(input.balance);
  }
  
  // 消费后赠送余额
  if (input.give_balance != null) {
    input.give_balance = new Decimal(input.give_balance);
  }
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./order.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/wshop/order",
    "add",
  );
  const uniqueType = unique_type;
  const id: OrderId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改订单
 */
export async function updateByIdOrder(
  id: OrderId,
  input: OrderInput,
): Promise<OrderId> {
  
  input.id = undefined;
  
  // 订单金额
  if (input.price != null) {
    input.price = new Decimal(input.price);
  }
  
  // 消费充值金额
  if (input.amt != null) {
    input.amt = new Decimal(input.amt);
  }
  
  // 消费赠送金额
  if (input.give_amt != null) {
    input.give_amt = new Decimal(input.give_amt);
  }
  
  // 消费后充值余额
  if (input.balance != null) {
    input.balance = new Decimal(input.balance);
  }
  
  // 消费后赠送余额
  if (input.give_balance != null) {
    input.give_balance = new Decimal(input.give_balance);
  }
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./order.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/wshop/order",
    "edit",
  );
  const id2: OrderId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除订单
 */
export async function deleteByIdsOrder(
  ids: OrderId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./order.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/order",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用订单
 */
export async function enableByIdsOrder(
  ids: OrderId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./order.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsOrder.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/wshop/order",
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁订单
 */
export async function lockByIdsOrder(
  ids: OrderId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./order.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsOrder.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/wshop/order",
    "edit",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原订单
 */
export async function revertByIdsOrder(
  ids: OrderId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./order.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/order",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除订单
 */
export async function forceDeleteByIdsOrder(
  ids: OrderId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/order",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./order.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
