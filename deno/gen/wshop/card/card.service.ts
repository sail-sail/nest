import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as cardDao from "./card.dao.ts";

import {
  updateSeqLbl,
} from "/src/wshop/card/card.dao.ts";

/**
 * 根据条件查找会员卡总数
 * @param {CardSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: CardSearch,
): Promise<number> {
  search = search || { };
  const data = await cardDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找会员卡列表
 * @param {CardSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<CardModel[]>} 
 */
export async function findAll(
  search?: CardSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<CardModel[]> {
  search = search || { };
  const models: CardModel[] = await cardDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: CardInput,
) {
  const data = await cardDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个会员卡
 * @param {CardSearch} search? 搜索条件
 */
export async function findOne(
  search?: CardSearch,
  sort?: SortInput|SortInput[],
): Promise<CardModel | undefined> {
  search = search || { };
  const model = await cardDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找会员卡
 * @param {CardId} id
 */
export async function findById(
  id?: CardId | null,
): Promise<CardModel | undefined> {
  const model = await cardDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找会员卡是否存在
 * @param {CardSearch} search? 搜索条件
 */
export async function exist(
  search?: CardSearch,
): Promise<boolean> {
  search = search || { };
  const data = await cardDao.exist(search);
  return data;
}

/**
 * 根据 id 查找会员卡是否存在
 * @param {CardId} id
 */
export async function existById(
  id?: CardId | null,
): Promise<boolean> {
  const data = await cardDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验会员卡
 * @param input 
 */
export async function validate(
  input: CardInput,
): Promise<void> {
  const data = await cardDao.validate(input);
  return data;
}

/**
 * 批量创建会员卡
 * @param {CardInput[]} inputs
 * @return {Promise<CardId[]>} ids
 */
export async function creates(
  inputs: CardInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CardId[]> {
  const ids = await cardDao.creates(inputs, options);
  for (const id of ids) {
    await updateSeqLbl(id);
  }
  return ids;
}

/**
 * 根据 id 修改会员卡
 * @param {CardId} id
 * @param {CardInput} input
 * @return {Promise<CardId>}
 */
export async function updateById(
  id: CardId,
  input: CardInput,
): Promise<CardId> {
  
  const is_locked = await cardDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2 = await cardDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除会员卡
 * @param {CardId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: CardId[],
): Promise<number> {
  
  {
    const ids2: CardId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: CardId = ids[i];
      const is_locked = await cardDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  const data = await cardDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用会员卡
 * @param {CardId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
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
 * @param {CardId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
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
 * @param {CardId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: CardId[],
): Promise<number> {
  const data = await cardDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除会员卡
 * @param {CardId[]} ids
 * @return {Promise<number>}
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
