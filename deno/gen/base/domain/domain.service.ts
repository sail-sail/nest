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
  
  const domain_num = await domainDao.findCount(search);
  
  return domain_num;
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
  
  const domain_models = await domainDao.findAll(search, page, sort);
  
  return domain_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: DomainInput,
): Promise<void> {
  await domainDao.setIdByLbl(input);
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
  
  const domain_model = await domainDao.findOne(search, sort);
  
  return domain_model;
}

/**
 * 根据 id 查找域名
 */
export async function findById(
  domain_id?: DomainId | null,
): Promise<DomainModel | undefined> {
  
  const domain_model = await domainDao.findById(domain_id);
  
  return domain_model;
}

/**
 * 根据 ids 查找域名
 */
export async function findByIds(
  domain_ids: DomainId[],
): Promise<DomainModel[]> {
  
  const domain_models = await domainDao.findByIds(domain_ids);
  
  return domain_models;
}

/**
 * 根据搜索条件查找域名是否存在
 */
export async function exist(
  search?: DomainSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const domain_exist = await domainDao.exist(search);
  
  return domain_exist;
}

/**
 * 根据 id 查找域名是否存在
 */
export async function existById(
  domain_id?: DomainId | null,
): Promise<boolean> {
  
  const domain_exist = await domainDao.existById(domain_id);
  
  return domain_exist;
}

/**
 * 增加和修改时校验域名
 */
export async function validate(
  input: DomainInput,
): Promise<void> {
  await domainDao.validate(input);
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
  const domain_ids = await domainDao.creates(inputs, options);
  
  return domain_ids;
}

/**
 * 根据 id 修改域名
 */
export async function updateById(
  domain_id: DomainId,
  input: DomainInput,
): Promise<DomainId> {
  
  const is_locked = await domainDao.getIsLockedById(domain_id);
  if (is_locked) {
    throw "不能修改已经锁定的 域名";
  }
  
  const domain_id2 = await domainDao.updateById(domain_id, input);
  
  return domain_id2;
}

/** 校验域名是否存在 */
export async function validateOption(
  model0?: DomainModel,
): Promise<DomainModel> {
  const domain_model = await domainDao.validateOption(model0);
  return domain_model;
}

/**
 * 根据 ids 删除域名
 */
export async function deleteByIds(
  domain_ids: DomainId[],
): Promise<number> {
  
  const old_models = await domainDao.findByIds(domain_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 域名";
    }
  }
  
  const domain_num = await domainDao.deleteByIds(domain_ids);
  return domain_num;
}

/**
 * 根据 id 设置默认域名
 */
export async function defaultById(
  id: DomainId,
): Promise<number> {
  const domain_num = await domainDao.defaultById(id);
  return domain_num;
}

/**
 * 根据 ids 启用或者禁用域名
 */
export async function enableByIds(
  ids: DomainId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const domain_num = await domainDao.enableByIds(ids, is_enabled);
  return domain_num;
}

/**
 * 根据 ids 锁定或者解锁域名
 */
export async function lockByIds(
  domain_ids: DomainId[],
  is_locked: 0 | 1,
): Promise<number> {
  const domain_num = await domainDao.lockByIds(domain_ids, is_locked);
  return domain_num;
}

/**
 * 根据 ids 还原域名
 */
export async function revertByIds(
  domain_ids: DomainId[],
): Promise<number> {
  
  const domain_num = await domainDao.revertByIds(domain_ids);
  
  return domain_num;
}

/**
 * 根据 ids 彻底删除域名
 */
export async function forceDeleteByIds(
  domain_ids: DomainId[],
): Promise<number> {
  
  const domain_num = await domainDao.forceDeleteByIds(domain_ids);
  
  return domain_num;
}

/**
 * 获取域名字段注释
 */
export async function getFieldComments(): Promise<DomainFieldComment> {
  const domain_fields = await domainDao.getFieldComments();
  return domain_fields;
}

/**
 * 查找 域名 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const domain_sort = await domainDao.findLastOrderBy();
  return domain_sort;
}
