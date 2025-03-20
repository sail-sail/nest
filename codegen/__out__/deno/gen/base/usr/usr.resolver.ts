import {
  set_is_tran,
  set_is_creating,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortUsr,
} from "./usr.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./usr.model.ts";

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
  
  const num = await findCount(search);
  
  return num;
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
  
  checkSortUsr(sort);
  
  const models = await findAll(search, page, sort);
  
  for (const model of models) {
    // 密码
    model.password = "";
  }
  
  return models;
}

/**
 * 获取用户字段注释
 */
export async function getFieldCommentsUsr(): Promise<UsrFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./usr.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
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
  
  checkSortUsr(sort);
  
  const model = await findOne(search, sort);
  
  if (model) {
    // 密码
    model.password = "";
  }
  
  return model;
}

/**
 * 根据 id 查找用户
 */
export async function findByIdUsr(
  id: UsrId,
): Promise<UsrModel | undefined> {
  
  const {
    findById,
  } = await import("./usr.service.ts");
  
  const model = await findById(id);
  
  if (model) {
    // 密码
    model.password = "";
  }
  
  return model;
}

/**
 * 根据 ids 查找用户
 */
export async function findByIdsUsr(
  ids: UsrId[],
): Promise<UsrModel[]> {
  
  const {
    findByIds,
  } = await import("./usr.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
    // 密码
    model.password = "";
  }
  
  return models;
}

/**
 * 批量创建用户
 */
export async function createsUsr(
  inputs: UsrInput[],
  unique_type?: UniqueType,
): Promise<UsrId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./usr.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLbl(input);
    
    await validate(input);
  }
  const uniqueType = unique_type;
  const ids = await creates(inputs, { uniqueType });
  return ids;
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
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
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
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
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
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsUsr.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
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
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsUsr.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
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
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
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
  
  const {
    forceDeleteByIds,
  } = await import("./usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 用户 order_by 字段的最大值
 */
export async function findLastOrderByUsr(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./usr.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
