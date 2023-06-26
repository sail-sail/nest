import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type RoleInput,
  type RoleSearch,
} from "./role.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountRole(
  search?: RoleSearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./role.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllRole(
  search?: RoleSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const { findAll } = await import("./role.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsRole() {
  const { getFieldComments } = await import("./role.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneRole(
  search?: RoleSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./role.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdRole(
  id: string,
) {
  const { findById } = await import("./role.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createRole(
  input: RoleInput,
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/role",
    "add",
  );
  
  const {
    create,
  } = await import("./role.service.ts");
  const res = await create(input);
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdRole(
  id: string,
  input: RoleInput,
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/role",
    "edit",
  );
  
  const {
    updateById,
  } = await import("./role.service.ts");
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsRole(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/role",
    "delete",
  );
  
  const {
    deleteByIds,
  } = await import("./role.service.ts");
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用数据
 */
export async function enableByIdsRole(
  ids: string[],
  is_enabled: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsRole.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/role",
    "lock",
  );
  
  const {
    enableByIds,
  } = await import("./role.service.ts");
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsRole(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/role",
    "delete",
  );
  
  const {
    revertByIds,
  } = await import("./role.service.ts");
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsRole(
  ids: string[],
) {
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
