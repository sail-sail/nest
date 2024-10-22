import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as dictbizDao from "./dictbiz.dao.ts";

async function setSearchQuery(
  _search: DictbizSearch,
) {
  
}

/**
 * 根据条件查找业务字典总数
 */
export async function findCount(
  search?: DictbizSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await dictbizDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找业务字典列表
 */
export async function findAll(
  search?: DictbizSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictbizModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: DictbizModel[] = await dictbizDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: DictbizInput,
) {
  const data = await dictbizDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个业务字典
 */
export async function findOne(
  search?: DictbizSearch,
  sort?: SortInput[],
): Promise<DictbizModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await dictbizDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找业务字典
 */
export async function findById(
  id?: DictbizId | null,
): Promise<DictbizModel | undefined> {
  const model = await dictbizDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找业务字典是否存在
 */
export async function exist(
  search?: DictbizSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await dictbizDao.exist(search);
  return data;
}

/**
 * 根据 id 查找业务字典是否存在
 */
export async function existById(
  id?: DictbizId | null,
): Promise<boolean> {
  const data = await dictbizDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验业务字典
 */
export async function validate(
  input: DictbizInput,
): Promise<void> {
  const data = await dictbizDao.validate(input);
  return data;
}

/**
 * 批量创建业务字典
 */
export async function creates(
  inputs: DictbizInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DictbizId[]> {
  const ids = await dictbizDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改业务字典
 */
export async function updateById(
  id: DictbizId,
  input: DictbizInput,
): Promise<DictbizId> {
  
  const is_locked = await dictbizDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const id2 = await dictbizDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除业务字典
 */
export async function deleteByIds(
  ids: DictbizId[],
): Promise<number> {
  
  {
    const models = await dictbizDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw await ns("不能删除已经锁定的 {0}", "业务字典");
      }
    }
  }
  
  {
    const models = await dictbizDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw await ns("不能删除系统记录");
      }
    }
  }
  
  const data = await dictbizDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用业务字典
 */
export async function enableByIds(
  ids: DictbizId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await dictbizDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁业务字典
 */
export async function lockByIds(
  ids: DictbizId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await dictbizDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原业务字典
 */
export async function revertByIds(
  ids: DictbizId[],
): Promise<number> {
  const data = await dictbizDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除业务字典
 */
export async function forceDeleteByIds(
  ids: DictbizId[],
): Promise<number> {
  const data = await dictbizDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取业务字典字段注释
 */
export async function getFieldComments(): Promise<DictbizFieldComment> {
  const data = await dictbizDao.getFieldComments();
  return data;
}

/**
 * 查找 业务字典 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await dictbizDao.findLastOrderBy();
  return data;
}
