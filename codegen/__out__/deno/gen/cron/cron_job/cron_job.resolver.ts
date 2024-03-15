import {
  useContext,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  CronJobInput,
  CronJobModel,
  CronJobSearch,
  CronJobFieldComment,
  CronJobId,
} from "./cron_job.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import "./cron_job.service.ts";

/**
 * 根据条件查找定时任务总数
 */
export async function findCountCronJob(
  search?: CronJobSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./cron_job.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找定时任务列表
 */
export async function findAllCronJob(
  search?: CronJobSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CronJobModel[]> {
  
  const {
    findAll,
  } = await import("./cron_job.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取定时任务字段注释
 */
export async function getFieldCommentsCronJob(): Promise<CronJobFieldComment> {
  const { getFieldComments } = await import("./cron_job.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个定时任务
 */
export async function findOneCronJob(
  search?: CronJobSearch,
  sort?: SortInput[],
): Promise<CronJobModel | undefined> {
  
  const {
    findOne,
  } = await import("./cron_job.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找定时任务
 */
export async function findByIdCronJob(
  id: CronJobId,
): Promise<CronJobModel | undefined> {
  const { findById } = await import("./cron_job.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建定时任务
 */
export async function createCronJob(
  input: CronJobInput,
  unique_type?: UniqueType,
): Promise<CronJobId> {
  
  input.id = undefined;
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./cron_job.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/cron/cron_job",
    "add",
  );
  const uniqueType = unique_type;
  const id: CronJobId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改定时任务
 */
export async function updateByIdCronJob(
  id: CronJobId,
  input: CronJobInput,
): Promise<CronJobId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./cron_job.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/cron/cron_job",
    "edit",
  );
  const id2: CronJobId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除定时任务
 */
export async function deleteByIdsCronJob(
  ids: CronJobId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./cron_job.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/cron/cron_job",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用定时任务
 */
export async function enableByIdsCronJob(
  ids: CronJobId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./cron_job.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsCronJob.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/cron/cron_job",
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁定时任务
 */
export async function lockByIdsCronJob(
  ids: CronJobId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./cron_job.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsCronJob.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/cron/cron_job",
    "edit",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原定时任务
 */
export async function revertByIdsCronJob(
  ids: CronJobId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./cron_job.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/cron/cron_job",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除定时任务
 */
export async function forceDeleteByIdsCronJob(
  ids: CronJobId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/cron/cron_job",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./cron_job.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 定时任务 order_by 字段的最大值
 */
export async function findLastOrderByCronJob(): Promise<number> {
  const { findLastOrderBy } = await import("./cron_job.service.ts");
  const res = findLastOrderBy();
  return res;
}
