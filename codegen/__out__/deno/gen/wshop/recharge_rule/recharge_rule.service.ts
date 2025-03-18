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

import * as recharge_ruleDao from "./recharge_rule.dao.ts";

async function setSearchQuery(
  search: RechargeRuleSearch,
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
 * 根据条件查找充值赠送规则总数
 */
export async function findCount(
  search?: RechargeRuleSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const recharge_rule_num = await recharge_ruleDao.findCount(search);
  
  return recharge_rule_num;
}

/**
 * 根据搜索条件和分页查找充值赠送规则列表
 */
export async function findAll(
  search?: RechargeRuleSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<RechargeRuleModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const recharge_rule_models = await recharge_ruleDao.findAll(search, page, sort);
  
  return recharge_rule_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: RechargeRuleInput,
): Promise<void> {
  await recharge_ruleDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个充值赠送规则
 */
export async function findOne(
  search?: RechargeRuleSearch,
  sort?: SortInput[],
): Promise<RechargeRuleModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const recharge_rule_model = await recharge_ruleDao.findOne(search, sort);
  
  return recharge_rule_model;
}

/**
 * 根据 id 查找充值赠送规则
 */
export async function findById(
  recharge_rule_id?: RechargeRuleId | null,
): Promise<RechargeRuleModel | undefined> {
  
  const recharge_rule_model = await recharge_ruleDao.findById(recharge_rule_id);
  
  return recharge_rule_model;
}

/**
 * 根据 ids 查找充值赠送规则
 */
export async function findByIds(
  recharge_rule_ids: RechargeRuleId[],
): Promise<RechargeRuleModel[]> {
  
  const recharge_rule_models = await recharge_ruleDao.findByIds(recharge_rule_ids);
  
  return recharge_rule_models;
}

/**
 * 根据搜索条件查找充值赠送规则是否存在
 */
export async function exist(
  search?: RechargeRuleSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const recharge_rule_exist = await recharge_ruleDao.exist(search);
  
  return recharge_rule_exist;
}

/**
 * 根据 id 查找充值赠送规则是否存在
 */
export async function existById(
  recharge_rule_id?: RechargeRuleId | null,
): Promise<boolean> {
  
  const recharge_rule_exist = await recharge_ruleDao.existById(recharge_rule_id);
  
  return recharge_rule_exist;
}

/**
 * 增加和修改时校验充值赠送规则
 */
export async function validate(
  input: RechargeRuleInput,
): Promise<void> {
  await recharge_ruleDao.validate(input);
}

/**
 * 批量创建充值赠送规则
 */
export async function creates(
  inputs: RechargeRuleInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<RechargeRuleId[]> {
  const recharge_rule_ids = await recharge_ruleDao.creates(inputs, options);
  
  return recharge_rule_ids;
}

/**
 * 根据 id 修改充值赠送规则
 */
export async function updateById(
  recharge_rule_id: RechargeRuleId,
  input: RechargeRuleInput,
): Promise<RechargeRuleId> {
  
  const is_locked = await recharge_ruleDao.getIsLockedById(recharge_rule_id);
  if (is_locked) {
    throw "不能修改已经锁定的 充值赠送规则";
  }
  
  const recharge_rule_id2 = await recharge_ruleDao.updateById(recharge_rule_id, input);
  
  return recharge_rule_id2;
}

/** 校验充值赠送规则是否存在 */
export async function validateOption(
  model0?: RechargeRuleModel,
): Promise<RechargeRuleModel> {
  const recharge_rule_model = await recharge_ruleDao.validateOption(model0);
  return recharge_rule_model;
}

/**
 * 根据 ids 删除充值赠送规则
 */
export async function deleteByIds(
  recharge_rule_ids: RechargeRuleId[],
): Promise<number> {
  
  const old_models = await recharge_ruleDao.findByIds(recharge_rule_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 充值赠送规则";
    }
  }
  
  const recharge_rule_num = await recharge_ruleDao.deleteByIds(recharge_rule_ids);
  return recharge_rule_num;
}

/**
 * 根据 ids 启用或者禁用充值赠送规则
 */
export async function enableByIds(
  ids: RechargeRuleId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const recharge_rule_num = await recharge_ruleDao.enableByIds(ids, is_enabled);
  return recharge_rule_num;
}

/**
 * 根据 ids 锁定或者解锁充值赠送规则
 */
export async function lockByIds(
  recharge_rule_ids: RechargeRuleId[],
  is_locked: 0 | 1,
): Promise<number> {
  const recharge_rule_num = await recharge_ruleDao.lockByIds(recharge_rule_ids, is_locked);
  return recharge_rule_num;
}

/**
 * 根据 ids 还原充值赠送规则
 */
export async function revertByIds(
  recharge_rule_ids: RechargeRuleId[],
): Promise<number> {
  
  const recharge_rule_num = await recharge_ruleDao.revertByIds(recharge_rule_ids);
  
  return recharge_rule_num;
}

/**
 * 根据 ids 彻底删除充值赠送规则
 */
export async function forceDeleteByIds(
  recharge_rule_ids: RechargeRuleId[],
): Promise<number> {
  
  const recharge_rule_num = await recharge_ruleDao.forceDeleteByIds(recharge_rule_ids);
  
  return recharge_rule_num;
}

/**
 * 获取充值赠送规则字段注释
 */
export async function getFieldComments(): Promise<RechargeRuleFieldComment> {
  const recharge_rule_fields = await recharge_ruleDao.getFieldComments();
  return recharge_rule_fields;
}
