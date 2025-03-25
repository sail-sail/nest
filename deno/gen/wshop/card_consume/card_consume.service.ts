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

import * as card_consumeDao from "./card_consume.dao.ts";

async function setSearchQuery(
  search: CardConsumeSearch,
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
 * 根据条件查找会员卡消费记录总数
 */
export async function findCountCardConsume(
  search?: CardConsumeSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_consume_num = await card_consumeDao.findCountCardConsume(search);
  
  return card_consume_num;
}

/**
 * 根据搜索条件和分页查找会员卡消费记录列表
 */
export async function findAllCardConsume(
  search?: CardConsumeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CardConsumeModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_consume_models = await card_consumeDao.findAllCardConsume(search, page, sort);
  
  return card_consume_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblCardConsume(
  input: CardConsumeInput,
): Promise<void> {
  await card_consumeDao.setIdByLblCardConsume(input);
}

/**
 * 根据条件查找第一个会员卡消费记录
 */
export async function findOneCardConsume(
  search?: CardConsumeSearch,
  sort?: SortInput[],
): Promise<CardConsumeModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_consume_model = await card_consumeDao.findOneCardConsume(search, sort);
  
  return card_consume_model;
}

/**
 * 根据 id 查找会员卡消费记录
 */
export async function findByIdCardConsume(
  card_consume_id?: CardConsumeId | null,
): Promise<CardConsumeModel | undefined> {
  
  const card_consume_model = await card_consumeDao.findByIdCardConsume(card_consume_id);
  
  return card_consume_model;
}

/**
 * 根据 ids 查找会员卡消费记录
 */
export async function findByIdsCardConsume(
  card_consume_ids: CardConsumeId[],
): Promise<CardConsumeModel[]> {
  
  const card_consume_models = await card_consumeDao.findByIdsCardConsume(card_consume_ids);
  
  return card_consume_models;
}

/**
 * 根据搜索条件查找会员卡消费记录是否存在
 */
export async function existCardConsume(
  search?: CardConsumeSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_consume_exist = await card_consumeDao.existCardConsume(search);
  
  return card_consume_exist;
}

/**
 * 根据 id 查找会员卡消费记录是否存在
 */
export async function existByIdCardConsume(
  card_consume_id?: CardConsumeId | null,
): Promise<boolean> {
  
  const card_consume_exist = await card_consumeDao.existByIdCardConsume(card_consume_id);
  
  return card_consume_exist;
}

/**
 * 增加和修改时校验会员卡消费记录
 */
export async function validateCardConsume(
  input: CardConsumeInput,
): Promise<void> {
  await card_consumeDao.validateCardConsume(input);
}

/**
 * 批量创建会员卡消费记录
 */
export async function createsCardConsume(
  inputs: CardConsumeInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CardConsumeId[]> {
  const card_consume_ids = await card_consumeDao.createsCardConsume(inputs, options);
  
  return card_consume_ids;
}

/**
 * 根据 id 修改会员卡消费记录
 */
export async function updateByIdCardConsume(
  card_consume_id: CardConsumeId,
  input: CardConsumeInput,
): Promise<CardConsumeId> {
  
  const card_consume_id2 = await card_consumeDao.updateByIdCardConsume(card_consume_id, input);
  
  return card_consume_id2;
}

/** 校验会员卡消费记录是否存在 */
export async function validateOptionCardConsume(
  model0?: CardConsumeModel,
): Promise<CardConsumeModel> {
  const card_consume_model = await card_consumeDao.validateOptionCardConsume(model0);
  return card_consume_model;
}

/**
 * 根据 ids 删除会员卡消费记录
 */
export async function deleteByIdsCardConsume(
  card_consume_ids: CardConsumeId[],
): Promise<number> {
  
  const card_consume_num = await card_consumeDao.deleteByIdsCardConsume(card_consume_ids);
  return card_consume_num;
}

/**
 * 根据 ids 还原会员卡消费记录
 */
export async function revertByIdsCardConsume(
  card_consume_ids: CardConsumeId[],
): Promise<number> {
  
  const card_consume_num = await card_consumeDao.revertByIdsCardConsume(card_consume_ids);
  
  return card_consume_num;
}

/**
 * 根据 ids 彻底删除会员卡消费记录
 */
export async function forceDeleteByIdsCardConsume(
  card_consume_ids: CardConsumeId[],
): Promise<number> {
  
  const card_consume_num = await card_consumeDao.forceDeleteByIdsCardConsume(card_consume_ids);
  
  return card_consume_num;
}

/**
 * 获取会员卡消费记录字段注释
 */
export async function getFieldCommentsCardConsume(): Promise<CardConsumeFieldComment> {
  const card_consume_fields = await card_consumeDao.getFieldCommentsCardConsume();
  return card_consume_fields;
}
