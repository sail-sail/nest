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
  intoInputTenant,
} from "./tenant.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找租户总数
 */
export async function findCountTenant(
  search?: TenantSearch,
): Promise<number> {
  
  const {
    findCountTenant,
  } = await import("./tenant.service.ts");
  
  const num = await findCountTenant(search);
  
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
    findAllTenant,
  } = await import("./tenant.service.ts");
  
  checkSortTenant(sort);
  
  const models = await findAllTenant(search, page, sort);
  
  return models;
}

/**
 * 获取租户字段注释
 */
export async function getFieldCommentsTenant(): Promise<TenantFieldComment> {
  
  const {
    getFieldCommentsTenant,
  } = await import("./tenant.service.ts");
  
  const field_comment = await getFieldCommentsTenant();
  
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
    findOneTenant,
  } = await import("./tenant.service.ts");
  
  checkSortTenant(sort);
  
  const model = await findOneTenant(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个租户, 如果不存在则抛错
 */
export async function findOneOkTenant(
  search?: TenantSearch,
  sort?: SortInput[],
): Promise<TenantModel> {
  
  const {
    findOneOkTenant,
  } = await import("./tenant.service.ts");
  
  checkSortTenant(sort);
  
  const model = await findOneOkTenant(search, sort);
  
  return model;
}

/**
 * 根据 id 查找租户
 */
export async function findByIdTenant(
  id: TenantId,
): Promise<TenantModel | undefined> {
  
  const {
    findByIdTenant,
  } = await import("./tenant.service.ts");
  
  const model = await findByIdTenant(id);
  
  return model;
}

/**
 * 根据 id 查找租户, 如果不存在则抛错
 */
export async function findByIdOkTenant(
  id: TenantId,
): Promise<TenantModel | undefined> {
  
  const {
    findByIdOkTenant,
  } = await import("./tenant.service.ts");
  
  const model = await findByIdOkTenant(id);
  
  return model;
}

/**
 * 根据 ids 查找租户
 */
export async function findByIdsTenant(
  ids: TenantId[],
): Promise<TenantModel[]> {
  
  const {
    findByIdsTenant,
  } = await import("./tenant.service.ts");
  
  const models = await findByIdsTenant(ids);
  
  return models;
}

/**
 * 根据 ids 查找租户, 出现查询不到的 id 则报错
 */
export async function findByIdsOkTenant(
  ids: TenantId[],
): Promise<TenantModel[]> {
  
  const {
    findByIdsOkTenant,
  } = await import("./tenant.service.ts");
  
  const models = await findByIdsOkTenant(ids);
  
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
    validateTenant,
    setIdByLblTenant,
    createsTenant,
  } = await import("./tenant.service.ts");
  
  const {
    getPagePathTenant,
  } = await import("./tenant.model.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    getPagePathTenant(),
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputTenant(input);
    
    await setIdByLblTenant(input);
    
    await validateTenant(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsTenant(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改租户
 */
export async function updateByIdTenant(
  id: TenantId,
  input: TenantInput,
): Promise<TenantId> {
  
  intoInputTenant(input);
  
  const {
    setIdByLblTenant,
    updateByIdTenant,
  } = await import("./tenant.service.ts");
  
  const {
    getPagePathTenant,
  } = await import("./tenant.model.ts");
  
  set_is_tran(true);
  
  await setIdByLblTenant(input);
  
  await usePermit(
    getPagePathTenant(),
    "edit",
  );
  
  const id2: TenantId = await updateByIdTenant(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除租户
 */
export async function deleteByIdsTenant(
  ids: TenantId[],
): Promise<number> {
  
  const {
    deleteByIdsTenant,
  } = await import("./tenant.service.ts");
  
  const {
    getPagePathTenant,
  } = await import("./tenant.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathTenant(),
    "delete",
  );
  
  const num = await deleteByIdsTenant(ids);
  
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
    enableByIdsTenant,
  } = await import("./tenant.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsTenant.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  const {
    getPagePathTenant,
  } = await import("./tenant.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathTenant(),
    "edit",
  );
  const res = await enableByIdsTenant(ids, is_enabled);
  
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
    lockByIdsTenant,
  } = await import("./tenant.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsTenant.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  const {
    getPagePathTenant,
  } = await import("./tenant.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathTenant(),
    "edit",
  );
  
  const res = await lockByIdsTenant(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原租户
 */
export async function revertByIdsTenant(
  ids: TenantId[],
): Promise<number> {
  
  const {
    revertByIdsTenant,
  } = await import("./tenant.service.ts");
  
  const {
    getPagePathTenant,
  } = await import("./tenant.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathTenant(),
    "delete",
  );
  
  const res = await revertByIdsTenant(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除租户
 */
export async function forceDeleteByIdsTenant(
  ids: TenantId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsTenant,
  } = await import("./tenant.service.ts");
  
  const {
    getPagePathTenant,
  } = await import("./tenant.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathTenant(),
    "force_delete",
  );
  
  const res = await forceDeleteByIdsTenant(ids);
  
  return res;
}

/**
 * 查找 租户 order_by 字段的最大值
 */
export async function findLastOrderByTenant(
  search?: TenantSearch,
): Promise<number> {
  
  const {
    findLastOrderByTenant,
  } = await import("./tenant.service.ts");
  
  const order_by = findLastOrderByTenant(search);
  
  return order_by;
}
