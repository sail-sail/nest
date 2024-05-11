import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wxo_usrDao from "./wxo_usr.dao.ts";

/**
 * 根据条件查找公众号用户总数
 * @param {WxoUsrSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxoUsrSearch,
): Promise<number> {
  search = search || { };
  const data = await wxo_usrDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找公众号用户列表
 * @param {WxoUsrSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<WxoUsrModel[]>} 
 */
export async function findAll(
  search?: WxoUsrSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<WxoUsrModel[]> {
  search = search || { };
  const models: WxoUsrModel[] = await wxo_usrDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxoUsrInput,
) {
  const data = await wxo_usrDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个公众号用户
 * @param {WxoUsrSearch} search? 搜索条件
 */
export async function findOne(
  search?: WxoUsrSearch,
  sort?: SortInput|SortInput[],
): Promise<WxoUsrModel | undefined> {
  search = search || { };
  const model = await wxo_usrDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找公众号用户
 * @param {WxoUsrId} id
 */
export async function findById(
  id?: WxoUsrId | null,
): Promise<WxoUsrModel | undefined> {
  const model = await wxo_usrDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找公众号用户是否存在
 * @param {WxoUsrSearch} search? 搜索条件
 */
export async function exist(
  search?: WxoUsrSearch,
): Promise<boolean> {
  search = search || { };
  const data = await wxo_usrDao.exist(search);
  return data;
}

/**
 * 根据 id 查找公众号用户是否存在
 * @param {WxoUsrId} id
 */
export async function existById(
  id?: WxoUsrId | null,
): Promise<boolean> {
  const data = await wxo_usrDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验公众号用户
 * @param input 
 */
export async function validate(
  input: WxoUsrInput,
): Promise<void> {
  const data = await wxo_usrDao.validate(input);
  return data;
}

/**
 * 批量创建公众号用户
 * @param {WxoUsrInput[]} inputs
 * @return {Promise<WxoUsrId[]>} ids
 */
export async function creates(
  inputs: WxoUsrInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxoUsrId[]> {
  const ids = await wxo_usrDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改公众号用户
 * @param {WxoUsrId} id
 * @param {WxoUsrInput} input
 * @return {Promise<WxoUsrId>}
 */
export async function updateById(
  id: WxoUsrId,
  input: WxoUsrInput,
): Promise<WxoUsrId> {
  
  const id2: WxoUsrId = await wxo_usrDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除公众号用户
 * @param {WxoUsrId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxoUsrId[],
): Promise<number> {
  
  const data = await wxo_usrDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原公众号用户
 * @param {WxoUsrId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxoUsrId[],
): Promise<number> {
  const data = await wxo_usrDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除公众号用户
 * @param {WxoUsrId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxoUsrId[],
): Promise<number> {
  const data = await wxo_usrDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取公众号用户字段注释
 */
export async function getFieldComments(): Promise<WxoUsrFieldComment> {
  const data = await wxo_usrDao.getFieldComments();
  return data;
}
