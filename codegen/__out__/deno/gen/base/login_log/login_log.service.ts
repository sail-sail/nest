import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as login_logDao from "./login_log.dao.ts";

/**
 * 根据条件查找登录日志总数
 * @param {LoginLogSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: LoginLogSearch,
): Promise<number> {
  search = search || { };
  const data = await login_logDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找登录日志列表
 * @param {LoginLogSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<LoginLogModel[]>} 
 */
export async function findAll(
  search?: LoginLogSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<LoginLogModel[]> {
  search = search || { };
  const models: LoginLogModel[] = await login_logDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: LoginLogInput,
) {
  const data = await login_logDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个登录日志
 * @param {LoginLogSearch} search? 搜索条件
 */
export async function findOne(
  search?: LoginLogSearch,
  sort?: SortInput|SortInput[],
): Promise<LoginLogModel | undefined> {
  search = search || { };
  const model = await login_logDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找登录日志
 * @param {LoginLogId} id
 */
export async function findById(
  id?: LoginLogId | null,
): Promise<LoginLogModel | undefined> {
  const model = await login_logDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找登录日志是否存在
 * @param {LoginLogSearch} search? 搜索条件
 */
export async function exist(
  search?: LoginLogSearch,
): Promise<boolean> {
  search = search || { };
  const data = await login_logDao.exist(search);
  return data;
}

/**
 * 根据 id 查找登录日志是否存在
 * @param {LoginLogId} id
 */
export async function existById(
  id?: LoginLogId | null,
): Promise<boolean> {
  const data = await login_logDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验登录日志
 * @param input 
 */
export async function validate(
  input: LoginLogInput,
): Promise<void> {
  const data = await login_logDao.validate(input);
  return data;
}

/**
 * 批量创建登录日志
 * @param {LoginLogInput[]} inputs
 * @return {Promise<LoginLogId[]>} ids
 */
export async function creates(
  inputs: LoginLogInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<LoginLogId[]> {
  const ids = await login_logDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改登录日志
 * @param {LoginLogId} id
 * @param {LoginLogInput} input
 * @return {Promise<LoginLogId>}
 */
export async function updateById(
  id: LoginLogId,
  input: LoginLogInput,
): Promise<LoginLogId> {
  
  const id2 = await login_logDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除登录日志
 * @param {LoginLogId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: LoginLogId[],
): Promise<number> {
  
  const data = await login_logDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原登录日志
 * @param {LoginLogId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: LoginLogId[],
): Promise<number> {
  const data = await login_logDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除登录日志
 * @param {LoginLogId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: LoginLogId[],
): Promise<number> {
  const data = await login_logDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取登录日志字段注释
 */
export async function getFieldComments(): Promise<LoginLogFieldComment> {
  const data = await login_logDao.getFieldComments();
  return data;
}
