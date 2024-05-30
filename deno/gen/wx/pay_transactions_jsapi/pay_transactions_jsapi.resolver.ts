import {
  useContext,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

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
    findCount,
  } = await import("./pay_transactions_jsapi.service.ts");
  
  const res = await findCount(search);
  return res;
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
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取微信JSAPI下单字段注释
 */
export async function getFieldCommentsPayTransactionsJsapi(): Promise<PayTransactionsJsapiFieldComment> {
  const { getFieldComments } = await import("./pay_transactions_jsapi.service.ts");
  const res = await getFieldComments();
  return res;
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
  
  const res = await findOne(search, sort);
  return res;
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
  
  const res = await findById(id);
  
  return res;
}
