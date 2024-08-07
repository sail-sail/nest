import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as roleDao from "./role.dao.ts";

async function setSearchQuery(
  _search: RoleSearch,
) {
  
}

/**
 * 根据条件查找角色总数
 * @param {RoleSearch} search? 搜索条件
 * @return {Promise<number>}
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
 * @param {RoleSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<RoleModel[]>} 
 */
export async function findAll(
  search?: RoleSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<RoleModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: RoleModel[] = await roleDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: RoleInput,
) {
  const data = await roleDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个角色
 * @param {RoleSearch} search? 搜索条件
 */
export async function findOne(
  search?: RoleSearch,
  sort?: SortInput|SortInput[],
): Promise<RoleModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await roleDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找角色
 * @param {RoleId} id
 */
export async function findById(
  id?: RoleId | null,
): Promise<RoleModel | undefined> {
  const model = await roleDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找角色是否存在
 * @param {RoleSearch} search? 搜索条件
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
 * @param {RoleId} id
 */
export async function existById(
  id?: RoleId | null,
): Promise<boolean> {
  const data = await roleDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验角色
 * @param input 
 */
export async function validate(
  input: RoleInput,
): Promise<void> {
  const data = await roleDao.validate(input);
  return data;
}

/**
 * 批量创建角色
 * @param {RoleInput[]} inputs
 * @return {Promise<RoleId[]>} ids
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
 * @param {RoleId} id
 * @param {RoleInput} input
 * @return {Promise<RoleId>}
 */
export async function updateById(
  id: RoleId,
  input: RoleInput,
): Promise<RoleId> {
  
  const is_locked = await roleDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2 = await roleDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除角色
 * @param {RoleId[]} ids
 * @return {Promise<number>}
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
        throw await ns("不能删除已经锁定的 {0}", "角色");
      }
    }
  }
  
  const data = await roleDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用角色
 * @param {RoleId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
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
 * @param {RoleId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
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
 * @param {RoleId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: RoleId[],
): Promise<number> {
  const data = await roleDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除角色
 * @param {RoleId[]} ids
 * @return {Promise<number>}
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
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await roleDao.findLastOrderBy();
  return data;
}
