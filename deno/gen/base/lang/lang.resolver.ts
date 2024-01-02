import {
  useContext,
} from "/lib/context.ts";

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  LangInput,
  LangModel,
  LangSearch,
  LangFieldComment,
  LangId,
} from "./lang.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找语言总数
 */
export async function findCountLang(
  search?: LangSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./lang.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找语言列表
 */
export async function findAllLang(
  search?: LangSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<LangModel[]> {
  
  const {
    findAll,
  } = await import("./lang.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取语言字段注释
 */
export async function getFieldCommentsLang(): Promise<LangFieldComment> {
  const { getFieldComments } = await import("./lang.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个语言
 */
export async function findOneLang(
  search?: LangSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<LangModel | undefined> {
  
  const {
    findOne,
  } = await import("./lang.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找语言
 */
export async function findByIdLang(
  id: LangId,
): Promise<LangModel | undefined> {
  const { findById } = await import("./lang.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建语言
 */
export async function createLang(
  input: LangInput,
  unique_type?: UniqueType,
): Promise<LangId> {
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./lang.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/base/lang",
    "add",
  );
  const uniqueType = unique_type;
  const id: LangId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改语言
 */
export async function updateByIdLang(
  id: LangId,
  input: LangInput,
): Promise<LangId> {
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./lang.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/lang",
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/lang",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
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
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsLang.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/lang",
    "enable",
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/lang",
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
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/lang",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./lang.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 语言 order_by 字段的最大值
 */
export async function findLastOrderByLang(): Promise<number> {
  const { findLastOrderBy } = await import("./lang.service.ts");
  const res = findLastOrderBy();
  return res;
}
