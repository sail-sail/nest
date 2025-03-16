import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as tenantDao from "./tenant.dao.ts";

async function setSearchQuery(
  _search: TenantSearch,
) {
  
}

/**
 * 根据条件查找租户总数
 */
export async function findCount(
  search?: TenantSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const tenant_num = await tenantDao.findCount(search);
  
  return tenant_num;
}

/**
 * 根据搜索条件和分页查找租户列表
 */
export async function findAll(
  search?: TenantSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<TenantModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const tenant_models = await tenantDao.findAll(search, page, sort);
  
  return tenant_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: TenantInput,
): Promise<void> {
  await tenantDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个租户
 */
export async function findOne(
  search?: TenantSearch,
  sort?: SortInput[],
): Promise<TenantModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const tenant_model = await tenantDao.findOne(search, sort);
  
  return tenant_model;
}

/**
 * 根据 id 查找租户
 */
export async function findById(
  id?: TenantId | null,
): Promise<TenantModel | undefined> {
  
  const tenant_model = await tenantDao.findById(id);
  
  return tenant_model;
}

/**
 * 根据搜索条件查找租户是否存在
 */
export async function exist(
  search?: TenantSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const tenant_exist = await tenantDao.exist(search);
  
  return tenant_exist;
}

/**
 * 根据 id 查找租户是否存在
 */
export async function existById(
  id?: TenantId | null,
): Promise<boolean> {
  
  const tenant_exist = await tenantDao.existById(id);
  
  return tenant_exist;
}

/**
 * 增加和修改时校验租户
 */
export async function validate(
  input: TenantInput,
): Promise<void> {
  await tenantDao.validate(input);
}

/**
 * 批量创建租户
 */
export async function creates(
  inputs: TenantInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<TenantId[]> {
  const tenant_ids = await tenantDao.creates(inputs, options);
  
  return tenant_ids;
}

/**
 * 根据 id 修改租户
 */
export async function updateById(
  tenant_id: TenantId,
  input: TenantInput,
): Promise<TenantId> {
  
  const is_locked = await tenantDao.getIsLockedById(tenant_id);
  if (is_locked) {
    throw "不能修改已经锁定的 租户";
  }
  
  const tenant_id2 = await tenantDao.updateById(tenant_id, input);
  
  return tenant_id2;
}

/** 校验租户是否存在 */
export async function validateOption(
  model0?: TenantModel,
): Promise<TenantModel> {
  const tenant_model = await tenantDao.validateOption(model0);
  return tenant_model;
}

/**
 * 根据 ids 删除租户
 */
export async function deleteByIds(
  ids: TenantId[],
): Promise<number> {
  
  const old_models = await tenantDao.findAll({
    ids,
  });
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 租户";
    }
  }
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const tenant_num = await tenantDao.deleteByIds(ids);
  return tenant_num;
}

/**
 * 根据 ids 启用或者禁用租户
 */
export async function enableByIds(
  ids: TenantId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const tenant_num = await tenantDao.enableByIds(ids, is_enabled);
  return tenant_num;
}

/**
 * 根据 ids 锁定或者解锁租户
 */
export async function lockByIds(
  ids: TenantId[],
  is_locked: 0 | 1,
): Promise<number> {
  const tenant_num = await tenantDao.lockByIds(ids, is_locked);
  return tenant_num;
}

/**
 * 根据 ids 还原租户
 */
export async function revertByIds(
  ids: TenantId[],
): Promise<number> {
  
  const tenant_num = await tenantDao.revertByIds(ids);
  
  return tenant_num;
}

/**
 * 根据 ids 彻底删除租户
 */
export async function forceDeleteByIds(
  ids: TenantId[],
): Promise<number> {
  
  const tenant_num = await tenantDao.forceDeleteByIds(ids);
  
  return tenant_num;
}

/**
 * 获取租户字段注释
 */
export async function getFieldComments(): Promise<TenantFieldComment> {
  const tenant_fields = await tenantDao.getFieldComments();
  return tenant_fields;
}

/**
 * 查找 租户 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const tenant_sort = await tenantDao.findLastOrderBy();
  return tenant_sort;
}
