import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type UniqueType,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type BackgroundTaskInput,
  type BackgroundTaskSearch,
} from "./background_task.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountBackgroundTask(
  search?: BackgroundTaskSearch & { $extra?: SearchExtra[] },
) {
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
) {
  const { findAll } = await import("./background_task.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsBackgroundTask() {
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
) {
  const { findOne } = await import("./background_task.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdBackgroundTask(
  id: string,
) {
  const { findById } = await import("./background_task.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsBackgroundTask(
  ids: string[],
) {
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
) {
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
) {
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
