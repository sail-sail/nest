

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type MenuInput,
  type MenuModel,
  type MenuSearch,
} from "./menu.model.ts";

import * as menuDao from "./menu.dao.ts";

/**
 * 根据条件查找总数
 * @param {MenuSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: MenuSearch,
): Promise<number> {
  search = search || { };
  const data = await menuDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {MenuSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<MenuModel[]>} 
 */
export async function findAll(
  search?: MenuSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<MenuModel[]> {
  search = search || { };
  const data: MenuModel[] = await menuDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {MenuSearch} search? 搜索条件
 */
export async function findOne(
  search?: MenuSearch,
  sort?: SortInput|SortInput[],
) {
  search = search || { };
  const data = await menuDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await menuDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {MenuSearch} search? 搜索条件
 */
export async function exist(
  search?: MenuSearch,
) {
  search = search || { };
  const data = await menuDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await menuDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {MenuInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: MenuInput,
): Promise<string> {
  const data = await menuDao.create(input);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {MenuInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: MenuInput,
): Promise<string> {
  const data = await menuDao.updateById(id, input);
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
  const data = await menuDao.deleteByIds(ids);
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
  const data = await menuDao.enableByIds(ids, is_enabled);
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
  const data = await menuDao.revertByIds(ids);
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
  const data = await menuDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const data = await menuDao.getFieldComments();
  return data;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await menuDao.findLastOrderBy();
  return data;
}
