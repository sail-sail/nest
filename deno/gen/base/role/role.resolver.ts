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
} from "./role.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./role.model.ts";

/**
 * 根据条件查找角色总数
 */
export async function findCountRole(
  search?: RoleSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./role.service.ts");
  
  const num = await findCount(search);
  
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
    findAll,
  } = await import("./role.service.ts");
  
  checkSortRole(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取角色字段注释
 */
export async function getFieldCommentsRole(): Promise<RoleFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./role.service.ts");
  
  const field_comment = await getFieldComments();
  
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
    findOne,
  } = await import("./role.service.ts");
  
  checkSortRole(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找角色
 */
export async function findByIdRole(
  id: RoleId,
): Promise<RoleModel | undefined> {
  
  const {
    findById,
  } = await import("./role.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找角色
 */
export async function findByIdsRole(
  ids: RoleId[],
): Promise<RoleModel[]> {
  
  const {
    findByIds,
  } = await import("./role.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
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
    validate,
    setIdByLbl,
    creates,
  } = await import("./role.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
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
 * 根据 id 修改角色
 */
export async function updateByIdRole(
  id: RoleId,
  input: RoleInput,
): Promise<RoleId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./role.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: RoleId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除角色
 */
export async function deleteByIdsRole(
  ids: RoleId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./role.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
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
    enableByIds,
  } = await import("./role.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsRole.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  
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
    lockByIds,
  } = await import("./role.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsRole.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIds(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原角色
 */
export async function revertByIdsRole(
  ids: RoleId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./role.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除角色
 */
export async function forceDeleteByIdsRole(
  ids: RoleId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./role.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 角色 order_by 字段的最大值
 */
export async function findLastOrderByRole(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./role.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
