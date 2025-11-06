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
  checkSortDynPageField,
  intoInputDynPageField,
} from "./dyn_page_field.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./dyn_page_field.model.ts";

/**
 * 根据条件查找动态页面字段总数
 */
export async function findCountDynPageField(
  search?: DynPageFieldSearch,
): Promise<number> {
  
  const {
    findCountDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  const num = await findCountDynPageField(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找动态页面字段列表
 */
export async function findAllDynPageField(
  search?: DynPageFieldSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DynPageFieldModel[]> {
  
  const {
    findAllDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  checkSortDynPageField(sort);
  
  const models = await findAllDynPageField(search, page, sort);
  
  return models;
}

/**
 * 获取动态页面字段字段注释
 */
export async function getFieldCommentsDynPageField(): Promise<DynPageFieldFieldComment> {
  
  const {
    getFieldCommentsDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  const field_comment = await getFieldCommentsDynPageField();
  
  return field_comment;
}

/**
 * 根据条件查找第一个动态页面字段
 */
export async function findOneDynPageField(
  search?: DynPageFieldSearch,
  sort?: SortInput[],
): Promise<DynPageFieldModel | undefined> {
  
  const {
    findOneDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  checkSortDynPageField(sort);
  
  const model = await findOneDynPageField(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个动态页面字段, 如果不存在则抛错
 */
export async function findOneOkDynPageField(
  search?: DynPageFieldSearch,
  sort?: SortInput[],
): Promise<DynPageFieldModel> {
  
  const {
    findOneOkDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  checkSortDynPageField(sort);
  
  const model = await findOneOkDynPageField(search, sort);
  
  return model;
}

/**
 * 根据 id 查找动态页面字段
 */
export async function findByIdDynPageField(
  id: DynPageFieldId,
): Promise<DynPageFieldModel | undefined> {
  
  const {
    findByIdDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  const model = await findByIdDynPageField(id);
  
  return model;
}

/**
 * 根据 id 查找动态页面字段, 如果不存在则抛错
 */
export async function findByIdOkDynPageField(
  id: DynPageFieldId,
): Promise<DynPageFieldModel | undefined> {
  
  const {
    findByIdOkDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  const model = await findByIdOkDynPageField(id);
  
  return model;
}

/**
 * 根据 ids 查找动态页面字段
 */
export async function findByIdsDynPageField(
  ids: DynPageFieldId[],
): Promise<DynPageFieldModel[]> {
  
  const {
    findByIdsDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  const models = await findByIdsDynPageField(ids);
  
  return models;
}

/**
 * 根据 ids 查找动态页面字段, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDynPageField(
  ids: DynPageFieldId[],
): Promise<DynPageFieldModel[]> {
  
  const {
    findByIdsOkDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  const models = await findByIdsOkDynPageField(ids);
  
  return models;
}

/**
 * 批量创建动态页面字段
 */
export async function createsDynPageField(
  inputs: DynPageFieldInput[],
  unique_type?: UniqueType,
): Promise<DynPageFieldId[]> {
  
  const {
    validateDynPageField,
    setIdByLblDynPageField,
    createsDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputDynPageField(input);
    
    await setIdByLblDynPageField(input);
    
    await validateDynPageField(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsDynPageField(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改动态页面字段
 */
export async function updateByIdDynPageField(
  id: DynPageFieldId,
  input: DynPageFieldInput,
): Promise<DynPageFieldId> {
  
  intoInputDynPageField(input);
  
  const {
    setIdByLblDynPageField,
    updateByIdDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblDynPageField(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: DynPageFieldId = await updateByIdDynPageField(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除动态页面字段
 */
export async function deleteByIdsDynPageField(
  ids: DynPageFieldId[],
): Promise<number> {
  
  const {
    deleteByIdsDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsDynPageField(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用动态页面字段
 */
export async function enableByIdsDynPageField(
  ids: DynPageFieldId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDynPageField.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsDynPageField(ids, is_enabled);
  
  return res;
}

/**
 * 根据 ids 还原动态页面字段
 */
export async function revertByIdsDynPageField(
  ids: DynPageFieldId[],
): Promise<number> {
  
  const {
    revertByIdsDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsDynPageField(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除动态页面字段
 */
export async function forceDeleteByIdsDynPageField(
  ids: DynPageFieldId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsDynPageField(ids);
  
  return res;
}

/**
 * 查找 动态页面字段 order_by 字段的最大值
 */
export async function findLastOrderByDynPageField(): Promise<number> {
  
  const {
    findLastOrderByDynPageField,
  } = await import("./dyn_page_field.service.ts");
  
  const res = findLastOrderByDynPageField();
  
  return res;
}
