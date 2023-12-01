

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  OperationRecordInput,
  OperationRecordModel,
  OperationRecordSearch,
  OperationRecordFieldComment,
  OperationRecordId,
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
  const models: OperationRecordModel[] = await operation_recordDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: OperationRecordInput,
) {
  const data = await operation_recordDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {OperationRecordSearch} search? 搜索条件
 */
export async function findOne(
  search?: OperationRecordSearch,
  sort?: SortInput|SortInput[],
): Promise<OperationRecordModel | undefined> {
  search = search || { };
  const model = await operation_recordDao.findOne(search, sort);
  return model;
}

/**
 * 根据id查找数据
 * @param {OperationRecordId} id
 */
export async function findById(
  id?: OperationRecordId | null,
): Promise<OperationRecordModel | undefined> {
  const model = await operation_recordDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {OperationRecordSearch} search? 搜索条件
 */
export async function exist(
  search?: OperationRecordSearch,
): Promise<boolean> {
  search = search || { };
  const data = await operation_recordDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {OperationRecordId} id
 */
export async function existById(
  id?: OperationRecordId | null,
): Promise<boolean> {
  const data = await operation_recordDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: OperationRecordInput,
): Promise<void> {
  const data = await operation_recordDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {OperationRecordInput} input
 * @return {Promise<OperationRecordId>} id
 */
export async function create(
  input: OperationRecordInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<OperationRecordId> {
  const id: OperationRecordId = await operation_recordDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改数据
 * @param {OperationRecordId} id
 * @param {OperationRecordInput} input
 * @return {Promise<OperationRecordId>}
 */
export async function updateById(
  id: OperationRecordId,
  input: OperationRecordInput,
): Promise<OperationRecordId> {
  
  const id2: OperationRecordId = await operation_recordDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除数据
 * @param {OperationRecordId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: OperationRecordId[],
): Promise<number> {
  
  const data = await operation_recordDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {OperationRecordId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: OperationRecordId[],
): Promise<number> {
  const data = await operation_recordDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {OperationRecordId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: OperationRecordId[],
): Promise<number> {
  const data = await operation_recordDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<OperationRecordFieldComment> {
  const data = await operation_recordDao.getFieldComments();
  return data;
}
