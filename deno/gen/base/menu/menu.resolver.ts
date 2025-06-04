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

import {
  route_path,
} from "./menu.model.ts";

/**
 * 根据条件查找菜单总数
 */
export async function findCountMenu(
  search?: MenuSearch,
): Promise<number> {
  
  const {
    findCountMenu,
  } = await import("./menu.service.ts");
  
  search = search || { };
  search.is_hidden = [ 0 ];
  
  const num = await findCountMenu(search);
  
  return num;
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
    findAllMenu,
  } = await import("./menu.service.ts");
  
  search = search || { };
  search.is_hidden = [ 0 ];
  
  checkSortMenu(sort);
  
  const models = await findAllMenu(search, page, sort);
  
  return models;
}

/**
 * 获取菜单字段注释
 */
export async function getFieldCommentsMenu(): Promise<MenuFieldComment> {
  
  const {
    getFieldCommentsMenu,
  } = await import("./menu.service.ts");
  
  const field_comment = await getFieldCommentsMenu();
  
  return field_comment;
}

/**
 * 根据条件查找第一个菜单
 */
export async function findOneMenu(
  search?: MenuSearch,
  sort?: SortInput[],
): Promise<MenuModel | undefined> {
  
  const {
    findOneMenu,
  } = await import("./menu.service.ts");
  
  search = search || { };
  search.is_hidden = [ 0 ];
  
  checkSortMenu(sort);
  
  const model = await findOneMenu(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个菜单, 如果不存在则抛错
 */
export async function findOneOkMenu(
  search?: MenuSearch,
  sort?: SortInput[],
): Promise<MenuModel> {
  
  const {
    findOneOkMenu,
  } = await import("./menu.service.ts");
  
  search = search || { };
  search.is_hidden = [ 0 ];
  
  checkSortMenu(sort);
  
  const model = await findOneOkMenu(search, sort);
  
  return model;
}

/**
 * 根据 id 查找菜单
 */
export async function findByIdMenu(
  id: MenuId,
): Promise<MenuModel | undefined> {
  
  const {
    findByIdMenu,
  } = await import("./menu.service.ts");
  
  const model = await findByIdMenu(id);
  
  return model;
}

/**
 * 根据 id 查找菜单, 如果不存在则抛错
 */
export async function findByIdOkMenu(
  id: MenuId,
): Promise<MenuModel | undefined> {
  
  const {
    findByIdOkMenu,
  } = await import("./menu.service.ts");
  
  const model = await findByIdOkMenu(id);
  
  return model;
}

/**
 * 根据 ids 查找菜单
 */
export async function findByIdsMenu(
  ids: MenuId[],
): Promise<MenuModel[]> {
  
  const {
    findByIdsMenu,
  } = await import("./menu.service.ts");
  
  const models = await findByIdsMenu(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 查找菜单, 出现查询不到的 id 则报错
 */
export async function findByIdsOkMenu(
  ids: MenuId[],
): Promise<MenuModel[]> {
  
  const {
    findByIdsOkMenu,
  } = await import("./menu.service.ts");
  
  const models = await findByIdsOkMenu(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建菜单
 */
export async function createsMenu(
  inputs: MenuInput[],
  unique_type?: UniqueType,
): Promise<MenuId[]> {
  
  const {
    validateMenu,
    setIdByLblMenu,
    createsMenu,
  } = await import("./menu.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblMenu(input);
    
    await validateMenu(input);
  }
  const uniqueType = unique_type;
  const ids = await createsMenu(inputs, { uniqueType });
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
    setIdByLblMenu,
    updateByIdMenu,
  } = await import("./menu.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblMenu(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: MenuId = await updateByIdMenu(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除菜单
 */
export async function deleteByIdsMenu(
  ids: MenuId[],
): Promise<number> {
  
  const {
    deleteByIdsMenu,
  } = await import("./menu.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsMenu(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用菜单
 */
export async function enableByIdsMenu(
  ids: MenuId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsMenu,
  } = await import("./menu.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsMenu.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsMenu(ids, is_enabled);
  
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
    lockByIdsMenu,
  } = await import("./menu.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsMenu.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsMenu(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原菜单
 */
export async function revertByIdsMenu(
  ids: MenuId[],
): Promise<number> {
  
  const {
    revertByIdsMenu,
  } = await import("./menu.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsMenu(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除菜单
 */
export async function forceDeleteByIdsMenu(
  ids: MenuId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsMenu,
  } = await import("./menu.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsMenu(ids);
  
  return res;
}

/**
 * 查找 菜单 order_by 字段的最大值
 */
export async function findLastOrderByMenu(): Promise<number> {
  
  const {
    findLastOrderByMenu,
  } = await import("./menu.service.ts");
  
  const res = findLastOrderByMenu();
  
  return res;
}
