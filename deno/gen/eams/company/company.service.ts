import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as companyDao from "./company.dao.ts";

/**
 * 根据条件查找单位总数
 * @param {CompanySearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: CompanySearch,
): Promise<number> {
  search = search || { };
  const data = await companyDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找单位列表
 * @param {CompanySearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<CompanyModel[]>} 
 */
export async function findAll(
  search?: CompanySearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<CompanyModel[]> {
  search = search || { };
  const models: CompanyModel[] = await companyDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: CompanyInput,
) {
  const data = await companyDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个单位
 * @param {CompanySearch} search? 搜索条件
 */
export async function findOne(
  search?: CompanySearch,
  sort?: SortInput|SortInput[],
): Promise<CompanyModel | undefined> {
  search = search || { };
  const model = await companyDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找单位
 * @param {CompanyId} id
 */
export async function findById(
  id?: CompanyId | null,
): Promise<CompanyModel | undefined> {
  const model = await companyDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找单位是否存在
 * @param {CompanySearch} search? 搜索条件
 */
export async function exist(
  search?: CompanySearch,
): Promise<boolean> {
  search = search || { };
  const data = await companyDao.exist(search);
  return data;
}

/**
 * 根据 id 查找单位是否存在
 * @param {CompanyId} id
 */
export async function existById(
  id?: CompanyId | null,
): Promise<boolean> {
  const data = await companyDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验单位
 * @param input 
 */
export async function validate(
  input: CompanyInput,
): Promise<void> {
  const data = await companyDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {CompanyInput} input
 * @return {Promise<CompanyId>} id
 */
export async function create(
  input: CompanyInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CompanyId> {
  const id: CompanyId = await companyDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改单位
 * @param {CompanyId} id
 * @param {CompanyInput} input
 * @return {Promise<CompanyId>}
 */
export async function updateById(
  id: CompanyId,
  input: CompanyInput,
): Promise<CompanyId> {
  
  const is_locked = await companyDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2: CompanyId = await companyDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除单位
 * @param {CompanyId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: CompanyId[],
): Promise<number> {
  
  {
    const ids2: CompanyId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: CompanyId = ids[i];
      const is_locked = await companyDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  const data = await companyDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用单位
 * @param {CompanyId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: CompanyId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await companyDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁单位
 * @param {CompanyId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: CompanyId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await companyDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原单位
 * @param {CompanyId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: CompanyId[],
): Promise<number> {
  const data = await companyDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除单位
 * @param {CompanyId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: CompanyId[],
): Promise<number> {
  const data = await companyDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取单位字段注释
 */
export async function getFieldComments(): Promise<CompanyFieldComment> {
  const data = await companyDao.getFieldComments();
  return data;
}

/**
 * 查找 单位 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await companyDao.findLastOrderBy();
  return data;
}
