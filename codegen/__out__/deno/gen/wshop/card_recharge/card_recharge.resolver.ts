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
    findCount,
  } = await import("./card_recharge.service.ts");
  
  const num = await findCount(search);
  
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
    findAll,
  } = await import("./card_recharge.service.ts");
  
  checkSortCardRecharge(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取会员卡充值记录字段注释
 */
export async function getFieldCommentsCardRecharge(): Promise<CardRechargeFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./card_recharge.service.ts");
  
  const field_comment = await getFieldComments();
  
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
    findOne,
  } = await import("./card_recharge.service.ts");
  
  checkSortCardRecharge(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找会员卡充值记录
 */
export async function findByIdCardRecharge(
  id: CardRechargeId,
): Promise<CardRechargeModel | undefined> {
  
  const {
    findById,
  } = await import("./card_recharge.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找会员卡充值记录
 */
export async function findByIdsCardRecharge(
  ids: CardRechargeId[],
): Promise<CardRechargeModel[]> {
  
  const {
    findByIds,
  } = await import("./card_recharge.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 删除会员卡充值记录
 */
export async function deleteByIdsCardRecharge(
  ids: CardRechargeId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./card_recharge.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原会员卡充值记录
 */
export async function revertByIdsCardRecharge(
  ids: CardRechargeId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./card_recharge.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除会员卡充值记录
 */
export async function forceDeleteByIdsCardRecharge(
  ids: CardRechargeId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./card_recharge.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
