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

import {
  route_path,
} from "./cron_job_log_detail.model.ts";

/**
 * 根据条件查找定时任务日志明细总数
 */
export async function findCountCronJobLogDetail(
  search?: CronJobLogDetailSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./cron_job_log_detail.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找定时任务日志明细列表
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
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取定时任务日志明细字段注释
 */
export async function getFieldCommentsCronJobLogDetail(): Promise<CronJobLogDetailFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./cron_job_log_detail.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个定时任务日志明细
 */
export async function findOneCronJobLogDetail(
  search?: CronJobLogDetailSearch,
  sort?: SortInput[],
): Promise<CronJobLogDetailModel | undefined> {
  
  const {
    findOne,
  } = await import("./cron_job_log_detail.service.ts");
  
  checkSortCronJobLogDetail(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找定时任务日志明细
 */
export async function findByIdCronJobLogDetail(
  id: CronJobLogDetailId,
): Promise<CronJobLogDetailModel | undefined> {
  
  const {
    findById,
  } = await import("./cron_job_log_detail.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找定时任务日志明细
 */
export async function findByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
): Promise<CronJobLogDetailModel[]> {
  
  const {
    findByIds,
  } = await import("./cron_job_log_detail.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 删除定时任务日志明细
 */
export async function deleteByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./cron_job_log_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原定时任务日志明细
 */
export async function revertByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./cron_job_log_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除定时任务日志明细
 */
export async function forceDeleteByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./cron_job_log_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
