import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as recharge_ruleDao from "./recharge_rule.dao.ts";

/**
 * 根据条件查找充值赠送规则总数
 * @param {RechargeRuleSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: RechargeRuleSearch,
): Promise<number> {
  search = search || { };
  const data = await recharge_ruleDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找充值赠送规则列表
 * @param {RechargeRuleSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<RechargeRuleModel[]>} 
 */
export async function findAll(
  search?: RechargeRuleSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<RechargeRuleModel[]> {
  search = search || { };
  const models: RechargeRuleModel[] = await recharge_ruleDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: RechargeRuleInput,
) {
  const data = await recharge_ruleDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个充值赠送规则
 * @param {RechargeRuleSearch} search? 搜索条件
 */
export async function findOne(
  search?: RechargeRuleSearch,
  sort?: SortInput|SortInput[],
): Promise<RechargeRuleModel | undefined> {
  search = search || { };
  const model = await recharge_ruleDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找充值赠送规则
 * @param {RechargeRuleId} id
 */
export async function findById(
  id?: RechargeRuleId | null,
): Promise<RechargeRuleModel | undefined> {
  const model = await recharge_ruleDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找充值赠送规则是否存在
 * @param {RechargeRuleSearch} search? 搜索条件
 */
export async function exist(
  search?: RechargeRuleSearch,
): Promise<boolean> {
  search = search || { };
  const data = await recharge_ruleDao.exist(search);
  return data;
}

/**
 * 根据 id 查找充值赠送规则是否存在
 * @param {RechargeRuleId} id
 */
export async function existById(
  id?: RechargeRuleId | null,
): Promise<boolean> {
  const data = await recharge_ruleDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验充值赠送规则
 * @param input 
 */
export async function validate(
  input: RechargeRuleInput,
): Promise<void> {
  const data = await recharge_ruleDao.validate(input);
  return data;
}

/**
 * 创建充值赠送规则
 * @param {RechargeRuleInput} input
 * @return {Promise<RechargeRuleId>} id
 */
export async function create(
  input: RechargeRuleInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<RechargeRuleId> {
  const id = await recharge_ruleDao.create(input, options);
  return id;
}

/**
 * 批量创建充值赠送规则
 * @param {RechargeRuleInput[]} inputs
 * @return {Promise<RechargeRuleId[]>} ids
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
 * @param {RechargeRuleId} id
 * @param {RechargeRuleInput} input
 * @return {Promise<RechargeRuleId>}
 */
export async function updateById(
  id: RechargeRuleId,
  input: RechargeRuleInput,
): Promise<RechargeRuleId> {
  
  const is_locked = await recharge_ruleDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2: RechargeRuleId = await recharge_ruleDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除充值赠送规则
 * @param {RechargeRuleId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: RechargeRuleId[],
): Promise<number> {
  
  {
    const ids2: RechargeRuleId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: RechargeRuleId = ids[i];
      const is_locked = await recharge_ruleDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  const data = await recharge_ruleDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用充值赠送规则
 * @param {RechargeRuleId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
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
 * @param {RechargeRuleId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
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
 * @param {RechargeRuleId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: RechargeRuleId[],
): Promise<number> {
  const data = await recharge_ruleDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除充值赠送规则
 * @param {RechargeRuleId[]} ids
 * @return {Promise<number>}
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
