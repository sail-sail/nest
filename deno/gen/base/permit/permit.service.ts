

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  PermitInput,
  PermitModel,
  PermitSearch,
} from "./permit.model.ts";

import * as permitDao from "./permit.dao.ts";

/**
 * 根据条件查找总数
 * @param {PermitSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: PermitSearch,
): Promise<number> {
  search = search || { };
  const data = await permitDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {PermitSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<PermitModel[]>} 
 */
export async function findAll(
  search?: PermitSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<PermitModel[]> {
  search = search || { };
  const data: PermitModel[] = await permitDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {PermitSearch} search? 搜索条件
 */
export async function findOne(
  search?: PermitSearch,
  sort?: SortInput|SortInput[],
) {
  search = search || { };
  const data = await permitDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await permitDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {PermitSearch} search? 搜索条件
 */
export async function exist(
  search?: PermitSearch,
) {
  search = search || { };
  const data = await permitDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await permitDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {PermitInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: PermitInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const data = await permitDao.create(input, options);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {PermitInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: PermitInput,
): Promise<string> {
  
  const data = await permitDao.updateById(id, input);
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
  
  const data = await permitDao.deleteByIds(ids);
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
  const data = await permitDao.revertByIds(ids);
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
  const data = await permitDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const data = await permitDao.getFieldComments();
  return data;
}
