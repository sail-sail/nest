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
  findByIdUsr,
  validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  isAdmin,
} from "/src/base/usr/usr.dao.ts";

import * as ptDao from "./pt.dao.ts";

async function setSearchQuery(
  search: PtSearch,
) {
  
  const usr_id = await get_usr_id(false);
  const org_id = await get_org_id();
  const usr_model = await validateOptionUsr(
    await findByIdUsr(usr_id),
  );
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
export async function findCountPt(
  search?: PtSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pt_num = await ptDao.findCountPt(search);
  
  return pt_num;
}

/**
 * 根据搜索条件和分页查找产品列表
 */
export async function findAllPt(
  search?: PtSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<PtModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pt_models = await ptDao.findAllPt(search, page, sort);
  
  return pt_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblPt(
  input: PtInput,
): Promise<void> {
  await ptDao.setIdByLblPt(input);
}

/**
 * 根据条件查找第一个产品
 */
export async function findOnePt(
  search?: PtSearch,
  sort?: SortInput[],
): Promise<PtModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pt_model = await ptDao.findOnePt(search, sort);
  
  return pt_model;
}

/**
 * 根据条件查找第一个产品, 如果不存在则抛错
 */
export async function findOneOkPt(
  search?: PtSearch,
  sort?: SortInput[],
): Promise<PtModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pt_model = await ptDao.findOneOkPt(search, sort);
  
  return pt_model;
}

/**
 * 根据 id 查找产品
 */
export async function findByIdPt(
  pt_id: PtId,
): Promise<PtModel | undefined> {
  
  const pt_model = await ptDao.findByIdPt(pt_id);
  
  return pt_model;
}

/**
 * 根据 id 查找产品, 如果不存在则抛错
 */
export async function findByIdOkPt(
  pt_id: PtId,
): Promise<PtModel> {
  
  const pt_model = await ptDao.findByIdOkPt(pt_id);
  
  return pt_model;
}

/**
 * 根据 ids 查找产品
 */
export async function findByIdsPt(
  pt_ids: PtId[],
): Promise<PtModel[]> {
  
  const pt_models = await ptDao.findByIdsPt(pt_ids);
  
  return pt_models;
}

/**
 * 根据 ids 查找产品, 出现查询不到的 id 则报错
 */
export async function findByIdsOkPt(
  pt_ids: PtId[],
): Promise<PtModel[]> {
  
  const pt_models = await ptDao.findByIdsOkPt(pt_ids);
  
  return pt_models;
}

/**
 * 根据搜索条件查找产品是否存在
 */
export async function existPt(
  search?: PtSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const pt_exist = await ptDao.existPt(search);
  
  return pt_exist;
}

/**
 * 根据 id 查找产品是否存在
 */
export async function existByIdPt(
  pt_id?: PtId | null,
): Promise<boolean> {
  
  const pt_exist = await ptDao.existByIdPt(pt_id);
  
  return pt_exist;
}

/**
 * 增加和修改时校验产品
 */
export async function validatePt(
  input: PtInput,
): Promise<void> {
  await ptDao.validatePt(input);
}

/**
 * 批量创建产品
 */
export async function createsPt(
  inputs: PtInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<PtId[]> {
  const pt_ids = await ptDao.createsPt(inputs, options);
  
  return pt_ids;
}

/**
 * 根据 id 修改产品
 */
export async function updateByIdPt(
  pt_id: PtId,
  input: PtInput,
): Promise<PtId> {
  
  const is_locked = await ptDao.getIsLockedByIdPt(pt_id);
  if (is_locked) {
    throw "不能修改已经锁定的 产品";
  }
  
  const pt_id2 = await ptDao.updateByIdPt(pt_id, input);
  
  return pt_id2;
}

/** 校验产品是否存在 */
export async function validateOptionPt(
  model0?: PtModel,
): Promise<PtModel> {
  const pt_model = await ptDao.validateOptionPt(model0);
  return pt_model;
}

/**
 * 根据 ids 删除产品
 */
export async function deleteByIdsPt(
  pt_ids: PtId[],
): Promise<number> {
  
  const old_models = await ptDao.findByIdsPt(pt_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 产品";
    }
  }
  
  const pt_num = await ptDao.deleteByIdsPt(pt_ids);
  return pt_num;
}

/**
 * 根据 ids 启用或者禁用产品
 */
export async function enableByIdsPt(
  ids: PtId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const pt_num = await ptDao.enableByIdsPt(ids, is_enabled);
  return pt_num;
}

/**
 * 根据 ids 锁定或者解锁产品
 */
export async function lockByIdsPt(
  pt_ids: PtId[],
  is_locked: 0 | 1,
): Promise<number> {
  const pt_num = await ptDao.lockByIdsPt(pt_ids, is_locked);
  return pt_num;
}

/**
 * 根据 ids 还原产品
 */
export async function revertByIdsPt(
  pt_ids: PtId[],
): Promise<number> {
  
  const pt_num = await ptDao.revertByIdsPt(pt_ids);
  
  return pt_num;
}

/**
 * 根据 ids 彻底删除产品
 */
export async function forceDeleteByIdsPt(
  pt_ids: PtId[],
): Promise<number> {
  
  const pt_num = await ptDao.forceDeleteByIdsPt(pt_ids);
  
  return pt_num;
}

/**
 * 获取产品字段注释
 */
export async function getFieldCommentsPt(): Promise<PtFieldComment> {
  const pt_fields = await ptDao.getFieldCommentsPt();
  return pt_fields;
}

/**
 * 查找 产品 order_by 字段的最大值
 */
export async function findLastOrderByPt(
): Promise<number> {
  const pt_sort = await ptDao.findLastOrderByPt();
  return pt_sort;
}
