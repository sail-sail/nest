import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wxo_app_tokenDao from "./wxo_app_token.dao.ts";

async function setSearchQuery(
  search: WxoAppTokenSearch,
) {
}

/**
 * 根据条件查找小程序接口凭据总数
 * @param {WxoAppTokenSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxoAppTokenSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wxo_app_tokenDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找小程序接口凭据列表
 * @param {WxoAppTokenSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<WxoAppTokenModel[]>} 
 */
export async function findAll(
  search?: WxoAppTokenSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<WxoAppTokenModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: WxoAppTokenModel[] = await wxo_app_tokenDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxoAppTokenInput,
) {
  const data = await wxo_app_tokenDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个小程序接口凭据
 * @param {WxoAppTokenSearch} search? 搜索条件
 */
export async function findOne(
  search?: WxoAppTokenSearch,
  sort?: SortInput|SortInput[],
): Promise<WxoAppTokenModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await wxo_app_tokenDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找小程序接口凭据
 * @param {WxoAppTokenId} id
 */
export async function findById(
  id?: WxoAppTokenId | null,
): Promise<WxoAppTokenModel | undefined> {
  const model = await wxo_app_tokenDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找小程序接口凭据是否存在
 * @param {WxoAppTokenSearch} search? 搜索条件
 */
export async function exist(
  search?: WxoAppTokenSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wxo_app_tokenDao.exist(search);
  return data;
}

/**
 * 根据 id 查找小程序接口凭据是否存在
 * @param {WxoAppTokenId} id
 */
export async function existById(
  id?: WxoAppTokenId | null,
): Promise<boolean> {
  const data = await wxo_app_tokenDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验小程序接口凭据
 * @param input 
 */
export async function validate(
  input: WxoAppTokenInput,
): Promise<void> {
  const data = await wxo_app_tokenDao.validate(input);
  return data;
}

/**
 * 创建小程序接口凭据
 * @param {WxoAppTokenInput} input
 * @return {Promise<WxoAppTokenId>} id
 */
export async function create(
  input: WxoAppTokenInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxoAppTokenId> {
  const id = await wxo_app_tokenDao.create(input, options);
  return id;
}

/**
 * 批量创建小程序接口凭据
 * @param {WxoAppTokenInput[]} inputs
 * @return {Promise<WxoAppTokenId[]>} ids
 */
export async function creates(
  inputs: WxoAppTokenInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxoAppTokenId[]> {
  const ids = await wxo_app_tokenDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改小程序接口凭据
 * @param {WxoAppTokenId} id
 * @param {WxoAppTokenInput} input
 * @return {Promise<WxoAppTokenId>}
 */
export async function updateById(
  id: WxoAppTokenId,
  input: WxoAppTokenInput,
): Promise<WxoAppTokenId> {
  
  const id2 = await wxo_app_tokenDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除小程序接口凭据
 * @param {WxoAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxoAppTokenId[],
): Promise<number> {
  
  const data = await wxo_app_tokenDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原小程序接口凭据
 * @param {WxoAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxoAppTokenId[],
): Promise<number> {
  const data = await wxo_app_tokenDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除小程序接口凭据
 * @param {WxoAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxoAppTokenId[],
): Promise<number> {
  const data = await wxo_app_tokenDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取小程序接口凭据字段注释
 */
export async function getFieldComments(): Promise<WxoAppTokenFieldComment> {
  const data = await wxo_app_tokenDao.getFieldComments();
  return data;
}
