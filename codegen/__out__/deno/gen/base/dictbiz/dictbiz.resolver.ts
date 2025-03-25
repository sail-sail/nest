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
  checkSortDictbiz,
} from "./dictbiz.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./dictbiz.model.ts";

/**
 * 根据条件查找业务字典总数
 */
export async function findCountDictbiz(
  search?: DictbizSearch,
): Promise<number> {
  
  const {
    findCountDictbiz,
  } = await import("./dictbiz.service.ts");
  
  const num = await findCountDictbiz(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找业务字典列表
 */
export async function findAllDictbiz(
  search?: DictbizSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictbizModel[]> {
  
  const {
    findAllDictbiz,
  } = await import("./dictbiz.service.ts");
  
  checkSortDictbiz(sort);
  
  const models = await findAllDictbiz(search, page, sort);
  
  return models;
}

/**
 * 获取业务字典字段注释
 */
export async function getFieldCommentsDictbiz(): Promise<DictbizFieldComment> {
  
  const {
    getFieldCommentsDictbiz,
  } = await import("./dictbiz.service.ts");
  
  const field_comment = await getFieldCommentsDictbiz();
  
  return field_comment;
}

/**
 * 根据条件查找第一个业务字典
 */
export async function findOneDictbiz(
  search?: DictbizSearch,
  sort?: SortInput[],
): Promise<DictbizModel | undefined> {
  
  const {
    findOneDictbiz,
  } = await import("./dictbiz.service.ts");
  
  checkSortDictbiz(sort);
  
  const model = await findOneDictbiz(search, sort);
  
  return model;
}

/**
 * 根据 id 查找业务字典
 */
export async function findByIdDictbiz(
  id: DictbizId,
): Promise<DictbizModel | undefined> {
  
  const {
    findByIdDictbiz,
  } = await import("./dictbiz.service.ts");
  
  const model = await findByIdDictbiz(id);
  
  return model;
}

/**
 * 根据 ids 查找业务字典
 */
export async function findByIdsDictbiz(
  ids: DictbizId[],
): Promise<DictbizModel[]> {
  
  const {
    findByIdsDictbiz,
  } = await import("./dictbiz.service.ts");
  
  const models = await findByIdsDictbiz(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建业务字典
 */
export async function createsDictbiz(
  inputs: DictbizInput[],
  unique_type?: UniqueType,
): Promise<DictbizId[]> {
  
  const {
    validateDictbiz,
    setIdByLblDictbiz,
    createsDictbiz,
  } = await import("./dictbiz.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblDictbiz(input);
    
    await validateDictbiz(input);
  }
  const uniqueType = unique_type;
  const ids = await createsDictbiz(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改业务字典
 */
export async function updateByIdDictbiz(
  id: DictbizId,
  input: DictbizInput,
): Promise<DictbizId> {
  
  input.id = undefined;
  
  const {
    setIdByLblDictbiz,
    updateByIdDictbiz,
  } = await import("./dictbiz.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblDictbiz(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: DictbizId = await updateByIdDictbiz(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除业务字典
 */
export async function deleteByIdsDictbiz(
  ids: DictbizId[],
): Promise<number> {
  
  const {
    deleteByIdsDictbiz,
  } = await import("./dictbiz.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsDictbiz(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用业务字典
 */
export async function enableByIdsDictbiz(
  ids: DictbizId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsDictbiz,
  } = await import("./dictbiz.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDictbiz.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsDictbiz(ids, is_enabled);
  
  return res;
}

/**
 * 根据 ids 还原业务字典
 */
export async function revertByIdsDictbiz(
  ids: DictbizId[],
): Promise<number> {
  
  const {
    revertByIdsDictbiz,
  } = await import("./dictbiz.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsDictbiz(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除业务字典
 */
export async function forceDeleteByIdsDictbiz(
  ids: DictbizId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsDictbiz,
  } = await import("./dictbiz.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsDictbiz(ids);
  
  return res;
}

/**
 * 查找 业务字典 order_by 字段的最大值
 */
export async function findLastOrderByDictbiz(): Promise<number> {
  
  const {
    findLastOrderByDictbiz,
  } = await import("./dictbiz.service.ts");
  
  const res = findLastOrderByDictbiz();
  
  return res;
}
