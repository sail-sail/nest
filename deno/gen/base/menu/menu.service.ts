import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as menuDao from "./menu.dao.ts";

async function setSearchQuery(
  _search: MenuSearch,
) {
  
}

/**
 * 根据条件查找菜单总数
 */
export async function findCountMenu(
  search?: MenuSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const menu_num = await menuDao.findCountMenu(search);
  
  return menu_num;
}

/**
 * 根据搜索条件和分页查找菜单列表
 */
export async function findAllMenu(
  search?: MenuSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<MenuModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const menu_models = await menuDao.findAllMenu(search, page, sort);
  
  return menu_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblMenu(
  input: MenuInput,
): Promise<void> {
  await menuDao.setIdByLblMenu(input);
}

/**
 * 根据条件查找第一个菜单
 */
export async function findOneMenu(
  search?: MenuSearch,
  sort?: SortInput[],
): Promise<MenuModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const menu_model = await menuDao.findOneMenu(search, sort);
  
  return menu_model;
}

/**
 * 根据条件查找第一个菜单, 如果不存在则抛错
 */
export async function findOneOkMenu(
  search?: MenuSearch,
  sort?: SortInput[],
): Promise<MenuModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const menu_model = await menuDao.findOneOkMenu(search, sort);
  
  return menu_model;
}

/**
 * 根据 id 查找菜单
 */
export async function findByIdMenu(
  menu_id: MenuId,
): Promise<MenuModel | undefined> {
  
  const menu_model = await menuDao.findByIdMenu(menu_id);
  
  return menu_model;
}

/**
 * 根据 id 查找菜单, 如果不存在则抛错
 */
export async function findByIdOkMenu(
  menu_id: MenuId,
): Promise<MenuModel> {
  
  const menu_model = await menuDao.findByIdOkMenu(menu_id);
  
  return menu_model;
}

/**
 * 根据 ids 查找菜单
 */
export async function findByIdsMenu(
  menu_ids: MenuId[],
): Promise<MenuModel[]> {
  
  const menu_models = await menuDao.findByIdsMenu(menu_ids);
  
  return menu_models;
}

/**
 * 根据 ids 查找菜单, 出现查询不到的 id 则报错
 */
export async function findByIdsOkMenu(
  menu_ids: MenuId[],
): Promise<MenuModel[]> {
  
  const menu_models = await menuDao.findByIdsOkMenu(menu_ids);
  
  return menu_models;
}

/**
 * 根据搜索条件查找菜单是否存在
 */
export async function existMenu(
  search?: MenuSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const menu_exist = await menuDao.existMenu(search);
  
  return menu_exist;
}

/**
 * 根据 id 查找菜单是否存在
 */
export async function existByIdMenu(
  menu_id?: MenuId | null,
): Promise<boolean> {
  
  const menu_exist = await menuDao.existByIdMenu(menu_id);
  
  return menu_exist;
}

/**
 * 增加和修改时校验菜单
 */
export async function validateMenu(
  input: MenuInput,
): Promise<void> {
  await menuDao.validateMenu(input);
}

/**
 * 批量创建菜单
 */
export async function createsMenu(
  inputs: MenuInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<MenuId[]> {
  const menu_ids = await menuDao.createsMenu(inputs, options);
  
  return menu_ids;
}

/**
 * 根据 id 修改菜单
 */
export async function updateByIdMenu(
  menu_id: MenuId,
  input: MenuInput,
): Promise<MenuId> {
  
  const menu_id2 = await menuDao.updateByIdMenu(menu_id, input);
  
  return menu_id2;
}

/** 校验菜单是否存在 */
export async function validateOptionMenu(
  model0?: MenuModel,
): Promise<MenuModel> {
  const menu_model = await menuDao.validateOptionMenu(model0);
  return menu_model;
}

/**
 * 根据 ids 删除菜单
 */
export async function deleteByIdsMenu(
  menu_ids: MenuId[],
): Promise<number> {
  
  const menu_num = await menuDao.deleteByIdsMenu(menu_ids);
  return menu_num;
}

/**
 * 根据 ids 启用或者禁用菜单
 */
export async function enableByIdsMenu(
  ids: MenuId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const menu_num = await menuDao.enableByIdsMenu(ids, is_enabled);
  return menu_num;
}

/**
 * 根据 ids 还原菜单
 */
export async function revertByIdsMenu(
  menu_ids: MenuId[],
): Promise<number> {
  
  const menu_num = await menuDao.revertByIdsMenu(menu_ids);
  
  return menu_num;
}

/**
 * 根据 ids 彻底删除菜单
 */
export async function forceDeleteByIdsMenu(
  menu_ids: MenuId[],
): Promise<number> {
  
  const menu_num = await menuDao.forceDeleteByIdsMenu(menu_ids);
  
  return menu_num;
}

/**
 * 获取菜单字段注释
 */
export async function getFieldCommentsMenu(): Promise<MenuFieldComment> {
  const menu_fields = await menuDao.getFieldCommentsMenu();
  return menu_fields;
}

/**
 * 查找 菜单 order_by 字段的最大值
 */
export async function findLastOrderByMenu(
): Promise<number> {
  const menu_sort = await menuDao.findLastOrderByMenu();
  return menu_sort;
}
