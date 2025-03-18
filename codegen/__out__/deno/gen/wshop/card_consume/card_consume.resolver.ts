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
  
  const num = await findCount(search);
  
  return num;
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
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取会员卡消费记录字段注释
 */
export async function getFieldCommentsCardConsume(): Promise<CardConsumeFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./card_consume.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
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
  
  const model = await findOne(search, sort);
  
  return model;
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
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找会员卡消费记录
 */
export async function findByIdsCardConsume(
  ids: CardConsumeId[],
): Promise<CardConsumeModel[]> {
  
  const {
    findByIds,
  } = await import("./card_consume.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
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
  
  const num = await deleteByIds(ids);
  
  return num;
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
