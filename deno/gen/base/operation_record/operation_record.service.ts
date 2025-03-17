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
  
  const operation_record_num = await operation_recordDao.findCount(search);
  
  return operation_record_num;
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
  
  const operation_record_models = await operation_recordDao.findAll(search, page, sort);
  
  return operation_record_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: OperationRecordInput,
): Promise<void> {
  await operation_recordDao.setIdByLbl(input);
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
  
  const operation_record_model = await operation_recordDao.findOne(search, sort);
  
  return operation_record_model;
}

/**
 * 根据 id 查找操作记录
 */
export async function findById(
  operation_record_id?: OperationRecordId | null,
): Promise<OperationRecordModel | undefined> {
  
  const operation_record_model = await operation_recordDao.findById(operation_record_id);
  
  return operation_record_model;
}

/**
 * 根据 ids 查找操作记录
 */
export async function findByIds(
  operation_record_ids: OperationRecordId[],
): Promise<OperationRecordModel[]> {
  
  const operation_record_models = await operation_recordDao.findByIds(operation_record_ids);
  
  return operation_record_models;
}

/**
 * 根据搜索条件查找操作记录是否存在
 */
export async function exist(
  search?: OperationRecordSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const operation_record_exist = await operation_recordDao.exist(search);
  
  return operation_record_exist;
}

/**
 * 根据 id 查找操作记录是否存在
 */
export async function existById(
  operation_record_id?: OperationRecordId | null,
): Promise<boolean> {
  
  const operation_record_exist = await operation_recordDao.existById(operation_record_id);
  
  return operation_record_exist;
}

/**
 * 增加和修改时校验操作记录
 */
export async function validate(
  input: OperationRecordInput,
): Promise<void> {
  await operation_recordDao.validate(input);
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
  const operation_record_ids = await operation_recordDao.creates(inputs, options);
  
  return operation_record_ids;
}

/**
 * 根据 id 修改操作记录
 */
export async function updateById(
  operation_record_id: OperationRecordId,
  input: OperationRecordInput,
): Promise<OperationRecordId> {
  
  const operation_record_id2 = await operation_recordDao.updateById(operation_record_id, input);
  
  return operation_record_id2;
}

/** 校验操作记录是否存在 */
export async function validateOption(
  model0?: OperationRecordModel,
): Promise<OperationRecordModel> {
  const operation_record_model = await operation_recordDao.validateOption(model0);
  return operation_record_model;
}

/**
 * 根据 ids 删除操作记录
 */
export async function deleteByIds(
  operation_record_ids: OperationRecordId[],
): Promise<number> {
  
  const operation_record_num = await operation_recordDao.deleteByIds(operation_record_ids);
  return operation_record_num;
}

/**
 * 根据 ids 还原操作记录
 */
export async function revertByIds(
  operation_record_ids: OperationRecordId[],
): Promise<number> {
  
  const operation_record_num = await operation_recordDao.revertByIds(operation_record_ids);
  
  return operation_record_num;
}

/**
 * 根据 ids 彻底删除操作记录
 */
export async function forceDeleteByIds(
  operation_record_ids: OperationRecordId[],
): Promise<number> {
  
  const operation_record_num = await operation_recordDao.forceDeleteByIds(operation_record_ids);
  
  return operation_record_num;
}

/**
 * 获取操作记录字段注释
 */
export async function getFieldComments(): Promise<OperationRecordFieldComment> {
  const operation_record_fields = await operation_recordDao.getFieldComments();
  return operation_record_fields;
}
