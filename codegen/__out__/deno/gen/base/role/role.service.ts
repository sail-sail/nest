import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as roleDao from "./role.dao.ts";

async function setSearchQuery(
  _search: RoleSearch,
) {
  
}

/**
 * 根据条件查找角色总数
 */
export async function findCountRole(
  search?: RoleSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const role_num = await roleDao.findCountRole(search);
  
  return role_num;
}

/**
 * 根据搜索条件和分页查找角色列表
 */
export async function findAllRole(
  search?: RoleSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<RoleModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const role_models = await roleDao.findAllRole(search, page, sort);
  
  return role_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblRole(
  input: RoleInput,
): Promise<void> {
  await roleDao.setIdByLblRole(input);
}

/**
 * 根据条件查找第一个角色
 */
export async function findOneRole(
  search?: RoleSearch,
  sort?: SortInput[],
): Promise<RoleModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const role_model = await roleDao.findOneRole(search, sort);
  
  return role_model;
}

/**
 * 根据条件查找第一个角色, 如果不存在则抛错
 */
export async function findOneOkRole(
  search?: RoleSearch,
  sort?: SortInput[],
): Promise<RoleModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const role_model = await roleDao.findOneOkRole(search, sort);
  
  return role_model;
}

/**
 * 根据 id 查找角色
 */
export async function findByIdRole(
  role_id: RoleId,
): Promise<RoleModel | undefined> {
  
  const role_model = await roleDao.findByIdRole(role_id);
  
  return role_model;
}

/**
 * 根据 id 查找角色, 如果不存在则抛错
 */
export async function findByIdOkRole(
  role_id: RoleId,
): Promise<RoleModel> {
  
  const role_model = await roleDao.findByIdOkRole(role_id);
  
  return role_model;
}

/**
 * 根据 ids 查找角色
 */
export async function findByIdsRole(
  role_ids: RoleId[],
): Promise<RoleModel[]> {
  
  const role_models = await roleDao.findByIdsRole(role_ids);
  
  return role_models;
}

/**
 * 根据 ids 查找角色, 出现查询不到的 id 则报错
 */
export async function findByIdsOkRole(
  role_ids: RoleId[],
): Promise<RoleModel[]> {
  
  const role_models = await roleDao.findByIdsOkRole(role_ids);
  
  return role_models;
}

/**
 * 根据搜索条件查找角色是否存在
 */
export async function existRole(
  search?: RoleSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const role_exist = await roleDao.existRole(search);
  
  return role_exist;
}

/**
 * 根据 id 查找角色是否存在
 */
export async function existByIdRole(
  role_id?: RoleId | null,
): Promise<boolean> {
  
  const role_exist = await roleDao.existByIdRole(role_id);
  
  return role_exist;
}

/**
 * 增加和修改时校验角色
 */
export async function validateRole(
  input: RoleInput,
): Promise<void> {
  await roleDao.validateRole(input);
}

/**
 * 批量创建角色
 */
export async function createsRole(
  inputs: RoleInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<RoleId[]> {
  const role_ids = await roleDao.createsRole(inputs, options);
  
  return role_ids;
}

/**
 * 根据 id 修改角色
 */
export async function updateByIdRole(
  role_id: RoleId,
  input: RoleInput,
): Promise<RoleId> {
  
  const is_locked = await roleDao.getIsLockedByIdRole(role_id);
  if (is_locked) {
    throw "不能修改已经锁定的 角色";
  }
  
  const role_id2 = await roleDao.updateByIdRole(role_id, input);
  
  return role_id2;
}

/** 校验角色是否存在 */
export async function validateOptionRole(
  model0?: RoleModel,
): Promise<RoleModel> {
  const role_model = await roleDao.validateOptionRole(model0);
  return role_model;
}

/**
 * 根据 ids 删除角色
 */
export async function deleteByIdsRole(
  role_ids: RoleId[],
): Promise<number> {
  
  const old_models = await roleDao.findByIdsRole(role_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 角色";
    }
  }
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const role_num = await roleDao.deleteByIdsRole(role_ids);
  return role_num;
}

/**
 * 根据 ids 启用或者禁用角色
 */
export async function enableByIdsRole(
  ids: RoleId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const role_num = await roleDao.enableByIdsRole(ids, is_enabled);
  return role_num;
}

/**
 * 根据 ids 锁定或者解锁角色
 */
export async function lockByIdsRole(
  role_ids: RoleId[],
  is_locked: 0 | 1,
): Promise<number> {
  const role_num = await roleDao.lockByIdsRole(role_ids, is_locked);
  return role_num;
}

/**
 * 根据 ids 还原角色
 */
export async function revertByIdsRole(
  role_ids: RoleId[],
): Promise<number> {
  
  const role_num = await roleDao.revertByIdsRole(role_ids);
  
  return role_num;
}

/**
 * 根据 ids 彻底删除角色
 */
export async function forceDeleteByIdsRole(
  role_ids: RoleId[],
): Promise<number> {
  
  const role_num = await roleDao.forceDeleteByIdsRole(role_ids);
  
  return role_num;
}

/**
 * 获取角色字段注释
 */
export async function getFieldCommentsRole(): Promise<RoleFieldComment> {
  const role_fields = await roleDao.getFieldCommentsRole();
  return role_fields;
}

/**
 * 查找 角色 order_by 字段的最大值
 */
export async function findLastOrderByRole(
): Promise<number> {
  const role_sort = await roleDao.findLastOrderByRole();
  return role_sort;
}
