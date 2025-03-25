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
export async function findCountLoginLog(
  search?: LoginLogSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const login_log_num = await login_logDao.findCountLoginLog(search);
  
  return login_log_num;
}

/**
 * 根据搜索条件和分页查找登录日志列表
 */
export async function findAllLoginLog(
  search?: LoginLogSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<LoginLogModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const login_log_models = await login_logDao.findAllLoginLog(search, page, sort);
  
  return login_log_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblLoginLog(
  input: LoginLogInput,
): Promise<void> {
  await login_logDao.setIdByLblLoginLog(input);
}

/**
 * 根据条件查找第一个登录日志
 */
export async function findOneLoginLog(
  search?: LoginLogSearch,
  sort?: SortInput[],
): Promise<LoginLogModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const login_log_model = await login_logDao.findOneLoginLog(search, sort);
  
  return login_log_model;
}

/**
 * 根据 id 查找登录日志
 */
export async function findByIdLoginLog(
  login_log_id?: LoginLogId | null,
): Promise<LoginLogModel | undefined> {
  
  const login_log_model = await login_logDao.findByIdLoginLog(login_log_id);
  
  return login_log_model;
}

/**
 * 根据 ids 查找登录日志
 */
export async function findByIdsLoginLog(
  login_log_ids: LoginLogId[],
): Promise<LoginLogModel[]> {
  
  const login_log_models = await login_logDao.findByIdsLoginLog(login_log_ids);
  
  return login_log_models;
}

/**
 * 根据搜索条件查找登录日志是否存在
 */
export async function existLoginLog(
  search?: LoginLogSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const login_log_exist = await login_logDao.existLoginLog(search);
  
  return login_log_exist;
}

/**
 * 根据 id 查找登录日志是否存在
 */
export async function existByIdLoginLog(
  login_log_id?: LoginLogId | null,
): Promise<boolean> {
  
  const login_log_exist = await login_logDao.existByIdLoginLog(login_log_id);
  
  return login_log_exist;
}

/**
 * 增加和修改时校验登录日志
 */
export async function validateLoginLog(
  input: LoginLogInput,
): Promise<void> {
  await login_logDao.validateLoginLog(input);
}

/**
 * 批量创建登录日志
 */
export async function createsLoginLog(
  inputs: LoginLogInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<LoginLogId[]> {
  const login_log_ids = await login_logDao.createsLoginLog(inputs, options);
  
  return login_log_ids;
}

/**
 * 根据 id 修改登录日志
 */
export async function updateByIdLoginLog(
  login_log_id: LoginLogId,
  input: LoginLogInput,
): Promise<LoginLogId> {
  
  const login_log_id2 = await login_logDao.updateByIdLoginLog(login_log_id, input);
  
  return login_log_id2;
}

/** 校验登录日志是否存在 */
export async function validateOptionLoginLog(
  model0?: LoginLogModel,
): Promise<LoginLogModel> {
  const login_log_model = await login_logDao.validateOptionLoginLog(model0);
  return login_log_model;
}

/**
 * 根据 ids 删除登录日志
 */
export async function deleteByIdsLoginLog(
  login_log_ids: LoginLogId[],
): Promise<number> {
  
  const login_log_num = await login_logDao.deleteByIdsLoginLog(login_log_ids);
  return login_log_num;
}

/**
 * 根据 ids 还原登录日志
 */
export async function revertByIdsLoginLog(
  login_log_ids: LoginLogId[],
): Promise<number> {
  
  const login_log_num = await login_logDao.revertByIdsLoginLog(login_log_ids);
  
  return login_log_num;
}

/**
 * 根据 ids 彻底删除登录日志
 */
export async function forceDeleteByIdsLoginLog(
  login_log_ids: LoginLogId[],
): Promise<number> {
  
  const login_log_num = await login_logDao.forceDeleteByIdsLoginLog(login_log_ids);
  
  return login_log_num;
}

/**
 * 获取登录日志字段注释
 */
export async function getFieldCommentsLoginLog(): Promise<LoginLogFieldComment> {
  const login_log_fields = await login_logDao.getFieldCommentsLoginLog();
  return login_log_fields;
}
