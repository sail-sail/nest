import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as orgDao from "./org.dao.ts";

/**
 * 根据条件查找组织总数
 * @param {OrgSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: OrgSearch,
): Promise<number> {
  search = search || { };
  const data = await orgDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找组织列表
 * @param {OrgSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<OrgModel[]>} 
 */
export async function findAll(
  search?: OrgSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<OrgModel[]> {
  search = search || { };
  const models: OrgModel[] = await orgDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: OrgInput,
) {
  const data = await orgDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个组织
 * @param {OrgSearch} search? 搜索条件
 */
export async function findOne(
  search?: OrgSearch,
  sort?: SortInput|SortInput[],
): Promise<OrgModel | undefined> {
  search = search || { };
  const model = await orgDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找组织
 * @param {OrgId} id
 */
export async function findById(
  id?: OrgId | null,
): Promise<OrgModel | undefined> {
  const model = await orgDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找组织是否存在
 * @param {OrgSearch} search? 搜索条件
 */
export async function exist(
  search?: OrgSearch,
): Promise<boolean> {
  search = search || { };
  const data = await orgDao.exist(search);
  return data;
}

/**
 * 根据 id 查找组织是否存在
 * @param {OrgId} id
 */
export async function existById(
  id?: OrgId | null,
): Promise<boolean> {
  const data = await orgDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验组织
 * @param input 
 */
export async function validate(
  input: OrgInput,
): Promise<void> {
  const data = await orgDao.validate(input);
  return data;
}

/**
 * 批量创建组织
 * @param {OrgInput[]} inputs
 * @return {Promise<OrgId[]>} ids
 */
export async function creates(
  inputs: OrgInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<OrgId[]> {
  const ids = await orgDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改组织
 * @param {OrgId} id
 * @param {OrgInput} input
 * @return {Promise<OrgId>}
 */
export async function updateById(
  id: OrgId,
  input: OrgInput,
): Promise<OrgId> {
  
  const is_locked = await orgDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2: OrgId = await orgDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除组织
 * @param {OrgId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: OrgId[],
): Promise<number> {
  
  {
    const ids2: OrgId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: OrgId = ids[i];
      const is_locked = await orgDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  const data = await orgDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用组织
 * @param {OrgId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: OrgId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await orgDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁组织
 * @param {OrgId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: OrgId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await orgDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原组织
 * @param {OrgId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: OrgId[],
): Promise<number> {
  const data = await orgDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除组织
 * @param {OrgId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: OrgId[],
): Promise<number> {
  const data = await orgDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取组织字段注释
 */
export async function getFieldComments(): Promise<OrgFieldComment> {
  const data = await orgDao.getFieldComments();
  return data;
}

/**
 * 查找 组织 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await orgDao.findLastOrderBy();
  return data;
}
