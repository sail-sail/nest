import {
  ns,
} from "/src/base/i18n/i18n.ts";

import {
  type UniqueType,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type DictInput,
  type DictModel,
  type DictSearch,
} from "./dict.model.ts";

import * as dictDao from "./dict.dao.ts";

/**
 * 根据条件查找总数
 * @param {DictSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: DictSearch,
): Promise<number> {
  search = search || { };
  const data = await dictDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {DictSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<DictModel[]>} 
 */
export async function findAll(
  search?: DictSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<DictModel[]> {
  search = search || { };
  const data: DictModel[] = await dictDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {DictSearch} search? 搜索条件
 */
export async function findOne(
  search?: DictSearch,
  sort?: SortInput|SortInput[],
) {
  search = search || { };
  const data = await dictDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await dictDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {DictSearch} search? 搜索条件
 */
export async function exist(
  search?: DictSearch,
) {
  search = search || { };
  const data = await dictDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await dictDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {DictInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: DictInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const data = await dictDao.create(input, options);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {DictInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: DictInput,
): Promise<string> {
  
  const is_locked = await dictDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  // 不能修改系统记录的系统字段
  const model = await dictDao.findById(id);
  if (model && model.is_sys === 1) {
    input.code = undefined;
    input.type = undefined;
    input.is_enabled = undefined;
  }
  
  const data = await dictDao.updateById(id, input);
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
      const is_locked = await dictDao.getIsLockedById(id);
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
      const model = await dictDao.findById(id);
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
  
  const data = await dictDao.deleteByIds(ids);
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
  const data = await dictDao.enableByIds(ids, is_enabled);
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
  const data = await dictDao.lockByIds(ids, is_locked);
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
  const data = await dictDao.revertByIds(ids);
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
  const data = await dictDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const data = await dictDao.getFieldComments();
  return data;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await dictDao.findLastOrderBy();
  return data;
}
