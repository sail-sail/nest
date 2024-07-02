import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as optionsDao from "./options.dao.ts";

async function setSearchQuery(
  _search: OptionsSearch,
) {
  
}

/**
 * 根据条件查找系统选项总数
 * @param {OptionsSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: OptionsSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await optionsDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找系统选项列表
 * @param {OptionsSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<OptionsModel[]>} 
 */
export async function findAll(
  search?: OptionsSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<OptionsModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: OptionsModel[] = await optionsDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: OptionsInput,
) {
  const data = await optionsDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个系统选项
 * @param {OptionsSearch} search? 搜索条件
 */
export async function findOne(
  search?: OptionsSearch,
  sort?: SortInput|SortInput[],
): Promise<OptionsModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await optionsDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找系统选项
 * @param {OptionsId} id
 */
export async function findById(
  id?: OptionsId | null,
): Promise<OptionsModel | undefined> {
  const model = await optionsDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找系统选项是否存在
 * @param {OptionsSearch} search? 搜索条件
 */
export async function exist(
  search?: OptionsSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await optionsDao.exist(search);
  return data;
}

/**
 * 根据 id 查找系统选项是否存在
 * @param {OptionsId} id
 */
export async function existById(
  id?: OptionsId | null,
): Promise<boolean> {
  const data = await optionsDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验系统选项
 * @param input 
 */
export async function validate(
  input: OptionsInput,
): Promise<void> {
  const data = await optionsDao.validate(input);
  return data;
}

/**
 * 批量创建系统选项
 * @param {OptionsInput[]} inputs
 * @return {Promise<OptionsId[]>} ids
 */
export async function creates(
  inputs: OptionsInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<OptionsId[]> {
  const ids = await optionsDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 获取系统选项版本号
 */
export async function getVersionById(id: OptionsId) {
  const version = await optionsDao.getVersionById(id);
  return version;
}

/**
 * 根据 id 修改系统选项
 * @param {OptionsId} id
 * @param {OptionsInput} input
 * @return {Promise<OptionsId>}
 */
export async function updateById(
  id: OptionsId,
  input: OptionsInput,
): Promise<OptionsId> {
  
  const is_locked = await optionsDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  // 不能修改系统记录的系统字段
  const model = await optionsDao.findById(id);
  if (model && model.is_sys === 1) {
    // 名称
    input.lbl = undefined;
    // 键
    input.ky = undefined;
  }
  
  const id2 = await optionsDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除系统选项
 * @param {OptionsId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: OptionsId[],
): Promise<number> {
  
  {
    const models = await optionsDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw await ns("不能删除已经锁定的 {0}", "系统选项");
      }
    }
  }
  
  {
    const models = await optionsDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw await ns("不能删除系统记录");
      }
    }
  }
  
  const data = await optionsDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用系统选项
 * @param {OptionsId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: OptionsId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await optionsDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁系统选项
 * @param {OptionsId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: OptionsId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await optionsDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原系统选项
 * @param {OptionsId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: OptionsId[],
): Promise<number> {
  const data = await optionsDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除系统选项
 * @param {OptionsId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: OptionsId[],
): Promise<number> {
  const data = await optionsDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取系统选项字段注释
 */
export async function getFieldComments(): Promise<OptionsFieldComment> {
  const data = await optionsDao.getFieldComments();
  return data;
}

/**
 * 查找 系统选项 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await optionsDao.findLastOrderBy();
  return data;
}
