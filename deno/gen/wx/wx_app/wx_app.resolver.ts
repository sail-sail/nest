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
  checkSortWxApp,
} from "./wx_app.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./wx_app.model.ts";

/**
 * 根据条件查找小程序设置总数
 */
export async function findCountWxApp(
  search?: WxAppSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wx_app.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找小程序设置列表
 */
export async function findAllWxApp(
  search?: WxAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxAppModel[]> {
  
  const {
    findAll,
  } = await import("./wx_app.service.ts");
  
  checkSortWxApp(sort);
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取小程序设置字段注释
 */
export async function getFieldCommentsWxApp(): Promise<WxAppFieldComment> {
  const { getFieldComments } = await import("./wx_app.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个小程序设置
 */
export async function findOneWxApp(
  search?: WxAppSearch,
  sort?: SortInput[],
): Promise<WxAppModel | undefined> {
  
  const {
    findOne,
  } = await import("./wx_app.service.ts");
  
  checkSortWxApp(sort);
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找小程序设置
 */
export async function findByIdWxApp(
  id: WxAppId,
): Promise<WxAppModel | undefined> {
  
  const {
    findById,
  } = await import("./wx_app.service.ts");
  
  const res = await findById(id);
  
  return res;
}

/**
 * 批量创建小程序设置
 */
export async function createsWxApp(
  inputs: WxAppInput[],
  unique_type?: UniqueType,
): Promise<WxAppId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./wx_app.service.ts");
  
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
 * 根据 id 修改小程序设置
 */
export async function updateByIdWxApp(
  id: WxAppId,
  input: WxAppInput,
): Promise<WxAppId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wx_app.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  const id2: WxAppId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除小程序设置
 */
export async function deleteByIdsWxApp(
  ids: WxAppId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wx_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用小程序设置
 */
export async function enableByIdsWxApp(
  ids: WxAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./wx_app.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsWxApp.is_enabled expect 0 or 1 but got ${ is_enabled }`);
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
 * 根据 ids 锁定或者解锁小程序设置
 */
export async function lockByIdsWxApp(
  ids: WxAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./wx_app.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsWxApp.is_locked expect 0 or 1 but got ${ is_locked }`);
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
 * 根据 ids 还原小程序设置
 */
export async function revertByIdsWxApp(
  ids: WxAppId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wx_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除小程序设置
 */
export async function forceDeleteByIdsWxApp(
  ids: WxAppId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./wx_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 小程序设置 order_by 字段的最大值
 */
export async function findLastOrderByWxApp(): Promise<number> {
  const { findLastOrderBy } = await import("./wx_app.service.ts");
  const res = findLastOrderBy();
  return res;
}
