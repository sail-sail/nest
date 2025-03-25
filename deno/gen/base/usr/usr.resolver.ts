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
    findCountUsr,
  } = await import("./usr.service.ts");
  
  search = search || { };
  search.is_hidden = [ 0 ];
  
  const num = await findCountUsr(search);
  
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
    findAllUsr,
  } = await import("./usr.service.ts");
  
  search = search || { };
  search.is_hidden = [ 0 ];
  
  checkSortUsr(sort);
  
  const models = await findAllUsr(search, page, sort);
  
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
    getFieldCommentsUsr,
  } = await import("./usr.service.ts");
  
  const field_comment = await getFieldCommentsUsr();
  
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
    findOneUsr,
  } = await import("./usr.service.ts");
  
  search = search || { };
  search.is_hidden = [ 0 ];
  
  checkSortUsr(sort);
  
  const model = await findOneUsr(search, sort);
  
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
    findByIdUsr,
  } = await import("./usr.service.ts");
  
  const model = await findByIdUsr(id);
  
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
    findByIdsUsr,
  } = await import("./usr.service.ts");
  
  const models = await findByIdsUsr(ids);
  
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
    validateUsr,
    setIdByLblUsr,
    createsUsr,
  } = await import("./usr.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblUsr(input);
    
    await validateUsr(input);
  }
  const uniqueType = unique_type;
  const ids = await createsUsr(inputs, { uniqueType });
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
    setIdByLblUsr,
    updateByIdUsr,
  } = await import("./usr.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblUsr(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: UsrId = await updateByIdUsr(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除用户
 */
export async function deleteByIdsUsr(
  ids: UsrId[],
): Promise<number> {
  
  const {
    deleteByIdsUsr,
  } = await import("./usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsUsr(ids);
  
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
    enableByIdsUsr,
  } = await import("./usr.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsUsr.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsUsr(ids, is_enabled);
  
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
    lockByIdsUsr,
  } = await import("./usr.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsUsr.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsUsr(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原用户
 */
export async function revertByIdsUsr(
  ids: UsrId[],
): Promise<number> {
  
  const {
    revertByIdsUsr,
  } = await import("./usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsUsr(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除用户
 */
export async function forceDeleteByIdsUsr(
  ids: UsrId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsUsr,
  } = await import("./usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsUsr(ids);
  
  return res;
}

/**
 * 查找 用户 order_by 字段的最大值
 */
export async function findLastOrderByUsr(): Promise<number> {
  
  const {
    findLastOrderByUsr,
  } = await import("./usr.service.ts");
  
  const res = findLastOrderByUsr();
  
  return res;
}
