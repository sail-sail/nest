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
export async function findCountOrg(
  search?: OrgSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const org_num = await orgDao.findCountOrg(search);
  
  return org_num;
}

/**
 * 根据搜索条件和分页查找组织列表
 */
export async function findAllOrg(
  search?: OrgSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OrgModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const org_models = await orgDao.findAllOrg(search, page, sort);
  
  return org_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblOrg(
  input: OrgInput,
): Promise<void> {
  await orgDao.setIdByLblOrg(input);
}

/**
 * 根据条件查找第一个组织
 */
export async function findOneOrg(
  search?: OrgSearch,
  sort?: SortInput[],
): Promise<OrgModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const org_model = await orgDao.findOneOrg(search, sort);
  
  return org_model;
}

/**
 * 根据条件查找第一个组织, 如果不存在则抛错
 */
export async function findOneOkOrg(
  search?: OrgSearch,
  sort?: SortInput[],
): Promise<OrgModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const org_model = await orgDao.findOneOkOrg(search, sort);
  
  return org_model;
}

/**
 * 根据 id 查找组织
 */
export async function findByIdOrg(
  org_id: OrgId,
): Promise<OrgModel | undefined> {
  
  const org_model = await orgDao.findByIdOrg(org_id);
  
  return org_model;
}

/**
 * 根据 id 查找组织, 如果不存在则抛错
 */
export async function findByIdOkOrg(
  org_id: OrgId,
): Promise<OrgModel> {
  
  const org_model = await orgDao.findByIdOkOrg(org_id);
  
  return org_model;
}

/**
 * 根据 ids 查找组织
 */
export async function findByIdsOrg(
  org_ids: OrgId[],
): Promise<OrgModel[]> {
  
  const org_models = await orgDao.findByIdsOrg(org_ids);
  
  return org_models;
}

/**
 * 根据 ids 查找组织, 出现查询不到的 id 则报错
 */
export async function findByIdsOkOrg(
  org_ids: OrgId[],
): Promise<OrgModel[]> {
  
  const org_models = await orgDao.findByIdsOkOrg(org_ids);
  
  return org_models;
}

/**
 * 根据搜索条件查找组织是否存在
 */
export async function existOrg(
  search?: OrgSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const org_exist = await orgDao.existOrg(search);
  
  return org_exist;
}

/**
 * 根据 id 查找组织是否存在
 */
export async function existByIdOrg(
  org_id?: OrgId | null,
): Promise<boolean> {
  
  const org_exist = await orgDao.existByIdOrg(org_id);
  
  return org_exist;
}

/**
 * 增加和修改时校验组织
 */
export async function validateOrg(
  input: OrgInput,
): Promise<void> {
  await orgDao.validateOrg(input);
}

/**
 * 批量创建组织
 */
export async function createsOrg(
  inputs: OrgInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<OrgId[]> {
  const org_ids = await orgDao.createsOrg(inputs, options);
  
  return org_ids;
}

/**
 * 根据 id 修改组织
 */
export async function updateByIdOrg(
  org_id: OrgId,
  input: OrgInput,
): Promise<OrgId> {
  
  const is_locked = await orgDao.getIsLockedByIdOrg(org_id);
  if (is_locked) {
    throw "不能修改已经锁定的 组织";
  }
  
  const org_id2 = await orgDao.updateByIdOrg(org_id, input);
  
  return org_id2;
}

/** 校验组织是否存在 */
export async function validateOptionOrg(
  model0?: OrgModel,
): Promise<OrgModel> {
  const org_model = await orgDao.validateOptionOrg(model0);
  return org_model;
}

/**
 * 根据 ids 删除组织
 */
export async function deleteByIdsOrg(
  org_ids: OrgId[],
): Promise<number> {
  
  const old_models = await orgDao.findByIdsOrg(org_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 组织";
    }
  }
  
  const org_num = await orgDao.deleteByIdsOrg(org_ids);
  return org_num;
}

/**
 * 根据 ids 启用或者禁用组织
 */
export async function enableByIdsOrg(
  ids: OrgId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const org_num = await orgDao.enableByIdsOrg(ids, is_enabled);
  return org_num;
}

/**
 * 根据 ids 锁定或者解锁组织
 */
export async function lockByIdsOrg(
  org_ids: OrgId[],
  is_locked: 0 | 1,
): Promise<number> {
  const org_num = await orgDao.lockByIdsOrg(org_ids, is_locked);
  return org_num;
}

/**
 * 根据 ids 还原组织
 */
export async function revertByIdsOrg(
  org_ids: OrgId[],
): Promise<number> {
  
  const org_num = await orgDao.revertByIdsOrg(org_ids);
  
  return org_num;
}

/**
 * 根据 ids 彻底删除组织
 */
export async function forceDeleteByIdsOrg(
  org_ids: OrgId[],
): Promise<number> {
  
  const org_num = await orgDao.forceDeleteByIdsOrg(org_ids);
  
  return org_num;
}

/**
 * 获取组织字段注释
 */
export async function getFieldCommentsOrg(): Promise<OrgFieldComment> {
  const org_fields = await orgDao.getFieldCommentsOrg();
  return org_fields;
}

/**
 * 查找 组织 order_by 字段的最大值
 */
export async function findLastOrderByOrg(
): Promise<number> {
  const org_sort = await orgDao.findLastOrderByOrg();
  return org_sort;
}
