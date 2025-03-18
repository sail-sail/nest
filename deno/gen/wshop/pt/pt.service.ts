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

import * as ptDao from "./pt.dao.ts";

async function setSearchQuery(
  search: PtSearch,
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
 * 根据条件查找产品总数
 */
export async function findCount(
  search?: PtSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pt_num = await ptDao.findCount(search);
  
  return pt_num;
}

/**
 * 根据搜索条件和分页查找产品列表
 */
export async function findAll(
  search?: PtSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<PtModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pt_models = await ptDao.findAll(search, page, sort);
  
  return pt_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: PtInput,
): Promise<void> {
  await ptDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个产品
 */
export async function findOne(
  search?: PtSearch,
  sort?: SortInput[],
): Promise<PtModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pt_model = await ptDao.findOne(search, sort);
  
  return pt_model;
}

/**
 * 根据 id 查找产品
 */
export async function findById(
  pt_id?: PtId | null,
): Promise<PtModel | undefined> {
  
  const pt_model = await ptDao.findById(pt_id);
  
  return pt_model;
}

/**
 * 根据 ids 查找产品
 */
export async function findByIds(
  pt_ids: PtId[],
): Promise<PtModel[]> {
  
  const pt_models = await ptDao.findByIds(pt_ids);
  
  return pt_models;
}

/**
 * 根据搜索条件查找产品是否存在
 */
export async function exist(
  search?: PtSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pt_exist = await ptDao.exist(search);
  
  return pt_exist;
}

/**
 * 根据 id 查找产品是否存在
 */
export async function existById(
  pt_id?: PtId | null,
): Promise<boolean> {
  
  const pt_exist = await ptDao.existById(pt_id);
  
  return pt_exist;
}

/**
 * 增加和修改时校验产品
 */
export async function validate(
  input: PtInput,
): Promise<void> {
  await ptDao.validate(input);
}

/**
 * 批量创建产品
 */
export async function creates(
  inputs: PtInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<PtId[]> {
  const pt_ids = await ptDao.creates(inputs, options);
  
  return pt_ids;
}

/**
 * 根据 id 修改产品
 */
export async function updateById(
  pt_id: PtId,
  input: PtInput,
): Promise<PtId> {
  
  const is_locked = await ptDao.getIsLockedById(pt_id);
  if (is_locked) {
    throw "不能修改已经锁定的 产品";
  }
  
  const pt_id2 = await ptDao.updateById(pt_id, input);
  
  return pt_id2;
}

/** 校验产品是否存在 */
export async function validateOption(
  model0?: PtModel,
): Promise<PtModel> {
  const pt_model = await ptDao.validateOption(model0);
  return pt_model;
}

/**
 * 根据 ids 删除产品
 */
export async function deleteByIds(
  pt_ids: PtId[],
): Promise<number> {
  
  const old_models = await ptDao.findByIds(pt_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 产品";
    }
  }
  
  const pt_num = await ptDao.deleteByIds(pt_ids);
  return pt_num;
}

/**
 * 根据 ids 启用或者禁用产品
 */
export async function enableByIds(
  ids: PtId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const pt_num = await ptDao.enableByIds(ids, is_enabled);
  return pt_num;
}

/**
 * 根据 ids 锁定或者解锁产品
 */
export async function lockByIds(
  pt_ids: PtId[],
  is_locked: 0 | 1,
): Promise<number> {
  const pt_num = await ptDao.lockByIds(pt_ids, is_locked);
  return pt_num;
}

/**
 * 根据 ids 还原产品
 */
export async function revertByIds(
  pt_ids: PtId[],
): Promise<number> {
  
  const pt_num = await ptDao.revertByIds(pt_ids);
  
  return pt_num;
}

/**
 * 根据 ids 彻底删除产品
 */
export async function forceDeleteByIds(
  pt_ids: PtId[],
): Promise<number> {
  
  const pt_num = await ptDao.forceDeleteByIds(pt_ids);
  
  return pt_num;
}

/**
 * 获取产品字段注释
 */
export async function getFieldComments(): Promise<PtFieldComment> {
  const pt_fields = await ptDao.getFieldComments();
  return pt_fields;
}

/**
 * 查找 产品 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const pt_sort = await ptDao.findLastOrderBy();
  return pt_sort;
}
