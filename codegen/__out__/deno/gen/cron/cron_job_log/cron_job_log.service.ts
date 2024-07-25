import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as cron_job_logDao from "./cron_job_log.dao.ts";

async function setSearchQuery(
  _search: CronJobLogSearch,
) {
  
}

/**
 * 根据条件查找定时任务日志总数
 * @param {CronJobLogSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: CronJobLogSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await cron_job_logDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找定时任务日志列表
 * @param {CronJobLogSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<CronJobLogModel[]>} 
 */
export async function findAll(
  search?: CronJobLogSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<CronJobLogModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: CronJobLogModel[] = await cron_job_logDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: CronJobLogInput,
) {
  const data = await cron_job_logDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个定时任务日志
 * @param {CronJobLogSearch} search? 搜索条件
 */
export async function findOne(
  search?: CronJobLogSearch,
  sort?: SortInput|SortInput[],
): Promise<CronJobLogModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await cron_job_logDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找定时任务日志
 * @param {CronJobLogId} id
 */
export async function findById(
  id?: CronJobLogId | null,
): Promise<CronJobLogModel | undefined> {
  const model = await cron_job_logDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找定时任务日志是否存在
 * @param {CronJobLogSearch} search? 搜索条件
 */
export async function exist(
  search?: CronJobLogSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await cron_job_logDao.exist(search);
  return data;
}

/**
 * 根据 id 查找定时任务日志是否存在
 * @param {CronJobLogId} id
 */
export async function existById(
  id?: CronJobLogId | null,
): Promise<boolean> {
  const data = await cron_job_logDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验定时任务日志
 * @param input 
 */
export async function validate(
  input: CronJobLogInput,
): Promise<void> {
  const data = await cron_job_logDao.validate(input);
  return data;
}

/**
 * 批量创建定时任务日志
 * @param {CronJobLogInput[]} inputs
 * @return {Promise<CronJobLogId[]>} ids
 */
export async function creates(
  inputs: CronJobLogInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CronJobLogId[]> {
  const ids = await cron_job_logDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改定时任务日志
 * @param {CronJobLogId} id
 * @param {CronJobLogInput} input
 * @return {Promise<CronJobLogId>}
 */
export async function updateById(
  id: CronJobLogId,
  input: CronJobLogInput,
): Promise<CronJobLogId> {
  
  const id2 = await cron_job_logDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除定时任务日志
 * @param {CronJobLogId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: CronJobLogId[],
): Promise<number> {
  
  const data = await cron_job_logDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原定时任务日志
 * @param {CronJobLogId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: CronJobLogId[],
): Promise<number> {
  const data = await cron_job_logDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除定时任务日志
 * @param {CronJobLogId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: CronJobLogId[],
): Promise<number> {
  const data = await cron_job_logDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取定时任务日志字段注释
 */
export async function getFieldComments(): Promise<CronJobLogFieldComment> {
  const data = await cron_job_logDao.getFieldComments();
  return data;
}
