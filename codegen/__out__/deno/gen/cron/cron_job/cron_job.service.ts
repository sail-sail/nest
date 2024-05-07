import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as cron_jobDao from "./cron_job.dao.ts";

/**
 * 根据条件查找定时任务总数
 * @param {CronJobSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: CronJobSearch,
): Promise<number> {
  search = search || { };
  const data = await cron_jobDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找定时任务列表
 * @param {CronJobSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<CronJobModel[]>} 
 */
export async function findAll(
  search?: CronJobSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<CronJobModel[]> {
  search = search || { };
  const models: CronJobModel[] = await cron_jobDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: CronJobInput,
) {
  const data = await cron_jobDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个定时任务
 * @param {CronJobSearch} search? 搜索条件
 */
export async function findOne(
  search?: CronJobSearch,
  sort?: SortInput|SortInput[],
): Promise<CronJobModel | undefined> {
  search = search || { };
  const model = await cron_jobDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找定时任务
 * @param {CronJobId} id
 */
export async function findById(
  id?: CronJobId | null,
): Promise<CronJobModel | undefined> {
  const model = await cron_jobDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找定时任务是否存在
 * @param {CronJobSearch} search? 搜索条件
 */
export async function exist(
  search?: CronJobSearch,
): Promise<boolean> {
  search = search || { };
  const data = await cron_jobDao.exist(search);
  return data;
}

/**
 * 根据 id 查找定时任务是否存在
 * @param {CronJobId} id
 */
export async function existById(
  id?: CronJobId | null,
): Promise<boolean> {
  const data = await cron_jobDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验定时任务
 * @param input 
 */
export async function validate(
  input: CronJobInput,
): Promise<void> {
  const data = await cron_jobDao.validate(input);
  return data;
}

/**
 * 批量创建定时任务
 * @param {CronJobInput[]} inputs
 * @return {Promise<CronJobId[]>} ids
 */
export async function creates(
  inputs: CronJobInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CronJobId[]> {
  const ids = await cron_jobDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改定时任务
 * @param {CronJobId} id
 * @param {CronJobInput} input
 * @return {Promise<CronJobId>}
 */
export async function updateById(
  id: CronJobId,
  input: CronJobInput,
): Promise<CronJobId> {
  
  const is_locked = await cron_jobDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2: CronJobId = await cron_jobDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除定时任务
 * @param {CronJobId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: CronJobId[],
): Promise<number> {
  
  {
    const ids2: CronJobId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: CronJobId = ids[i];
      const is_locked = await cron_jobDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  const data = await cron_jobDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用定时任务
 * @param {CronJobId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: CronJobId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await cron_jobDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁定时任务
 * @param {CronJobId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: CronJobId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await cron_jobDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原定时任务
 * @param {CronJobId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: CronJobId[],
): Promise<number> {
  const data = await cron_jobDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除定时任务
 * @param {CronJobId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: CronJobId[],
): Promise<number> {
  const data = await cron_jobDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取定时任务字段注释
 */
export async function getFieldComments(): Promise<CronJobFieldComment> {
  const data = await cron_jobDao.getFieldComments();
  return data;
}

/**
 * 查找 定时任务 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await cron_jobDao.findLastOrderBy();
  return data;
}
