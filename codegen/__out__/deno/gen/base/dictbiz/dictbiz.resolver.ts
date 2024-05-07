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
 * 根据条件查找业务字典总数
 */
export async function findCountDictbiz(
  search?: DictbizSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./dictbiz.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找业务字典列表
 */
export async function findAllDictbiz(
  search?: DictbizSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictbizModel[]> {
  
  const {
    findAll,
  } = await import("./dictbiz.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取业务字典字段注释
 */
export async function getFieldCommentsDictbiz(): Promise<DictbizFieldComment> {
  const { getFieldComments } = await import("./dictbiz.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个业务字典
 */
export async function findOneDictbiz(
  search?: DictbizSearch,
  sort?: SortInput[],
): Promise<DictbizModel | undefined> {
  
  const {
    findOne,
  } = await import("./dictbiz.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找业务字典
 */
export async function findByIdDictbiz(
  id: DictbizId,
): Promise<DictbizModel | undefined> {
  const { findById } = await import("./dictbiz.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 批量创建业务字典
 */
export async function createsDictbiz(
  inputs: DictbizInput[],
  unique_type?: UniqueType,
): Promise<DictbizId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./dictbiz.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dictbiz",
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLbl(input);
    
    await validate(input);
  }
  const uniqueType = unique_type;
  const ids = await creates(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改业务字典
 */
export async function updateByIdDictbiz(
  id: DictbizId,
  input: DictbizInput,
): Promise<DictbizId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./dictbiz.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/dictbiz",
    "edit",
  );
  const id2: DictbizId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除业务字典
 */
export async function deleteByIdsDictbiz(
  ids: DictbizId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./dictbiz.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dictbiz",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用业务字典
 */
export async function enableByIdsDictbiz(
  ids: DictbizId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./dictbiz.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDictbiz.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/dictbiz",
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁业务字典
 */
export async function lockByIdsDictbiz(
  ids: DictbizId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./dictbiz.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDictbiz.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/base/dictbiz",
    "edit",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原业务字典
 */
export async function revertByIdsDictbiz(
  ids: DictbizId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./dictbiz.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dictbiz",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除业务字典
 */
export async function forceDeleteByIdsDictbiz(
  ids: DictbizId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dictbiz",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./dictbiz.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 业务字典 order_by 字段的最大值
 */
export async function findLastOrderByDictbiz(): Promise<number> {
  const { findLastOrderBy } = await import("./dictbiz.service.ts");
  const res = findLastOrderBy();
  return res;
}
