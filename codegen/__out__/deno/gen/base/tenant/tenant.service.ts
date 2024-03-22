import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import type {
  TenantInput,
  TenantModel,
  TenantSearch,
  TenantFieldComment,
  TenantId,
} from "./tenant.model.ts";

import * as tenantDao from "./tenant.dao.ts";

/**
 * 根据条件查找租户总数
 * @param {TenantSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: TenantSearch,
): Promise<number> {
  search = search || { };
  const data = await tenantDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找租户列表
 * @param {TenantSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<TenantModel[]>} 
 */
export async function findAll(
  search?: TenantSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<TenantModel[]> {
  search = search || { };
  const models: TenantModel[] = await tenantDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: TenantInput,
) {
  const data = await tenantDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个租户
 * @param {TenantSearch} search? 搜索条件
 */
export async function findOne(
  search?: TenantSearch,
  sort?: SortInput|SortInput[],
): Promise<TenantModel | undefined> {
  search = search || { };
  const model = await tenantDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找租户
 * @param {TenantId} id
 */
export async function findById(
  id?: TenantId | null,
): Promise<TenantModel | undefined> {
  const model = await tenantDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找租户是否存在
 * @param {TenantSearch} search? 搜索条件
 */
export async function exist(
  search?: TenantSearch,
): Promise<boolean> {
  search = search || { };
  const data = await tenantDao.exist(search);
  return data;
}

/**
 * 根据 id 查找租户是否存在
 * @param {TenantId} id
 */
export async function existById(
  id?: TenantId | null,
): Promise<boolean> {
  const data = await tenantDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验租户
 * @param input 
 */
export async function validate(
  input: TenantInput,
): Promise<void> {
  const data = await tenantDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {TenantInput} input
 * @return {Promise<TenantId>} id
 */
export async function create(
  input: TenantInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<TenantId> {
  const id: TenantId = await tenantDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改租户
 * @param {TenantId} id
 * @param {TenantInput} input
 * @return {Promise<TenantId>}
 */
export async function updateById(
  id: TenantId,
  input: TenantInput,
): Promise<TenantId> {
  
  const is_locked = await tenantDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  // 不能修改系统记录的系统字段
  const model = await tenantDao.findById(id);
  if (model && model.is_sys === 1) {
    // 名称
    input.lbl = undefined;
  }
  
  const id2: TenantId = await tenantDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除租户
 * @param {TenantId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: TenantId[],
): Promise<number> {
  
  {
    const ids2: TenantId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: TenantId = ids[i];
      const is_locked = await tenantDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  {
    const ids2: TenantId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: TenantId = ids[i];
      const model = await tenantDao.findById(id);
      if (model && model.is_sys === 1) {
        continue;
      }
      ids2.push(id);
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除系统记录");
    }
    ids = ids2;
  }
  
  const data = await tenantDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用租户
 * @param {TenantId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
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
 * @param {TenantId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
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
 * @param {TenantId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: TenantId[],
): Promise<number> {
  const data = await tenantDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除租户
 * @param {TenantId[]} ids
 * @return {Promise<number>}
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
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await tenantDao.findLastOrderBy();
  return data;
}
