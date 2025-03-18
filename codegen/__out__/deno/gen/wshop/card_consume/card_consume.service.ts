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

import * as card_consumeDao from "./card_consume.dao.ts";

async function setSearchQuery(
  search: CardConsumeSearch,
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
 * 根据条件查找会员卡消费记录总数
 */
export async function findCount(
  search?: CardConsumeSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_consume_num = await card_consumeDao.findCount(search);
  
  return card_consume_num;
}

/**
 * 根据搜索条件和分页查找会员卡消费记录列表
 */
export async function findAll(
  search?: CardConsumeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CardConsumeModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_consume_models = await card_consumeDao.findAll(search, page, sort);
  
  return card_consume_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: CardConsumeInput,
): Promise<void> {
  await card_consumeDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个会员卡消费记录
 */
export async function findOne(
  search?: CardConsumeSearch,
  sort?: SortInput[],
): Promise<CardConsumeModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_consume_model = await card_consumeDao.findOne(search, sort);
  
  return card_consume_model;
}

/**
 * 根据 id 查找会员卡消费记录
 */
export async function findById(
  card_consume_id?: CardConsumeId | null,
): Promise<CardConsumeModel | undefined> {
  
  const card_consume_model = await card_consumeDao.findById(card_consume_id);
  
  return card_consume_model;
}

/**
 * 根据 ids 查找会员卡消费记录
 */
export async function findByIds(
  card_consume_ids: CardConsumeId[],
): Promise<CardConsumeModel[]> {
  
  const card_consume_models = await card_consumeDao.findByIds(card_consume_ids);
  
  return card_consume_models;
}

/**
 * 根据搜索条件查找会员卡消费记录是否存在
 */
export async function exist(
  search?: CardConsumeSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_consume_exist = await card_consumeDao.exist(search);
  
  return card_consume_exist;
}

/**
 * 根据 id 查找会员卡消费记录是否存在
 */
export async function existById(
  card_consume_id?: CardConsumeId | null,
): Promise<boolean> {
  
  const card_consume_exist = await card_consumeDao.existById(card_consume_id);
  
  return card_consume_exist;
}

/**
 * 增加和修改时校验会员卡消费记录
 */
export async function validate(
  input: CardConsumeInput,
): Promise<void> {
  await card_consumeDao.validate(input);
}

/**
 * 批量创建会员卡消费记录
 */
export async function creates(
  inputs: CardConsumeInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CardConsumeId[]> {
  const card_consume_ids = await card_consumeDao.creates(inputs, options);
  
  return card_consume_ids;
}

/**
 * 根据 id 修改会员卡消费记录
 */
export async function updateById(
  card_consume_id: CardConsumeId,
  input: CardConsumeInput,
): Promise<CardConsumeId> {
  
  const card_consume_id2 = await card_consumeDao.updateById(card_consume_id, input);
  
  return card_consume_id2;
}

/** 校验会员卡消费记录是否存在 */
export async function validateOption(
  model0?: CardConsumeModel,
): Promise<CardConsumeModel> {
  const card_consume_model = await card_consumeDao.validateOption(model0);
  return card_consume_model;
}

/**
 * 根据 ids 删除会员卡消费记录
 */
export async function deleteByIds(
  card_consume_ids: CardConsumeId[],
): Promise<number> {
  
  const card_consume_num = await card_consumeDao.deleteByIds(card_consume_ids);
  return card_consume_num;
}

/**
 * 根据 ids 还原会员卡消费记录
 */
export async function revertByIds(
  card_consume_ids: CardConsumeId[],
): Promise<number> {
  
  const card_consume_num = await card_consumeDao.revertByIds(card_consume_ids);
  
  return card_consume_num;
}

/**
 * 根据 ids 彻底删除会员卡消费记录
 */
export async function forceDeleteByIds(
  card_consume_ids: CardConsumeId[],
): Promise<number> {
  
  const card_consume_num = await card_consumeDao.forceDeleteByIds(card_consume_ids);
  
  return card_consume_num;
}

/**
 * 获取会员卡消费记录字段注释
 */
export async function getFieldComments(): Promise<CardConsumeFieldComment> {
  const card_consume_fields = await card_consumeDao.getFieldComments();
  return card_consume_fields;
}
