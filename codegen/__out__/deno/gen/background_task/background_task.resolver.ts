import { type Context } from "/lib/context.ts";
import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import * as background_taskService from "./background_task.service.ts";

import {
  type Background_TaskModel,
  type Background_TaskSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountBackground_task(
  context: Context,
  search?: Background_TaskSearch & { $extra?: SearchExtra[] },
) {
  const result = await background_taskService.findCount(context, search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllBackground_task(
  context: Context,
  search?: Background_TaskSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await background_taskService.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelBackground_task(
  context: Context,
  search?: Background_TaskSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await background_taskService.exportExcel(context, search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneBackground_task(
  context: Context,
  search?: Background_TaskSearch & { $extra?: SearchExtra[] },
) {
  const result = await background_taskService.findOne(context, search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdBackground_task(
  context: Context,
  id: string,
) {
  const result = await background_taskService.findById(context, id);
  return result;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsBackground_task(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await background_taskService.deleteByIds(context, ids);
  return result;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsBackground_task(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await background_taskService.revertByIds(context, ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsBackground_task(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await background_taskService.forceDeleteByIds(context, ids);
  return result;
}
