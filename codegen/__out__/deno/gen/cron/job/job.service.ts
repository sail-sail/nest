import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as jobDao from "./job.dao.ts";

async function setSearchQuery(
  _search: JobSearch,
) {
  
}

/**
 * 根据条件查找任务总数
 */
export async function findCountJob(
  search?: JobSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const job_num = await jobDao.findCountJob(search);
  
  return job_num;
}

/**
 * 根据搜索条件和分页查找任务列表
 */
export async function findAllJob(
  search?: JobSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<JobModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const job_models = await jobDao.findAllJob(search, page, sort);
  
  return job_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblJob(
  input: JobInput,
): Promise<void> {
  await jobDao.setIdByLblJob(input);
}

/**
 * 根据条件查找第一个任务
 */
export async function findOneJob(
  search?: JobSearch,
  sort?: SortInput[],
): Promise<JobModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const job_model = await jobDao.findOneJob(search, sort);
  
  return job_model;
}

/**
 * 根据条件查找第一个任务, 如果不存在则抛错
 */
export async function findOneOkJob(
  search?: JobSearch,
  sort?: SortInput[],
): Promise<JobModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const job_model = await jobDao.findOneOkJob(search, sort);
  
  return job_model;
}

/**
 * 根据 id 查找任务
 */
export async function findByIdJob(
  job_id: JobId,
): Promise<JobModel | undefined> {
  
  const job_model = await jobDao.findByIdJob(job_id);
  
  return job_model;
}

/**
 * 根据 id 查找任务, 如果不存在则抛错
 */
export async function findByIdOkJob(
  job_id: JobId,
): Promise<JobModel> {
  
  const job_model = await jobDao.findByIdOkJob(job_id);
  
  return job_model;
}

/**
 * 根据 ids 查找任务
 */
export async function findByIdsJob(
  job_ids: JobId[],
): Promise<JobModel[]> {
  
  const job_models = await jobDao.findByIdsJob(job_ids);
  
  return job_models;
}

/**
 * 根据 ids 查找任务, 出现查询不到的 id 则报错
 */
export async function findByIdsOkJob(
  job_ids: JobId[],
): Promise<JobModel[]> {
  
  const job_models = await jobDao.findByIdsOkJob(job_ids);
  
  return job_models;
}

/**
 * 根据搜索条件查找任务是否存在
 */
export async function existJob(
  search?: JobSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const job_exist = await jobDao.existJob(search);
  
  return job_exist;
}

/**
 * 根据 id 查找任务是否存在
 */
export async function existByIdJob(
  job_id?: JobId | null,
): Promise<boolean> {
  
  const job_exist = await jobDao.existByIdJob(job_id);
  
  return job_exist;
}

/**
 * 增加和修改时校验任务
 */
export async function validateJob(
  input: JobInput,
): Promise<void> {
  await jobDao.validateJob(input);
}

/**
 * 批量创建任务
 */
export async function createsJob(
  inputs: JobInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<JobId[]> {
  const job_ids = await jobDao.createsJob(inputs, options);
  
  return job_ids;
}

/**
 * 根据 id 修改任务
 */
export async function updateByIdJob(
  job_id: JobId,
  input: JobInput,
): Promise<JobId> {
  
  const old_model = await jobDao.validateOptionJob(
    await jobDao.findByIdJob(job_id),
  );
  
  const is_locked = await jobDao.getIsLockedByIdJob(job_id);
  if (is_locked) {
    throw "不能修改已经锁定的 任务";
  }
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 编码
    input.code = undefined;
  }
  
  const job_id2 = await jobDao.updateByIdJob(job_id, input);
  
  return job_id2;
}

/** 校验任务是否存在 */
export async function validateOptionJob(
  model0?: JobModel,
): Promise<JobModel> {
  const job_model = await jobDao.validateOptionJob(model0);
  return job_model;
}

/**
 * 根据 ids 删除任务
 */
export async function deleteByIdsJob(
  job_ids: JobId[],
): Promise<number> {
  
  const old_models = await jobDao.findByIdsJob(job_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 任务";
    }
  }
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const job_num = await jobDao.deleteByIdsJob(job_ids);
  return job_num;
}

/**
 * 根据 ids 启用或者禁用任务
 */
export async function enableByIdsJob(
  ids: JobId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const job_num = await jobDao.enableByIdsJob(ids, is_enabled);
  return job_num;
}

/**
 * 根据 ids 锁定或者解锁任务
 */
export async function lockByIdsJob(
  job_ids: JobId[],
  is_locked: 0 | 1,
): Promise<number> {
  const job_num = await jobDao.lockByIdsJob(job_ids, is_locked);
  return job_num;
}

/**
 * 根据 ids 还原任务
 */
export async function revertByIdsJob(
  job_ids: JobId[],
): Promise<number> {
  
  const job_num = await jobDao.revertByIdsJob(job_ids);
  
  return job_num;
}

/**
 * 根据 ids 彻底删除任务
 */
export async function forceDeleteByIdsJob(
  job_ids: JobId[],
): Promise<number> {
  
  const job_num = await jobDao.forceDeleteByIdsJob(job_ids);
  
  return job_num;
}

/**
 * 获取任务字段注释
 */
export async function getFieldCommentsJob(): Promise<JobFieldComment> {
  const job_fields = await jobDao.getFieldCommentsJob();
  return job_fields;
}

/**
 * 查找 任务 order_by 字段的最大值
 */
export async function findLastOrderByJob(
): Promise<number> {
  const job_sort = await jobDao.findLastOrderByJob();
  return job_sort;
}
