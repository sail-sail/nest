

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type DomainInput,
  type DomainModel,
  type DomainSearch,
} from "./domain.model.ts";

import * as domainDao from "./domain.dao.ts";

/**
 * 根据条件查找总数
 * @param {DomainSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: DomainSearch,
): Promise<number> {
  search = search || { };
  const data = await domainDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {DomainSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<DomainModel[]>} 
 */
export async function findAll(
  search?: DomainSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<DomainModel[]> {
  search = search || { };
  const data: DomainModel[] = await domainDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {DomainSearch} search? 搜索条件
 */
export async function findOne(
  search?: DomainSearch,
  sort?: SortInput|SortInput[],
) {
  search = search || { };
  const data = await domainDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await domainDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {DomainSearch} search? 搜索条件
 */
export async function exist(
  search?: DomainSearch,
) {
  search = search || { };
  const data = await domainDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await domainDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {DomainInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: DomainInput,
): Promise<string> {
  const data = await domainDao.create(input);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {DomainInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: DomainInput,
): Promise<string> {
  const data = await domainDao.updateById(id, input);
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
  const data = await domainDao.deleteByIds(ids);
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
  const data = await domainDao.revertByIds(ids);
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
  const data = await domainDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const data = await domainDao.getFieldComments();
  return data;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await domainDao.findLastOrderBy();
  return data;
}
