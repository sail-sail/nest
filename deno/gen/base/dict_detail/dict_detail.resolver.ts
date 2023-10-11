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
  DictDetailInput,
  DictDetailModel,
  DictDetailSearch,
  DictDetailFieldComment,
} from "./dict_detail.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountDictDetail(
  search?: DictDetailSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const { findCount } = await import("./dict_detail.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllDictDetail(
  search?: DictDetailSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictDetailModel[]> {
  const { findAll } = await import("./dict_detail.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsDictDetail(): Promise<DictDetailFieldComment> {
  const { getFieldComments } = await import("./dict_detail.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneDictDetail(
  search?: DictDetailSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<DictDetailModel | undefined> {
  const { findOne } = await import("./dict_detail.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdDictDetail(
  id: string,
): Promise<DictDetailModel | undefined> {
  const { findById } = await import("./dict_detail.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createDictDetail(
  input: DictDetailInput,
  unique_type?: UniqueType,
): Promise<string> {
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./dict_detail.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/base/dict_detail",
    "add",
  );
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdDictDetail(
  id: string,
  input: DictDetailInput,
): Promise<string> {
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./dict_detail.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/dict_detail",
    "edit",
  );
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsDictDetail(
  ids: string[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./dict_detail.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dict_detail",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用数据
 */
export async function enableByIdsDictDetail(
  ids: string[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./dict_detail.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDictDetail.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/dict_detail",
    "enable",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsDictDetail(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./dict_detail.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDictDetail.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/base/dict_detail",
    "lock",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsDictDetail(
  ids: string[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./dict_detail.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dict_detail",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsDictDetail(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dict_detail",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./dict_detail.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByDictDetail(): Promise<number> {
  const { findLastOrderBy } = await import("./dict_detail.service.ts");
  const res = findLastOrderBy();
  return res;
}
