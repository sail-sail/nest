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

import * as card_rechargeDao from "./card_recharge.dao.ts";

async function setSearchQuery(
  search: CardRechargeSearch,
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
 * 根据条件查找会员卡充值记录总数
 */
export async function findCount(
  search?: CardRechargeSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_recharge_num = await card_rechargeDao.findCount(search);
  
  return card_recharge_num;
}

/**
 * 根据搜索条件和分页查找会员卡充值记录列表
 */
export async function findAll(
  search?: CardRechargeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CardRechargeModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_recharge_models = await card_rechargeDao.findAll(search, page, sort);
  
  return card_recharge_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: CardRechargeInput,
): Promise<void> {
  await card_rechargeDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个会员卡充值记录
 */
export async function findOne(
  search?: CardRechargeSearch,
  sort?: SortInput[],
): Promise<CardRechargeModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_recharge_model = await card_rechargeDao.findOne(search, sort);
  
  return card_recharge_model;
}

/**
 * 根据 id 查找会员卡充值记录
 */
export async function findById(
  card_recharge_id?: CardRechargeId | null,
): Promise<CardRechargeModel | undefined> {
  
  const card_recharge_model = await card_rechargeDao.findById(card_recharge_id);
  
  return card_recharge_model;
}

/**
 * 根据 ids 查找会员卡充值记录
 */
export async function findByIds(
  card_recharge_ids: CardRechargeId[],
): Promise<CardRechargeModel[]> {
  
  const card_recharge_models = await card_rechargeDao.findByIds(card_recharge_ids);
  
  return card_recharge_models;
}

/**
 * 根据搜索条件查找会员卡充值记录是否存在
 */
export async function exist(
  search?: CardRechargeSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_recharge_exist = await card_rechargeDao.exist(search);
  
  return card_recharge_exist;
}

/**
 * 根据 id 查找会员卡充值记录是否存在
 */
export async function existById(
  card_recharge_id?: CardRechargeId | null,
): Promise<boolean> {
  
  const card_recharge_exist = await card_rechargeDao.existById(card_recharge_id);
  
  return card_recharge_exist;
}

/**
 * 增加和修改时校验会员卡充值记录
 */
export async function validate(
  input: CardRechargeInput,
): Promise<void> {
  await card_rechargeDao.validate(input);
}

/**
 * 批量创建会员卡充值记录
 */
export async function creates(
  inputs: CardRechargeInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CardRechargeId[]> {
  const card_recharge_ids = await card_rechargeDao.creates(inputs, options);
  
  return card_recharge_ids;
}

/**
 * 根据 id 修改会员卡充值记录
 */
export async function updateById(
  card_recharge_id: CardRechargeId,
  input: CardRechargeInput,
): Promise<CardRechargeId> {
  
  const card_recharge_id2 = await card_rechargeDao.updateById(card_recharge_id, input);
  
  return card_recharge_id2;
}

/** 校验会员卡充值记录是否存在 */
export async function validateOption(
  model0?: CardRechargeModel,
): Promise<CardRechargeModel> {
  const card_recharge_model = await card_rechargeDao.validateOption(model0);
  return card_recharge_model;
}

/**
 * 根据 ids 删除会员卡充值记录
 */
export async function deleteByIds(
  card_recharge_ids: CardRechargeId[],
): Promise<number> {
  
  const card_recharge_num = await card_rechargeDao.deleteByIds(card_recharge_ids);
  return card_recharge_num;
}

/**
 * 根据 ids 还原会员卡充值记录
 */
export async function revertByIds(
  card_recharge_ids: CardRechargeId[],
): Promise<number> {
  
  const card_recharge_num = await card_rechargeDao.revertByIds(card_recharge_ids);
  
  return card_recharge_num;
}

/**
 * 根据 ids 彻底删除会员卡充值记录
 */
export async function forceDeleteByIds(
  card_recharge_ids: CardRechargeId[],
): Promise<number> {
  
  const card_recharge_num = await card_rechargeDao.forceDeleteByIds(card_recharge_ids);
  
  return card_recharge_num;
}

/**
 * 获取会员卡充值记录字段注释
 */
export async function getFieldComments(): Promise<CardRechargeFieldComment> {
  const card_recharge_fields = await card_rechargeDao.getFieldComments();
  return card_recharge_fields;
}
