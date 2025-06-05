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

import {
  route_path,
} from "./pt_type.model.ts";

/**
 * 根据条件查找产品类别总数
 */
export async function findCountPtType(
  search?: PtTypeSearch,
): Promise<number> {
  
  const {
    findCountPtType,
  } = await import("./pt_type.service.ts");
  
  const num = await findCountPtType(search);
  
  return num;
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
    findAllPtType,
  } = await import("./pt_type.service.ts");
  
  checkSortPtType(sort);
  
  const models = await findAllPtType(search, page, sort);
  
  return models;
}

/**
 * 获取产品类别字段注释
 */
export async function getFieldCommentsPtType(): Promise<PtTypeFieldComment> {
  
  const {
    getFieldCommentsPtType,
  } = await import("./pt_type.service.ts");
  
  const field_comment = await getFieldCommentsPtType();
  
  return field_comment;
}

/**
 * 根据条件查找第一个产品类别
 */
export async function findOnePtType(
  search?: PtTypeSearch,
  sort?: SortInput[],
): Promise<PtTypeModel | undefined> {
  
  const {
    findOnePtType,
  } = await import("./pt_type.service.ts");
  
  checkSortPtType(sort);
  
  const model = await findOnePtType(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个产品类别, 如果不存在则抛错
 */
export async function findOneOkPtType(
  search?: PtTypeSearch,
  sort?: SortInput[],
): Promise<PtTypeModel> {
  
  const {
    findOneOkPtType,
  } = await import("./pt_type.service.ts");
  
  checkSortPtType(sort);
  
  const model = await findOneOkPtType(search, sort);
  
  return model;
}

/**
 * 根据 id 查找产品类别
 */
export async function findByIdPtType(
  id: PtTypeId,
): Promise<PtTypeModel | undefined> {
  
  const {
    findByIdPtType,
  } = await import("./pt_type.service.ts");
  
  const model = await findByIdPtType(id);
  
  return model;
}

/**
 * 根据 id 查找产品类别, 如果不存在则抛错
 */
export async function findByIdOkPtType(
  id: PtTypeId,
): Promise<PtTypeModel | undefined> {
  
  const {
    findByIdOkPtType,
  } = await import("./pt_type.service.ts");
  
  const model = await findByIdOkPtType(id);
  
  return model;
}

/**
 * 根据 ids 查找产品类别
 */
export async function findByIdsPtType(
  ids: PtTypeId[],
): Promise<PtTypeModel[]> {
  
  const {
    findByIdsPtType,
  } = await import("./pt_type.service.ts");
  
  const models = await findByIdsPtType(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 查找产品类别, 出现查询不到的 id 则报错
 */
export async function findByIdsOkPtType(
  ids: PtTypeId[],
): Promise<PtTypeModel[]> {
  
  const {
    findByIdsOkPtType,
  } = await import("./pt_type.service.ts");
  
  const models = await findByIdsOkPtType(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建产品类别
 */
export async function createsPtType(
  inputs: PtTypeInput[],
  unique_type?: UniqueType,
): Promise<PtTypeId[]> {
  
  const {
    validatePtType,
    setIdByLblPtType,
    createsPtType,
  } = await import("./pt_type.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblPtType(input);
    
    await validatePtType(input);
  }
  const uniqueType = unique_type;
  const ids = await createsPtType(inputs, { uniqueType });
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
    setIdByLblPtType,
    updateByIdPtType,
  } = await import("./pt_type.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblPtType(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: PtTypeId = await updateByIdPtType(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除产品类别
 */
export async function deleteByIdsPtType(
  ids: PtTypeId[],
): Promise<number> {
  
  const {
    deleteByIdsPtType,
  } = await import("./pt_type.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsPtType(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用产品类别
 */
export async function enableByIdsPtType(
  ids: PtTypeId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsPtType,
  } = await import("./pt_type.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsPtType.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsPtType(ids, is_enabled);
  
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
    lockByIdsPtType,
  } = await import("./pt_type.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsPtType.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsPtType(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原产品类别
 */
export async function revertByIdsPtType(
  ids: PtTypeId[],
): Promise<number> {
  
  const {
    revertByIdsPtType,
  } = await import("./pt_type.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsPtType(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除产品类别
 */
export async function forceDeleteByIdsPtType(
  ids: PtTypeId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsPtType,
  } = await import("./pt_type.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsPtType(ids);
  
  return res;
}

/**
 * 查找 产品类别 order_by 字段的最大值
 */
export async function findLastOrderByPtType(): Promise<number> {
  
  const {
    findLastOrderByPtType,
  } = await import("./pt_type.service.ts");
  
  const res = findLastOrderByPtType();
  
  return res;
}
