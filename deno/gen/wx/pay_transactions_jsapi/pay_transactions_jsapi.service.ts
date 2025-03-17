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
export async function findCount(
  search?: PayTransactionsJsapiSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pay_transactions_jsapi_num = await pay_transactions_jsapiDao.findCount(search);
  
  return pay_transactions_jsapi_num;
}

/**
 * 根据搜索条件和分页查找微信JSAPI下单列表
 */
export async function findAll(
  search?: PayTransactionsJsapiSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<PayTransactionsJsapiModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pay_transactions_jsapi_models = await pay_transactions_jsapiDao.findAll(search, page, sort);
  
  return pay_transactions_jsapi_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: PayTransactionsJsapiInput,
): Promise<void> {
  await pay_transactions_jsapiDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个微信JSAPI下单
 */
export async function findOne(
  search?: PayTransactionsJsapiSearch,
  sort?: SortInput[],
): Promise<PayTransactionsJsapiModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pay_transactions_jsapi_model = await pay_transactions_jsapiDao.findOne(search, sort);
  
  return pay_transactions_jsapi_model;
}

/**
 * 根据 id 查找微信JSAPI下单
 */
export async function findById(
  pay_transactions_jsapi_id?: PayTransactionsJsapiId | null,
): Promise<PayTransactionsJsapiModel | undefined> {
  
  const pay_transactions_jsapi_model = await pay_transactions_jsapiDao.findById(pay_transactions_jsapi_id);
  
  return pay_transactions_jsapi_model;
}

/**
 * 根据 ids 查找微信JSAPI下单
 */
export async function findByIds(
  pay_transactions_jsapi_ids: PayTransactionsJsapiId[],
): Promise<PayTransactionsJsapiModel[]> {
  
  const pay_transactions_jsapi_models = await pay_transactions_jsapiDao.findByIds(pay_transactions_jsapi_ids);
  
  return pay_transactions_jsapi_models;
}

/**
 * 根据搜索条件查找微信JSAPI下单是否存在
 */
export async function exist(
  search?: PayTransactionsJsapiSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pay_transactions_jsapi_exist = await pay_transactions_jsapiDao.exist(search);
  
  return pay_transactions_jsapi_exist;
}

/**
 * 根据 id 查找微信JSAPI下单是否存在
 */
export async function existById(
  pay_transactions_jsapi_id?: PayTransactionsJsapiId | null,
): Promise<boolean> {
  
  const pay_transactions_jsapi_exist = await pay_transactions_jsapiDao.existById(pay_transactions_jsapi_id);
  
  return pay_transactions_jsapi_exist;
}

/**
 * 增加和修改时校验微信JSAPI下单
 */
export async function validate(
  input: PayTransactionsJsapiInput,
): Promise<void> {
  await pay_transactions_jsapiDao.validate(input);
}

/**
 * 批量创建微信JSAPI下单
 */
export async function creates(
  inputs: PayTransactionsJsapiInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<PayTransactionsJsapiId[]> {
  const pay_transactions_jsapi_ids = await pay_transactions_jsapiDao.creates(inputs, options);
  
  return pay_transactions_jsapi_ids;
}

/**
 * 根据 id 修改微信JSAPI下单
 */
export async function updateById(
  pay_transactions_jsapi_id: PayTransactionsJsapiId,
  input: PayTransactionsJsapiInput,
): Promise<PayTransactionsJsapiId> {
  
  const pay_transactions_jsapi_id2 = await pay_transactions_jsapiDao.updateById(pay_transactions_jsapi_id, input);
  
  return pay_transactions_jsapi_id2;
}

/** 校验微信JSAPI下单是否存在 */
export async function validateOption(
  model0?: PayTransactionsJsapiModel,
): Promise<PayTransactionsJsapiModel> {
  const pay_transactions_jsapi_model = await pay_transactions_jsapiDao.validateOption(model0);
  return pay_transactions_jsapi_model;
}

/**
 * 根据 ids 删除微信JSAPI下单
 */
export async function deleteByIds(
  pay_transactions_jsapi_ids: PayTransactionsJsapiId[],
): Promise<number> {
  
  const pay_transactions_jsapi_num = await pay_transactions_jsapiDao.deleteByIds(pay_transactions_jsapi_ids);
  return pay_transactions_jsapi_num;
}

/**
 * 根据 ids 还原微信JSAPI下单
 */
export async function revertByIds(
  pay_transactions_jsapi_ids: PayTransactionsJsapiId[],
): Promise<number> {
  
  const pay_transactions_jsapi_num = await pay_transactions_jsapiDao.revertByIds(pay_transactions_jsapi_ids);
  
  return pay_transactions_jsapi_num;
}

/**
 * 根据 ids 彻底删除微信JSAPI下单
 */
export async function forceDeleteByIds(
  pay_transactions_jsapi_ids: PayTransactionsJsapiId[],
): Promise<number> {
  
  const pay_transactions_jsapi_num = await pay_transactions_jsapiDao.forceDeleteByIds(pay_transactions_jsapi_ids);
  
  return pay_transactions_jsapi_num;
}

/**
 * 获取微信JSAPI下单字段注释
 */
export async function getFieldComments(): Promise<PayTransactionsJsapiFieldComment> {
  const pay_transactions_jsapi_fields = await pay_transactions_jsapiDao.getFieldComments();
  return pay_transactions_jsapi_fields;
}
