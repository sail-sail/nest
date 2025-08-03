import {
  set_is_tran,
  set_is_creating,
} from "/lib/context.ts";

import Decimal from "decimal.js";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortPt,
} from "./pt.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./pt.model.ts";

/**
 * 根据条件查找产品总数
 */
export async function findCountPt(
  search?: PtSearch,
): Promise<number> {
  
  const {
    findCountPt,
  } = await import("./pt.service.ts");
  
  const num = await findCountPt(search);
  
  return num;
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
    findAllPt,
  } = await import("./pt.service.ts");
  
  checkSortPt(sort);
  
  const models = await findAllPt(search, page, sort);
  
  return models;
}

/**
 * 获取产品字段注释
 */
export async function getFieldCommentsPt(): Promise<PtFieldComment> {
  
  const {
    getFieldCommentsPt,
  } = await import("./pt.service.ts");
  
  const field_comment = await getFieldCommentsPt();
  
  return field_comment;
}

/**
 * 根据条件查找第一个产品
 */
export async function findOnePt(
  search?: PtSearch,
  sort?: SortInput[],
): Promise<PtModel | undefined> {
  
  const {
    findOnePt,
  } = await import("./pt.service.ts");
  
  checkSortPt(sort);
  
  const model = await findOnePt(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个产品, 如果不存在则抛错
 */
export async function findOneOkPt(
  search?: PtSearch,
  sort?: SortInput[],
): Promise<PtModel> {
  
  const {
    findOneOkPt,
  } = await import("./pt.service.ts");
  
  checkSortPt(sort);
  
  const model = await findOneOkPt(search, sort);
  
  return model;
}

/**
 * 根据 id 查找产品
 */
export async function findByIdPt(
  id: PtId,
): Promise<PtModel | undefined> {
  
  const {
    findByIdPt,
  } = await import("./pt.service.ts");
  
  const model = await findByIdPt(id);
  
  return model;
}

/**
 * 根据 id 查找产品, 如果不存在则抛错
 */
export async function findByIdOkPt(
  id: PtId,
): Promise<PtModel | undefined> {
  
  const {
    findByIdOkPt,
  } = await import("./pt.service.ts");
  
  const model = await findByIdOkPt(id);
  
  return model;
}

/**
 * 根据 ids 查找产品
 */
export async function findByIdsPt(
  ids: PtId[],
): Promise<PtModel[]> {
  
  const {
    findByIdsPt,
  } = await import("./pt.service.ts");
  
  const models = await findByIdsPt(ids);
  
  return models;
}

/**
 * 根据 ids 查找产品, 出现查询不到的 id 则报错
 */
export async function findByIdsOkPt(
  ids: PtId[],
): Promise<PtModel[]> {
  
  const {
    findByIdsOkPt,
  } = await import("./pt.service.ts");
  
  const models = await findByIdsOkPt(ids);
  
  return models;
}

/**
 * 批量创建产品
 */
export async function createsPt(
  inputs: PtInput[],
  unique_type?: UniqueType,
): Promise<PtId[]> {
  
  const {
    validatePt,
    setIdByLblPt,
    createsPt,
  } = await import("./pt.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
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
    
    await setIdByLblPt(input);
    
    await validatePt(input);
  }
  const uniqueType = unique_type;
  const ids = await createsPt(inputs, { uniqueType });
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
    setIdByLblPt,
    updateByIdPt,
  } = await import("./pt.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblPt(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: PtId = await updateByIdPt(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除产品
 */
export async function deleteByIdsPt(
  ids: PtId[],
): Promise<number> {
  
  const {
    deleteByIdsPt,
  } = await import("./pt.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsPt(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用产品
 */
export async function enableByIdsPt(
  ids: PtId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsPt,
  } = await import("./pt.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsPt.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsPt(ids, is_enabled);
  
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
    lockByIdsPt,
  } = await import("./pt.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsPt.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsPt(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原产品
 */
export async function revertByIdsPt(
  ids: PtId[],
): Promise<number> {
  
  const {
    revertByIdsPt,
  } = await import("./pt.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsPt(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除产品
 */
export async function forceDeleteByIdsPt(
  ids: PtId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsPt,
  } = await import("./pt.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsPt(ids);
  
  return res;
}

/**
 * 查找 产品 order_by 字段的最大值
 */
export async function findLastOrderByPt(): Promise<number> {
  
  const {
    findLastOrderByPt,
  } = await import("./pt.service.ts");
  
  const res = findLastOrderByPt();
  
  return res;
}
