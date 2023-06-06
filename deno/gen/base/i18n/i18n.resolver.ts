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
  type I18Nmodel,
  type I18Nsearch,
} from "./i18n.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountI18N(
  search?: I18Nsearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./i18n.service.ts");
  const data = await findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllI18N(
  search?: I18Nsearch & { $extra?: SearchExtra[] },
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
export async function getFieldCommentsI18N() {
  const { getFieldComments } = await import("./i18n.service.ts");
  const data = await getFieldComments();
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneI18N(
  search?: I18Nsearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./i18n.service.ts");
  const data = await findOne(search, sort);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdI18N(
  id: string,
) {
  const { findById } = await import("./i18n.service.ts");
  const data = await findById(id);
  return data;
}

/**
 * 创建一条数据
 */
export async function createI18N(
  model: I18Nmodel,
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
export async function updateByIdI18N(
  id: string,
  model: I18Nmodel,
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
export async function deleteByIdsI18N(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { deleteByIds } = await import("./i18n.service.ts");
  const data = await deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsI18N(
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
export async function forceDeleteByIdsI18N(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { forceDeleteByIds } = await import("./i18n.service.ts");
  const data = await forceDeleteByIds(ids);
  return data;
}
