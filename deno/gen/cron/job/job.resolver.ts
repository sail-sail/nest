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
  JobInput,
  JobModel,
  JobSearch,
  JobFieldComment,
  JobId,
} from "./job.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找任务总数
 */
export async function findCountJob(
  search?: JobSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./job.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找任务列表
 */
export async function findAllJob(
  search?: JobSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<JobModel[]> {
  
  const {
    findAll,
  } = await import("./job.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取任务字段注释
 */
export async function getFieldCommentsJob(): Promise<JobFieldComment> {
  const { getFieldComments } = await import("./job.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个任务
 */
export async function findOneJob(
  search?: JobSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<JobModel | undefined> {
  
  const {
    findOne,
  } = await import("./job.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找任务
 */
export async function findByIdJob(
  id: JobId,
): Promise<JobModel | undefined> {
  const { findById } = await import("./job.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建任务
 */
export async function createJob(
  input: JobInput,
  unique_type?: UniqueType,
): Promise<JobId> {
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./job.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/cron/job",
    "add",
  );
  const uniqueType = unique_type;
  const id: JobId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改任务
 */
export async function updateByIdJob(
  id: JobId,
  input: JobInput,
): Promise<JobId> {
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./job.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/cron/job",
    "edit",
  );
  const id2: JobId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除任务
 */
export async function deleteByIdsJob(
  ids: JobId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./job.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/cron/job",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用任务
 */
export async function enableByIdsJob(
  ids: JobId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./job.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsJob.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/cron/job",
    "enable",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁任务
 */
export async function lockByIdsJob(
  ids: JobId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./job.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsJob.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/cron/job",
    "lock",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原任务
 */
export async function revertByIdsJob(
  ids: JobId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./job.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/cron/job",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除任务
 */
export async function forceDeleteByIdsJob(
  ids: JobId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/cron/job",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./job.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 任务 order_by 字段的最大值
 */
export async function findLastOrderByJob(): Promise<number> {
  const { findLastOrderBy } = await import("./job.service.ts");
  const res = findLastOrderBy();
  return res;
}