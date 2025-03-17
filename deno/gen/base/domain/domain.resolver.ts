import {
  set_is_tran,
  set_is_creating,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortDomain,
} from "./domain.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./domain.model.ts";

/**
 * 根据条件查找域名总数
 */
export async function findCountDomain(
  search?: DomainSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./domain.service.ts");
  
  const num = await findCount(search);
  
  return num;
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
  
  checkSortDomain(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取域名字段注释
 */
export async function getFieldCommentsDomain(): Promise<DomainFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./domain.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
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
  
  checkSortDomain(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找域名
 */
export async function findByIdDomain(
  id: DomainId,
): Promise<DomainModel | undefined> {
  
  const {
    findById,
  } = await import("./domain.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找域名
 */
export async function findByIdsDomain(
  ids: DomainId[],
): Promise<DomainModel[]> {
  
  const {
    findByIds,
  } = await import("./domain.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建域名
 */
export async function createsDomain(
  inputs: DomainInput[],
  unique_type?: UniqueType,
): Promise<DomainId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./domain.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
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
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
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
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
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
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
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
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDomain.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
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
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDomain.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
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
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
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
  
  const {
    forceDeleteByIds,
  } = await import("./domain.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 域名 order_by 字段的最大值
 */
export async function findLastOrderByDomain(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./domain.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
