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

import * as cardDao from "./card.dao.ts";

async function setSearchQuery(
  search: CardSearch,
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
 * 根据条件查找会员卡总数
 */
export async function findCount(
  search?: CardSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_num = await cardDao.findCount(search);
  
  return card_num;
}

/**
 * 根据搜索条件和分页查找会员卡列表
 */
export async function findAll(
  search?: CardSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CardModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_models = await cardDao.findAll(search, page, sort);
  
  return card_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: CardInput,
): Promise<void> {
  await cardDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个会员卡
 */
export async function findOne(
  search?: CardSearch,
  sort?: SortInput[],
): Promise<CardModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_model = await cardDao.findOne(search, sort);
  
  return card_model;
}

/**
 * 根据 id 查找会员卡
 */
export async function findById(
  card_id?: CardId | null,
): Promise<CardModel | undefined> {
  
  const card_model = await cardDao.findById(card_id);
  
  return card_model;
}

/**
 * 根据 ids 查找会员卡
 */
export async function findByIds(
  card_ids: CardId[],
): Promise<CardModel[]> {
  
  const card_models = await cardDao.findByIds(card_ids);
  
  return card_models;
}

/**
 * 根据搜索条件查找会员卡是否存在
 */
export async function exist(
  search?: CardSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_exist = await cardDao.exist(search);
  
  return card_exist;
}

/**
 * 根据 id 查找会员卡是否存在
 */
export async function existById(
  card_id?: CardId | null,
): Promise<boolean> {
  
  const card_exist = await cardDao.existById(card_id);
  
  return card_exist;
}

/**
 * 增加和修改时校验会员卡
 */
export async function validate(
  input: CardInput,
): Promise<void> {
  await cardDao.validate(input);
}

/**
 * 批量创建会员卡
 */
export async function creates(
  inputs: CardInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CardId[]> {
  const card_ids = await cardDao.creates(inputs, options);
  
  return card_ids;
}

/**
 * 根据 id 修改会员卡
 */
export async function updateById(
  card_id: CardId,
  input: CardInput,
): Promise<CardId> {
  
  const is_locked = await cardDao.getIsLockedById(card_id);
  if (is_locked) {
    throw "不能修改已经锁定的 会员卡";
  }
  
  const card_id2 = await cardDao.updateById(card_id, input);
  
  return card_id2;
}

/** 校验会员卡是否存在 */
export async function validateOption(
  model0?: CardModel,
): Promise<CardModel> {
  const card_model = await cardDao.validateOption(model0);
  return card_model;
}

/**
 * 根据 ids 删除会员卡
 */
export async function deleteByIds(
  card_ids: CardId[],
): Promise<number> {
  
  const old_models = await cardDao.findByIds(card_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 会员卡";
    }
  }
  
  const card_num = await cardDao.deleteByIds(card_ids);
  return card_num;
}

/**
 * 根据 ids 启用或者禁用会员卡
 */
export async function enableByIds(
  ids: CardId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const card_num = await cardDao.enableByIds(ids, is_enabled);
  return card_num;
}

/**
 * 根据 ids 锁定或者解锁会员卡
 */
export async function lockByIds(
  card_ids: CardId[],
  is_locked: 0 | 1,
): Promise<number> {
  const card_num = await cardDao.lockByIds(card_ids, is_locked);
  return card_num;
}

/**
 * 根据 ids 还原会员卡
 */
export async function revertByIds(
  card_ids: CardId[],
): Promise<number> {
  
  const card_num = await cardDao.revertByIds(card_ids);
  
  return card_num;
}

/**
 * 根据 ids 彻底删除会员卡
 */
export async function forceDeleteByIds(
  card_ids: CardId[],
): Promise<number> {
  
  const card_num = await cardDao.forceDeleteByIds(card_ids);
  
  return card_num;
}

/**
 * 获取会员卡字段注释
 */
export async function getFieldComments(): Promise<CardFieldComment> {
  const card_fields = await cardDao.getFieldComments();
  return card_fields;
}
