import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

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
  
  const data = await tenantDao.findCount(search);
  return data;
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
  
  const models: TenantModel[] = await tenantDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: TenantInput,
) {
  const data = await tenantDao.setIdByLbl(input);
  return data;
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
  
  const model = await tenantDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找租户
 */
export async function findById(
  id?: TenantId | null,
): Promise<TenantModel | undefined> {
  const model = await tenantDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找租户是否存在
 */
export async function exist(
  search?: TenantSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await tenantDao.exist(search);
  return data;
}

/**
 * 根据 id 查找租户是否存在
 */
export async function existById(
  id?: TenantId | null,
): Promise<boolean> {
  const data = await tenantDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验租户
 */
export async function validate(
  input: TenantInput,
): Promise<void> {
  const data = await tenantDao.validate(input);
  return data;
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
  const ids = await tenantDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改租户
 */
export async function updateById(
  id: TenantId,
  input: TenantInput,
): Promise<TenantId> {
  
  const is_locked = await tenantDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2 = await tenantDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除租户
 */
export async function deleteByIds(
  ids: TenantId[],
): Promise<number> {
  
  {
    const models = await tenantDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw await ns("不能删除已经锁定的 {0}", "租户");
      }
    }
  }
  
  {
    const models = await tenantDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw await ns("不能删除系统记录");
      }
    }
  }
  
  const data = await tenantDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用租户
 */
export async function enableByIds(
  ids: TenantId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await tenantDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁租户
 */
export async function lockByIds(
  ids: TenantId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await tenantDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原租户
 */
export async function revertByIds(
  ids: TenantId[],
): Promise<number> {
  const data = await tenantDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除租户
 */
export async function forceDeleteByIds(
  ids: TenantId[],
): Promise<number> {
  const data = await tenantDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取租户字段注释
 */
export async function getFieldComments(): Promise<TenantFieldComment> {
  const data = await tenantDao.getFieldComments();
  return data;
}

/**
 * 查找 租户 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await tenantDao.findLastOrderBy();
  return data;
}
