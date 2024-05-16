import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as ptDao from "./pt.dao.ts";

/**
 * 根据条件查找产品总数
 * @param {PtSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: PtSearch,
): Promise<number> {
  search = search || { };
  const data = await ptDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找产品列表
 * @param {PtSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<PtModel[]>} 
 */
export async function findAll(
  search?: PtSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<PtModel[]> {
  search = search || { };
  const models: PtModel[] = await ptDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: PtInput,
) {
  const data = await ptDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个产品
 * @param {PtSearch} search? 搜索条件
 */
export async function findOne(
  search?: PtSearch,
  sort?: SortInput|SortInput[],
): Promise<PtModel | undefined> {
  search = search || { };
  const model = await ptDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找产品
 * @param {PtId} id
 */
export async function findById(
  id?: PtId | null,
): Promise<PtModel | undefined> {
  const model = await ptDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找产品是否存在
 * @param {PtSearch} search? 搜索条件
 */
export async function exist(
  search?: PtSearch,
): Promise<boolean> {
  search = search || { };
  const data = await ptDao.exist(search);
  return data;
}

/**
 * 根据 id 查找产品是否存在
 * @param {PtId} id
 */
export async function existById(
  id?: PtId | null,
): Promise<boolean> {
  const data = await ptDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验产品
 * @param input 
 */
export async function validate(
  input: PtInput,
): Promise<void> {
  const data = await ptDao.validate(input);
  return data;
}

/**
 * 批量创建产品
 * @param {PtInput[]} inputs
 * @return {Promise<PtId[]>} ids
 */
export async function creates(
  inputs: PtInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<PtId[]> {
  const ids = await ptDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改产品
 * @param {PtId} id
 * @param {PtInput} input
 * @return {Promise<PtId>}
 */
export async function updateById(
  id: PtId,
  input: PtInput,
): Promise<PtId> {
  
  const is_locked = await ptDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2 = await ptDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除产品
 * @param {PtId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: PtId[],
): Promise<number> {
  
  {
    const models = await ptDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw await ns("不能删除已经锁定的 {0}", "产品");
      }
    }
  }
  
  const data = await ptDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用产品
 * @param {PtId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: PtId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await ptDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁产品
 * @param {PtId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: PtId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await ptDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原产品
 * @param {PtId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: PtId[],
): Promise<number> {
  const data = await ptDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除产品
 * @param {PtId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: PtId[],
): Promise<number> {
  const data = await ptDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取产品字段注释
 */
export async function getFieldComments(): Promise<PtFieldComment> {
  const data = await ptDao.getFieldComments();
  return data;
}

/**
 * 查找 产品 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await ptDao.findLastOrderBy();
  return data;
}
