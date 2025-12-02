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
  checkSortRole,
  intoInputRole,
} from "./role.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找角色总数
 */
export async function findCountRole(
  search?: RoleSearch,
): Promise<number> {
  
  const {
    findCountRole,
  } = await import("./role.service.ts");
  
  const num = await findCountRole(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找角色列表
 */
export async function findAllRole(
  search?: RoleSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<RoleModel[]> {
  
  const {
    findAllRole,
  } = await import("./role.service.ts");
  
  checkSortRole(sort);
  
  const models = await findAllRole(search, page, sort);
  
  return models;
}

/**
 * 获取角色字段注释
 */
export async function getFieldCommentsRole(): Promise<RoleFieldComment> {
  
  const {
    getFieldCommentsRole,
  } = await import("./role.service.ts");
  
  const field_comment = await getFieldCommentsRole();
  
  return field_comment;
}

/**
 * 根据条件查找第一个角色
 */
export async function findOneRole(
  search?: RoleSearch,
  sort?: SortInput[],
): Promise<RoleModel | undefined> {
  
  const {
    findOneRole,
  } = await import("./role.service.ts");
  
  checkSortRole(sort);
  
  const model = await findOneRole(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个角色, 如果不存在则抛错
 */
export async function findOneOkRole(
  search?: RoleSearch,
  sort?: SortInput[],
): Promise<RoleModel> {
  
  const {
    findOneOkRole,
  } = await import("./role.service.ts");
  
  checkSortRole(sort);
  
  const model = await findOneOkRole(search, sort);
  
  return model;
}

/**
 * 根据 id 查找角色
 */
export async function findByIdRole(
  id: RoleId,
): Promise<RoleModel | undefined> {
  
  const {
    findByIdRole,
  } = await import("./role.service.ts");
  
  const model = await findByIdRole(id);
  
  return model;
}

/**
 * 根据 id 查找角色, 如果不存在则抛错
 */
export async function findByIdOkRole(
  id: RoleId,
): Promise<RoleModel | undefined> {
  
  const {
    findByIdOkRole,
  } = await import("./role.service.ts");
  
  const model = await findByIdOkRole(id);
  
  return model;
}

/**
 * 根据 ids 查找角色
 */
export async function findByIdsRole(
  ids: RoleId[],
): Promise<RoleModel[]> {
  
  const {
    findByIdsRole,
  } = await import("./role.service.ts");
  
  const models = await findByIdsRole(ids);
  
  return models;
}

/**
 * 根据 ids 查找角色, 出现查询不到的 id 则报错
 */
export async function findByIdsOkRole(
  ids: RoleId[],
): Promise<RoleModel[]> {
  
  const {
    findByIdsOkRole,
  } = await import("./role.service.ts");
  
  const models = await findByIdsOkRole(ids);
  
  return models;
}

/**
 * 批量创建角色
 */
export async function createsRole(
  inputs: RoleInput[],
  unique_type?: UniqueType,
): Promise<RoleId[]> {
  
  const {
    validateRole,
    setIdByLblRole,
    createsRole,
  } = await import("./role.service.ts");
  
  const {
    getPagePathRole,
  } = await import("./role.model.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    getPagePathRole(),
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputRole(input);
    
    await setIdByLblRole(input);
    
    await validateRole(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsRole(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改角色
 */
export async function updateByIdRole(
  id: RoleId,
  input: RoleInput,
): Promise<RoleId> {
  
  intoInputRole(input);
  
  const {
    setIdByLblRole,
    updateByIdRole,
  } = await import("./role.service.ts");
  
  const {
    getPagePathRole,
  } = await import("./role.model.ts");
  
  set_is_tran(true);
  
  await setIdByLblRole(input);
  
  await usePermit(
    getPagePathRole(),
    "edit",
  );
  
  const id2: RoleId = await updateByIdRole(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除角色
 */
export async function deleteByIdsRole(
  ids: RoleId[],
): Promise<number> {
  
  const {
    deleteByIdsRole,
  } = await import("./role.service.ts");
  
  const {
    getPagePathRole,
  } = await import("./role.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathRole(),
    "delete",
  );
  
  const num = await deleteByIdsRole(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用角色
 */
export async function enableByIdsRole(
  ids: RoleId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsRole,
  } = await import("./role.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsRole.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  const {
    getPagePathRole,
  } = await import("./role.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathRole(),
    "edit",
  );
  const res = await enableByIdsRole(ids, is_enabled);
  
  return res;
}

/**
 * 根据 ids 锁定或者解锁角色
 */
export async function lockByIdsRole(
  ids: RoleId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIdsRole,
  } = await import("./role.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsRole.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  const {
    getPagePathRole,
  } = await import("./role.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathRole(),
    "edit",
  );
  
  const res = await lockByIdsRole(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原角色
 */
export async function revertByIdsRole(
  ids: RoleId[],
): Promise<number> {
  
  const {
    revertByIdsRole,
  } = await import("./role.service.ts");
  
  const {
    getPagePathRole,
  } = await import("./role.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathRole(),
    "delete",
  );
  
  const res = await revertByIdsRole(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除角色
 */
export async function forceDeleteByIdsRole(
  ids: RoleId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsRole,
  } = await import("./role.service.ts");
  
  const {
    getPagePathRole,
  } = await import("./role.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathRole(),
    "force_delete",
  );
  
  const res = await forceDeleteByIdsRole(ids);
  
  return res;
}

/**
 * 查找 角色 order_by 字段的最大值
 */
export async function findLastOrderByRole(): Promise<number> {
  
  const {
    findLastOrderByRole,
  } = await import("./role.service.ts");
  
  const res = findLastOrderByRole();
  
  return res;
}
