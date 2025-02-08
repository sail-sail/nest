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
  const username = usr_model.username;
  
  if (username !== "admin") {
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
  
  const data = await pt_typeDao.findCount(search);
  return data;
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
  
  const models: PtTypeModel[] = await pt_typeDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: PtTypeInput,
) {
  const data = await pt_typeDao.setIdByLbl(input);
  return data;
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
  
  const model = await pt_typeDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找产品类别
 */
export async function findById(
  id?: PtTypeId | null,
): Promise<PtTypeModel | undefined> {
  const model = await pt_typeDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找产品类别是否存在
 */
export async function exist(
  search?: PtTypeSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await pt_typeDao.exist(search);
  return data;
}

/**
 * 根据 id 查找产品类别是否存在
 */
export async function existById(
  id?: PtTypeId | null,
): Promise<boolean> {
  const data = await pt_typeDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验产品类别
 */
export async function validate(
  input: PtTypeInput,
): Promise<void> {
  const data = await pt_typeDao.validate(input);
  return data;
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
  const ids = await pt_typeDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改产品类别
 */
export async function updateById(
  id: PtTypeId,
  input: PtTypeInput,
): Promise<PtTypeId> {
  
  const is_locked = await pt_typeDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 产品类别";
  }
  
  const id2 = await pt_typeDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除产品类别
 */
export async function deleteByIds(
  ids: PtTypeId[],
): Promise<number> {
  
  {
    const models = await pt_typeDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 产品类别";
      }
    }
  }
  
  const data = await pt_typeDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用产品类别
 */
export async function enableByIds(
  ids: PtTypeId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await pt_typeDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁产品类别
 */
export async function lockByIds(
  ids: PtTypeId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await pt_typeDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原产品类别
 */
export async function revertByIds(
  ids: PtTypeId[],
): Promise<number> {
  const data = await pt_typeDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除产品类别
 */
export async function forceDeleteByIds(
  ids: PtTypeId[],
): Promise<number> {
  const data = await pt_typeDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取产品类别字段注释
 */
export async function getFieldComments(): Promise<PtTypeFieldComment> {
  const data = await pt_typeDao.getFieldComments();
  return data;
}

/**
 * 查找 产品类别 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await pt_typeDao.findLastOrderBy();
  return data;
}
