

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type OperationRecordInput,
  type OperationRecordModel,
  type OperationRecordSearch,
} from "./operation_record.model.ts";

import * as operation_recordDao from "./operation_record.dao.ts";

/**
 * 根据条件查找总数
 * @param {OperationRecordSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: OperationRecordSearch,
): Promise<number> {
  search = search || { };
  const data = await operation_recordDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {OperationRecordSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<OperationRecordModel[]>} 
 */
export async function findAll(
  search?: OperationRecordSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<OperationRecordModel[]> {
  search = search || { };
  const data: OperationRecordModel[] = await operation_recordDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {OperationRecordSearch} search? 搜索条件
 */
export async function findOne(
  search?: OperationRecordSearch,
  sort?: SortInput|SortInput[],
) {
  search = search || { };
  const data = await operation_recordDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await operation_recordDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {OperationRecordSearch} search? 搜索条件
 */
export async function exist(
  search?: OperationRecordSearch,
) {
  search = search || { };
  const data = await operation_recordDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await operation_recordDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {OperationRecordInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: OperationRecordInput,
): Promise<string> {
  const data = await operation_recordDao.create(input);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {OperationRecordInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: OperationRecordInput,
): Promise<string> {
  
  const data = await operation_recordDao.updateById(id, input);
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
  
  const data = await operation_recordDao.deleteByIds(ids);
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
  const data = await operation_recordDao.revertByIds(ids);
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
  const data = await operation_recordDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const data = await operation_recordDao.getFieldComments();
  return data;
}
