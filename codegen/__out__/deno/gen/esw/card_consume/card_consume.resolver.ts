import {
  useContext,
} from "/lib/context.ts";

import Decimal from "decimal.js";

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  CardConsumeInput,
  CardConsumeModel,
  CardConsumeSearch,
  CardConsumeFieldComment,
} from "./card_consume.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountCardConsume(
  search?: CardConsumeSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./card_consume.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllCardConsume(
  search?: CardConsumeSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<CardConsumeModel[]> {
  
  const {
    findAll,
  } = await import("./card_consume.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsCardConsume(): Promise<CardConsumeFieldComment> {
  const { getFieldComments } = await import("./card_consume.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneCardConsume(
  search?: CardConsumeSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<CardConsumeModel | undefined> {
  
  const {
    findOne,
  } = await import("./card_consume.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdCardConsume(
  id: string,
): Promise<CardConsumeModel | undefined> {
  const { findById } = await import("./card_consume.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsCardConsume(
  ids: string[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./card_consume.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/card_consume",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsCardConsume(
  ids: string[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./card_consume.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/card_consume",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsCardConsume(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/esw/card_consume",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./card_consume.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
