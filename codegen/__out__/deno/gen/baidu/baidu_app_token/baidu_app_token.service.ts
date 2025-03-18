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
export async function findCount(
  search?: BaiduAppTokenSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_token_num = await baidu_app_tokenDao.findCount(search);
  
  return baidu_app_token_num;
}

/**
 * 根据搜索条件和分页查找百度接口凭据列表
 */
export async function findAll(
  search?: BaiduAppTokenSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<BaiduAppTokenModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_token_models = await baidu_app_tokenDao.findAll(search, page, sort);
  
  return baidu_app_token_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: BaiduAppTokenInput,
): Promise<void> {
  await baidu_app_tokenDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个百度接口凭据
 */
export async function findOne(
  search?: BaiduAppTokenSearch,
  sort?: SortInput[],
): Promise<BaiduAppTokenModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_token_model = await baidu_app_tokenDao.findOne(search, sort);
  
  return baidu_app_token_model;
}

/**
 * 根据 id 查找百度接口凭据
 */
export async function findById(
  baidu_app_token_id?: BaiduAppTokenId | null,
): Promise<BaiduAppTokenModel | undefined> {
  
  const baidu_app_token_model = await baidu_app_tokenDao.findById(baidu_app_token_id);
  
  return baidu_app_token_model;
}

/**
 * 根据 ids 查找百度接口凭据
 */
export async function findByIds(
  baidu_app_token_ids: BaiduAppTokenId[],
): Promise<BaiduAppTokenModel[]> {
  
  const baidu_app_token_models = await baidu_app_tokenDao.findByIds(baidu_app_token_ids);
  
  return baidu_app_token_models;
}

/**
 * 根据搜索条件查找百度接口凭据是否存在
 */
export async function exist(
  search?: BaiduAppTokenSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const baidu_app_token_exist = await baidu_app_tokenDao.exist(search);
  
  return baidu_app_token_exist;
}

/**
 * 根据 id 查找百度接口凭据是否存在
 */
export async function existById(
  baidu_app_token_id?: BaiduAppTokenId | null,
): Promise<boolean> {
  
  const baidu_app_token_exist = await baidu_app_tokenDao.existById(baidu_app_token_id);
  
  return baidu_app_token_exist;
}

/**
 * 增加和修改时校验百度接口凭据
 */
export async function validate(
  input: BaiduAppTokenInput,
): Promise<void> {
  await baidu_app_tokenDao.validate(input);
}

/**
 * 批量创建百度接口凭据
 */
export async function creates(
  inputs: BaiduAppTokenInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<BaiduAppTokenId[]> {
  const baidu_app_token_ids = await baidu_app_tokenDao.creates(inputs, options);
  
  return baidu_app_token_ids;
}

/**
 * 根据 id 修改百度接口凭据
 */
export async function updateById(
  baidu_app_token_id: BaiduAppTokenId,
  input: BaiduAppTokenInput,
): Promise<BaiduAppTokenId> {
  
  const baidu_app_token_id2 = await baidu_app_tokenDao.updateById(baidu_app_token_id, input);
  
  return baidu_app_token_id2;
}

/** 校验百度接口凭据是否存在 */
export async function validateOption(
  model0?: BaiduAppTokenModel,
): Promise<BaiduAppTokenModel> {
  const baidu_app_token_model = await baidu_app_tokenDao.validateOption(model0);
  return baidu_app_token_model;
}

/**
 * 根据 ids 删除百度接口凭据
 */
export async function deleteByIds(
  baidu_app_token_ids: BaiduAppTokenId[],
): Promise<number> {
  
  const baidu_app_token_num = await baidu_app_tokenDao.deleteByIds(baidu_app_token_ids);
  return baidu_app_token_num;
}

/**
 * 根据 ids 还原百度接口凭据
 */
export async function revertByIds(
  baidu_app_token_ids: BaiduAppTokenId[],
): Promise<number> {
  
  const baidu_app_token_num = await baidu_app_tokenDao.revertByIds(baidu_app_token_ids);
  
  return baidu_app_token_num;
}

/**
 * 根据 ids 彻底删除百度接口凭据
 */
export async function forceDeleteByIds(
  baidu_app_token_ids: BaiduAppTokenId[],
): Promise<number> {
  
  const baidu_app_token_num = await baidu_app_tokenDao.forceDeleteByIds(baidu_app_token_ids);
  
  return baidu_app_token_num;
}

/**
 * 获取百度接口凭据字段注释
 */
export async function getFieldComments(): Promise<BaiduAppTokenFieldComment> {
  const baidu_app_token_fields = await baidu_app_tokenDao.getFieldComments();
  return baidu_app_token_fields;
}
