import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  findById as findByIdUsr,
  validateOption as validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import * as background_taskDao from "./background_task.dao.ts";

async function setSearchQuery(
  search: BackgroundTaskSearch,
) {
  
  const usr_id = await get_usr_id();
  const usr_model = await findByIdUsr(usr_id);
  if (!usr_id || !usr_model) {
    throw new Error("usr_id can not be null");
  }
  const username = usr_model.username;
  
  if (username !== "admin") {
    search.create_usr_id = [ usr_id ];
  }
  
}

/**
 * 根据条件查找后台任务总数
 */
export async function findCount(
  search?: BackgroundTaskSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await background_taskDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找后台任务列表
 */
export async function findAll(
  search?: BackgroundTaskSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<BackgroundTaskModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: BackgroundTaskModel[] = await background_taskDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: BackgroundTaskInput,
) {
  const data = await background_taskDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个后台任务
 */
export async function findOne(
  search?: BackgroundTaskSearch,
  sort?: SortInput[],
): Promise<BackgroundTaskModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await background_taskDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找后台任务
 */
export async function findById(
  id?: BackgroundTaskId | null,
): Promise<BackgroundTaskModel | undefined> {
  const model = await background_taskDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找后台任务是否存在
 */
export async function exist(
  search?: BackgroundTaskSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await background_taskDao.exist(search);
  return data;
}

/**
 * 根据 id 查找后台任务是否存在
 */
export async function existById(
  id?: BackgroundTaskId | null,
): Promise<boolean> {
  const data = await background_taskDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验后台任务
 */
export async function validate(
  input: BackgroundTaskInput,
): Promise<void> {
  const data = await background_taskDao.validate(input);
  return data;
}

/**
 * 批量创建后台任务
 */
export async function creates(
  inputs: BackgroundTaskInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<BackgroundTaskId[]> {
  const ids = await background_taskDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改后台任务
 */
export async function updateById(
  id: BackgroundTaskId,
  input: BackgroundTaskInput,
): Promise<BackgroundTaskId> {
  
  const id2 = await background_taskDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除后台任务
 */
export async function deleteByIds(
  ids: BackgroundTaskId[],
): Promise<number> {
  
  const data = await background_taskDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原后台任务
 */
export async function revertByIds(
  ids: BackgroundTaskId[],
): Promise<number> {
  const data = await background_taskDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除后台任务
 */
export async function forceDeleteByIds(
  ids: BackgroundTaskId[],
): Promise<number> {
  const data = await background_taskDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取后台任务字段注释
 */
export async function getFieldComments(): Promise<BackgroundTaskFieldComment> {
  const data = await background_taskDao.getFieldComments();
  return data;
}
