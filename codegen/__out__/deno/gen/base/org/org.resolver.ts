import {
  useContext,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  OrgInput,
  OrgModel,
  OrgSearch,
  OrgFieldComment,
  OrgId,
} from "./org.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找组织总数
 */
export async function findCountOrg(
  search?: OrgSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./org.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找组织列表
 */
export async function findAllOrg(
  search?: OrgSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OrgModel[]> {
  
  const {
    findAll,
  } = await import("./org.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取组织字段注释
 */
export async function getFieldCommentsOrg(): Promise<OrgFieldComment> {
  const { getFieldComments } = await import("./org.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个组织
 */
export async function findOneOrg(
  search?: OrgSearch,
  sort?: SortInput[],
): Promise<OrgModel | undefined> {
  
  const {
    findOne,
  } = await import("./org.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找组织
 */
export async function findByIdOrg(
  id: OrgId,
): Promise<OrgModel | undefined> {
  const { findById } = await import("./org.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建组织
 */
export async function createOrg(
  input: OrgInput,
  unique_type?: UniqueType,
): Promise<OrgId> {
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./org.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/base/org",
    "add",
  );
  const uniqueType = unique_type;
  const id: OrgId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改组织
 */
export async function updateByIdOrg(
  id: OrgId,
  input: OrgInput,
): Promise<OrgId> {
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./org.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/org",
    "edit",
  );
  const id2: OrgId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除组织
 */
export async function deleteByIdsOrg(
  ids: OrgId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./org.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/org",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用组织
 */
export async function enableByIdsOrg(
  ids: OrgId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./org.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsOrg.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/org",
    "enable",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁组织
 */
export async function lockByIdsOrg(
  ids: OrgId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./org.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsOrg.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/base/org",
    "lock",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原组织
 */
export async function revertByIdsOrg(
  ids: OrgId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./org.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/org",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除组织
 */
export async function forceDeleteByIdsOrg(
  ids: OrgId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/org",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./org.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 组织 order_by 字段的最大值
 */
export async function findLastOrderByOrg(): Promise<number> {
  const { findLastOrderBy } = await import("./org.service.ts");
  const res = findLastOrderBy();
  return res;
}
