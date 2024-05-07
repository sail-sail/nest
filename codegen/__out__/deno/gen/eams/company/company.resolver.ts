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
 * 根据条件查找单位总数
 */
export async function findCountCompany(
  search?: CompanySearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./company.service.ts");
  
  const res = await findCount(search);
  return res;
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
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取单位字段注释
 */
export async function getFieldCommentsCompany(): Promise<CompanyFieldComment> {
  const { getFieldComments } = await import("./company.service.ts");
  const res = await getFieldComments();
  return res;
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
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找单位
 */
export async function findByIdCompany(
  id: CompanyId,
): Promise<CompanyModel | undefined> {
  const { findById } = await import("./company.service.ts");
  const res = await findById(id);
  return res;
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/eams/company",
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/eams/company",
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/eams/company",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
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
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsCompany.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/eams/company",
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
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsCompany.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/eams/company",
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/eams/company",
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
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/eams/company",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./company.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 单位 order_by 字段的最大值
 */
export async function findLastOrderByCompany(): Promise<number> {
  const { findLastOrderBy } = await import("./company.service.ts");
  const res = findLastOrderBy();
  return res;
}
