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
  checkSortJob,
} from "./job.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./job.model.ts";

/**
 * 根据条件查找任务总数
 */
export async function findCountJob(
  search?: JobSearch,
): Promise<number> {
  
  const {
    findCountJob,
  } = await import("./job.service.ts");
  
  const num = await findCountJob(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找任务列表
 */
export async function findAllJob(
  search?: JobSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<JobModel[]> {
  
  const {
    findAllJob,
  } = await import("./job.service.ts");
  
  checkSortJob(sort);
  
  const models = await findAllJob(search, page, sort);
  
  return models;
}

/**
 * 获取任务字段注释
 */
export async function getFieldCommentsJob(): Promise<JobFieldComment> {
  
  const {
    getFieldCommentsJob,
  } = await import("./job.service.ts");
  
  const field_comment = await getFieldCommentsJob();
  
  return field_comment;
}

/**
 * 根据条件查找第一个任务
 */
export async function findOneJob(
  search?: JobSearch,
  sort?: SortInput[],
): Promise<JobModel | undefined> {
  
  const {
    findOneJob,
  } = await import("./job.service.ts");
  
  checkSortJob(sort);
  
  const model = await findOneJob(search, sort);
  
  return model;
}

/**
 * 根据 id 查找任务
 */
export async function findByIdJob(
  id: JobId,
): Promise<JobModel | undefined> {
  
  const {
    findByIdJob,
  } = await import("./job.service.ts");
  
  const model = await findByIdJob(id);
  
  return model;
}

/**
 * 根据 ids 查找任务
 */
export async function findByIdsJob(
  ids: JobId[],
): Promise<JobModel[]> {
  
  const {
    findByIdsJob,
  } = await import("./job.service.ts");
  
  const models = await findByIdsJob(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建任务
 */
export async function createsJob(
  inputs: JobInput[],
  unique_type?: UniqueType,
): Promise<JobId[]> {
  
  const {
    validateJob,
    setIdByLblJob,
    createsJob,
  } = await import("./job.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblJob(input);
    
    await validateJob(input);
  }
  const uniqueType = unique_type;
  const ids = await createsJob(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改任务
 */
export async function updateByIdJob(
  id: JobId,
  input: JobInput,
): Promise<JobId> {
  
  input.id = undefined;
  
  const {
    setIdByLblJob,
    updateByIdJob,
  } = await import("./job.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblJob(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: JobId = await updateByIdJob(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除任务
 */
export async function deleteByIdsJob(
  ids: JobId[],
): Promise<number> {
  
  const {
    deleteByIdsJob,
  } = await import("./job.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsJob(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用任务
 */
export async function enableByIdsJob(
  ids: JobId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsJob,
  } = await import("./job.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsJob.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsJob(ids, is_enabled);
  
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
    lockByIdsJob,
  } = await import("./job.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsJob.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsJob(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原任务
 */
export async function revertByIdsJob(
  ids: JobId[],
): Promise<number> {
  
  const {
    revertByIdsJob,
  } = await import("./job.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsJob(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除任务
 */
export async function forceDeleteByIdsJob(
  ids: JobId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsJob,
  } = await import("./job.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsJob(ids);
  
  return res;
}

/**
 * 查找 任务 order_by 字段的最大值
 */
export async function findLastOrderByJob(): Promise<number> {
  
  const {
    findLastOrderByJob,
  } = await import("./job.service.ts");
  
  const res = findLastOrderByJob();
  
  return res;
}
