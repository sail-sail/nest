import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as dyn_page_valDao from "./dyn_page_val.dao.ts";

async function setSearchQuery(
  _search: DynPageValSearch,
) {
  
}

/**
 * 根据条件查找动态页面值总数
 */
export async function findCountDynPageVal(
  search?: DynPageValSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_val_num = await dyn_page_valDao.findCountDynPageVal(search);
  
  return dyn_page_val_num;
}

/**
 * 根据搜索条件和分页查找动态页面值列表
 */
export async function findAllDynPageVal(
  search?: DynPageValSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DynPageValModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_val_models = await dyn_page_valDao.findAllDynPageVal(search, page, sort);
  
  return dyn_page_val_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblDynPageVal(
  input: DynPageValInput,
): Promise<void> {
  await dyn_page_valDao.setIdByLblDynPageVal(input);
}

/**
 * 根据条件查找第一个动态页面值
 */
export async function findOneDynPageVal(
  search?: DynPageValSearch,
  sort?: SortInput[],
): Promise<DynPageValModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_val_model = await dyn_page_valDao.findOneDynPageVal(search, sort);
  
  return dyn_page_val_model;
}

/**
 * 根据条件查找第一个动态页面值, 如果不存在则抛错
 */
export async function findOneOkDynPageVal(
  search?: DynPageValSearch,
  sort?: SortInput[],
): Promise<DynPageValModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_val_model = await dyn_page_valDao.findOneOkDynPageVal(search, sort);
  
  return dyn_page_val_model;
}

/**
 * 根据 id 查找动态页面值
 */
export async function findByIdDynPageVal(
  dyn_page_val_id: DynPageValId,
): Promise<DynPageValModel | undefined> {
  
  const dyn_page_val_model = await dyn_page_valDao.findByIdDynPageVal(dyn_page_val_id);
  
  return dyn_page_val_model;
}

/**
 * 根据 id 查找动态页面值, 如果不存在则抛错
 */
export async function findByIdOkDynPageVal(
  dyn_page_val_id: DynPageValId,
): Promise<DynPageValModel> {
  
  const dyn_page_val_model = await dyn_page_valDao.findByIdOkDynPageVal(dyn_page_val_id);
  
  return dyn_page_val_model;
}

/**
 * 根据 ids 查找动态页面值
 */
export async function findByIdsDynPageVal(
  dyn_page_val_ids: DynPageValId[],
): Promise<DynPageValModel[]> {
  
  const dyn_page_val_models = await dyn_page_valDao.findByIdsDynPageVal(dyn_page_val_ids);
  
  return dyn_page_val_models;
}

/**
 * 根据 ids 查找动态页面值, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDynPageVal(
  dyn_page_val_ids: DynPageValId[],
): Promise<DynPageValModel[]> {
  
  const dyn_page_val_models = await dyn_page_valDao.findByIdsOkDynPageVal(dyn_page_val_ids);
  
  return dyn_page_val_models;
}

/**
 * 根据搜索条件查找动态页面值是否存在
 */
export async function existDynPageVal(
  search?: DynPageValSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_val_exist = await dyn_page_valDao.existDynPageVal(search);
  
  return dyn_page_val_exist;
}

/**
 * 根据 id 查找动态页面值是否存在
 */
export async function existByIdDynPageVal(
  dyn_page_val_id?: DynPageValId | null,
): Promise<boolean> {
  
  const dyn_page_val_exist = await dyn_page_valDao.existByIdDynPageVal(dyn_page_val_id);
  
  return dyn_page_val_exist;
}

/**
 * 增加和修改时校验动态页面值
 */
export async function validateDynPageVal(
  input: DynPageValInput,
): Promise<void> {
  await dyn_page_valDao.validateDynPageVal(input);
}

/**
 * 批量创建动态页面值
 */
export async function createsDynPageVal(
  inputs: DynPageValInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DynPageValId[]> {
  const dyn_page_val_ids = await dyn_page_valDao.createsDynPageVal(inputs, options);
  
  return dyn_page_val_ids;
}

/**
 * 根据 id 修改动态页面值
 */
export async function updateByIdDynPageVal(
  dyn_page_val_id: DynPageValId,
  input: DynPageValInput,
): Promise<DynPageValId> {
  
  const dyn_page_val_id2 = await dyn_page_valDao.updateByIdDynPageVal(dyn_page_val_id, input);
  
  return dyn_page_val_id2;
}

/** 校验动态页面值是否存在 */
export async function validateOptionDynPageVal(
  model0?: DynPageValModel,
): Promise<DynPageValModel> {
  const dyn_page_val_model = await dyn_page_valDao.validateOptionDynPageVal(model0);
  return dyn_page_val_model;
}

/**
 * 根据 ids 删除动态页面值
 */
export async function deleteByIdsDynPageVal(
  dyn_page_val_ids: DynPageValId[],
): Promise<number> {
  
  const dyn_page_val_num = await dyn_page_valDao.deleteByIdsDynPageVal(dyn_page_val_ids);
  return dyn_page_val_num;
}

/**
 * 根据 ids 还原动态页面值
 */
export async function revertByIdsDynPageVal(
  dyn_page_val_ids: DynPageValId[],
): Promise<number> {
  
  const dyn_page_val_num = await dyn_page_valDao.revertByIdsDynPageVal(dyn_page_val_ids);
  
  return dyn_page_val_num;
}

/**
 * 根据 ids 彻底删除动态页面值
 */
export async function forceDeleteByIdsDynPageVal(
  dyn_page_val_ids: DynPageValId[],
): Promise<number> {
  
  const dyn_page_val_num = await dyn_page_valDao.forceDeleteByIdsDynPageVal(dyn_page_val_ids);
  
  return dyn_page_val_num;
}

/**
 * 获取动态页面值字段注释
 */
export async function getFieldCommentsDynPageVal(): Promise<DynPageValFieldComment> {
  const dyn_page_val_fields = await dyn_page_valDao.getFieldCommentsDynPageVal();
  return dyn_page_val_fields;
}
