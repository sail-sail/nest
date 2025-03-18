import {
  set_is_tran,
  set_is_creating,
} from "/lib/context.ts";

import Decimal from "decimal.js";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortOrder,
} from "./order.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./order.model.ts";

/**
 * 根据条件查找订单总数
 */
export async function findCountOrder(
  search?: OrderSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./order.service.ts");
  
  const num = await findCount(search);
  
  return num;
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
  
  checkSortOrder(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取订单字段注释
 */
export async function getFieldCommentsOrder(): Promise<OrderFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./order.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
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
  
  checkSortOrder(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找订单
 */
export async function findByIdOrder(
  id: OrderId,
): Promise<OrderModel | undefined> {
  
  const {
    findById,
  } = await import("./order.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找订单
 */
export async function findByIdsOrder(
  ids: OrderId[],
): Promise<OrderModel[]> {
  
  const {
    findByIds,
  } = await import("./order.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建订单
 */
export async function createsOrder(
  inputs: OrderInput[],
  unique_type?: UniqueType,
): Promise<OrderId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./order.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
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
    
    await setIdByLbl(input);
    
    await validate(input);
  }
  const uniqueType = unique_type;
  const ids = await creates(inputs, { uniqueType });
  return ids;
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
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
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
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
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
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsOrder.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
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
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsOrder.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
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
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
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
  
  const {
    forceDeleteByIds,
  } = await import("./order.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
