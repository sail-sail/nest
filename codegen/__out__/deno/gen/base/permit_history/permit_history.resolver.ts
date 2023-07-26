import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type PermitHistoryInput,
  type PermitHistorySearch,
} from "./permit_history.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountPermitHistory(
  search?: PermitHistorySearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./permit_history.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllPermitHistory(
  search?: PermitHistorySearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const { findAll } = await import("./permit_history.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsPermitHistory() {
  const { getFieldComments } = await import("./permit_history.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOnePermitHistory(
  search?: PermitHistorySearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./permit_history.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdPermitHistory(
  id: string,
) {
  const { findById } = await import("./permit_history.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createPermitHistory(
  input: PermitHistoryInput,
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit_history",
    "add",
  );
  
  const {
    create,
  } = await import("./permit_history.service.ts");
  const res = await create(input);
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdPermitHistory(
  id: string,
  input: PermitHistoryInput,
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit_history",
    "edit",
  );
  
  const {
    updateById,
  } = await import("./permit_history.service.ts");
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsPermitHistory(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit_history",
    "delete",
  );
  
  const {
    deleteByIds,
  } = await import("./permit_history.service.ts");
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsPermitHistory(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit_history",
    "delete",
  );
  
  const {
    revertByIds,
  } = await import("./permit_history.service.ts");
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsPermitHistory(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit_history",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./permit_history.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
