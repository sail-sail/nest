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
  checkSortOptbiz,
  intoInputOptbiz,
} from "./optbiz.model.ts";

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
    findCountOptbiz,
  } = await import("./optbiz.service.ts");
  
  const num = await findCountOptbiz(search);
  
  return num;
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
    findAllOptbiz,
  } = await import("./optbiz.service.ts");
  
  checkSortOptbiz(sort);
  
  const models = await findAllOptbiz(search, page, sort);
  
  return models;
}

/**
 * 获取业务选项字段注释
 */
export async function getFieldCommentsOptbiz(): Promise<OptbizFieldComment> {
  
  const {
    getFieldCommentsOptbiz,
  } = await import("./optbiz.service.ts");
  
  const field_comment = await getFieldCommentsOptbiz();
  
  return field_comment;
}

/**
 * 根据条件查找第一个业务选项
 */
export async function findOneOptbiz(
  search?: OptbizSearch,
  sort?: SortInput[],
): Promise<OptbizModel | undefined> {
  
  const {
    findOneOptbiz,
  } = await import("./optbiz.service.ts");
  
  checkSortOptbiz(sort);
  
  const model = await findOneOptbiz(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个业务选项, 如果不存在则抛错
 */
export async function findOneOkOptbiz(
  search?: OptbizSearch,
  sort?: SortInput[],
): Promise<OptbizModel> {
  
  const {
    findOneOkOptbiz,
  } = await import("./optbiz.service.ts");
  
  checkSortOptbiz(sort);
  
  const model = await findOneOkOptbiz(search, sort);
  
  return model;
}

/**
 * 根据 id 查找业务选项
 */
export async function findByIdOptbiz(
  id: OptbizId,
): Promise<OptbizModel | undefined> {
  
  const {
    findByIdOptbiz,
  } = await import("./optbiz.service.ts");
  
  const model = await findByIdOptbiz(id);
  
  return model;
}

/**
 * 根据 id 查找业务选项, 如果不存在则抛错
 */
export async function findByIdOkOptbiz(
  id: OptbizId,
): Promise<OptbizModel | undefined> {
  
  const {
    findByIdOkOptbiz,
  } = await import("./optbiz.service.ts");
  
  const model = await findByIdOkOptbiz(id);
  
  return model;
}

/**
 * 根据 ids 查找业务选项
 */
export async function findByIdsOptbiz(
  ids: OptbizId[],
): Promise<OptbizModel[]> {
  
  const {
    findByIdsOptbiz,
  } = await import("./optbiz.service.ts");
  
  const models = await findByIdsOptbiz(ids);
  
  return models;
}

/**
 * 根据 ids 查找业务选项, 出现查询不到的 id 则报错
 */
export async function findByIdsOkOptbiz(
  ids: OptbizId[],
): Promise<OptbizModel[]> {
  
  const {
    findByIdsOkOptbiz,
  } = await import("./optbiz.service.ts");
  
  const models = await findByIdsOkOptbiz(ids);
  
  return models;
}

/**
 * 批量创建业务选项
 */
export async function createsOptbiz(
  inputs: OptbizInput[],
  unique_type?: UniqueType,
): Promise<OptbizId[]> {
  
  const {
    validateOptbiz,
    setIdByLblOptbiz,
    createsOptbiz,
  } = await import("./optbiz.service.ts");
  
  const {
    getPagePathOptbiz,
  } = await import("./optbiz.model.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    getPagePathOptbiz(),
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputOptbiz(input);
    
    await setIdByLblOptbiz(input);
    
    await validateOptbiz(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsOptbiz(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改业务选项
 */
export async function updateByIdOptbiz(
  id: OptbizId,
  input: OptbizInput,
): Promise<OptbizId> {
  
  intoInputOptbiz(input);
  
  const {
    setIdByLblOptbiz,
    updateByIdOptbiz,
  } = await import("./optbiz.service.ts");
  
  const {
    getPagePathOptbiz,
  } = await import("./optbiz.model.ts");
  
  set_is_tran(true);
  
  await setIdByLblOptbiz(input);
  
  await usePermit(
    getPagePathOptbiz(),
    "edit",
  );
  
  const id2: OptbizId = await updateByIdOptbiz(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除业务选项
 */
export async function deleteByIdsOptbiz(
  ids: OptbizId[],
): Promise<number> {
  
  const {
    deleteByIdsOptbiz,
  } = await import("./optbiz.service.ts");
  
  const {
    getPagePathOptbiz,
  } = await import("./optbiz.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathOptbiz(),
    "delete",
  );
  
  const num = await deleteByIdsOptbiz(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用业务选项
 */
export async function enableByIdsOptbiz(
  ids: OptbizId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsOptbiz,
  } = await import("./optbiz.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsOptbiz.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  const {
    getPagePathOptbiz,
  } = await import("./optbiz.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathOptbiz(),
    "edit",
  );
  const res = await enableByIdsOptbiz(ids, is_enabled);
  
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
    lockByIdsOptbiz,
  } = await import("./optbiz.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsOptbiz.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  const {
    getPagePathOptbiz,
  } = await import("./optbiz.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathOptbiz(),
    "edit",
  );
  
  const res = await lockByIdsOptbiz(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原业务选项
 */
export async function revertByIdsOptbiz(
  ids: OptbizId[],
): Promise<number> {
  
  const {
    revertByIdsOptbiz,
  } = await import("./optbiz.service.ts");
  
  const {
    getPagePathOptbiz,
  } = await import("./optbiz.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathOptbiz(),
    "delete",
  );
  
  const res = await revertByIdsOptbiz(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除业务选项
 */
export async function forceDeleteByIdsOptbiz(
  ids: OptbizId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsOptbiz,
  } = await import("./optbiz.service.ts");
  
  const {
    getPagePathOptbiz,
  } = await import("./optbiz.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathOptbiz(),
    "force_delete",
  );
  
  const res = await forceDeleteByIdsOptbiz(ids);
  
  return res;
}

/**
 * 查找 业务选项 order_by 字段的最大值
 */
export async function findLastOrderByOptbiz(
  search?: OptbizSearch,
): Promise<number> {
  
  const {
    findLastOrderByOptbiz,
  } = await import("./optbiz.service.ts");
  
  const order_by = findLastOrderByOptbiz(search);
  
  return order_by;
}
