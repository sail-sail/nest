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
    findCountDataPermit,
  } = await import("./data_permit.service.ts");
  
  const num = await findCountDataPermit(search);
  
  return num;
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
    findAllDataPermit,
  } = await import("./data_permit.service.ts");
  
  checkSortDataPermit(sort);
  
  const models = await findAllDataPermit(search, page, sort);
  
  return models;
}

/**
 * 获取数据权限字段注释
 */
export async function getFieldCommentsDataPermit(): Promise<DataPermitFieldComment> {
  
  const {
    getFieldCommentsDataPermit,
  } = await import("./data_permit.service.ts");
  
  const field_comment = await getFieldCommentsDataPermit();
  
  return field_comment;
}

/**
 * 根据条件查找第一个数据权限
 */
export async function findOneDataPermit(
  search?: DataPermitSearch,
  sort?: SortInput[],
): Promise<DataPermitModel | undefined> {
  
  const {
    findOneDataPermit,
  } = await import("./data_permit.service.ts");
  
  checkSortDataPermit(sort);
  
  const model = await findOneDataPermit(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个数据权限, 如果不存在则抛错
 */
export async function findOneOkDataPermit(
  search?: DataPermitSearch,
  sort?: SortInput[],
): Promise<DataPermitModel> {
  
  const {
    findOneOkDataPermit,
  } = await import("./data_permit.service.ts");
  
  checkSortDataPermit(sort);
  
  const model = await findOneOkDataPermit(search, sort);
  
  return model;
}

/**
 * 根据 id 查找数据权限
 */
export async function findByIdDataPermit(
  id: DataPermitId,
): Promise<DataPermitModel | undefined> {
  
  const {
    findByIdDataPermit,
  } = await import("./data_permit.service.ts");
  
  const model = await findByIdDataPermit(id);
  
  return model;
}

/**
 * 根据 id 查找数据权限, 如果不存在则抛错
 */
export async function findByIdOkDataPermit(
  id: DataPermitId,
): Promise<DataPermitModel | undefined> {
  
  const {
    findByIdOkDataPermit,
  } = await import("./data_permit.service.ts");
  
  const model = await findByIdOkDataPermit(id);
  
  return model;
}

/**
 * 根据 ids 查找数据权限
 */
export async function findByIdsDataPermit(
  ids: DataPermitId[],
): Promise<DataPermitModel[]> {
  
  const {
    findByIdsDataPermit,
  } = await import("./data_permit.service.ts");
  
  const models = await findByIdsDataPermit(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 查找数据权限, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDataPermit(
  ids: DataPermitId[],
): Promise<DataPermitModel[]> {
  
  const {
    findByIdsOkDataPermit,
  } = await import("./data_permit.service.ts");
  
  const models = await findByIdsOkDataPermit(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建数据权限
 */
export async function createsDataPermit(
  inputs: DataPermitInput[],
  unique_type?: UniqueType,
): Promise<DataPermitId[]> {
  
  const {
    validateDataPermit,
    setIdByLblDataPermit,
    createsDataPermit,
  } = await import("./data_permit.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblDataPermit(input);
    
    await validateDataPermit(input);
  }
  const uniqueType = unique_type;
  const ids = await createsDataPermit(inputs, { uniqueType });
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
    setIdByLblDataPermit,
    updateByIdDataPermit,
  } = await import("./data_permit.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblDataPermit(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: DataPermitId = await updateByIdDataPermit(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除数据权限
 */
export async function deleteByIdsDataPermit(
  ids: DataPermitId[],
): Promise<number> {
  
  const {
    deleteByIdsDataPermit,
  } = await import("./data_permit.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsDataPermit(ids);
  
  return num;
}

/**
 * 根据 ids 还原数据权限
 */
export async function revertByIdsDataPermit(
  ids: DataPermitId[],
): Promise<number> {
  
  const {
    revertByIdsDataPermit,
  } = await import("./data_permit.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsDataPermit(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除数据权限
 */
export async function forceDeleteByIdsDataPermit(
  ids: DataPermitId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsDataPermit,
  } = await import("./data_permit.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsDataPermit(ids);
  
  return res;
}
