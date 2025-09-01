import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortOperationRecord,
  intoInputOperationRecord,
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
    findCountOperationRecord,
  } = await import("./operation_record.service.ts");
  
  const num = await findCountOperationRecord(search);
  
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
    findAllOperationRecord,
  } = await import("./operation_record.service.ts");
  
  checkSortOperationRecord(sort);
  
  const models = await findAllOperationRecord(search, page, sort);
  
  return models;
}

/**
 * 获取操作记录字段注释
 */
export async function getFieldCommentsOperationRecord(): Promise<OperationRecordFieldComment> {
  
  const {
    getFieldCommentsOperationRecord,
  } = await import("./operation_record.service.ts");
  
  const field_comment = await getFieldCommentsOperationRecord();
  
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
    findOneOperationRecord,
  } = await import("./operation_record.service.ts");
  
  checkSortOperationRecord(sort);
  
  const model = await findOneOperationRecord(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个操作记录, 如果不存在则抛错
 */
export async function findOneOkOperationRecord(
  search?: OperationRecordSearch,
  sort?: SortInput[],
): Promise<OperationRecordModel> {
  
  const {
    findOneOkOperationRecord,
  } = await import("./operation_record.service.ts");
  
  checkSortOperationRecord(sort);
  
  const model = await findOneOkOperationRecord(search, sort);
  
  return model;
}

/**
 * 根据 id 查找操作记录
 */
export async function findByIdOperationRecord(
  id: OperationRecordId,
): Promise<OperationRecordModel | undefined> {
  
  const {
    findByIdOperationRecord,
  } = await import("./operation_record.service.ts");
  
  const model = await findByIdOperationRecord(id);
  
  return model;
}

/**
 * 根据 id 查找操作记录, 如果不存在则抛错
 */
export async function findByIdOkOperationRecord(
  id: OperationRecordId,
): Promise<OperationRecordModel | undefined> {
  
  const {
    findByIdOkOperationRecord,
  } = await import("./operation_record.service.ts");
  
  const model = await findByIdOkOperationRecord(id);
  
  return model;
}

/**
 * 根据 ids 查找操作记录
 */
export async function findByIdsOperationRecord(
  ids: OperationRecordId[],
): Promise<OperationRecordModel[]> {
  
  const {
    findByIdsOperationRecord,
  } = await import("./operation_record.service.ts");
  
  const models = await findByIdsOperationRecord(ids);
  
  return models;
}

/**
 * 根据 ids 查找操作记录, 出现查询不到的 id 则报错
 */
export async function findByIdsOkOperationRecord(
  ids: OperationRecordId[],
): Promise<OperationRecordModel[]> {
  
  const {
    findByIdsOkOperationRecord,
  } = await import("./operation_record.service.ts");
  
  const models = await findByIdsOkOperationRecord(ids);
  
  return models;
}

/**
 * 根据 ids 删除操作记录
 */
export async function deleteByIdsOperationRecord(
  ids: OperationRecordId[],
): Promise<number> {
  
  const {
    deleteByIdsOperationRecord,
  } = await import("./operation_record.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsOperationRecord(ids);
  
  return num;
}

/**
 * 根据 ids 还原操作记录
 */
export async function revertByIdsOperationRecord(
  ids: OperationRecordId[],
): Promise<number> {
  
  const {
    revertByIdsOperationRecord,
  } = await import("./operation_record.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsOperationRecord(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除操作记录
 */
export async function forceDeleteByIdsOperationRecord(
  ids: OperationRecordId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsOperationRecord,
  } = await import("./operation_record.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsOperationRecord(ids);
  
  return res;
}
