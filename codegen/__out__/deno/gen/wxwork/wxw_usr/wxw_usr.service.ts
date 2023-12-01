

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  WxwUsrInput,
  WxwUsrModel,
  WxwUsrSearch,
  WxwUsrFieldComment,
  WxwUsrId,
} from "./wxw_usr.model.ts";

import * as wxw_usrDao from "./wxw_usr.dao.ts";

/**
 * 根据条件查找总数
 * @param {WxwUsrSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxwUsrSearch,
): Promise<number> {
  search = search || { };
  const data = await wxw_usrDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {WxwUsrSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<WxwUsrModel[]>} 
 */
export async function findAll(
  search?: WxwUsrSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<WxwUsrModel[]> {
  search = search || { };
  const models: WxwUsrModel[] = await wxw_usrDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxwUsrInput,
) {
  const data = await wxw_usrDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {WxwUsrSearch} search? 搜索条件
 */
export async function findOne(
  search?: WxwUsrSearch,
  sort?: SortInput|SortInput[],
): Promise<WxwUsrModel | undefined> {
  search = search || { };
  const model = await wxw_usrDao.findOne(search, sort);
  return model;
}

/**
 * 根据id查找数据
 * @param {WxwUsrId} id
 */
export async function findById(
  id?: WxwUsrId | null,
): Promise<WxwUsrModel | undefined> {
  const model = await wxw_usrDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {WxwUsrSearch} search? 搜索条件
 */
export async function exist(
  search?: WxwUsrSearch,
): Promise<boolean> {
  search = search || { };
  const data = await wxw_usrDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {WxwUsrId} id
 */
export async function existById(
  id?: WxwUsrId | null,
): Promise<boolean> {
  const data = await wxw_usrDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: WxwUsrInput,
): Promise<void> {
  const data = await wxw_usrDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {WxwUsrInput} input
 * @return {Promise<WxwUsrId>} id
 */
export async function create(
  input: WxwUsrInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxwUsrId> {
  const id: WxwUsrId = await wxw_usrDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改数据
 * @param {WxwUsrId} id
 * @param {WxwUsrInput} input
 * @return {Promise<WxwUsrId>}
 */
export async function updateById(
  id: WxwUsrId,
  input: WxwUsrInput,
): Promise<WxwUsrId> {
  
  const id2: WxwUsrId = await wxw_usrDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除数据
 * @param {WxwUsrId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxwUsrId[],
): Promise<number> {
  
  const data = await wxw_usrDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {WxwUsrId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxwUsrId[],
): Promise<number> {
  const data = await wxw_usrDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {WxwUsrId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxwUsrId[],
): Promise<number> {
  const data = await wxw_usrDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<WxwUsrFieldComment> {
  const data = await wxw_usrDao.getFieldComments();
  return data;
}
