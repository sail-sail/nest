import {
  ns,
} from "/src/base/i18n/i18n.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  DictDetailInput,
  DictDetailModel,
  DictDetailSearch,
  DictDetailFieldComment,
} from "./dict_detail.model.ts";

import * as dict_detailDao from "./dict_detail.dao.ts";

/**
 * 根据条件查找总数
 * @param {DictDetailSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: DictDetailSearch,
): Promise<number> {
  search = search || { };
  const data = await dict_detailDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {DictDetailSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<DictDetailModel[]>} 
 */
export async function findAll(
  search?: DictDetailSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<DictDetailModel[]> {
  search = search || { };
  const data: DictDetailModel[] = await dict_detailDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {DictDetailSearch} search? 搜索条件
 */
export async function findOne(
  search?: DictDetailSearch,
  sort?: SortInput|SortInput[],
): Promise<DictDetailModel | undefined> {
  search = search || { };
  const data = await dict_detailDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
): Promise<DictDetailModel | undefined> {
  const data = await dict_detailDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {DictDetailSearch} search? 搜索条件
 */
export async function exist(
  search?: DictDetailSearch,
): Promise<boolean> {
  search = search || { };
  const data = await dict_detailDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
): Promise<boolean> {
  const data = await dict_detailDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: DictDetailInput,
): Promise<void> {
  const data = await dict_detailDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {DictDetailInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: DictDetailInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const data = await dict_detailDao.create(input, options);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {DictDetailInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: DictDetailInput,
): Promise<string> {
  
  const is_locked = await dict_detailDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  // 不能修改系统记录的系统字段
  const model = await dict_detailDao.findById(id);
  if (model && model.is_sys === 1) {
  }
  
  const data = await dict_detailDao.updateById(id, input);
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
      const is_locked = await dict_detailDao.getIsLockedById(id);
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
      const model = await dict_detailDao.findById(id);
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
  
  const data = await dict_detailDao.deleteByIds(ids);
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
  const data = await dict_detailDao.enableByIds(ids, is_enabled);
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
  const data = await dict_detailDao.lockByIds(ids, is_locked);
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
  const data = await dict_detailDao.revertByIds(ids);
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
  const data = await dict_detailDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<DictDetailFieldComment> {
  const data = await dict_detailDao.getFieldComments();
  return data;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await dict_detailDao.findLastOrderBy();
  return data;
}
