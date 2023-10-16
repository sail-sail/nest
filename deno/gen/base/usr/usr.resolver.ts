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
  UsrInput,
  UsrModel,
  UsrSearch,
  UsrFieldComment,
} from "./usr.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountUsr(
  search?: UsrSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const { findCount } = await import("./usr.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllUsr(
  search?: UsrSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<UsrModel[]> {
  const { findAll } = await import("./usr.service.ts");
  const res = await findAll(search, page, sort);
  
  for (const model of res) {
    // 密码
    model.password = "";
  }
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsUsr(): Promise<UsrFieldComment> {
  const { getFieldComments } = await import("./usr.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneUsr(
  search?: UsrSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<UsrModel | undefined> {
  const { findOne } = await import("./usr.service.ts");
  const res = await findOne(search, sort);
  
  if (res) {
    // 密码
    res.password = "";
  }
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdUsr(
  id: string,
): Promise<UsrModel | undefined> {
  const { findById } = await import("./usr.service.ts");
  const res = await findById(id);
  
  if (res) {
    // 密码
    res.password = "";
  }
  return res;
}

/**
 * 创建一条数据
 */
export async function createUsr(
  input: UsrInput,
  unique_type?: UniqueType,
): Promise<string> {
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/base/usr",
    "add",
  );
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdUsr(
  id: string,
  input: UsrInput,
): Promise<string> {
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/usr",
    "edit",
  );
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsUsr(
  ids: string[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/usr",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用数据
 */
export async function enableByIdsUsr(
  ids: string[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsUsr.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/base/usr",
    "enable",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsUsr(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsUsr.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/base/usr",
    "lock",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsUsr(
  ids: string[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/usr",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsUsr(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/usr",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./usr.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
