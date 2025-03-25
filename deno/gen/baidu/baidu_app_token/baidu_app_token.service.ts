import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as baidu_app_tokenDao from "./baidu_app_token.dao.ts";

async function setSearchQuery(
  _search: BaiduAppTokenSearch,
) {
  
}

/**
 * 根据条件查找百度接口凭据总数
 */
export async function findCountBaiduAppToken(
  search?: BaiduAppTokenSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_token_num = await baidu_app_tokenDao.findCountBaiduAppToken(search);
  
  return baidu_app_token_num;
}

/**
 * 根据搜索条件和分页查找百度接口凭据列表
 */
export async function findAllBaiduAppToken(
  search?: BaiduAppTokenSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<BaiduAppTokenModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_token_models = await baidu_app_tokenDao.findAllBaiduAppToken(search, page, sort);
  
  return baidu_app_token_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblBaiduAppToken(
  input: BaiduAppTokenInput,
): Promise<void> {
  await baidu_app_tokenDao.setIdByLblBaiduAppToken(input);
}

/**
 * 根据条件查找第一个百度接口凭据
 */
export async function findOneBaiduAppToken(
  search?: BaiduAppTokenSearch,
  sort?: SortInput[],
): Promise<BaiduAppTokenModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_token_model = await baidu_app_tokenDao.findOneBaiduAppToken(search, sort);
  
  return baidu_app_token_model;
}

/**
 * 根据 id 查找百度接口凭据
 */
export async function findByIdBaiduAppToken(
  baidu_app_token_id?: BaiduAppTokenId | null,
): Promise<BaiduAppTokenModel | undefined> {
  
  const baidu_app_token_model = await baidu_app_tokenDao.findByIdBaiduAppToken(baidu_app_token_id);
  
  return baidu_app_token_model;
}

/**
 * 根据 ids 查找百度接口凭据
 */
export async function findByIdsBaiduAppToken(
  baidu_app_token_ids: BaiduAppTokenId[],
): Promise<BaiduAppTokenModel[]> {
  
  const baidu_app_token_models = await baidu_app_tokenDao.findByIdsBaiduAppToken(baidu_app_token_ids);
  
  return baidu_app_token_models;
}

/**
 * 根据搜索条件查找百度接口凭据是否存在
 */
export async function existBaiduAppToken(
  search?: BaiduAppTokenSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_token_exist = await baidu_app_tokenDao.existBaiduAppToken(search);
  
  return baidu_app_token_exist;
}

/**
 * 根据 id 查找百度接口凭据是否存在
 */
export async function existByIdBaiduAppToken(
  baidu_app_token_id?: BaiduAppTokenId | null,
): Promise<boolean> {
  
  const baidu_app_token_exist = await baidu_app_tokenDao.existByIdBaiduAppToken(baidu_app_token_id);
  
  return baidu_app_token_exist;
}

/**
 * 增加和修改时校验百度接口凭据
 */
export async function validateBaiduAppToken(
  input: BaiduAppTokenInput,
): Promise<void> {
  await baidu_app_tokenDao.validateBaiduAppToken(input);
}

/**
 * 批量创建百度接口凭据
 */
export async function createsBaiduAppToken(
  inputs: BaiduAppTokenInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<BaiduAppTokenId[]> {
  const baidu_app_token_ids = await baidu_app_tokenDao.createsBaiduAppToken(inputs, options);
  
  return baidu_app_token_ids;
}

/**
 * 根据 id 修改百度接口凭据
 */
export async function updateByIdBaiduAppToken(
  baidu_app_token_id: BaiduAppTokenId,
  input: BaiduAppTokenInput,
): Promise<BaiduAppTokenId> {
  
  const baidu_app_token_id2 = await baidu_app_tokenDao.updateByIdBaiduAppToken(baidu_app_token_id, input);
  
  return baidu_app_token_id2;
}

/** 校验百度接口凭据是否存在 */
export async function validateOptionBaiduAppToken(
  model0?: BaiduAppTokenModel,
): Promise<BaiduAppTokenModel> {
  const baidu_app_token_model = await baidu_app_tokenDao.validateOptionBaiduAppToken(model0);
  return baidu_app_token_model;
}

/**
 * 根据 ids 删除百度接口凭据
 */
export async function deleteByIdsBaiduAppToken(
  baidu_app_token_ids: BaiduAppTokenId[],
): Promise<number> {
  
  const baidu_app_token_num = await baidu_app_tokenDao.deleteByIdsBaiduAppToken(baidu_app_token_ids);
  return baidu_app_token_num;
}

/**
 * 根据 ids 还原百度接口凭据
 */
export async function revertByIdsBaiduAppToken(
  baidu_app_token_ids: BaiduAppTokenId[],
): Promise<number> {
  
  const baidu_app_token_num = await baidu_app_tokenDao.revertByIdsBaiduAppToken(baidu_app_token_ids);
  
  return baidu_app_token_num;
}

/**
 * 根据 ids 彻底删除百度接口凭据
 */
export async function forceDeleteByIdsBaiduAppToken(
  baidu_app_token_ids: BaiduAppTokenId[],
): Promise<number> {
  
  const baidu_app_token_num = await baidu_app_tokenDao.forceDeleteByIdsBaiduAppToken(baidu_app_token_ids);
  
  return baidu_app_token_num;
}

/**
 * 获取百度接口凭据字段注释
 */
export async function getFieldCommentsBaiduAppToken(): Promise<BaiduAppTokenFieldComment> {
  const baidu_app_token_fields = await baidu_app_tokenDao.getFieldCommentsBaiduAppToken();
  return baidu_app_token_fields;
}
