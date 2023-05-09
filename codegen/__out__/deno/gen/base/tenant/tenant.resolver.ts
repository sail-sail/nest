import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type TenantInput,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type TenantModel,
  type TenantSearch,
} from "./tenant.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountTenant(
  search?: TenantSearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./tenant.service.ts");
  const data = await findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllTenant(
  search?: TenantSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const { findAll } = await import("./tenant.service.ts");
  const data = await findAll(search, page, sort);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsTenant() {
  const { getFieldComments } = await import("./tenant.service.ts");
  const data = await getFieldComments();
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneTenant(
  search?: TenantSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./tenant.service.ts");
  const data = await findOne(search, sort);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdTenant(
  id: string,
) {
  const { findById } = await import("./tenant.service.ts");
  const data = await findById(id);
  return data;
}

/**
 * 创建一条数据
 */
export async function createTenant(
  model: TenantModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const { create } = await import("./tenant.service.ts");
  const data = await create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdTenant(
  id: string,
  model: TenantModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const { updateById } = await import("./tenant.service.ts");
  const data = await updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsTenant(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { deleteByIds } = await import("./tenant.service.ts");
  const data = await deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsTenant(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { revertByIds } = await import("./tenant.service.ts");
  const data = await revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsTenant(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { forceDeleteByIds } = await import("./tenant.service.ts");
  const data = await forceDeleteByIds(ids);
  return data;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByTenant() {
  const { findLastOrderBy } = await import("./tenant.service.ts");
  const data = findLastOrderBy();
  return data;
}
