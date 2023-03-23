import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type I18nModel,
  type I18nSearch,
} from "./i18n.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountI18n(
  search?: I18nSearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./i18n.service.ts");
  const data = await findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllI18n(
  search?: I18nSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const { findAll } = await import("./i18n.service.ts");
  const data = await findAll(search, page, sort);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsI18n() {
  const { getFieldComments } = await import("./i18n.service.ts");
  const data = await getFieldComments();
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneI18n(
  search?: I18nSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./i18n.service.ts");
  const data = await findOne(search, sort);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdI18n(
  id: string,
) {
  const { findById } = await import("./i18n.service.ts");
  const data = await findById(id);
  return data;
}

/**
 * 创建一条数据
 */
export async function createI18n(
  model: I18nModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const { create } = await import("./i18n.service.ts");
  const data = await create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdI18n(
  id: string,
  model: I18nModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const { updateById } = await import("./i18n.service.ts");
  const data = await updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsI18n(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { deleteByIds } = await import("./i18n.service.ts");
  const data = await deleteByIds(ids);
  return data;
}

/**
 * 导入国际化
 */
export async function importFileI18n(
  id: string,
) {
  const { importFile } = await import("./i18n.service.ts");
  const data = await importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsI18n(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { revertByIds } = await import("./i18n.service.ts");
  const data = await revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsI18n(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { forceDeleteByIds } = await import("./i18n.service.ts");
  const data = await forceDeleteByIds(ids);
  return data;
}
