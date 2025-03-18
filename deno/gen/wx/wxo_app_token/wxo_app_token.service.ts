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
  
  const wxo_app_token_num = await wxo_app_tokenDao.findCount(search);
  
  return wxo_app_token_num;
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
  
  const wxo_app_token_models = await wxo_app_tokenDao.findAll(search, page, sort);
  
  return wxo_app_token_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxoAppTokenInput,
): Promise<void> {
  await wxo_app_tokenDao.setIdByLbl(input);
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
  
  const wxo_app_token_model = await wxo_app_tokenDao.findOne(search, sort);
  
  return wxo_app_token_model;
}

/**
 * 根据 id 查找小程序接口凭据
 */
export async function findById(
  wxo_app_token_id?: WxoAppTokenId | null,
): Promise<WxoAppTokenModel | undefined> {
  
  const wxo_app_token_model = await wxo_app_tokenDao.findById(wxo_app_token_id);
  
  return wxo_app_token_model;
}

/**
 * 根据 ids 查找小程序接口凭据
 */
export async function findByIds(
  wxo_app_token_ids: WxoAppTokenId[],
): Promise<WxoAppTokenModel[]> {
  
  const wxo_app_token_models = await wxo_app_tokenDao.findByIds(wxo_app_token_ids);
  
  return wxo_app_token_models;
}

/**
 * 根据搜索条件查找小程序接口凭据是否存在
 */
export async function exist(
  search?: WxoAppTokenSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_app_token_exist = await wxo_app_tokenDao.exist(search);
  
  return wxo_app_token_exist;
}

/**
 * 根据 id 查找小程序接口凭据是否存在
 */
export async function existById(
  wxo_app_token_id?: WxoAppTokenId | null,
): Promise<boolean> {
  
  const wxo_app_token_exist = await wxo_app_tokenDao.existById(wxo_app_token_id);
  
  return wxo_app_token_exist;
}

/**
 * 增加和修改时校验小程序接口凭据
 */
export async function validate(
  input: WxoAppTokenInput,
): Promise<void> {
  await wxo_app_tokenDao.validate(input);
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
  const wxo_app_token_ids = await wxo_app_tokenDao.creates(inputs, options);
  
  return wxo_app_token_ids;
}

/**
 * 根据 id 修改小程序接口凭据
 */
export async function updateById(
  wxo_app_token_id: WxoAppTokenId,
  input: WxoAppTokenInput,
): Promise<WxoAppTokenId> {
  
  const wxo_app_token_id2 = await wxo_app_tokenDao.updateById(wxo_app_token_id, input);
  
  return wxo_app_token_id2;
}

/** 校验小程序接口凭据是否存在 */
export async function validateOption(
  model0?: WxoAppTokenModel,
): Promise<WxoAppTokenModel> {
  const wxo_app_token_model = await wxo_app_tokenDao.validateOption(model0);
  return wxo_app_token_model;
}

/**
 * 根据 ids 删除小程序接口凭据
 */
export async function deleteByIds(
  wxo_app_token_ids: WxoAppTokenId[],
): Promise<number> {
  
  const wxo_app_token_num = await wxo_app_tokenDao.deleteByIds(wxo_app_token_ids);
  return wxo_app_token_num;
}

/**
 * 根据 ids 还原小程序接口凭据
 */
export async function revertByIds(
  wxo_app_token_ids: WxoAppTokenId[],
): Promise<number> {
  
  const wxo_app_token_num = await wxo_app_tokenDao.revertByIds(wxo_app_token_ids);
  
  return wxo_app_token_num;
}

/**
 * 根据 ids 彻底删除小程序接口凭据
 */
export async function forceDeleteByIds(
  wxo_app_token_ids: WxoAppTokenId[],
): Promise<number> {
  
  const wxo_app_token_num = await wxo_app_tokenDao.forceDeleteByIds(wxo_app_token_ids);
  
  return wxo_app_token_num;
}

/**
 * 获取小程序接口凭据字段注释
 */
export async function getFieldComments(): Promise<WxoAppTokenFieldComment> {
  const wxo_app_token_fields = await wxo_app_tokenDao.getFieldComments();
  return wxo_app_token_fields;
}
