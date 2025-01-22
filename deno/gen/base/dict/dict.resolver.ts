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
  checkSortDict,
} from "./dict.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./dict.model.ts";

/**
 * 根据条件查找系统字典总数
 */
export async function findCountDict(
  search?: DictSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./dict.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找系统字典列表
 */
export async function findAllDict(
  search?: DictSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictModel[]> {
  
  const {
    findAll,
  } = await import("./dict.service.ts");
  
  checkSortDict(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取系统字典字段注释
 */
export async function getFieldCommentsDict(): Promise<DictFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./dict.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个系统字典
 */
export async function findOneDict(
  search?: DictSearch,
  sort?: SortInput[],
): Promise<DictModel | undefined> {
  
  const {
    findOne,
  } = await import("./dict.service.ts");
  
  checkSortDict(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找系统字典
 */
export async function findByIdDict(
  id: DictId,
): Promise<DictModel | undefined> {
  
  const {
    findById,
  } = await import("./dict.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 批量创建系统字典
 */
export async function createsDict(
  inputs: DictInput[],
  unique_type?: UniqueType,
): Promise<DictId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./dict.service.ts");
  
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
 * 根据 id 修改系统字典
 */
export async function updateByIdDict(
  id: DictId,
  input: DictInput,
): Promise<DictId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./dict.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: DictId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除系统字典
 */
export async function deleteByIdsDict(
  ids: DictId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./dict.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用系统字典
 */
export async function enableByIdsDict(
  ids: DictId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./dict.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDict.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  
  return res;
}

/**
 * 根据 ids 还原系统字典
 */
export async function revertByIdsDict(
  ids: DictId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./dict.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除系统字典
 */
export async function forceDeleteByIdsDict(
  ids: DictId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./dict.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 系统字典 order_by 字段的最大值
 */
export async function findLastOrderByDict(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./dict.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
