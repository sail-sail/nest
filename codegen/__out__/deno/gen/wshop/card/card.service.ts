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
  const username = usr_model.username;
  
  if (username !== "admin") {
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
  
  const data = await cardDao.findCount(search);
  return data;
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
  
  const models: CardModel[] = await cardDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: CardInput,
) {
  const data = await cardDao.setIdByLbl(input);
  return data;
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
  
  const model = await cardDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找会员卡
 */
export async function findById(
  id?: CardId | null,
): Promise<CardModel | undefined> {
  const model = await cardDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找会员卡是否存在
 */
export async function exist(
  search?: CardSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await cardDao.exist(search);
  return data;
}

/**
 * 根据 id 查找会员卡是否存在
 */
export async function existById(
  id?: CardId | null,
): Promise<boolean> {
  const data = await cardDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验会员卡
 */
export async function validate(
  input: CardInput,
): Promise<void> {
  const data = await cardDao.validate(input);
  return data;
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
  const ids = await cardDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改会员卡
 */
export async function updateById(
  id: CardId,
  input: CardInput,
): Promise<CardId> {
  
  const is_locked = await cardDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 会员卡";
  }
  
  const id2 = await cardDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除会员卡
 */
export async function deleteByIds(
  ids: CardId[],
): Promise<number> {
  
  {
    const models = await cardDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 会员卡";
      }
    }
  }
  
  const data = await cardDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用会员卡
 */
export async function enableByIds(
  ids: CardId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await cardDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁会员卡
 */
export async function lockByIds(
  ids: CardId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await cardDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原会员卡
 */
export async function revertByIds(
  ids: CardId[],
): Promise<number> {
  const data = await cardDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除会员卡
 */
export async function forceDeleteByIds(
  ids: CardId[],
): Promise<number> {
  const data = await cardDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取会员卡字段注释
 */
export async function getFieldComments(): Promise<CardFieldComment> {
  const data = await cardDao.getFieldComments();
  return data;
}
