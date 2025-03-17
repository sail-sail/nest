import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as login_logDao from "./login_log.dao.ts";

async function setSearchQuery(
  _search: LoginLogSearch,
) {
  
}

/**
 * 根据条件查找登录日志总数
 */
export async function findCount(
  search?: LoginLogSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const login_log_num = await login_logDao.findCount(search);
  
  return login_log_num;
}

/**
 * 根据搜索条件和分页查找登录日志列表
 */
export async function findAll(
  search?: LoginLogSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<LoginLogModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const login_log_models = await login_logDao.findAll(search, page, sort);
  
  return login_log_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: LoginLogInput,
): Promise<void> {
  await login_logDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个登录日志
 */
export async function findOne(
  search?: LoginLogSearch,
  sort?: SortInput[],
): Promise<LoginLogModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const login_log_model = await login_logDao.findOne(search, sort);
  
  return login_log_model;
}

/**
 * 根据 id 查找登录日志
 */
export async function findById(
  login_log_id?: LoginLogId | null,
): Promise<LoginLogModel | undefined> {
  
  const login_log_model = await login_logDao.findById(login_log_id);
  
  return login_log_model;
}

/**
 * 根据 ids 查找登录日志
 */
export async function findByIds(
  login_log_ids: LoginLogId[],
): Promise<LoginLogModel[]> {
  
  const login_log_models = await login_logDao.findByIds(login_log_ids);
  
  return login_log_models;
}

/**
 * 根据搜索条件查找登录日志是否存在
 */
export async function exist(
  search?: LoginLogSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const login_log_exist = await login_logDao.exist(search);
  
  return login_log_exist;
}

/**
 * 根据 id 查找登录日志是否存在
 */
export async function existById(
  login_log_id?: LoginLogId | null,
): Promise<boolean> {
  
  const login_log_exist = await login_logDao.existById(login_log_id);
  
  return login_log_exist;
}

/**
 * 增加和修改时校验登录日志
 */
export async function validate(
  input: LoginLogInput,
): Promise<void> {
  await login_logDao.validate(input);
}

/**
 * 批量创建登录日志
 */
export async function creates(
  inputs: LoginLogInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<LoginLogId[]> {
  const login_log_ids = await login_logDao.creates(inputs, options);
  
  return login_log_ids;
}

/**
 * 根据 id 修改登录日志
 */
export async function updateById(
  login_log_id: LoginLogId,
  input: LoginLogInput,
): Promise<LoginLogId> {
  
  const login_log_id2 = await login_logDao.updateById(login_log_id, input);
  
  return login_log_id2;
}

/** 校验登录日志是否存在 */
export async function validateOption(
  model0?: LoginLogModel,
): Promise<LoginLogModel> {
  const login_log_model = await login_logDao.validateOption(model0);
  return login_log_model;
}

/**
 * 根据 ids 删除登录日志
 */
export async function deleteByIds(
  login_log_ids: LoginLogId[],
): Promise<number> {
  
  const login_log_num = await login_logDao.deleteByIds(login_log_ids);
  return login_log_num;
}

/**
 * 根据 ids 还原登录日志
 */
export async function revertByIds(
  login_log_ids: LoginLogId[],
): Promise<number> {
  
  const login_log_num = await login_logDao.revertByIds(login_log_ids);
  
  return login_log_num;
}

/**
 * 根据 ids 彻底删除登录日志
 */
export async function forceDeleteByIds(
  login_log_ids: LoginLogId[],
): Promise<number> {
  
  const login_log_num = await login_logDao.forceDeleteByIds(login_log_ids);
  
  return login_log_num;
}

/**
 * 获取登录日志字段注释
 */
export async function getFieldComments(): Promise<LoginLogFieldComment> {
  const login_log_fields = await login_logDao.getFieldComments();
  return login_log_fields;
}
