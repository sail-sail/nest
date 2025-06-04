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
export async function findCountCronJobLog(
  search?: CronJobLogSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_num = await cron_job_logDao.findCountCronJobLog(search);
  
  return cron_job_log_num;
}

/**
 * 根据搜索条件和分页查找定时任务日志列表
 */
export async function findAllCronJobLog(
  search?: CronJobLogSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CronJobLogModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_models = await cron_job_logDao.findAllCronJobLog(search, page, sort);
  
  return cron_job_log_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblCronJobLog(
  input: CronJobLogInput,
): Promise<void> {
  await cron_job_logDao.setIdByLblCronJobLog(input);
}

/**
 * 根据条件查找第一个定时任务日志
 */
export async function findOneCronJobLog(
  search?: CronJobLogSearch,
  sort?: SortInput[],
): Promise<CronJobLogModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_model = await cron_job_logDao.findOneCronJobLog(search, sort);
  
  return cron_job_log_model;
}

/**
 * 根据条件查找第一个定时任务日志, 如果不存在则抛错
 */
export async function findOneOkCronJobLog(
  search?: CronJobLogSearch,
  sort?: SortInput[],
): Promise<CronJobLogModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_model = await cron_job_logDao.findOneOkCronJobLog(search, sort);
  
  return cron_job_log_model;
}

/**
 * 根据 id 查找定时任务日志
 */
export async function findByIdCronJobLog(
  cron_job_log_id: CronJobLogId,
): Promise<CronJobLogModel | undefined> {
  
  const cron_job_log_model = await cron_job_logDao.findByIdCronJobLog(cron_job_log_id);
  
  return cron_job_log_model;
}

/**
 * 根据 id 查找定时任务日志, 如果不存在则抛错
 */
export async function findByIdOkCronJobLog(
  cron_job_log_id: CronJobLogId,
): Promise<CronJobLogModel> {
  
  const cron_job_log_model = await cron_job_logDao.findByIdOkCronJobLog(cron_job_log_id);
  
  return cron_job_log_model;
}

/**
 * 根据 ids 查找定时任务日志
 */
export async function findByIdsCronJobLog(
  cron_job_log_ids: CronJobLogId[],
): Promise<CronJobLogModel[]> {
  
  const cron_job_log_models = await cron_job_logDao.findByIdsCronJobLog(cron_job_log_ids);
  
  return cron_job_log_models;
}

/**
 * 根据 ids 查找定时任务日志, 出现查询不到的 id 则报错
 */
export async function findByIdsOkCronJobLog(
  cron_job_log_ids: CronJobLogId[],
): Promise<CronJobLogModel[]> {
  
  const cron_job_log_models = await cron_job_logDao.findByIdsOkCronJobLog(cron_job_log_ids);
  
  return cron_job_log_models;
}

/**
 * 根据搜索条件查找定时任务日志是否存在
 */
export async function existCronJobLog(
  search?: CronJobLogSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_exist = await cron_job_logDao.existCronJobLog(search);
  
  return cron_job_log_exist;
}

/**
 * 根据 id 查找定时任务日志是否存在
 */
export async function existByIdCronJobLog(
  cron_job_log_id?: CronJobLogId | null,
): Promise<boolean> {
  
  const cron_job_log_exist = await cron_job_logDao.existByIdCronJobLog(cron_job_log_id);
  
  return cron_job_log_exist;
}

/**
 * 增加和修改时校验定时任务日志
 */
export async function validateCronJobLog(
  input: CronJobLogInput,
): Promise<void> {
  await cron_job_logDao.validateCronJobLog(input);
}

/**
 * 批量创建定时任务日志
 */
export async function createsCronJobLog(
  inputs: CronJobLogInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CronJobLogId[]> {
  const cron_job_log_ids = await cron_job_logDao.createsCronJobLog(inputs, options);
  
  return cron_job_log_ids;
}

/**
 * 根据 id 修改定时任务日志
 */
export async function updateByIdCronJobLog(
  cron_job_log_id: CronJobLogId,
  input: CronJobLogInput,
): Promise<CronJobLogId> {
  
  const cron_job_log_id2 = await cron_job_logDao.updateByIdCronJobLog(cron_job_log_id, input);
  
  return cron_job_log_id2;
}

/** 校验定时任务日志是否存在 */
export async function validateOptionCronJobLog(
  model0?: CronJobLogModel,
): Promise<CronJobLogModel> {
  const cron_job_log_model = await cron_job_logDao.validateOptionCronJobLog(model0);
  return cron_job_log_model;
}

/**
 * 根据 ids 删除定时任务日志
 */
export async function deleteByIdsCronJobLog(
  cron_job_log_ids: CronJobLogId[],
): Promise<number> {
  
  const cron_job_log_num = await cron_job_logDao.deleteByIdsCronJobLog(cron_job_log_ids);
  return cron_job_log_num;
}

/**
 * 根据 ids 还原定时任务日志
 */
export async function revertByIdsCronJobLog(
  cron_job_log_ids: CronJobLogId[],
): Promise<number> {
  
  const cron_job_log_num = await cron_job_logDao.revertByIdsCronJobLog(cron_job_log_ids);
  
  return cron_job_log_num;
}

/**
 * 根据 ids 彻底删除定时任务日志
 */
export async function forceDeleteByIdsCronJobLog(
  cron_job_log_ids: CronJobLogId[],
): Promise<number> {
  
  const cron_job_log_num = await cron_job_logDao.forceDeleteByIdsCronJobLog(cron_job_log_ids);
  
  return cron_job_log_num;
}

/**
 * 获取定时任务日志字段注释
 */
export async function getFieldCommentsCronJobLog(): Promise<CronJobLogFieldComment> {
  const cron_job_log_fields = await cron_job_logDao.getFieldCommentsCronJobLog();
  return cron_job_log_fields;
}
