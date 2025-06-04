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
export async function findCountDomain(
  search?: DomainSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const domain_num = await domainDao.findCountDomain(search);
  
  return domain_num;
}

/**
 * 根据搜索条件和分页查找域名列表
 */
export async function findAllDomain(
  search?: DomainSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DomainModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const domain_models = await domainDao.findAllDomain(search, page, sort);
  
  return domain_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblDomain(
  input: DomainInput,
): Promise<void> {
  await domainDao.setIdByLblDomain(input);
}

/**
 * 根据条件查找第一个域名
 */
export async function findOneDomain(
  search?: DomainSearch,
  sort?: SortInput[],
): Promise<DomainModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const domain_model = await domainDao.findOneDomain(search, sort);
  
  return domain_model;
}

/**
 * 根据条件查找第一个域名, 如果不存在则抛错
 */
export async function findOneOkDomain(
  search?: DomainSearch,
  sort?: SortInput[],
): Promise<DomainModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const domain_model = await domainDao.findOneOkDomain(search, sort);
  
  return domain_model;
}

/**
 * 根据 id 查找域名
 */
export async function findByIdDomain(
  domain_id: DomainId,
): Promise<DomainModel | undefined> {
  
  const domain_model = await domainDao.findByIdDomain(domain_id);
  
  return domain_model;
}

/**
 * 根据 id 查找域名, 如果不存在则抛错
 */
export async function findByIdOkDomain(
  domain_id: DomainId,
): Promise<DomainModel> {
  
  const domain_model = await domainDao.findByIdOkDomain(domain_id);
  
  return domain_model;
}

/**
 * 根据 ids 查找域名
 */
export async function findByIdsDomain(
  domain_ids: DomainId[],
): Promise<DomainModel[]> {
  
  const domain_models = await domainDao.findByIdsDomain(domain_ids);
  
  return domain_models;
}

/**
 * 根据 ids 查找域名, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDomain(
  domain_ids: DomainId[],
): Promise<DomainModel[]> {
  
  const domain_models = await domainDao.findByIdsOkDomain(domain_ids);
  
  return domain_models;
}

/**
 * 根据搜索条件查找域名是否存在
 */
export async function existDomain(
  search?: DomainSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const domain_exist = await domainDao.existDomain(search);
  
  return domain_exist;
}

/**
 * 根据 id 查找域名是否存在
 */
export async function existByIdDomain(
  domain_id?: DomainId | null,
): Promise<boolean> {
  
  const domain_exist = await domainDao.existByIdDomain(domain_id);
  
  return domain_exist;
}

/**
 * 增加和修改时校验域名
 */
export async function validateDomain(
  input: DomainInput,
): Promise<void> {
  await domainDao.validateDomain(input);
}

/**
 * 批量创建域名
 */
export async function createsDomain(
  inputs: DomainInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DomainId[]> {
  const domain_ids = await domainDao.createsDomain(inputs, options);
  
  return domain_ids;
}

/**
 * 根据 id 修改域名
 */
export async function updateByIdDomain(
  domain_id: DomainId,
  input: DomainInput,
): Promise<DomainId> {
  
  const is_locked = await domainDao.getIsLockedByIdDomain(domain_id);
  if (is_locked) {
    throw "不能修改已经锁定的 域名";
  }
  
  const domain_id2 = await domainDao.updateByIdDomain(domain_id, input);
  
  return domain_id2;
}

/** 校验域名是否存在 */
export async function validateOptionDomain(
  model0?: DomainModel,
): Promise<DomainModel> {
  const domain_model = await domainDao.validateOptionDomain(model0);
  return domain_model;
}

/**
 * 根据 ids 删除域名
 */
export async function deleteByIdsDomain(
  domain_ids: DomainId[],
): Promise<number> {
  
  const old_models = await domainDao.findByIdsDomain(domain_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 域名";
    }
  }
  
  const domain_num = await domainDao.deleteByIdsDomain(domain_ids);
  return domain_num;
}

/**
 * 根据 id 设置默认域名
 */
export async function defaultByIdDomain(
  id: DomainId,
): Promise<number> {
  const domain_num = await domainDao.defaultByIdDomain(id);
  return domain_num;
}

/**
 * 根据 ids 启用或者禁用域名
 */
export async function enableByIdsDomain(
  ids: DomainId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const domain_num = await domainDao.enableByIdsDomain(ids, is_enabled);
  return domain_num;
}

/**
 * 根据 ids 锁定或者解锁域名
 */
export async function lockByIdsDomain(
  domain_ids: DomainId[],
  is_locked: 0 | 1,
): Promise<number> {
  const domain_num = await domainDao.lockByIdsDomain(domain_ids, is_locked);
  return domain_num;
}

/**
 * 根据 ids 还原域名
 */
export async function revertByIdsDomain(
  domain_ids: DomainId[],
): Promise<number> {
  
  const domain_num = await domainDao.revertByIdsDomain(domain_ids);
  
  return domain_num;
}

/**
 * 根据 ids 彻底删除域名
 */
export async function forceDeleteByIdsDomain(
  domain_ids: DomainId[],
): Promise<number> {
  
  const domain_num = await domainDao.forceDeleteByIdsDomain(domain_ids);
  
  return domain_num;
}

/**
 * 获取域名字段注释
 */
export async function getFieldCommentsDomain(): Promise<DomainFieldComment> {
  const domain_fields = await domainDao.getFieldCommentsDomain();
  return domain_fields;
}

/**
 * 查找 域名 order_by 字段的最大值
 */
export async function findLastOrderByDomain(
): Promise<number> {
  const domain_sort = await domainDao.findLastOrderByDomain();
  return domain_sort;
}
