
import * as authDao from "/lib/auth/auth.dao.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type BackgroundTaskInput,
  type BackgroundTaskModel,
  type BackgroundTaskSearch,
} from "./background_task.model.ts";

import * as background_taskDao from "./background_task.dao.ts";

/**
 * 根据条件查找总数
 * @param {BackgroundTaskSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: BackgroundTaskSearch,
): Promise<number> {
  search = search || { };
  
  const authModel = await authDao.getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }
  const data = await background_taskDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {BackgroundTaskSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<BackgroundTaskModel[]>} 
 */
export async function findAll(
  search?: BackgroundTaskSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<BackgroundTaskModel[]> {
  search = search || { };
  
  const authModel = await authDao.getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }
  const data: BackgroundTaskModel[] = await background_taskDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {BackgroundTaskSearch} search? 搜索条件
 */
export async function findOne(
  search?: BackgroundTaskSearch,
  sort?: SortInput|SortInput[],
) {
  search = search || { };
  
  const authModel = await authDao.getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }
  const data = await background_taskDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await background_taskDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {BackgroundTaskSearch} search? 搜索条件
 */
export async function exist(
  search?: BackgroundTaskSearch,
) {
  search = search || { };
  
  const authModel = await authDao.getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }
  const data = await background_taskDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await background_taskDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {BackgroundTaskInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: BackgroundTaskInput,
): Promise<string> {
  const data = await background_taskDao.create(input);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {BackgroundTaskInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: BackgroundTaskInput,
): Promise<string> {
  const data = await background_taskDao.updateById(id, input);
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
  const data = await background_taskDao.deleteByIds(ids);
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
  const data = await background_taskDao.revertByIds(ids);
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
  const data = await background_taskDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const data = await background_taskDao.getFieldComments();
  return data;
}
