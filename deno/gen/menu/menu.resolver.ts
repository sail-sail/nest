import { Context } from "/lib/context.ts";
import { Page, Sort } from "/lib/page.model.ts";

import * as menuService from "./menu.service.ts";
import {
  MenuModel,
  MenuSearch,
} from "/gen/types.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountMenu(
  context: Context,
  search?: MenuSearch,
) {
  const result = await menuService.findCount(context, search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllMenu(
  context: Context,
  search?: MenuSearch,
  page?: Page,
  sort?: Sort[],
) {
  const result = await menuService.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelMenu(
  context: Context,
  search?: MenuSearch,
  sort?: Sort[],
) {
  const result = await menuService.exportExcel(context, search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneMenu(
  context: Context,
  search?: MenuSearch,
) {
  const result = await menuService.findOne(context, search);
  return result;
}

/**
 * 根据id查找一条数据
 */
export async function findByIdMenu(
  context: Context,
  id: string,
) {
  const result = await menuService.findById(context, id);
  return result;
}

/**
 * 创建一条数据
 */
export async function createMenu(
  context: Context,
  model: MenuModel,
) {
  context.is_tran = true;
  const result = await menuService.create(context, model);
  return result;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdMenu(
  context: Context,
  id: string,
  model: MenuModel,
) {
  context.is_tran = true;
  const result = await menuService.updateById(context, id, model);
  return result;
}

/**
 * 根据ids删除数据
 */
export async function deleteByIdsMenu(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await menuService.deleteByIds(context, ids);
  return result;
}

/**
 * 导入菜单
 */
export async function importFileMenu(
  context: Context,
  id: string,
) {
  const result = await menuService.importFile(context, id);
  return result;
}

/**
 * 根据ids还原数据
 */
export async function revertByIdsMenu(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await menuService.revertByIds(context, ids);
  return result;
}

/**
 * 查找order_by字段的最大值
 */
export async function findLastOrderByMenu(
  context: Context,
) {
  const result = await menuService.findLastOrderBy(context);
  return result;
}
