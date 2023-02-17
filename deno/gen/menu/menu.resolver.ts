import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as menuService
} from "./menu.service.ts";

import {
  type MenuModel,
  type MenuSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

export const _internals = {
  findCountMenu,
  findAllMenu,
  exportExcelMenu,
  findOneMenu,
  findByIdMenu,
  createMenu,
  updateByIdMenu,
  deleteByIdsMenu,
  importFileMenu,
  revertByIdsMenu,
  forceDeleteByIdsMenu,
  findLastOrderByMenu,
};

/**
 * 根据条件查找据数总数
 */
async function findCountMenu(
  search?: MenuSearch & { $extra?: SearchExtra[] },
) {
  const data = await menuService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllMenu(
  search?: MenuSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const data = await menuService.findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelMenu(
  search?: MenuSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await menuService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneMenu(
  search?: MenuSearch & { $extra?: SearchExtra[] },
) {
  const data = await menuService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdMenu(
  id: string,
) {
  const data = await menuService.findById(id);
  return data;
}

/**
 * 创建一条数据
 */
async function createMenu(
  model: MenuModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await menuService.create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
async function updateByIdMenu(
  id: string,
  model: MenuModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await menuService.updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsMenu(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await menuService.deleteByIds(ids);
  return data;
}

/**
 * 导入菜单
 */
async function importFileMenu(
  id: string,
) {
  const data = await menuService.importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsMenu(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await menuService.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsMenu(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await menuService.forceDeleteByIds(ids);
  return data;
}

/**
 * 查找 order_by 字段的最大值
 */
async function findLastOrderByMenu() {
  const data = await menuService.findLastOrderBy();
  return data;
}
