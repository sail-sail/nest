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
  
  const data = await roleDao.findCount(search);
  return data;
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
  
  const models: RoleModel[] = await roleDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: RoleInput,
) {
  const data = await roleDao.setIdByLbl(input);
  return data;
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
  
  const model = await roleDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找角色
 */
export async function findById(
  id?: RoleId | null,
): Promise<RoleModel | undefined> {
  const model = await roleDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找角色是否存在
 */
export async function exist(
  search?: RoleSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await roleDao.exist(search);
  return data;
}

/**
 * 根据 id 查找角色是否存在
 */
export async function existById(
  id?: RoleId | null,
): Promise<boolean> {
  const data = await roleDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验角色
 */
export async function validate(
  input: RoleInput,
): Promise<void> {
  const data = await roleDao.validate(input);
  return data;
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
  const ids = await roleDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改角色
 */
export async function updateById(
  id: RoleId,
  input: RoleInput,
): Promise<RoleId> {
  
  const is_locked = await roleDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 角色";
  }
  
  const id2 = await roleDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除角色
 */
export async function deleteByIds(
  ids: RoleId[],
): Promise<number> {
  
  {
    const models = await roleDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 角色";
      }
    }
  }
  
  {
    const models = await roleDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw "不能删除系统记录";
      }
    }
  }
  
  const data = await roleDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用角色
 */
export async function enableByIds(
  ids: RoleId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await roleDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁角色
 */
export async function lockByIds(
  ids: RoleId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await roleDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原角色
 */
export async function revertByIds(
  ids: RoleId[],
): Promise<number> {
  const data = await roleDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除角色
 */
export async function forceDeleteByIds(
  ids: RoleId[],
): Promise<number> {
  const data = await roleDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取角色字段注释
 */
export async function getFieldComments(): Promise<RoleFieldComment> {
  const data = await roleDao.getFieldComments();
  return data;
}

/**
 * 查找 角色 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await roleDao.findLastOrderBy();
  return data;
}
