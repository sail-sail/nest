import {
  useContext,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  RoleInput,
  RoleModel,
  RoleSearch,
  RoleFieldComment,
  RoleId,
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
    findCount,
  } = await import("./role.service.ts");
  
  const res = await findCount(search);
  return res;
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
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取角色字段注释
 */
export async function getFieldCommentsRole(): Promise<RoleFieldComment> {
  const { getFieldComments } = await import("./role.service.ts");
  const res = await getFieldComments();
  return res;
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
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找角色
 */
export async function findByIdRole(
  id: RoleId,
): Promise<RoleModel | undefined> {
  const { findById } = await import("./role.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建角色
 */
export async function createRole(
  input: RoleInput,
  unique_type?: UniqueType,
): Promise<RoleId> {
  
  input.id = undefined;
  
  input.create_usr_id = undefined;
  input.create_usr_id_lbl = undefined;
  
  input.create_time = undefined;
  input.create_time_lbl = undefined;
  
  input.update_usr_id = undefined;
  input.update_usr_id_lbl = undefined;
  
  input.update_time = undefined;
  input.update_time_lbl = undefined;
  
  input.is_deleted = undefined;
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./role.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/base/role",
    "add",
  );
  const uniqueType = unique_type;
  const id: RoleId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改角色
 */
export async function updateByIdRole(
  id: RoleId,
  input: RoleInput,
): Promise<RoleId> {
  
  input.id = undefined;
  
  input.create_usr_id = undefined;
  input.create_usr_id_lbl = undefined;
  
  input.create_time = undefined;
  input.create_time_lbl = undefined;
  
  input.update_usr_id = undefined;
  input.update_usr_id_lbl = undefined;
  
  input.update_time = undefined;
  input.update_time_lbl = undefined;
  
  input.is_deleted = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./role.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/role",
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/role",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
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
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsRole.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/role",
    "enable",
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
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsRole.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/base/role",
    "lock",
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/role",
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
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/role",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./role.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 角色 order_by 字段的最大值
 */
export async function findLastOrderByRole(): Promise<number> {
  const { findLastOrderBy } = await import("./role.service.ts");
  const res = findLastOrderBy();
  return res;
}
