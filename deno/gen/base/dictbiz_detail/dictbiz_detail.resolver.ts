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
  checkSortDictbizDetail,
} from "./dictbiz_detail.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./dictbiz_detail.model.ts";

/**
 * 根据条件查找业务字典明细总数
 */
export async function findCountDictbizDetail(
  search?: DictbizDetailSearch,
): Promise<number> {
  
  const {
    findCountDictbizDetail,
  } = await import("./dictbiz_detail.service.ts");
  
  const num = await findCountDictbizDetail(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找业务字典明细列表
 */
export async function findAllDictbizDetail(
  search?: DictbizDetailSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictbizDetailModel[]> {
  
  const {
    findAllDictbizDetail,
  } = await import("./dictbiz_detail.service.ts");
  
  checkSortDictbizDetail(sort);
  
  const models = await findAllDictbizDetail(search, page, sort);
  
  return models;
}

/**
 * 获取业务字典明细字段注释
 */
export async function getFieldCommentsDictbizDetail(): Promise<DictbizDetailFieldComment> {
  
  const {
    getFieldCommentsDictbizDetail,
  } = await import("./dictbiz_detail.service.ts");
  
  const field_comment = await getFieldCommentsDictbizDetail();
  
  return field_comment;
}

/**
 * 根据条件查找第一个业务字典明细
 */
export async function findOneDictbizDetail(
  search?: DictbizDetailSearch,
  sort?: SortInput[],
): Promise<DictbizDetailModel | undefined> {
  
  const {
    findOneDictbizDetail,
  } = await import("./dictbiz_detail.service.ts");
  
  checkSortDictbizDetail(sort);
  
  const model = await findOneDictbizDetail(search, sort);
  
  return model;
}

/**
 * 根据 id 查找业务字典明细
 */
export async function findByIdDictbizDetail(
  id: DictbizDetailId,
): Promise<DictbizDetailModel | undefined> {
  
  const {
    findByIdDictbizDetail,
  } = await import("./dictbiz_detail.service.ts");
  
  const model = await findByIdDictbizDetail(id);
  
  return model;
}

/**
 * 根据 ids 查找业务字典明细
 */
export async function findByIdsDictbizDetail(
  ids: DictbizDetailId[],
): Promise<DictbizDetailModel[]> {
  
  const {
    findByIdsDictbizDetail,
  } = await import("./dictbiz_detail.service.ts");
  
  const models = await findByIdsDictbizDetail(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建业务字典明细
 */
export async function createsDictbizDetail(
  inputs: DictbizDetailInput[],
  unique_type?: UniqueType,
): Promise<DictbizDetailId[]> {
  
  const {
    validateDictbizDetail,
    setIdByLblDictbizDetail,
    createsDictbizDetail,
  } = await import("./dictbiz_detail.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblDictbizDetail(input);
    
    await validateDictbizDetail(input);
  }
  const uniqueType = unique_type;
  const ids = await createsDictbizDetail(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改业务字典明细
 */
export async function updateByIdDictbizDetail(
  id: DictbizDetailId,
  input: DictbizDetailInput,
): Promise<DictbizDetailId> {
  
  input.id = undefined;
  
  const {
    setIdByLblDictbizDetail,
    updateByIdDictbizDetail,
  } = await import("./dictbiz_detail.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblDictbizDetail(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: DictbizDetailId = await updateByIdDictbizDetail(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除业务字典明细
 */
export async function deleteByIdsDictbizDetail(
  ids: DictbizDetailId[],
): Promise<number> {
  
  const {
    deleteByIdsDictbizDetail,
  } = await import("./dictbiz_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsDictbizDetail(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用业务字典明细
 */
export async function enableByIdsDictbizDetail(
  ids: DictbizDetailId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsDictbizDetail,
  } = await import("./dictbiz_detail.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDictbizDetail.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsDictbizDetail(ids, is_enabled);
  
  return res;
}

/**
 * 根据 ids 还原业务字典明细
 */
export async function revertByIdsDictbizDetail(
  ids: DictbizDetailId[],
): Promise<number> {
  
  const {
    revertByIdsDictbizDetail,
  } = await import("./dictbiz_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsDictbizDetail(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除业务字典明细
 */
export async function forceDeleteByIdsDictbizDetail(
  ids: DictbizDetailId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsDictbizDetail,
  } = await import("./dictbiz_detail.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsDictbizDetail(ids);
  
  return res;
}

/**
 * 查找 业务字典明细 order_by 字段的最大值
 */
export async function findLastOrderByDictbizDetail(): Promise<number> {
  
  const {
    findLastOrderByDictbizDetail,
  } = await import("./dictbiz_detail.service.ts");
  
  const res = findLastOrderByDictbizDetail();
  
  return res;
}
