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
  
  const cron_job_log_detail_num = await cron_job_log_detailDao.findCount(search);
  
  return cron_job_log_detail_num;
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
  
  const cron_job_log_detail_models = await cron_job_log_detailDao.findAll(search, page, sort);
  
  return cron_job_log_detail_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: CronJobLogDetailInput,
): Promise<void> {
  await cron_job_log_detailDao.setIdByLbl(input);
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
  
  const cron_job_log_detail_model = await cron_job_log_detailDao.findOne(search, sort);
  
  return cron_job_log_detail_model;
}

/**
 * 根据 id 查找定时任务日志明细
 */
export async function findById(
  cron_job_log_detail_id?: CronJobLogDetailId | null,
): Promise<CronJobLogDetailModel | undefined> {
  
  const cron_job_log_detail_model = await cron_job_log_detailDao.findById(cron_job_log_detail_id);
  
  return cron_job_log_detail_model;
}

/**
 * 根据 ids 查找定时任务日志明细
 */
export async function findByIds(
  cron_job_log_detail_ids: CronJobLogDetailId[],
): Promise<CronJobLogDetailModel[]> {
  
  const cron_job_log_detail_models = await cron_job_log_detailDao.findByIds(cron_job_log_detail_ids);
  
  return cron_job_log_detail_models;
}

/**
 * 根据搜索条件查找定时任务日志明细是否存在
 */
export async function exist(
  search?: CronJobLogDetailSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_detail_exist = await cron_job_log_detailDao.exist(search);
  
  return cron_job_log_detail_exist;
}

/**
 * 根据 id 查找定时任务日志明细是否存在
 */
export async function existById(
  cron_job_log_detail_id?: CronJobLogDetailId | null,
): Promise<boolean> {
  
  const cron_job_log_detail_exist = await cron_job_log_detailDao.existById(cron_job_log_detail_id);
  
  return cron_job_log_detail_exist;
}

/**
 * 增加和修改时校验定时任务日志明细
 */
export async function validate(
  input: CronJobLogDetailInput,
): Promise<void> {
  await cron_job_log_detailDao.validate(input);
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
  const cron_job_log_detail_ids = await cron_job_log_detailDao.creates(inputs, options);
  
  return cron_job_log_detail_ids;
}

/**
 * 根据 id 修改定时任务日志明细
 */
export async function updateById(
  cron_job_log_detail_id: CronJobLogDetailId,
  input: CronJobLogDetailInput,
): Promise<CronJobLogDetailId> {
  
  const cron_job_log_detail_id2 = await cron_job_log_detailDao.updateById(cron_job_log_detail_id, input);
  
  return cron_job_log_detail_id2;
}

/** 校验定时任务日志明细是否存在 */
export async function validateOption(
  model0?: CronJobLogDetailModel,
): Promise<CronJobLogDetailModel> {
  const cron_job_log_detail_model = await cron_job_log_detailDao.validateOption(model0);
  return cron_job_log_detail_model;
}

/**
 * 根据 ids 删除定时任务日志明细
 */
export async function deleteByIds(
  cron_job_log_detail_ids: CronJobLogDetailId[],
): Promise<number> {
  
  const cron_job_log_detail_num = await cron_job_log_detailDao.deleteByIds(cron_job_log_detail_ids);
  return cron_job_log_detail_num;
}

/**
 * 根据 ids 还原定时任务日志明细
 */
export async function revertByIds(
  cron_job_log_detail_ids: CronJobLogDetailId[],
): Promise<number> {
  
  const cron_job_log_detail_num = await cron_job_log_detailDao.revertByIds(cron_job_log_detail_ids);
  
  return cron_job_log_detail_num;
}

/**
 * 根据 ids 彻底删除定时任务日志明细
 */
export async function forceDeleteByIds(
  cron_job_log_detail_ids: CronJobLogDetailId[],
): Promise<number> {
  
  const cron_job_log_detail_num = await cron_job_log_detailDao.forceDeleteByIds(cron_job_log_detail_ids);
  
  return cron_job_log_detail_num;
}

/**
 * 获取定时任务日志明细字段注释
 */
export async function getFieldComments(): Promise<CronJobLogDetailFieldComment> {
  const cron_job_log_detail_fields = await cron_job_log_detailDao.getFieldComments();
  return cron_job_log_detail_fields;
}
