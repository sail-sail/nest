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
  
  const data = await wxw_app_tokenDao.findCount(search);
  return data;
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
  
  const models: WxwAppTokenModel[] = await wxw_app_tokenDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxwAppTokenInput,
) {
  const data = await wxw_app_tokenDao.setIdByLbl(input);
  return data;
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
  
  const model = await wxw_app_tokenDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找企微应用接口凭据
 */
export async function findById(
  id?: WxwAppTokenId | null,
): Promise<WxwAppTokenModel | undefined> {
  const model = await wxw_app_tokenDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找企微应用接口凭据是否存在
 */
export async function exist(
  search?: WxwAppTokenSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wxw_app_tokenDao.exist(search);
  return data;
}

/**
 * 根据 id 查找企微应用接口凭据是否存在
 */
export async function existById(
  id?: WxwAppTokenId | null,
): Promise<boolean> {
  const data = await wxw_app_tokenDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验企微应用接口凭据
 */
export async function validate(
  input: WxwAppTokenInput,
): Promise<void> {
  const data = await wxw_app_tokenDao.validate(input);
  return data;
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
  const ids = await wxw_app_tokenDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改企微应用接口凭据
 */
export async function updateById(
  id: WxwAppTokenId,
  input: WxwAppTokenInput,
): Promise<WxwAppTokenId> {
  
  const id2 = await wxw_app_tokenDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除企微应用接口凭据
 */
export async function deleteByIds(
  ids: WxwAppTokenId[],
): Promise<number> {
  
  const data = await wxw_app_tokenDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原企微应用接口凭据
 */
export async function revertByIds(
  ids: WxwAppTokenId[],
): Promise<number> {
  const data = await wxw_app_tokenDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除企微应用接口凭据
 */
export async function forceDeleteByIds(
  ids: WxwAppTokenId[],
): Promise<number> {
  const data = await wxw_app_tokenDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取企微应用接口凭据字段注释
 */
export async function getFieldComments(): Promise<WxwAppTokenFieldComment> {
  const data = await wxw_app_tokenDao.getFieldComments();
  return data;
}
