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
 */
export async function findCount(
  search?: CronJobLogSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_num = await cron_job_logDao.findCount(search);
  
  return cron_job_log_num;
}

/**
 * 根据搜索条件和分页查找定时任务日志列表
 */
export async function findAll(
  search?: CronJobLogSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CronJobLogModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_models = await cron_job_logDao.findAll(search, page, sort);
  
  return cron_job_log_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: CronJobLogInput,
): Promise<void> {
  await cron_job_logDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个定时任务日志
 */
export async function findOne(
  search?: CronJobLogSearch,
  sort?: SortInput[],
): Promise<CronJobLogModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_model = await cron_job_logDao.findOne(search, sort);
  
  return cron_job_log_model;
}

/**
 * 根据 id 查找定时任务日志
 */
export async function findById(
  cron_job_log_id?: CronJobLogId | null,
): Promise<CronJobLogModel | undefined> {
  
  const cron_job_log_model = await cron_job_logDao.findById(cron_job_log_id);
  
  return cron_job_log_model;
}

/**
 * 根据 ids 查找定时任务日志
 */
export async function findByIds(
  cron_job_log_ids: CronJobLogId[],
): Promise<CronJobLogModel[]> {
  
  const cron_job_log_models = await cron_job_logDao.findByIds(cron_job_log_ids);
  
  return cron_job_log_models;
}

/**
 * 根据搜索条件查找定时任务日志是否存在
 */
export async function exist(
  search?: CronJobLogSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_exist = await cron_job_logDao.exist(search);
  
  return cron_job_log_exist;
}

/**
 * 根据 id 查找定时任务日志是否存在
 */
export async function existById(
  cron_job_log_id?: CronJobLogId | null,
): Promise<boolean> {
  
  const cron_job_log_exist = await cron_job_logDao.existById(cron_job_log_id);
  
  return cron_job_log_exist;
}

/**
 * 增加和修改时校验定时任务日志
 */
export async function validate(
  input: CronJobLogInput,
): Promise<void> {
  await cron_job_logDao.validate(input);
}

/**
 * 批量创建定时任务日志
 */
export async function creates(
  inputs: CronJobLogInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CronJobLogId[]> {
  const cron_job_log_ids = await cron_job_logDao.creates(inputs, options);
  
  return cron_job_log_ids;
}

/**
 * 根据 id 修改定时任务日志
 */
export async function updateById(
  cron_job_log_id: CronJobLogId,
  input: CronJobLogInput,
): Promise<CronJobLogId> {
  
  const cron_job_log_id2 = await cron_job_logDao.updateById(cron_job_log_id, input);
  
  return cron_job_log_id2;
}

/** 校验定时任务日志是否存在 */
export async function validateOption(
  model0?: CronJobLogModel,
): Promise<CronJobLogModel> {
  const cron_job_log_model = await cron_job_logDao.validateOption(model0);
  return cron_job_log_model;
}

/**
 * 根据 ids 删除定时任务日志
 */
export async function deleteByIds(
  cron_job_log_ids: CronJobLogId[],
): Promise<number> {
  
  const cron_job_log_num = await cron_job_logDao.deleteByIds(cron_job_log_ids);
  return cron_job_log_num;
}

/**
 * 根据 ids 还原定时任务日志
 */
export async function revertByIds(
  cron_job_log_ids: CronJobLogId[],
): Promise<number> {
  
  const cron_job_log_num = await cron_job_logDao.revertByIds(cron_job_log_ids);
  
  return cron_job_log_num;
}

/**
 * 根据 ids 彻底删除定时任务日志
 */
export async function forceDeleteByIds(
  cron_job_log_ids: CronJobLogId[],
): Promise<number> {
  
  const cron_job_log_num = await cron_job_logDao.forceDeleteByIds(cron_job_log_ids);
  
  return cron_job_log_num;
}

/**
 * 获取定时任务日志字段注释
 */
export async function getFieldComments(): Promise<CronJobLogFieldComment> {
  const cron_job_log_fields = await cron_job_logDao.getFieldComments();
  return cron_job_log_fields;
}
