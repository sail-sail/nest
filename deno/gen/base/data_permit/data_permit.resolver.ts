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
  checkSortDataPermit,
} from "./data_permit.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./data_permit.model.ts";

/**
 * 根据条件查找数据权限总数
 */
export async function findCountDataPermit(
  search?: DataPermitSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./data_permit.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据权限列表
 */
export async function findAllDataPermit(
  search?: DataPermitSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DataPermitModel[]> {
  
  const {
    findAll,
  } = await import("./data_permit.service.ts");
  
  checkSortDataPermit(sort);
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取数据权限字段注释
 */
export async function getFieldCommentsDataPermit(): Promise<DataPermitFieldComment> {
  const { getFieldComments } = await import("./data_permit.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个数据权限
 */
export async function findOneDataPermit(
  search?: DataPermitSearch,
  sort?: SortInput[],
): Promise<DataPermitModel | undefined> {
  
  const {
    findOne,
  } = await import("./data_permit.service.ts");
  
  checkSortDataPermit(sort);
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找数据权限
 */
export async function findByIdDataPermit(
  id: DataPermitId,
): Promise<DataPermitModel | undefined> {
  
  const {
    findById,
  } = await import("./data_permit.service.ts");
  
  const res = await findById(id);
  
  return res;
}

/**
 * 批量创建数据权限
 */
export async function createsDataPermit(
  inputs: DataPermitInput[],
  unique_type?: UniqueType,
): Promise<DataPermitId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./data_permit.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLbl(input);
    
    await validate(input);
  }
  const uniqueType = unique_type;
  const ids = await creates(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改数据权限
 */
export async function updateByIdDataPermit(
  id: DataPermitId,
  input: DataPermitInput,
): Promise<DataPermitId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./data_permit.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  const id2: DataPermitId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除数据权限
 */
export async function deleteByIdsDataPermit(
  ids: DataPermitId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./data_permit.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原数据权限
 */
export async function revertByIdsDataPermit(
  ids: DataPermitId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./data_permit.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据权限
 */
export async function forceDeleteByIdsDataPermit(
  ids: DataPermitId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./data_permit.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  const res = await forceDeleteByIds(ids);
  return res;
}
