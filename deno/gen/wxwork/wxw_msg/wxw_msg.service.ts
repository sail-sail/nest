import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wxw_msgDao from "./wxw_msg.dao.ts";

async function setSearchQuery(
  search: WxwMsgSearch,
) {
  
}

/**
 * 根据条件查找企微消息总数
 * @param {WxwMsgSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxwMsgSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wxw_msgDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找企微消息列表
 * @param {WxwMsgSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<WxwMsgModel[]>} 
 */
export async function findAll(
  search?: WxwMsgSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<WxwMsgModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: WxwMsgModel[] = await wxw_msgDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxwMsgInput,
) {
  const data = await wxw_msgDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个企微消息
 * @param {WxwMsgSearch} search? 搜索条件
 */
export async function findOne(
  search?: WxwMsgSearch,
  sort?: SortInput|SortInput[],
): Promise<WxwMsgModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await wxw_msgDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找企微消息
 * @param {WxwMsgId} id
 */
export async function findById(
  id?: WxwMsgId | null,
): Promise<WxwMsgModel | undefined> {
  const model = await wxw_msgDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找企微消息是否存在
 * @param {WxwMsgSearch} search? 搜索条件
 */
export async function exist(
  search?: WxwMsgSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wxw_msgDao.exist(search);
  return data;
}

/**
 * 根据 id 查找企微消息是否存在
 * @param {WxwMsgId} id
 */
export async function existById(
  id?: WxwMsgId | null,
): Promise<boolean> {
  const data = await wxw_msgDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验企微消息
 * @param input 
 */
export async function validate(
  input: WxwMsgInput,
): Promise<void> {
  const data = await wxw_msgDao.validate(input);
  return data;
}

/**
 * 批量创建企微消息
 * @param {WxwMsgInput[]} inputs
 * @return {Promise<WxwMsgId[]>} ids
 */
export async function creates(
  inputs: WxwMsgInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxwMsgId[]> {
  const ids = await wxw_msgDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改企微消息
 * @param {WxwMsgId} id
 * @param {WxwMsgInput} input
 * @return {Promise<WxwMsgId>}
 */
export async function updateById(
  id: WxwMsgId,
  input: WxwMsgInput,
): Promise<WxwMsgId> {
  
  const id2 = await wxw_msgDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除企微消息
 * @param {WxwMsgId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxwMsgId[],
): Promise<number> {
  
  const data = await wxw_msgDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原企微消息
 * @param {WxwMsgId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxwMsgId[],
): Promise<number> {
  const data = await wxw_msgDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除企微消息
 * @param {WxwMsgId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxwMsgId[],
): Promise<number> {
  const data = await wxw_msgDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取企微消息字段注释
 */
export async function getFieldComments(): Promise<WxwMsgFieldComment> {
  const data = await wxw_msgDao.getFieldComments();
  return data;
}
