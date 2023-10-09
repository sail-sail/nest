import {
  useContext,
} from "/lib/context.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import dayjs from "dayjs";

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

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
} from "./background_task.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountBackgroundTask(
  search?: BackgroundTaskSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const { findCount } = await import("./background_task.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllBackgroundTask(
  search?: BackgroundTaskSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<BackgroundTaskModel[]> {
  const { findAll } = await import("./background_task.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsBackgroundTask(): Promise<BackgroundTaskFieldComment> {
  const { getFieldComments } = await import("./background_task.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneBackgroundTask(
  search?: BackgroundTaskSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<BackgroundTaskModel | undefined> {
  const { findOne } = await import("./background_task.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdBackgroundTask(
  id: string,
): Promise<BackgroundTaskModel | undefined> {
  const { findById } = await import("./background_task.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsBackgroundTask(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/background_task",
    "delete",
  );
  
  const {
    deleteByIds,
  } = await import("./background_task.service.ts");
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsBackgroundTask(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/background_task",
    "delete",
  );
  
  const {
    revertByIds,
  } = await import("./background_task.service.ts");
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsBackgroundTask(
  ids: string[],
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
