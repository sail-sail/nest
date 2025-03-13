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
  
  const data = await jobDao.findCount(search);
  return data;
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
  
  const models: JobModel[] = await jobDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: JobInput,
) {
  const data = await jobDao.setIdByLbl(input);
  return data;
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
  
  const model = await jobDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找任务
 */
export async function findById(
  id?: JobId | null,
): Promise<JobModel | undefined> {
  const model = await jobDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找任务是否存在
 */
export async function exist(
  search?: JobSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await jobDao.exist(search);
  return data;
}

/**
 * 根据 id 查找任务是否存在
 */
export async function existById(
  id?: JobId | null,
): Promise<boolean> {
  const data = await jobDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验任务
 */
export async function validate(
  input: JobInput,
): Promise<void> {
  const data = await jobDao.validate(input);
  return data;
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
  const ids = await jobDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改任务
 */
export async function updateById(
  id: JobId,
  input: JobInput,
): Promise<JobId> {
  
  const old_model = await jobDao.validateOption(
    await jobDao.findById(id),
  );
  
  const is_locked = await jobDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 任务";
  }
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 编码
    input.code = undefined;
  }
  
  const id2 = await jobDao.updateById(id, input);
  return id2;
}

/** 校验任务是否存在 */
export async function validateOption(
  model0?: JobModel,
): Promise<JobModel> {
  const model = await jobDao.validateOption(model0);
  return model;
}

/**
 * 根据 ids 删除任务
 */
export async function deleteByIds(
  ids: JobId[],
): Promise<number> {
  
  {
    const models = await jobDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 任务";
      }
    }
  }
  
  {
    const models = await jobDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw "不能删除系统记录";
      }
    }
  }
  
  const data = await jobDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用任务
 */
export async function enableByIds(
  ids: JobId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await jobDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁任务
 */
export async function lockByIds(
  ids: JobId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await jobDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原任务
 */
export async function revertByIds(
  ids: JobId[],
): Promise<number> {
  const data = await jobDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除任务
 */
export async function forceDeleteByIds(
  ids: JobId[],
): Promise<number> {
  const data = await jobDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取任务字段注释
 */
export async function getFieldComments(): Promise<JobFieldComment> {
  const data = await jobDao.getFieldComments();
  return data;
}

/**
 * 查找 任务 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await jobDao.findLastOrderBy();
  return data;
}
