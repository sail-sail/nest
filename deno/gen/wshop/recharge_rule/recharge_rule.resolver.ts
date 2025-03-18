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
  checkSortRechargeRule,
} from "./recharge_rule.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./recharge_rule.model.ts";

/**
 * 根据条件查找充值赠送规则总数
 */
export async function findCountRechargeRule(
  search?: RechargeRuleSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./recharge_rule.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找充值赠送规则列表
 */
export async function findAllRechargeRule(
  search?: RechargeRuleSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<RechargeRuleModel[]> {
  
  const {
    findAll,
  } = await import("./recharge_rule.service.ts");
  
  checkSortRechargeRule(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取充值赠送规则字段注释
 */
export async function getFieldCommentsRechargeRule(): Promise<RechargeRuleFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./recharge_rule.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个充值赠送规则
 */
export async function findOneRechargeRule(
  search?: RechargeRuleSearch,
  sort?: SortInput[],
): Promise<RechargeRuleModel | undefined> {
  
  const {
    findOne,
  } = await import("./recharge_rule.service.ts");
  
  checkSortRechargeRule(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找充值赠送规则
 */
export async function findByIdRechargeRule(
  id: RechargeRuleId,
): Promise<RechargeRuleModel | undefined> {
  
  const {
    findById,
  } = await import("./recharge_rule.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找充值赠送规则
 */
export async function findByIdsRechargeRule(
  ids: RechargeRuleId[],
): Promise<RechargeRuleModel[]> {
  
  const {
    findByIds,
  } = await import("./recharge_rule.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建充值赠送规则
 */
export async function createsRechargeRule(
  inputs: RechargeRuleInput[],
  unique_type?: UniqueType,
): Promise<RechargeRuleId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./recharge_rule.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    // 充值金额
    if (input.amt != null) {
      input.amt = new Decimal(input.amt);
    }
    
    // 赠送金额
    if (input.give_amt != null) {
      input.give_amt = new Decimal(input.give_amt);
    }
    
    await setIdByLbl(input);
    
    await validate(input);
  }
  const uniqueType = unique_type;
  const ids = await creates(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改充值赠送规则
 */
export async function updateByIdRechargeRule(
  id: RechargeRuleId,
  input: RechargeRuleInput,
): Promise<RechargeRuleId> {
  
  input.id = undefined;
  
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
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: RechargeRuleId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除充值赠送规则
 */
export async function deleteByIdsRechargeRule(
  ids: RechargeRuleId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./recharge_rule.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用充值赠送规则
 */
export async function enableByIdsRechargeRule(
  ids: RechargeRuleId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./recharge_rule.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsRechargeRule.is_enabled expect 0 or 1 but got ${ is_enabled }`);
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
 * 根据 ids 锁定或者解锁充值赠送规则
 */
export async function lockByIdsRechargeRule(
  ids: RechargeRuleId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./recharge_rule.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsRechargeRule.is_locked expect 0 or 1 but got ${ is_locked }`);
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
 * 根据 ids 还原充值赠送规则
 */
export async function revertByIdsRechargeRule(
  ids: RechargeRuleId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./recharge_rule.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除充值赠送规则
 */
export async function forceDeleteByIdsRechargeRule(
  ids: RechargeRuleId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./recharge_rule.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
