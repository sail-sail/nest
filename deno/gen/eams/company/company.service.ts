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
  
  const company_num = await companyDao.findCount(search);
  
  return company_num;
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
  
  const company_models = await companyDao.findAll(search, page, sort);
  
  return company_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: CompanyInput,
): Promise<void> {
  await companyDao.setIdByLbl(input);
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
  
  const company_model = await companyDao.findOne(search, sort);
  
  return company_model;
}

/**
 * 根据 id 查找单位
 */
export async function findById(
  company_id?: CompanyId | null,
): Promise<CompanyModel | undefined> {
  
  const company_model = await companyDao.findById(company_id);
  
  return company_model;
}

/**
 * 根据 ids 查找单位
 */
export async function findByIds(
  company_ids: CompanyId[],
): Promise<CompanyModel[]> {
  
  const company_models = await companyDao.findByIds(company_ids);
  
  return company_models;
}

/**
 * 根据搜索条件查找单位是否存在
 */
export async function exist(
  search?: CompanySearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const company_exist = await companyDao.exist(search);
  
  return company_exist;
}

/**
 * 根据 id 查找单位是否存在
 */
export async function existById(
  company_id?: CompanyId | null,
): Promise<boolean> {
  
  const company_exist = await companyDao.existById(company_id);
  
  return company_exist;
}

/**
 * 增加和修改时校验单位
 */
export async function validate(
  input: CompanyInput,
): Promise<void> {
  await companyDao.validate(input);
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
  const company_ids = await companyDao.creates(inputs, options);
  
  return company_ids;
}

/**
 * 根据 id 修改单位
 */
export async function updateById(
  company_id: CompanyId,
  input: CompanyInput,
): Promise<CompanyId> {
  
  const is_locked = await companyDao.getIsLockedById(company_id);
  if (is_locked) {
    throw "不能修改已经锁定的 单位";
  }
  
  const company_id2 = await companyDao.updateById(company_id, input);
  
  return company_id2;
}

/** 校验单位是否存在 */
export async function validateOption(
  model0?: CompanyModel,
): Promise<CompanyModel> {
  const company_model = await companyDao.validateOption(model0);
  return company_model;
}

/**
 * 根据 ids 删除单位
 */
export async function deleteByIds(
  company_ids: CompanyId[],
): Promise<number> {
  
  const old_models = await companyDao.findByIds(company_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 单位";
    }
  }
  
  const company_num = await companyDao.deleteByIds(company_ids);
  return company_num;
}

/**
 * 根据 ids 启用或者禁用单位
 */
export async function enableByIds(
  ids: CompanyId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const company_num = await companyDao.enableByIds(ids, is_enabled);
  return company_num;
}

/**
 * 根据 ids 锁定或者解锁单位
 */
export async function lockByIds(
  company_ids: CompanyId[],
  is_locked: 0 | 1,
): Promise<number> {
  const company_num = await companyDao.lockByIds(company_ids, is_locked);
  return company_num;
}

/**
 * 根据 ids 还原单位
 */
export async function revertByIds(
  company_ids: CompanyId[],
): Promise<number> {
  
  const company_num = await companyDao.revertByIds(company_ids);
  
  return company_num;
}

/**
 * 根据 ids 彻底删除单位
 */
export async function forceDeleteByIds(
  company_ids: CompanyId[],
): Promise<number> {
  
  const company_num = await companyDao.forceDeleteByIds(company_ids);
  
  return company_num;
}

/**
 * 获取单位字段注释
 */
export async function getFieldComments(): Promise<CompanyFieldComment> {
  const company_fields = await companyDao.getFieldComments();
  return company_fields;
}

/**
 * 查找 单位 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const company_sort = await companyDao.findLastOrderBy();
  return company_sort;
}
