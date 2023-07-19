import {
  ns,
} from "/src/base/i18n/i18n.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type OptionsInput,
  type OptionsModel,
  type OptionsSearch,
} from "./options.model.ts";

import * as optionsDao from "./options.dao.ts";

/**
 * 根据条件查找总数
 * @param {OptionsSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: OptionsSearch,
): Promise<number> {
  search = search || { };
  const data = await optionsDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {OptionsSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<OptionsModel[]>} 
 */
export async function findAll(
  search?: OptionsSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<OptionsModel[]> {
  search = search || { };
  const data: OptionsModel[] = await optionsDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {OptionsSearch} search? 搜索条件
 */
export async function findOne(
  search?: OptionsSearch,
  sort?: SortInput|SortInput[],
) {
  search = search || { };
  const data = await optionsDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await optionsDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {OptionsSearch} search? 搜索条件
 */
export async function exist(
  search?: OptionsSearch,
) {
  search = search || { };
  const data = await optionsDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await optionsDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {OptionsInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: OptionsInput,
): Promise<string> {
  const data = await optionsDao.create(input);
  return data;
}

/**
 * 根据 id 获取版本号
 */
export async function getVersionById(id: string) {
  const version = await optionsDao.getVersionById(id);
  return version;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {OptionsInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: OptionsInput,
): Promise<string> {
  
  const is_locked = await optionsDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  // 不能修改系统记录的系统字段
  const model = await optionsDao.findById(id);
  if (model && model.is_sys === 1) {
  }
  
  const data = await optionsDao.updateById(id, input);
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
  
  const lockedIds: string[] = [ ];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const is_locked = await optionsDao.getIsLockedById(id);
    if (is_locked) {
      lockedIds.push(id);
    }
  }
  if (lockedIds.length > 0 && lockedIds.length === ids.length) {
    throw await ns("不能删除已经锁定的数据");
  }
  
  const ids2: string[] = [ ];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    
    // 不能修改系统记录的系统字段
    const model = await optionsDao.findById(id);
    if (model && model.is_sys === 1) {
      continue;
    }
    
    ids2.push(id);
  }
  
  if (ids2.length === 0 && ids.length > 0) {
    throw await ns("不能删除系统记录");
  }
  ids = ids2;
  
  const data = await optionsDao.deleteByIds(ids);
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
  const data = await optionsDao.enableByIds(ids, is_enabled);
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
  const data = await optionsDao.lockByIds(ids, is_locked);
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
  const data = await optionsDao.revertByIds(ids);
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
  const data = await optionsDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const data = await optionsDao.getFieldComments();
  return data;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await optionsDao.findLastOrderBy();
  return data;
}
