import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as companyDao from "./company.dao.ts";

async function setSearchQuery(
  _search: CompanySearch,
) {
  
}

/**
 * 根据条件查找单位总数
 */
export async function findCount(
  search?: CompanySearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await companyDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找单位列表
 */
export async function findAll(
  search?: CompanySearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<CompanyModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: CompanyModel[] = await companyDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: CompanyInput,
) {
  const data = await companyDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个单位
 */
export async function findOne(
  search?: CompanySearch,
  sort?: SortInput[],
): Promise<CompanyModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await companyDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找单位
 */
export async function findById(
  id?: CompanyId | null,
): Promise<CompanyModel | undefined> {
  const model = await companyDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找单位是否存在
 */
export async function exist(
  search?: CompanySearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await companyDao.exist(search);
  return data;
}

/**
 * 根据 id 查找单位是否存在
 */
export async function existById(
  id?: CompanyId | null,
): Promise<boolean> {
  const data = await companyDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验单位
 */
export async function validate(
  input: CompanyInput,
): Promise<void> {
  const data = await companyDao.validate(input);
  return data;
}

/**
 * 批量创建单位
 */
export async function creates(
  inputs: CompanyInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CompanyId[]> {
  const ids = await companyDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改单位
 */
export async function updateById(
  id: CompanyId,
  input: CompanyInput,
): Promise<CompanyId> {
  
  const is_locked = await companyDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 单位";
  }
  
  const id2 = await companyDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除单位
 */
export async function deleteByIds(
  ids: CompanyId[],
): Promise<number> {
  
  {
    const models = await companyDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 单位";
      }
    }
  }
  
  const data = await companyDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用单位
 */
export async function enableByIds(
  ids: CompanyId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await companyDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁单位
 */
export async function lockByIds(
  ids: CompanyId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await companyDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原单位
 */
export async function revertByIds(
  ids: CompanyId[],
): Promise<number> {
  const data = await companyDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除单位
 */
export async function forceDeleteByIds(
  ids: CompanyId[],
): Promise<number> {
  const data = await companyDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取单位字段注释
 */
export async function getFieldComments(): Promise<CompanyFieldComment> {
  const data = await companyDao.getFieldComments();
  return data;
}

/**
 * 查找 单位 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await companyDao.findLastOrderBy();
  return data;
}
