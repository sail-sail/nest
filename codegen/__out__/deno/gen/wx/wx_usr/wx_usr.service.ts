import {
  ns,
} from "/src/base/i18n/i18n.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  WxUsrInput,
  WxUsrModel,
  WxUsrSearch,
  WxUsrFieldComment,
  WxUsrId,
} from "./wx_usr.model.ts";

import * as wx_usrDao from "./wx_usr.dao.ts";

/**
 * 根据条件查找总数
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
 * 根据条件和分页查找数据
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
 * 根据条件查找第一条数据
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
 * 根据id查找数据
 * @param {WxUsrId} id
 */
export async function findById(
  id?: WxUsrId | null,
): Promise<WxUsrModel | undefined> {
  const model = await wx_usrDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
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
 * 根据id查找数据是否存在
 * @param {WxUsrId} id
 */
export async function existById(
  id?: WxUsrId | null,
): Promise<boolean> {
  const data = await wx_usrDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
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
 * 根据 id 修改数据
 * @param {WxUsrId} id
 * @param {WxUsrInput} input
 * @return {Promise<WxUsrId>}
 */
export async function updateById(
  id: WxUsrId,
  input: WxUsrInput,
): Promise<WxUsrId> {
  
  const is_locked = await wx_usrDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2: WxUsrId = await wx_usrDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除数据
 * @param {WxUsrId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxUsrId[],
): Promise<number> {
  
  {
    const ids2: WxUsrId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: WxUsrId = ids[i];
      const is_locked = await wx_usrDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  const data = await wx_usrDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或禁用数据
 * @param {WxUsrId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: WxUsrId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await wx_usrDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或解锁数据
 * @param {WxUsrId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: WxUsrId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await wx_usrDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原数据
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
 * 根据 ids 彻底删除数据
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
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<WxUsrFieldComment> {
  const data = await wx_usrDao.getFieldComments();
  return data;
}
