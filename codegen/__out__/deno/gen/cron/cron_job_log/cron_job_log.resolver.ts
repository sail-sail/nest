import {
  useContext,
} from "/lib/context.ts";

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  CronJobLogModel,
  CronJobLogSearch,
  CronJobLogFieldComment,
  CronJobLogId,
} from "./cron_job_log.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找任务执行日志总数
 */
export async function findCountCronJobLog(
  search?: CronJobLogSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./cron_job_log.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找任务执行日志列表
 */
export async function findAllCronJobLog(
  search?: CronJobLogSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<CronJobLogModel[]> {
  
  const {
    findAll,
  } = await import("./cron_job_log.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取任务执行日志字段注释
 */
export async function getFieldCommentsCronJobLog(): Promise<CronJobLogFieldComment> {
  const { getFieldComments } = await import("./cron_job_log.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个任务执行日志
 */
export async function findOneCronJobLog(
  search?: CronJobLogSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<CronJobLogModel | undefined> {
  
  const {
    findOne,
  } = await import("./cron_job_log.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找任务执行日志
 */
export async function findByIdCronJobLog(
  id: CronJobLogId,
): Promise<CronJobLogModel | undefined> {
  const { findById } = await import("./cron_job_log.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 根据 ids 删除任务执行日志
 */
export async function deleteByIdsCronJobLog(
  ids: CronJobLogId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./cron_job_log.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/cron/cron_job_log",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原任务执行日志
 */
export async function revertByIdsCronJobLog(
  ids: CronJobLogId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./cron_job_log.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/cron/cron_job_log",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除任务执行日志
 */
export async function forceDeleteByIdsCronJobLog(
  ids: CronJobLogId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/cron/cron_job_log",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./cron_job_log.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
