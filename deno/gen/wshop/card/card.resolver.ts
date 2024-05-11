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
 * 根据条件查找会员卡总数
 */
export async function findCountCard(
  search?: CardSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./card.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找会员卡列表
 */
export async function findAllCard(
  search?: CardSearch,
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
 * 获取会员卡字段注释
 */
export async function getFieldCommentsCard(): Promise<CardFieldComment> {
  const { getFieldComments } = await import("./card.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个会员卡
 */
export async function findOneCard(
  search?: CardSearch,
  sort?: SortInput[],
): Promise<CardModel | undefined> {
  
  const {
    findOne,
  } = await import("./card.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找会员卡
 */
export async function findByIdCard(
  id: CardId,
): Promise<CardModel | undefined> {
  const { findById } = await import("./card.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 批量创建会员卡
 */
export async function createsCard(
  inputs: CardInput[],
  unique_type?: UniqueType,
): Promise<CardId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./card.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/card",
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
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
    
    await setIdByLbl(input);
    
    await validate(input);
  }
  const uniqueType = unique_type;
  const ids = await creates(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改会员卡
 */
export async function updateByIdCard(
  id: CardId,
  input: CardInput,
): Promise<CardId> {
  
  input.id = undefined;
  
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
    "/wshop/card",
    "edit",
  );
  const id2: CardId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除会员卡
 */
export async function deleteByIdsCard(
  ids: CardId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./card.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/card",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用会员卡
 */
export async function enableByIdsCard(
  ids: CardId[],
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
    "/wshop/card",
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁会员卡
 */
export async function lockByIdsCard(
  ids: CardId[],
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
    "/wshop/card",
    "edit",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原会员卡
 */
export async function revertByIdsCard(
  ids: CardId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./card.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/card",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除会员卡
 */
export async function forceDeleteByIdsCard(
  ids: CardId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/card",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./card.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
