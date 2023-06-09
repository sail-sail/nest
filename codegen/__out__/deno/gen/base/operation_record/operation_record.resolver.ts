import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type OperationRecordInput,
  type OperationRecordSearch,
} from "./operation_record.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountOperationRecord(
  search?: OperationRecordSearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./operation_record.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllOperationRecord(
  search?: OperationRecordSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const { findAll } = await import("./operation_record.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsOperationRecord() {
  const { getFieldComments } = await import("./operation_record.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneOperationRecord(
  search?: OperationRecordSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./operation_record.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdOperationRecord(
  id: string,
) {
  const { findById } = await import("./operation_record.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsOperationRecord(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const {
    deleteByIds,
  } = await import("./operation_record.service.ts");
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsOperationRecord(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const {
    revertByIds,
  } = await import("./operation_record.service.ts");
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsOperationRecord(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const {
    forceDeleteByIds,
  } = await import("./operation_record.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
