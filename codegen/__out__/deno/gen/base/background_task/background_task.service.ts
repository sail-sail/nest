import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  findByIdUsr,
  validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  isAdmin,
} from "/src/base/usr/usr.dao.ts";

import * as background_taskDao from "./background_task.dao.ts";

async function setSearchQuery(
  search: BackgroundTaskSearch,
) {
  
  const usr_id = await get_usr_id(false);
  const usr_model = await validateOptionUsr(
    await findByIdUsr(usr_id),
  );
  
  if (!await isAdmin(usr_id)) {
    search.create_usr_id = [ usr_id ];
  }
  
}

/**
 * 根据条件查找后台任务总数
 */
export async function findCountBackgroundTask(
  search?: BackgroundTaskSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const background_task_num = await background_taskDao.findCountBackgroundTask(search);
  
  return background_task_num;
}

/**
 * 根据搜索条件和分页查找后台任务列表
 */
export async function findAllBackgroundTask(
  search?: BackgroundTaskSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<BackgroundTaskModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const background_task_models = await background_taskDao.findAllBackgroundTask(search, page, sort);
  
  return background_task_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblBackgroundTask(
  input: BackgroundTaskInput,
): Promise<void> {
  await background_taskDao.setIdByLblBackgroundTask(input);
}

/**
 * 根据条件查找第一个后台任务
 */
export async function findOneBackgroundTask(
  search?: BackgroundTaskSearch,
  sort?: SortInput[],
): Promise<BackgroundTaskModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const background_task_model = await background_taskDao.findOneBackgroundTask(search, sort);
  
  return background_task_model;
}

/**
 * 根据条件查找第一个后台任务, 如果不存在则抛错
 */
export async function findOneOkBackgroundTask(
  search?: BackgroundTaskSearch,
  sort?: SortInput[],
): Promise<BackgroundTaskModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const background_task_model = await background_taskDao.findOneOkBackgroundTask(search, sort);
  
  return background_task_model;
}

/**
 * 根据 id 查找后台任务
 */
export async function findByIdBackgroundTask(
  background_task_id: BackgroundTaskId,
): Promise<BackgroundTaskModel | undefined> {
  
  const background_task_model = await background_taskDao.findByIdBackgroundTask(background_task_id);
  
  return background_task_model;
}

/**
 * 根据 id 查找后台任务, 如果不存在则抛错
 */
export async function findByIdOkBackgroundTask(
  background_task_id: BackgroundTaskId,
): Promise<BackgroundTaskModel> {
  
  const background_task_model = await background_taskDao.findByIdOkBackgroundTask(background_task_id);
  
  return background_task_model;
}

/**
 * 根据 ids 查找后台任务
 */
export async function findByIdsBackgroundTask(
  background_task_ids: BackgroundTaskId[],
): Promise<BackgroundTaskModel[]> {
  
  const background_task_models = await background_taskDao.findByIdsBackgroundTask(background_task_ids);
  
  return background_task_models;
}

/**
 * 根据 ids 查找后台任务, 出现查询不到的 id 则报错
 */
export async function findByIdsOkBackgroundTask(
  background_task_ids: BackgroundTaskId[],
): Promise<BackgroundTaskModel[]> {
  
  const background_task_models = await background_taskDao.findByIdsOkBackgroundTask(background_task_ids);
  
  return background_task_models;
}

/**
 * 根据搜索条件查找后台任务是否存在
 */
export async function existBackgroundTask(
  search?: BackgroundTaskSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const background_task_exist = await background_taskDao.existBackgroundTask(search);
  
  return background_task_exist;
}

/**
 * 根据 id 查找后台任务是否存在
 */
export async function existByIdBackgroundTask(
  background_task_id?: BackgroundTaskId | null,
): Promise<boolean> {
  
  const background_task_exist = await background_taskDao.existByIdBackgroundTask(background_task_id);
  
  return background_task_exist;
}

/**
 * 增加和修改时校验后台任务
 */
export async function validateBackgroundTask(
  input: BackgroundTaskInput,
): Promise<void> {
  await background_taskDao.validateBackgroundTask(input);
}

/**
 * 批量创建后台任务
 */
export async function createsBackgroundTask(
  inputs: BackgroundTaskInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<BackgroundTaskId[]> {
  const background_task_ids = await background_taskDao.createsBackgroundTask(inputs, options);
  
  return background_task_ids;
}

/**
 * 根据 id 修改后台任务
 */
export async function updateByIdBackgroundTask(
  background_task_id: BackgroundTaskId,
  input: BackgroundTaskInput,
): Promise<BackgroundTaskId> {
  
  const background_task_id2 = await background_taskDao.updateByIdBackgroundTask(background_task_id, input);
  
  return background_task_id2;
}

/** 校验后台任务是否存在 */
export async function validateOptionBackgroundTask(
  model0?: BackgroundTaskModel,
): Promise<BackgroundTaskModel> {
  const background_task_model = await background_taskDao.validateOptionBackgroundTask(model0);
  return background_task_model;
}

/**
 * 根据 ids 删除后台任务
 */
export async function deleteByIdsBackgroundTask(
  background_task_ids: BackgroundTaskId[],
): Promise<number> {
  
  const background_task_num = await background_taskDao.deleteByIdsBackgroundTask(background_task_ids);
  return background_task_num;
}

/**
 * 根据 ids 还原后台任务
 */
export async function revertByIdsBackgroundTask(
  background_task_ids: BackgroundTaskId[],
): Promise<number> {
  
  const background_task_num = await background_taskDao.revertByIdsBackgroundTask(background_task_ids);
  
  return background_task_num;
}

/**
 * 根据 ids 彻底删除后台任务
 */
export async function forceDeleteByIdsBackgroundTask(
  background_task_ids: BackgroundTaskId[],
): Promise<number> {
  
  const background_task_num = await background_taskDao.forceDeleteByIdsBackgroundTask(background_task_ids);
  
  return background_task_num;
}

/**
 * 获取后台任务字段注释
 */
export async function getFieldCommentsBackgroundTask(): Promise<BackgroundTaskFieldComment> {
  const background_task_fields = await background_taskDao.getFieldCommentsBackgroundTask();
  return background_task_fields;
}
