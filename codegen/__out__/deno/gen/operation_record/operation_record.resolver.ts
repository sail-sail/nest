import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import * as operation_recordService from "./operation_record.service.ts";

import {
  type Operation_RecordModel,
  type Operation_RecordSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountOperation_record(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
) {
  const result = await operation_recordService.findCount(search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllOperation_record(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await operation_recordService.findAll(search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelOperation_record(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await operation_recordService.exportExcel(search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneOperation_record(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
) {
  const result = await operation_recordService.findOne(search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdOperation_record(
  id: string,
) {
  const result = await operation_recordService.findById(id);
  return result;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsOperation_record(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await operation_recordService.deleteByIds(ids);
  return result;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsOperation_record(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await operation_recordService.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsOperation_record(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await operation_recordService.forceDeleteByIds(ids);
  return result;
}
