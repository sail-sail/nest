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
    findCountBackgroundTask,
  } = await import("./background_task.service.ts");
  
  const num = await findCountBackgroundTask(search);
  
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
    findAllBackgroundTask,
  } = await import("./background_task.service.ts");
  
  checkSortBackgroundTask(sort);
  
  const models = await findAllBackgroundTask(search, page, sort);
  
  return models;
}

/**
 * 获取后台任务字段注释
 */
export async function getFieldCommentsBackgroundTask(): Promise<BackgroundTaskFieldComment> {
  
  const {
    getFieldCommentsBackgroundTask,
  } = await import("./background_task.service.ts");
  
  const field_comment = await getFieldCommentsBackgroundTask();
  
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
    findOneBackgroundTask,
  } = await import("./background_task.service.ts");
  
  checkSortBackgroundTask(sort);
  
  const model = await findOneBackgroundTask(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个后台任务, 如果不存在则抛错
 */
export async function findOneOkBackgroundTask(
  search?: BackgroundTaskSearch,
  sort?: SortInput[],
): Promise<BackgroundTaskModel> {
  
  const {
    findOneOkBackgroundTask,
  } = await import("./background_task.service.ts");
  
  checkSortBackgroundTask(sort);
  
  const model = await findOneOkBackgroundTask(search, sort);
  
  return model;
}

/**
 * 根据 id 查找后台任务
 */
export async function findByIdBackgroundTask(
  id: BackgroundTaskId,
): Promise<BackgroundTaskModel | undefined> {
  
  const {
    findByIdBackgroundTask,
  } = await import("./background_task.service.ts");
  
  const model = await findByIdBackgroundTask(id);
  
  return model;
}

/**
 * 根据 id 查找后台任务, 如果不存在则抛错
 */
export async function findByIdOkBackgroundTask(
  id: BackgroundTaskId,
): Promise<BackgroundTaskModel | undefined> {
  
  const {
    findByIdOkBackgroundTask,
  } = await import("./background_task.service.ts");
  
  const model = await findByIdOkBackgroundTask(id);
  
  return model;
}

/**
 * 根据 ids 查找后台任务
 */
export async function findByIdsBackgroundTask(
  ids: BackgroundTaskId[],
): Promise<BackgroundTaskModel[]> {
  
  const {
    findByIdsBackgroundTask,
  } = await import("./background_task.service.ts");
  
  const models = await findByIdsBackgroundTask(ids);
  
  return models;
}

/**
 * 根据 ids 查找后台任务, 出现查询不到的 id 则报错
 */
export async function findByIdsOkBackgroundTask(
  ids: BackgroundTaskId[],
): Promise<BackgroundTaskModel[]> {
  
  const {
    findByIdsOkBackgroundTask,
  } = await import("./background_task.service.ts");
  
  const models = await findByIdsOkBackgroundTask(ids);
  
  return models;
}

/**
 * 根据 ids 删除后台任务
 */
export async function deleteByIdsBackgroundTask(
  ids: BackgroundTaskId[],
): Promise<number> {
  
  const {
    deleteByIdsBackgroundTask,
  } = await import("./background_task.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsBackgroundTask(ids);
  
  return num;
}

/**
 * 根据 ids 还原后台任务
 */
export async function revertByIdsBackgroundTask(
  ids: BackgroundTaskId[],
): Promise<number> {
  
  const {
    revertByIdsBackgroundTask,
  } = await import("./background_task.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsBackgroundTask(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除后台任务
 */
export async function forceDeleteByIdsBackgroundTask(
  ids: BackgroundTaskId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsBackgroundTask,
  } = await import("./background_task.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsBackgroundTask(ids);
  
  return res;
}
