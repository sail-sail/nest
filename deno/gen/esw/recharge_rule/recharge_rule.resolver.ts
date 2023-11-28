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
  RechargeRuleInput,
  RechargeRuleModel,
  RechargeRuleSearch,
  RechargeRuleFieldComment,
} from "./recharge_rule.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountRechargeRule(
  search?: RechargeRuleSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./recharge_rule.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllRechargeRule(
  search?: RechargeRuleSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<RechargeRuleModel[]> {
  
  const {
    findAll,
  } = await import("./recharge_rule.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsRechargeRule(): Promise<RechargeRuleFieldComment> {
  const { getFieldComments } = await import("./recharge_rule.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneRechargeRule(
  search?: RechargeRuleSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<RechargeRuleModel | undefined> {
  
  const {
    findOne,
  } = await import("./recharge_rule.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdRechargeRule(
  id: string,
): Promise<RechargeRuleModel | undefined> {
  const { findById } = await import("./recharge_rule.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createRechargeRule(
  input: RechargeRuleInput,
  unique_type?: UniqueType,
): Promise<string> {
  
  // 充值金额
  if (input.amt != null) {
    input.amt = new Decimal(input.amt);
  }
  
  // 赠送金额
  if (input.give_amt != null) {
    input.give_amt = new Decimal(input.give_amt);
  }
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./recharge_rule.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/esw/recharge_rule",
    "add",
  );
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdRechargeRule(
  id: string,
  input: RechargeRuleInput,
): Promise<string> {
  
  // 充值金额
  if (input.amt != null) {
    input.amt = new Decimal(input.amt);
  }
  
  // 赠送金额
  if (input.give_amt != null) {
    input.give_amt = new Decimal(input.give_amt);
  }
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./recharge_rule.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/esw/recharge_rule",
    "edit",
  );
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsRechargeRule(
  ids: string[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./recharge_rule.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/recharge_rule",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用数据
 */
export async function enableByIdsRechargeRule(
  ids: string[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./recharge_rule.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsRechargeRule.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/esw/recharge_rule",
    "enable",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsRechargeRule(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./recharge_rule.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsRechargeRule.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/esw/recharge_rule",
    "lock",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsRechargeRule(
  ids: string[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./recharge_rule.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/recharge_rule",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsRechargeRule(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/recharge_rule",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./recharge_rule.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
