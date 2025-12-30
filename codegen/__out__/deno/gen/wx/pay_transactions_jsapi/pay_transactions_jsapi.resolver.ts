import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortPayTransactionsJsapi,
  intoInputPayTransactionsJsapi,
} from "./pay_transactions_jsapi.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找微信JSAPI下单总数
 */
export async function findCountPayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch,
): Promise<number> {
  
  const {
    findCountPayTransactionsJsapi,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const num = await findCountPayTransactionsJsapi(search);
  
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
    findAllPayTransactionsJsapi,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  checkSortPayTransactionsJsapi(sort);
  
  const models = await findAllPayTransactionsJsapi(search, page, sort);
  
  return models;
}

/**
 * 获取微信JSAPI下单字段注释
 */
export async function getFieldCommentsPayTransactionsJsapi(): Promise<PayTransactionsJsapiFieldComment> {
  
  const {
    getFieldCommentsPayTransactionsJsapi,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const field_comment = await getFieldCommentsPayTransactionsJsapi();
  
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
    findOnePayTransactionsJsapi,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  checkSortPayTransactionsJsapi(sort);
  
  const model = await findOnePayTransactionsJsapi(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个微信JSAPI下单, 如果不存在则抛错
 */
export async function findOneOkPayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch,
  sort?: SortInput[],
): Promise<PayTransactionsJsapiModel> {
  
  const {
    findOneOkPayTransactionsJsapi,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  checkSortPayTransactionsJsapi(sort);
  
  const model = await findOneOkPayTransactionsJsapi(search, sort);
  
  return model;
}

/**
 * 根据 id 查找微信JSAPI下单
 */
export async function findByIdPayTransactionsJsapi(
  id: PayTransactionsJsapiId,
): Promise<PayTransactionsJsapiModel | undefined> {
  
  const {
    findByIdPayTransactionsJsapi,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const model = await findByIdPayTransactionsJsapi(id);
  
  return model;
}

/**
 * 根据 id 查找微信JSAPI下单, 如果不存在则抛错
 */
export async function findByIdOkPayTransactionsJsapi(
  id: PayTransactionsJsapiId,
): Promise<PayTransactionsJsapiModel | undefined> {
  
  const {
    findByIdOkPayTransactionsJsapi,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const model = await findByIdOkPayTransactionsJsapi(id);
  
  return model;
}

/**
 * 根据 ids 查找微信JSAPI下单
 */
export async function findByIdsPayTransactionsJsapi(
  ids: PayTransactionsJsapiId[],
): Promise<PayTransactionsJsapiModel[]> {
  
  const {
    findByIdsPayTransactionsJsapi,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const models = await findByIdsPayTransactionsJsapi(ids);
  
  return models;
}

/**
 * 根据 ids 查找微信JSAPI下单, 出现查询不到的 id 则报错
 */
export async function findByIdsOkPayTransactionsJsapi(
  ids: PayTransactionsJsapiId[],
): Promise<PayTransactionsJsapiModel[]> {
  
  const {
    findByIdsOkPayTransactionsJsapi,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const models = await findByIdsOkPayTransactionsJsapi(ids);
  
  return models;
}
