import {
  useContext,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找全宗设置总数
 */
export async function findCountArchive(
  search?: ArchiveSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./archive.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找全宗设置列表
 */
export async function findAllArchive(
  search?: ArchiveSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<ArchiveModel[]> {
  
  const {
    findAll,
  } = await import("./archive.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取全宗设置字段注释
 */
export async function getFieldCommentsArchive(): Promise<ArchiveFieldComment> {
  const { getFieldComments } = await import("./archive.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个全宗设置
 */
export async function findOneArchive(
  search?: ArchiveSearch,
  sort?: SortInput[],
): Promise<ArchiveModel | undefined> {
  
  const {
    findOne,
  } = await import("./archive.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找全宗设置
 */
export async function findByIdArchive(
  id: ArchiveId,
): Promise<ArchiveModel | undefined> {
  const { findById } = await import("./archive.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建全宗设置
 */
export async function createArchive(
  input: ArchiveInput,
  unique_type?: UniqueType,
): Promise<ArchiveId> {
  
  input.id = undefined;
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./archive.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/eams/archive",
    "add",
  );
  const uniqueType = unique_type;
  const id: ArchiveId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改全宗设置
 */
export async function updateByIdArchive(
  id: ArchiveId,
  input: ArchiveInput,
): Promise<ArchiveId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./archive.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/eams/archive",
    "edit",
  );
  const id2: ArchiveId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除全宗设置
 */
export async function deleteByIdsArchive(
  ids: ArchiveId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./archive.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/eams/archive",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原全宗设置
 */
export async function revertByIdsArchive(
  ids: ArchiveId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./archive.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/eams/archive",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除全宗设置
 */
export async function forceDeleteByIdsArchive(
  ids: ArchiveId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/eams/archive",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./archive.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 全宗设置 order_by 字段的最大值
 */
export async function findLastOrderByArchive(): Promise<number> {
  const { findLastOrderBy } = await import("./archive.service.ts");
  const res = findLastOrderBy();
  return res;
}