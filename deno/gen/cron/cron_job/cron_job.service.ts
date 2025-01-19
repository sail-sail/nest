import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as cron_jobDao from "./cron_job.dao.ts";

async function setSearchQuery(
  _search: CronJobSearch,
) {
  
}

/**
 * 根据条件查找定时任务总数
 */
export async function findCount(
  search?: CronJobSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await cron_jobDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找定时任务列表
 */
export async function findAll(
  search?: CronJobSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CronJobModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: CronJobModel[] = await cron_jobDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: CronJobInput,
) {
  const data = await cron_jobDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个定时任务
 */
export async function findOne(
  search?: CronJobSearch,
  sort?: SortInput[],
): Promise<CronJobModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await cron_jobDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找定时任务
 */
export async function findById(
  id?: CronJobId | null,
): Promise<CronJobModel | undefined> {
  const model = await cron_jobDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找定时任务是否存在
 */
export async function exist(
  search?: CronJobSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await cron_jobDao.exist(search);
  return data;
}

/**
 * 根据 id 查找定时任务是否存在
 */
export async function existById(
  id?: CronJobId | null,
): Promise<boolean> {
  const data = await cron_jobDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验定时任务
 */
export async function validate(
  input: CronJobInput,
): Promise<void> {
  const data = await cron_jobDao.validate(input);
  return data;
}

/**
 * 批量创建定时任务
 */
export async function creates(
  inputs: CronJobInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CronJobId[]> {
  const ids = await cron_jobDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改定时任务
 */
export async function updateById(
  id: CronJobId,
  input: CronJobInput,
): Promise<CronJobId> {
  
  const is_locked = await cron_jobDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 定时任务";
  }
  
  const id2 = await cron_jobDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除定时任务
 */
export async function deleteByIds(
  ids: CronJobId[],
): Promise<number> {
  
  {
    const models = await cron_jobDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 定时任务";
      }
    }
  }
  
  const data = await cron_jobDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用定时任务
 */
export async function enableByIds(
  ids: CronJobId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await cron_jobDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁定时任务
 */
export async function lockByIds(
  ids: CronJobId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await cron_jobDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原定时任务
 */
export async function revertByIds(
  ids: CronJobId[],
): Promise<number> {
  const data = await cron_jobDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除定时任务
 */
export async function forceDeleteByIds(
  ids: CronJobId[],
): Promise<number> {
  const data = await cron_jobDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取定时任务字段注释
 */
export async function getFieldComments(): Promise<CronJobFieldComment> {
  const data = await cron_jobDao.getFieldComments();
  return data;
}

/**
 * 查找 定时任务 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await cron_jobDao.findLastOrderBy();
  return data;
}
