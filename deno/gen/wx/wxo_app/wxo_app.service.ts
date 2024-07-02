import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as wxo_appDao from "./wxo_app.dao.ts";

async function setSearchQuery(
  _search: WxoAppSearch,
) {
  
}

/**
 * 根据条件查找公众号设置总数
 * @param {WxoAppSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxoAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wxo_appDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找公众号设置列表
 * @param {WxoAppSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<WxoAppModel[]>} 
 */
export async function findAll(
  search?: WxoAppSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<WxoAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: WxoAppModel[] = await wxo_appDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxoAppInput,
) {
  const data = await wxo_appDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个公众号设置
 * @param {WxoAppSearch} search? 搜索条件
 */
export async function findOne(
  search?: WxoAppSearch,
  sort?: SortInput|SortInput[],
): Promise<WxoAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await wxo_appDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找公众号设置
 * @param {WxoAppId} id
 */
export async function findById(
  id?: WxoAppId | null,
): Promise<WxoAppModel | undefined> {
  const model = await wxo_appDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找公众号设置是否存在
 * @param {WxoAppSearch} search? 搜索条件
 */
export async function exist(
  search?: WxoAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wxo_appDao.exist(search);
  return data;
}

/**
 * 根据 id 查找公众号设置是否存在
 * @param {WxoAppId} id
 */
export async function existById(
  id?: WxoAppId | null,
): Promise<boolean> {
  const data = await wxo_appDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验公众号设置
 * @param input 
 */
export async function validate(
  input: WxoAppInput,
): Promise<void> {
  const data = await wxo_appDao.validate(input);
  return data;
}

/**
 * 批量创建公众号设置
 * @param {WxoAppInput[]} inputs
 * @return {Promise<WxoAppId[]>} ids
 */
export async function creates(
  inputs: WxoAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxoAppId[]> {
  const ids = await wxo_appDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改公众号设置
 * @param {WxoAppId} id
 * @param {WxoAppInput} input
 * @return {Promise<WxoAppId>}
 */
export async function updateById(
  id: WxoAppId,
  input: WxoAppInput,
): Promise<WxoAppId> {
  
  const is_locked = await wxo_appDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2 = await wxo_appDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除公众号设置
 * @param {WxoAppId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxoAppId[],
): Promise<number> {
  
  {
    const models = await wxo_appDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw await ns("不能删除已经锁定的 {0}", "公众号设置");
      }
    }
  }
  
  const data = await wxo_appDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用公众号设置
 * @param {WxoAppId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: WxoAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await wxo_appDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁公众号设置
 * @param {WxoAppId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: WxoAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await wxo_appDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原公众号设置
 * @param {WxoAppId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxoAppId[],
): Promise<number> {
  const data = await wxo_appDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除公众号设置
 * @param {WxoAppId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxoAppId[],
): Promise<number> {
  const data = await wxo_appDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取公众号设置字段注释
 */
export async function getFieldComments(): Promise<WxoAppFieldComment> {
  const data = await wxo_appDao.getFieldComments();
  return data;
}

/**
 * 查找 公众号设置 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await wxo_appDao.findLastOrderBy();
  return data;
}
