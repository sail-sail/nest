import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as server_logDao from "./server_log.dao.ts";

async function setSearchQuery(
  _search: ServerLogSearch,
) {
  
}

/**
 * 根据条件查找系统日志总数
 */
export async function findCountServerLog(
  search?: ServerLogSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const server_log_num = await server_logDao.findCountServerLog(search);
  
  return server_log_num;
}

/**
 * 根据搜索条件和分页查找系统日志列表
 */
export async function findAllServerLog(
  search?: ServerLogSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<ServerLogModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const server_log_models = await server_logDao.findAllServerLog(search, page, sort);
  
  return server_log_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblServerLog(
  input: ServerLogInput,
): Promise<void> {
  await server_logDao.setIdByLblServerLog(input);
}

/**
 * 根据条件查找第一个系统日志
 */
export async function findOneServerLog(
  search?: ServerLogSearch,
  sort?: SortInput[],
): Promise<ServerLogModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const server_log_model = await server_logDao.findOneServerLog(search, sort);
  
  return server_log_model;
}

/**
 * 根据条件查找第一个系统日志, 如果不存在则抛错
 */
export async function findOneOkServerLog(
  search?: ServerLogSearch,
  sort?: SortInput[],
): Promise<ServerLogModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const server_log_model = await server_logDao.findOneOkServerLog(search, sort);
  
  return server_log_model;
}

/**
 * 根据 id 查找系统日志
 */
export async function findByIdServerLog(
  server_log_id: ServerLogId,
): Promise<ServerLogModel | undefined> {
  
  const server_log_model = await server_logDao.findByIdServerLog(server_log_id);
  
  return server_log_model;
}

/**
 * 根据 id 查找系统日志, 如果不存在则抛错
 */
export async function findByIdOkServerLog(
  server_log_id: ServerLogId,
): Promise<ServerLogModel> {
  
  const server_log_model = await server_logDao.findByIdOkServerLog(server_log_id);
  
  return server_log_model;
}

/**
 * 根据 ids 查找系统日志
 */
export async function findByIdsServerLog(
  server_log_ids: ServerLogId[],
): Promise<ServerLogModel[]> {
  
  const server_log_models = await server_logDao.findByIdsServerLog(server_log_ids);
  
  return server_log_models;
}

/**
 * 根据 ids 查找系统日志, 出现查询不到的 id 则报错
 */
export async function findByIdsOkServerLog(
  server_log_ids: ServerLogId[],
): Promise<ServerLogModel[]> {
  
  const server_log_models = await server_logDao.findByIdsOkServerLog(server_log_ids);
  
  return server_log_models;
}

/**
 * 根据搜索条件查找系统日志是否存在
 */
export async function existServerLog(
  search?: ServerLogSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const server_log_exist = await server_logDao.existServerLog(search);
  
  return server_log_exist;
}

/**
 * 根据 id 查找系统日志是否存在
 */
export async function existByIdServerLog(
  server_log_id?: ServerLogId | null,
): Promise<boolean> {
  
  const server_log_exist = await server_logDao.existByIdServerLog(server_log_id);
  
  return server_log_exist;
}

/**
 * 增加和修改时校验系统日志
 */
export async function validateServerLog(
  input: ServerLogInput,
): Promise<void> {
  await server_logDao.validateServerLog(input);
}

/**
 * 批量创建系统日志
 */
export async function createsServerLog(
  inputs: ServerLogInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<ServerLogId[]> {
  const server_log_ids = await server_logDao.createsServerLog(inputs, options);
  
  return server_log_ids;
}

/**
 * 根据 id 修改系统日志
 */
export async function updateByIdServerLog(
  server_log_id: ServerLogId,
  input: ServerLogInput,
): Promise<ServerLogId> {
  
  const server_log_id2 = await server_logDao.updateByIdServerLog(server_log_id, input);
  
  return server_log_id2;
}

/** 校验系统日志是否存在 */
export async function validateOptionServerLog(
  model0?: ServerLogModel,
): Promise<ServerLogModel> {
  const server_log_model = await server_logDao.validateOptionServerLog(model0);
  return server_log_model;
}

/**
 * 根据 ids 删除系统日志
 */
export async function deleteByIdsServerLog(
  server_log_ids: ServerLogId[],
): Promise<number> {
  
  const server_log_num = await server_logDao.deleteByIdsServerLog(server_log_ids);
  return server_log_num;
}

/**
 * 获取系统日志字段注释
 */
export async function getFieldCommentsServerLog(): Promise<ServerLogFieldComment> {
  const server_log_fields = await server_logDao.getFieldCommentsServerLog();
  return server_log_fields;
}
