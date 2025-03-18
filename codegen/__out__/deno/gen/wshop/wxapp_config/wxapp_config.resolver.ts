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
  checkSortWxappConfig,
} from "./wxapp_config.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./wxapp_config.model.ts";

/**
 * 根据条件查找小程序配置总数
 */
export async function findCountWxappConfig(
  search?: WxappConfigSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wxapp_config.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找小程序配置列表
 */
export async function findAllWxappConfig(
  search?: WxappConfigSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxappConfigModel[]> {
  
  const {
    findAll,
  } = await import("./wxapp_config.service.ts");
  
  checkSortWxappConfig(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取小程序配置字段注释
 */
export async function getFieldCommentsWxappConfig(): Promise<WxappConfigFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./wxapp_config.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个小程序配置
 */
export async function findOneWxappConfig(
  search?: WxappConfigSearch,
  sort?: SortInput[],
): Promise<WxappConfigModel | undefined> {
  
  const {
    findOne,
  } = await import("./wxapp_config.service.ts");
  
  checkSortWxappConfig(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找小程序配置
 */
export async function findByIdWxappConfig(
  id: WxappConfigId,
): Promise<WxappConfigModel | undefined> {
  
  const {
    findById,
  } = await import("./wxapp_config.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找小程序配置
 */
export async function findByIdsWxappConfig(
  ids: WxappConfigId[],
): Promise<WxappConfigModel[]> {
  
  const {
    findByIds,
  } = await import("./wxapp_config.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建小程序配置
 */
export async function createsWxappConfig(
  inputs: WxappConfigInput[],
  unique_type?: UniqueType,
): Promise<WxappConfigId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./wxapp_config.service.ts");
  
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
 * 根据 id 修改小程序配置
 */
export async function updateByIdWxappConfig(
  id: WxappConfigId,
  input: WxappConfigInput,
): Promise<WxappConfigId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wxapp_config.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxappConfigId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除小程序配置
 */
export async function deleteByIdsWxappConfig(
  ids: WxappConfigId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wxapp_config.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用小程序配置
 */
export async function enableByIdsWxappConfig(
  ids: WxappConfigId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./wxapp_config.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsWxappConfig.is_enabled expect 0 or 1 but got ${ is_enabled }`);
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
 * 根据 ids 锁定或者解锁小程序配置
 */
export async function lockByIdsWxappConfig(
  ids: WxappConfigId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./wxapp_config.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsWxappConfig.is_locked expect 0 or 1 but got ${ is_locked }`);
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
 * 根据 ids 还原小程序配置
 */
export async function revertByIdsWxappConfig(
  ids: WxappConfigId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wxapp_config.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除小程序配置
 */
export async function forceDeleteByIdsWxappConfig(
  ids: WxappConfigId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./wxapp_config.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
