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
    findCountDomain,
  } = await import("./domain.service.ts");
  
  const num = await findCountDomain(search);
  
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
    findAllDomain,
  } = await import("./domain.service.ts");
  
  checkSortDomain(sort);
  
  const models = await findAllDomain(search, page, sort);
  
  return models;
}

/**
 * 获取域名字段注释
 */
export async function getFieldCommentsDomain(): Promise<DomainFieldComment> {
  
  const {
    getFieldCommentsDomain,
  } = await import("./domain.service.ts");
  
  const field_comment = await getFieldCommentsDomain();
  
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
    findOneDomain,
  } = await import("./domain.service.ts");
  
  checkSortDomain(sort);
  
  const model = await findOneDomain(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个域名, 如果不存在则抛错
 */
export async function findOneOkDomain(
  search?: DomainSearch,
  sort?: SortInput[],
): Promise<DomainModel> {
  
  const {
    findOneOkDomain,
  } = await import("./domain.service.ts");
  
  checkSortDomain(sort);
  
  const model = await findOneOkDomain(search, sort);
  
  return model;
}

/**
 * 根据 id 查找域名
 */
export async function findByIdDomain(
  id: DomainId,
): Promise<DomainModel | undefined> {
  
  const {
    findByIdDomain,
  } = await import("./domain.service.ts");
  
  const model = await findByIdDomain(id);
  
  return model;
}

/**
 * 根据 id 查找域名, 如果不存在则抛错
 */
export async function findByIdOkDomain(
  id: DomainId,
): Promise<DomainModel | undefined> {
  
  const {
    findByIdOkDomain,
  } = await import("./domain.service.ts");
  
  const model = await findByIdOkDomain(id);
  
  return model;
}

/**
 * 根据 ids 查找域名
 */
export async function findByIdsDomain(
  ids: DomainId[],
): Promise<DomainModel[]> {
  
  const {
    findByIdsDomain,
  } = await import("./domain.service.ts");
  
  const models = await findByIdsDomain(ids);
  
  return models;
}

/**
 * 根据 ids 查找域名, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDomain(
  ids: DomainId[],
): Promise<DomainModel[]> {
  
  const {
    findByIdsOkDomain,
  } = await import("./domain.service.ts");
  
  const models = await findByIdsOkDomain(ids);
  
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
    validateDomain,
    setIdByLblDomain,
    createsDomain,
  } = await import("./domain.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblDomain(input);
    
    await validateDomain(input);
  }
  const uniqueType = unique_type;
  const ids = await createsDomain(inputs, { uniqueType });
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
    setIdByLblDomain,
    updateByIdDomain,
  } = await import("./domain.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblDomain(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: DomainId = await updateByIdDomain(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除域名
 */
export async function deleteByIdsDomain(
  ids: DomainId[],
): Promise<number> {
  
  const {
    deleteByIdsDomain,
  } = await import("./domain.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsDomain(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用域名
 */
export async function enableByIdsDomain(
  ids: DomainId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsDomain,
  } = await import("./domain.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDomain.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsDomain(ids, is_enabled);
  
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
    lockByIdsDomain,
  } = await import("./domain.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDomain.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsDomain(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原域名
 */
export async function revertByIdsDomain(
  ids: DomainId[],
): Promise<number> {
  
  const {
    revertByIdsDomain,
  } = await import("./domain.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsDomain(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除域名
 */
export async function forceDeleteByIdsDomain(
  ids: DomainId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsDomain,
  } = await import("./domain.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsDomain(ids);
  
  return res;
}

/**
 * 查找 域名 order_by 字段的最大值
 */
export async function findLastOrderByDomain(): Promise<number> {
  
  const {
    findLastOrderByDomain,
  } = await import("./domain.service.ts");
  
  const res = findLastOrderByDomain();
  
  return res;
}
