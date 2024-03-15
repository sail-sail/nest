import {
  useContext,
} from "/lib/context.ts";

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
  UsrId,
} from "./usr.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找用户总数
 */
export async function findCountUsr(
  search?: UsrSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./usr.service.ts");
  
  search = search || { };
  search.is_hidden = [ 0 ];
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找用户列表
 */
export async function findAllUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<UsrModel[]> {
  
  const {
    findAll,
  } = await import("./usr.service.ts");
  
  search = search || { };
  search.is_hidden = [ 0 ];
  
  const res = await findAll(search, page, sort);
  
  for (const model of res) {
    // 密码
    model.password = "";
  }
  return res;
}

/**
 * 获取用户字段注释
 */
export async function getFieldCommentsUsr(): Promise<UsrFieldComment> {
  const { getFieldComments } = await import("./usr.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个用户
 */
export async function findOneUsr(
  search?: UsrSearch,
  sort?: SortInput[],
): Promise<UsrModel | undefined> {
  
  const {
    findOne,
  } = await import("./usr.service.ts");
  
  search = search || { };
  search.is_hidden = [ 0 ];
  
  const res = await findOne(search, sort);
  
  if (res) {
    // 密码
    res.password = "";
  }
  return res;
}

/**
 * 根据 id 查找用户
 */
export async function findByIdUsr(
  id: UsrId,
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
 * 创建用户
 */
export async function createUsr(
  input: UsrInput,
  unique_type?: UniqueType,
): Promise<UsrId> {
  
  input.id = undefined;
  
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
  const id: UsrId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改用户
 */
export async function updateByIdUsr(
  id: UsrId,
  input: UsrInput,
): Promise<UsrId> {
  
  input.id = undefined;
  
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
  const id2: UsrId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除用户
 */
export async function deleteByIdsUsr(
  ids: UsrId[],
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
 * 根据 ids 启用或者禁用用户
 */
export async function enableByIdsUsr(
  ids: UsrId[],
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
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁用户
 */
export async function lockByIdsUsr(
  ids: UsrId[],
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
    "edit",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原用户
 */
export async function revertByIdsUsr(
  ids: UsrId[],
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
 * 根据 ids 彻底删除用户
 */
export async function forceDeleteByIdsUsr(
  ids: UsrId[],
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

/**
 * 查找 用户 order_by 字段的最大值
 */
export async function findLastOrderByUsr(): Promise<number> {
  const { findLastOrderBy } = await import("./usr.service.ts");
  const res = findLastOrderBy();
  return res;
}
