import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as pt_typeDao from "./pt_type.dao.ts";

/**
 * 根据条件查找产品类别总数
 * @param {PtTypeSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: PtTypeSearch,
): Promise<number> {
  search = search || { };
  const data = await pt_typeDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找产品类别列表
 * @param {PtTypeSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<PtTypeModel[]>} 
 */
export async function findAll(
  search?: PtTypeSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<PtTypeModel[]> {
  search = search || { };
  const models: PtTypeModel[] = await pt_typeDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: PtTypeInput,
) {
  const data = await pt_typeDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个产品类别
 * @param {PtTypeSearch} search? 搜索条件
 */
export async function findOne(
  search?: PtTypeSearch,
  sort?: SortInput|SortInput[],
): Promise<PtTypeModel | undefined> {
  search = search || { };
  const model = await pt_typeDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找产品类别
 * @param {PtTypeId} id
 */
export async function findById(
  id?: PtTypeId | null,
): Promise<PtTypeModel | undefined> {
  const model = await pt_typeDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找产品类别是否存在
 * @param {PtTypeSearch} search? 搜索条件
 */
export async function exist(
  search?: PtTypeSearch,
): Promise<boolean> {
  search = search || { };
  const data = await pt_typeDao.exist(search);
  return data;
}

/**
 * 根据 id 查找产品类别是否存在
 * @param {PtTypeId} id
 */
export async function existById(
  id?: PtTypeId | null,
): Promise<boolean> {
  const data = await pt_typeDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验产品类别
 * @param input 
 */
export async function validate(
  input: PtTypeInput,
): Promise<void> {
  const data = await pt_typeDao.validate(input);
  return data;
}

/**
 * 批量创建产品类别
 * @param {PtTypeInput[]} inputs
 * @return {Promise<PtTypeId[]>} ids
 */
export async function creates(
  inputs: PtTypeInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<PtTypeId[]> {
  const ids = await pt_typeDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改产品类别
 * @param {PtTypeId} id
 * @param {PtTypeInput} input
 * @return {Promise<PtTypeId>}
 */
export async function updateById(
  id: PtTypeId,
  input: PtTypeInput,
): Promise<PtTypeId> {
  
  const is_locked = await pt_typeDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2: PtTypeId = await pt_typeDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除产品类别
 * @param {PtTypeId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: PtTypeId[],
): Promise<number> {
  
  {
    const models = await pt_typeDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw await ns("不能删除已经锁定的 {0}", "产品类别");
      }
    }
  }
  
  const data = await pt_typeDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用产品类别
 * @param {PtTypeId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: PtTypeId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await pt_typeDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁产品类别
 * @param {PtTypeId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: PtTypeId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await pt_typeDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原产品类别
 * @param {PtTypeId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: PtTypeId[],
): Promise<number> {
  const data = await pt_typeDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除产品类别
 * @param {PtTypeId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: PtTypeId[],
): Promise<number> {
  const data = await pt_typeDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取产品类别字段注释
 */
export async function getFieldComments(): Promise<PtTypeFieldComment> {
  const data = await pt_typeDao.getFieldComments();
  return data;
}

/**
 * 查找 产品类别 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await pt_typeDao.findLastOrderBy();
  return data;
}
