import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  get_usr_id,
  get_org_id,
} from "/lib/auth/auth.dao.ts";

import {
  findById as findByIdUsr,
  validateOption as validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  isAdmin,
} from "/src/base/usr/usr.dao.ts";

import * as pt_typeDao from "./pt_type.dao.ts";

async function setSearchQuery(
  search: PtTypeSearch,
) {
  
  const usr_id = await get_usr_id();
  const org_id = await get_org_id();
  const usr_model = await findByIdUsr(usr_id);
  if (!usr_id || !usr_model) {
    throw new Error("usr_id can not be null");
  }
  const org_ids: OrgId[] = [ ];
  if (org_id) {
    org_ids.push(org_id);
  } else {
    org_ids.push(...usr_model.org_ids);
    org_ids.push("" as OrgId);
  }
  
  if (!await isAdmin(usr_id)) {
    search.org_id = org_ids;
  }
  
}

/**
 * 根据条件查找产品类别总数
 */
export async function findCount(
  search?: PtTypeSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pt_type_num = await pt_typeDao.findCount(search);
  
  return pt_type_num;
}

/**
 * 根据搜索条件和分页查找产品类别列表
 */
export async function findAll(
  search?: PtTypeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<PtTypeModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pt_type_models = await pt_typeDao.findAll(search, page, sort);
  
  return pt_type_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: PtTypeInput,
): Promise<void> {
  await pt_typeDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个产品类别
 */
export async function findOne(
  search?: PtTypeSearch,
  sort?: SortInput[],
): Promise<PtTypeModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pt_type_model = await pt_typeDao.findOne(search, sort);
  
  return pt_type_model;
}

/**
 * 根据 id 查找产品类别
 */
export async function findById(
  pt_type_id?: PtTypeId | null,
): Promise<PtTypeModel | undefined> {
  
  const pt_type_model = await pt_typeDao.findById(pt_type_id);
  
  return pt_type_model;
}

/**
 * 根据 ids 查找产品类别
 */
export async function findByIds(
  pt_type_ids: PtTypeId[],
): Promise<PtTypeModel[]> {
  
  const pt_type_models = await pt_typeDao.findByIds(pt_type_ids);
  
  return pt_type_models;
}

/**
 * 根据搜索条件查找产品类别是否存在
 */
export async function exist(
  search?: PtTypeSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pt_type_exist = await pt_typeDao.exist(search);
  
  return pt_type_exist;
}

/**
 * 根据 id 查找产品类别是否存在
 */
export async function existById(
  pt_type_id?: PtTypeId | null,
): Promise<boolean> {
  
  const pt_type_exist = await pt_typeDao.existById(pt_type_id);
  
  return pt_type_exist;
}

/**
 * 增加和修改时校验产品类别
 */
export async function validate(
  input: PtTypeInput,
): Promise<void> {
  await pt_typeDao.validate(input);
}

/**
 * 批量创建产品类别
 */
export async function creates(
  inputs: PtTypeInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<PtTypeId[]> {
  const pt_type_ids = await pt_typeDao.creates(inputs, options);
  
  return pt_type_ids;
}

/**
 * 根据 id 修改产品类别
 */
export async function updateById(
  pt_type_id: PtTypeId,
  input: PtTypeInput,
): Promise<PtTypeId> {
  
  const is_locked = await pt_typeDao.getIsLockedById(pt_type_id);
  if (is_locked) {
    throw "不能修改已经锁定的 产品类别";
  }
  
  const pt_type_id2 = await pt_typeDao.updateById(pt_type_id, input);
  
  return pt_type_id2;
}

/** 校验产品类别是否存在 */
export async function validateOption(
  model0?: PtTypeModel,
): Promise<PtTypeModel> {
  const pt_type_model = await pt_typeDao.validateOption(model0);
  return pt_type_model;
}

/**
 * 根据 ids 删除产品类别
 */
export async function deleteByIds(
  pt_type_ids: PtTypeId[],
): Promise<number> {
  
  const old_models = await pt_typeDao.findByIds(pt_type_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 产品类别";
    }
  }
  
  const pt_type_num = await pt_typeDao.deleteByIds(pt_type_ids);
  return pt_type_num;
}

/**
 * 根据 ids 启用或者禁用产品类别
 */
export async function enableByIds(
  ids: PtTypeId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const pt_type_num = await pt_typeDao.enableByIds(ids, is_enabled);
  return pt_type_num;
}

/**
 * 根据 ids 锁定或者解锁产品类别
 */
export async function lockByIds(
  pt_type_ids: PtTypeId[],
  is_locked: 0 | 1,
): Promise<number> {
  const pt_type_num = await pt_typeDao.lockByIds(pt_type_ids, is_locked);
  return pt_type_num;
}

/**
 * 根据 ids 还原产品类别
 */
export async function revertByIds(
  pt_type_ids: PtTypeId[],
): Promise<number> {
  
  const pt_type_num = await pt_typeDao.revertByIds(pt_type_ids);
  
  return pt_type_num;
}

/**
 * 根据 ids 彻底删除产品类别
 */
export async function forceDeleteByIds(
  pt_type_ids: PtTypeId[],
): Promise<number> {
  
  const pt_type_num = await pt_typeDao.forceDeleteByIds(pt_type_ids);
  
  return pt_type_num;
}

/**
 * 获取产品类别字段注释
 */
export async function getFieldComments(): Promise<PtTypeFieldComment> {
  const pt_type_fields = await pt_typeDao.getFieldComments();
  return pt_type_fields;
}

/**
 * 查找 产品类别 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const pt_type_sort = await pt_typeDao.findLastOrderBy();
  return pt_type_sort;
}
