import {
  useContext,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  WxPayInput,
  WxPayModel,
  WxPaySearch,
  WxPayFieldComment,
  WxPayId,
} from "./wx_pay.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找微信支付设置总数
 */
export async function findCountWxPay(
  search?: WxPaySearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wx_pay.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找微信支付设置列表
 */
export async function findAllWxPay(
  search?: WxPaySearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxPayModel[]> {
  
  const {
    findAll,
  } = await import("./wx_pay.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取微信支付设置字段注释
 */
export async function getFieldCommentsWxPay(): Promise<WxPayFieldComment> {
  const { getFieldComments } = await import("./wx_pay.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个微信支付设置
 */
export async function findOneWxPay(
  search?: WxPaySearch,
  sort?: SortInput[],
): Promise<WxPayModel | undefined> {
  
  const {
    findOne,
  } = await import("./wx_pay.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找微信支付设置
 */
export async function findByIdWxPay(
  id: WxPayId,
): Promise<WxPayModel | undefined> {
  const { findById } = await import("./wx_pay.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建微信支付设置
 */
export async function createWxPay(
  input: WxPayInput,
  unique_type?: UniqueType,
): Promise<WxPayId> {
  
  input.id = undefined;
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./wx_pay.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/wx/wx_pay",
    "add",
  );
  const uniqueType = unique_type;
  const id: WxPayId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改微信支付设置
 */
export async function updateByIdWxPay(
  id: WxPayId,
  input: WxPayInput,
): Promise<WxPayId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wx_pay.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/wx/wx_pay",
    "edit",
  );
  const id2: WxPayId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除微信支付设置
 */
export async function deleteByIdsWxPay(
  ids: WxPayId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wx_pay.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_pay",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用微信支付设置
 */
export async function enableByIdsWxPay(
  ids: WxPayId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./wx_pay.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsWxPay.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/wx/wx_pay",
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁微信支付设置
 */
export async function lockByIdsWxPay(
  ids: WxPayId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./wx_pay.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsWxPay.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/wx/wx_pay",
    "edit",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原微信支付设置
 */
export async function revertByIdsWxPay(
  ids: WxPayId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wx_pay.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_pay",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除微信支付设置
 */
export async function forceDeleteByIdsWxPay(
  ids: WxPayId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_pay",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./wx_pay.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 微信支付设置 order_by 字段的最大值
 */
export async function findLastOrderByWxPay(): Promise<number> {
  const { findLastOrderBy } = await import("./wx_pay.service.ts");
  const res = findLastOrderBy();
  return res;
}