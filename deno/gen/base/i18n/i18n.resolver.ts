import {
  useContext,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找国际化总数
 */
export async function findCountI18n(
  search?: I18nSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./i18n.service.ts");
  
  const res = await findCount(search);
  return res;
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
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取国际化字段注释
 */
export async function getFieldCommentsI18n(): Promise<I18nFieldComment> {
  const { getFieldComments } = await import("./i18n.service.ts");
  const res = await getFieldComments();
  return res;
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
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找国际化
 */
export async function findByIdI18n(
  id: I18nId,
): Promise<I18nModel | undefined> {
  const { findById } = await import("./i18n.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建国际化
 */
export async function createI18n(
  input: I18nInput,
  unique_type?: UniqueType,
): Promise<I18nId> {
  
  input.id = undefined;
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./i18n.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/base/i18n",
    "add",
  );
  const uniqueType = unique_type;
  const id: I18nId = await create(input, { uniqueType });
  return id;
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/i18n",
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/i18n",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/i18n",
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
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/i18n",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./i18n.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
