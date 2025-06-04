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
    findCountCronJob,
  } = await import("./cron_job.service.ts");
  
  const num = await findCountCronJob(search);
  
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
    findAllCronJob,
  } = await import("./cron_job.service.ts");
  
  checkSortCronJob(sort);
  
  const models = await findAllCronJob(search, page, sort);
  
  return models;
}

/**
 * 获取定时任务字段注释
 */
export async function getFieldCommentsCronJob(): Promise<CronJobFieldComment> {
  
  const {
    getFieldCommentsCronJob,
  } = await import("./cron_job.service.ts");
  
  const field_comment = await getFieldCommentsCronJob();
  
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
    findOneCronJob,
  } = await import("./cron_job.service.ts");
  
  checkSortCronJob(sort);
  
  const model = await findOneCronJob(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个定时任务, 如果不存在则抛错
 */
export async function findOneOkCronJob(
  search?: CronJobSearch,
  sort?: SortInput[],
): Promise<CronJobModel> {
  
  const {
    findOneOkCronJob,
  } = await import("./cron_job.service.ts");
  
  checkSortCronJob(sort);
  
  const model = await findOneOkCronJob(search, sort);
  
  return model;
}

/**
 * 根据 id 查找定时任务
 */
export async function findByIdCronJob(
  id: CronJobId,
): Promise<CronJobModel | undefined> {
  
  const {
    findByIdCronJob,
  } = await import("./cron_job.service.ts");
  
  const model = await findByIdCronJob(id);
  
  return model;
}

/**
 * 根据 id 查找定时任务, 如果不存在则抛错
 */
export async function findByIdOkCronJob(
  id: CronJobId,
): Promise<CronJobModel | undefined> {
  
  const {
    findByIdOkCronJob,
  } = await import("./cron_job.service.ts");
  
  const model = await findByIdOkCronJob(id);
  
  return model;
}

/**
 * 根据 ids 查找定时任务
 */
export async function findByIdsCronJob(
  ids: CronJobId[],
): Promise<CronJobModel[]> {
  
  const {
    findByIdsCronJob,
  } = await import("./cron_job.service.ts");
  
  const models = await findByIdsCronJob(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 查找定时任务, 出现查询不到的 id 则报错
 */
export async function findByIdsOkCronJob(
  ids: CronJobId[],
): Promise<CronJobModel[]> {
  
  const {
    findByIdsOkCronJob,
  } = await import("./cron_job.service.ts");
  
  const models = await findByIdsOkCronJob(ids);
  
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
    validateCronJob,
    setIdByLblCronJob,
    createsCronJob,
  } = await import("./cron_job.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblCronJob(input);
    
    await validateCronJob(input);
  }
  const uniqueType = unique_type;
  const ids = await createsCronJob(inputs, { uniqueType });
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
    setIdByLblCronJob,
    updateByIdCronJob,
  } = await import("./cron_job.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblCronJob(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: CronJobId = await updateByIdCronJob(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除定时任务
 */
export async function deleteByIdsCronJob(
  ids: CronJobId[],
): Promise<number> {
  
  const {
    deleteByIdsCronJob,
  } = await import("./cron_job.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsCronJob(ids);
  
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
    enableByIdsCronJob,
  } = await import("./cron_job.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsCronJob.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsCronJob(ids, is_enabled);
  
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
    lockByIdsCronJob,
  } = await import("./cron_job.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsCronJob.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsCronJob(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原定时任务
 */
export async function revertByIdsCronJob(
  ids: CronJobId[],
): Promise<number> {
  
  const {
    revertByIdsCronJob,
  } = await import("./cron_job.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsCronJob(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除定时任务
 */
export async function forceDeleteByIdsCronJob(
  ids: CronJobId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsCronJob,
  } = await import("./cron_job.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsCronJob(ids);
  
  return res;
}

/**
 * 查找 定时任务 order_by 字段的最大值
 */
export async function findLastOrderByCronJob(): Promise<number> {
  
  const {
    findLastOrderByCronJob,
  } = await import("./cron_job.service.ts");
  
  const res = findLastOrderByCronJob();
  
  return res;
}
