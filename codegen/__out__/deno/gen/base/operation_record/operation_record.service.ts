import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as operation_recordDao from "./operation_record.dao.ts";

async function setSearchQuery(
  _search: OperationRecordSearch,
) {
  
}

/**
 * 根据条件查找操作记录总数
 */
export async function findCount(
  search?: OperationRecordSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await operation_recordDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找操作记录列表
 */
export async function findAll(
  search?: OperationRecordSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OperationRecordModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: OperationRecordModel[] = await operation_recordDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: OperationRecordInput,
) {
  const data = await operation_recordDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个操作记录
 */
export async function findOne(
  search?: OperationRecordSearch,
  sort?: SortInput[],
): Promise<OperationRecordModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await operation_recordDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找操作记录
 */
export async function findById(
  id?: OperationRecordId | null,
): Promise<OperationRecordModel | undefined> {
  const model = await operation_recordDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找操作记录是否存在
 */
export async function exist(
  search?: OperationRecordSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await operation_recordDao.exist(search);
  return data;
}

/**
 * 根据 id 查找操作记录是否存在
 */
export async function existById(
  id?: OperationRecordId | null,
): Promise<boolean> {
  const data = await operation_recordDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验操作记录
 */
export async function validate(
  input: OperationRecordInput,
): Promise<void> {
  const data = await operation_recordDao.validate(input);
  return data;
}

/**
 * 批量创建操作记录
 */
export async function creates(
  inputs: OperationRecordInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<OperationRecordId[]> {
  const ids = await operation_recordDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改操作记录
 */
export async function updateById(
  id: OperationRecordId,
  input: OperationRecordInput,
): Promise<OperationRecordId> {
  
  const id2 = await operation_recordDao.updateById(id, input);
  return id2;
}

/** 校验操作记录是否存在 */
export async function validateOption(
  model0?: OperationRecordModel,
): Promise<OperationRecordModel> {
  const model = await operation_recordDao.validateOption(model0);
  return model;
}

/**
 * 根据 ids 删除操作记录
 */
export async function deleteByIds(
  ids: OperationRecordId[],
): Promise<number> {
  
  const data = await operation_recordDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原操作记录
 */
export async function revertByIds(
  ids: OperationRecordId[],
): Promise<number> {
  const data = await operation_recordDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除操作记录
 */
export async function forceDeleteByIds(
  ids: OperationRecordId[],
): Promise<number> {
  const data = await operation_recordDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取操作记录字段注释
 */
export async function getFieldComments(): Promise<OperationRecordFieldComment> {
  const data = await operation_recordDao.getFieldComments();
  return data;
}
