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
  const username = usr_model.username;
  
  if (username !== "admin") {
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
  
  const data = await card_rechargeDao.findCount(search);
  return data;
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
  
  const models: CardRechargeModel[] = await card_rechargeDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: CardRechargeInput,
) {
  const data = await card_rechargeDao.setIdByLbl(input);
  return data;
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
  
  const model = await card_rechargeDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找会员卡充值记录
 */
export async function findById(
  id?: CardRechargeId | null,
): Promise<CardRechargeModel | undefined> {
  const model = await card_rechargeDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找会员卡充值记录是否存在
 */
export async function exist(
  search?: CardRechargeSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await card_rechargeDao.exist(search);
  return data;
}

/**
 * 根据 id 查找会员卡充值记录是否存在
 */
export async function existById(
  id?: CardRechargeId | null,
): Promise<boolean> {
  const data = await card_rechargeDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验会员卡充值记录
 */
export async function validate(
  input: CardRechargeInput,
): Promise<void> {
  const data = await card_rechargeDao.validate(input);
  return data;
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
  const ids = await card_rechargeDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改会员卡充值记录
 */
export async function updateById(
  id: CardRechargeId,
  input: CardRechargeInput,
): Promise<CardRechargeId> {
  
  const id2 = await card_rechargeDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除会员卡充值记录
 */
export async function deleteByIds(
  ids: CardRechargeId[],
): Promise<number> {
  
  const data = await card_rechargeDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原会员卡充值记录
 */
export async function revertByIds(
  ids: CardRechargeId[],
): Promise<number> {
  const data = await card_rechargeDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除会员卡充值记录
 */
export async function forceDeleteByIds(
  ids: CardRechargeId[],
): Promise<number> {
  const data = await card_rechargeDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取会员卡充值记录字段注释
 */
export async function getFieldComments(): Promise<CardRechargeFieldComment> {
  const data = await card_rechargeDao.getFieldComments();
  return data;
}
