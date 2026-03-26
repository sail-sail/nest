import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as data_permitDao from "./data_permit.dao.ts";

async function setSearchQuery(
  _search: DataPermitSearch,
) {
  
}

/**
 * 根据条件查找数据权限总数
 */
export async function findCountDataPermit(
  search?: DataPermitSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data_permit_num = await data_permitDao.findCountDataPermit(search);
  
  return data_permit_num;
}

/**
 * 根据搜索条件和分页查找数据权限列表
 */
export async function findAllDataPermit(
  search?: DataPermitSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DataPermitModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data_permit_models = await data_permitDao.findAllDataPermit(search, page, sort);
  
  return data_permit_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblDataPermit(
  input: DataPermitInput,
): Promise<void> {
  await data_permitDao.setIdByLblDataPermit(input);
}

/**
 * 根据条件查找第一个数据权限
 */
export async function findOneDataPermit(
  search?: DataPermitSearch,
  sort?: SortInput[],
): Promise<DataPermitModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data_permit_model = await data_permitDao.findOneDataPermit(search, sort);
  
  return data_permit_model;
}

/**
 * 根据条件查找第一个数据权限, 如果不存在则抛错
 */
export async function findOneOkDataPermit(
  search?: DataPermitSearch,
  sort?: SortInput[],
): Promise<DataPermitModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data_permit_model = await data_permitDao.findOneOkDataPermit(search, sort);
  
  return data_permit_model;
}

/**
 * 根据 id 查找数据权限
 */
export async function findByIdDataPermit(
  data_permit_id: DataPermitId,
): Promise<DataPermitModel | undefined> {
  
  const data_permit_model = await data_permitDao.findByIdDataPermit(data_permit_id);
  
  return data_permit_model;
}

/**
 * 根据 id 查找数据权限, 如果不存在则抛错
 */
export async function findByIdOkDataPermit(
  data_permit_id: DataPermitId,
): Promise<DataPermitModel> {
  
  const data_permit_model = await data_permitDao.findByIdOkDataPermit(data_permit_id);
  
  return data_permit_model;
}

/**
 * 根据 ids 查找数据权限
 */
export async function findByIdsDataPermit(
  data_permit_ids: DataPermitId[],
): Promise<DataPermitModel[]> {
  
  const data_permit_models = await data_permitDao.findByIdsDataPermit(data_permit_ids);
  
  return data_permit_models;
}

/**
 * 根据 ids 查找数据权限, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDataPermit(
  data_permit_ids: DataPermitId[],
): Promise<DataPermitModel[]> {
  
  const data_permit_models = await data_permitDao.findByIdsOkDataPermit(data_permit_ids);
  
  return data_permit_models;
}

/**
 * 根据搜索条件查找数据权限是否存在
 */
export async function existDataPermit(
  search?: DataPermitSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data_permit_exist = await data_permitDao.existDataPermit(search);
  
  return data_permit_exist;
}

/**
 * 根据 id 查找数据权限是否存在
 */
export async function existByIdDataPermit(
  data_permit_id?: DataPermitId | null,
): Promise<boolean> {
  
  const data_permit_exist = await data_permitDao.existByIdDataPermit(data_permit_id);
  
  return data_permit_exist;
}

/**
 * 增加和修改时校验数据权限
 */
export async function validateDataPermit(
  input: DataPermitInput,
): Promise<void> {
  await data_permitDao.validateDataPermit(input);
}

/**
 * 批量创建数据权限
 */
export async function createsDataPermit(
  inputs: DataPermitInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DataPermitId[]> {
  const data_permit_ids = await data_permitDao.createsDataPermit(inputs, options);
  
  return data_permit_ids;
}

/**
 * 根据 id 修改数据权限
 */
export async function updateByIdDataPermit(
  data_permit_id: DataPermitId,
  input: DataPermitInput,
): Promise<DataPermitId> {
  
  const old_model = await data_permitDao.findByIdOkDataPermit(data_permit_id);
  
  data_permit_id = await data_permitDao.updateByIdDataPermit(data_permit_id, input);
  
  return data_permit_id;
}

/** 校验数据权限是否存在 */
export async function validateOptionDataPermit(
  model0?: DataPermitModel,
): Promise<DataPermitModel> {
  const data_permit_model = await data_permitDao.validateOptionDataPermit(model0);
  return data_permit_model;
}

/**
 * 根据 ids 删除数据权限
 */
export async function deleteByIdsDataPermit(
  data_permit_ids: DataPermitId[],
): Promise<number> {
  
  const data_permit_num = await data_permitDao.deleteByIdsDataPermit(data_permit_ids);
  return data_permit_num;
}

/**
 * 根据 ids 还原数据权限
 */
export async function revertByIdsDataPermit(
  data_permit_ids: DataPermitId[],
): Promise<number> {
  
  const data_permit_num = await data_permitDao.revertByIdsDataPermit(data_permit_ids);
  
  return data_permit_num;
}

/**
 * 根据 ids 彻底删除数据权限
 */
export async function forceDeleteByIdsDataPermit(
  data_permit_ids: DataPermitId[],
): Promise<number> {
  
  const data_permit_num = await data_permitDao.forceDeleteByIdsDataPermit(data_permit_ids);
  
  return data_permit_num;
}

/**
 * 获取数据权限字段注释
 */
export async function getFieldCommentsDataPermit(): Promise<DataPermitFieldComment> {
  const data_permit_fields = await data_permitDao.getFieldCommentsDataPermit();
  return data_permit_fields;
}
