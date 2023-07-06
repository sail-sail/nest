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
  type DictbizDetailInput,
  type DictbizDetailSearch,
} from "./dictbiz_detail.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountDictbizDetail(
  search?: DictbizDetailSearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./dictbiz_detail.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllDictbizDetail(
  search?: DictbizDetailSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const { findAll } = await import("./dictbiz_detail.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsDictbizDetail() {
  const { getFieldComments } = await import("./dictbiz_detail.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneDictbizDetail(
  search?: DictbizDetailSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./dictbiz_detail.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdDictbizDetail(
  id: string,
) {
  const { findById } = await import("./dictbiz_detail.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createDictbizDetail(
  input: DictbizDetailInput,
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dictbiz_detail",
    "add",
  );
  
  const {
    create,
  } = await import("./dictbiz_detail.service.ts");
  const res = await create(input);
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdDictbizDetail(
  id: string,
  input: DictbizDetailInput,
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dictbiz_detail",
    "edit",
  );
  
  const {
    updateById,
  } = await import("./dictbiz_detail.service.ts");
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsDictbizDetail(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dictbiz_detail",
    "delete",
  );
  
  const {
    deleteByIds,
  } = await import("./dictbiz_detail.service.ts");
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用数据
 */
export async function enableByIdsDictbizDetail(
  ids: string[],
  is_enabled: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDictbizDetail.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/dictbiz_detail",
    "enable",
  );
  
  const {
    enableByIds,
  } = await import("./dictbiz_detail.service.ts");
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsDictbizDetail(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDictbizDetail.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/base/dictbiz_detail",
    "lock",
  );
  
  const {
    lockByIds,
  } = await import("./dictbiz_detail.service.ts");
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsDictbizDetail(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dictbiz_detail",
    "delete",
  );
  
  const {
    revertByIds,
  } = await import("./dictbiz_detail.service.ts");
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsDictbizDetail(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dictbiz_detail",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./dictbiz_detail.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByDictbizDetail() {
  const { findLastOrderBy } = await import("./dictbiz_detail.service.ts");
  const res = findLastOrderBy();
  return res;
}
