import {
  set_is_tran,
} from "/lib/context.ts";

import Decimal from "decimal.js";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortCardConsume,
} from "./card_consume.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./card_consume.model.ts";

/**
 * 根据条件查找会员卡消费记录总数
 */
export async function findCountCardConsume(
  search?: CardConsumeSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./card_consume.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找会员卡消费记录列表
 */
export async function findAllCardConsume(
  search?: CardConsumeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CardConsumeModel[]> {
  
  const {
    findAll,
  } = await import("./card_consume.service.ts");
  
  checkSortCardConsume(sort);
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取会员卡消费记录字段注释
 */
export async function getFieldCommentsCardConsume(): Promise<CardConsumeFieldComment> {
  const { getFieldComments } = await import("./card_consume.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个会员卡消费记录
 */
export async function findOneCardConsume(
  search?: CardConsumeSearch,
  sort?: SortInput[],
): Promise<CardConsumeModel | undefined> {
  
  const {
    findOne,
  } = await import("./card_consume.service.ts");
  
  checkSortCardConsume(sort);
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找会员卡消费记录
 */
export async function findByIdCardConsume(
  id: CardConsumeId,
): Promise<CardConsumeModel | undefined> {
  
  const {
    findById,
  } = await import("./card_consume.service.ts");
  
  const res = await findById(id);
  
  return res;
}

/**
 * 根据 ids 删除会员卡消费记录
 */
export async function deleteByIdsCardConsume(
  ids: CardConsumeId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./card_consume.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原会员卡消费记录
 */
export async function revertByIdsCardConsume(
  ids: CardConsumeId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./card_consume.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除会员卡消费记录
 */
export async function forceDeleteByIdsCardConsume(
  ids: CardConsumeId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./card_consume.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  const res = await forceDeleteByIds(ids);
  return res;
}