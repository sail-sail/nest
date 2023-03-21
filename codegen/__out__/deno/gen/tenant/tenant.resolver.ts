import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import * as tenantService from "./tenant.service.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type TenantModel,
  type TenantSearch,
} from "./tenant.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountTenant(
  search?: TenantSearch & { $extra?: SearchExtra[] },
) {
  const data = await tenantService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllTenant(
  search?: TenantSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const data = await tenantService.findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelTenant(
  search?: TenantSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await tenantService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneTenant(
  search?: TenantSearch & { $extra?: SearchExtra[] },
) {
  const data = await tenantService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdTenant(
  id: string,
) {
  const data = await tenantService.findById(id);
  return data;
}

/**
 * 创建一条数据
 */
export async function createTenant(
  model: TenantModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await tenantService.create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdTenant(
  id: string,
  model: TenantModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await tenantService.updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsTenant(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await tenantService.deleteByIds(ids);
  return data;
}

/**
 * 导入租户
 */
export async function importFileTenant(
  id: string,
) {
  const data = await tenantService.importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsTenant(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await tenantService.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsTenant(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await tenantService.forceDeleteByIds(ids);
  return data;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByTenant() {
  const data = await tenantService.findLastOrderBy();
  return data;
}
