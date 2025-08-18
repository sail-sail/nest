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
  intoInputOptions,
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
    findCountOptions,
  } = await import("./options.service.ts");
  
  const num = await findCountOptions(search);
  
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
    findAllOptions,
  } = await import("./options.service.ts");
  
  checkSortOptions(sort);
  
  const models = await findAllOptions(search, page, sort);
  
  return models;
}

/**
 * 获取系统选项字段注释
 */
export async function getFieldCommentsOptions(): Promise<OptionsFieldComment> {
  
  const {
    getFieldCommentsOptions,
  } = await import("./options.service.ts");
  
  const field_comment = await getFieldCommentsOptions();
  
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
    findOneOptions,
  } = await import("./options.service.ts");
  
  checkSortOptions(sort);
  
  const model = await findOneOptions(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个系统选项, 如果不存在则抛错
 */
export async function findOneOkOptions(
  search?: OptionsSearch,
  sort?: SortInput[],
): Promise<OptionsModel> {
  
  const {
    findOneOkOptions,
  } = await import("./options.service.ts");
  
  checkSortOptions(sort);
  
  const model = await findOneOkOptions(search, sort);
  
  return model;
}

/**
 * 根据 id 查找系统选项
 */
export async function findByIdOptions(
  id: OptionsId,
): Promise<OptionsModel | undefined> {
  
  const {
    findByIdOptions,
  } = await import("./options.service.ts");
  
  const model = await findByIdOptions(id);
  
  return model;
}

/**
 * 根据 id 查找系统选项, 如果不存在则抛错
 */
export async function findByIdOkOptions(
  id: OptionsId,
): Promise<OptionsModel | undefined> {
  
  const {
    findByIdOkOptions,
  } = await import("./options.service.ts");
  
  const model = await findByIdOkOptions(id);
  
  return model;
}

/**
 * 根据 ids 查找系统选项
 */
export async function findByIdsOptions(
  ids: OptionsId[],
): Promise<OptionsModel[]> {
  
  const {
    findByIdsOptions,
  } = await import("./options.service.ts");
  
  const models = await findByIdsOptions(ids);
  
  return models;
}

/**
 * 根据 ids 查找系统选项, 出现查询不到的 id 则报错
 */
export async function findByIdsOkOptions(
  ids: OptionsId[],
): Promise<OptionsModel[]> {
  
  const {
    findByIdsOkOptions,
  } = await import("./options.service.ts");
  
  const models = await findByIdsOkOptions(ids);
  
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
    validateOptions,
    setIdByLblOptions,
    createsOptions,
  } = await import("./options.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputOptions(input);
    
    await setIdByLblOptions(input);
    
    await validateOptions(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsOptions(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改系统选项
 */
export async function updateByIdOptions(
  id: OptionsId,
  input: OptionsInput,
): Promise<OptionsId> {
  
  intoInputOptions(input);
  
  const {
    setIdByLblOptions,
    updateByIdOptions,
  } = await import("./options.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblOptions(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: OptionsId = await updateByIdOptions(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除系统选项
 */
export async function deleteByIdsOptions(
  ids: OptionsId[],
): Promise<number> {
  
  const {
    deleteByIdsOptions,
  } = await import("./options.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsOptions(ids);
  
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
    enableByIdsOptions,
  } = await import("./options.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsOptions.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsOptions(ids, is_enabled);
  
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
    lockByIdsOptions,
  } = await import("./options.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsOptions.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsOptions(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原系统选项
 */
export async function revertByIdsOptions(
  ids: OptionsId[],
): Promise<number> {
  
  const {
    revertByIdsOptions,
  } = await import("./options.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsOptions(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除系统选项
 */
export async function forceDeleteByIdsOptions(
  ids: OptionsId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsOptions,
  } = await import("./options.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsOptions(ids);
  
  return res;
}

/**
 * 查找 系统选项 order_by 字段的最大值
 */
export async function findLastOrderByOptions(): Promise<number> {
  
  const {
    findLastOrderByOptions,
  } = await import("./options.service.ts");
  
  const res = findLastOrderByOptions();
  
  return res;
}
