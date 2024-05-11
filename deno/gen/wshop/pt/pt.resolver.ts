import {
  useContext,
} from "/lib/context.ts";

import Decimal from "decimal.js";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找产品总数
 */
export async function findCountPt(
  search?: PtSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./pt.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找产品列表
 */
export async function findAllPt(
  search?: PtSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<PtModel[]> {
  
  const {
    findAll,
  } = await import("./pt.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取产品字段注释
 */
export async function getFieldCommentsPt(): Promise<PtFieldComment> {
  const { getFieldComments } = await import("./pt.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个产品
 */
export async function findOnePt(
  search?: PtSearch,
  sort?: SortInput[],
): Promise<PtModel | undefined> {
  
  const {
    findOne,
  } = await import("./pt.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找产品
 */
export async function findByIdPt(
  id: PtId,
): Promise<PtModel | undefined> {
  const { findById } = await import("./pt.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 批量创建产品
 */
export async function createsPt(
  inputs: PtInput[],
  unique_type?: UniqueType,
): Promise<PtId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./pt.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/pt",
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    // 价格
    if (input.price != null) {
      input.price = new Decimal(input.price);
    }
    
    // 原价
    if (input.original_price != null) {
      input.original_price = new Decimal(input.original_price);
    }
    
    await setIdByLbl(input);
    
    await validate(input);
  }
  const uniqueType = unique_type;
  const ids = await creates(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改产品
 */
export async function updateByIdPt(
  id: PtId,
  input: PtInput,
): Promise<PtId> {
  
  input.id = undefined;
  
  // 价格
  if (input.price != null) {
    input.price = new Decimal(input.price);
  }
  
  // 原价
  if (input.original_price != null) {
    input.original_price = new Decimal(input.original_price);
  }
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./pt.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/wshop/pt",
    "edit",
  );
  const id2: PtId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除产品
 */
export async function deleteByIdsPt(
  ids: PtId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./pt.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/pt",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用产品
 */
export async function enableByIdsPt(
  ids: PtId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./pt.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsPt.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/wshop/pt",
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁产品
 */
export async function lockByIdsPt(
  ids: PtId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./pt.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsPt.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/wshop/pt",
    "edit",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原产品
 */
export async function revertByIdsPt(
  ids: PtId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./pt.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/pt",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除产品
 */
export async function forceDeleteByIdsPt(
  ids: PtId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/pt",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./pt.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 产品 order_by 字段的最大值
 */
export async function findLastOrderByPt(): Promise<number> {
  const { findLastOrderBy } = await import("./pt.service.ts");
  const res = findLastOrderBy();
  return res;
}
