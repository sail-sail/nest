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
  checkSortDynPageVal,
  intoInputDynPageVal,
} from "./dyn_page_val.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找动态页面值总数
 */
export async function findCountDynPageVal(
  search?: DynPageValSearch,
): Promise<number> {
  
  const {
    findCountDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  const num = await findCountDynPageVal(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找动态页面值列表
 */
export async function findAllDynPageVal(
  search?: DynPageValSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DynPageValModel[]> {
  
  const {
    findAllDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  checkSortDynPageVal(sort);
  
  const models = await findAllDynPageVal(search, page, sort);
  
  return models;
}

/**
 * 获取动态页面值字段注释
 */
export async function getFieldCommentsDynPageVal(): Promise<DynPageValFieldComment> {
  
  const {
    getFieldCommentsDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  const field_comment = await getFieldCommentsDynPageVal();
  
  return field_comment;
}

/**
 * 根据条件查找第一个动态页面值
 */
export async function findOneDynPageVal(
  search?: DynPageValSearch,
  sort?: SortInput[],
): Promise<DynPageValModel | undefined> {
  
  const {
    findOneDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  checkSortDynPageVal(sort);
  
  const model = await findOneDynPageVal(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个动态页面值, 如果不存在则抛错
 */
export async function findOneOkDynPageVal(
  search?: DynPageValSearch,
  sort?: SortInput[],
): Promise<DynPageValModel> {
  
  const {
    findOneOkDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  checkSortDynPageVal(sort);
  
  const model = await findOneOkDynPageVal(search, sort);
  
  return model;
}

/**
 * 根据 id 查找动态页面值
 */
export async function findByIdDynPageVal(
  id: DynPageValId,
): Promise<DynPageValModel | undefined> {
  
  const {
    findByIdDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  const model = await findByIdDynPageVal(id);
  
  return model;
}

/**
 * 根据 id 查找动态页面值, 如果不存在则抛错
 */
export async function findByIdOkDynPageVal(
  id: DynPageValId,
): Promise<DynPageValModel | undefined> {
  
  const {
    findByIdOkDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  const model = await findByIdOkDynPageVal(id);
  
  return model;
}

/**
 * 根据 ids 查找动态页面值
 */
export async function findByIdsDynPageVal(
  ids: DynPageValId[],
): Promise<DynPageValModel[]> {
  
  const {
    findByIdsDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  const models = await findByIdsDynPageVal(ids);
  
  return models;
}

/**
 * 根据 ids 查找动态页面值, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDynPageVal(
  ids: DynPageValId[],
): Promise<DynPageValModel[]> {
  
  const {
    findByIdsOkDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  const models = await findByIdsOkDynPageVal(ids);
  
  return models;
}

/**
 * 批量创建动态页面值
 */
export async function createsDynPageVal(
  inputs: DynPageValInput[],
  unique_type?: UniqueType,
): Promise<DynPageValId[]> {
  
  const {
    validateDynPageVal,
    setIdByLblDynPageVal,
    createsDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  const {
    getPagePathDynPageVal,
  } = await import("./dyn_page_val.model.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    getPagePathDynPageVal(),
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputDynPageVal(input);
    
    await setIdByLblDynPageVal(input);
    
    await validateDynPageVal(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsDynPageVal(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改动态页面值
 */
export async function updateByIdDynPageVal(
  id: DynPageValId,
  input: DynPageValInput,
): Promise<DynPageValId> {
  
  intoInputDynPageVal(input);
  
  const {
    setIdByLblDynPageVal,
    updateByIdDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  const {
    getPagePathDynPageVal,
  } = await import("./dyn_page_val.model.ts");
  
  set_is_tran(true);
  
  await setIdByLblDynPageVal(input);
  
  await usePermit(
    getPagePathDynPageVal(),
    "edit",
  );
  
  const id2: DynPageValId = await updateByIdDynPageVal(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除动态页面值
 */
export async function deleteByIdsDynPageVal(
  ids: DynPageValId[],
): Promise<number> {
  
  const {
    deleteByIdsDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  const {
    getPagePathDynPageVal,
  } = await import("./dyn_page_val.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathDynPageVal(),
    "delete",
  );
  
  const num = await deleteByIdsDynPageVal(ids);
  
  return num;
}

/**
 * 根据 ids 还原动态页面值
 */
export async function revertByIdsDynPageVal(
  ids: DynPageValId[],
): Promise<number> {
  
  const {
    revertByIdsDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  const {
    getPagePathDynPageVal,
  } = await import("./dyn_page_val.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathDynPageVal(),
    "delete",
  );
  
  const res = await revertByIdsDynPageVal(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除动态页面值
 */
export async function forceDeleteByIdsDynPageVal(
  ids: DynPageValId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsDynPageVal,
  } = await import("./dyn_page_val.service.ts");
  
  const {
    getPagePathDynPageVal,
  } = await import("./dyn_page_val.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathDynPageVal(),
    "force_delete",
  );
  
  const res = await forceDeleteByIdsDynPageVal(ids);
  
  return res;
}
