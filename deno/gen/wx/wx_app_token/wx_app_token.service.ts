import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wx_app_tokenDao from "./wx_app_token.dao.ts";

async function setSearchQuery(
  _search: WxAppTokenSearch,
) {
  
}

/**
 * 根据条件查找小程序接口凭据总数
 */
export async function findCountWxAppToken(
  search?: WxAppTokenSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_token_num = await wx_app_tokenDao.findCountWxAppToken(search);
  
  return wx_app_token_num;
}

/**
 * 根据搜索条件和分页查找小程序接口凭据列表
 */
export async function findAllWxAppToken(
  search?: WxAppTokenSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxAppTokenModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_token_models = await wx_app_tokenDao.findAllWxAppToken(search, page, sort);
  
  return wx_app_token_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxAppToken(
  input: WxAppTokenInput,
): Promise<void> {
  await wx_app_tokenDao.setIdByLblWxAppToken(input);
}

/**
 * 根据条件查找第一个小程序接口凭据
 */
export async function findOneWxAppToken(
  search?: WxAppTokenSearch,
  sort?: SortInput[],
): Promise<WxAppTokenModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_token_model = await wx_app_tokenDao.findOneWxAppToken(search, sort);
  
  return wx_app_token_model;
}

/**
 * 根据条件查找第一个小程序接口凭据, 如果不存在则抛错
 */
export async function findOneOkWxAppToken(
  search?: WxAppTokenSearch,
  sort?: SortInput[],
): Promise<WxAppTokenModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_token_model = await wx_app_tokenDao.findOneOkWxAppToken(search, sort);
  
  return wx_app_token_model;
}

/**
 * 根据 id 查找小程序接口凭据
 */
export async function findByIdWxAppToken(
  wx_app_token_id: WxAppTokenId,
): Promise<WxAppTokenModel | undefined> {
  
  const wx_app_token_model = await wx_app_tokenDao.findByIdWxAppToken(wx_app_token_id);
  
  return wx_app_token_model;
}

/**
 * 根据 id 查找小程序接口凭据, 如果不存在则抛错
 */
export async function findByIdOkWxAppToken(
  wx_app_token_id: WxAppTokenId,
): Promise<WxAppTokenModel> {
  
  const wx_app_token_model = await wx_app_tokenDao.findByIdOkWxAppToken(wx_app_token_id);
  
  return wx_app_token_model;
}

/**
 * 根据 ids 查找小程序接口凭据
 */
export async function findByIdsWxAppToken(
  wx_app_token_ids: WxAppTokenId[],
): Promise<WxAppTokenModel[]> {
  
  const wx_app_token_models = await wx_app_tokenDao.findByIdsWxAppToken(wx_app_token_ids);
  
  return wx_app_token_models;
}

/**
 * 根据 ids 查找小程序接口凭据, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxAppToken(
  wx_app_token_ids: WxAppTokenId[],
): Promise<WxAppTokenModel[]> {
  
  const wx_app_token_models = await wx_app_tokenDao.findByIdsOkWxAppToken(wx_app_token_ids);
  
  return wx_app_token_models;
}

/**
 * 根据搜索条件查找小程序接口凭据是否存在
 */
export async function existWxAppToken(
  search?: WxAppTokenSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_token_exist = await wx_app_tokenDao.existWxAppToken(search);
  
  return wx_app_token_exist;
}

/**
 * 根据 id 查找小程序接口凭据是否存在
 */
export async function existByIdWxAppToken(
  wx_app_token_id?: WxAppTokenId | null,
): Promise<boolean> {
  
  const wx_app_token_exist = await wx_app_tokenDao.existByIdWxAppToken(wx_app_token_id);
  
  return wx_app_token_exist;
}

/**
 * 增加和修改时校验小程序接口凭据
 */
export async function validateWxAppToken(
  input: WxAppTokenInput,
): Promise<void> {
  await wx_app_tokenDao.validateWxAppToken(input);
}

/**
 * 批量创建小程序接口凭据
 */
export async function createsWxAppToken(
  inputs: WxAppTokenInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxAppTokenId[]> {
  const wx_app_token_ids = await wx_app_tokenDao.createsWxAppToken(inputs, options);
  
  return wx_app_token_ids;
}

/**
 * 根据 id 修改小程序接口凭据
 */
export async function updateByIdWxAppToken(
  wx_app_token_id: WxAppTokenId,
  input: WxAppTokenInput,
): Promise<WxAppTokenId> {
  
  const wx_app_token_id2 = await wx_app_tokenDao.updateByIdWxAppToken(wx_app_token_id, input);
  
  return wx_app_token_id2;
}

/** 校验小程序接口凭据是否存在 */
export async function validateOptionWxAppToken(
  model0?: WxAppTokenModel,
): Promise<WxAppTokenModel> {
  const wx_app_token_model = await wx_app_tokenDao.validateOptionWxAppToken(model0);
  return wx_app_token_model;
}

/**
 * 根据 ids 删除小程序接口凭据
 */
export async function deleteByIdsWxAppToken(
  wx_app_token_ids: WxAppTokenId[],
): Promise<number> {
  
  const wx_app_token_num = await wx_app_tokenDao.deleteByIdsWxAppToken(wx_app_token_ids);
  return wx_app_token_num;
}

/**
 * 根据 ids 还原小程序接口凭据
 */
export async function revertByIdsWxAppToken(
  wx_app_token_ids: WxAppTokenId[],
): Promise<number> {
  
  const wx_app_token_num = await wx_app_tokenDao.revertByIdsWxAppToken(wx_app_token_ids);
  
  return wx_app_token_num;
}

/**
 * 根据 ids 彻底删除小程序接口凭据
 */
export async function forceDeleteByIdsWxAppToken(
  wx_app_token_ids: WxAppTokenId[],
): Promise<number> {
  
  const wx_app_token_num = await wx_app_tokenDao.forceDeleteByIdsWxAppToken(wx_app_token_ids);
  
  return wx_app_token_num;
}

/**
 * 获取小程序接口凭据字段注释
 */
export async function getFieldCommentsWxAppToken(): Promise<WxAppTokenFieldComment> {
  const wx_app_token_fields = await wx_app_tokenDao.getFieldCommentsWxAppToken();
  return wx_app_token_fields;
}
