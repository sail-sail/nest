import {
  ns,
} from "/src/base/i18n/i18n.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  LangInput,
  LangModel,
  LangSearch,
  LangFieldComment,
} from "./lang.model.ts";

import * as langDao from "./lang.dao.ts";

/**
 * 根据条件查找总数
 * @param {LangSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: LangSearch,
): Promise<number> {
  search = search || { };
  const data = await langDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {LangSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<LangModel[]>} 
 */
export async function findAll(
  search?: LangSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<LangModel[]> {
  search = search || { };
  const models: LangModel[] = await langDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: LangInput,
) {
  const data = await langDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {LangSearch} search? 搜索条件
 */
export async function findOne(
  search?: LangSearch,
  sort?: SortInput|SortInput[],
): Promise<LangModel | undefined> {
  search = search || { };
  const model = await langDao.findOne(search, sort);
  return model;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
): Promise<LangModel | undefined> {
  const model = await langDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {LangSearch} search? 搜索条件
 */
export async function exist(
  search?: LangSearch,
): Promise<boolean> {
  search = search || { };
  const data = await langDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
): Promise<boolean> {
  const data = await langDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: LangInput,
): Promise<void> {
  const data = await langDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {LangInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: LangInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const data = await langDao.create(input, options);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {LangInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: LangInput,
): Promise<string> {
  
  // 不能修改系统记录的系统字段
  const model = await langDao.findById(id);
  if (model && model.is_sys === 1) {
  }
  
  const data = await langDao.updateById(id, input);
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
      const model = await langDao.findById(id);
      if (model && model.is_sys === 1) {
        continue;
      }
      ids2.push(id);
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除系统记录");
    }
    ids = ids2;
  }
  
  const data = await langDao.deleteByIds(ids);
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
  const data = await langDao.enableByIds(ids, is_enabled);
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
  const data = await langDao.revertByIds(ids);
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
  const data = await langDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<LangFieldComment> {
  const data = await langDao.getFieldComments();
  return data;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await langDao.findLastOrderBy();
  return data;
}
