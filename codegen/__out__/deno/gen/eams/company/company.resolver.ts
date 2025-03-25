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
    findCountCompany,
  } = await import("./company.service.ts");
  
  const num = await findCountCompany(search);
  
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
    findAllCompany,
  } = await import("./company.service.ts");
  
  checkSortCompany(sort);
  
  const models = await findAllCompany(search, page, sort);
  
  return models;
}

/**
 * 获取单位字段注释
 */
export async function getFieldCommentsCompany(): Promise<CompanyFieldComment> {
  
  const {
    getFieldCommentsCompany,
  } = await import("./company.service.ts");
  
  const field_comment = await getFieldCommentsCompany();
  
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
    findOneCompany,
  } = await import("./company.service.ts");
  
  checkSortCompany(sort);
  
  const model = await findOneCompany(search, sort);
  
  return model;
}

/**
 * 根据 id 查找单位
 */
export async function findByIdCompany(
  id: CompanyId,
): Promise<CompanyModel | undefined> {
  
  const {
    findByIdCompany,
  } = await import("./company.service.ts");
  
  const model = await findByIdCompany(id);
  
  return model;
}

/**
 * 根据 ids 查找单位
 */
export async function findByIdsCompany(
  ids: CompanyId[],
): Promise<CompanyModel[]> {
  
  const {
    findByIdsCompany,
  } = await import("./company.service.ts");
  
  const models = await findByIdsCompany(ids);
  
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
    validateCompany,
    setIdByLblCompany,
    createsCompany,
  } = await import("./company.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblCompany(input);
    
    await validateCompany(input);
  }
  const uniqueType = unique_type;
  const ids = await createsCompany(inputs, { uniqueType });
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
    setIdByLblCompany,
    updateByIdCompany,
  } = await import("./company.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblCompany(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: CompanyId = await updateByIdCompany(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除单位
 */
export async function deleteByIdsCompany(
  ids: CompanyId[],
): Promise<number> {
  
  const {
    deleteByIdsCompany,
  } = await import("./company.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsCompany(ids);
  
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
    enableByIdsCompany,
  } = await import("./company.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsCompany.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsCompany(ids, is_enabled);
  
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
    lockByIdsCompany,
  } = await import("./company.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsCompany.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsCompany(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原单位
 */
export async function revertByIdsCompany(
  ids: CompanyId[],
): Promise<number> {
  
  const {
    revertByIdsCompany,
  } = await import("./company.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsCompany(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除单位
 */
export async function forceDeleteByIdsCompany(
  ids: CompanyId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsCompany,
  } = await import("./company.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsCompany(ids);
  
  return res;
}

/**
 * 查找 单位 order_by 字段的最大值
 */
export async function findLastOrderByCompany(): Promise<number> {
  
  const {
    findLastOrderByCompany,
  } = await import("./company.service.ts");
  
  const res = findLastOrderByCompany();
  
  return res;
}
