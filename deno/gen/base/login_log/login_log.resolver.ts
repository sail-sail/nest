import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortLoginLog,
} from "./login_log.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./login_log.model.ts";

/**
 * 根据条件查找登录日志总数
 */
export async function findCountLoginLog(
  search?: LoginLogSearch,
): Promise<number> {
  
  const {
    findCountLoginLog,
  } = await import("./login_log.service.ts");
  
  const num = await findCountLoginLog(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找登录日志列表
 */
export async function findAllLoginLog(
  search?: LoginLogSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<LoginLogModel[]> {
  
  const {
    findAllLoginLog,
  } = await import("./login_log.service.ts");
  
  checkSortLoginLog(sort);
  
  const models = await findAllLoginLog(search, page, sort);
  
  return models;
}

/**
 * 获取登录日志字段注释
 */
export async function getFieldCommentsLoginLog(): Promise<LoginLogFieldComment> {
  
  const {
    getFieldCommentsLoginLog,
  } = await import("./login_log.service.ts");
  
  const field_comment = await getFieldCommentsLoginLog();
  
  return field_comment;
}

/**
 * 根据条件查找第一个登录日志
 */
export async function findOneLoginLog(
  search?: LoginLogSearch,
  sort?: SortInput[],
): Promise<LoginLogModel | undefined> {
  
  const {
    findOneLoginLog,
  } = await import("./login_log.service.ts");
  
  checkSortLoginLog(sort);
  
  const model = await findOneLoginLog(search, sort);
  
  return model;
}

/**
 * 根据 id 查找登录日志
 */
export async function findByIdLoginLog(
  id: LoginLogId,
): Promise<LoginLogModel | undefined> {
  
  const {
    findByIdLoginLog,
  } = await import("./login_log.service.ts");
  
  const model = await findByIdLoginLog(id);
  
  return model;
}

/**
 * 根据 ids 查找登录日志
 */
export async function findByIdsLoginLog(
  ids: LoginLogId[],
): Promise<LoginLogModel[]> {
  
  const {
    findByIdsLoginLog,
  } = await import("./login_log.service.ts");
  
  const models = await findByIdsLoginLog(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 删除登录日志
 */
export async function deleteByIdsLoginLog(
  ids: LoginLogId[],
): Promise<number> {
  
  const {
    deleteByIdsLoginLog,
  } = await import("./login_log.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsLoginLog(ids);
  
  return num;
}

/**
 * 根据 ids 还原登录日志
 */
export async function revertByIdsLoginLog(
  ids: LoginLogId[],
): Promise<number> {
  
  const {
    revertByIdsLoginLog,
  } = await import("./login_log.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsLoginLog(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除登录日志
 */
export async function forceDeleteByIdsLoginLog(
  ids: LoginLogId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsLoginLog,
  } = await import("./login_log.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsLoginLog(ids);
  
  return res;
}
