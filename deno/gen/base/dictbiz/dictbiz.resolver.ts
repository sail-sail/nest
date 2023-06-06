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
  type DictbizModel,
  type DictbizSearch,
} from "./dictbiz.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountDictbiz(
  search?: DictbizSearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./dictbiz.service.ts");
  const data = await findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllDictbiz(
  search?: DictbizSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const { findAll } = await import("./dictbiz.service.ts");
  const data = await findAll(search, page, sort);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsDictbiz() {
  const { getFieldComments } = await import("./dictbiz.service.ts");
  const data = await getFieldComments();
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneDictbiz(
  search?: DictbizSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./dictbiz.service.ts");
  const data = await findOne(search, sort);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdDictbiz(
  id: string,
) {
  const { findById } = await import("./dictbiz.service.ts");
  const data = await findById(id);
  return data;
}

/**
 * 创建一条数据
 */
export async function createDictbiz(
  model: DictbizModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const { create } = await import("./dictbiz.service.ts");
  const data = await create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdDictbiz(
  id: string,
  model: DictbizModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const { updateById } = await import("./dictbiz.service.ts");
  const data = await updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsDictbiz(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { deleteByIds } = await import("./dictbiz.service.ts");
  const data = await deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsDictbiz(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDictbiz.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const { lockByIds } = await import("./dictbiz.service.ts");
  const data = await lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsDictbiz(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { revertByIds } = await import("./dictbiz.service.ts");
  const data = await revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsDictbiz(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { forceDeleteByIds } = await import("./dictbiz.service.ts");
  const data = await forceDeleteByIds(ids);
  return data;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByDictbiz() {
  const { findLastOrderBy } = await import("./dictbiz.service.ts");
  const data = findLastOrderBy();
  return data;
}
