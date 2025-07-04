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
    findCountLang,
  } = await import("./lang.service.ts");
  
  const num = await findCountLang(search);
  
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
    findAllLang,
  } = await import("./lang.service.ts");
  
  checkSortLang(sort);
  
  const models = await findAllLang(search, page, sort);
  
  return models;
}

/**
 * 获取语言字段注释
 */
export async function getFieldCommentsLang(): Promise<LangFieldComment> {
  
  const {
    getFieldCommentsLang,
  } = await import("./lang.service.ts");
  
  const field_comment = await getFieldCommentsLang();
  
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
    findOneLang,
  } = await import("./lang.service.ts");
  
  checkSortLang(sort);
  
  const model = await findOneLang(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个语言, 如果不存在则抛错
 */
export async function findOneOkLang(
  search?: LangSearch,
  sort?: SortInput[],
): Promise<LangModel> {
  
  const {
    findOneOkLang,
  } = await import("./lang.service.ts");
  
  checkSortLang(sort);
  
  const model = await findOneOkLang(search, sort);
  
  return model;
}

/**
 * 根据 id 查找语言
 */
export async function findByIdLang(
  id: LangId,
): Promise<LangModel | undefined> {
  
  const {
    findByIdLang,
  } = await import("./lang.service.ts");
  
  const model = await findByIdLang(id);
  
  return model;
}

/**
 * 根据 id 查找语言, 如果不存在则抛错
 */
export async function findByIdOkLang(
  id: LangId,
): Promise<LangModel | undefined> {
  
  const {
    findByIdOkLang,
  } = await import("./lang.service.ts");
  
  const model = await findByIdOkLang(id);
  
  return model;
}

/**
 * 根据 ids 查找语言
 */
export async function findByIdsLang(
  ids: LangId[],
): Promise<LangModel[]> {
  
  const {
    findByIdsLang,
  } = await import("./lang.service.ts");
  
  const models = await findByIdsLang(ids);
  
  return models;
}

/**
 * 根据 ids 查找语言, 出现查询不到的 id 则报错
 */
export async function findByIdsOkLang(
  ids: LangId[],
): Promise<LangModel[]> {
  
  const {
    findByIdsOkLang,
  } = await import("./lang.service.ts");
  
  const models = await findByIdsOkLang(ids);
  
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
    validateLang,
    setIdByLblLang,
    createsLang,
  } = await import("./lang.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblLang(input);
    
    await validateLang(input);
  }
  const uniqueType = unique_type;
  const ids = await createsLang(inputs, { uniqueType });
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
    setIdByLblLang,
    updateByIdLang,
  } = await import("./lang.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblLang(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: LangId = await updateByIdLang(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除语言
 */
export async function deleteByIdsLang(
  ids: LangId[],
): Promise<number> {
  
  const {
    deleteByIdsLang,
  } = await import("./lang.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsLang(ids);
  
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
    enableByIdsLang,
  } = await import("./lang.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsLang.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsLang(ids, is_enabled);
  
  return res;
}

/**
 * 根据 ids 还原语言
 */
export async function revertByIdsLang(
  ids: LangId[],
): Promise<number> {
  
  const {
    revertByIdsLang,
  } = await import("./lang.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsLang(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除语言
 */
export async function forceDeleteByIdsLang(
  ids: LangId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsLang,
  } = await import("./lang.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsLang(ids);
  
  return res;
}

/**
 * 查找 语言 order_by 字段的最大值
 */
export async function findLastOrderByLang(): Promise<number> {
  
  const {
    findLastOrderByLang,
  } = await import("./lang.service.ts");
  
  const res = findLastOrderByLang();
  
  return res;
}
