

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  WxwMsgInput,
  WxwMsgModel,
  WxwMsgSearch,
  WxwMsgFieldComment,
} from "./wxw_msg.model.ts";

import * as wxw_msgDao from "./wxw_msg.dao.ts";

/**
 * 根据条件查找总数
 * @param {WxwMsgSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxwMsgSearch,
): Promise<number> {
  search = search || { };
  const data = await wxw_msgDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
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
  const models: WxwMsgModel[] = await wxw_msgDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据条件查找第一条数据
 * @param {WxwMsgSearch} search? 搜索条件
 */
export async function findOne(
  search?: WxwMsgSearch,
  sort?: SortInput|SortInput[],
): Promise<WxwMsgModel | undefined> {
  search = search || { };
  const model = await wxw_msgDao.findOne(search, sort);
  return model;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
): Promise<WxwMsgModel | undefined> {
  const model = await wxw_msgDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {WxwMsgSearch} search? 搜索条件
 */
export async function exist(
  search?: WxwMsgSearch,
): Promise<boolean> {
  search = search || { };
  const data = await wxw_msgDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
): Promise<boolean> {
  const data = await wxw_msgDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: WxwMsgInput,
): Promise<void> {
  const data = await wxw_msgDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {WxwMsgInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: WxwMsgInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const data = await wxw_msgDao.create(input, options);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {WxwMsgInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: WxwMsgInput,
): Promise<string> {
  
  const data = await wxw_msgDao.updateById(id, input);
  return data;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
): Promise<number> {
  
  const data = await wxw_msgDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
): Promise<number> {
  const data = await wxw_msgDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: string[],
): Promise<number> {
  const data = await wxw_msgDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<WxwMsgFieldComment> {
  const data = await wxw_msgDao.getFieldComments();
  return data;
}
