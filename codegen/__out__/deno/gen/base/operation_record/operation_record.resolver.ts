import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortOperationRecord,
} from "./operation_record.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./operation_record.model.ts";

/**
 * 根据条件查找操作记录总数
 */
export async function findCountOperationRecord(
  search?: OperationRecordSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./operation_record.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找操作记录列表
 */
export async function findAllOperationRecord(
  search?: OperationRecordSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OperationRecordModel[]> {
  
  const {
    findAll,
  } = await import("./operation_record.service.ts");
  
  checkSortOperationRecord(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取操作记录字段注释
 */
export async function getFieldCommentsOperationRecord(): Promise<OperationRecordFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./operation_record.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个操作记录
 */
export async function findOneOperationRecord(
  search?: OperationRecordSearch,
  sort?: SortInput[],
): Promise<OperationRecordModel | undefined> {
  
  const {
    findOne,
  } = await import("./operation_record.service.ts");
  
  checkSortOperationRecord(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找操作记录
 */
export async function findByIdOperationRecord(
  id: OperationRecordId,
): Promise<OperationRecordModel | undefined> {
  
  const {
    findById,
  } = await import("./operation_record.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找操作记录
 */
export async function findByIdsOperationRecord(
  ids: OperationRecordId[],
): Promise<OperationRecordModel[]> {
  
  const {
    findByIds,
  } = await import("./operation_record.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 删除操作记录
 */
export async function deleteByIdsOperationRecord(
  ids: OperationRecordId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./operation_record.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原操作记录
 */
export async function revertByIdsOperationRecord(
  ids: OperationRecordId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./operation_record.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除操作记录
 */
export async function forceDeleteByIdsOperationRecord(
  ids: OperationRecordId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./operation_record.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
