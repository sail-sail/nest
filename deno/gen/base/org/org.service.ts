import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as orgDao from "./org.dao.ts";

async function setSearchQuery(
  _search: OrgSearch,
) {
  
}

/**
 * 根据条件查找组织总数
 */
export async function findCount(
  search?: OrgSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await orgDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找组织列表
 */
export async function findAll(
  search?: OrgSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OrgModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: OrgModel[] = await orgDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: OrgInput,
) {
  const data = await orgDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个组织
 */
export async function findOne(
  search?: OrgSearch,
  sort?: SortInput[],
): Promise<OrgModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await orgDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找组织
 */
export async function findById(
  id?: OrgId | null,
): Promise<OrgModel | undefined> {
  const model = await orgDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找组织是否存在
 */
export async function exist(
  search?: OrgSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await orgDao.exist(search);
  return data;
}

/**
 * 根据 id 查找组织是否存在
 */
export async function existById(
  id?: OrgId | null,
): Promise<boolean> {
  const data = await orgDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验组织
 */
export async function validate(
  input: OrgInput,
): Promise<void> {
  const data = await orgDao.validate(input);
  return data;
}

/**
 * 批量创建组织
 */
export async function creates(
  inputs: OrgInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<OrgId[]> {
  const ids = await orgDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改组织
 */
export async function updateById(
  id: OrgId,
  input: OrgInput,
): Promise<OrgId> {
  
  const is_locked = await orgDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 组织";
  }
  
  const id2 = await orgDao.updateById(id, input);
  return id2;
}

/** 校验组织是否存在 */
export async function validateOption(
  model0?: OrgModel,
): Promise<OrgModel> {
  const model = await orgDao.validateOption(model0);
  return model;
}

/**
 * 根据 ids 删除组织
 */
export async function deleteByIds(
  ids: OrgId[],
): Promise<number> {
  
  {
    const models = await orgDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 组织";
      }
    }
  }
  
  const data = await orgDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用组织
 */
export async function enableByIds(
  ids: OrgId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await orgDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁组织
 */
export async function lockByIds(
  ids: OrgId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await orgDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原组织
 */
export async function revertByIds(
  ids: OrgId[],
): Promise<number> {
  const data = await orgDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除组织
 */
export async function forceDeleteByIds(
  ids: OrgId[],
): Promise<number> {
  const data = await orgDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取组织字段注释
 */
export async function getFieldComments(): Promise<OrgFieldComment> {
  const data = await orgDao.getFieldComments();
  return data;
}

/**
 * 查找 组织 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await orgDao.findLastOrderBy();
  return data;
}
