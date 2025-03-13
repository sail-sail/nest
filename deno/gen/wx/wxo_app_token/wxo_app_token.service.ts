import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wxo_app_tokenDao from "./wxo_app_token.dao.ts";

async function setSearchQuery(
  _search: WxoAppTokenSearch,
) {
  
}

/**
 * 根据条件查找小程序接口凭据总数
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
 */
export async function findAll(
  search?: WxoAppTokenSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxoAppTokenModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: WxoAppTokenModel[] = await wxo_app_tokenDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxoAppTokenInput,
) {
  const data = await wxo_app_tokenDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个小程序接口凭据
 */
export async function findOne(
  search?: WxoAppTokenSearch,
  sort?: SortInput[],
): Promise<WxoAppTokenModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await wxo_app_tokenDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找小程序接口凭据
 */
export async function findById(
  id?: WxoAppTokenId | null,
): Promise<WxoAppTokenModel | undefined> {
  const model = await wxo_app_tokenDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找小程序接口凭据是否存在
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
 */
export async function existById(
  id?: WxoAppTokenId | null,
): Promise<boolean> {
  const data = await wxo_app_tokenDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验小程序接口凭据
 */
export async function validate(
  input: WxoAppTokenInput,
): Promise<void> {
  const data = await wxo_app_tokenDao.validate(input);
  return data;
}

/**
 * 批量创建小程序接口凭据
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
 */
export async function updateById(
  id: WxoAppTokenId,
  input: WxoAppTokenInput,
): Promise<WxoAppTokenId> {
  
  const id2 = await wxo_app_tokenDao.updateById(id, input);
  return id2;
}

/** 校验小程序接口凭据是否存在 */
export async function validateOption(
  model0?: WxoAppTokenModel,
): Promise<WxoAppTokenModel> {
  const model = await wxo_app_tokenDao.validateOption(model0);
  return model;
}

/**
 * 根据 ids 删除小程序接口凭据
 */
export async function deleteByIds(
  ids: WxoAppTokenId[],
): Promise<number> {
  
  const data = await wxo_app_tokenDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原小程序接口凭据
 */
export async function revertByIds(
  ids: WxoAppTokenId[],
): Promise<number> {
  const data = await wxo_app_tokenDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除小程序接口凭据
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
