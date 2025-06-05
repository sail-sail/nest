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
    findCountWxApp,
  } = await import("./wx_app.service.ts");
  
  const num = await findCountWxApp(search);
  
  return num;
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
    findAllWxApp,
  } = await import("./wx_app.service.ts");
  
  checkSortWxApp(sort);
  
  const models = await findAllWxApp(search, page, sort);
  
  return models;
}

/**
 * 获取小程序设置字段注释
 */
export async function getFieldCommentsWxApp(): Promise<WxAppFieldComment> {
  
  const {
    getFieldCommentsWxApp,
  } = await import("./wx_app.service.ts");
  
  const field_comment = await getFieldCommentsWxApp();
  
  return field_comment;
}

/**
 * 根据条件查找第一个小程序设置
 */
export async function findOneWxApp(
  search?: WxAppSearch,
  sort?: SortInput[],
): Promise<WxAppModel | undefined> {
  
  const {
    findOneWxApp,
  } = await import("./wx_app.service.ts");
  
  checkSortWxApp(sort);
  
  const model = await findOneWxApp(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个小程序设置, 如果不存在则抛错
 */
export async function findOneOkWxApp(
  search?: WxAppSearch,
  sort?: SortInput[],
): Promise<WxAppModel> {
  
  const {
    findOneOkWxApp,
  } = await import("./wx_app.service.ts");
  
  checkSortWxApp(sort);
  
  const model = await findOneOkWxApp(search, sort);
  
  return model;
}

/**
 * 根据 id 查找小程序设置
 */
export async function findByIdWxApp(
  id: WxAppId,
): Promise<WxAppModel | undefined> {
  
  const {
    findByIdWxApp,
  } = await import("./wx_app.service.ts");
  
  const model = await findByIdWxApp(id);
  
  return model;
}

/**
 * 根据 id 查找小程序设置, 如果不存在则抛错
 */
export async function findByIdOkWxApp(
  id: WxAppId,
): Promise<WxAppModel | undefined> {
  
  const {
    findByIdOkWxApp,
  } = await import("./wx_app.service.ts");
  
  const model = await findByIdOkWxApp(id);
  
  return model;
}

/**
 * 根据 ids 查找小程序设置
 */
export async function findByIdsWxApp(
  ids: WxAppId[],
): Promise<WxAppModel[]> {
  
  const {
    findByIdsWxApp,
  } = await import("./wx_app.service.ts");
  
  const models = await findByIdsWxApp(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 查找小程序设置, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxApp(
  ids: WxAppId[],
): Promise<WxAppModel[]> {
  
  const {
    findByIdsOkWxApp,
  } = await import("./wx_app.service.ts");
  
  const models = await findByIdsOkWxApp(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建小程序设置
 */
export async function createsWxApp(
  inputs: WxAppInput[],
  unique_type?: UniqueType,
): Promise<WxAppId[]> {
  
  const {
    validateWxApp,
    setIdByLblWxApp,
    createsWxApp,
  } = await import("./wx_app.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblWxApp(input);
    
    await validateWxApp(input);
  }
  const uniqueType = unique_type;
  const ids = await createsWxApp(inputs, { uniqueType });
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
    setIdByLblWxApp,
    updateByIdWxApp,
  } = await import("./wx_app.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblWxApp(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxAppId = await updateByIdWxApp(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除小程序设置
 */
export async function deleteByIdsWxApp(
  ids: WxAppId[],
): Promise<number> {
  
  const {
    deleteByIdsWxApp,
  } = await import("./wx_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsWxApp(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用小程序设置
 */
export async function enableByIdsWxApp(
  ids: WxAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsWxApp,
  } = await import("./wx_app.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsWxApp.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsWxApp(ids, is_enabled);
  
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
    lockByIdsWxApp,
  } = await import("./wx_app.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsWxApp.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsWxApp(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原小程序设置
 */
export async function revertByIdsWxApp(
  ids: WxAppId[],
): Promise<number> {
  
  const {
    revertByIdsWxApp,
  } = await import("./wx_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsWxApp(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除小程序设置
 */
export async function forceDeleteByIdsWxApp(
  ids: WxAppId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsWxApp,
  } = await import("./wx_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsWxApp(ids);
  
  return res;
}

/**
 * 查找 小程序设置 order_by 字段的最大值
 */
export async function findLastOrderByWxApp(): Promise<number> {
  
  const {
    findLastOrderByWxApp,
  } = await import("./wx_app.service.ts");
  
  const res = findLastOrderByWxApp();
  
  return res;
}
