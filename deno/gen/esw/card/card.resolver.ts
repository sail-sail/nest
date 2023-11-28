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
  CardInput,
  CardModel,
  CardSearch,
  CardFieldComment,
} from "./card.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountCard(
  search?: CardSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./card.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllCard(
  search?: CardSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<CardModel[]> {
  
  const {
    findAll,
  } = await import("./card.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsCard(): Promise<CardFieldComment> {
  const { getFieldComments } = await import("./card.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneCard(
  search?: CardSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<CardModel | undefined> {
  
  const {
    findOne,
  } = await import("./card.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdCard(
  id: string,
): Promise<CardModel | undefined> {
  const { findById } = await import("./card.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createCard(
  input: CardInput,
  unique_type?: UniqueType,
): Promise<string> {
  
  // 充值余额
  if (input.balance != null) {
    input.balance = new Decimal(input.balance);
  }
  
  // 赠送余额
  if (input.give_balance != null) {
    input.give_balance = new Decimal(input.give_balance);
  }
  
  // 累计消费
  if (input.growth_amt != null) {
    input.growth_amt = new Decimal(input.growth_amt);
  }
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./card.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/esw/card",
    "add",
  );
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdCard(
  id: string,
  input: CardInput,
): Promise<string> {
  
  // 充值余额
  if (input.balance != null) {
    input.balance = new Decimal(input.balance);
  }
  
  // 赠送余额
  if (input.give_balance != null) {
    input.give_balance = new Decimal(input.give_balance);
  }
  
  // 累计消费
  if (input.growth_amt != null) {
    input.growth_amt = new Decimal(input.growth_amt);
  }
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./card.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/esw/card",
    "edit",
  );
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsCard(
  ids: string[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./card.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/card",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 id 设置默认记录
 */
export async function defaultByIdCard(
  id: string,
): Promise<number> {
  
  const {
    defaultById,
  } = await import("./card.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/card",
    "default",
  );
  const res = await defaultById(id);
  return res;
}

/**
 * 根据 ids 启用或者禁用数据
 */
export async function enableByIdsCard(
  ids: string[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./card.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsCard.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/esw/card",
    "enable",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsCard(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./card.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsCard.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/esw/card",
    "lock",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsCard(
  ids: string[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./card.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/card",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsCard(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/card",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./card.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
