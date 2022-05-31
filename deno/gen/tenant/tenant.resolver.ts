import { Context } from "/lib/context.ts";
import { Page, Sort } from "/lib/page.model.ts";

import * as tenantService from "./tenant.service.ts";
import { TenantModel, TenantSearch } from "./tenant.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountTenant(
  context: Context,
  search?: TenantSearch,
) {
  const result = await tenantService.findCount(context, search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllTenant(
  context: Context,
  search?: TenantSearch,
  page?: Page,
  sort?: Sort[],
) {
  const result = await tenantService.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelTenant(
  context: Context,
  search?: TenantSearch,
  sort?: Sort[],
) {
  const result = await tenantService.exportExcel(context, search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneTenant(
  context: Context,
  search?: TenantSearch,
) {
  const result = await tenantService.findOne(context, search);
  return result;
}

/**
 * 根据id查找一条数据
 */
export async function findByIdTenant(
  context: Context,
  id: string,
) {
  const result = await tenantService.findById(context, id);
  return result;
}

/**
 * 创建一条数据
 */
export async function createTenant(
  context: Context,
  model: TenantModel,
) {
  const result = await tenantService.create(context, model);
  return result;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdTenant(
  context: Context,
  id: string,
  model: TenantModel,
) {
  const result = await tenantService.updateById(context, id, model);
  return result;
}

/**
 * 根据ids删除数据
 */
export async function deleteByIdsTenant(
  context: Context,
  ids: string[],
) {
  const result = await tenantService.deleteByIds(context, ids);
  return result;
}

/**
 * 导入租户
 */
// export async function importFileTenant(
//   context: Context,
//   id: string,
// ) {
//   const result = await tenantService.importFile(context, id);
//   return result;
// }

/**
 * 根据ids还原数据
 */
export async function revertByIdsTenant(
  context: Context,
  ids: string[],
) {
  const result = await tenantService.revertByIds(context, ids);
  return result;
}

/**
 * 查找order_by字段的最大值
 */
export async function findLastOrderByTenant(
  context: Context,
) {
  const result = await tenantService.findLastOrderBy(context);
  return result;
}
