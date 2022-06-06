import { Context } from "/lib/context.ts";
import { Page, Sort } from "/lib/page.model.ts";

import * as background_taskService from "./background_task.service.ts";
import { Background_taskModel, Background_taskSearch } from "./background_task.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountBackground_task(
  context: Context,
  search?: Background_taskSearch,
) {
  const result = await background_taskService.findCount(context, search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllBackground_task(
  context: Context,
  search?: Background_taskSearch,
  page?: Page,
  sort?: Sort[],
) {
  const result = await background_taskService.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelBackground_task(
  context: Context,
  search?: Background_taskSearch,
  sort?: Sort[],
) {
  const result = await background_taskService.exportExcel(context, search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneBackground_task(
  context: Context,
  search?: Background_taskSearch,
) {
  const result = await background_taskService.findOne(context, search);
  return result;
}

/**
 * 根据id查找一条数据
 */
export async function findByIdBackground_task(
  context: Context,
  id: string,
) {
  const result = await background_taskService.findById(context, id);
  return result;
}

/**
 * 创建一条数据
 */
export async function createBackground_task(
  context: Context,
  model: Background_taskModel,
) {
  context.is_tran = true;
  const result = await background_taskService.create(context, model);
  return result;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdBackground_task(
  context: Context,
  id: string,
  model: Background_taskModel,
) {
  context.is_tran = true;
  const result = await background_taskService.updateById(context, id, model);
  return result;
}

/**
 * 根据ids删除数据
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
 * 导入后台任务
 */
export async function importFileBackground_task(
  context: Context,
  id: string,
) {
  const result = await background_taskService.importFile(context, id);
  return result;
}

/**
 * 根据ids还原数据
 */
export async function revertByIdsBackground_task(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await background_taskService.revertByIds(context, ids);
  return result;
}
