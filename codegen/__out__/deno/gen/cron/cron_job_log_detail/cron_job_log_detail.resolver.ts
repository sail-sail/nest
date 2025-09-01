import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortCronJobLogDetail,
  intoInputCronJobLogDetail,
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
    findCountCronJobLogDetail,
  } = await import("./cron_job_log_detail.service.ts");
  
  const num = await findCountCronJobLogDetail(search);
  
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
    findAllCronJobLogDetail,
  } = await import("./cron_job_log_detail.service.ts");
  
  checkSortCronJobLogDetail(sort);
  
  const models = await findAllCronJobLogDetail(search, page, sort);
  
  return models;
}

/**
 * 获取定时任务日志明细字段注释
 */
export async function getFieldCommentsCronJobLogDetail(): Promise<CronJobLogDetailFieldComment> {
  
  const {
    getFieldCommentsCronJobLogDetail,
  } = await import("./cron_job_log_detail.service.ts");
  
  const field_comment = await getFieldCommentsCronJobLogDetail();
  
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
    findOneCronJobLogDetail,
  } = await import("./cron_job_log_detail.service.ts");
  
  checkSortCronJobLogDetail(sort);
  
  const model = await findOneCronJobLogDetail(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个定时任务日志明细, 如果不存在则抛错
 */
export async function findOneOkCronJobLogDetail(
  search?: CronJobLogDetailSearch,
  sort?: SortInput[],
): Promise<CronJobLogDetailModel> {
  
  const {
    findOneOkCronJobLogDetail,
  } = await import("./cron_job_log_detail.service.ts");
  
  checkSortCronJobLogDetail(sort);
  
  const model = await findOneOkCronJobLogDetail(search, sort);
  
  return model;
}

/**
 * 根据 id 查找定时任务日志明细
 */
export async function findByIdCronJobLogDetail(
  id: CronJobLogDetailId,
): Promise<CronJobLogDetailModel | undefined> {
  
  const {
    findByIdCronJobLogDetail,
  } = await import("./cron_job_log_detail.service.ts");
  
  const model = await findByIdCronJobLogDetail(id);
  
  return model;
}

/**
 * 根据 id 查找定时任务日志明细, 如果不存在则抛错
 */
export async function findByIdOkCronJobLogDetail(
  id: CronJobLogDetailId,
): Promise<CronJobLogDetailModel | undefined> {
  
  const {
    findByIdOkCronJobLogDetail,
  } = await import("./cron_job_log_detail.service.ts");
  
  const model = await findByIdOkCronJobLogDetail(id);
  
  return model;
}

/**
 * 根据 ids 查找定时任务日志明细
 */
export async function findByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
): Promise<CronJobLogDetailModel[]> {
  
  const {
    findByIdsCronJobLogDetail,
  } = await import("./cron_job_log_detail.service.ts");
  
  const models = await findByIdsCronJobLogDetail(ids);
  
  return models;
}

/**
 * 根据 ids 查找定时任务日志明细, 出现查询不到的 id 则报错
 */
export async function findByIdsOkCronJobLogDetail(
  ids: CronJobLogDetailId[],
): Promise<CronJobLogDetailModel[]> {
  
  const {
    findByIdsOkCronJobLogDetail,
  } = await import("./cron_job_log_detail.service.ts");
  
  const models = await findByIdsOkCronJobLogDetail(ids);
  
  return models;
}

/**
 * 根据 ids 删除定时任务日志明细
 */
export async function deleteByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
): Promise<number> {
  
  const {
    deleteByIdsCronJobLogDetail,
  } = await import("./cron_job_log_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsCronJobLogDetail(ids);
  
  return num;
}

/**
 * 根据 ids 还原定时任务日志明细
 */
export async function revertByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
): Promise<number> {
  
  const {
    revertByIdsCronJobLogDetail,
  } = await import("./cron_job_log_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsCronJobLogDetail(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除定时任务日志明细
 */
export async function forceDeleteByIdsCronJobLogDetail(
  ids: CronJobLogDetailId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsCronJobLogDetail,
  } = await import("./cron_job_log_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsCronJobLogDetail(ids);
  
  return res;
}
