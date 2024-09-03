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
  
  const data = await baidu_app_tokenDao.findCount(search);
  return data;
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
  
  const models: BaiduAppTokenModel[] = await baidu_app_tokenDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: BaiduAppTokenInput,
) {
  const data = await baidu_app_tokenDao.setIdByLbl(input);
  return data;
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
  
  const model = await baidu_app_tokenDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找百度接口凭据
 */
export async function findById(
  id?: BaiduAppTokenId | null,
): Promise<BaiduAppTokenModel | undefined> {
  const model = await baidu_app_tokenDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找百度接口凭据是否存在
 */
export async function exist(
  search?: BaiduAppTokenSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await baidu_app_tokenDao.exist(search);
  return data;
}

/**
 * 根据 id 查找百度接口凭据是否存在
 */
export async function existById(
  id?: BaiduAppTokenId | null,
): Promise<boolean> {
  const data = await baidu_app_tokenDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验百度接口凭据
 */
export async function validate(
  input: BaiduAppTokenInput,
): Promise<void> {
  const data = await baidu_app_tokenDao.validate(input);
  return data;
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
  const ids = await baidu_app_tokenDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改百度接口凭据
 */
export async function updateById(
  id: BaiduAppTokenId,
  input: BaiduAppTokenInput,
): Promise<BaiduAppTokenId> {
  
  const id2 = await baidu_app_tokenDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除百度接口凭据
 */
export async function deleteByIds(
  ids: BaiduAppTokenId[],
): Promise<number> {
  
  const data = await baidu_app_tokenDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原百度接口凭据
 */
export async function revertByIds(
  ids: BaiduAppTokenId[],
): Promise<number> {
  const data = await baidu_app_tokenDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除百度接口凭据
 */
export async function forceDeleteByIds(
  ids: BaiduAppTokenId[],
): Promise<number> {
  const data = await baidu_app_tokenDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取百度接口凭据字段注释
 */
export async function getFieldComments(): Promise<BaiduAppTokenFieldComment> {
  const data = await baidu_app_tokenDao.getFieldComments();
  return data;
}
