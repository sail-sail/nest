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
  
  const org_num = await orgDao.findCount(search);
  
  return org_num;
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
  
  const org_models = await orgDao.findAll(search, page, sort);
  
  return org_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: OrgInput,
): Promise<void> {
  await orgDao.setIdByLbl(input);
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
  
  const org_model = await orgDao.findOne(search, sort);
  
  return org_model;
}

/**
 * 根据 id 查找组织
 */
export async function findById(
  org_id?: OrgId | null,
): Promise<OrgModel | undefined> {
  
  const org_model = await orgDao.findById(org_id);
  
  return org_model;
}

/**
 * 根据 ids 查找组织
 */
export async function findByIds(
  org_ids: OrgId[],
): Promise<OrgModel[]> {
  
  const org_models = await orgDao.findByIds(org_ids);
  
  return org_models;
}

/**
 * 根据搜索条件查找组织是否存在
 */
export async function exist(
  search?: OrgSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const org_exist = await orgDao.exist(search);
  
  return org_exist;
}

/**
 * 根据 id 查找组织是否存在
 */
export async function existById(
  org_id?: OrgId | null,
): Promise<boolean> {
  
  const org_exist = await orgDao.existById(org_id);
  
  return org_exist;
}

/**
 * 增加和修改时校验组织
 */
export async function validate(
  input: OrgInput,
): Promise<void> {
  await orgDao.validate(input);
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
  const org_ids = await orgDao.creates(inputs, options);
  
  return org_ids;
}

/**
 * 根据 id 修改组织
 */
export async function updateById(
  org_id: OrgId,
  input: OrgInput,
): Promise<OrgId> {
  
  const is_locked = await orgDao.getIsLockedById(org_id);
  if (is_locked) {
    throw "不能修改已经锁定的 组织";
  }
  
  const org_id2 = await orgDao.updateById(org_id, input);
  
  return org_id2;
}

/** 校验组织是否存在 */
export async function validateOption(
  model0?: OrgModel,
): Promise<OrgModel> {
  const org_model = await orgDao.validateOption(model0);
  return org_model;
}

/**
 * 根据 ids 删除组织
 */
export async function deleteByIds(
  org_ids: OrgId[],
): Promise<number> {
  
  const old_models = await orgDao.findByIds(org_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 组织";
    }
  }
  
  const org_num = await orgDao.deleteByIds(org_ids);
  return org_num;
}

/**
 * 根据 ids 启用或者禁用组织
 */
export async function enableByIds(
  ids: OrgId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const org_num = await orgDao.enableByIds(ids, is_enabled);
  return org_num;
}

/**
 * 根据 ids 锁定或者解锁组织
 */
export async function lockByIds(
  org_ids: OrgId[],
  is_locked: 0 | 1,
): Promise<number> {
  const org_num = await orgDao.lockByIds(org_ids, is_locked);
  return org_num;
}

/**
 * 根据 ids 还原组织
 */
export async function revertByIds(
  org_ids: OrgId[],
): Promise<number> {
  
  const org_num = await orgDao.revertByIds(org_ids);
  
  return org_num;
}

/**
 * 根据 ids 彻底删除组织
 */
export async function forceDeleteByIds(
  org_ids: OrgId[],
): Promise<number> {
  
  const org_num = await orgDao.forceDeleteByIds(org_ids);
  
  return org_num;
}

/**
 * 获取组织字段注释
 */
export async function getFieldComments(): Promise<OrgFieldComment> {
  const org_fields = await orgDao.getFieldComments();
  return org_fields;
}

/**
 * 查找 组织 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const org_sort = await orgDao.findLastOrderBy();
  return org_sort;
}
