import {
  ns,
} from "/src/base/i18n/i18n.ts";

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

import * as usrDao from "./usr.dao.ts";

/**
 * 根据条件查找用户总数
 * @param {UsrSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: UsrSearch,
): Promise<number> {
  search = search || { };
  const data = await usrDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找用户列表
 * @param {UsrSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<UsrModel[]>} 
 */
export async function findAll(
  search?: UsrSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<UsrModel[]> {
  search = search || { };
  const models: UsrModel[] = await usrDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: UsrInput,
) {
  const data = await usrDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个用户
 * @param {UsrSearch} search? 搜索条件
 */
export async function findOne(
  search?: UsrSearch,
  sort?: SortInput|SortInput[],
): Promise<UsrModel | undefined> {
  search = search || { };
  const model = await usrDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找用户
 * @param {UsrId} id
 */
export async function findById(
  id?: UsrId | null,
): Promise<UsrModel | undefined> {
  const model = await usrDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找用户是否存在
 * @param {UsrSearch} search? 搜索条件
 */
export async function exist(
  search?: UsrSearch,
): Promise<boolean> {
  search = search || { };
  const data = await usrDao.exist(search);
  return data;
}

/**
 * 根据 id 查找用户是否存在
 * @param {UsrId} id
 */
export async function existById(
  id?: UsrId | null,
): Promise<boolean> {
  const data = await usrDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验用户
 * @param input 
 */
export async function validate(
  input: UsrInput,
): Promise<void> {
  const data = await usrDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {UsrInput} input
 * @return {Promise<UsrId>} id
 */
export async function create(
  input: UsrInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<UsrId> {
  const id: UsrId = await usrDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改用户
 * @param {UsrId} id
 * @param {UsrInput} input
 * @return {Promise<UsrId>}
 */
export async function updateById(
  id: UsrId,
  input: UsrInput,
): Promise<UsrId> {
  
  const is_locked = await usrDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2: UsrId = await usrDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除用户
 * @param {UsrId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: UsrId[],
): Promise<number> {
  
  {
    const ids2: UsrId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: UsrId = ids[i];
      const is_locked = await usrDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  const data = await usrDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用用户
 * @param {UsrId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: UsrId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await usrDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁用户
 * @param {UsrId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: UsrId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await usrDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原用户
 * @param {UsrId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: UsrId[],
): Promise<number> {
  const data = await usrDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除用户
 * @param {UsrId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: UsrId[],
): Promise<number> {
  const data = await usrDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取用户字段注释
 */
export async function getFieldComments(): Promise<UsrFieldComment> {
  const data = await usrDao.getFieldComments();
  return data;
}

/**
 * 查找 用户 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await usrDao.findLastOrderBy();
  return data;
}
