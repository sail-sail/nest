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
  checkSortLang,
} from "./lang.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./lang.model.ts";

/**
 * 根据条件查找语言总数
 */
export async function findCountLang(
  search?: LangSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./lang.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找语言列表
 */
export async function findAllLang(
  search?: LangSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<LangModel[]> {
  
  const {
    findAll,
  } = await import("./lang.service.ts");
  
  checkSortLang(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取语言字段注释
 */
export async function getFieldCommentsLang(): Promise<LangFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./lang.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个语言
 */
export async function findOneLang(
  search?: LangSearch,
  sort?: SortInput[],
): Promise<LangModel | undefined> {
  
  const {
    findOne,
  } = await import("./lang.service.ts");
  
  checkSortLang(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找语言
 */
export async function findByIdLang(
  id: LangId,
): Promise<LangModel | undefined> {
  
  const {
    findById,
  } = await import("./lang.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找语言
 */
export async function findByIdsLang(
  ids: LangId[],
): Promise<LangModel[]> {
  
  const {
    findByIds,
  } = await import("./lang.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建语言
 */
export async function createsLang(
  inputs: LangInput[],
  unique_type?: UniqueType,
): Promise<LangId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./lang.service.ts");
  
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
 * 根据 id 修改语言
 */
export async function updateByIdLang(
  id: LangId,
  input: LangInput,
): Promise<LangId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./lang.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: LangId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除语言
 */
export async function deleteByIdsLang(
  ids: LangId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./lang.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用语言
 */
export async function enableByIdsLang(
  ids: LangId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./lang.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsLang.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  
  return res;
}

/**
 * 根据 ids 还原语言
 */
export async function revertByIdsLang(
  ids: LangId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./lang.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除语言
 */
export async function forceDeleteByIdsLang(
  ids: LangId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./lang.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 语言 order_by 字段的最大值
 */
export async function findLastOrderByLang(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./lang.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
