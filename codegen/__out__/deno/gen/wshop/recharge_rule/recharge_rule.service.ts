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
  const username = usr_model.username;
  
  if (username !== "admin") {
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
  
  const data = await recharge_ruleDao.findCount(search);
  return data;
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
  
  const models: RechargeRuleModel[] = await recharge_ruleDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: RechargeRuleInput,
) {
  const data = await recharge_ruleDao.setIdByLbl(input);
  return data;
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
  
  const model = await recharge_ruleDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找充值赠送规则
 */
export async function findById(
  id?: RechargeRuleId | null,
): Promise<RechargeRuleModel | undefined> {
  const model = await recharge_ruleDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找充值赠送规则是否存在
 */
export async function exist(
  search?: RechargeRuleSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await recharge_ruleDao.exist(search);
  return data;
}

/**
 * 根据 id 查找充值赠送规则是否存在
 */
export async function existById(
  id?: RechargeRuleId | null,
): Promise<boolean> {
  const data = await recharge_ruleDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验充值赠送规则
 */
export async function validate(
  input: RechargeRuleInput,
): Promise<void> {
  const data = await recharge_ruleDao.validate(input);
  return data;
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
  const ids = await recharge_ruleDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改充值赠送规则
 */
export async function updateById(
  id: RechargeRuleId,
  input: RechargeRuleInput,
): Promise<RechargeRuleId> {
  
  const is_locked = await recharge_ruleDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 充值赠送规则";
  }
  
  const id2 = await recharge_ruleDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除充值赠送规则
 */
export async function deleteByIds(
  ids: RechargeRuleId[],
): Promise<number> {
  
  {
    const models = await recharge_ruleDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 充值赠送规则";
      }
    }
  }
  
  const data = await recharge_ruleDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用充值赠送规则
 */
export async function enableByIds(
  ids: RechargeRuleId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await recharge_ruleDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁充值赠送规则
 */
export async function lockByIds(
  ids: RechargeRuleId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await recharge_ruleDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原充值赠送规则
 */
export async function revertByIds(
  ids: RechargeRuleId[],
): Promise<number> {
  const data = await recharge_ruleDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除充值赠送规则
 */
export async function forceDeleteByIds(
  ids: RechargeRuleId[],
): Promise<number> {
  const data = await recharge_ruleDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取充值赠送规则字段注释
 */
export async function getFieldComments(): Promise<RechargeRuleFieldComment> {
  const data = await recharge_ruleDao.getFieldComments();
  return data;
}
