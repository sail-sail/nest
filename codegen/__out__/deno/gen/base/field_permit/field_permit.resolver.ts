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
 * 根据条件查找字段权限总数
 */
export async function findCountFieldPermit(
  search?: FieldPermitSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./field_permit.service.ts");
  
  const res = await findCount(search);
  return res;
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
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段权限字段注释
 */
export async function getFieldCommentsFieldPermit(): Promise<FieldPermitFieldComment> {
  const { getFieldComments } = await import("./field_permit.service.ts");
  const res = await getFieldComments();
  return res;
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
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找字段权限
 */
export async function findByIdFieldPermit(
  id: FieldPermitId,
): Promise<FieldPermitModel | undefined> {
  const { findById } = await import("./field_permit.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建字段权限
 */
export async function createFieldPermit(
  input: FieldPermitInput,
  unique_type?: UniqueType,
): Promise<FieldPermitId> {
  
  input.id = undefined;
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./field_permit.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/base/field_permit",
    "add",
  );
  const uniqueType = unique_type;
  const id = await create(input, { uniqueType });
  return id;
}

/**
 * 批量创建字段权限
 */
export async function createsFieldPermit(
  inputs: FieldPermitInput[],
  unique_type?: UniqueType,
): Promise<FieldPermitId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./field_permit.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/field_permit",
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/field_permit",
    "edit",
  );
  const id2: FieldPermitId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除字段权限
 */
export async function deleteByIdsFieldPermit(
  ids: FieldPermitId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./field_permit.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/field_permit",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原字段权限
 */
export async function revertByIdsFieldPermit(
  ids: FieldPermitId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./field_permit.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/field_permit",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除字段权限
 */
export async function forceDeleteByIdsFieldPermit(
  ids: FieldPermitId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/field_permit",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./field_permit.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
