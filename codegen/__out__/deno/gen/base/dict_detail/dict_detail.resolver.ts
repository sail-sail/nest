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
    findCountDictDetail,
  } = await import("./dict_detail.service.ts");
  
  const num = await findCountDictDetail(search);
  
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
    findAllDictDetail,
  } = await import("./dict_detail.service.ts");
  
  checkSortDictDetail(sort);
  
  const models = await findAllDictDetail(search, page, sort);
  
  return models;
}

/**
 * 获取系统字典明细字段注释
 */
export async function getFieldCommentsDictDetail(): Promise<DictDetailFieldComment> {
  
  const {
    getFieldCommentsDictDetail,
  } = await import("./dict_detail.service.ts");
  
  const field_comment = await getFieldCommentsDictDetail();
  
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
    findOneDictDetail,
  } = await import("./dict_detail.service.ts");
  
  checkSortDictDetail(sort);
  
  const model = await findOneDictDetail(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个系统字典明细, 如果不存在则抛错
 */
export async function findOneOkDictDetail(
  search?: DictDetailSearch,
  sort?: SortInput[],
): Promise<DictDetailModel> {
  
  const {
    findOneOkDictDetail,
  } = await import("./dict_detail.service.ts");
  
  checkSortDictDetail(sort);
  
  const model = await findOneOkDictDetail(search, sort);
  
  return model;
}

/**
 * 根据 id 查找系统字典明细
 */
export async function findByIdDictDetail(
  id: DictDetailId,
): Promise<DictDetailModel | undefined> {
  
  const {
    findByIdDictDetail,
  } = await import("./dict_detail.service.ts");
  
  const model = await findByIdDictDetail(id);
  
  return model;
}

/**
 * 根据 id 查找系统字典明细, 如果不存在则抛错
 */
export async function findByIdOkDictDetail(
  id: DictDetailId,
): Promise<DictDetailModel | undefined> {
  
  const {
    findByIdOkDictDetail,
  } = await import("./dict_detail.service.ts");
  
  const model = await findByIdOkDictDetail(id);
  
  return model;
}

/**
 * 根据 ids 查找系统字典明细
 */
export async function findByIdsDictDetail(
  ids: DictDetailId[],
): Promise<DictDetailModel[]> {
  
  const {
    findByIdsDictDetail,
  } = await import("./dict_detail.service.ts");
  
  const models = await findByIdsDictDetail(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 查找系统字典明细, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDictDetail(
  ids: DictDetailId[],
): Promise<DictDetailModel[]> {
  
  const {
    findByIdsOkDictDetail,
  } = await import("./dict_detail.service.ts");
  
  const models = await findByIdsOkDictDetail(ids);
  
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
    validateDictDetail,
    setIdByLblDictDetail,
    createsDictDetail,
  } = await import("./dict_detail.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblDictDetail(input);
    
    await validateDictDetail(input);
  }
  const uniqueType = unique_type;
  const ids = await createsDictDetail(inputs, { uniqueType });
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
    setIdByLblDictDetail,
    updateByIdDictDetail,
  } = await import("./dict_detail.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblDictDetail(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: DictDetailId = await updateByIdDictDetail(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除系统字典明细
 */
export async function deleteByIdsDictDetail(
  ids: DictDetailId[],
): Promise<number> {
  
  const {
    deleteByIdsDictDetail,
  } = await import("./dict_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsDictDetail(ids);
  
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
    enableByIdsDictDetail,
  } = await import("./dict_detail.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDictDetail.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsDictDetail(ids, is_enabled);
  
  return res;
}

/**
 * 根据 ids 还原系统字典明细
 */
export async function revertByIdsDictDetail(
  ids: DictDetailId[],
): Promise<number> {
  
  const {
    revertByIdsDictDetail,
  } = await import("./dict_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsDictDetail(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除系统字典明细
 */
export async function forceDeleteByIdsDictDetail(
  ids: DictDetailId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsDictDetail,
  } = await import("./dict_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsDictDetail(ids);
  
  return res;
}

/**
 * 查找 系统字典明细 order_by 字段的最大值
 */
export async function findLastOrderByDictDetail(): Promise<number> {
  
  const {
    findLastOrderByDictDetail,
  } = await import("./dict_detail.service.ts");
  
  const res = findLastOrderByDictDetail();
  
  return res;
}
