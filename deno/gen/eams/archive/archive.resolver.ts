import {
  set_is_tran,
  set_is_creating,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortArchive,
} from "./archive.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./archive.model.ts";

/**
 * 根据条件查找全宗设置总数
 */
export async function findCountArchive(
  search?: ArchiveSearch,
): Promise<number> {
  
  const {
    findCountArchive,
  } = await import("./archive.service.ts");
  
  const num = await findCountArchive(search);
  
  return num;
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
    findAllArchive,
  } = await import("./archive.service.ts");
  
  checkSortArchive(sort);
  
  const models = await findAllArchive(search, page, sort);
  
  return models;
}

/**
 * 获取全宗设置字段注释
 */
export async function getFieldCommentsArchive(): Promise<ArchiveFieldComment> {
  
  const {
    getFieldCommentsArchive,
  } = await import("./archive.service.ts");
  
  const field_comment = await getFieldCommentsArchive();
  
  return field_comment;
}

/**
 * 根据条件查找第一个全宗设置
 */
export async function findOneArchive(
  search?: ArchiveSearch,
  sort?: SortInput[],
): Promise<ArchiveModel | undefined> {
  
  const {
    findOneArchive,
  } = await import("./archive.service.ts");
  
  checkSortArchive(sort);
  
  const model = await findOneArchive(search, sort);
  
  return model;
}

/**
 * 根据 id 查找全宗设置
 */
export async function findByIdArchive(
  id: ArchiveId,
): Promise<ArchiveModel | undefined> {
  
  const {
    findByIdArchive,
  } = await import("./archive.service.ts");
  
  const model = await findByIdArchive(id);
  
  return model;
}

/**
 * 根据 ids 查找全宗设置
 */
export async function findByIdsArchive(
  ids: ArchiveId[],
): Promise<ArchiveModel[]> {
  
  const {
    findByIdsArchive,
  } = await import("./archive.service.ts");
  
  const models = await findByIdsArchive(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建全宗设置
 */
export async function createsArchive(
  inputs: ArchiveInput[],
  unique_type?: UniqueType,
): Promise<ArchiveId[]> {
  
  const {
    validateArchive,
    setIdByLblArchive,
    createsArchive,
  } = await import("./archive.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblArchive(input);
    
    await validateArchive(input);
  }
  const uniqueType = unique_type;
  const ids = await createsArchive(inputs, { uniqueType });
  return ids;
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
    setIdByLblArchive,
    updateByIdArchive,
  } = await import("./archive.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblArchive(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: ArchiveId = await updateByIdArchive(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除全宗设置
 */
export async function deleteByIdsArchive(
  ids: ArchiveId[],
): Promise<number> {
  
  const {
    deleteByIdsArchive,
  } = await import("./archive.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsArchive(ids);
  
  return num;
}

/**
 * 根据 ids 还原全宗设置
 */
export async function revertByIdsArchive(
  ids: ArchiveId[],
): Promise<number> {
  
  const {
    revertByIdsArchive,
  } = await import("./archive.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsArchive(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除全宗设置
 */
export async function forceDeleteByIdsArchive(
  ids: ArchiveId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsArchive,
  } = await import("./archive.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsArchive(ids);
  
  return res;
}

/**
 * 查找 全宗设置 order_by 字段的最大值
 */
export async function findLastOrderByArchive(): Promise<number> {
  
  const {
    findLastOrderByArchive,
  } = await import("./archive.service.ts");
  
  const res = findLastOrderByArchive();
  
  return res;
}
