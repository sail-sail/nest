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
export async function findCount(
  search?: JobSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const job_num = await jobDao.findCount(search);
  
  return job_num;
}

/**
 * 根据搜索条件和分页查找任务列表
 */
export async function findAll(
  search?: JobSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<JobModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const job_models = await jobDao.findAll(search, page, sort);
  
  return job_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: JobInput,
): Promise<void> {
  await jobDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个任务
 */
export async function findOne(
  search?: JobSearch,
  sort?: SortInput[],
): Promise<JobModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const job_model = await jobDao.findOne(search, sort);
  
  return job_model;
}

/**
 * 根据 id 查找任务
 */
export async function findById(
  job_id?: JobId | null,
): Promise<JobModel | undefined> {
  
  const job_model = await jobDao.findById(job_id);
  
  return job_model;
}

/**
 * 根据 ids 查找任务
 */
export async function findByIds(
  job_ids: JobId[],
): Promise<JobModel[]> {
  
  const job_models = await jobDao.findByIds(job_ids);
  
  return job_models;
}

/**
 * 根据搜索条件查找任务是否存在
 */
export async function exist(
  search?: JobSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const job_exist = await jobDao.exist(search);
  
  return job_exist;
}

/**
 * 根据 id 查找任务是否存在
 */
export async function existById(
  job_id?: JobId | null,
): Promise<boolean> {
  
  const job_exist = await jobDao.existById(job_id);
  
  return job_exist;
}

/**
 * 增加和修改时校验任务
 */
export async function validate(
  input: JobInput,
): Promise<void> {
  await jobDao.validate(input);
}

/**
 * 批量创建任务
 */
export async function creates(
  inputs: JobInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<JobId[]> {
  const job_ids = await jobDao.creates(inputs, options);
  
  return job_ids;
}

/**
 * 根据 id 修改任务
 */
export async function updateById(
  job_id: JobId,
  input: JobInput,
): Promise<JobId> {
  
  const old_model = await jobDao.validateOption(
    await jobDao.findById(job_id),
  );
  
  const is_locked = await jobDao.getIsLockedById(job_id);
  if (is_locked) {
    throw "不能修改已经锁定的 任务";
  }
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 编码
    input.code = undefined;
  }
  
  const job_id2 = await jobDao.updateById(job_id, input);
  
  return job_id2;
}

/** 校验任务是否存在 */
export async function validateOption(
  model0?: JobModel,
): Promise<JobModel> {
  const job_model = await jobDao.validateOption(model0);
  return job_model;
}

/**
 * 根据 ids 删除任务
 */
export async function deleteByIds(
  job_ids: JobId[],
): Promise<number> {
  
  const old_models = await jobDao.findByIds(job_ids);
  
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
  
  const job_num = await jobDao.deleteByIds(job_ids);
  return job_num;
}

/**
 * 根据 ids 启用或者禁用任务
 */
export async function enableByIds(
  ids: JobId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const job_num = await jobDao.enableByIds(ids, is_enabled);
  return job_num;
}

/**
 * 根据 ids 锁定或者解锁任务
 */
export async function lockByIds(
  job_ids: JobId[],
  is_locked: 0 | 1,
): Promise<number> {
  const job_num = await jobDao.lockByIds(job_ids, is_locked);
  return job_num;
}

/**
 * 根据 ids 还原任务
 */
export async function revertByIds(
  job_ids: JobId[],
): Promise<number> {
  
  const job_num = await jobDao.revertByIds(job_ids);
  
  return job_num;
}

/**
 * 根据 ids 彻底删除任务
 */
export async function forceDeleteByIds(
  job_ids: JobId[],
): Promise<number> {
  
  const job_num = await jobDao.forceDeleteByIds(job_ids);
  
  return job_num;
}

/**
 * 获取任务字段注释
 */
export async function getFieldComments(): Promise<JobFieldComment> {
  const job_fields = await jobDao.getFieldComments();
  return job_fields;
}

/**
 * 查找 任务 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const job_sort = await jobDao.findLastOrderBy();
  return job_sort;
}
