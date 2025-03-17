import {
  set_is_tran,
  set_is_creating,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortCronJob,
} from "./cron_job.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import "./cron_job.service.ts";

import {
  route_path,
} from "./cron_job.model.ts";

/**
 * 根据条件查找定时任务总数
 */
export async function findCountCronJob(
  search?: CronJobSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./cron_job.service.ts");
  
  const num = await findCount(search);
  
  return num;
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
  
  checkSortCronJob(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取定时任务字段注释
 */
export async function getFieldCommentsCronJob(): Promise<CronJobFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./cron_job.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
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
  
  checkSortCronJob(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找定时任务
 */
export async function findByIdCronJob(
  id: CronJobId,
): Promise<CronJobModel | undefined> {
  
  const {
    findById,
  } = await import("./cron_job.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找定时任务
 */
export async function findByIdsCronJob(
  ids: CronJobId[],
): Promise<CronJobModel[]> {
  
  const {
    findByIds,
  } = await import("./cron_job.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建定时任务
 */
export async function createsCronJob(
  inputs: CronJobInput[],
  unique_type?: UniqueType,
): Promise<CronJobId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./cron_job.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLbl(input);
    
    await validate(input);
  }
  const uniqueType = unique_type;
  const ids = await creates(inputs, { uniqueType });
  return ids;
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
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
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
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
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
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsCronJob.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
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
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsCronJob.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
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
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
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
  
  const {
    forceDeleteByIds,
  } = await import("./cron_job.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 定时任务 order_by 字段的最大值
 */
export async function findLastOrderByCronJob(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./cron_job.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
