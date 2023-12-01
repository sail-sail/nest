import {
  useContext,
} from "/lib/context.ts";

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  PayTransactionsJsapiModel,
  PayTransactionsJsapiSearch,
  PayTransactionsJsapiFieldComment,
  PayTransactionsJsapiId,
} from "./pay_transactions_jsapi.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountPayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllPayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<PayTransactionsJsapiModel[]> {
  
  const {
    findAll,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsPayTransactionsJsapi(): Promise<PayTransactionsJsapiFieldComment> {
  const { getFieldComments } = await import("./pay_transactions_jsapi.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOnePayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<PayTransactionsJsapiModel | undefined> {
  
  const {
    findOne,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdPayTransactionsJsapi(
  id: PayTransactionsJsapiId,
): Promise<PayTransactionsJsapiModel | undefined> {
  const { findById } = await import("./pay_transactions_jsapi.service.ts");
  const res = await findById(id);
  return res;
}
