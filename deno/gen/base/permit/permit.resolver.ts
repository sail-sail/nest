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
  type PermitInput,
  type PermitSearch,
} from "./permit.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountPermit(
  search?: PermitSearch & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./permit.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllPermit(
  search?: PermitSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const { findAll } = await import("./permit.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsPermit() {
  const { getFieldComments } = await import("./permit.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOnePermit(
  search?: PermitSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./permit.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdPermit(
  id: string,
) {
  const { findById } = await import("./permit.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createPermit(
  input: PermitInput,
  unique_type?: UniqueType,
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit",
    "add",
  );
  
  const {
    create,
  } = await import("./permit.service.ts");
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdPermit(
  id: string,
  input: PermitInput,
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit",
    "edit",
  );
  
  const {
    updateById,
  } = await import("./permit.service.ts");
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsPermit(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit",
    "delete",
  );
  
  const {
    deleteByIds,
  } = await import("./permit.service.ts");
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsPermit(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit",
    "delete",
  );
  
  const {
    revertByIds,
  } = await import("./permit.service.ts");
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsPermit(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./permit.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
