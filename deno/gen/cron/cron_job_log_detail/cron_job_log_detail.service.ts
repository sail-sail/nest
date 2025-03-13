import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as cron_job_log_detailDao from "./cron_job_log_detail.dao.ts";

async function setSearchQuery(
  _search: CronJobLogDetailSearch,
) {
  
}

/**
 * 根据条件查找定时任务日志明细总数
 */
export async function findCount(
  search?: CronJobLogDetailSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await cron_job_log_detailDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找定时任务日志明细列表
 */
export async function findAll(
  search?: CronJobLogDetailSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CronJobLogDetailModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: CronJobLogDetailModel[] = await cron_job_log_detailDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: CronJobLogDetailInput,
) {
  const data = await cron_job_log_detailDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个定时任务日志明细
 */
export async function findOne(
  search?: CronJobLogDetailSearch,
  sort?: SortInput[],
): Promise<CronJobLogDetailModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await cron_job_log_detailDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找定时任务日志明细
 */
export async function findById(
  id?: CronJobLogDetailId | null,
): Promise<CronJobLogDetailModel | undefined> {
  const model = await cron_job_log_detailDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找定时任务日志明细是否存在
 */
export async function exist(
  search?: CronJobLogDetailSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await cron_job_log_detailDao.exist(search);
  return data;
}

/**
 * 根据 id 查找定时任务日志明细是否存在
 */
export async function existById(
  id?: CronJobLogDetailId | null,
): Promise<boolean> {
  const data = await cron_job_log_detailDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验定时任务日志明细
 */
export async function validate(
  input: CronJobLogDetailInput,
): Promise<void> {
  const data = await cron_job_log_detailDao.validate(input);
  return data;
}

/**
 * 批量创建定时任务日志明细
 */
export async function creates(
  inputs: CronJobLogDetailInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CronJobLogDetailId[]> {
  const ids = await cron_job_log_detailDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改定时任务日志明细
 */
export async function updateById(
  id: CronJobLogDetailId,
  input: CronJobLogDetailInput,
): Promise<CronJobLogDetailId> {
  
  const id2 = await cron_job_log_detailDao.updateById(id, input);
  return id2;
}

/** 校验定时任务日志明细是否存在 */
export async function validateOption(
  model0?: CronJobLogDetailModel,
): Promise<CronJobLogDetailModel> {
  const model = await cron_job_log_detailDao.validateOption(model0);
  return model;
}

/**
 * 根据 ids 删除定时任务日志明细
 */
export async function deleteByIds(
  ids: CronJobLogDetailId[],
): Promise<number> {
  
  const data = await cron_job_log_detailDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原定时任务日志明细
 */
export async function revertByIds(
  ids: CronJobLogDetailId[],
): Promise<number> {
  const data = await cron_job_log_detailDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除定时任务日志明细
 */
export async function forceDeleteByIds(
  ids: CronJobLogDetailId[],
): Promise<number> {
  const data = await cron_job_log_detailDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取定时任务日志明细字段注释
 */
export async function getFieldComments(): Promise<CronJobLogDetailFieldComment> {
  const data = await cron_job_log_detailDao.getFieldComments();
  return data;
}
