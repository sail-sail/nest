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
  DictInput,
  DictModel,
  DictSearch,
  DictFieldComment,
  DictId,
} from "./dict.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找系统字典总数
 */
export async function findCountDict(
  search?: DictSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./dict.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找系统字典列表
 */
export async function findAllDict(
  search?: DictSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictModel[]> {
  
  const {
    findAll,
  } = await import("./dict.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取系统字典字段注释
 */
export async function getFieldCommentsDict(): Promise<DictFieldComment> {
  const { getFieldComments } = await import("./dict.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个系统字典
 */
export async function findOneDict(
  search?: DictSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<DictModel | undefined> {
  
  const {
    findOne,
  } = await import("./dict.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找系统字典
 */
export async function findByIdDict(
  id: DictId,
): Promise<DictModel | undefined> {
  const { findById } = await import("./dict.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建系统字典
 */
export async function createDict(
  input: DictInput,
  unique_type?: UniqueType,
): Promise<DictId> {
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./dict.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/base/dict",
    "add",
  );
  const uniqueType = unique_type;
  const id: DictId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改系统字典
 */
export async function updateByIdDict(
  id: DictId,
  input: DictInput,
): Promise<DictId> {
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./dict.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/dict",
    "edit",
  );
  const id2: DictId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除系统字典
 */
export async function deleteByIdsDict(
  ids: DictId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./dict.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dict",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用系统字典
 */
export async function enableByIdsDict(
  ids: DictId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./dict.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDict.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/dict",
    "enable",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁系统字典
 */
export async function lockByIdsDict(
  ids: DictId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./dict.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDict.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/base/dict",
    "lock",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原系统字典
 */
export async function revertByIdsDict(
  ids: DictId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./dict.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dict",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除系统字典
 */
export async function forceDeleteByIdsDict(
  ids: DictId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dict",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./dict.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 系统字典 order_by 字段的最大值
 */
export async function findLastOrderByDict(): Promise<number> {
  const { findLastOrderBy } = await import("./dict.service.ts");
  const res = findLastOrderBy();
  return res;
}
