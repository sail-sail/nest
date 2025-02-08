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
  const username = usr_model.username;
  
  if (username !== "admin") {
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
  
  const data = await card_consumeDao.findCount(search);
  return data;
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
  
  const models: CardConsumeModel[] = await card_consumeDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: CardConsumeInput,
) {
  const data = await card_consumeDao.setIdByLbl(input);
  return data;
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
  
  const model = await card_consumeDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找会员卡消费记录
 */
export async function findById(
  id?: CardConsumeId | null,
): Promise<CardConsumeModel | undefined> {
  const model = await card_consumeDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找会员卡消费记录是否存在
 */
export async function exist(
  search?: CardConsumeSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await card_consumeDao.exist(search);
  return data;
}

/**
 * 根据 id 查找会员卡消费记录是否存在
 */
export async function existById(
  id?: CardConsumeId | null,
): Promise<boolean> {
  const data = await card_consumeDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验会员卡消费记录
 */
export async function validate(
  input: CardConsumeInput,
): Promise<void> {
  const data = await card_consumeDao.validate(input);
  return data;
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
  const ids = await card_consumeDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改会员卡消费记录
 */
export async function updateById(
  id: CardConsumeId,
  input: CardConsumeInput,
): Promise<CardConsumeId> {
  
  const id2 = await card_consumeDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除会员卡消费记录
 */
export async function deleteByIds(
  ids: CardConsumeId[],
): Promise<number> {
  
  const data = await card_consumeDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原会员卡消费记录
 */
export async function revertByIds(
  ids: CardConsumeId[],
): Promise<number> {
  const data = await card_consumeDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除会员卡消费记录
 */
export async function forceDeleteByIds(
  ids: CardConsumeId[],
): Promise<number> {
  const data = await card_consumeDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取会员卡消费记录字段注释
 */
export async function getFieldComments(): Promise<CardConsumeFieldComment> {
  const data = await card_consumeDao.getFieldComments();
  return data;
}
