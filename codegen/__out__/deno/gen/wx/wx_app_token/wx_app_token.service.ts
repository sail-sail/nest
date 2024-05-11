import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wx_app_tokenDao from "./wx_app_token.dao.ts";

/**
 * 根据条件查找小程序接口凭据总数
 * @param {WxAppTokenSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxAppTokenSearch,
): Promise<number> {
  search = search || { };
  const data = await wx_app_tokenDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找小程序接口凭据列表
 * @param {WxAppTokenSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<WxAppTokenModel[]>} 
 */
export async function findAll(
  search?: WxAppTokenSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<WxAppTokenModel[]> {
  search = search || { };
  const models: WxAppTokenModel[] = await wx_app_tokenDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxAppTokenInput,
) {
  const data = await wx_app_tokenDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个小程序接口凭据
 * @param {WxAppTokenSearch} search? 搜索条件
 */
export async function findOne(
  search?: WxAppTokenSearch,
  sort?: SortInput|SortInput[],
): Promise<WxAppTokenModel | undefined> {
  search = search || { };
  const model = await wx_app_tokenDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找小程序接口凭据
 * @param {WxAppTokenId} id
 */
export async function findById(
  id?: WxAppTokenId | null,
): Promise<WxAppTokenModel | undefined> {
  const model = await wx_app_tokenDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找小程序接口凭据是否存在
 * @param {WxAppTokenSearch} search? 搜索条件
 */
export async function exist(
  search?: WxAppTokenSearch,
): Promise<boolean> {
  search = search || { };
  const data = await wx_app_tokenDao.exist(search);
  return data;
}

/**
 * 根据 id 查找小程序接口凭据是否存在
 * @param {WxAppTokenId} id
 */
export async function existById(
  id?: WxAppTokenId | null,
): Promise<boolean> {
  const data = await wx_app_tokenDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验小程序接口凭据
 * @param input 
 */
export async function validate(
  input: WxAppTokenInput,
): Promise<void> {
  const data = await wx_app_tokenDao.validate(input);
  return data;
}

/**
 * 批量创建小程序接口凭据
 * @param {WxAppTokenInput[]} inputs
 * @return {Promise<WxAppTokenId[]>} ids
 */
export async function creates(
  inputs: WxAppTokenInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxAppTokenId[]> {
  const ids = await wx_app_tokenDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改小程序接口凭据
 * @param {WxAppTokenId} id
 * @param {WxAppTokenInput} input
 * @return {Promise<WxAppTokenId>}
 */
export async function updateById(
  id: WxAppTokenId,
  input: WxAppTokenInput,
): Promise<WxAppTokenId> {
  
  const id2: WxAppTokenId = await wx_app_tokenDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除小程序接口凭据
 * @param {WxAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxAppTokenId[],
): Promise<number> {
  
  const data = await wx_app_tokenDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原小程序接口凭据
 * @param {WxAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxAppTokenId[],
): Promise<number> {
  const data = await wx_app_tokenDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除小程序接口凭据
 * @param {WxAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxAppTokenId[],
): Promise<number> {
  const data = await wx_app_tokenDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取小程序接口凭据字段注释
 */
export async function getFieldComments(): Promise<WxAppTokenFieldComment> {
  const data = await wx_app_tokenDao.getFieldComments();
  return data;
}
