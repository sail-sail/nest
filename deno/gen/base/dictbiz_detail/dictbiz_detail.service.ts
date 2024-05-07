import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as dictbiz_detailDao from "./dictbiz_detail.dao.ts";

/**
 * 根据条件查找业务字典明细总数
 * @param {DictbizDetailSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: DictbizDetailSearch,
): Promise<number> {
  search = search || { };
  const data = await dictbiz_detailDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找业务字典明细列表
 * @param {DictbizDetailSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<DictbizDetailModel[]>} 
 */
export async function findAll(
  search?: DictbizDetailSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<DictbizDetailModel[]> {
  search = search || { };
  const models: DictbizDetailModel[] = await dictbiz_detailDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: DictbizDetailInput,
) {
  const data = await dictbiz_detailDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个业务字典明细
 * @param {DictbizDetailSearch} search? 搜索条件
 */
export async function findOne(
  search?: DictbizDetailSearch,
  sort?: SortInput|SortInput[],
): Promise<DictbizDetailModel | undefined> {
  search = search || { };
  const model = await dictbiz_detailDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找业务字典明细
 * @param {DictbizDetailId} id
 */
export async function findById(
  id?: DictbizDetailId | null,
): Promise<DictbizDetailModel | undefined> {
  const model = await dictbiz_detailDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找业务字典明细是否存在
 * @param {DictbizDetailSearch} search? 搜索条件
 */
export async function exist(
  search?: DictbizDetailSearch,
): Promise<boolean> {
  search = search || { };
  const data = await dictbiz_detailDao.exist(search);
  return data;
}

/**
 * 根据 id 查找业务字典明细是否存在
 * @param {DictbizDetailId} id
 */
export async function existById(
  id?: DictbizDetailId | null,
): Promise<boolean> {
  const data = await dictbiz_detailDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验业务字典明细
 * @param input 
 */
export async function validate(
  input: DictbizDetailInput,
): Promise<void> {
  const data = await dictbiz_detailDao.validate(input);
  return data;
}

/**
 * 批量创建业务字典明细
 * @param {DictbizDetailInput[]} inputs
 * @return {Promise<DictbizDetailId[]>} ids
 */
export async function creates(
  inputs: DictbizDetailInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DictbizDetailId[]> {
  const ids = await dictbiz_detailDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改业务字典明细
 * @param {DictbizDetailId} id
 * @param {DictbizDetailInput} input
 * @return {Promise<DictbizDetailId>}
 */
export async function updateById(
  id: DictbizDetailId,
  input: DictbizDetailInput,
): Promise<DictbizDetailId> {
  
  const is_locked = await dictbiz_detailDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  // 不能修改系统记录的系统字段
  const model = await dictbiz_detailDao.findById(id);
  if (model && model.is_sys === 1) {
  }
  
  const id2: DictbizDetailId = await dictbiz_detailDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除业务字典明细
 * @param {DictbizDetailId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: DictbizDetailId[],
): Promise<number> {
  
  {
    const ids2: DictbizDetailId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: DictbizDetailId = ids[i];
      const is_locked = await dictbiz_detailDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  {
    const ids2: DictbizDetailId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: DictbizDetailId = ids[i];
      const model = await dictbiz_detailDao.findById(id);
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
  
  const data = await dictbiz_detailDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用业务字典明细
 * @param {DictbizDetailId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: DictbizDetailId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await dictbiz_detailDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁业务字典明细
 * @param {DictbizDetailId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: DictbizDetailId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await dictbiz_detailDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原业务字典明细
 * @param {DictbizDetailId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: DictbizDetailId[],
): Promise<number> {
  const data = await dictbiz_detailDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除业务字典明细
 * @param {DictbizDetailId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: DictbizDetailId[],
): Promise<number> {
  const data = await dictbiz_detailDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取业务字典明细字段注释
 */
export async function getFieldComments(): Promise<DictbizDetailFieldComment> {
  const data = await dictbiz_detailDao.getFieldComments();
  return data;
}

/**
 * 查找 业务字典明细 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await dictbiz_detailDao.findLastOrderBy();
  return data;
}
