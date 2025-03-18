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
  checkSortOptions,
} from "./options.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./options.model.ts";

/**
 * 根据条件查找系统选项总数
 */
export async function findCountOptions(
  search?: OptionsSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./options.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找系统选项列表
 */
export async function findAllOptions(
  search?: OptionsSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OptionsModel[]> {
  
  const {
    findAll,
  } = await import("./options.service.ts");
  
  checkSortOptions(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取系统选项字段注释
 */
export async function getFieldCommentsOptions(): Promise<OptionsFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./options.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个系统选项
 */
export async function findOneOptions(
  search?: OptionsSearch,
  sort?: SortInput[],
): Promise<OptionsModel | undefined> {
  
  const {
    findOne,
  } = await import("./options.service.ts");
  
  checkSortOptions(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找系统选项
 */
export async function findByIdOptions(
  id: OptionsId,
): Promise<OptionsModel | undefined> {
  
  const {
    findById,
  } = await import("./options.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找系统选项
 */
export async function findByIdsOptions(
  ids: OptionsId[],
): Promise<OptionsModel[]> {
  
  const {
    findByIds,
  } = await import("./options.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建系统选项
 */
export async function createsOptions(
  inputs: OptionsInput[],
  unique_type?: UniqueType,
): Promise<OptionsId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./options.service.ts");
  
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
 * 根据 id 修改系统选项
 */
export async function updateByIdOptions(
  id: OptionsId,
  input: OptionsInput,
): Promise<OptionsId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./options.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: OptionsId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除系统选项
 */
export async function deleteByIdsOptions(
  ids: OptionsId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./options.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用系统选项
 */
export async function enableByIdsOptions(
  ids: OptionsId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./options.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsOptions.is_enabled expect 0 or 1 but got ${ is_enabled }`);
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
 * 根据 ids 锁定或者解锁系统选项
 */
export async function lockByIdsOptions(
  ids: OptionsId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./options.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsOptions.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIds(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原系统选项
 */
export async function revertByIdsOptions(
  ids: OptionsId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./options.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除系统选项
 */
export async function forceDeleteByIdsOptions(
  ids: OptionsId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./options.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 系统选项 order_by 字段的最大值
 */
export async function findLastOrderByOptions(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./options.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
