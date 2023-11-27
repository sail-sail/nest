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
  DataPermitInput,
  DataPermitModel,
  DataPermitSearch,
  DataPermitFieldComment,
} from "./data_permit.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountDataPermit(
  search?: DataPermitSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./data_permit.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllDataPermit(
  search?: DataPermitSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<DataPermitModel[]> {
  
  const {
    findAll,
  } = await import("./data_permit.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsDataPermit(): Promise<DataPermitFieldComment> {
  const { getFieldComments } = await import("./data_permit.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneDataPermit(
  search?: DataPermitSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<DataPermitModel | undefined> {
  
  const {
    findOne,
  } = await import("./data_permit.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdDataPermit(
  id: string,
): Promise<DataPermitModel | undefined> {
  const { findById } = await import("./data_permit.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createDataPermit(
  input: DataPermitInput,
  unique_type?: UniqueType,
): Promise<string> {
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./data_permit.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/base/data_permit",
    "add",
  );
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdDataPermit(
  id: string,
  input: DataPermitInput,
): Promise<string> {
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./data_permit.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/data_permit",
    "edit",
  );
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsDataPermit(
  ids: string[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./data_permit.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/data_permit",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsDataPermit(
  ids: string[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./data_permit.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/data_permit",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsDataPermit(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/data_permit",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./data_permit.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
