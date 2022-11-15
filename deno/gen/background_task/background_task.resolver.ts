import {
  useContext,
} from "/lib/context.ts";

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
  search?: Background_TaskSearch & { $extra?: SearchExtra[] },
) {
  const result = await background_taskService.findCount(search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllBackground_task(
  search?: Background_TaskSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await background_taskService.findAll(search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelBackground_task(
  search?: Background_TaskSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await background_taskService.exportExcel(search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneBackground_task(
  search?: Background_TaskSearch & { $extra?: SearchExtra[] },
) {
  const result = await background_taskService.findOne(search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdBackground_task(
  id: string,
) {
  const result = await background_taskService.findById(id);
  return result;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsBackground_task(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await background_taskService.deleteByIds(ids);
  return result;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsBackground_task(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await background_taskService.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsBackground_task(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await background_taskService.forceDeleteByIds(ids);
  return result;
}
