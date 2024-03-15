import {
  useContext,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  WxAppInput,
  WxAppModel,
  WxAppSearch,
  WxAppFieldComment,
  WxAppId,
} from "./wx_app.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

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
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找小程序设置
 */
export async function findByIdWxApp(
  id: WxAppId,
): Promise<WxAppModel | undefined> {
  const { findById } = await import("./wx_app.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建小程序设置
 */
export async function createWxApp(
  input: WxAppInput,
  unique_type?: UniqueType,
): Promise<WxAppId> {
  
  input.id = undefined;
  
  input.create_usr_id = undefined;
  input.create_usr_id_lbl = undefined;
  
  input.create_time = undefined;
  input.create_time_lbl = undefined;
  
  input.update_usr_id = undefined;
  input.update_usr_id_lbl = undefined;
  
  input.update_time = undefined;
  input.update_time_lbl = undefined;
  
  input.is_deleted = undefined;
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./wx_app.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/wx/wx_app",
    "add",
  );
  const uniqueType = unique_type;
  const id: WxAppId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改小程序设置
 */
export async function updateByIdWxApp(
  id: WxAppId,
  input: WxAppInput,
): Promise<WxAppId> {
  
  input.id = undefined;
  
  input.create_usr_id = undefined;
  input.create_usr_id_lbl = undefined;
  
  input.create_time = undefined;
  input.create_time_lbl = undefined;
  
  input.update_usr_id = undefined;
  input.update_usr_id_lbl = undefined;
  
  input.update_time = undefined;
  input.update_time_lbl = undefined;
  
  input.is_deleted = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wx_app.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/wx/wx_app",
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_app",
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
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsWxApp.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/wx/wx_app",
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
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsWxApp.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/wx/wx_app",
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_app",
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
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_app",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./wx_app.service.ts");
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
