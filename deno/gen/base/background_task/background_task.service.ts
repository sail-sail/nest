import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  BackgroundTaskInput,
  BackgroundTaskModel,
  BackgroundTaskSearch,
  BackgroundTaskFieldComment,
  BackgroundTaskId,
} from "./background_task.model.ts";

import * as background_taskDao from "./background_task.dao.ts";

/**
 * 根据条件查找总数
 * @param {BackgroundTaskSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: BackgroundTaskSearch,
): Promise<number> {
  search = search || { };
  
  const authModel = await getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }
  const data = await background_taskDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {BackgroundTaskSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<BackgroundTaskModel[]>} 
 */
export async function findAll(
  search?: BackgroundTaskSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<BackgroundTaskModel[]> {
  search = search || { };
  
  const authModel = await getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }
  const models: BackgroundTaskModel[] = await background_taskDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: BackgroundTaskInput,
) {
  const data = await background_taskDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {BackgroundTaskSearch} search? 搜索条件
 */
export async function findOne(
  search?: BackgroundTaskSearch,
  sort?: SortInput|SortInput[],
): Promise<BackgroundTaskModel | undefined> {
  search = search || { };
  
  const authModel = await getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }
  const model = await background_taskDao.findOne(search, sort);
  return model;
}

/**
 * 根据id查找数据
 * @param {BackgroundTaskId} id
 */
export async function findById(
  id?: BackgroundTaskId | null,
): Promise<BackgroundTaskModel | undefined> {
  const model = await background_taskDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {BackgroundTaskSearch} search? 搜索条件
 */
export async function exist(
  search?: BackgroundTaskSearch,
): Promise<boolean> {
  search = search || { };
  
  const authModel = await getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }
  const data = await background_taskDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {BackgroundTaskId} id
 */
export async function existById(
  id?: BackgroundTaskId | null,
): Promise<boolean> {
  const data = await background_taskDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: BackgroundTaskInput,
): Promise<void> {
  const data = await background_taskDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {BackgroundTaskInput} input
 * @return {Promise<BackgroundTaskId>} id
 */
export async function create(
  input: BackgroundTaskInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<BackgroundTaskId> {
  const id: BackgroundTaskId = await background_taskDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改数据
 * @param {BackgroundTaskId} id
 * @param {BackgroundTaskInput} input
 * @return {Promise<BackgroundTaskId>}
 */
export async function updateById(
  id: BackgroundTaskId,
  input: BackgroundTaskInput,
): Promise<BackgroundTaskId> {
  
  const id2: BackgroundTaskId = await background_taskDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除数据
 * @param {BackgroundTaskId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: BackgroundTaskId[],
): Promise<number> {
  
  const data = await background_taskDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {BackgroundTaskId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: BackgroundTaskId[],
): Promise<number> {
  const data = await background_taskDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {BackgroundTaskId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: BackgroundTaskId[],
): Promise<number> {
  const data = await background_taskDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<BackgroundTaskFieldComment> {
  const data = await background_taskDao.getFieldComments();
  return data;
}
