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
  checkSortCompany,
} from "./company.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./company.model.ts";

/**
 * 根据条件查找单位总数
 */
export async function findCountCompany(
  search?: CompanySearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./company.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找单位列表
 */
export async function findAllCompany(
  search?: CompanySearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CompanyModel[]> {
  
  const {
    findAll,
  } = await import("./company.service.ts");
  
  checkSortCompany(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取单位字段注释
 */
export async function getFieldCommentsCompany(): Promise<CompanyFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./company.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个单位
 */
export async function findOneCompany(
  search?: CompanySearch,
  sort?: SortInput[],
): Promise<CompanyModel | undefined> {
  
  const {
    findOne,
  } = await import("./company.service.ts");
  
  checkSortCompany(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找单位
 */
export async function findByIdCompany(
  id: CompanyId,
): Promise<CompanyModel | undefined> {
  
  const {
    findById,
  } = await import("./company.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找单位
 */
export async function findByIdsCompany(
  ids: CompanyId[],
): Promise<CompanyModel[]> {
  
  const {
    findByIds,
  } = await import("./company.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建单位
 */
export async function createsCompany(
  inputs: CompanyInput[],
  unique_type?: UniqueType,
): Promise<CompanyId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./company.service.ts");
  
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
 * 根据 id 修改单位
 */
export async function updateByIdCompany(
  id: CompanyId,
  input: CompanyInput,
): Promise<CompanyId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./company.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: CompanyId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除单位
 */
export async function deleteByIdsCompany(
  ids: CompanyId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./company.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用单位
 */
export async function enableByIdsCompany(
  ids: CompanyId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./company.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsCompany.is_enabled expect 0 or 1 but got ${ is_enabled }`);
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
 * 根据 ids 锁定或者解锁单位
 */
export async function lockByIdsCompany(
  ids: CompanyId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./company.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsCompany.is_locked expect 0 or 1 but got ${ is_locked }`);
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
 * 根据 ids 还原单位
 */
export async function revertByIdsCompany(
  ids: CompanyId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./company.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除单位
 */
export async function forceDeleteByIdsCompany(
  ids: CompanyId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./company.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 单位 order_by 字段的最大值
 */
export async function findLastOrderByCompany(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./company.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
