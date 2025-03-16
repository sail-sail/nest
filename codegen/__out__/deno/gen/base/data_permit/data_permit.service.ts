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
export async function findCount(
  search?: DataPermitSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data_permit_num = await data_permitDao.findCount(search);
  
  return data_permit_num;
}

/**
 * 根据搜索条件和分页查找数据权限列表
 */
export async function findAll(
  search?: DataPermitSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DataPermitModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data_permit_models = await data_permitDao.findAll(search, page, sort);
  
  return data_permit_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: DataPermitInput,
): Promise<void> {
  await data_permitDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个数据权限
 */
export async function findOne(
  search?: DataPermitSearch,
  sort?: SortInput[],
): Promise<DataPermitModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data_permit_model = await data_permitDao.findOne(search, sort);
  
  return data_permit_model;
}

/**
 * 根据 id 查找数据权限
 */
export async function findById(
  id?: DataPermitId | null,
): Promise<DataPermitModel | undefined> {
  
  const data_permit_model = await data_permitDao.findById(id);
  
  return data_permit_model;
}

/**
 * 根据搜索条件查找数据权限是否存在
 */
export async function exist(
  search?: DataPermitSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data_permit_exist = await data_permitDao.exist(search);
  
  return data_permit_exist;
}

/**
 * 根据 id 查找数据权限是否存在
 */
export async function existById(
  id?: DataPermitId | null,
): Promise<boolean> {
  
  const data_permit_exist = await data_permitDao.existById(id);
  
  return data_permit_exist;
}

/**
 * 增加和修改时校验数据权限
 */
export async function validate(
  input: DataPermitInput,
): Promise<void> {
  await data_permitDao.validate(input);
}

/**
 * 批量创建数据权限
 */
export async function creates(
  inputs: DataPermitInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DataPermitId[]> {
  const data_permit_ids = await data_permitDao.creates(inputs, options);
  
  return data_permit_ids;
}

/**
 * 根据 id 修改数据权限
 */
export async function updateById(
  data_permit_id: DataPermitId,
  input: DataPermitInput,
): Promise<DataPermitId> {
  
  const old_model = await data_permitDao.validateOption(
    await data_permitDao.findById(id),
  );
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 菜单
    input.menu_id = undefined;
    input.menu_id_lbl = "";
    // 范围
    input.scope = undefined;
    input.scope_lbl = "";
  }
  
  const data_permit_id2 = await data_permitDao.updateById(data_permit_id, input);
  
  return data_permit_id2;
}

/** 校验数据权限是否存在 */
export async function validateOption(
  model0?: DataPermitModel,
): Promise<DataPermitModel> {
  const data_permit_model = await data_permitDao.validateOption(model0);
  return data_permit_model;
}

/**
 * 根据 ids 删除数据权限
 */
export async function deleteByIds(
  ids: DataPermitId[],
): Promise<number> {
  
  const old_models = await data_permitDao.findAll({
    ids,
  });
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const data_permit_num = await data_permitDao.deleteByIds(ids);
  return data_permit_num;
}

/**
 * 根据 ids 还原数据权限
 */
export async function revertByIds(
  ids: DataPermitId[],
): Promise<number> {
  
  const data_permit_num = await data_permitDao.revertByIds(ids);
  
  return data_permit_num;
}

/**
 * 根据 ids 彻底删除数据权限
 */
export async function forceDeleteByIds(
  ids: DataPermitId[],
): Promise<number> {
  
  const data_permit_num = await data_permitDao.forceDeleteByIds(ids);
  
  return data_permit_num;
}

/**
 * 获取数据权限字段注释
 */
export async function getFieldComments(): Promise<DataPermitFieldComment> {
  const data_permit_fields = await data_permitDao.getFieldComments();
  return data_permit_fields;
}
