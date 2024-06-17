import {
  set_is_tran,
  set_is_creating,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortMenu,
} from "./menu.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找菜单总数
 */
export async function findCountMenu(
  search?: MenuSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./menu.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找菜单列表
 */
export async function findAllMenu(
  search?: MenuSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<MenuModel[]> {
  
  const {
    findAll,
  } = await import("./menu.service.ts");
  
  checkSortMenu(sort);
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取菜单字段注释
 */
export async function getFieldCommentsMenu(): Promise<MenuFieldComment> {
  const { getFieldComments } = await import("./menu.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个菜单
 */
export async function findOneMenu(
  search?: MenuSearch,
  sort?: SortInput[],
): Promise<MenuModel | undefined> {
  
  const {
    findOne,
  } = await import("./menu.service.ts");
  
  checkSortMenu(sort);
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找菜单
 */
export async function findByIdMenu(
  id: MenuId,
): Promise<MenuModel | undefined> {
  
  const {
    findById,
  } = await import("./menu.service.ts");
  
  const res = await findById(id);
  
  return res;
}

/**
 * 批量创建菜单
 */
export async function createsMenu(
  inputs: MenuInput[],
  unique_type?: UniqueType,
): Promise<MenuId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./menu.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    "/base/menu",
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLbl(input);
    
    await validate(input);
  }
  const uniqueType = unique_type;
  const ids = await creates(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改菜单
 */
export async function updateByIdMenu(
  id: MenuId,
  input: MenuInput,
): Promise<MenuId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./menu.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/menu",
    "edit",
  );
  const id2: MenuId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除菜单
 */
export async function deleteByIdsMenu(
  ids: MenuId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./menu.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    "/base/menu",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用菜单
 */
export async function enableByIdsMenu(
  ids: MenuId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./menu.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsMenu.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    "/base/menu",
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁菜单
 */
export async function lockByIdsMenu(
  ids: MenuId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./menu.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsMenu.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    "/base/menu",
    "edit",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原菜单
 */
export async function revertByIdsMenu(
  ids: MenuId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./menu.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    "/base/menu",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除菜单
 */
export async function forceDeleteByIdsMenu(
  ids: MenuId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./menu.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    "/base/menu",
    "force_delete",
  );
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 菜单 order_by 字段的最大值
 */
export async function findLastOrderByMenu(): Promise<number> {
  const { findLastOrderBy } = await import("./menu.service.ts");
  const res = findLastOrderBy();
  return res;
}
