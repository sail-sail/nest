import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import * as roleService from "./role.service.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type RoleModel,
  type RoleSearch,
} from "./role.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountRole(
  search?: RoleSearch & { $extra?: SearchExtra[] },
) {
  const data = await roleService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllRole(
  search?: RoleSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const data = await roleService.findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelRole(
  search?: RoleSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await roleService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneRole(
  search?: RoleSearch & { $extra?: SearchExtra[] },
) {
  const data = await roleService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdRole(
  id: string,
) {
  const data = await roleService.findById(id);
  return data;
}

/**
 * 创建一条数据
 */
export async function createRole(
  model: RoleModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await roleService.create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdRole(
  id: string,
  model: RoleModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await roleService.updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsRole(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await roleService.deleteByIds(ids);
  return data;
}

/**
 * 导入角色
 */
export async function importFileRole(
  id: string,
) {
  const data = await roleService.importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsRole(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await roleService.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsRole(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await roleService.forceDeleteByIds(ids);
  return data;
}
