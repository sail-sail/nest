import {
  ns,
} from "/src/base/i18n/i18n.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type TenantInput,
  type TenantModel,
  type TenantSearch,
} from "./tenant.model.ts";

import * as tenantDao from "./tenant.dao.ts";

/**
 * 根据条件查找总数
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
 * 根据条件和分页查找数据
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
  const data: TenantModel[] = await tenantDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {TenantSearch} search? 搜索条件
 */
export async function findOne(
  search?: TenantSearch,
  sort?: SortInput|SortInput[],
) {
  search = search || { };
  const data = await tenantDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await tenantDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {TenantSearch} search? 搜索条件
 */
export async function exist(
  search?: TenantSearch,
) {
  search = search || { };
  const data = await tenantDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await tenantDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {TenantInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: TenantInput,
): Promise<string> {
  const data = await tenantDao.create(input);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {TenantInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: TenantInput,
): Promise<string> {
  
  const is_locked = await tenantDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  const data = await tenantDao.updateById(id, input);
  return data;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
): Promise<number> {
  
  const lockedIds: string[] = [ ];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const is_locked = await tenantDao.getIsLockedById(id);
    if (is_locked) {
      lockedIds.push(id);
    }
  }
  if (lockedIds.length > 0 && lockedIds.length === ids.length) {
    throw await ns("不能删除已经锁定的数据");
  }
  const data = await tenantDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或禁用数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: string[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await tenantDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或解锁数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await tenantDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
): Promise<number> {
  const data = await tenantDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: string[],
): Promise<number> {
  const data = await tenantDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const data = await tenantDao.getFieldComments();
  return data;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await tenantDao.findLastOrderBy();
  return data;
}
