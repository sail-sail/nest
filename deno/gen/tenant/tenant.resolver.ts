import { type Context } from "/lib/context.ts";
import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import * as tenantService from "./tenant.service.ts";

import {
  type TenantModel,
  type TenantSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountTenant(
  context: Context,
  search?: TenantSearch & { $extra?: SearchExtra[] },
) {
  const result = await tenantService.findCount(context, search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllTenant(
  context: Context,
  search?: TenantSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await tenantService.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelTenant(
  context: Context,
  search?: TenantSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await tenantService.exportExcel(context, search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneTenant(
  context: Context,
  search?: TenantSearch & { $extra?: SearchExtra[] },
) {
  const result = await tenantService.findOne(context, search);
  return result;
}

/**
 * 根据 id 查找一条数据
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
  context.is_tran = true;
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
  context.is_tran = true;
  const result = await tenantService.updateById(context, id, model);
  return result;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsTenant(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await tenantService.deleteByIds(context, ids);
  return result;
}

/**
 * 导入租户
 */
export async function importFileTenant(
  context: Context,
  id: string,
) {
  const result = await tenantService.importFile(context, id);
  return result;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsTenant(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await tenantService.revertByIds(context, ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsTenant(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await tenantService.forceDeleteByIds(context, ids);
  return result;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByTenant(
  context: Context,
) {
  const result = await tenantService.findLastOrderBy(context);
  return result;
}
