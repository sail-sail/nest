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
  checkSortCard,
} from "./card.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./card.model.ts";

/**
 * 根据条件查找会员卡总数
 */
export async function findCountCard(
  search?: CardSearch,
): Promise<number> {
  
  const {
    findCountCard,
  } = await import("./card.service.ts");
  
  const num = await findCountCard(search);
  
  return num;
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
    findAllCard,
  } = await import("./card.service.ts");
  
  checkSortCard(sort);
  
  const models = await findAllCard(search, page, sort);
  
  return models;
}

/**
 * 获取会员卡字段注释
 */
export async function getFieldCommentsCard(): Promise<CardFieldComment> {
  
  const {
    getFieldCommentsCard,
  } = await import("./card.service.ts");
  
  const field_comment = await getFieldCommentsCard();
  
  return field_comment;
}

/**
 * 根据条件查找第一个会员卡
 */
export async function findOneCard(
  search?: CardSearch,
  sort?: SortInput[],
): Promise<CardModel | undefined> {
  
  const {
    findOneCard,
  } = await import("./card.service.ts");
  
  checkSortCard(sort);
  
  const model = await findOneCard(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个会员卡, 如果不存在则抛错
 */
export async function findOneOkCard(
  search?: CardSearch,
  sort?: SortInput[],
): Promise<CardModel> {
  
  const {
    findOneOkCard,
  } = await import("./card.service.ts");
  
  checkSortCard(sort);
  
  const model = await findOneOkCard(search, sort);
  
  return model;
}

/**
 * 根据 id 查找会员卡
 */
export async function findByIdCard(
  id: CardId,
): Promise<CardModel | undefined> {
  
  const {
    findByIdCard,
  } = await import("./card.service.ts");
  
  const model = await findByIdCard(id);
  
  return model;
}

/**
 * 根据 id 查找会员卡, 如果不存在则抛错
 */
export async function findByIdOkCard(
  id: CardId,
): Promise<CardModel | undefined> {
  
  const {
    findByIdOkCard,
  } = await import("./card.service.ts");
  
  const model = await findByIdOkCard(id);
  
  return model;
}

/**
 * 根据 ids 查找会员卡
 */
export async function findByIdsCard(
  ids: CardId[],
): Promise<CardModel[]> {
  
  const {
    findByIdsCard,
  } = await import("./card.service.ts");
  
  const models = await findByIdsCard(ids);
  
  return models;
}

/**
 * 根据 ids 查找会员卡, 出现查询不到的 id 则报错
 */
export async function findByIdsOkCard(
  ids: CardId[],
): Promise<CardModel[]> {
  
  const {
    findByIdsOkCard,
  } = await import("./card.service.ts");
  
  const models = await findByIdsOkCard(ids);
  
  return models;
}

/**
 * 批量创建会员卡
 */
export async function createsCard(
  inputs: CardInput[],
  unique_type?: UniqueType,
): Promise<CardId[]> {
  
  const {
    validateCard,
    setIdByLblCard,
    createsCard,
  } = await import("./card.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
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
    
    await setIdByLblCard(input);
    
    await validateCard(input);
  }
  const uniqueType = unique_type;
  const ids = await createsCard(inputs, { uniqueType });
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
    setIdByLblCard,
    updateByIdCard,
  } = await import("./card.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblCard(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: CardId = await updateByIdCard(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除会员卡
 */
export async function deleteByIdsCard(
  ids: CardId[],
): Promise<number> {
  
  const {
    deleteByIdsCard,
  } = await import("./card.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsCard(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用会员卡
 */
export async function enableByIdsCard(
  ids: CardId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsCard,
  } = await import("./card.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsCard.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsCard(ids, is_enabled);
  
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
    lockByIdsCard,
  } = await import("./card.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsCard.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsCard(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原会员卡
 */
export async function revertByIdsCard(
  ids: CardId[],
): Promise<number> {
  
  const {
    revertByIdsCard,
  } = await import("./card.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsCard(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除会员卡
 */
export async function forceDeleteByIdsCard(
  ids: CardId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsCard,
  } = await import("./card.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsCard(ids);
  
  return res;
}
