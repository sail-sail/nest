import {
  useContext,
} from "/lib/context.ts";

import Decimal from "decimal.js";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  CardRechargeModel,
  CardRechargeSearch,
  CardRechargeFieldComment,
  CardRechargeId,
} from "./card_recharge.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找会员卡充值记录总数
 */
export async function findCountCardRecharge(
  search?: CardRechargeSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./card_recharge.service.ts");
  
  const res = await findCount(search);
  return res;
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
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取会员卡充值记录字段注释
 */
export async function getFieldCommentsCardRecharge(): Promise<CardRechargeFieldComment> {
  const { getFieldComments } = await import("./card_recharge.service.ts");
  const res = await getFieldComments();
  return res;
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
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找会员卡充值记录
 */
export async function findByIdCardRecharge(
  id: CardRechargeId,
): Promise<CardRechargeModel | undefined> {
  const { findById } = await import("./card_recharge.service.ts");
  const res = await findById(id);
  return res;
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/card_recharge",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/card_recharge",
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
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wshop/card_recharge",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./card_recharge.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
