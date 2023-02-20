import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as operation_recordService
} from "./operation_record.service.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type Operation_RecordModel,
  type Operation_RecordSearch,
} from "./operation_record.model.ts";

export const _internals = {
  findCountOperation_record,
  findAllOperation_record,
  exportExcelOperation_record,
  findOneOperation_record,
  findByIdOperation_record,
  deleteByIdsOperation_record,
  revertByIdsOperation_record,
  forceDeleteByIdsOperation_record,
};

/**
 * 根据条件查找据数总数
 */
async function findCountOperation_record(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
) {
  const data = await operation_recordService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllOperation_record(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const data = await operation_recordService.findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelOperation_record(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await operation_recordService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneOperation_record(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
) {
  const data = await operation_recordService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdOperation_record(
  id: string,
) {
  const data = await operation_recordService.findById(id);
  return data;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsOperation_record(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await operation_recordService.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsOperation_record(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await operation_recordService.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsOperation_record(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await operation_recordService.forceDeleteByIds(ids);
  return data;
}
