import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as domainDao from "./domain.dao.ts";

async function setSearchQuery(
  _search: DomainSearch,
) {
  
}

/**
 * 根据条件查找域名总数
 */
export async function findCount(
  search?: DomainSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await domainDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找域名列表
 */
export async function findAll(
  search?: DomainSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DomainModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: DomainModel[] = await domainDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: DomainInput,
) {
  const data = await domainDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个域名
 */
export async function findOne(
  search?: DomainSearch,
  sort?: SortInput[],
): Promise<DomainModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await domainDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找域名
 */
export async function findById(
  id?: DomainId | null,
): Promise<DomainModel | undefined> {
  const model = await domainDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找域名是否存在
 */
export async function exist(
  search?: DomainSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await domainDao.exist(search);
  return data;
}

/**
 * 根据 id 查找域名是否存在
 */
export async function existById(
  id?: DomainId | null,
): Promise<boolean> {
  const data = await domainDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验域名
 */
export async function validate(
  input: DomainInput,
): Promise<void> {
  const data = await domainDao.validate(input);
  return data;
}

/**
 * 批量创建域名
 */
export async function creates(
  inputs: DomainInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DomainId[]> {
  const ids = await domainDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改域名
 */
export async function updateById(
  id: DomainId,
  input: DomainInput,
): Promise<DomainId> {
  
  const is_locked = await domainDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 域名";
  }
  
  const id2 = await domainDao.updateById(id, input);
  return id2;
}

/** 校验域名是否存在 */
export async function validateOption(
  model0?: DomainModel,
): Promise<DomainModel> {
  const model = await domainDao.validateOption(model0);
  return model;
}

/**
 * 根据 ids 删除域名
 */
export async function deleteByIds(
  ids: DomainId[],
): Promise<number> {
  
  const old_models = await domainDao.findAll({
    ids,
  });
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 域名";
    }
  }
  
  const data = await domainDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 id 设置默认域名
 */
export async function defaultById(
  id: DomainId,
): Promise<number> {
  const data = await domainDao.defaultById(id);
  return data;
}

/**
 * 根据 ids 启用或者禁用域名
 */
export async function enableByIds(
  ids: DomainId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await domainDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁域名
 */
export async function lockByIds(
  ids: DomainId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await domainDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原域名
 */
export async function revertByIds(
  ids: DomainId[],
): Promise<number> {
  const data = await domainDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除域名
 */
export async function forceDeleteByIds(
  ids: DomainId[],
): Promise<number> {
  const data = await domainDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取域名字段注释
 */
export async function getFieldComments(): Promise<DomainFieldComment> {
  const data = await domainDao.getFieldComments();
  return data;
}

/**
 * 查找 域名 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await domainDao.findLastOrderBy();
  return data;
}
