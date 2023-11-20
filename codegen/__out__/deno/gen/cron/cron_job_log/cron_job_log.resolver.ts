import {
  useContext,
} from "/lib/context.ts";

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  CronJobLogInput,
  CronJobLogModel,
  CronJobLogSearch,
  CronJobLogFieldComment,
} from "./cron_job_log.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
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
 * 根据搜索条件和分页查找数据
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
 * 获取字段对应的名称
 */
export async function getFieldCommentsCronJobLog(): Promise<CronJobLogFieldComment> {
  const { getFieldComments } = await import("./cron_job_log.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
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
 * 根据 id 查找一条数据
 */
export async function findByIdCronJobLog(
  id: string,
): Promise<CronJobLogModel | undefined> {
  const { findById } = await import("./cron_job_log.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsCronJobLog(
  ids: string[],
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
 * 根据 ids 还原数据
 */
export async function revertByIdsCronJobLog(
  ids: string[],
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
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsCronJobLog(
  ids: string[],
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
