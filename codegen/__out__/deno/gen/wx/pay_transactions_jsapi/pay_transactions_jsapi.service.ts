import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as pay_transactions_jsapiDao from "./pay_transactions_jsapi.dao.ts";

/**
 * 根据条件查找微信JSAPI下单总数
 * @param {PayTransactionsJsapiSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: PayTransactionsJsapiSearch,
): Promise<number> {
  search = search || { };
  const data = await pay_transactions_jsapiDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找微信JSAPI下单列表
 * @param {PayTransactionsJsapiSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<PayTransactionsJsapiModel[]>} 
 */
export async function findAll(
  search?: PayTransactionsJsapiSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<PayTransactionsJsapiModel[]> {
  search = search || { };
  const models: PayTransactionsJsapiModel[] = await pay_transactions_jsapiDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: PayTransactionsJsapiInput,
) {
  const data = await pay_transactions_jsapiDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个微信JSAPI下单
 * @param {PayTransactionsJsapiSearch} search? 搜索条件
 */
export async function findOne(
  search?: PayTransactionsJsapiSearch,
  sort?: SortInput|SortInput[],
): Promise<PayTransactionsJsapiModel | undefined> {
  search = search || { };
  const model = await pay_transactions_jsapiDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找微信JSAPI下单
 * @param {PayTransactionsJsapiId} id
 */
export async function findById(
  id?: PayTransactionsJsapiId | null,
): Promise<PayTransactionsJsapiModel | undefined> {
  const model = await pay_transactions_jsapiDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找微信JSAPI下单是否存在
 * @param {PayTransactionsJsapiSearch} search? 搜索条件
 */
export async function exist(
  search?: PayTransactionsJsapiSearch,
): Promise<boolean> {
  search = search || { };
  const data = await pay_transactions_jsapiDao.exist(search);
  return data;
}

/**
 * 根据 id 查找微信JSAPI下单是否存在
 * @param {PayTransactionsJsapiId} id
 */
export async function existById(
  id?: PayTransactionsJsapiId | null,
): Promise<boolean> {
  const data = await pay_transactions_jsapiDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验微信JSAPI下单
 * @param input 
 */
export async function validate(
  input: PayTransactionsJsapiInput,
): Promise<void> {
  const data = await pay_transactions_jsapiDao.validate(input);
  return data;
}

/**
 * 批量创建微信JSAPI下单
 * @param {PayTransactionsJsapiInput[]} inputs
 * @return {Promise<PayTransactionsJsapiId[]>} ids
 */
export async function creates(
  inputs: PayTransactionsJsapiInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<PayTransactionsJsapiId[]> {
  const ids = await pay_transactions_jsapiDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改微信JSAPI下单
 * @param {PayTransactionsJsapiId} id
 * @param {PayTransactionsJsapiInput} input
 * @return {Promise<PayTransactionsJsapiId>}
 */
export async function updateById(
  id: PayTransactionsJsapiId,
  input: PayTransactionsJsapiInput,
): Promise<PayTransactionsJsapiId> {
  
  const id2 = await pay_transactions_jsapiDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除微信JSAPI下单
 * @param {PayTransactionsJsapiId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: PayTransactionsJsapiId[],
): Promise<number> {
  
  const data = await pay_transactions_jsapiDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原微信JSAPI下单
 * @param {PayTransactionsJsapiId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: PayTransactionsJsapiId[],
): Promise<number> {
  const data = await pay_transactions_jsapiDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除微信JSAPI下单
 * @param {PayTransactionsJsapiId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: PayTransactionsJsapiId[],
): Promise<number> {
  const data = await pay_transactions_jsapiDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取微信JSAPI下单字段注释
 */
export async function getFieldComments(): Promise<PayTransactionsJsapiFieldComment> {
  const data = await pay_transactions_jsapiDao.getFieldComments();
  return data;
}
