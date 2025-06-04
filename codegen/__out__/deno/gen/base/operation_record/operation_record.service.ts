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
export async function findCountOperationRecord(
  search?: OperationRecordSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const operation_record_num = await operation_recordDao.findCountOperationRecord(search);
  
  return operation_record_num;
}

/**
 * 根据搜索条件和分页查找操作记录列表
 */
export async function findAllOperationRecord(
  search?: OperationRecordSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OperationRecordModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const operation_record_models = await operation_recordDao.findAllOperationRecord(search, page, sort);
  
  return operation_record_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblOperationRecord(
  input: OperationRecordInput,
): Promise<void> {
  await operation_recordDao.setIdByLblOperationRecord(input);
}

/**
 * 根据条件查找第一个操作记录
 */
export async function findOneOperationRecord(
  search?: OperationRecordSearch,
  sort?: SortInput[],
): Promise<OperationRecordModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const operation_record_model = await operation_recordDao.findOneOperationRecord(search, sort);
  
  return operation_record_model;
}

/**
 * 根据条件查找第一个操作记录, 如果不存在则抛错
 */
export async function findOneOkOperationRecord(
  search?: OperationRecordSearch,
  sort?: SortInput[],
): Promise<OperationRecordModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const operation_record_model = await operation_recordDao.findOneOkOperationRecord(search, sort);
  
  return operation_record_model;
}

/**
 * 根据 id 查找操作记录
 */
export async function findByIdOperationRecord(
  operation_record_id: OperationRecordId,
): Promise<OperationRecordModel | undefined> {
  
  const operation_record_model = await operation_recordDao.findByIdOperationRecord(operation_record_id);
  
  return operation_record_model;
}

/**
 * 根据 id 查找操作记录, 如果不存在则抛错
 */
export async function findByIdOkOperationRecord(
  operation_record_id: OperationRecordId,
): Promise<OperationRecordModel> {
  
  const operation_record_model = await operation_recordDao.findByIdOkOperationRecord(operation_record_id);
  
  return operation_record_model;
}

/**
 * 根据 ids 查找操作记录
 */
export async function findByIdsOperationRecord(
  operation_record_ids: OperationRecordId[],
): Promise<OperationRecordModel[]> {
  
  const operation_record_models = await operation_recordDao.findByIdsOperationRecord(operation_record_ids);
  
  return operation_record_models;
}

/**
 * 根据 ids 查找操作记录, 出现查询不到的 id 则报错
 */
export async function findByIdsOkOperationRecord(
  operation_record_ids: OperationRecordId[],
): Promise<OperationRecordModel[]> {
  
  const operation_record_models = await operation_recordDao.findByIdsOkOperationRecord(operation_record_ids);
  
  return operation_record_models;
}

/**
 * 根据搜索条件查找操作记录是否存在
 */
export async function existOperationRecord(
  search?: OperationRecordSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const operation_record_exist = await operation_recordDao.existOperationRecord(search);
  
  return operation_record_exist;
}

/**
 * 根据 id 查找操作记录是否存在
 */
export async function existByIdOperationRecord(
  operation_record_id?: OperationRecordId | null,
): Promise<boolean> {
  
  const operation_record_exist = await operation_recordDao.existByIdOperationRecord(operation_record_id);
  
  return operation_record_exist;
}

/**
 * 增加和修改时校验操作记录
 */
export async function validateOperationRecord(
  input: OperationRecordInput,
): Promise<void> {
  await operation_recordDao.validateOperationRecord(input);
}

/**
 * 批量创建操作记录
 */
export async function createsOperationRecord(
  inputs: OperationRecordInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<OperationRecordId[]> {
  const operation_record_ids = await operation_recordDao.createsOperationRecord(inputs, options);
  
  return operation_record_ids;
}

/**
 * 根据 id 修改操作记录
 */
export async function updateByIdOperationRecord(
  operation_record_id: OperationRecordId,
  input: OperationRecordInput,
): Promise<OperationRecordId> {
  
  const operation_record_id2 = await operation_recordDao.updateByIdOperationRecord(operation_record_id, input);
  
  return operation_record_id2;
}

/** 校验操作记录是否存在 */
export async function validateOptionOperationRecord(
  model0?: OperationRecordModel,
): Promise<OperationRecordModel> {
  const operation_record_model = await operation_recordDao.validateOptionOperationRecord(model0);
  return operation_record_model;
}

/**
 * 根据 ids 删除操作记录
 */
export async function deleteByIdsOperationRecord(
  operation_record_ids: OperationRecordId[],
): Promise<number> {
  
  const operation_record_num = await operation_recordDao.deleteByIdsOperationRecord(operation_record_ids);
  return operation_record_num;
}

/**
 * 根据 ids 还原操作记录
 */
export async function revertByIdsOperationRecord(
  operation_record_ids: OperationRecordId[],
): Promise<number> {
  
  const operation_record_num = await operation_recordDao.revertByIdsOperationRecord(operation_record_ids);
  
  return operation_record_num;
}

/**
 * 根据 ids 彻底删除操作记录
 */
export async function forceDeleteByIdsOperationRecord(
  operation_record_ids: OperationRecordId[],
): Promise<number> {
  
  const operation_record_num = await operation_recordDao.forceDeleteByIdsOperationRecord(operation_record_ids);
  
  return operation_record_num;
}

/**
 * 获取操作记录字段注释
 */
export async function getFieldCommentsOperationRecord(): Promise<OperationRecordFieldComment> {
  const operation_record_fields = await operation_recordDao.getFieldCommentsOperationRecord();
  return operation_record_fields;
}
