import { Context } from "/lib/context.ts";
import { Page, Sort } from "/lib/page.model.ts";

import * as roleService from "./role.service.ts";
import {
  RoleModel,
  RoleSearch,
} from "/gen/types.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountRole(
  context: Context,
  search?: RoleSearch,
) {
  const result = await roleService.findCount(context, search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllRole(
  context: Context,
  search?: RoleSearch,
  page?: Page,
  sort?: Sort[],
) {
  const result = await roleService.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelRole(
  context: Context,
  search?: RoleSearch,
  sort?: Sort[],
) {
  const result = await roleService.exportExcel(context, search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneRole(
  context: Context,
  search?: RoleSearch,
) {
  const result = await roleService.findOne(context, search);
  return result;
}

/**
 * 根据id查找一条数据
 */
export async function findByIdRole(
  context: Context,
  id: string,
) {
  const result = await roleService.findById(context, id);
  return result;
}

/**
 * 创建一条数据
 */
export async function createRole(
  context: Context,
  model: RoleModel,
) {
  context.is_tran = true;
  const result = await roleService.create(context, model);
  return result;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdRole(
  context: Context,
  id: string,
  model: RoleModel,
) {
  context.is_tran = true;
  const result = await roleService.updateById(context, id, model);
  return result;
}

/**
 * 根据ids删除数据
 */
export async function deleteByIdsRole(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await roleService.deleteByIds(context, ids);
  return result;
}

/**
 * 导入角色
 */
export async function importFileRole(
  context: Context,
  id: string,
) {
  const result = await roleService.importFile(context, id);
  return result;
}

/**
 * 根据ids还原数据
 */
export async function revertByIdsRole(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await roleService.revertByIds(context, ids);
  return result;
}
