import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortFieldPermit,
} from "./field_permit.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./field_permit.model.ts";

/**
 * 根据条件查找字段权限总数
 */
export async function findCountFieldPermit(
  search?: FieldPermitSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./field_permit.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找字段权限列表
 */
export async function findAllFieldPermit(
  search?: FieldPermitSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<FieldPermitModel[]> {
  
  const {
    findAll,
  } = await import("./field_permit.service.ts");
  
  checkSortFieldPermit(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取字段权限字段注释
 */
export async function getFieldCommentsFieldPermit(): Promise<FieldPermitFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./field_permit.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个字段权限
 */
export async function findOneFieldPermit(
  search?: FieldPermitSearch,
  sort?: SortInput[],
): Promise<FieldPermitModel | undefined> {
  
  const {
    findOne,
  } = await import("./field_permit.service.ts");
  
  checkSortFieldPermit(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找字段权限
 */
export async function findByIdFieldPermit(
  id: FieldPermitId,
): Promise<FieldPermitModel | undefined> {
  
  const {
    findById,
  } = await import("./field_permit.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找字段权限
 */
export async function findByIdsFieldPermit(
  ids: FieldPermitId[],
): Promise<FieldPermitModel[]> {
  
  const {
    findByIds,
  } = await import("./field_permit.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 id 修改字段权限
 */
export async function updateByIdFieldPermit(
  id: FieldPermitId,
  input: FieldPermitInput,
): Promise<FieldPermitId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./field_permit.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: FieldPermitId = await updateById(id, input);
  
  return id2;
}

/**
 * 查找 字段权限 order_by 字段的最大值
 */
export async function findLastOrderByFieldPermit(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./field_permit.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
