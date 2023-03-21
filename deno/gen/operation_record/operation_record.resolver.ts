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
  type Operation_RecordModel,
  type Operation_RecordSearch,
} from "./operation_record.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountOperation_record(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./operation_record.service.ts");
  const data = await findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllOperation_record(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const { findAll } = await import("./operation_record.service.ts");
  const data = await findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelOperation_record(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { exportExcel } = await import("./operation_record.service.ts");
  const data = await exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneOperation_record(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
) {
  const { findOne } = await import("./operation_record.service.ts");
  const data = await findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdOperation_record(
  id: string,
) {
  const { findById } = await import("./operation_record.service.ts");
  const data = await findById(id);
  return data;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsOperation_record(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { deleteByIds } = await import("./operation_record.service.ts");
  const data = await deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsOperation_record(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { revertByIds } = await import("./operation_record.service.ts");
  const data = await revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsOperation_record(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { forceDeleteByIds } = await import("./operation_record.service.ts");
  const data = await forceDeleteByIds(ids);
  return data;
}
