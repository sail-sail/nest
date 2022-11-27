import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as roleService
} from "./role.service.ts";

import {
  type RoleModel,
  type RoleSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

export const _internals = {
  findCountRole,
  findAllRole,
  exportExcelRole,
  findOneRole,
  findByIdRole,
  createRole,
  updateByIdRole,
  deleteByIdsRole,
  importFileRole,
  revertByIdsRole,
  forceDeleteByIdsRole,
};

/**
 * 根据条件查找据数总数
 */
async function findCountRole(
  search?: RoleSearch & { $extra?: SearchExtra[] },
) {
  const result = await roleService.findCount(search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllRole(
  search?: RoleSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await roleService.findAll(search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelRole(
  search?: RoleSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await roleService.exportExcel(search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneRole(
  search?: RoleSearch & { $extra?: SearchExtra[] },
) {
  const result = await roleService.findOne(search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdRole(
  id: string,
) {
  const result = await roleService.findById(id);
  return result;
}

/**
 * 创建一条数据
 */
async function createRole(
  model: RoleModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await roleService.create(model);
  return result;
}

/**
 * 根据id修改一条数据
 */
async function updateByIdRole(
  id: string,
  model: RoleModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await roleService.updateById(id, model);
  return result;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsRole(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await roleService.deleteByIds(ids);
  return result;
}

/**
 * 导入角色
 */
async function importFileRole(
  id: string,
) {
  const result = await roleService.importFile(id);
  return result;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsRole(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await roleService.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsRole(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await roleService.forceDeleteByIds(ids);
  return result;
}
