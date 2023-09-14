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
  DomainInput,
  DomainModel,
  DomainSearch,
  DomainFieldComment,
} from "./domain.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountDomain(
  search?: DomainSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const { findCount } = await import("./domain.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllDomain(
  search?: DomainSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<DomainModel[]> {
  const { findAll } = await import("./domain.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsDomain(): Promise<DomainFieldComment> {
  const { getFieldComments } = await import("./domain.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneDomain(
  search?: DomainSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<DomainModel | undefined> {
  const { findOne } = await import("./domain.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdDomain(
  id: string,
): Promise<DomainModel | undefined> {
  const { findById } = await import("./domain.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createDomain(
  input: DomainInput,
  unique_type?: UniqueType,
): Promise<string> {
  
  const {
    validate,
    create,
  } = await import("./domain.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await validate(input);
  
  await usePermit(
    "/base/domain",
    "add",
  );
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdDomain(
  id: string,
  input: DomainInput,
): Promise<string> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/domain",
    "edit",
  );
  
  const {
    updateById,
  } = await import("./domain.service.ts");
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsDomain(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/domain",
    "delete",
  );
  
  const {
    deleteByIds,
  } = await import("./domain.service.ts");
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 id 设置默认记录
 */
export async function defaultByIdDomain(
  id: string,
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/domain",
    "default",
  );
  
  const {
    defaultById,
  } = await import("./domain.service.ts");
  const res = await defaultById(id);
  return res;
}

/**
 * 根据 ids 启用或者禁用数据
 */
export async function enableByIdsDomain(
  ids: string[],
  is_enabled: 0 | 1,
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDomain.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/domain",
    "enable",
  );
  
  const {
    enableByIds,
  } = await import("./domain.service.ts");
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsDomain(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDomain.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/base/domain",
    "lock",
  );
  
  const {
    lockByIds,
  } = await import("./domain.service.ts");
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsDomain(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/domain",
    "delete",
  );
  
  const {
    revertByIds,
  } = await import("./domain.service.ts");
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsDomain(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/domain",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./domain.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByDomain(): Promise<number> {
  const { findLastOrderBy } = await import("./domain.service.ts");
  const res = findLastOrderBy();
  return res;
}
