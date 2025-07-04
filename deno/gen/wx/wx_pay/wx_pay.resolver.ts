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
  checkSortWxPay,
} from "./wx_pay.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./wx_pay.model.ts";

/**
 * 根据条件查找微信支付设置总数
 */
export async function findCountWxPay(
  search?: WxPaySearch,
): Promise<number> {
  
  const {
    findCountWxPay,
  } = await import("./wx_pay.service.ts");
  
  const num = await findCountWxPay(search);
  
  return num;
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
    findAllWxPay,
  } = await import("./wx_pay.service.ts");
  
  checkSortWxPay(sort);
  
  const models = await findAllWxPay(search, page, sort);
  
  return models;
}

/**
 * 获取微信支付设置字段注释
 */
export async function getFieldCommentsWxPay(): Promise<WxPayFieldComment> {
  
  const {
    getFieldCommentsWxPay,
  } = await import("./wx_pay.service.ts");
  
  const field_comment = await getFieldCommentsWxPay();
  
  return field_comment;
}

/**
 * 根据条件查找第一个微信支付设置
 */
export async function findOneWxPay(
  search?: WxPaySearch,
  sort?: SortInput[],
): Promise<WxPayModel | undefined> {
  
  const {
    findOneWxPay,
  } = await import("./wx_pay.service.ts");
  
  checkSortWxPay(sort);
  
  const model = await findOneWxPay(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个微信支付设置, 如果不存在则抛错
 */
export async function findOneOkWxPay(
  search?: WxPaySearch,
  sort?: SortInput[],
): Promise<WxPayModel> {
  
  const {
    findOneOkWxPay,
  } = await import("./wx_pay.service.ts");
  
  checkSortWxPay(sort);
  
  const model = await findOneOkWxPay(search, sort);
  
  return model;
}

/**
 * 根据 id 查找微信支付设置
 */
export async function findByIdWxPay(
  id: WxPayId,
): Promise<WxPayModel | undefined> {
  
  const {
    findByIdWxPay,
  } = await import("./wx_pay.service.ts");
  
  const model = await findByIdWxPay(id);
  
  return model;
}

/**
 * 根据 id 查找微信支付设置, 如果不存在则抛错
 */
export async function findByIdOkWxPay(
  id: WxPayId,
): Promise<WxPayModel | undefined> {
  
  const {
    findByIdOkWxPay,
  } = await import("./wx_pay.service.ts");
  
  const model = await findByIdOkWxPay(id);
  
  return model;
}

/**
 * 根据 ids 查找微信支付设置
 */
export async function findByIdsWxPay(
  ids: WxPayId[],
): Promise<WxPayModel[]> {
  
  const {
    findByIdsWxPay,
  } = await import("./wx_pay.service.ts");
  
  const models = await findByIdsWxPay(ids);
  
  return models;
}

/**
 * 根据 ids 查找微信支付设置, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxPay(
  ids: WxPayId[],
): Promise<WxPayModel[]> {
  
  const {
    findByIdsOkWxPay,
  } = await import("./wx_pay.service.ts");
  
  const models = await findByIdsOkWxPay(ids);
  
  return models;
}

/**
 * 批量创建微信支付设置
 */
export async function createsWxPay(
  inputs: WxPayInput[],
  unique_type?: UniqueType,
): Promise<WxPayId[]> {
  
  const {
    validateWxPay,
    setIdByLblWxPay,
    createsWxPay,
  } = await import("./wx_pay.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblWxPay(input);
    
    await validateWxPay(input);
  }
  const uniqueType = unique_type;
  const ids = await createsWxPay(inputs, { uniqueType });
  return ids;
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
    setIdByLblWxPay,
    updateByIdWxPay,
  } = await import("./wx_pay.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblWxPay(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxPayId = await updateByIdWxPay(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除微信支付设置
 */
export async function deleteByIdsWxPay(
  ids: WxPayId[],
): Promise<number> {
  
  const {
    deleteByIdsWxPay,
  } = await import("./wx_pay.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsWxPay(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用微信支付设置
 */
export async function enableByIdsWxPay(
  ids: WxPayId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsWxPay,
  } = await import("./wx_pay.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsWxPay.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsWxPay(ids, is_enabled);
  
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
    lockByIdsWxPay,
  } = await import("./wx_pay.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsWxPay.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsWxPay(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原微信支付设置
 */
export async function revertByIdsWxPay(
  ids: WxPayId[],
): Promise<number> {
  
  const {
    revertByIdsWxPay,
  } = await import("./wx_pay.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsWxPay(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除微信支付设置
 */
export async function forceDeleteByIdsWxPay(
  ids: WxPayId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsWxPay,
  } = await import("./wx_pay.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsWxPay(ids);
  
  return res;
}

/**
 * 查找 微信支付设置 order_by 字段的最大值
 */
export async function findLastOrderByWxPay(): Promise<number> {
  
  const {
    findLastOrderByWxPay,
  } = await import("./wx_pay.service.ts");
  
  const res = findLastOrderByWxPay();
  
  return res;
}
