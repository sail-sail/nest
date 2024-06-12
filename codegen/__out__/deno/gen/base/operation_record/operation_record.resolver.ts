import {
  set_is_tran,
  set_is_creating,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找操作记录总数
 */
export async function findCountOperationRecord(
  search?: OperationRecordSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./operation_record.service.ts");
  
  const res = await findCount(search);
  return res;
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
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取操作记录字段注释
 */
export async function getFieldCommentsOperationRecord(): Promise<OperationRecordFieldComment> {
  const { getFieldComments } = await import("./operation_record.service.ts");
  const res = await getFieldComments();
  return res;
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
  
  const res = await findOne(search, sort);
  return res;
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
  
  const res = await findById(id);
  
  return res;
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
    "/base/operation_record",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
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
    "/base/operation_record",
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
    "/base/operation_record",
    "force_delete",
  );
  const res = await forceDeleteByIds(ids);
  return res;
}
