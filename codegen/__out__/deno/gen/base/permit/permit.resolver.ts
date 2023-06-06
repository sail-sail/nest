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
  type PermitModel,
  type PermitSearch,
} from "./permit.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountPermit(
  search?: PermitSearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./permit.service.ts");
  const data = await findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllPermit(
  search?: PermitSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const { findAll } = await import("./permit.service.ts");
  const data = await findAll(search, page, sort);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsPermit() {
  const { getFieldComments } = await import("./permit.service.ts");
  const data = await getFieldComments();
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOnePermit(
  search?: PermitSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./permit.service.ts");
  const data = await findOne(search, sort);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdPermit(
  id: string,
) {
  const { findById } = await import("./permit.service.ts");
  const data = await findById(id);
  return data;
}

/**
 * 创建一条数据
 */
export async function createPermit(
  model: PermitModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const { create } = await import("./permit.service.ts");
  const data = await create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdPermit(
  id: string,
  model: PermitModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const { updateById } = await import("./permit.service.ts");
  const data = await updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsPermit(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { deleteByIds } = await import("./permit.service.ts");
  const data = await deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsPermit(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { revertByIds } = await import("./permit.service.ts");
  const data = await revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsPermit(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { forceDeleteByIds } = await import("./permit.service.ts");
  const data = await forceDeleteByIds(ids);
  return data;
}
