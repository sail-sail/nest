import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wx_usrDao from "./wx_usr.dao.ts";

/**
 * 根据条件查找小程序用户总数
 * @param {WxUsrSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxUsrSearch,
): Promise<number> {
  search = search || { };
  const data = await wx_usrDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找小程序用户列表
 * @param {WxUsrSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<WxUsrModel[]>} 
 */
export async function findAll(
  search?: WxUsrSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<WxUsrModel[]> {
  search = search || { };
  const models: WxUsrModel[] = await wx_usrDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxUsrInput,
) {
  const data = await wx_usrDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个小程序用户
 * @param {WxUsrSearch} search? 搜索条件
 */
export async function findOne(
  search?: WxUsrSearch,
  sort?: SortInput|SortInput[],
): Promise<WxUsrModel | undefined> {
  search = search || { };
  const model = await wx_usrDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找小程序用户
 * @param {WxUsrId} id
 */
export async function findById(
  id?: WxUsrId | null,
): Promise<WxUsrModel | undefined> {
  const model = await wx_usrDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找小程序用户是否存在
 * @param {WxUsrSearch} search? 搜索条件
 */
export async function exist(
  search?: WxUsrSearch,
): Promise<boolean> {
  search = search || { };
  const data = await wx_usrDao.exist(search);
  return data;
}

/**
 * 根据 id 查找小程序用户是否存在
 * @param {WxUsrId} id
 */
export async function existById(
  id?: WxUsrId | null,
): Promise<boolean> {
  const data = await wx_usrDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验小程序用户
 * @param input 
 */
export async function validate(
  input: WxUsrInput,
): Promise<void> {
  const data = await wx_usrDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {WxUsrInput} input
 * @return {Promise<WxUsrId>} id
 */
export async function create(
  input: WxUsrInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxUsrId> {
  const id: WxUsrId = await wx_usrDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改小程序用户
 * @param {WxUsrId} id
 * @param {WxUsrInput} input
 * @return {Promise<WxUsrId>}
 */
export async function updateById(
  id: WxUsrId,
  input: WxUsrInput,
): Promise<WxUsrId> {
  
  const id2: WxUsrId = await wx_usrDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除小程序用户
 * @param {WxUsrId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxUsrId[],
): Promise<number> {
  
  const data = await wx_usrDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原小程序用户
 * @param {WxUsrId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxUsrId[],
): Promise<number> {
  const data = await wx_usrDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除小程序用户
 * @param {WxUsrId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxUsrId[],
): Promise<number> {
  const data = await wx_usrDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取小程序用户字段注释
 */
export async function getFieldComments(): Promise<WxUsrFieldComment> {
  const data = await wx_usrDao.getFieldComments();
  return data;
}
