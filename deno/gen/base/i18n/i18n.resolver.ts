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
  checkSortI18n,
} from "./i18n.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./i18n.model.ts";

/**
 * 根据条件查找国际化总数
 */
export async function findCountI18n(
  search?: I18nSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./i18n.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找国际化列表
 */
export async function findAllI18n(
  search?: I18nSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<I18nModel[]> {
  
  const {
    findAll,
  } = await import("./i18n.service.ts");
  
  checkSortI18n(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取国际化字段注释
 */
export async function getFieldCommentsI18n(): Promise<I18nFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./i18n.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个国际化
 */
export async function findOneI18n(
  search?: I18nSearch,
  sort?: SortInput[],
): Promise<I18nModel | undefined> {
  
  const {
    findOne,
  } = await import("./i18n.service.ts");
  
  checkSortI18n(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找国际化
 */
export async function findByIdI18n(
  id: I18nId,
): Promise<I18nModel | undefined> {
  
  const {
    findById,
  } = await import("./i18n.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找国际化
 */
export async function findByIdsI18n(
  ids: I18nId[],
): Promise<I18nModel[]> {
  
  const {
    findByIds,
  } = await import("./i18n.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建国际化
 */
export async function createsI18n(
  inputs: I18nInput[],
  unique_type?: UniqueType,
): Promise<I18nId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./i18n.service.ts");
  
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
 * 根据 id 修改国际化
 */
export async function updateByIdI18n(
  id: I18nId,
  input: I18nInput,
): Promise<I18nId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./i18n.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: I18nId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除国际化
 */
export async function deleteByIdsI18n(
  ids: I18nId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./i18n.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原国际化
 */
export async function revertByIdsI18n(
  ids: I18nId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./i18n.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除国际化
 */
export async function forceDeleteByIdsI18n(
  ids: I18nId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./i18n.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
