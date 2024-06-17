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
  checkSortPtType,
} from "./pt_type.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找产品类别总数
 */
export async function findCountPtType(
  search?: PtTypeSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./pt_type.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找产品类别列表
 */
export async function findAllPtType(
  search?: PtTypeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<PtTypeModel[]> {
  
  const {
    findAll,
  } = await import("./pt_type.service.ts");
  
  checkSortPtType(sort);
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取产品类别字段注释
 */
export async function getFieldCommentsPtType(): Promise<PtTypeFieldComment> {
  const { getFieldComments } = await import("./pt_type.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个产品类别
 */
export async function findOnePtType(
  search?: PtTypeSearch,
  sort?: SortInput[],
): Promise<PtTypeModel | undefined> {
  
  const {
    findOne,
  } = await import("./pt_type.service.ts");
  
  checkSortPtType(sort);
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找产品类别
 */
export async function findByIdPtType(
  id: PtTypeId,
): Promise<PtTypeModel | undefined> {
  
  const {
    findById,
  } = await import("./pt_type.service.ts");
  
  const res = await findById(id);
  
  return res;
}

/**
 * 批量创建产品类别
 */
export async function createsPtType(
  inputs: PtTypeInput[],
  unique_type?: UniqueType,
): Promise<PtTypeId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./pt_type.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    "/wshop/pt_type",
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
 * 根据 id 修改产品类别
 */
export async function updateByIdPtType(
  id: PtTypeId,
  input: PtTypeInput,
): Promise<PtTypeId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./pt_type.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    "/wshop/pt_type",
    "edit",
  );
  const id2: PtTypeId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除产品类别
 */
export async function deleteByIdsPtType(
  ids: PtTypeId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./pt_type.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    "/wshop/pt_type",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用产品类别
 */
export async function enableByIdsPtType(
  ids: PtTypeId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./pt_type.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsPtType.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    "/wshop/pt_type",
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁产品类别
 */
export async function lockByIdsPtType(
  ids: PtTypeId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./pt_type.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsPtType.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    "/wshop/pt_type",
    "edit",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原产品类别
 */
export async function revertByIdsPtType(
  ids: PtTypeId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./pt_type.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    "/wshop/pt_type",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除产品类别
 */
export async function forceDeleteByIdsPtType(
  ids: PtTypeId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./pt_type.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    "/wshop/pt_type",
    "force_delete",
  );
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 产品类别 order_by 字段的最大值
 */
export async function findLastOrderByPtType(): Promise<number> {
  const { findLastOrderBy } = await import("./pt_type.service.ts");
  const res = findLastOrderBy();
  return res;
}
