import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortCronJobLog,
} from "./cron_job_log.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./cron_job_log.model.ts";

/**
 * 根据条件查找定时任务日志总数
 */
export async function findCountCronJobLog(
  search?: CronJobLogSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./cron_job_log.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找定时任务日志列表
 */
export async function findAllCronJobLog(
  search?: CronJobLogSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CronJobLogModel[]> {
  
  const {
    findAll,
  } = await import("./cron_job_log.service.ts");
  
  checkSortCronJobLog(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取定时任务日志字段注释
 */
export async function getFieldCommentsCronJobLog(): Promise<CronJobLogFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./cron_job_log.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个定时任务日志
 */
export async function findOneCronJobLog(
  search?: CronJobLogSearch,
  sort?: SortInput[],
): Promise<CronJobLogModel | undefined> {
  
  const {
    findOne,
  } = await import("./cron_job_log.service.ts");
  
  checkSortCronJobLog(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找定时任务日志
 */
export async function findByIdCronJobLog(
  id: CronJobLogId,
): Promise<CronJobLogModel | undefined> {
  
  const {
    findById,
  } = await import("./cron_job_log.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找定时任务日志
 */
export async function findByIdsCronJobLog(
  ids: CronJobLogId[],
): Promise<CronJobLogModel[]> {
  
  const {
    findByIds,
  } = await import("./cron_job_log.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 删除定时任务日志
 */
export async function deleteByIdsCronJobLog(
  ids: CronJobLogId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./cron_job_log.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原定时任务日志
 */
export async function revertByIdsCronJobLog(
  ids: CronJobLogId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./cron_job_log.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除定时任务日志
 */
export async function forceDeleteByIdsCronJobLog(
  ids: CronJobLogId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./cron_job_log.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
