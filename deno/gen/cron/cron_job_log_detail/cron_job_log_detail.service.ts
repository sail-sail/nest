import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as cron_job_log_detailDao from "./cron_job_log_detail.dao.ts";

/**
 * 根据条件查找任务执行日志明细总数
 * @param {CronJobLogDetailSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: CronJobLogDetailSearch,
): Promise<number> {
  search = search || { };
  const data = await cron_job_log_detailDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找任务执行日志明细列表
 * @param {CronJobLogDetailSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<CronJobLogDetailModel[]>} 
 */
export async function findAll(
  search?: CronJobLogDetailSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<CronJobLogDetailModel[]> {
  search = search || { };
  const models: CronJobLogDetailModel[] = await cron_job_log_detailDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: CronJobLogDetailInput,
) {
  const data = await cron_job_log_detailDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个任务执行日志明细
 * @param {CronJobLogDetailSearch} search? 搜索条件
 */
export async function findOne(
  search?: CronJobLogDetailSearch,
  sort?: SortInput|SortInput[],
): Promise<CronJobLogDetailModel | undefined> {
  search = search || { };
  const model = await cron_job_log_detailDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找任务执行日志明细
 * @param {CronJobLogDetailId} id
 */
export async function findById(
  id?: CronJobLogDetailId | null,
): Promise<CronJobLogDetailModel | undefined> {
  const model = await cron_job_log_detailDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找任务执行日志明细是否存在
 * @param {CronJobLogDetailSearch} search? 搜索条件
 */
export async function exist(
  search?: CronJobLogDetailSearch,
): Promise<boolean> {
  search = search || { };
  const data = await cron_job_log_detailDao.exist(search);
  return data;
}

/**
 * 根据 id 查找任务执行日志明细是否存在
 * @param {CronJobLogDetailId} id
 */
export async function existById(
  id?: CronJobLogDetailId | null,
): Promise<boolean> {
  const data = await cron_job_log_detailDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验任务执行日志明细
 * @param input 
 */
export async function validate(
  input: CronJobLogDetailInput,
): Promise<void> {
  const data = await cron_job_log_detailDao.validate(input);
  return data;
}

/**
 * 创建任务执行日志明细
 * @param {CronJobLogDetailInput} input
 * @return {Promise<CronJobLogDetailId>} id
 */
export async function create(
  input: CronJobLogDetailInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CronJobLogDetailId> {
  const id = await cron_job_log_detailDao.create(input, options);
  return id;
}

/**
 * 批量创建任务执行日志明细
 * @param {CronJobLogDetailInput[]} inputs
 * @return {Promise<CronJobLogDetailId[]>} ids
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
 * 根据 id 修改任务执行日志明细
 * @param {CronJobLogDetailId} id
 * @param {CronJobLogDetailInput} input
 * @return {Promise<CronJobLogDetailId>}
 */
export async function updateById(
  id: CronJobLogDetailId,
  input: CronJobLogDetailInput,
): Promise<CronJobLogDetailId> {
  
  const id2: CronJobLogDetailId = await cron_job_log_detailDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除任务执行日志明细
 * @param {CronJobLogDetailId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: CronJobLogDetailId[],
): Promise<number> {
  
  const data = await cron_job_log_detailDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原任务执行日志明细
 * @param {CronJobLogDetailId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: CronJobLogDetailId[],
): Promise<number> {
  const data = await cron_job_log_detailDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除任务执行日志明细
 * @param {CronJobLogDetailId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: CronJobLogDetailId[],
): Promise<number> {
  const data = await cron_job_log_detailDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取任务执行日志明细字段注释
 */
export async function getFieldComments(): Promise<CronJobLogDetailFieldComment> {
  const data = await cron_job_log_detailDao.getFieldComments();
  return data;
}
