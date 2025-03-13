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
  
  const data = await menuDao.findCount(search);
  return data;
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
  
  const models: MenuModel[] = await menuDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: MenuInput,
) {
  const data = await menuDao.setIdByLbl(input);
  return data;
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
  
  const model = await menuDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找菜单
 */
export async function findById(
  id?: MenuId | null,
): Promise<MenuModel | undefined> {
  const model = await menuDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找菜单是否存在
 */
export async function exist(
  search?: MenuSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await menuDao.exist(search);
  return data;
}

/**
 * 根据 id 查找菜单是否存在
 */
export async function existById(
  id?: MenuId | null,
): Promise<boolean> {
  const data = await menuDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验菜单
 */
export async function validate(
  input: MenuInput,
): Promise<void> {
  const data = await menuDao.validate(input);
  return data;
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
  const ids = await menuDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改菜单
 */
export async function updateById(
  id: MenuId,
  input: MenuInput,
): Promise<MenuId> {
  
  const is_locked = await menuDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 菜单";
  }
  
  const id2 = await menuDao.updateById(id, input);
  return id2;
}

/** 校验菜单是否存在 */
export async function validateOption(
  model0?: MenuModel,
): Promise<MenuModel> {
  const model = await menuDao.validateOption(model0);
  return model;
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
  
  const data = await menuDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用菜单
 */
export async function enableByIds(
  ids: MenuId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await menuDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁菜单
 */
export async function lockByIds(
  ids: MenuId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await menuDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原菜单
 */
export async function revertByIds(
  ids: MenuId[],
): Promise<number> {
  const data = await menuDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除菜单
 */
export async function forceDeleteByIds(
  ids: MenuId[],
): Promise<number> {
  const data = await menuDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取菜单字段注释
 */
export async function getFieldComments(): Promise<MenuFieldComment> {
  const data = await menuDao.getFieldComments();
  return data;
}

/**
 * 查找 菜单 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await menuDao.findLastOrderBy();
  return data;
}
