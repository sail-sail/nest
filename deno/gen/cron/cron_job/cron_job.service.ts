import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as cron_jobDao from "./cron_job.dao.ts";

async function setSearchQuery(
  _search: CronJobSearch,
) {
  
}

/**
 * 根据条件查找定时任务总数
 */
export async function findCountCronJob(
  search?: CronJobSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_num = await cron_jobDao.findCountCronJob(search);
  
  return cron_job_num;
}

/**
 * 根据搜索条件和分页查找定时任务列表
 */
export async function findAllCronJob(
  search?: CronJobSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CronJobModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_models = await cron_jobDao.findAllCronJob(search, page, sort);
  
  return cron_job_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblCronJob(
  input: CronJobInput,
): Promise<void> {
  await cron_jobDao.setIdByLblCronJob(input);
}

/**
 * 根据条件查找第一个定时任务
 */
export async function findOneCronJob(
  search?: CronJobSearch,
  sort?: SortInput[],
): Promise<CronJobModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_model = await cron_jobDao.findOneCronJob(search, sort);
  
  return cron_job_model;
}

/**
 * 根据条件查找第一个定时任务, 如果不存在则抛错
 */
export async function findOneOkCronJob(
  search?: CronJobSearch,
  sort?: SortInput[],
): Promise<CronJobModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_model = await cron_jobDao.findOneOkCronJob(search, sort);
  
  return cron_job_model;
}

/**
 * 根据 id 查找定时任务
 */
export async function findByIdCronJob(
  cron_job_id: CronJobId,
): Promise<CronJobModel | undefined> {
  
  const cron_job_model = await cron_jobDao.findByIdCronJob(cron_job_id);
  
  return cron_job_model;
}

/**
 * 根据 id 查找定时任务, 如果不存在则抛错
 */
export async function findByIdOkCronJob(
  cron_job_id: CronJobId,
): Promise<CronJobModel> {
  
  const cron_job_model = await cron_jobDao.findByIdOkCronJob(cron_job_id);
  
  return cron_job_model;
}

/**
 * 根据 ids 查找定时任务
 */
export async function findByIdsCronJob(
  cron_job_ids: CronJobId[],
): Promise<CronJobModel[]> {
  
  const cron_job_models = await cron_jobDao.findByIdsCronJob(cron_job_ids);
  
  return cron_job_models;
}

/**
 * 根据 ids 查找定时任务, 出现查询不到的 id 则报错
 */
export async function findByIdsOkCronJob(
  cron_job_ids: CronJobId[],
): Promise<CronJobModel[]> {
  
  const cron_job_models = await cron_jobDao.findByIdsOkCronJob(cron_job_ids);
  
  return cron_job_models;
}

/**
 * 根据搜索条件查找定时任务是否存在
 */
export async function existCronJob(
  search?: CronJobSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_exist = await cron_jobDao.existCronJob(search);
  
  return cron_job_exist;
}

/**
 * 根据 id 查找定时任务是否存在
 */
export async function existByIdCronJob(
  cron_job_id?: CronJobId | null,
): Promise<boolean> {
  
  const cron_job_exist = await cron_jobDao.existByIdCronJob(cron_job_id);
  
  return cron_job_exist;
}

/**
 * 增加和修改时校验定时任务
 */
export async function validateCronJob(
  input: CronJobInput,
): Promise<void> {
  await cron_jobDao.validateCronJob(input);
}

/**
 * 批量创建定时任务
 */
export async function createsCronJob(
  inputs: CronJobInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CronJobId[]> {
  const cron_job_ids = await cron_jobDao.createsCronJob(inputs, options);
  
  return cron_job_ids;
}

/**
 * 根据 id 修改定时任务
 */
export async function updateByIdCronJob(
  cron_job_id: CronJobId,
  input: CronJobInput,
): Promise<CronJobId> {
  
  const is_locked = await cron_jobDao.getIsLockedByIdCronJob(cron_job_id);
  if (is_locked) {
    throw "不能修改已经锁定的 定时任务";
  }
  
  const cron_job_id2 = await cron_jobDao.updateByIdCronJob(cron_job_id, input);
  
  return cron_job_id2;
}

/** 校验定时任务是否存在 */
export async function validateOptionCronJob(
  model0?: CronJobModel,
): Promise<CronJobModel> {
  const cron_job_model = await cron_jobDao.validateOptionCronJob(model0);
  return cron_job_model;
}

/**
 * 根据 ids 删除定时任务
 */
export async function deleteByIdsCronJob(
  cron_job_ids: CronJobId[],
): Promise<number> {
  
  const old_models = await cron_jobDao.findByIdsCronJob(cron_job_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 定时任务";
    }
  }
  
  const cron_job_num = await cron_jobDao.deleteByIdsCronJob(cron_job_ids);
  return cron_job_num;
}

/**
 * 根据 ids 启用或者禁用定时任务
 */
export async function enableByIdsCronJob(
  ids: CronJobId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const cron_job_num = await cron_jobDao.enableByIdsCronJob(ids, is_enabled);
  return cron_job_num;
}

/**
 * 根据 ids 锁定或者解锁定时任务
 */
export async function lockByIdsCronJob(
  cron_job_ids: CronJobId[],
  is_locked: 0 | 1,
): Promise<number> {
  const cron_job_num = await cron_jobDao.lockByIdsCronJob(cron_job_ids, is_locked);
  return cron_job_num;
}

/**
 * 根据 ids 还原定时任务
 */
export async function revertByIdsCronJob(
  cron_job_ids: CronJobId[],
): Promise<number> {
  
  const cron_job_num = await cron_jobDao.revertByIdsCronJob(cron_job_ids);
  
  return cron_job_num;
}

/**
 * 根据 ids 彻底删除定时任务
 */
export async function forceDeleteByIdsCronJob(
  cron_job_ids: CronJobId[],
): Promise<number> {
  
  const cron_job_num = await cron_jobDao.forceDeleteByIdsCronJob(cron_job_ids);
  
  return cron_job_num;
}

/**
 * 获取定时任务字段注释
 */
export async function getFieldCommentsCronJob(): Promise<CronJobFieldComment> {
  const cron_job_fields = await cron_jobDao.getFieldCommentsCronJob();
  return cron_job_fields;
}

/**
 * 查找 定时任务 order_by 字段的最大值
 */
export async function findLastOrderByCronJob(
): Promise<number> {
  const cron_job_sort = await cron_jobDao.findLastOrderByCronJob();
  return cron_job_sort;
}
