import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import * as menuService from "./menu.service.ts";

import {
  type MenuModel,
  type MenuSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountMenu(
  search?: MenuSearch & { $extra?: SearchExtra[] },
) {
  const result = await menuService.findCount(search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllMenu(
  search?: MenuSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await menuService.findAll(search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelMenu(
  search?: MenuSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await menuService.exportExcel(search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneMenu(
  search?: MenuSearch & { $extra?: SearchExtra[] },
) {
  const result = await menuService.findOne(search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdMenu(
  id: string,
) {
  const result = await menuService.findById(id);
  return result;
}

/**
 * 创建一条数据
 */
export async function createMenu(
  model: MenuModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await menuService.create(model);
  return result;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdMenu(
  id: string,
  model: MenuModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await menuService.updateById(id, model);
  return result;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsMenu(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await menuService.deleteByIds(ids);
  return result;
}

/**
 * 导入菜单
 */
export async function importFileMenu(
  id: string,
) {
  const result = await menuService.importFile(id);
  return result;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsMenu(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await menuService.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsMenu(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await menuService.forceDeleteByIds(ids);
  return result;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByMenu() {
  const result = await menuService.findLastOrderBy();
  return result;
}
