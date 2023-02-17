import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as background_taskService
} from "./background_task.service.ts";

import {
  type Background_TaskModel,
  type Background_TaskSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

export const _internals = {
  findCountBackground_task,
  findAllBackground_task,
  exportExcelBackground_task,
  findOneBackground_task,
  findByIdBackground_task,
  deleteByIdsBackground_task,
  revertByIdsBackground_task,
  forceDeleteByIdsBackground_task,
};

/**
 * 根据条件查找据数总数
 */
async function findCountBackground_task(
  search?: Background_TaskSearch & { $extra?: SearchExtra[] },
) {
  const data = await background_taskService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllBackground_task(
  search?: Background_TaskSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const data = await background_taskService.findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelBackground_task(
  search?: Background_TaskSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await background_taskService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneBackground_task(
  search?: Background_TaskSearch & { $extra?: SearchExtra[] },
) {
  const data = await background_taskService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdBackground_task(
  id: string,
) {
  const data = await background_taskService.findById(id);
  return data;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsBackground_task(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await background_taskService.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsBackground_task(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await background_taskService.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsBackground_task(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await background_taskService.forceDeleteByIds(ids);
  return data;
}
