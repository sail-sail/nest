import {
  ns,
} from "/src/base/i18n/i18n.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  CardInput,
  CardModel,
  CardSearch,
  CardFieldComment,
} from "./card.model.ts";

import * as cardDao from "./card.dao.ts";

/**
 * 根据条件查找总数
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
 * 根据条件和分页查找数据
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
 * 根据条件查找第一条数据
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
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
): Promise<CardModel | undefined> {
  const model = await cardDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
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
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
): Promise<boolean> {
  const data = await cardDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: CardInput,
): Promise<void> {
  const data = await cardDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {CardInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: CardInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const data = await cardDao.create(input, options);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {CardInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: CardInput,
): Promise<string> {
  
  const is_locked = await cardDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const data = await cardDao.updateById(id, input);
  return data;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
): Promise<number> {
  
  {
    const ids2: string[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
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
 * 根据 ids 启用或禁用数据
 * @param {string} id
 * @return {Promise<number>}
 */
export async function defaultById(
  id: string,
): Promise<number> {
  const data = await cardDao.defaultById(id);
  return data;
}

/**
 * 根据 ids 启用或禁用数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: string[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await cardDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或解锁数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await cardDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
): Promise<number> {
  const data = await cardDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: string[],
): Promise<number> {
  const data = await cardDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<CardFieldComment> {
  const data = await cardDao.getFieldComments();
  return data;
}
