import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as optbizDao from "./optbiz.dao.ts";

async function setSearchQuery(
  search: OptbizSearch,
) {
  
}

/**
 * 根据条件查找业务选项总数
 * @param {OptbizSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: OptbizSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await optbizDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找业务选项列表
 * @param {OptbizSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<OptbizModel[]>} 
 */
export async function findAll(
  search?: OptbizSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<OptbizModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: OptbizModel[] = await optbizDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: OptbizInput,
) {
  const data = await optbizDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个业务选项
 * @param {OptbizSearch} search? 搜索条件
 */
export async function findOne(
  search?: OptbizSearch,
  sort?: SortInput|SortInput[],
): Promise<OptbizModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await optbizDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找业务选项
 * @param {OptbizId} id
 */
export async function findById(
  id?: OptbizId | null,
): Promise<OptbizModel | undefined> {
  const model = await optbizDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找业务选项是否存在
 * @param {OptbizSearch} search? 搜索条件
 */
export async function exist(
  search?: OptbizSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await optbizDao.exist(search);
  return data;
}

/**
 * 根据 id 查找业务选项是否存在
 * @param {OptbizId} id
 */
export async function existById(
  id?: OptbizId | null,
): Promise<boolean> {
  const data = await optbizDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验业务选项
 * @param input 
 */
export async function validate(
  input: OptbizInput,
): Promise<void> {
  const data = await optbizDao.validate(input);
  return data;
}

/**
 * 批量创建业务选项
 * @param {OptbizInput[]} inputs
 * @return {Promise<OptbizId[]>} ids
 */
export async function creates(
  inputs: OptbizInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<OptbizId[]> {
  const ids = await optbizDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 获取业务选项版本号
 */
export async function getVersionById(id: OptbizId) {
  const version = await optbizDao.getVersionById(id);
  return version;
}

/**
 * 根据 id 修改业务选项
 * @param {OptbizId} id
 * @param {OptbizInput} input
 * @return {Promise<OptbizId>}
 */
export async function updateById(
  id: OptbizId,
  input: OptbizInput,
): Promise<OptbizId> {
  
  const is_locked = await optbizDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  // 不能修改系统记录的系统字段
  const model = await optbizDao.findById(id);
  if (model && model.is_sys === 1) {
    // 名称
    input.lbl = undefined;
    // 键
    input.ky = undefined;
  }
  
  const id2 = await optbizDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除业务选项
 * @param {OptbizId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: OptbizId[],
): Promise<number> {
  
  {
    const models = await optbizDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw await ns("不能删除已经锁定的 {0}", "业务选项");
      }
    }
  }
  
  {
    const models = await optbizDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw await ns("不能删除系统记录");
      }
    }
  }
  
  const data = await optbizDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用业务选项
 * @param {OptbizId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: OptbizId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await optbizDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁业务选项
 * @param {OptbizId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: OptbizId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await optbizDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原业务选项
 * @param {OptbizId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: OptbizId[],
): Promise<number> {
  const data = await optbizDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除业务选项
 * @param {OptbizId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: OptbizId[],
): Promise<number> {
  const data = await optbizDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取业务选项字段注释
 */
export async function getFieldComments(): Promise<OptbizFieldComment> {
  const data = await optbizDao.getFieldComments();
  return data;
}

/**
 * 查找 业务选项 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await optbizDao.findLastOrderBy();
  return data;
}
