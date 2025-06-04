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
export async function findCountCronJobLogDetail(
  search?: CronJobLogDetailSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_detail_num = await cron_job_log_detailDao.findCountCronJobLogDetail(search);
  
  return cron_job_log_detail_num;
}

/**
 * 根据搜索条件和分页查找定时任务日志明细列表
 */
export async function findAllCronJobLogDetail(
  search?: CronJobLogDetailSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CronJobLogDetailModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_detail_models = await cron_job_log_detailDao.findAllCronJobLogDetail(search, page, sort);
  
  return cron_job_log_detail_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblCronJobLogDetail(
  input: CronJobLogDetailInput,
): Promise<void> {
  await cron_job_log_detailDao.setIdByLblCronJobLogDetail(input);
}

/**
 * 根据条件查找第一个定时任务日志明细
 */
export async function findOneCronJobLogDetail(
  search?: CronJobLogDetailSearch,
  sort?: SortInput[],
): Promise<CronJobLogDetailModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_detail_model = await cron_job_log_detailDao.findOneCronJobLogDetail(search, sort);
  
  return cron_job_log_detail_model;
}

/**
 * 根据条件查找第一个定时任务日志明细, 如果不存在则抛错
 */
export async function findOneOkCronJobLogDetail(
  search?: CronJobLogDetailSearch,
  sort?: SortInput[],
): Promise<CronJobLogDetailModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_detail_model = await cron_job_log_detailDao.findOneOkCronJobLogDetail(search, sort);
  
  return cron_job_log_detail_model;
}

/**
 * 根据 id 查找定时任务日志明细
 */
export async function findByIdCronJobLogDetail(
  cron_job_log_detail_id: CronJobLogDetailId,
): Promise<CronJobLogDetailModel | undefined> {
  
  const cron_job_log_detail_model = await cron_job_log_detailDao.findByIdCronJobLogDetail(cron_job_log_detail_id);
  
  return cron_job_log_detail_model;
}

/**
 * 根据 id 查找定时任务日志明细, 如果不存在则抛错
 */
export async function findByIdOkCronJobLogDetail(
  cron_job_log_detail_id: CronJobLogDetailId,
): Promise<CronJobLogDetailModel> {
  
  const cron_job_log_detail_model = await cron_job_log_detailDao.findByIdOkCronJobLogDetail(cron_job_log_detail_id);
  
  return cron_job_log_detail_model;
}

/**
 * 根据 ids 查找定时任务日志明细
 */
export async function findByIdsCronJobLogDetail(
  cron_job_log_detail_ids: CronJobLogDetailId[],
): Promise<CronJobLogDetailModel[]> {
  
  const cron_job_log_detail_models = await cron_job_log_detailDao.findByIdsCronJobLogDetail(cron_job_log_detail_ids);
  
  return cron_job_log_detail_models;
}

/**
 * 根据 ids 查找定时任务日志明细, 出现查询不到的 id 则报错
 */
export async function findByIdsOkCronJobLogDetail(
  cron_job_log_detail_ids: CronJobLogDetailId[],
): Promise<CronJobLogDetailModel[]> {
  
  const cron_job_log_detail_models = await cron_job_log_detailDao.findByIdsOkCronJobLogDetail(cron_job_log_detail_ids);
  
  return cron_job_log_detail_models;
}

/**
 * 根据搜索条件查找定时任务日志明细是否存在
 */
export async function existCronJobLogDetail(
  search?: CronJobLogDetailSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const cron_job_log_detail_exist = await cron_job_log_detailDao.existCronJobLogDetail(search);
  
  return cron_job_log_detail_exist;
}

/**
 * 根据 id 查找定时任务日志明细是否存在
 */
export async function existByIdCronJobLogDetail(
  cron_job_log_detail_id?: CronJobLogDetailId | null,
): Promise<boolean> {
  
  const cron_job_log_detail_exist = await cron_job_log_detailDao.existByIdCronJobLogDetail(cron_job_log_detail_id);
  
  return cron_job_log_detail_exist;
}

/**
 * 增加和修改时校验定时任务日志明细
 */
export async function validateCronJobLogDetail(
  input: CronJobLogDetailInput,
): Promise<void> {
  await cron_job_log_detailDao.validateCronJobLogDetail(input);
}

/**
 * 批量创建定时任务日志明细
 */
export async function createsCronJobLogDetail(
  inputs: CronJobLogDetailInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CronJobLogDetailId[]> {
  const cron_job_log_detail_ids = await cron_job_log_detailDao.createsCronJobLogDetail(inputs, options);
  
  return cron_job_log_detail_ids;
}

/**
 * 根据 id 修改定时任务日志明细
 */
export async function updateByIdCronJobLogDetail(
  cron_job_log_detail_id: CronJobLogDetailId,
  input: CronJobLogDetailInput,
): Promise<CronJobLogDetailId> {
  
  const cron_job_log_detail_id2 = await cron_job_log_detailDao.updateByIdCronJobLogDetail(cron_job_log_detail_id, input);
  
  return cron_job_log_detail_id2;
}

/** 校验定时任务日志明细是否存在 */
export async function validateOptionCronJobLogDetail(
  model0?: CronJobLogDetailModel,
): Promise<CronJobLogDetailModel> {
  const cron_job_log_detail_model = await cron_job_log_detailDao.validateOptionCronJobLogDetail(model0);
  return cron_job_log_detail_model;
}

/**
 * 根据 ids 删除定时任务日志明细
 */
export async function deleteByIdsCronJobLogDetail(
  cron_job_log_detail_ids: CronJobLogDetailId[],
): Promise<number> {
  
  const cron_job_log_detail_num = await cron_job_log_detailDao.deleteByIdsCronJobLogDetail(cron_job_log_detail_ids);
  return cron_job_log_detail_num;
}

/**
 * 根据 ids 还原定时任务日志明细
 */
export async function revertByIdsCronJobLogDetail(
  cron_job_log_detail_ids: CronJobLogDetailId[],
): Promise<number> {
  
  const cron_job_log_detail_num = await cron_job_log_detailDao.revertByIdsCronJobLogDetail(cron_job_log_detail_ids);
  
  return cron_job_log_detail_num;
}

/**
 * 根据 ids 彻底删除定时任务日志明细
 */
export async function forceDeleteByIdsCronJobLogDetail(
  cron_job_log_detail_ids: CronJobLogDetailId[],
): Promise<number> {
  
  const cron_job_log_detail_num = await cron_job_log_detailDao.forceDeleteByIdsCronJobLogDetail(cron_job_log_detail_ids);
  
  return cron_job_log_detail_num;
}

/**
 * 获取定时任务日志明细字段注释
 */
export async function getFieldCommentsCronJobLogDetail(): Promise<CronJobLogDetailFieldComment> {
  const cron_job_log_detail_fields = await cron_job_log_detailDao.getFieldCommentsCronJobLogDetail();
  return cron_job_log_detail_fields;
}
