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
  findByIdUsr,
  validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  isAdmin,
} from "/src/base/usr/usr.dao.ts";

import * as card_rechargeDao from "./card_recharge.dao.ts";

async function setSearchQuery(
  search: CardRechargeSearch,
) {
  
  const usr_id = await get_usr_id(false);
  const org_id = await get_org_id();
  const usr_model = await validateOptionUsr(
    await findByIdUsr(usr_id),
  );
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
export async function findCountCardRecharge(
  search?: CardRechargeSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_recharge_num = await card_rechargeDao.findCountCardRecharge(search);
  
  return card_recharge_num;
}

/**
 * 根据搜索条件和分页查找会员卡充值记录列表
 */
export async function findAllCardRecharge(
  search?: CardRechargeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CardRechargeModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_recharge_models = await card_rechargeDao.findAllCardRecharge(search, page, sort);
  
  return card_recharge_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblCardRecharge(
  input: CardRechargeInput,
): Promise<void> {
  await card_rechargeDao.setIdByLblCardRecharge(input);
}

/**
 * 根据条件查找第一个会员卡充值记录
 */
export async function findOneCardRecharge(
  search?: CardRechargeSearch,
  sort?: SortInput[],
): Promise<CardRechargeModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_recharge_model = await card_rechargeDao.findOneCardRecharge(search, sort);
  
  return card_recharge_model;
}

/**
 * 根据条件查找第一个会员卡充值记录, 如果不存在则抛错
 */
export async function findOneOkCardRecharge(
  search?: CardRechargeSearch,
  sort?: SortInput[],
): Promise<CardRechargeModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_recharge_model = await card_rechargeDao.findOneOkCardRecharge(search, sort);
  
  return card_recharge_model;
}

/**
 * 根据 id 查找会员卡充值记录
 */
export async function findByIdCardRecharge(
  card_recharge_id: CardRechargeId,
): Promise<CardRechargeModel | undefined> {
  
  const card_recharge_model = await card_rechargeDao.findByIdCardRecharge(card_recharge_id);
  
  return card_recharge_model;
}

/**
 * 根据 id 查找会员卡充值记录, 如果不存在则抛错
 */
export async function findByIdOkCardRecharge(
  card_recharge_id: CardRechargeId,
): Promise<CardRechargeModel> {
  
  const card_recharge_model = await card_rechargeDao.findByIdOkCardRecharge(card_recharge_id);
  
  return card_recharge_model;
}

/**
 * 根据 ids 查找会员卡充值记录
 */
export async function findByIdsCardRecharge(
  card_recharge_ids: CardRechargeId[],
): Promise<CardRechargeModel[]> {
  
  const card_recharge_models = await card_rechargeDao.findByIdsCardRecharge(card_recharge_ids);
  
  return card_recharge_models;
}

/**
 * 根据 ids 查找会员卡充值记录, 出现查询不到的 id 则报错
 */
export async function findByIdsOkCardRecharge(
  card_recharge_ids: CardRechargeId[],
): Promise<CardRechargeModel[]> {
  
  const card_recharge_models = await card_rechargeDao.findByIdsOkCardRecharge(card_recharge_ids);
  
  return card_recharge_models;
}

/**
 * 根据搜索条件查找会员卡充值记录是否存在
 */
export async function existCardRecharge(
  search?: CardRechargeSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_recharge_exist = await card_rechargeDao.existCardRecharge(search);
  
  return card_recharge_exist;
}

/**
 * 根据 id 查找会员卡充值记录是否存在
 */
export async function existByIdCardRecharge(
  card_recharge_id?: CardRechargeId | null,
): Promise<boolean> {
  
  const card_recharge_exist = await card_rechargeDao.existByIdCardRecharge(card_recharge_id);
  
  return card_recharge_exist;
}

/**
 * 增加和修改时校验会员卡充值记录
 */
export async function validateCardRecharge(
  input: CardRechargeInput,
): Promise<void> {
  await card_rechargeDao.validateCardRecharge(input);
}

/**
 * 批量创建会员卡充值记录
 */
export async function createsCardRecharge(
  inputs: CardRechargeInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CardRechargeId[]> {
  const card_recharge_ids = await card_rechargeDao.createsCardRecharge(inputs, options);
  
  return card_recharge_ids;
}

/**
 * 根据 id 修改会员卡充值记录
 */
export async function updateByIdCardRecharge(
  card_recharge_id: CardRechargeId,
  input: CardRechargeInput,
): Promise<CardRechargeId> {
  
  const card_recharge_id2 = await card_rechargeDao.updateByIdCardRecharge(card_recharge_id, input);
  
  return card_recharge_id2;
}

/** 校验会员卡充值记录是否存在 */
export async function validateOptionCardRecharge(
  model0?: CardRechargeModel,
): Promise<CardRechargeModel> {
  const card_recharge_model = await card_rechargeDao.validateOptionCardRecharge(model0);
  return card_recharge_model;
}

/**
 * 根据 ids 删除会员卡充值记录
 */
export async function deleteByIdsCardRecharge(
  card_recharge_ids: CardRechargeId[],
): Promise<number> {
  
  const card_recharge_num = await card_rechargeDao.deleteByIdsCardRecharge(card_recharge_ids);
  return card_recharge_num;
}

/**
 * 根据 ids 还原会员卡充值记录
 */
export async function revertByIdsCardRecharge(
  card_recharge_ids: CardRechargeId[],
): Promise<number> {
  
  const card_recharge_num = await card_rechargeDao.revertByIdsCardRecharge(card_recharge_ids);
  
  return card_recharge_num;
}

/**
 * 根据 ids 彻底删除会员卡充值记录
 */
export async function forceDeleteByIdsCardRecharge(
  card_recharge_ids: CardRechargeId[],
): Promise<number> {
  
  const card_recharge_num = await card_rechargeDao.forceDeleteByIdsCardRecharge(card_recharge_ids);
  
  return card_recharge_num;
}

/**
 * 获取会员卡充值记录字段注释
 */
export async function getFieldCommentsCardRecharge(): Promise<CardRechargeFieldComment> {
  const card_recharge_fields = await card_rechargeDao.getFieldCommentsCardRecharge();
  return card_recharge_fields;
}
