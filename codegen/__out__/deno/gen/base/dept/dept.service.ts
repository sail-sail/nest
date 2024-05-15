import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as deptDao from "./dept.dao.ts";

/**
 * 根据条件查找部门总数
 * @param {DeptSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: DeptSearch,
): Promise<number> {
  search = search || { };
  const data = await deptDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找部门列表
 * @param {DeptSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<DeptModel[]>} 
 */
export async function findAll(
  search?: DeptSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<DeptModel[]> {
  search = search || { };
  const models: DeptModel[] = await deptDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: DeptInput,
) {
  const data = await deptDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个部门
 * @param {DeptSearch} search? 搜索条件
 */
export async function findOne(
  search?: DeptSearch,
  sort?: SortInput|SortInput[],
): Promise<DeptModel | undefined> {
  search = search || { };
  const model = await deptDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找部门
 * @param {DeptId} id
 */
export async function findById(
  id?: DeptId | null,
): Promise<DeptModel | undefined> {
  const model = await deptDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找部门是否存在
 * @param {DeptSearch} search? 搜索条件
 */
export async function exist(
  search?: DeptSearch,
): Promise<boolean> {
  search = search || { };
  const data = await deptDao.exist(search);
  return data;
}

/**
 * 根据 id 查找部门是否存在
 * @param {DeptId} id
 */
export async function existById(
  id?: DeptId | null,
): Promise<boolean> {
  const data = await deptDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验部门
 * @param input 
 */
export async function validate(
  input: DeptInput,
): Promise<void> {
  const data = await deptDao.validate(input);
  return data;
}

/**
 * 批量创建部门
 * @param {DeptInput[]} inputs
 * @return {Promise<DeptId[]>} ids
 */
export async function creates(
  inputs: DeptInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DeptId[]> {
  const ids = await deptDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改部门
 * @param {DeptId} id
 * @param {DeptInput} input
 * @return {Promise<DeptId>}
 */
export async function updateById(
  id: DeptId,
  input: DeptInput,
): Promise<DeptId> {
  
  const is_locked = await deptDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2 = await deptDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除部门
 * @param {DeptId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: DeptId[],
): Promise<number> {
  
  {
    const models = await deptDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw await ns("不能删除已经锁定的 {0}", "部门");
      }
    }
  }
  
  const data = await deptDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用部门
 * @param {DeptId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: DeptId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await deptDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁部门
 * @param {DeptId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: DeptId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await deptDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原部门
 * @param {DeptId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: DeptId[],
): Promise<number> {
  const data = await deptDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除部门
 * @param {DeptId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: DeptId[],
): Promise<number> {
  const data = await deptDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取部门字段注释
 */
export async function getFieldComments(): Promise<DeptFieldComment> {
  const data = await deptDao.getFieldComments();
  return data;
}

/**
 * 查找 部门 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await deptDao.findLastOrderBy();
  return data;
}
