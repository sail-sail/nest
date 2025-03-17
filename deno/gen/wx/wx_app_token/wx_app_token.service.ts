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
export async function findCount(
  search?: WxAppTokenSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_token_num = await wx_app_tokenDao.findCount(search);
  
  return wx_app_token_num;
}

/**
 * 根据搜索条件和分页查找小程序接口凭据列表
 */
export async function findAll(
  search?: WxAppTokenSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxAppTokenModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_token_models = await wx_app_tokenDao.findAll(search, page, sort);
  
  return wx_app_token_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxAppTokenInput,
): Promise<void> {
  await wx_app_tokenDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个小程序接口凭据
 */
export async function findOne(
  search?: WxAppTokenSearch,
  sort?: SortInput[],
): Promise<WxAppTokenModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_token_model = await wx_app_tokenDao.findOne(search, sort);
  
  return wx_app_token_model;
}

/**
 * 根据 id 查找小程序接口凭据
 */
export async function findById(
  wx_app_token_id?: WxAppTokenId | null,
): Promise<WxAppTokenModel | undefined> {
  
  const wx_app_token_model = await wx_app_tokenDao.findById(wx_app_token_id);
  
  return wx_app_token_model;
}

/**
 * 根据 ids 查找小程序接口凭据
 */
export async function findByIds(
  wx_app_token_ids: WxAppTokenId[],
): Promise<WxAppTokenModel[]> {
  
  const wx_app_token_models = await wx_app_tokenDao.findByIds(wx_app_token_ids);
  
  return wx_app_token_models;
}

/**
 * 根据搜索条件查找小程序接口凭据是否存在
 */
export async function exist(
  search?: WxAppTokenSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_app_token_exist = await wx_app_tokenDao.exist(search);
  
  return wx_app_token_exist;
}

/**
 * 根据 id 查找小程序接口凭据是否存在
 */
export async function existById(
  wx_app_token_id?: WxAppTokenId | null,
): Promise<boolean> {
  
  const wx_app_token_exist = await wx_app_tokenDao.existById(wx_app_token_id);
  
  return wx_app_token_exist;
}

/**
 * 增加和修改时校验小程序接口凭据
 */
export async function validate(
  input: WxAppTokenInput,
): Promise<void> {
  await wx_app_tokenDao.validate(input);
}

/**
 * 批量创建小程序接口凭据
 */
export async function creates(
  inputs: WxAppTokenInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxAppTokenId[]> {
  const wx_app_token_ids = await wx_app_tokenDao.creates(inputs, options);
  
  return wx_app_token_ids;
}

/**
 * 根据 id 修改小程序接口凭据
 */
export async function updateById(
  wx_app_token_id: WxAppTokenId,
  input: WxAppTokenInput,
): Promise<WxAppTokenId> {
  
  const wx_app_token_id2 = await wx_app_tokenDao.updateById(wx_app_token_id, input);
  
  return wx_app_token_id2;
}

/** 校验小程序接口凭据是否存在 */
export async function validateOption(
  model0?: WxAppTokenModel,
): Promise<WxAppTokenModel> {
  const wx_app_token_model = await wx_app_tokenDao.validateOption(model0);
  return wx_app_token_model;
}

/**
 * 根据 ids 删除小程序接口凭据
 */
export async function deleteByIds(
  wx_app_token_ids: WxAppTokenId[],
): Promise<number> {
  
  const wx_app_token_num = await wx_app_tokenDao.deleteByIds(wx_app_token_ids);
  return wx_app_token_num;
}

/**
 * 根据 ids 还原小程序接口凭据
 */
export async function revertByIds(
  wx_app_token_ids: WxAppTokenId[],
): Promise<number> {
  
  const wx_app_token_num = await wx_app_tokenDao.revertByIds(wx_app_token_ids);
  
  return wx_app_token_num;
}

/**
 * 根据 ids 彻底删除小程序接口凭据
 */
export async function forceDeleteByIds(
  wx_app_token_ids: WxAppTokenId[],
): Promise<number> {
  
  const wx_app_token_num = await wx_app_tokenDao.forceDeleteByIds(wx_app_token_ids);
  
  return wx_app_token_num;
}

/**
 * 获取小程序接口凭据字段注释
 */
export async function getFieldComments(): Promise<WxAppTokenFieldComment> {
  const wx_app_token_fields = await wx_app_tokenDao.getFieldComments();
  return wx_app_token_fields;
}
