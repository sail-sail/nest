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
    findCountI18n,
  } = await import("./i18n.service.ts");
  
  const num = await findCountI18n(search);
  
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
    findAllI18n,
  } = await import("./i18n.service.ts");
  
  checkSortI18n(sort);
  
  const models = await findAllI18n(search, page, sort);
  
  return models;
}

/**
 * 获取国际化字段注释
 */
export async function getFieldCommentsI18n(): Promise<I18nFieldComment> {
  
  const {
    getFieldCommentsI18n,
  } = await import("./i18n.service.ts");
  
  const field_comment = await getFieldCommentsI18n();
  
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
    findOneI18n,
  } = await import("./i18n.service.ts");
  
  checkSortI18n(sort);
  
  const model = await findOneI18n(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个国际化, 如果不存在则抛错
 */
export async function findOneOkI18n(
  search?: I18nSearch,
  sort?: SortInput[],
): Promise<I18nModel> {
  
  const {
    findOneOkI18n,
  } = await import("./i18n.service.ts");
  
  checkSortI18n(sort);
  
  const model = await findOneOkI18n(search, sort);
  
  return model;
}

/**
 * 根据 id 查找国际化
 */
export async function findByIdI18n(
  id: I18nId,
): Promise<I18nModel | undefined> {
  
  const {
    findByIdI18n,
  } = await import("./i18n.service.ts");
  
  const model = await findByIdI18n(id);
  
  return model;
}

/**
 * 根据 id 查找国际化, 如果不存在则抛错
 */
export async function findByIdOkI18n(
  id: I18nId,
): Promise<I18nModel | undefined> {
  
  const {
    findByIdOkI18n,
  } = await import("./i18n.service.ts");
  
  const model = await findByIdOkI18n(id);
  
  return model;
}

/**
 * 根据 ids 查找国际化
 */
export async function findByIdsI18n(
  ids: I18nId[],
): Promise<I18nModel[]> {
  
  const {
    findByIdsI18n,
  } = await import("./i18n.service.ts");
  
  const models = await findByIdsI18n(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 查找国际化, 出现查询不到的 id 则报错
 */
export async function findByIdsOkI18n(
  ids: I18nId[],
): Promise<I18nModel[]> {
  
  const {
    findByIdsOkI18n,
  } = await import("./i18n.service.ts");
  
  const models = await findByIdsOkI18n(ids);
  
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
    validateI18n,
    setIdByLblI18n,
    createsI18n,
  } = await import("./i18n.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblI18n(input);
    
    await validateI18n(input);
  }
  const uniqueType = unique_type;
  const ids = await createsI18n(inputs, { uniqueType });
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
    setIdByLblI18n,
    updateByIdI18n,
  } = await import("./i18n.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblI18n(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: I18nId = await updateByIdI18n(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除国际化
 */
export async function deleteByIdsI18n(
  ids: I18nId[],
): Promise<number> {
  
  const {
    deleteByIdsI18n,
  } = await import("./i18n.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsI18n(ids);
  
  return num;
}

/**
 * 根据 ids 还原国际化
 */
export async function revertByIdsI18n(
  ids: I18nId[],
): Promise<number> {
  
  const {
    revertByIdsI18n,
  } = await import("./i18n.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsI18n(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除国际化
 */
export async function forceDeleteByIdsI18n(
  ids: I18nId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsI18n,
  } = await import("./i18n.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsI18n(ids);
  
  return res;
}
