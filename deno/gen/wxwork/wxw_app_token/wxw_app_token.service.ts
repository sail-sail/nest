

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  WxwAppTokenInput,
  WxwAppTokenModel,
  WxwAppTokenSearch,
  WxwAppTokenFieldComment,
  WxwAppTokenId,
} from "./wxw_app_token.model.ts";

import * as wxw_app_tokenDao from "./wxw_app_token.dao.ts";

/**
 * 根据条件查找企微应用接口凭据总数
 * @param {WxwAppTokenSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxwAppTokenSearch,
): Promise<number> {
  search = search || { };
  const data = await wxw_app_tokenDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找企微应用接口凭据列表
 * @param {WxwAppTokenSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<WxwAppTokenModel[]>} 
 */
export async function findAll(
  search?: WxwAppTokenSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<WxwAppTokenModel[]> {
  search = search || { };
  const models: WxwAppTokenModel[] = await wxw_app_tokenDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxwAppTokenInput,
) {
  const data = await wxw_app_tokenDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个企微应用接口凭据
 * @param {WxwAppTokenSearch} search? 搜索条件
 */
export async function findOne(
  search?: WxwAppTokenSearch,
  sort?: SortInput|SortInput[],
): Promise<WxwAppTokenModel | undefined> {
  search = search || { };
  const model = await wxw_app_tokenDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找企微应用接口凭据
 * @param {WxwAppTokenId} id
 */
export async function findById(
  id?: WxwAppTokenId | null,
): Promise<WxwAppTokenModel | undefined> {
  const model = await wxw_app_tokenDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找企微应用接口凭据是否存在
 * @param {WxwAppTokenSearch} search? 搜索条件
 */
export async function exist(
  search?: WxwAppTokenSearch,
): Promise<boolean> {
  search = search || { };
  const data = await wxw_app_tokenDao.exist(search);
  return data;
}

/**
 * 根据 id 查找企微应用接口凭据是否存在
 * @param {WxwAppTokenId} id
 */
export async function existById(
  id?: WxwAppTokenId | null,
): Promise<boolean> {
  const data = await wxw_app_tokenDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验企微应用接口凭据
 * @param input 
 */
export async function validate(
  input: WxwAppTokenInput,
): Promise<void> {
  const data = await wxw_app_tokenDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {WxwAppTokenInput} input
 * @return {Promise<WxwAppTokenId>} id
 */
export async function create(
  input: WxwAppTokenInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxwAppTokenId> {
  const id: WxwAppTokenId = await wxw_app_tokenDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改企微应用接口凭据
 * @param {WxwAppTokenId} id
 * @param {WxwAppTokenInput} input
 * @return {Promise<WxwAppTokenId>}
 */
export async function updateById(
  id: WxwAppTokenId,
  input: WxwAppTokenInput,
): Promise<WxwAppTokenId> {
  
  const id2: WxwAppTokenId = await wxw_app_tokenDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除企微应用接口凭据
 * @param {WxwAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxwAppTokenId[],
): Promise<number> {
  
  const data = await wxw_app_tokenDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原企微应用接口凭据
 * @param {WxwAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxwAppTokenId[],
): Promise<number> {
  const data = await wxw_app_tokenDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除企微应用接口凭据
 * @param {WxwAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxwAppTokenId[],
): Promise<number> {
  const data = await wxw_app_tokenDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取企微应用接口凭据字段注释
 */
export async function getFieldComments(): Promise<WxwAppTokenFieldComment> {
  const data = await wxw_app_tokenDao.getFieldComments();
  return data;
}