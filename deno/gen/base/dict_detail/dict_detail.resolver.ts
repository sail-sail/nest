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
  checkSortDictDetail,
} from "./dict_detail.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./dict_detail.model.ts";

/**
 * 根据条件查找系统字典明细总数
 */
export async function findCountDictDetail(
  search?: DictDetailSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./dict_detail.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找系统字典明细列表
 */
export async function findAllDictDetail(
  search?: DictDetailSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictDetailModel[]> {
  
  const {
    findAll,
  } = await import("./dict_detail.service.ts");
  
  checkSortDictDetail(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取系统字典明细字段注释
 */
export async function getFieldCommentsDictDetail(): Promise<DictDetailFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./dict_detail.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个系统字典明细
 */
export async function findOneDictDetail(
  search?: DictDetailSearch,
  sort?: SortInput[],
): Promise<DictDetailModel | undefined> {
  
  const {
    findOne,
  } = await import("./dict_detail.service.ts");
  
  checkSortDictDetail(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找系统字典明细
 */
export async function findByIdDictDetail(
  id: DictDetailId,
): Promise<DictDetailModel | undefined> {
  
  const {
    findById,
  } = await import("./dict_detail.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找系统字典明细
 */
export async function findByIdsDictDetail(
  ids: DictDetailId[],
): Promise<DictDetailModel[]> {
  
  const {
    findByIds,
  } = await import("./dict_detail.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建系统字典明细
 */
export async function createsDictDetail(
  inputs: DictDetailInput[],
  unique_type?: UniqueType,
): Promise<DictDetailId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./dict_detail.service.ts");
  
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
 * 根据 id 修改系统字典明细
 */
export async function updateByIdDictDetail(
  id: DictDetailId,
  input: DictDetailInput,
): Promise<DictDetailId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./dict_detail.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: DictDetailId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除系统字典明细
 */
export async function deleteByIdsDictDetail(
  ids: DictDetailId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./dict_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用系统字典明细
 */
export async function enableByIdsDictDetail(
  ids: DictDetailId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./dict_detail.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDictDetail.is_enabled expect 0 or 1 but got ${ is_enabled }`);
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
 * 根据 ids 还原系统字典明细
 */
export async function revertByIdsDictDetail(
  ids: DictDetailId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./dict_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除系统字典明细
 */
export async function forceDeleteByIdsDictDetail(
  ids: DictDetailId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./dict_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 系统字典明细 order_by 字段的最大值
 */
export async function findLastOrderByDictDetail(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./dict_detail.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
