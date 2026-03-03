import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortServerLog,
  intoInputServerLog,
} from "./server_log.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找系统日志总数
 */
export async function findCountServerLog(
  search?: ServerLogSearch,
): Promise<number> {
  
  const {
    findCountServerLog,
  } = await import("./server_log.service.ts");
  
  const num = await findCountServerLog(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找系统日志列表
 */
export async function findAllServerLog(
  search?: ServerLogSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<ServerLogModel[]> {
  
  const {
    findAllServerLog,
  } = await import("./server_log.service.ts");
  
  checkSortServerLog(sort);
  
  const models = await findAllServerLog(search, page, sort);
  
  return models;
}

/**
 * 获取系统日志字段注释
 */
export async function getFieldCommentsServerLog(): Promise<ServerLogFieldComment> {
  
  const {
    getFieldCommentsServerLog,
  } = await import("./server_log.service.ts");
  
  const field_comment = await getFieldCommentsServerLog();
  
  return field_comment;
}

/**
 * 根据条件查找第一个系统日志
 */
export async function findOneServerLog(
  search?: ServerLogSearch,
  sort?: SortInput[],
): Promise<ServerLogModel | undefined> {
  
  const {
    findOneServerLog,
  } = await import("./server_log.service.ts");
  
  checkSortServerLog(sort);
  
  const model = await findOneServerLog(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个系统日志, 如果不存在则抛错
 */
export async function findOneOkServerLog(
  search?: ServerLogSearch,
  sort?: SortInput[],
): Promise<ServerLogModel> {
  
  const {
    findOneOkServerLog,
  } = await import("./server_log.service.ts");
  
  checkSortServerLog(sort);
  
  const model = await findOneOkServerLog(search, sort);
  
  return model;
}

/**
 * 根据 id 查找系统日志
 */
export async function findByIdServerLog(
  id: ServerLogId,
): Promise<ServerLogModel | undefined> {
  
  const {
    findByIdServerLog,
  } = await import("./server_log.service.ts");
  
  const model = await findByIdServerLog(id);
  
  return model;
}

/**
 * 根据 id 查找系统日志, 如果不存在则抛错
 */
export async function findByIdOkServerLog(
  id: ServerLogId,
): Promise<ServerLogModel | undefined> {
  
  const {
    findByIdOkServerLog,
  } = await import("./server_log.service.ts");
  
  const model = await findByIdOkServerLog(id);
  
  return model;
}

/**
 * 根据 ids 查找系统日志
 */
export async function findByIdsServerLog(
  ids: ServerLogId[],
): Promise<ServerLogModel[]> {
  
  const {
    findByIdsServerLog,
  } = await import("./server_log.service.ts");
  
  const models = await findByIdsServerLog(ids);
  
  return models;
}

/**
 * 根据 ids 查找系统日志, 出现查询不到的 id 则报错
 */
export async function findByIdsOkServerLog(
  ids: ServerLogId[],
): Promise<ServerLogModel[]> {
  
  const {
    findByIdsOkServerLog,
  } = await import("./server_log.service.ts");
  
  const models = await findByIdsOkServerLog(ids);
  
  return models;
}
