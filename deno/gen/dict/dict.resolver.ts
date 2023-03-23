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
  type DictModel,
  type DictSearch,
} from "./dict.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountDict(
  search?: DictSearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./dict.service.ts");
  const data = await findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllDict(
  search?: DictSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const { findAll } = await import("./dict.service.ts");
  const data = await findAll(search, page, sort);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsDict() {
  const { getFieldComments } = await import("./dict.service.ts");
  const data = await getFieldComments();
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneDict(
  search?: DictSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./dict.service.ts");
  const data = await findOne(search, sort);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdDict(
  id: string,
) {
  const { findById } = await import("./dict.service.ts");
  const data = await findById(id);
  return data;
}

/**
 * 创建一条数据
 */
export async function createDict(
  model: DictModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const { create } = await import("./dict.service.ts");
  const data = await create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdDict(
  id: string,
  model: DictModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const { updateById } = await import("./dict.service.ts");
  const data = await updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsDict(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { deleteByIds } = await import("./dict.service.ts");
  const data = await deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsDict(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDict.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const { lockByIds } = await import("./dict.service.ts");
  const data = await lockByIds(ids, is_locked);
  return data;
}

/**
 * 导入系统字典
 */
export async function importFileDict(
  id: string,
) {
  const { importFile } = await import("./dict.service.ts");
  const data = await importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsDict(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { revertByIds } = await import("./dict.service.ts");
  const data = await revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsDict(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { forceDeleteByIds } = await import("./dict.service.ts");
  const data = await forceDeleteByIds(ids);
  return data;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByDict() {
  const { findLastOrderBy } = await import("./dict.service.ts");
  const data = findLastOrderBy();
  return data;
}
