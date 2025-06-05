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

import * as cardDao from "./card.dao.ts";

async function setSearchQuery(
  search: CardSearch,
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
 * 根据条件查找会员卡总数
 */
export async function findCountCard(
  search?: CardSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_num = await cardDao.findCountCard(search);
  
  return card_num;
}

/**
 * 根据搜索条件和分页查找会员卡列表
 */
export async function findAllCard(
  search?: CardSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CardModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_models = await cardDao.findAllCard(search, page, sort);
  
  return card_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblCard(
  input: CardInput,
): Promise<void> {
  await cardDao.setIdByLblCard(input);
}

/**
 * 根据条件查找第一个会员卡
 */
export async function findOneCard(
  search?: CardSearch,
  sort?: SortInput[],
): Promise<CardModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_model = await cardDao.findOneCard(search, sort);
  
  return card_model;
}

/**
 * 根据条件查找第一个会员卡, 如果不存在则抛错
 */
export async function findOneOkCard(
  search?: CardSearch,
  sort?: SortInput[],
): Promise<CardModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_model = await cardDao.findOneOkCard(search, sort);
  
  return card_model;
}

/**
 * 根据 id 查找会员卡
 */
export async function findByIdCard(
  card_id: CardId,
): Promise<CardModel | undefined> {
  
  const card_model = await cardDao.findByIdCard(card_id);
  
  return card_model;
}

/**
 * 根据 id 查找会员卡, 如果不存在则抛错
 */
export async function findByIdOkCard(
  card_id: CardId,
): Promise<CardModel> {
  
  const card_model = await cardDao.findByIdOkCard(card_id);
  
  return card_model;
}

/**
 * 根据 ids 查找会员卡
 */
export async function findByIdsCard(
  card_ids: CardId[],
): Promise<CardModel[]> {
  
  const card_models = await cardDao.findByIdsCard(card_ids);
  
  return card_models;
}

/**
 * 根据 ids 查找会员卡, 出现查询不到的 id 则报错
 */
export async function findByIdsOkCard(
  card_ids: CardId[],
): Promise<CardModel[]> {
  
  const card_models = await cardDao.findByIdsOkCard(card_ids);
  
  return card_models;
}

/**
 * 根据搜索条件查找会员卡是否存在
 */
export async function existCard(
  search?: CardSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const card_exist = await cardDao.existCard(search);
  
  return card_exist;
}

/**
 * 根据 id 查找会员卡是否存在
 */
export async function existByIdCard(
  card_id?: CardId | null,
): Promise<boolean> {
  
  const card_exist = await cardDao.existByIdCard(card_id);
  
  return card_exist;
}

/**
 * 增加和修改时校验会员卡
 */
export async function validateCard(
  input: CardInput,
): Promise<void> {
  await cardDao.validateCard(input);
}

/**
 * 批量创建会员卡
 */
export async function createsCard(
  inputs: CardInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CardId[]> {
  const card_ids = await cardDao.createsCard(inputs, options);
  
  return card_ids;
}

/**
 * 根据 id 修改会员卡
 */
export async function updateByIdCard(
  card_id: CardId,
  input: CardInput,
): Promise<CardId> {
  
  const is_locked = await cardDao.getIsLockedByIdCard(card_id);
  if (is_locked) {
    throw "不能修改已经锁定的 会员卡";
  }
  
  const card_id2 = await cardDao.updateByIdCard(card_id, input);
  
  return card_id2;
}

/** 校验会员卡是否存在 */
export async function validateOptionCard(
  model0?: CardModel,
): Promise<CardModel> {
  const card_model = await cardDao.validateOptionCard(model0);
  return card_model;
}

/**
 * 根据 ids 删除会员卡
 */
export async function deleteByIdsCard(
  card_ids: CardId[],
): Promise<number> {
  
  const old_models = await cardDao.findByIdsCard(card_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 会员卡";
    }
  }
  
  const card_num = await cardDao.deleteByIdsCard(card_ids);
  return card_num;
}

/**
 * 根据 ids 启用或者禁用会员卡
 */
export async function enableByIdsCard(
  ids: CardId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const card_num = await cardDao.enableByIdsCard(ids, is_enabled);
  return card_num;
}

/**
 * 根据 ids 锁定或者解锁会员卡
 */
export async function lockByIdsCard(
  card_ids: CardId[],
  is_locked: 0 | 1,
): Promise<number> {
  const card_num = await cardDao.lockByIdsCard(card_ids, is_locked);
  return card_num;
}

/**
 * 根据 ids 还原会员卡
 */
export async function revertByIdsCard(
  card_ids: CardId[],
): Promise<number> {
  
  const card_num = await cardDao.revertByIdsCard(card_ids);
  
  return card_num;
}

/**
 * 根据 ids 彻底删除会员卡
 */
export async function forceDeleteByIdsCard(
  card_ids: CardId[],
): Promise<number> {
  
  const card_num = await cardDao.forceDeleteByIdsCard(card_ids);
  
  return card_num;
}

/**
 * 获取会员卡字段注释
 */
export async function getFieldCommentsCard(): Promise<CardFieldComment> {
  const card_fields = await cardDao.getFieldCommentsCard();
  return card_fields;
}
