import { Context } from "/lib/context.ts";
import { Page, Sort } from "/lib/page.model.ts";

import * as optionService from "./option.service.ts";
import {
  OptionModel,
  OptionSearch,
} from "/gen/types.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountOption(
  context: Context,
  search?: OptionSearch,
) {
  const result = await optionService.findCount(context, search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllOption(
  context: Context,
  search?: OptionSearch,
  page?: Page,
  sort?: Sort[],
) {
  const result = await optionService.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelOption(
  context: Context,
  search?: OptionSearch,
  sort?: Sort[],
) {
  const result = await optionService.exportExcel(context, search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneOption(
  context: Context,
  search?: OptionSearch,
) {
  const result = await optionService.findOne(context, search);
  return result;
}

/**
 * 根据id查找一条数据
 */
export async function findByIdOption(
  context: Context,
  id: string,
) {
  const result = await optionService.findById(context, id);
  return result;
}

/**
 * 创建一条数据
 */
export async function createOption(
  context: Context,
  model: OptionModel,
) {
  context.is_tran = true;
  const result = await optionService.create(context, model);
  return result;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdOption(
  context: Context,
  id: string,
  model: OptionModel,
) {
  context.is_tran = true;
  const result = await optionService.updateById(context, id, model);
  return result;
}

/**
 * 根据ids删除数据
 */
export async function deleteByIdsOption(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await optionService.deleteByIds(context, ids);
  return result;
}

/**
 * 导入选项
 */
export async function importFileOption(
  context: Context,
  id: string,
) {
  const result = await optionService.importFile(context, id);
  return result;
}

/**
 * 根据ids还原数据
 */
export async function revertByIdsOption(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await optionService.revertByIds(context, ids);
  return result;
}
