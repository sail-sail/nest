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
  type I18Ninput,
  type I18Nsearch,
} from "./i18n.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountI18N(
  search?: I18Nsearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./i18n.service.ts");
  const res = await findCount(search);
  return res;
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
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsI18N() {
  const { getFieldComments } = await import("./i18n.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneI18N(
  search?: I18Nsearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./i18n.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdI18N(
  id: string,
) {
  const { findById } = await import("./i18n.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createI18N(
  input: I18Ninput,
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/i18n",
    "add",
  );
  
  const {
    create,
  } = await import("./i18n.service.ts");
  const res = await create(input);
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdI18N(
  id: string,
  input: I18Ninput,
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/i18n",
    "edit",
  );
  
  const {
    updateById,
  } = await import("./i18n.service.ts");
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsI18N(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/i18n",
    "delete",
  );
  
  const {
    deleteByIds,
  } = await import("./i18n.service.ts");
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsI18N(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/i18n",
    "delete",
  );
  
  const {
    revertByIds,
  } = await import("./i18n.service.ts");
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsI18N(
  ids: string[],
) {
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
