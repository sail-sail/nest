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
export async function findCountWxoAppToken(
  search?: WxoAppTokenSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_token_num = await wxo_app_tokenDao.findCountWxoAppToken(search);
  
  return wxo_app_token_num;
}

/**
 * 根据搜索条件和分页查找小程序接口凭据列表
 */
export async function findAllWxoAppToken(
  search?: WxoAppTokenSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxoAppTokenModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_token_models = await wxo_app_tokenDao.findAllWxoAppToken(search, page, sort);
  
  return wxo_app_token_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxoAppToken(
  input: WxoAppTokenInput,
): Promise<void> {
  await wxo_app_tokenDao.setIdByLblWxoAppToken(input);
}

/**
 * 根据条件查找第一个小程序接口凭据
 */
export async function findOneWxoAppToken(
  search?: WxoAppTokenSearch,
  sort?: SortInput[],
): Promise<WxoAppTokenModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_token_model = await wxo_app_tokenDao.findOneWxoAppToken(search, sort);
  
  return wxo_app_token_model;
}

/**
 * 根据条件查找第一个小程序接口凭据, 如果不存在则抛错
 */
export async function findOneOkWxoAppToken(
  search?: WxoAppTokenSearch,
  sort?: SortInput[],
): Promise<WxoAppTokenModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_token_model = await wxo_app_tokenDao.findOneOkWxoAppToken(search, sort);
  
  return wxo_app_token_model;
}

/**
 * 根据 id 查找小程序接口凭据
 */
export async function findByIdWxoAppToken(
  wxo_app_token_id: WxoAppTokenId,
): Promise<WxoAppTokenModel | undefined> {
  
  const wxo_app_token_model = await wxo_app_tokenDao.findByIdWxoAppToken(wxo_app_token_id);
  
  return wxo_app_token_model;
}

/**
 * 根据 id 查找小程序接口凭据, 如果不存在则抛错
 */
export async function findByIdOkWxoAppToken(
  wxo_app_token_id: WxoAppTokenId,
): Promise<WxoAppTokenModel> {
  
  const wxo_app_token_model = await wxo_app_tokenDao.findByIdOkWxoAppToken(wxo_app_token_id);
  
  return wxo_app_token_model;
}

/**
 * 根据 ids 查找小程序接口凭据
 */
export async function findByIdsWxoAppToken(
  wxo_app_token_ids: WxoAppTokenId[],
): Promise<WxoAppTokenModel[]> {
  
  const wxo_app_token_models = await wxo_app_tokenDao.findByIdsWxoAppToken(wxo_app_token_ids);
  
  return wxo_app_token_models;
}

/**
 * 根据 ids 查找小程序接口凭据, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxoAppToken(
  wxo_app_token_ids: WxoAppTokenId[],
): Promise<WxoAppTokenModel[]> {
  
  const wxo_app_token_models = await wxo_app_tokenDao.findByIdsOkWxoAppToken(wxo_app_token_ids);
  
  return wxo_app_token_models;
}

/**
 * 根据搜索条件查找小程序接口凭据是否存在
 */
export async function existWxoAppToken(
  search?: WxoAppTokenSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_token_exist = await wxo_app_tokenDao.existWxoAppToken(search);
  
  return wxo_app_token_exist;
}

/**
 * 根据 id 查找小程序接口凭据是否存在
 */
export async function existByIdWxoAppToken(
  wxo_app_token_id?: WxoAppTokenId | null,
): Promise<boolean> {
  
  const wxo_app_token_exist = await wxo_app_tokenDao.existByIdWxoAppToken(wxo_app_token_id);
  
  return wxo_app_token_exist;
}

/**
 * 增加和修改时校验小程序接口凭据
 */
export async function validateWxoAppToken(
  input: WxoAppTokenInput,
): Promise<void> {
  await wxo_app_tokenDao.validateWxoAppToken(input);
}

/**
 * 批量创建小程序接口凭据
 */
export async function createsWxoAppToken(
  inputs: WxoAppTokenInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxoAppTokenId[]> {
  const wxo_app_token_ids = await wxo_app_tokenDao.createsWxoAppToken(inputs, options);
  
  return wxo_app_token_ids;
}

/**
 * 根据 id 修改小程序接口凭据
 */
export async function updateByIdWxoAppToken(
  wxo_app_token_id: WxoAppTokenId,
  input: WxoAppTokenInput,
): Promise<WxoAppTokenId> {
  
  const wxo_app_token_id2 = await wxo_app_tokenDao.updateByIdWxoAppToken(wxo_app_token_id, input);
  
  return wxo_app_token_id2;
}

/** 校验小程序接口凭据是否存在 */
export async function validateOptionWxoAppToken(
  model0?: WxoAppTokenModel,
): Promise<WxoAppTokenModel> {
  const wxo_app_token_model = await wxo_app_tokenDao.validateOptionWxoAppToken(model0);
  return wxo_app_token_model;
}

/**
 * 根据 ids 删除小程序接口凭据
 */
export async function deleteByIdsWxoAppToken(
  wxo_app_token_ids: WxoAppTokenId[],
): Promise<number> {
  
  const wxo_app_token_num = await wxo_app_tokenDao.deleteByIdsWxoAppToken(wxo_app_token_ids);
  return wxo_app_token_num;
}

/**
 * 根据 ids 还原小程序接口凭据
 */
export async function revertByIdsWxoAppToken(
  wxo_app_token_ids: WxoAppTokenId[],
): Promise<number> {
  
  const wxo_app_token_num = await wxo_app_tokenDao.revertByIdsWxoAppToken(wxo_app_token_ids);
  
  return wxo_app_token_num;
}

/**
 * 根据 ids 彻底删除小程序接口凭据
 */
export async function forceDeleteByIdsWxoAppToken(
  wxo_app_token_ids: WxoAppTokenId[],
): Promise<number> {
  
  const wxo_app_token_num = await wxo_app_tokenDao.forceDeleteByIdsWxoAppToken(wxo_app_token_ids);
  
  return wxo_app_token_num;
}

/**
 * 获取小程序接口凭据字段注释
 */
export async function getFieldCommentsWxoAppToken(): Promise<WxoAppTokenFieldComment> {
  const wxo_app_token_fields = await wxo_app_tokenDao.getFieldCommentsWxoAppToken();
  return wxo_app_token_fields;
}
