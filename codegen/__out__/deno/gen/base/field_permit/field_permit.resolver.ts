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
    findCountFieldPermit,
  } = await import("./field_permit.service.ts");
  
  const num = await findCountFieldPermit(search);
  
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
    findAllFieldPermit,
  } = await import("./field_permit.service.ts");
  
  checkSortFieldPermit(sort);
  
  const models = await findAllFieldPermit(search, page, sort);
  
  return models;
}

/**
 * 获取字段权限字段注释
 */
export async function getFieldCommentsFieldPermit(): Promise<FieldPermitFieldComment> {
  
  const {
    getFieldCommentsFieldPermit,
  } = await import("./field_permit.service.ts");
  
  const field_comment = await getFieldCommentsFieldPermit();
  
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
    findOneFieldPermit,
  } = await import("./field_permit.service.ts");
  
  checkSortFieldPermit(sort);
  
  const model = await findOneFieldPermit(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个字段权限, 如果不存在则抛错
 */
export async function findOneOkFieldPermit(
  search?: FieldPermitSearch,
  sort?: SortInput[],
): Promise<FieldPermitModel> {
  
  const {
    findOneOkFieldPermit,
  } = await import("./field_permit.service.ts");
  
  checkSortFieldPermit(sort);
  
  const model = await findOneOkFieldPermit(search, sort);
  
  return model;
}

/**
 * 根据 id 查找字段权限
 */
export async function findByIdFieldPermit(
  id: FieldPermitId,
): Promise<FieldPermitModel | undefined> {
  
  const {
    findByIdFieldPermit,
  } = await import("./field_permit.service.ts");
  
  const model = await findByIdFieldPermit(id);
  
  return model;
}

/**
 * 根据 id 查找字段权限, 如果不存在则抛错
 */
export async function findByIdOkFieldPermit(
  id: FieldPermitId,
): Promise<FieldPermitModel | undefined> {
  
  const {
    findByIdOkFieldPermit,
  } = await import("./field_permit.service.ts");
  
  const model = await findByIdOkFieldPermit(id);
  
  return model;
}

/**
 * 根据 ids 查找字段权限
 */
export async function findByIdsFieldPermit(
  ids: FieldPermitId[],
): Promise<FieldPermitModel[]> {
  
  const {
    findByIdsFieldPermit,
  } = await import("./field_permit.service.ts");
  
  const models = await findByIdsFieldPermit(ids);
  
  return models;
}

/**
 * 根据 ids 查找字段权限, 出现查询不到的 id 则报错
 */
export async function findByIdsOkFieldPermit(
  ids: FieldPermitId[],
): Promise<FieldPermitModel[]> {
  
  const {
    findByIdsOkFieldPermit,
  } = await import("./field_permit.service.ts");
  
  const models = await findByIdsOkFieldPermit(ids);
  
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
    setIdByLblFieldPermit,
    updateByIdFieldPermit,
  } = await import("./field_permit.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblFieldPermit(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: FieldPermitId = await updateByIdFieldPermit(id, input);
  
  return id2;
}

/**
 * 查找 字段权限 order_by 字段的最大值
 */
export async function findLastOrderByFieldPermit(): Promise<number> {
  
  const {
    findLastOrderByFieldPermit,
  } = await import("./field_permit.service.ts");
  
  const res = findLastOrderByFieldPermit();
  
  return res;
}
