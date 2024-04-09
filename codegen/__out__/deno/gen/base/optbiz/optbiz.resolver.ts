import {
  useContext,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找业务选项总数
 */
export async function findCountOptbiz(
  search?: OptbizSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./optbiz.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找业务选项列表
 */
export async function findAllOptbiz(
  search?: OptbizSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OptbizModel[]> {
  
  const {
    findAll,
  } = await import("./optbiz.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取业务选项字段注释
 */
export async function getFieldCommentsOptbiz(): Promise<OptbizFieldComment> {
  const { getFieldComments } = await import("./optbiz.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个业务选项
 */
export async function findOneOptbiz(
  search?: OptbizSearch,
  sort?: SortInput[],
): Promise<OptbizModel | undefined> {
  
  const {
    findOne,
  } = await import("./optbiz.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找业务选项
 */
export async function findByIdOptbiz(
  id: OptbizId,
): Promise<OptbizModel | undefined> {
  const { findById } = await import("./optbiz.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建业务选项
 */
export async function createOptbiz(
  input: OptbizInput,
  unique_type?: UniqueType,
): Promise<OptbizId> {
  
  input.id = undefined;
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./optbiz.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/base/optbiz",
    "add",
  );
  const uniqueType = unique_type;
  const id: OptbizId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改业务选项
 */
export async function updateByIdOptbiz(
  id: OptbizId,
  input: OptbizInput,
): Promise<OptbizId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./optbiz.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/optbiz",
    "edit",
  );
  const id2: OptbizId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除业务选项
 */
export async function deleteByIdsOptbiz(
  ids: OptbizId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./optbiz.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/optbiz",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用业务选项
 */
export async function enableByIdsOptbiz(
  ids: OptbizId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./optbiz.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsOptbiz.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/optbiz",
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁业务选项
 */
export async function lockByIdsOptbiz(
  ids: OptbizId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./optbiz.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsOptbiz.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/base/optbiz",
    "edit",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原业务选项
 */
export async function revertByIdsOptbiz(
  ids: OptbizId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./optbiz.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/optbiz",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除业务选项
 */
export async function forceDeleteByIdsOptbiz(
  ids: OptbizId[],
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
 * 查找 业务选项 order_by 字段的最大值
 */
export async function findLastOrderByOptbiz(): Promise<number> {
  const { findLastOrderBy } = await import("./optbiz.service.ts");
  const res = findLastOrderBy();
  return res;
}
