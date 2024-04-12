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
 * 根据条件查找域名总数
 */
export async function findCountDomain(
  search?: DomainSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./domain.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找域名列表
 */
export async function findAllDomain(
  search?: DomainSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DomainModel[]> {
  
  const {
    findAll,
  } = await import("./domain.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取域名字段注释
 */
export async function getFieldCommentsDomain(): Promise<DomainFieldComment> {
  const { getFieldComments } = await import("./domain.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个域名
 */
export async function findOneDomain(
  search?: DomainSearch,
  sort?: SortInput[],
): Promise<DomainModel | undefined> {
  
  const {
    findOne,
  } = await import("./domain.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找域名
 */
export async function findByIdDomain(
  id: DomainId,
): Promise<DomainModel | undefined> {
  const { findById } = await import("./domain.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建域名
 */
export async function createDomain(
  input: DomainInput,
  unique_type?: UniqueType,
): Promise<DomainId> {
  
  input.id = undefined;
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./domain.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/base/domain",
    "add",
  );
  const uniqueType = unique_type;
  const id: DomainId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改域名
 */
export async function updateByIdDomain(
  id: DomainId,
  input: DomainInput,
): Promise<DomainId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./domain.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/domain",
    "edit",
  );
  const id2: DomainId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除域名
 */
export async function deleteByIdsDomain(
  ids: DomainId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./domain.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/domain",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 id 设置默认域名
 */
export async function defaultByIdDomain(
  id: DomainId,
): Promise<number> {
  
  const {
    defaultById,
  } = await import("./domain.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/domain",
    "edit",
  );
  const res = await defaultById(id);
  return res;
}

/**
 * 根据 ids 启用或者禁用域名
 */
export async function enableByIdsDomain(
  ids: DomainId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./domain.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDomain.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/domain",
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁域名
 */
export async function lockByIdsDomain(
  ids: DomainId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./domain.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDomain.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/base/domain",
    "edit",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原域名
 */
export async function revertByIdsDomain(
  ids: DomainId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./domain.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/domain",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除域名
 */
export async function forceDeleteByIdsDomain(
  ids: DomainId[],
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
 * 查找 域名 order_by 字段的最大值
 */
export async function findLastOrderByDomain(): Promise<number> {
  const { findLastOrderBy } = await import("./domain.service.ts");
  const res = findLastOrderBy();
  return res;
}
