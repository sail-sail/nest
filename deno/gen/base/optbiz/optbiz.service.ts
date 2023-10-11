import {
  ns,
} from "/src/base/i18n/i18n.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  OptbizInput,
  OptbizModel,
  OptbizSearch,
  OptbizFieldComment,
} from "./optbiz.model.ts";

import * as optbizDao from "./optbiz.dao.ts";

/**
 * 根据条件查找总数
 * @param {OptbizSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: OptbizSearch,
): Promise<number> {
  search = search || { };
  const data = await optbizDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
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
 * 根据条件查找第一条数据
 * @param {OptbizSearch} search? 搜索条件
 */
export async function findOne(
  search?: OptbizSearch,
  sort?: SortInput|SortInput[],
): Promise<OptbizModel | undefined> {
  search = search || { };
  const model = await optbizDao.findOne(search, sort);
  return model;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
): Promise<OptbizModel | undefined> {
  const model = await optbizDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {OptbizSearch} search? 搜索条件
 */
export async function exist(
  search?: OptbizSearch,
): Promise<boolean> {
  search = search || { };
  const data = await optbizDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
): Promise<boolean> {
  const data = await optbizDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: OptbizInput,
): Promise<void> {
  const data = await optbizDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {OptbizInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: OptbizInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const data = await optbizDao.create(input, options);
  return data;
}

/**
 * 根据 id 获取版本号
 */
export async function getVersionById(id: string) {
  const version = await optbizDao.getVersionById(id);
  return version;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {OptbizInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: OptbizInput,
): Promise<string> {
  
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
  
  const data = await optbizDao.updateById(id, input);
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
      const is_locked = await optbizDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  {
    const ids2: string[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const model = await optbizDao.findById(id);
      if (model && model.is_sys === 1) {
        continue;
      }
      ids2.push(id);
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除系统记录");
    }
    ids = ids2;
  }
  
  const data = await optbizDao.deleteByIds(ids);
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
  const data = await optbizDao.enableByIds(ids, is_enabled);
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
  const data = await optbizDao.lockByIds(ids, is_locked);
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
  const data = await optbizDao.revertByIds(ids);
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
  const data = await optbizDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<OptbizFieldComment> {
  const data = await optbizDao.getFieldComments();
  return data;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await optbizDao.findLastOrderBy();
  return data;
}
