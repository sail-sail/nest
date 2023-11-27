import {
  ns,
} from "/src/base/i18n/i18n.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  WxAppInput,
  WxAppModel,
  WxAppSearch,
  WxAppFieldComment,
} from "./wx_app.model.ts";

import * as wx_appDao from "./wx_app.dao.ts";

/**
 * 根据条件查找总数
 * @param {WxAppSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxAppSearch,
): Promise<number> {
  search = search || { };
  const data = await wx_appDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {WxAppSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<WxAppModel[]>} 
 */
export async function findAll(
  search?: WxAppSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<WxAppModel[]> {
  search = search || { };
  const models: WxAppModel[] = await wx_appDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxAppInput,
) {
  const data = await wx_appDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {WxAppSearch} search? 搜索条件
 */
export async function findOne(
  search?: WxAppSearch,
  sort?: SortInput|SortInput[],
): Promise<WxAppModel | undefined> {
  search = search || { };
  const model = await wx_appDao.findOne(search, sort);
  return model;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
): Promise<WxAppModel | undefined> {
  const model = await wx_appDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {WxAppSearch} search? 搜索条件
 */
export async function exist(
  search?: WxAppSearch,
): Promise<boolean> {
  search = search || { };
  const data = await wx_appDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
): Promise<boolean> {
  const data = await wx_appDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: WxAppInput,
): Promise<void> {
  const data = await wx_appDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {WxAppInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: WxAppInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const data = await wx_appDao.create(input, options);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {WxAppInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: WxAppInput,
): Promise<string> {
  
  const is_locked = await wx_appDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const data = await wx_appDao.updateById(id, input);
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
  
  {
    const ids2: string[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const is_locked = await wx_appDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  const data = await wx_appDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或禁用数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: string[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await wx_appDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或解锁数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await wx_appDao.lockByIds(ids, is_locked);
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
  const data = await wx_appDao.revertByIds(ids);
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
  const data = await wx_appDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<WxAppFieldComment> {
  const data = await wx_appDao.getFieldComments();
  return data;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await wx_appDao.findLastOrderBy();
  return data;
}
