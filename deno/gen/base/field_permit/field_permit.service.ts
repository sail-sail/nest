import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as field_permitDao from "./field_permit.dao.ts";

async function setSearchQuery(
  _search: FieldPermitSearch,
) {
  
}

/**
 * 根据条件查找字段权限总数
 */
export async function findCountFieldPermit(
  search?: FieldPermitSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const field_permit_num = await field_permitDao.findCountFieldPermit(search);
  
  return field_permit_num;
}

/**
 * 根据搜索条件和分页查找字段权限列表
 */
export async function findAllFieldPermit(
  search?: FieldPermitSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<FieldPermitModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const field_permit_models = await field_permitDao.findAllFieldPermit(search, page, sort);
  
  return field_permit_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblFieldPermit(
  input: FieldPermitInput,
): Promise<void> {
  await field_permitDao.setIdByLblFieldPermit(input);
}

/**
 * 根据条件查找第一个字段权限
 */
export async function findOneFieldPermit(
  search?: FieldPermitSearch,
  sort?: SortInput[],
): Promise<FieldPermitModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const field_permit_model = await field_permitDao.findOneFieldPermit(search, sort);
  
  return field_permit_model;
}

/**
 * 根据条件查找第一个字段权限, 如果不存在则抛错
 */
export async function findOneOkFieldPermit(
  search?: FieldPermitSearch,
  sort?: SortInput[],
): Promise<FieldPermitModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const field_permit_model = await field_permitDao.findOneOkFieldPermit(search, sort);
  
  return field_permit_model;
}

/**
 * 根据 id 查找字段权限
 */
export async function findByIdFieldPermit(
  field_permit_id: FieldPermitId,
): Promise<FieldPermitModel | undefined> {
  
  const field_permit_model = await field_permitDao.findByIdFieldPermit(field_permit_id);
  
  return field_permit_model;
}

/**
 * 根据 id 查找字段权限, 如果不存在则抛错
 */
export async function findByIdOkFieldPermit(
  field_permit_id: FieldPermitId,
): Promise<FieldPermitModel> {
  
  const field_permit_model = await field_permitDao.findByIdOkFieldPermit(field_permit_id);
  
  return field_permit_model;
}

/**
 * 根据 ids 查找字段权限
 */
export async function findByIdsFieldPermit(
  field_permit_ids: FieldPermitId[],
): Promise<FieldPermitModel[]> {
  
  const field_permit_models = await field_permitDao.findByIdsFieldPermit(field_permit_ids);
  
  return field_permit_models;
}

/**
 * 根据 ids 查找字段权限, 出现查询不到的 id 则报错
 */
export async function findByIdsOkFieldPermit(
  field_permit_ids: FieldPermitId[],
): Promise<FieldPermitModel[]> {
  
  const field_permit_models = await field_permitDao.findByIdsOkFieldPermit(field_permit_ids);
  
  return field_permit_models;
}

/**
 * 根据搜索条件查找字段权限是否存在
 */
export async function existFieldPermit(
  search?: FieldPermitSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const field_permit_exist = await field_permitDao.existFieldPermit(search);
  
  return field_permit_exist;
}

/**
 * 根据 id 查找字段权限是否存在
 */
export async function existByIdFieldPermit(
  field_permit_id?: FieldPermitId | null,
): Promise<boolean> {
  
  const field_permit_exist = await field_permitDao.existByIdFieldPermit(field_permit_id);
  
  return field_permit_exist;
}

/**
 * 增加和修改时校验字段权限
 */
export async function validateFieldPermit(
  input: FieldPermitInput,
): Promise<void> {
  await field_permitDao.validateFieldPermit(input);
}

/**
 * 批量创建字段权限
 */
export async function createsFieldPermit(
  inputs: FieldPermitInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<FieldPermitId[]> {
  const field_permit_ids = await field_permitDao.createsFieldPermit(inputs, options);
  
  return field_permit_ids;
}

/**
 * 根据 id 修改字段权限
 */
export async function updateByIdFieldPermit(
  field_permit_id: FieldPermitId,
  input: FieldPermitInput,
): Promise<FieldPermitId> {
  
  const old_model = await field_permitDao.validateOptionFieldPermit(
    await field_permitDao.findByIdFieldPermit(field_permit_id),
  );
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 菜单
    input.menu_id = undefined;
    input.menu_id_lbl = "";
    // 编码
    input.code = undefined;
  }
  
  const field_permit_id2 = await field_permitDao.updateByIdFieldPermit(field_permit_id, input);
  
  return field_permit_id2;
}

/** 校验字段权限是否存在 */
export async function validateOptionFieldPermit(
  model0?: FieldPermitModel,
): Promise<FieldPermitModel> {
  const field_permit_model = await field_permitDao.validateOptionFieldPermit(model0);
  return field_permit_model;
}

/**
 * 根据 ids 删除字段权限
 */
export async function deleteByIdsFieldPermit(
  field_permit_ids: FieldPermitId[],
): Promise<number> {
  
  const old_models = await field_permitDao.findByIdsFieldPermit(field_permit_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const field_permit_num = await field_permitDao.deleteByIdsFieldPermit(field_permit_ids);
  return field_permit_num;
}

/**
 * 获取字段权限字段注释
 */
export async function getFieldCommentsFieldPermit(): Promise<FieldPermitFieldComment> {
  const field_permit_fields = await field_permitDao.getFieldCommentsFieldPermit();
  return field_permit_fields;
}

/**
 * 查找 字段权限 order_by 字段的最大值
 */
export async function findLastOrderByFieldPermit(
): Promise<number> {
  const field_permit_sort = await field_permitDao.findLastOrderByFieldPermit();
  return field_permit_sort;
}
