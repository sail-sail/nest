import {
  useContext,
} from "/lib/context.ts";

import Decimal from "decimal.js";

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  OrderInput,
  OrderModel,
  OrderSearch,
  OrderFieldComment,
} from "./order.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountOrder(
  search?: OrderSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./order.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllOrder(
  search?: OrderSearch & { $extra?: SearchExtra[] },
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
 * 获取字段对应的名称
 */
export async function getFieldCommentsOrder(): Promise<OrderFieldComment> {
  const { getFieldComments } = await import("./order.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneOrder(
  search?: OrderSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<OrderModel | undefined> {
  
  const {
    findOne,
  } = await import("./order.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdOrder(
  id: string,
): Promise<OrderModel | undefined> {
  const { findById } = await import("./order.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createOrder(
  input: OrderInput,
  unique_type?: UniqueType,
): Promise<string> {
  
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
    "/esw/order",
    "add",
  );
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdOrder(
  id: string,
  input: OrderInput,
): Promise<string> {
  
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
    "/esw/order",
    "edit",
  );
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsOrder(
  ids: string[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./order.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/order",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用数据
 */
export async function enableByIdsOrder(
  ids: string[],
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
    "/esw/order",
    "enable",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsOrder(
  ids: string[],
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
    "/esw/order",
    "lock",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsOrder(
  ids: string[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./order.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/order",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsOrder(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/order",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./order.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
