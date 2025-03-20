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
  checkSortWxwApp,
} from "./wxw_app.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./wxw_app.model.ts";

/**
 * 根据条件查找企微应用总数
 */
export async function findCountWxwApp(
  search?: WxwAppSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wxw_app.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找企微应用列表
 */
export async function findAllWxwApp(
  search?: WxwAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwAppModel[]> {
  
  const {
    findAll,
  } = await import("./wxw_app.service.ts");
  
  checkSortWxwApp(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取企微应用字段注释
 */
export async function getFieldCommentsWxwApp(): Promise<WxwAppFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./wxw_app.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个企微应用
 */
export async function findOneWxwApp(
  search?: WxwAppSearch,
  sort?: SortInput[],
): Promise<WxwAppModel | undefined> {
  
  const {
    findOne,
  } = await import("./wxw_app.service.ts");
  
  checkSortWxwApp(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找企微应用
 */
export async function findByIdWxwApp(
  id: WxwAppId,
): Promise<WxwAppModel | undefined> {
  
  const {
    findById,
  } = await import("./wxw_app.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找企微应用
 */
export async function findByIdsWxwApp(
  ids: WxwAppId[],
): Promise<WxwAppModel[]> {
  
  const {
    findByIds,
  } = await import("./wxw_app.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建企微应用
 */
export async function createsWxwApp(
  inputs: WxwAppInput[],
  unique_type?: UniqueType,
): Promise<WxwAppId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./wxw_app.service.ts");
  
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
 * 根据 id 修改企微应用
 */
export async function updateByIdWxwApp(
  id: WxwAppId,
  input: WxwAppInput,
): Promise<WxwAppId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wxw_app.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxwAppId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除企微应用
 */
export async function deleteByIdsWxwApp(
  ids: WxwAppId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wxw_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用企微应用
 */
export async function enableByIdsWxwApp(
  ids: WxwAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./wxw_app.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsWxwApp.is_enabled expect 0 or 1 but got ${ is_enabled }`);
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
 * 根据 ids 锁定或者解锁企微应用
 */
export async function lockByIdsWxwApp(
  ids: WxwAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./wxw_app.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsWxwApp.is_locked expect 0 or 1 but got ${ is_locked }`);
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
 * 根据 ids 还原企微应用
 */
export async function revertByIdsWxwApp(
  ids: WxwAppId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wxw_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除企微应用
 */
export async function forceDeleteByIdsWxwApp(
  ids: WxwAppId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./wxw_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 企微应用 order_by 字段的最大值
 */
export async function findLastOrderByWxwApp(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./wxw_app.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
