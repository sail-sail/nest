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
export async function findCount(
  search?: RoleSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const role_num = await roleDao.findCount(search);
  
  return role_num;
}

/**
 * 根据搜索条件和分页查找角色列表
 */
export async function findAll(
  search?: RoleSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<RoleModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const role_models = await roleDao.findAll(search, page, sort);
  
  return role_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: RoleInput,
): Promise<void> {
  await roleDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个角色
 */
export async function findOne(
  search?: RoleSearch,
  sort?: SortInput[],
): Promise<RoleModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const role_model = await roleDao.findOne(search, sort);
  
  return role_model;
}

/**
 * 根据 id 查找角色
 */
export async function findById(
  role_id?: RoleId | null,
): Promise<RoleModel | undefined> {
  
  const role_model = await roleDao.findById(role_id);
  
  return role_model;
}

/**
 * 根据 ids 查找角色
 */
export async function findByIds(
  role_ids: RoleId[],
): Promise<RoleModel[]> {
  
  const role_models = await roleDao.findByIds(role_ids);
  
  return role_models;
}

/**
 * 根据搜索条件查找角色是否存在
 */
export async function exist(
  search?: RoleSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const role_exist = await roleDao.exist(search);
  
  return role_exist;
}

/**
 * 根据 id 查找角色是否存在
 */
export async function existById(
  role_id?: RoleId | null,
): Promise<boolean> {
  
  const role_exist = await roleDao.existById(role_id);
  
  return role_exist;
}

/**
 * 增加和修改时校验角色
 */
export async function validate(
  input: RoleInput,
): Promise<void> {
  await roleDao.validate(input);
}

/**
 * 批量创建角色
 */
export async function creates(
  inputs: RoleInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<RoleId[]> {
  const role_ids = await roleDao.creates(inputs, options);
  
  return role_ids;
}

/**
 * 根据 id 修改角色
 */
export async function updateById(
  role_id: RoleId,
  input: RoleInput,
): Promise<RoleId> {
  
  const is_locked = await roleDao.getIsLockedById(role_id);
  if (is_locked) {
    throw "不能修改已经锁定的 角色";
  }
  
  const role_id2 = await roleDao.updateById(role_id, input);
  
  return role_id2;
}

/** 校验角色是否存在 */
export async function validateOption(
  model0?: RoleModel,
): Promise<RoleModel> {
  const role_model = await roleDao.validateOption(model0);
  return role_model;
}

/**
 * 根据 ids 删除角色
 */
export async function deleteByIds(
  role_ids: RoleId[],
): Promise<number> {
  
  const old_models = await roleDao.findByIds(role_ids);
  
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
  
  const role_num = await roleDao.deleteByIds(role_ids);
  return role_num;
}

/**
 * 根据 ids 启用或者禁用角色
 */
export async function enableByIds(
  ids: RoleId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const role_num = await roleDao.enableByIds(ids, is_enabled);
  return role_num;
}

/**
 * 根据 ids 锁定或者解锁角色
 */
export async function lockByIds(
  role_ids: RoleId[],
  is_locked: 0 | 1,
): Promise<number> {
  const role_num = await roleDao.lockByIds(role_ids, is_locked);
  return role_num;
}

/**
 * 根据 ids 还原角色
 */
export async function revertByIds(
  role_ids: RoleId[],
): Promise<number> {
  
  const role_num = await roleDao.revertByIds(role_ids);
  
  return role_num;
}

/**
 * 根据 ids 彻底删除角色
 */
export async function forceDeleteByIds(
  role_ids: RoleId[],
): Promise<number> {
  
  const role_num = await roleDao.forceDeleteByIds(role_ids);
  
  return role_num;
}

/**
 * 获取角色字段注释
 */
export async function getFieldComments(): Promise<RoleFieldComment> {
  const role_fields = await roleDao.getFieldComments();
  return role_fields;
}

/**
 * 查找 角色 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const role_sort = await roleDao.findLastOrderBy();
  return role_sort;
}
