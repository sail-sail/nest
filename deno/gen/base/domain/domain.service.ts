import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as domainDao from "./domain.dao.ts";

/**
 * 根据条件查找域名总数
 * @param {DomainSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: DomainSearch,
): Promise<number> {
  search = search || { };
  const data = await domainDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找域名列表
 * @param {DomainSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<DomainModel[]>} 
 */
export async function findAll(
  search?: DomainSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<DomainModel[]> {
  search = search || { };
  const models: DomainModel[] = await domainDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: DomainInput,
) {
  const data = await domainDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个域名
 * @param {DomainSearch} search? 搜索条件
 */
export async function findOne(
  search?: DomainSearch,
  sort?: SortInput|SortInput[],
): Promise<DomainModel | undefined> {
  search = search || { };
  const model = await domainDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找域名
 * @param {DomainId} id
 */
export async function findById(
  id?: DomainId | null,
): Promise<DomainModel | undefined> {
  const model = await domainDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找域名是否存在
 * @param {DomainSearch} search? 搜索条件
 */
export async function exist(
  search?: DomainSearch,
): Promise<boolean> {
  search = search || { };
  const data = await domainDao.exist(search);
  return data;
}

/**
 * 根据 id 查找域名是否存在
 * @param {DomainId} id
 */
export async function existById(
  id?: DomainId | null,
): Promise<boolean> {
  const data = await domainDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验域名
 * @param input 
 */
export async function validate(
  input: DomainInput,
): Promise<void> {
  const data = await domainDao.validate(input);
  return data;
}

/**
 * 创建域名
 * @param {DomainInput} input
 * @return {Promise<DomainId>} id
 */
export async function create(
  input: DomainInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DomainId> {
  const id = await domainDao.create(input, options);
  return id;
}

/**
 * 批量创建域名
 * @param {DomainInput[]} inputs
 * @return {Promise<DomainId[]>} ids
 */
export async function creates(
  inputs: DomainInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DomainId[]> {
  const ids = await domainDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改域名
 * @param {DomainId} id
 * @param {DomainInput} input
 * @return {Promise<DomainId>}
 */
export async function updateById(
  id: DomainId,
  input: DomainInput,
): Promise<DomainId> {
  
  const is_locked = await domainDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2: DomainId = await domainDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除域名
 * @param {DomainId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: DomainId[],
): Promise<number> {
  
  {
    const ids2: DomainId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: DomainId = ids[i];
      const is_locked = await domainDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  const data = await domainDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 id 设置默认域名
 * @param {DomainId} id
 * @return {Promise<number>}
 */
export async function defaultById(
  id: DomainId,
): Promise<number> {
  const data = await domainDao.defaultById(id);
  return data;
}

/**
 * 根据 ids 启用或者禁用域名
 * @param {DomainId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: DomainId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await domainDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁域名
 * @param {DomainId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: DomainId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await domainDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原域名
 * @param {DomainId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: DomainId[],
): Promise<number> {
  const data = await domainDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除域名
 * @param {DomainId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: DomainId[],
): Promise<number> {
  const data = await domainDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取域名字段注释
 */
export async function getFieldComments(): Promise<DomainFieldComment> {
  const data = await domainDao.getFieldComments();
  return data;
}

/**
 * 查找 域名 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await domainDao.findLastOrderBy();
  return data;
}
