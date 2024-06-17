import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortCronJobLogDetail,
} from "./cron_job_log_detail.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找任务执行日志明细总数
 */
export async function findCountCronJobLogDetail(
  search?: CronJobLogDetailSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./cron_job_log_detail.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找任务执行日志明细列表
 */
export async function findAllCronJobLogDetail(
  search?: CronJobLogDetailSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CronJobLogDetailModel[]> {
  
  const {
    findAll,
  } = await import("./cron_job_log_detail.service.ts");
  
  checkSortCronJobLogDetail(sort);
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取任务执行日志明细字段注释
 */
export async function getFieldCommentsCronJobLogDetail(): Promise<CronJobLogDetailFieldComment> {
  const { getFieldComments } = await import("./cron_job_log_detail.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个任务执行日志明细
 */
export async function findOneCronJobLogDetail(
  search?: CronJobLogDetailSearch,
  sort?: SortInput[],
): Promise<CronJobLogDetailModel | undefined> {
  
  const {
    findOne,
  } = await import("./cron_job_log_detail.service.ts");
  
  checkSortCronJobLogDetail(sort);
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找任务执行日志明细
 */
export async function findByIdCronJobLogDetail(
  id: CronJobLogDetailId,
): Promise<CronJobLogDetailModel | undefined> {
  
  const {
    findById,
  } = await import("./cron_job_log_detail.service.ts");
  
  const res = await findById(id);
  
  return res;
}

/**
 * 根据 ids 删除任务执行日志明细
 */
export async function deleteByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./cron_job_log_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    "/cron/cron_job_log_detail",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原任务执行日志明细
 */
export async function revertByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./cron_job_log_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    "/cron/cron_job_log_detail",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除任务执行日志明细
 */
export async function forceDeleteByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./cron_job_log_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    "/cron/cron_job_log_detail",
    "force_delete",
  );
  const res = await forceDeleteByIds(ids);
  return res;
}
