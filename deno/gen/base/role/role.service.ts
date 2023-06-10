

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type RoleInput,
  type RoleModel,
  type RoleSearch,
} from "./role.model.ts";

import * as roleDao from "./role.dao.ts";

/**
 * 根据条件查找总数
 * @param {RoleSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: RoleSearch,
): Promise<number> {
  search = search || { };
  const data = await roleDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {RoleSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<RoleModel[]>} 
 */
export async function findAll(
  search?: RoleSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<RoleModel[]> {
  search = search || { };
  const data: RoleModel[] = await roleDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {RoleSearch} search? 搜索条件
 */
export async function findOne(
  search?: RoleSearch,
  sort?: SortInput|SortInput[],
) {
  search = search || { };
  const data = await roleDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await roleDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {RoleSearch} search? 搜索条件
 */
export async function exist(
  search?: RoleSearch,
) {
  search = search || { };
  const data = await roleDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await roleDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {RoleInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: RoleInput,
): Promise<string> {
  const data = await roleDao.create(input);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {RoleInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: RoleInput,
): Promise<string> {
  const data = await roleDao.updateById(id, input);
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
  const data = await roleDao.deleteByIds(ids);
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
  const data = await roleDao.revertByIds(ids);
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
  const data = await roleDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const data = await roleDao.getFieldComments();
  return data;
}
