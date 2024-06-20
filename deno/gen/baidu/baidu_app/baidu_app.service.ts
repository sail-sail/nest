import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as baidu_appDao from "./baidu_app.dao.ts";

async function setSearchQuery(
  search: BaiduAppSearch,
) {
  
}

/**
 * 根据条件查找百度应用总数
 * @param {BaiduAppSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: BaiduAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await baidu_appDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找百度应用列表
 * @param {BaiduAppSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<BaiduAppModel[]>} 
 */
export async function findAll(
  search?: BaiduAppSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<BaiduAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: BaiduAppModel[] = await baidu_appDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: BaiduAppInput,
) {
  const data = await baidu_appDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个百度应用
 * @param {BaiduAppSearch} search? 搜索条件
 */
export async function findOne(
  search?: BaiduAppSearch,
  sort?: SortInput|SortInput[],
): Promise<BaiduAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await baidu_appDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找百度应用
 * @param {BaiduAppId} id
 */
export async function findById(
  id?: BaiduAppId | null,
): Promise<BaiduAppModel | undefined> {
  const model = await baidu_appDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找百度应用是否存在
 * @param {BaiduAppSearch} search? 搜索条件
 */
export async function exist(
  search?: BaiduAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await baidu_appDao.exist(search);
  return data;
}

/**
 * 根据 id 查找百度应用是否存在
 * @param {BaiduAppId} id
 */
export async function existById(
  id?: BaiduAppId | null,
): Promise<boolean> {
  const data = await baidu_appDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验百度应用
 * @param input 
 */
export async function validate(
  input: BaiduAppInput,
): Promise<void> {
  const data = await baidu_appDao.validate(input);
  return data;
}

/**
 * 批量创建百度应用
 * @param {BaiduAppInput[]} inputs
 * @return {Promise<BaiduAppId[]>} ids
 */
export async function creates(
  inputs: BaiduAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<BaiduAppId[]> {
  const ids = await baidu_appDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改百度应用
 * @param {BaiduAppId} id
 * @param {BaiduAppInput} input
 * @return {Promise<BaiduAppId>}
 */
export async function updateById(
  id: BaiduAppId,
  input: BaiduAppInput,
): Promise<BaiduAppId> {
  
  const is_locked = await baidu_appDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2 = await baidu_appDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除百度应用
 * @param {BaiduAppId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: BaiduAppId[],
): Promise<number> {
  
  {
    const models = await baidu_appDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw await ns("不能删除已经锁定的 {0}", "百度应用");
      }
    }
  }
  
  const data = await baidu_appDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用百度应用
 * @param {BaiduAppId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: BaiduAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await baidu_appDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁百度应用
 * @param {BaiduAppId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: BaiduAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await baidu_appDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原百度应用
 * @param {BaiduAppId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: BaiduAppId[],
): Promise<number> {
  const data = await baidu_appDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除百度应用
 * @param {BaiduAppId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: BaiduAppId[],
): Promise<number> {
  const data = await baidu_appDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取百度应用字段注释
 */
export async function getFieldComments(): Promise<BaiduAppFieldComment> {
  const data = await baidu_appDao.getFieldComments();
  return data;
}

/**
 * 查找 百度应用 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await baidu_appDao.findLastOrderBy();
  return data;
}
