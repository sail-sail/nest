import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as jobDao from "./job.dao.ts";

/**
 * 根据条件查找任务总数
 * @param {JobSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: JobSearch,
): Promise<number> {
  search = search || { };
  const data = await jobDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找任务列表
 * @param {JobSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<JobModel[]>} 
 */
export async function findAll(
  search?: JobSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<JobModel[]> {
  search = search || { };
  const models: JobModel[] = await jobDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: JobInput,
) {
  const data = await jobDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个任务
 * @param {JobSearch} search? 搜索条件
 */
export async function findOne(
  search?: JobSearch,
  sort?: SortInput|SortInput[],
): Promise<JobModel | undefined> {
  search = search || { };
  const model = await jobDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找任务
 * @param {JobId} id
 */
export async function findById(
  id?: JobId | null,
): Promise<JobModel | undefined> {
  const model = await jobDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找任务是否存在
 * @param {JobSearch} search? 搜索条件
 */
export async function exist(
  search?: JobSearch,
): Promise<boolean> {
  search = search || { };
  const data = await jobDao.exist(search);
  return data;
}

/**
 * 根据 id 查找任务是否存在
 * @param {JobId} id
 */
export async function existById(
  id?: JobId | null,
): Promise<boolean> {
  const data = await jobDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验任务
 * @param input 
 */
export async function validate(
  input: JobInput,
): Promise<void> {
  const data = await jobDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {JobInput} input
 * @return {Promise<JobId>} id
 */
export async function create(
  input: JobInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<JobId> {
  const id: JobId = await jobDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改任务
 * @param {JobId} id
 * @param {JobInput} input
 * @return {Promise<JobId>}
 */
export async function updateById(
  id: JobId,
  input: JobInput,
): Promise<JobId> {
  
  const is_locked = await jobDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  // 不能修改系统记录的系统字段
  const model = await jobDao.findById(id);
  if (model && model.is_sys === 1) {
    // 编码
    input.code = undefined;
  }
  
  const id2: JobId = await jobDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除任务
 * @param {JobId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: JobId[],
): Promise<number> {
  
  {
    const ids2: JobId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: JobId = ids[i];
      const is_locked = await jobDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  {
    const ids2: JobId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: JobId = ids[i];
      const model = await jobDao.findById(id);
      if (model && model.is_sys === 1) {
        continue;
      }
      ids2.push(id);
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除系统记录");
    }
    ids = ids2;
  }
  
  const data = await jobDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用任务
 * @param {JobId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: JobId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await jobDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁任务
 * @param {JobId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: JobId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await jobDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原任务
 * @param {JobId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: JobId[],
): Promise<number> {
  const data = await jobDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除任务
 * @param {JobId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: JobId[],
): Promise<number> {
  const data = await jobDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取任务字段注释
 */
export async function getFieldComments(): Promise<JobFieldComment> {
  const data = await jobDao.getFieldComments();
  return data;
}

/**
 * 查找 任务 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await jobDao.findLastOrderBy();
  return data;
}
