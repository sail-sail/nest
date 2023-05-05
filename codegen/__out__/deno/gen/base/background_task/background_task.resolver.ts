import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type BackgroundTaskInput,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type BackgroundTaskModel,
  type BackgroundTaskSearch,
} from "./background_task.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountBackgroundTask(
  search?: BackgroundTaskSearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./background_task.service.ts");
  const data = await findCount(search);
  return data;
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
  const data = await findAll(search, page, sort);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsBackgroundTask() {
  const { getFieldComments } = await import("./background_task.service.ts");
  const data = await getFieldComments();
  return data;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneBackgroundTask(
  search?: BackgroundTaskSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./background_task.service.ts");
  const data = await findOne(search, sort);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdBackgroundTask(
  id: string,
) {
  const { findById } = await import("./background_task.service.ts");
  const data = await findById(id);
  return data;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsBackgroundTask(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { deleteByIds } = await import("./background_task.service.ts");
  const data = await deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsBackgroundTask(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { revertByIds } = await import("./background_task.service.ts");
  const data = await revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsBackgroundTask(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { forceDeleteByIds } = await import("./background_task.service.ts");
  const data = await forceDeleteByIds(ids);
  return data;
}
