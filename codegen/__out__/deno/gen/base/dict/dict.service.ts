import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as dictDao from "./dict.dao.ts";

/**
 * 根据条件查找系统字典总数
 * @param {DictSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: DictSearch,
): Promise<number> {
  search = search || { };
  const data = await dictDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找系统字典列表
 * @param {DictSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<DictModel[]>} 
 */
export async function findAll(
  search?: DictSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<DictModel[]> {
  search = search || { };
  const models: DictModel[] = await dictDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: DictInput,
) {
  const data = await dictDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个系统字典
 * @param {DictSearch} search? 搜索条件
 */
export async function findOne(
  search?: DictSearch,
  sort?: SortInput|SortInput[],
): Promise<DictModel | undefined> {
  search = search || { };
  const model = await dictDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找系统字典
 * @param {DictId} id
 */
export async function findById(
  id?: DictId | null,
): Promise<DictModel | undefined> {
  const model = await dictDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找系统字典是否存在
 * @param {DictSearch} search? 搜索条件
 */
export async function exist(
  search?: DictSearch,
): Promise<boolean> {
  search = search || { };
  const data = await dictDao.exist(search);
  return data;
}

/**
 * 根据 id 查找系统字典是否存在
 * @param {DictId} id
 */
export async function existById(
  id?: DictId | null,
): Promise<boolean> {
  const data = await dictDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验系统字典
 * @param input 
 */
export async function validate(
  input: DictInput,
): Promise<void> {
  const data = await dictDao.validate(input);
  return data;
}

/**
 * 批量创建系统字典
 * @param {DictInput[]} inputs
 * @return {Promise<DictId[]>} ids
 */
export async function creates(
  inputs: DictInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DictId[]> {
  const ids = await dictDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改系统字典
 * @param {DictId} id
 * @param {DictInput} input
 * @return {Promise<DictId>}
 */
export async function updateById(
  id: DictId,
  input: DictInput,
): Promise<DictId> {
  
  const is_locked = await dictDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  // 不能修改系统记录的系统字段
  const model = await dictDao.findById(id);
  if (model && model.is_sys === 1) {
    // 编码
    input.code = undefined;
    // 数据类型
    input.type = undefined;
    input.type_lbl = "";
    // 启用
    input.is_enabled = undefined;
    input.is_enabled_lbl = "";
  }
  
  const id2: DictId = await dictDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除系统字典
 * @param {DictId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: DictId[],
): Promise<number> {
  
  {
    const models = await dictDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw await ns("不能删除已经锁定的 {0}", "系统字典");
      }
    }
  }
  
  {
    const models = await dictDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw await ns("不能删除系统记录");
      }
    }
  }
  
  const data = await dictDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用系统字典
 * @param {DictId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: DictId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await dictDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁系统字典
 * @param {DictId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: DictId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await dictDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原系统字典
 * @param {DictId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: DictId[],
): Promise<number> {
  const data = await dictDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除系统字典
 * @param {DictId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: DictId[],
): Promise<number> {
  const data = await dictDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取系统字典字段注释
 */
export async function getFieldComments(): Promise<DictFieldComment> {
  const data = await dictDao.getFieldComments();
  return data;
}

/**
 * 查找 系统字典 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await dictDao.findLastOrderBy();
  return data;
}
