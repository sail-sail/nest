import {
  useContext,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找后台任务总数
 */
export async function findCountBackgroundTask(
  search?: BackgroundTaskSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./background_task.service.ts");
  
  const res = await findCount(search);
  return res;
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
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取后台任务字段注释
 */
export async function getFieldCommentsBackgroundTask(): Promise<BackgroundTaskFieldComment> {
  const { getFieldComments } = await import("./background_task.service.ts");
  const res = await getFieldComments();
  return res;
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
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找后台任务
 */
export async function findByIdBackgroundTask(
  id: BackgroundTaskId,
): Promise<BackgroundTaskModel | undefined> {
  const { findById } = await import("./background_task.service.ts");
  const res = await findById(id);
  return res;
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/background_task",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/background_task",
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
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/background_task",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./background_task.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
