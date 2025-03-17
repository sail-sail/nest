import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortBackgroundTask,
} from "./background_task.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./background_task.model.ts";

/**
 * 根据条件查找后台任务总数
 */
export async function findCountBackgroundTask(
  search?: BackgroundTaskSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./background_task.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找后台任务列表
 */
export async function findAllBackgroundTask(
  search?: BackgroundTaskSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<BackgroundTaskModel[]> {
  
  const {
    findAll,
  } = await import("./background_task.service.ts");
  
  checkSortBackgroundTask(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取后台任务字段注释
 */
export async function getFieldCommentsBackgroundTask(): Promise<BackgroundTaskFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./background_task.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个后台任务
 */
export async function findOneBackgroundTask(
  search?: BackgroundTaskSearch,
  sort?: SortInput[],
): Promise<BackgroundTaskModel | undefined> {
  
  const {
    findOne,
  } = await import("./background_task.service.ts");
  
  checkSortBackgroundTask(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找后台任务
 */
export async function findByIdBackgroundTask(
  id: BackgroundTaskId,
): Promise<BackgroundTaskModel | undefined> {
  
  const {
    findById,
  } = await import("./background_task.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找后台任务
 */
export async function findByIdsBackgroundTask(
  ids: BackgroundTaskId[],
): Promise<BackgroundTaskModel[]> {
  
  const {
    findByIds,
  } = await import("./background_task.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 删除后台任务
 */
export async function deleteByIdsBackgroundTask(
  ids: BackgroundTaskId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./background_task.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原后台任务
 */
export async function revertByIdsBackgroundTask(
  ids: BackgroundTaskId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./background_task.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除后台任务
 */
export async function forceDeleteByIdsBackgroundTask(
  ids: BackgroundTaskId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./background_task.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
