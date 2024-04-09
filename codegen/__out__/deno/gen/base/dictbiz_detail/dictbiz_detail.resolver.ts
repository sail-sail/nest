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
 * 根据条件查找业务字典明细总数
 */
export async function findCountDictbizDetail(
  search?: DictbizDetailSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./dictbiz_detail.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找业务字典明细列表
 */
export async function findAllDictbizDetail(
  search?: DictbizDetailSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictbizDetailModel[]> {
  
  const {
    findAll,
  } = await import("./dictbiz_detail.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取业务字典明细字段注释
 */
export async function getFieldCommentsDictbizDetail(): Promise<DictbizDetailFieldComment> {
  const { getFieldComments } = await import("./dictbiz_detail.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个业务字典明细
 */
export async function findOneDictbizDetail(
  search?: DictbizDetailSearch,
  sort?: SortInput[],
): Promise<DictbizDetailModel | undefined> {
  
  const {
    findOne,
  } = await import("./dictbiz_detail.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找业务字典明细
 */
export async function findByIdDictbizDetail(
  id: DictbizDetailId,
): Promise<DictbizDetailModel | undefined> {
  const { findById } = await import("./dictbiz_detail.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建业务字典明细
 */
export async function createDictbizDetail(
  input: DictbizDetailInput,
  unique_type?: UniqueType,
): Promise<DictbizDetailId> {
  
  input.id = undefined;
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./dictbiz_detail.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/base/dictbiz_detail",
    "add",
  );
  const uniqueType = unique_type;
  const id: DictbizDetailId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改业务字典明细
 */
export async function updateByIdDictbizDetail(
  id: DictbizDetailId,
  input: DictbizDetailInput,
): Promise<DictbizDetailId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./dictbiz_detail.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/dictbiz_detail",
    "edit",
  );
  const id2: DictbizDetailId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除业务字典明细
 */
export async function deleteByIdsDictbizDetail(
  ids: DictbizDetailId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./dictbiz_detail.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dictbiz_detail",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用业务字典明细
 */
export async function enableByIdsDictbizDetail(
  ids: DictbizDetailId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./dictbiz_detail.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDictbizDetail.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/dictbiz_detail",
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁业务字典明细
 */
export async function lockByIdsDictbizDetail(
  ids: DictbizDetailId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./dictbiz_detail.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDictbizDetail.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/base/dictbiz_detail",
    "edit",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原业务字典明细
 */
export async function revertByIdsDictbizDetail(
  ids: DictbizDetailId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./dictbiz_detail.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/dictbiz_detail",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除业务字典明细
 */
export async function forceDeleteByIdsDictbizDetail(
  ids: DictbizDetailId[],
): Promise<number> {
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
 * 查找 业务字典明细 order_by 字段的最大值
 */
export async function findLastOrderByDictbizDetail(): Promise<number> {
  const { findLastOrderBy } = await import("./dictbiz_detail.service.ts");
  const res = findLastOrderBy();
  return res;
}
