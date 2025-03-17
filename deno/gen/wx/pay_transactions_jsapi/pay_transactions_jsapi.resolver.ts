import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortPayTransactionsJsapi,
} from "./pay_transactions_jsapi.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./pay_transactions_jsapi.model.ts";

/**
 * 根据条件查找微信JSAPI下单总数
 */
export async function findCountPayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找微信JSAPI下单列表
 */
export async function findAllPayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<PayTransactionsJsapiModel[]> {
  
  const {
    findAll,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  checkSortPayTransactionsJsapi(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取微信JSAPI下单字段注释
 */
export async function getFieldCommentsPayTransactionsJsapi(): Promise<PayTransactionsJsapiFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个微信JSAPI下单
 */
export async function findOnePayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch,
  sort?: SortInput[],
): Promise<PayTransactionsJsapiModel | undefined> {
  
  const {
    findOne,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  checkSortPayTransactionsJsapi(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找微信JSAPI下单
 */
export async function findByIdPayTransactionsJsapi(
  id: PayTransactionsJsapiId,
): Promise<PayTransactionsJsapiModel | undefined> {
  
  const {
    findById,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找微信JSAPI下单
 */
export async function findByIdsPayTransactionsJsapi(
  ids: PayTransactionsJsapiId[],
): Promise<PayTransactionsJsapiModel[]> {
  
  const {
    findByIds,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}
