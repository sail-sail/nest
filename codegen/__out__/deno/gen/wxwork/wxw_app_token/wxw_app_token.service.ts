import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wxw_app_tokenDao from "./wxw_app_token.dao.ts";

async function setSearchQuery(
  _search: WxwAppTokenSearch,
) {
  
}

/**
 * 根据条件查找企微应用接口凭据总数
 */
export async function findCountWxwAppToken(
  search?: WxwAppTokenSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_app_token_num = await wxw_app_tokenDao.findCountWxwAppToken(search);
  
  return wxw_app_token_num;
}

/**
 * 根据搜索条件和分页查找企微应用接口凭据列表
 */
export async function findAllWxwAppToken(
  search?: WxwAppTokenSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwAppTokenModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_app_token_models = await wxw_app_tokenDao.findAllWxwAppToken(search, page, sort);
  
  return wxw_app_token_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxwAppToken(
  input: WxwAppTokenInput,
): Promise<void> {
  await wxw_app_tokenDao.setIdByLblWxwAppToken(input);
}

/**
 * 根据条件查找第一个企微应用接口凭据
 */
export async function findOneWxwAppToken(
  search?: WxwAppTokenSearch,
  sort?: SortInput[],
): Promise<WxwAppTokenModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_app_token_model = await wxw_app_tokenDao.findOneWxwAppToken(search, sort);
  
  return wxw_app_token_model;
}

/**
 * 根据 id 查找企微应用接口凭据
 */
export async function findByIdWxwAppToken(
  wxw_app_token_id?: WxwAppTokenId | null,
): Promise<WxwAppTokenModel | undefined> {
  
  const wxw_app_token_model = await wxw_app_tokenDao.findByIdWxwAppToken(wxw_app_token_id);
  
  return wxw_app_token_model;
}

/**
 * 根据 ids 查找企微应用接口凭据
 */
export async function findByIdsWxwAppToken(
  wxw_app_token_ids: WxwAppTokenId[],
): Promise<WxwAppTokenModel[]> {
  
  const wxw_app_token_models = await wxw_app_tokenDao.findByIdsWxwAppToken(wxw_app_token_ids);
  
  return wxw_app_token_models;
}

/**
 * 根据搜索条件查找企微应用接口凭据是否存在
 */
export async function existWxwAppToken(
  search?: WxwAppTokenSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_app_token_exist = await wxw_app_tokenDao.existWxwAppToken(search);
  
  return wxw_app_token_exist;
}

/**
 * 根据 id 查找企微应用接口凭据是否存在
 */
export async function existByIdWxwAppToken(
  wxw_app_token_id?: WxwAppTokenId | null,
): Promise<boolean> {
  
  const wxw_app_token_exist = await wxw_app_tokenDao.existByIdWxwAppToken(wxw_app_token_id);
  
  return wxw_app_token_exist;
}

/**
 * 增加和修改时校验企微应用接口凭据
 */
export async function validateWxwAppToken(
  input: WxwAppTokenInput,
): Promise<void> {
  await wxw_app_tokenDao.validateWxwAppToken(input);
}

/**
 * 批量创建企微应用接口凭据
 */
export async function createsWxwAppToken(
  inputs: WxwAppTokenInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxwAppTokenId[]> {
  const wxw_app_token_ids = await wxw_app_tokenDao.createsWxwAppToken(inputs, options);
  
  return wxw_app_token_ids;
}

/**
 * 根据 id 修改企微应用接口凭据
 */
export async function updateByIdWxwAppToken(
  wxw_app_token_id: WxwAppTokenId,
  input: WxwAppTokenInput,
): Promise<WxwAppTokenId> {
  
  const wxw_app_token_id2 = await wxw_app_tokenDao.updateByIdWxwAppToken(wxw_app_token_id, input);
  
  return wxw_app_token_id2;
}

/** 校验企微应用接口凭据是否存在 */
export async function validateOptionWxwAppToken(
  model0?: WxwAppTokenModel,
): Promise<WxwAppTokenModel> {
  const wxw_app_token_model = await wxw_app_tokenDao.validateOptionWxwAppToken(model0);
  return wxw_app_token_model;
}

/**
 * 根据 ids 删除企微应用接口凭据
 */
export async function deleteByIdsWxwAppToken(
  wxw_app_token_ids: WxwAppTokenId[],
): Promise<number> {
  
  const wxw_app_token_num = await wxw_app_tokenDao.deleteByIdsWxwAppToken(wxw_app_token_ids);
  return wxw_app_token_num;
}

/**
 * 根据 ids 还原企微应用接口凭据
 */
export async function revertByIdsWxwAppToken(
  wxw_app_token_ids: WxwAppTokenId[],
): Promise<number> {
  
  const wxw_app_token_num = await wxw_app_tokenDao.revertByIdsWxwAppToken(wxw_app_token_ids);
  
  return wxw_app_token_num;
}

/**
 * 根据 ids 彻底删除企微应用接口凭据
 */
export async function forceDeleteByIdsWxwAppToken(
  wxw_app_token_ids: WxwAppTokenId[],
): Promise<number> {
  
  const wxw_app_token_num = await wxw_app_tokenDao.forceDeleteByIdsWxwAppToken(wxw_app_token_ids);
  
  return wxw_app_token_num;
}

/**
 * 获取企微应用接口凭据字段注释
 */
export async function getFieldCommentsWxwAppToken(): Promise<WxwAppTokenFieldComment> {
  const wxw_app_token_fields = await wxw_app_tokenDao.getFieldCommentsWxwAppToken();
  return wxw_app_token_fields;
}
