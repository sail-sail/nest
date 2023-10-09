import {
  useContext,
} from "/lib/context.ts";

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  OptbizInput,
  OptbizModel,
  OptbizSearch,
  OptbizFieldComment,
} from "./optbiz.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountOptbiz(
  search?: OptbizSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const { findCount } = await import("./optbiz.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllOptbiz(
  search?: OptbizSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<OptbizModel[]> {
  const { findAll } = await import("./optbiz.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsOptbiz(): Promise<OptbizFieldComment> {
  const { getFieldComments } = await import("./optbiz.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneOptbiz(
  search?: OptbizSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<OptbizModel | undefined> {
  const { findOne } = await import("./optbiz.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdOptbiz(
  id: string,
): Promise<OptbizModel | undefined> {
  const { findById } = await import("./optbiz.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createOptbiz(
  input: OptbizInput,
  unique_type?: UniqueType,
): Promise<string> {
  
  const {
    validate,
    create,
  } = await import("./optbiz.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await validate(input);
  
  await usePermit(
    "/base/optbiz",
    "add",
  );
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdOptbiz(
  id: string,
  input: OptbizInput,
): Promise<string> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/optbiz",
    "edit",
  );
  
  const {
    updateById,
  } = await import("./optbiz.service.ts");
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsOptbiz(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/optbiz",
    "delete",
  );
  
  const {
    deleteByIds,
  } = await import("./optbiz.service.ts");
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用数据
 */
export async function enableByIdsOptbiz(
  ids: string[],
  is_enabled: 0 | 1,
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsOptbiz.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/optbiz",
    "enable",
  );
  
  const {
    enableByIds,
  } = await import("./optbiz.service.ts");
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsOptbiz(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsOptbiz.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/base/optbiz",
    "lock",
  );
  
  const {
    lockByIds,
  } = await import("./optbiz.service.ts");
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsOptbiz(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/optbiz",
    "delete",
  );
  
  const {
    revertByIds,
  } = await import("./optbiz.service.ts");
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsOptbiz(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/optbiz",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./optbiz.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByOptbiz(): Promise<number> {
  const { findLastOrderBy } = await import("./optbiz.service.ts");
  const res = findLastOrderBy();
  return res;
}
