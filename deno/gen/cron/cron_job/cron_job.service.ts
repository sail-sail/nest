import {
  ns,
} from "/src/base/i18n/i18n.ts";

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
} from "./cron_job.model.ts";

import * as cron_jobDao from "./cron_job.dao.ts";

/**
 * 根据条件查找总数
 * @param {CronJobSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: CronJobSearch,
): Promise<number> {
  search = search || { };
  const data = await cron_jobDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {CronJobSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<CronJobModel[]>} 
 */
export async function findAll(
  search?: CronJobSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<CronJobModel[]> {
  search = search || { };
  const models: CronJobModel[] = await cron_jobDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: CronJobInput,
) {
  const data = await cron_jobDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {CronJobSearch} search? 搜索条件
 */
export async function findOne(
  search?: CronJobSearch,
  sort?: SortInput|SortInput[],
): Promise<CronJobModel | undefined> {
  search = search || { };
  const model = await cron_jobDao.findOne(search, sort);
  return model;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
): Promise<CronJobModel | undefined> {
  const model = await cron_jobDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {CronJobSearch} search? 搜索条件
 */
export async function exist(
  search?: CronJobSearch,
): Promise<boolean> {
  search = search || { };
  const data = await cron_jobDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
): Promise<boolean> {
  const data = await cron_jobDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: CronJobInput,
): Promise<void> {
  const data = await cron_jobDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {CronJobInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: CronJobInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const data = await cron_jobDao.create(input, options);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {CronJobInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: CronJobInput,
): Promise<string> {
  
  const is_locked = await cron_jobDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const data = await cron_jobDao.updateById(id, input);
  return data;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
): Promise<number> {
  
  {
    const ids2: string[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const is_locked = await cron_jobDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  const data = await cron_jobDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或禁用数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: string[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await cron_jobDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或解锁数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await cron_jobDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
): Promise<number> {
  const data = await cron_jobDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: string[],
): Promise<number> {
  const data = await cron_jobDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<CronJobFieldComment> {
  const data = await cron_jobDao.getFieldComments();
  return data;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await cron_jobDao.findLastOrderBy();
  return data;
}
