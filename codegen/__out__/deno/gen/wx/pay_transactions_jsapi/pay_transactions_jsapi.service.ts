import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as pay_transactions_jsapiDao from "./pay_transactions_jsapi.dao.ts";

async function setSearchQuery(
  _search: PayTransactionsJsapiSearch,
) {
  
}

/**
 * 根据条件查找微信JSAPI下单总数
 */
export async function findCountPayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pay_transactions_jsapi_num = await pay_transactions_jsapiDao.findCountPayTransactionsJsapi(search);
  
  return pay_transactions_jsapi_num;
}

/**
 * 根据搜索条件和分页查找微信JSAPI下单列表
 */
export async function findAllPayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<PayTransactionsJsapiModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pay_transactions_jsapi_models = await pay_transactions_jsapiDao.findAllPayTransactionsJsapi(search, page, sort);
  
  return pay_transactions_jsapi_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblPayTransactionsJsapi(
  input: PayTransactionsJsapiInput,
): Promise<void> {
  await pay_transactions_jsapiDao.setIdByLblPayTransactionsJsapi(input);
}

/**
 * 根据条件查找第一个微信JSAPI下单
 */
export async function findOnePayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch,
  sort?: SortInput[],
): Promise<PayTransactionsJsapiModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pay_transactions_jsapi_model = await pay_transactions_jsapiDao.findOnePayTransactionsJsapi(search, sort);
  
  return pay_transactions_jsapi_model;
}

/**
 * 根据 id 查找微信JSAPI下单
 */
export async function findByIdPayTransactionsJsapi(
  pay_transactions_jsapi_id?: PayTransactionsJsapiId | null,
): Promise<PayTransactionsJsapiModel | undefined> {
  
  const pay_transactions_jsapi_model = await pay_transactions_jsapiDao.findByIdPayTransactionsJsapi(pay_transactions_jsapi_id);
  
  return pay_transactions_jsapi_model;
}

/**
 * 根据 ids 查找微信JSAPI下单
 */
export async function findByIdsPayTransactionsJsapi(
  pay_transactions_jsapi_ids: PayTransactionsJsapiId[],
): Promise<PayTransactionsJsapiModel[]> {
  
  const pay_transactions_jsapi_models = await pay_transactions_jsapiDao.findByIdsPayTransactionsJsapi(pay_transactions_jsapi_ids);
  
  return pay_transactions_jsapi_models;
}

/**
 * 根据搜索条件查找微信JSAPI下单是否存在
 */
export async function existPayTransactionsJsapi(
  search?: PayTransactionsJsapiSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pay_transactions_jsapi_exist = await pay_transactions_jsapiDao.existPayTransactionsJsapi(search);
  
  return pay_transactions_jsapi_exist;
}

/**
 * 根据 id 查找微信JSAPI下单是否存在
 */
export async function existByIdPayTransactionsJsapi(
  pay_transactions_jsapi_id?: PayTransactionsJsapiId | null,
): Promise<boolean> {
  
  const pay_transactions_jsapi_exist = await pay_transactions_jsapiDao.existByIdPayTransactionsJsapi(pay_transactions_jsapi_id);
  
  return pay_transactions_jsapi_exist;
}

/**
 * 增加和修改时校验微信JSAPI下单
 */
export async function validatePayTransactionsJsapi(
  input: PayTransactionsJsapiInput,
): Promise<void> {
  await pay_transactions_jsapiDao.validatePayTransactionsJsapi(input);
}

/**
 * 批量创建微信JSAPI下单
 */
export async function createsPayTransactionsJsapi(
  inputs: PayTransactionsJsapiInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<PayTransactionsJsapiId[]> {
  const pay_transactions_jsapi_ids = await pay_transactions_jsapiDao.createsPayTransactionsJsapi(inputs, options);
  
  return pay_transactions_jsapi_ids;
}

/**
 * 根据 id 修改微信JSAPI下单
 */
export async function updateByIdPayTransactionsJsapi(
  pay_transactions_jsapi_id: PayTransactionsJsapiId,
  input: PayTransactionsJsapiInput,
): Promise<PayTransactionsJsapiId> {
  
  const pay_transactions_jsapi_id2 = await pay_transactions_jsapiDao.updateByIdPayTransactionsJsapi(pay_transactions_jsapi_id, input);
  
  return pay_transactions_jsapi_id2;
}

/** 校验微信JSAPI下单是否存在 */
export async function validateOptionPayTransactionsJsapi(
  model0?: PayTransactionsJsapiModel,
): Promise<PayTransactionsJsapiModel> {
  const pay_transactions_jsapi_model = await pay_transactions_jsapiDao.validateOptionPayTransactionsJsapi(model0);
  return pay_transactions_jsapi_model;
}

/**
 * 根据 ids 删除微信JSAPI下单
 */
export async function deleteByIdsPayTransactionsJsapi(
  pay_transactions_jsapi_ids: PayTransactionsJsapiId[],
): Promise<number> {
  
  const pay_transactions_jsapi_num = await pay_transactions_jsapiDao.deleteByIdsPayTransactionsJsapi(pay_transactions_jsapi_ids);
  return pay_transactions_jsapi_num;
}

/**
 * 根据 ids 还原微信JSAPI下单
 */
export async function revertByIdsPayTransactionsJsapi(
  pay_transactions_jsapi_ids: PayTransactionsJsapiId[],
): Promise<number> {
  
  const pay_transactions_jsapi_num = await pay_transactions_jsapiDao.revertByIdsPayTransactionsJsapi(pay_transactions_jsapi_ids);
  
  return pay_transactions_jsapi_num;
}

/**
 * 根据 ids 彻底删除微信JSAPI下单
 */
export async function forceDeleteByIdsPayTransactionsJsapi(
  pay_transactions_jsapi_ids: PayTransactionsJsapiId[],
): Promise<number> {
  
  const pay_transactions_jsapi_num = await pay_transactions_jsapiDao.forceDeleteByIdsPayTransactionsJsapi(pay_transactions_jsapi_ids);
  
  return pay_transactions_jsapi_num;
}

/**
 * 获取微信JSAPI下单字段注释
 */
export async function getFieldCommentsPayTransactionsJsapi(): Promise<PayTransactionsJsapiFieldComment> {
  const pay_transactions_jsapi_fields = await pay_transactions_jsapiDao.getFieldCommentsPayTransactionsJsapi();
  return pay_transactions_jsapi_fields;
}
