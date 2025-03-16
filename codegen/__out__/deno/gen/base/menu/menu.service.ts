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
export async function findCount(
  search?: MenuSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const menu_num = await menuDao.findCount(search);
  
  return menu_num;
}

/**
 * 根据搜索条件和分页查找菜单列表
 */
export async function findAll(
  search?: MenuSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<MenuModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const menu_models = await menuDao.findAll(search, page, sort);
  
  return menu_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: MenuInput,
): Promise<void> {
  await menuDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个菜单
 */
export async function findOne(
  search?: MenuSearch,
  sort?: SortInput[],
): Promise<MenuModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const menu_model = await menuDao.findOne(search, sort);
  
  return menu_model;
}

/**
 * 根据 id 查找菜单
 */
export async function findById(
  id?: MenuId | null,
): Promise<MenuModel | undefined> {
  
  const menu_model = await menuDao.findById(id);
  
  return menu_model;
}

/**
 * 根据搜索条件查找菜单是否存在
 */
export async function exist(
  search?: MenuSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const menu_exist = await menuDao.exist(search);
  
  return menu_exist;
}

/**
 * 根据 id 查找菜单是否存在
 */
export async function existById(
  id?: MenuId | null,
): Promise<boolean> {
  
  const menu_exist = await menuDao.existById(id);
  
  return menu_exist;
}

/**
 * 增加和修改时校验菜单
 */
export async function validate(
  input: MenuInput,
): Promise<void> {
  await menuDao.validate(input);
}

/**
 * 批量创建菜单
 */
export async function creates(
  inputs: MenuInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<MenuId[]> {
  const menu_ids = await menuDao.creates(inputs, options);
  
  return menu_ids;
}

/**
 * 根据 id 修改菜单
 */
export async function updateById(
  menu_id: MenuId,
  input: MenuInput,
): Promise<MenuId> {
  
  const is_locked = await menuDao.getIsLockedById(menu_id);
  if (is_locked) {
    throw "不能修改已经锁定的 菜单";
  }
  
  const menu_id2 = await menuDao.updateById(menu_id, input);
  
  return menu_id2;
}

/** 校验菜单是否存在 */
export async function validateOption(
  model0?: MenuModel,
): Promise<MenuModel> {
  const menu_model = await menuDao.validateOption(model0);
  return menu_model;
}

/**
 * 根据 ids 删除菜单
 */
export async function deleteByIds(
  ids: MenuId[],
): Promise<number> {
  
  const old_models = await menuDao.findAll({
    ids,
  });
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 菜单";
    }
  }
  
  const menu_num = await menuDao.deleteByIds(ids);
  return menu_num;
}

/**
 * 根据 ids 启用或者禁用菜单
 */
export async function enableByIds(
  ids: MenuId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const menu_num = await menuDao.enableByIds(ids, is_enabled);
  return menu_num;
}

/**
 * 根据 ids 锁定或者解锁菜单
 */
export async function lockByIds(
  ids: MenuId[],
  is_locked: 0 | 1,
): Promise<number> {
  const menu_num = await menuDao.lockByIds(ids, is_locked);
  return menu_num;
}

/**
 * 根据 ids 还原菜单
 */
export async function revertByIds(
  ids: MenuId[],
): Promise<number> {
  
  const menu_num = await menuDao.revertByIds(ids);
  
  return menu_num;
}

/**
 * 根据 ids 彻底删除菜单
 */
export async function forceDeleteByIds(
  ids: MenuId[],
): Promise<number> {
  
  const menu_num = await menuDao.forceDeleteByIds(ids);
  
  return menu_num;
}

/**
 * 获取菜单字段注释
 */
export async function getFieldComments(): Promise<MenuFieldComment> {
  const menu_fields = await menuDao.getFieldComments();
  return menu_fields;
}

/**
 * 查找 菜单 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const menu_sort = await menuDao.findLastOrderBy();
  return menu_sort;
}
