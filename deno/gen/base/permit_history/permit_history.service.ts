

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type PermitHistoryInput,
  type PermitHistoryModel,
  type PermitHistorySearch,
} from "./permit_history.model.ts";

import * as permit_historyDao from "./permit_history.dao.ts";

/**
 * 根据条件查找总数
 * @param {PermitHistorySearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: PermitHistorySearch,
): Promise<number> {
  search = search || { };
  const data = await permit_historyDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {PermitHistorySearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<PermitHistoryModel[]>} 
 */
export async function findAll(
  search?: PermitHistorySearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<PermitHistoryModel[]> {
  search = search || { };
  const data: PermitHistoryModel[] = await permit_historyDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {PermitHistorySearch} search? 搜索条件
 */
export async function findOne(
  search?: PermitHistorySearch,
  sort?: SortInput|SortInput[],
) {
  search = search || { };
  const data = await permit_historyDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await permit_historyDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {PermitHistorySearch} search? 搜索条件
 */
export async function exist(
  search?: PermitHistorySearch,
) {
  search = search || { };
  const data = await permit_historyDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await permit_historyDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {PermitHistoryInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: PermitHistoryInput,
): Promise<string> {
  const data = await permit_historyDao.create(input);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {PermitHistoryInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: PermitHistoryInput,
): Promise<string> {
  
  const data = await permit_historyDao.updateById(id, input);
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
  
  const data = await permit_historyDao.deleteByIds(ids);
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
  const data = await permit_historyDao.revertByIds(ids);
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
  const data = await permit_historyDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const data = await permit_historyDao.getFieldComments();
  return data;
}
