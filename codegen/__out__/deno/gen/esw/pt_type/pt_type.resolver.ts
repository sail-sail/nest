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
  PtTypeInput,
  PtTypeModel,
  PtTypeSearch,
  PtTypeFieldComment,
  PtTypeId,
} from "./pt_type.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountPtType(
  search?: PtTypeSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./pt_type.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllPtType(
  search?: PtTypeSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<PtTypeModel[]> {
  
  const {
    findAll,
  } = await import("./pt_type.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsPtType(): Promise<PtTypeFieldComment> {
  const { getFieldComments } = await import("./pt_type.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOnePtType(
  search?: PtTypeSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<PtTypeModel | undefined> {
  
  const {
    findOne,
  } = await import("./pt_type.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdPtType(
  id: PtTypeId,
): Promise<PtTypeModel | undefined> {
  const { findById } = await import("./pt_type.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createPtType(
  input: PtTypeInput,
  unique_type?: UniqueType,
): Promise<PtTypeId> {
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./pt_type.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/esw/pt_type",
    "add",
  );
  const uniqueType = unique_type;
  const id: PtTypeId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdPtType(
  id: PtTypeId,
  input: PtTypeInput,
): Promise<PtTypeId> {
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./pt_type.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/esw/pt_type",
    "edit",
  );
  const id2: PtTypeId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsPtType(
  ids: PtTypeId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./pt_type.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/pt_type",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用数据
 */
export async function enableByIdsPtType(
  ids: PtTypeId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./pt_type.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsPtType.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/esw/pt_type",
    "enable",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsPtType(
  ids: PtTypeId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./pt_type.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsPtType.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/esw/pt_type",
    "lock",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsPtType(
  ids: PtTypeId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./pt_type.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/pt_type",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsPtType(
  ids: PtTypeId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/pt_type",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./pt_type.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByPtType(): Promise<number> {
  const { findLastOrderBy } = await import("./pt_type.service.ts");
  const res = findLastOrderBy();
  return res;
}
