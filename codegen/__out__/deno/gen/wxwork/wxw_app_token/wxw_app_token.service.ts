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
export async function findCount(
  search?: WxwAppTokenSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_app_token_num = await wxw_app_tokenDao.findCount(search);
  
  return wxw_app_token_num;
}

/**
 * 根据搜索条件和分页查找企微应用接口凭据列表
 */
export async function findAll(
  search?: WxwAppTokenSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwAppTokenModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_app_token_models = await wxw_app_tokenDao.findAll(search, page, sort);
  
  return wxw_app_token_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxwAppTokenInput,
): Promise<void> {
  await wxw_app_tokenDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个企微应用接口凭据
 */
export async function findOne(
  search?: WxwAppTokenSearch,
  sort?: SortInput[],
): Promise<WxwAppTokenModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_app_token_model = await wxw_app_tokenDao.findOne(search, sort);
  
  return wxw_app_token_model;
}

/**
 * 根据 id 查找企微应用接口凭据
 */
export async function findById(
  wxw_app_token_id?: WxwAppTokenId | null,
): Promise<WxwAppTokenModel | undefined> {
  
  const wxw_app_token_model = await wxw_app_tokenDao.findById(wxw_app_token_id);
  
  return wxw_app_token_model;
}

/**
 * 根据 ids 查找企微应用接口凭据
 */
export async function findByIds(
  wxw_app_token_ids: WxwAppTokenId[],
): Promise<WxwAppTokenModel[]> {
  
  const wxw_app_token_models = await wxw_app_tokenDao.findByIds(wxw_app_token_ids);
  
  return wxw_app_token_models;
}

/**
 * 根据搜索条件查找企微应用接口凭据是否存在
 */
export async function exist(
  search?: WxwAppTokenSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_app_token_exist = await wxw_app_tokenDao.exist(search);
  
  return wxw_app_token_exist;
}

/**
 * 根据 id 查找企微应用接口凭据是否存在
 */
export async function existById(
  wxw_app_token_id?: WxwAppTokenId | null,
): Promise<boolean> {
  
  const wxw_app_token_exist = await wxw_app_tokenDao.existById(wxw_app_token_id);
  
  return wxw_app_token_exist;
}

/**
 * 增加和修改时校验企微应用接口凭据
 */
export async function validate(
  input: WxwAppTokenInput,
): Promise<void> {
  await wxw_app_tokenDao.validate(input);
}

/**
 * 批量创建企微应用接口凭据
 */
export async function creates(
  inputs: WxwAppTokenInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxwAppTokenId[]> {
  const wxw_app_token_ids = await wxw_app_tokenDao.creates(inputs, options);
  
  return wxw_app_token_ids;
}

/**
 * 根据 id 修改企微应用接口凭据
 */
export async function updateById(
  wxw_app_token_id: WxwAppTokenId,
  input: WxwAppTokenInput,
): Promise<WxwAppTokenId> {
  
  const wxw_app_token_id2 = await wxw_app_tokenDao.updateById(wxw_app_token_id, input);
  
  return wxw_app_token_id2;
}

/** 校验企微应用接口凭据是否存在 */
export async function validateOption(
  model0?: WxwAppTokenModel,
): Promise<WxwAppTokenModel> {
  const wxw_app_token_model = await wxw_app_tokenDao.validateOption(model0);
  return wxw_app_token_model;
}

/**
 * 根据 ids 删除企微应用接口凭据
 */
export async function deleteByIds(
  wxw_app_token_ids: WxwAppTokenId[],
): Promise<number> {
  
  const wxw_app_token_num = await wxw_app_tokenDao.deleteByIds(wxw_app_token_ids);
  return wxw_app_token_num;
}

/**
 * 根据 ids 还原企微应用接口凭据
 */
export async function revertByIds(
  wxw_app_token_ids: WxwAppTokenId[],
): Promise<number> {
  
  const wxw_app_token_num = await wxw_app_tokenDao.revertByIds(wxw_app_token_ids);
  
  return wxw_app_token_num;
}

/**
 * 根据 ids 彻底删除企微应用接口凭据
 */
export async function forceDeleteByIds(
  wxw_app_token_ids: WxwAppTokenId[],
): Promise<number> {
  
  const wxw_app_token_num = await wxw_app_tokenDao.forceDeleteByIds(wxw_app_token_ids);
  
  return wxw_app_token_num;
}

/**
 * 获取企微应用接口凭据字段注释
 */
export async function getFieldComments(): Promise<WxwAppTokenFieldComment> {
  const wxw_app_token_fields = await wxw_app_tokenDao.getFieldComments();
  return wxw_app_token_fields;
}
