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
  checkSortTenant,
} from "./tenant.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./tenant.model.ts";

/**
 * 根据条件查找租户总数
 */
export async function findCountTenant(
  search?: TenantSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./tenant.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找租户列表
 */
export async function findAllTenant(
  search?: TenantSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<TenantModel[]> {
  
  const {
    findAll,
  } = await import("./tenant.service.ts");
  
  checkSortTenant(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取租户字段注释
 */
export async function getFieldCommentsTenant(): Promise<TenantFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./tenant.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个租户
 */
export async function findOneTenant(
  search?: TenantSearch,
  sort?: SortInput[],
): Promise<TenantModel | undefined> {
  
  const {
    findOne,
  } = await import("./tenant.service.ts");
  
  checkSortTenant(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找租户
 */
export async function findByIdTenant(
  id: TenantId,
): Promise<TenantModel | undefined> {
  
  const {
    findById,
  } = await import("./tenant.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找租户
 */
export async function findByIdsTenant(
  ids: TenantId[],
): Promise<TenantModel[]> {
  
  const {
    findByIds,
  } = await import("./tenant.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建租户
 */
export async function createsTenant(
  inputs: TenantInput[],
  unique_type?: UniqueType,
): Promise<TenantId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./tenant.service.ts");
  
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
 * 根据 id 修改租户
 */
export async function updateByIdTenant(
  id: TenantId,
  input: TenantInput,
): Promise<TenantId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./tenant.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: TenantId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除租户
 */
export async function deleteByIdsTenant(
  ids: TenantId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./tenant.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用租户
 */
export async function enableByIdsTenant(
  ids: TenantId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./tenant.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsTenant.is_enabled expect 0 or 1 but got ${ is_enabled }`);
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
 * 根据 ids 锁定或者解锁租户
 */
export async function lockByIdsTenant(
  ids: TenantId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./tenant.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsTenant.is_locked expect 0 or 1 but got ${ is_locked }`);
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
 * 根据 ids 还原租户
 */
export async function revertByIdsTenant(
  ids: TenantId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./tenant.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除租户
 */
export async function forceDeleteByIdsTenant(
  ids: TenantId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./tenant.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 租户 order_by 字段的最大值
 */
export async function findLastOrderByTenant(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./tenant.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
