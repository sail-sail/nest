import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as dyn_page_fieldDao from "./dyn_page_field.dao.ts";

async function setSearchQuery(
  _search: DynPageFieldSearch,
) {
  
}

/**
 * 根据条件查找动态页面字段总数
 */
export async function findCountDynPageField(
  search?: DynPageFieldSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_field_num = await dyn_page_fieldDao.findCountDynPageField(search);
  
  return dyn_page_field_num;
}

/**
 * 根据搜索条件和分页查找动态页面字段列表
 */
export async function findAllDynPageField(
  search?: DynPageFieldSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DynPageFieldModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_field_models = await dyn_page_fieldDao.findAllDynPageField(search, page, sort);
  
  return dyn_page_field_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblDynPageField(
  input: DynPageFieldInput,
): Promise<void> {
  await dyn_page_fieldDao.setIdByLblDynPageField(input);
}

/**
 * 根据条件查找第一个动态页面字段
 */
export async function findOneDynPageField(
  search?: DynPageFieldSearch,
  sort?: SortInput[],
): Promise<DynPageFieldModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_field_model = await dyn_page_fieldDao.findOneDynPageField(search, sort);
  
  return dyn_page_field_model;
}

/**
 * 根据条件查找第一个动态页面字段, 如果不存在则抛错
 */
export async function findOneOkDynPageField(
  search?: DynPageFieldSearch,
  sort?: SortInput[],
): Promise<DynPageFieldModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_field_model = await dyn_page_fieldDao.findOneOkDynPageField(search, sort);
  
  return dyn_page_field_model;
}

/**
 * 根据 id 查找动态页面字段
 */
export async function findByIdDynPageField(
  dyn_page_field_id: DynPageFieldId,
): Promise<DynPageFieldModel | undefined> {
  
  const dyn_page_field_model = await dyn_page_fieldDao.findByIdDynPageField(dyn_page_field_id);
  
  return dyn_page_field_model;
}

/**
 * 根据 id 查找动态页面字段, 如果不存在则抛错
 */
export async function findByIdOkDynPageField(
  dyn_page_field_id: DynPageFieldId,
): Promise<DynPageFieldModel> {
  
  const dyn_page_field_model = await dyn_page_fieldDao.findByIdOkDynPageField(dyn_page_field_id);
  
  return dyn_page_field_model;
}

/**
 * 根据 ids 查找动态页面字段
 */
export async function findByIdsDynPageField(
  dyn_page_field_ids: DynPageFieldId[],
): Promise<DynPageFieldModel[]> {
  
  const dyn_page_field_models = await dyn_page_fieldDao.findByIdsDynPageField(dyn_page_field_ids);
  
  return dyn_page_field_models;
}

/**
 * 根据 ids 查找动态页面字段, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDynPageField(
  dyn_page_field_ids: DynPageFieldId[],
): Promise<DynPageFieldModel[]> {
  
  const dyn_page_field_models = await dyn_page_fieldDao.findByIdsOkDynPageField(dyn_page_field_ids);
  
  return dyn_page_field_models;
}

/**
 * 根据搜索条件查找动态页面字段是否存在
 */
export async function existDynPageField(
  search?: DynPageFieldSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_field_exist = await dyn_page_fieldDao.existDynPageField(search);
  
  return dyn_page_field_exist;
}

/**
 * 根据 id 查找动态页面字段是否存在
 */
export async function existByIdDynPageField(
  dyn_page_field_id?: DynPageFieldId | null,
): Promise<boolean> {
  
  const dyn_page_field_exist = await dyn_page_fieldDao.existByIdDynPageField(dyn_page_field_id);
  
  return dyn_page_field_exist;
}

/**
 * 增加和修改时校验动态页面字段
 */
export async function validateDynPageField(
  input: DynPageFieldInput,
): Promise<void> {
  await dyn_page_fieldDao.validateDynPageField(input);
}

/**
 * 批量创建动态页面字段
 */
export async function createsDynPageField(
  inputs: DynPageFieldInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DynPageFieldId[]> {
  const dyn_page_field_ids = await dyn_page_fieldDao.createsDynPageField(inputs, options);
  
  return dyn_page_field_ids;
}

/**
 * 根据 id 修改动态页面字段
 */
export async function updateByIdDynPageField(
  dyn_page_field_id: DynPageFieldId,
  input: DynPageFieldInput,
): Promise<DynPageFieldId> {
  
  const dyn_page_field_id2 = await dyn_page_fieldDao.updateByIdDynPageField(dyn_page_field_id, input);
  
  return dyn_page_field_id2;
}

/** 校验动态页面字段是否存在 */
export async function validateOptionDynPageField(
  model0?: DynPageFieldModel,
): Promise<DynPageFieldModel> {
  const dyn_page_field_model = await dyn_page_fieldDao.validateOptionDynPageField(model0);
  return dyn_page_field_model;
}

/**
 * 根据 ids 删除动态页面字段
 */
export async function deleteByIdsDynPageField(
  dyn_page_field_ids: DynPageFieldId[],
): Promise<number> {
  
  const dyn_page_field_num = await dyn_page_fieldDao.deleteByIdsDynPageField(dyn_page_field_ids);
  return dyn_page_field_num;
}

/**
 * 根据 ids 启用或者禁用动态页面字段
 */
export async function enableByIdsDynPageField(
  ids: DynPageFieldId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const dyn_page_field_num = await dyn_page_fieldDao.enableByIdsDynPageField(ids, is_enabled);
  return dyn_page_field_num;
}

/**
 * 根据 ids 还原动态页面字段
 */
export async function revertByIdsDynPageField(
  dyn_page_field_ids: DynPageFieldId[],
): Promise<number> {
  
  const dyn_page_field_num = await dyn_page_fieldDao.revertByIdsDynPageField(dyn_page_field_ids);
  
  return dyn_page_field_num;
}

/**
 * 根据 ids 彻底删除动态页面字段
 */
export async function forceDeleteByIdsDynPageField(
  dyn_page_field_ids: DynPageFieldId[],
): Promise<number> {
  
  const dyn_page_field_num = await dyn_page_fieldDao.forceDeleteByIdsDynPageField(dyn_page_field_ids);
  
  return dyn_page_field_num;
}

/**
 * 获取动态页面字段字段注释
 */
export async function getFieldCommentsDynPageField(): Promise<DynPageFieldFieldComment> {
  const dyn_page_field_fields = await dyn_page_fieldDao.getFieldCommentsDynPageField();
  return dyn_page_field_fields;
}

/**
 * 查找 动态页面字段 order_by 字段的最大值
 */
export async function findLastOrderByDynPageField(
): Promise<number> {
  const dyn_page_field_sort = await dyn_page_fieldDao.findLastOrderByDynPageField();
  return dyn_page_field_sort;
}
