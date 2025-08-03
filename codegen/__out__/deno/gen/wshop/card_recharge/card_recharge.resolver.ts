import {
  set_is_tran,
} from "/lib/context.ts";

import Decimal from "decimal.js";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortCardRecharge,
} from "./card_recharge.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./card_recharge.model.ts";

/**
 * 根据条件查找会员卡充值记录总数
 */
export async function findCountCardRecharge(
  search?: CardRechargeSearch,
): Promise<number> {
  
  const {
    findCountCardRecharge,
  } = await import("./card_recharge.service.ts");
  
  const num = await findCountCardRecharge(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找会员卡充值记录列表
 */
export async function findAllCardRecharge(
  search?: CardRechargeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CardRechargeModel[]> {
  
  const {
    findAllCardRecharge,
  } = await import("./card_recharge.service.ts");
  
  checkSortCardRecharge(sort);
  
  const models = await findAllCardRecharge(search, page, sort);
  
  return models;
}

/**
 * 获取会员卡充值记录字段注释
 */
export async function getFieldCommentsCardRecharge(): Promise<CardRechargeFieldComment> {
  
  const {
    getFieldCommentsCardRecharge,
  } = await import("./card_recharge.service.ts");
  
  const field_comment = await getFieldCommentsCardRecharge();
  
  return field_comment;
}

/**
 * 根据条件查找第一个会员卡充值记录
 */
export async function findOneCardRecharge(
  search?: CardRechargeSearch,
  sort?: SortInput[],
): Promise<CardRechargeModel | undefined> {
  
  const {
    findOneCardRecharge,
  } = await import("./card_recharge.service.ts");
  
  checkSortCardRecharge(sort);
  
  const model = await findOneCardRecharge(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个会员卡充值记录, 如果不存在则抛错
 */
export async function findOneOkCardRecharge(
  search?: CardRechargeSearch,
  sort?: SortInput[],
): Promise<CardRechargeModel> {
  
  const {
    findOneOkCardRecharge,
  } = await import("./card_recharge.service.ts");
  
  checkSortCardRecharge(sort);
  
  const model = await findOneOkCardRecharge(search, sort);
  
  return model;
}

/**
 * 根据 id 查找会员卡充值记录
 */
export async function findByIdCardRecharge(
  id: CardRechargeId,
): Promise<CardRechargeModel | undefined> {
  
  const {
    findByIdCardRecharge,
  } = await import("./card_recharge.service.ts");
  
  const model = await findByIdCardRecharge(id);
  
  return model;
}

/**
 * 根据 id 查找会员卡充值记录, 如果不存在则抛错
 */
export async function findByIdOkCardRecharge(
  id: CardRechargeId,
): Promise<CardRechargeModel | undefined> {
  
  const {
    findByIdOkCardRecharge,
  } = await import("./card_recharge.service.ts");
  
  const model = await findByIdOkCardRecharge(id);
  
  return model;
}

/**
 * 根据 ids 查找会员卡充值记录
 */
export async function findByIdsCardRecharge(
  ids: CardRechargeId[],
): Promise<CardRechargeModel[]> {
  
  const {
    findByIdsCardRecharge,
  } = await import("./card_recharge.service.ts");
  
  const models = await findByIdsCardRecharge(ids);
  
  return models;
}

/**
 * 根据 ids 查找会员卡充值记录, 出现查询不到的 id 则报错
 */
export async function findByIdsOkCardRecharge(
  ids: CardRechargeId[],
): Promise<CardRechargeModel[]> {
  
  const {
    findByIdsOkCardRecharge,
  } = await import("./card_recharge.service.ts");
  
  const models = await findByIdsOkCardRecharge(ids);
  
  return models;
}

/**
 * 根据 ids 删除会员卡充值记录
 */
export async function deleteByIdsCardRecharge(
  ids: CardRechargeId[],
): Promise<number> {
  
  const {
    deleteByIdsCardRecharge,
  } = await import("./card_recharge.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsCardRecharge(ids);
  
  return num;
}

/**
 * 根据 ids 还原会员卡充值记录
 */
export async function revertByIdsCardRecharge(
  ids: CardRechargeId[],
): Promise<number> {
  
  const {
    revertByIdsCardRecharge,
  } = await import("./card_recharge.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsCardRecharge(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除会员卡充值记录
 */
export async function forceDeleteByIdsCardRecharge(
  ids: CardRechargeId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsCardRecharge,
  } = await import("./card_recharge.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsCardRecharge(ids);
  
  return res;
}
