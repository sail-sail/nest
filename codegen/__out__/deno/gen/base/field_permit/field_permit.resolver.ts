import {
  useContext,
} from "/lib/context.ts";

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  FieldPermitInput,
  FieldPermitModel,
  FieldPermitSearch,
  FieldPermitFieldComment,
} from "./field_permit.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountFieldPermit(
  search?: FieldPermitSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const { findCount } = await import("./field_permit.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllFieldPermit(
  search?: FieldPermitSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<FieldPermitModel[]> {
  const { findAll } = await import("./field_permit.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsFieldPermit(): Promise<FieldPermitFieldComment> {
  const { getFieldComments } = await import("./field_permit.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneFieldPermit(
  search?: FieldPermitSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<FieldPermitModel | undefined> {
  const { findOne } = await import("./field_permit.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdFieldPermit(
  id: string,
): Promise<FieldPermitModel | undefined> {
  const { findById } = await import("./field_permit.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createFieldPermit(
  input: FieldPermitInput,
  unique_type?: UniqueType,
): Promise<string> {
  
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
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdFieldPermit(
  id: string,
  input: FieldPermitInput,
): Promise<string> {
  
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
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsFieldPermit(
  ids: string[],
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
 * 根据 ids 还原数据
 */
export async function revertByIdsFieldPermit(
  ids: string[],
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
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsFieldPermit(
  ids: string[],
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
