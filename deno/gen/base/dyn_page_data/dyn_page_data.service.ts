import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as dyn_page_dataDao from "./dyn_page_data.dao.ts";

async function setSearchQuery(
  _search: DynPageDataSearch,
) {
  
}

/**
 * 根据条件查找动态页面数据总数
 */
export async function findCountDynPageData(
  search?: DynPageDataSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_data_num = await dyn_page_dataDao.findCountDynPageData(search);
  
  return dyn_page_data_num;
}

/**
 * 根据搜索条件和分页查找动态页面数据列表
 */
export async function findAllDynPageData(
  search?: DynPageDataSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DynPageDataModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_data_models = await dyn_page_dataDao.findAllDynPageData(search, page, sort);
  
  return dyn_page_data_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblDynPageData(
  input: DynPageDataInput,
): Promise<void> {
  await dyn_page_dataDao.setIdByLblDynPageData(input);
}

/**
 * 根据条件查找第一个动态页面数据
 */
export async function findOneDynPageData(
  search?: DynPageDataSearch,
  sort?: SortInput[],
): Promise<DynPageDataModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_data_model = await dyn_page_dataDao.findOneDynPageData(search, sort);
  
  return dyn_page_data_model;
}

/**
 * 根据条件查找第一个动态页面数据, 如果不存在则抛错
 */
export async function findOneOkDynPageData(
  search?: DynPageDataSearch,
  sort?: SortInput[],
): Promise<DynPageDataModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_data_model = await dyn_page_dataDao.findOneOkDynPageData(search, sort);
  
  return dyn_page_data_model;
}

/**
 * 根据 id 查找动态页面数据
 */
export async function findByIdDynPageData(
  dyn_page_data_id: DynPageDataId,
): Promise<DynPageDataModel | undefined> {
  
  const dyn_page_data_model = await dyn_page_dataDao.findByIdDynPageData(dyn_page_data_id);
  
  return dyn_page_data_model;
}

/**
 * 根据 id 查找动态页面数据, 如果不存在则抛错
 */
export async function findByIdOkDynPageData(
  dyn_page_data_id: DynPageDataId,
): Promise<DynPageDataModel> {
  
  const dyn_page_data_model = await dyn_page_dataDao.findByIdOkDynPageData(dyn_page_data_id);
  
  return dyn_page_data_model;
}

/**
 * 根据 ids 查找动态页面数据
 */
export async function findByIdsDynPageData(
  dyn_page_data_ids: DynPageDataId[],
): Promise<DynPageDataModel[]> {
  
  const dyn_page_data_models = await dyn_page_dataDao.findByIdsDynPageData(dyn_page_data_ids);
  
  return dyn_page_data_models;
}

/**
 * 根据 ids 查找动态页面数据, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDynPageData(
  dyn_page_data_ids: DynPageDataId[],
): Promise<DynPageDataModel[]> {
  
  const dyn_page_data_models = await dyn_page_dataDao.findByIdsOkDynPageData(dyn_page_data_ids);
  
  return dyn_page_data_models;
}

/**
 * 根据搜索条件查找动态页面数据是否存在
 */
export async function existDynPageData(
  search?: DynPageDataSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dyn_page_data_exist = await dyn_page_dataDao.existDynPageData(search);
  
  return dyn_page_data_exist;
}

/**
 * 根据 id 查找动态页面数据是否存在
 */
export async function existByIdDynPageData(
  dyn_page_data_id?: DynPageDataId | null,
): Promise<boolean> {
  
  const dyn_page_data_exist = await dyn_page_dataDao.existByIdDynPageData(dyn_page_data_id);
  
  return dyn_page_data_exist;
}

/**
 * 增加和修改时校验动态页面数据
 */
export async function validateDynPageData(
  input: DynPageDataInput,
): Promise<void> {
  await dyn_page_dataDao.validateDynPageData(input);
}

/**
 * 批量创建动态页面数据
 */
export async function createsDynPageData(
  inputs: DynPageDataInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DynPageDataId[]> {
  const dyn_page_data_ids = await dyn_page_dataDao.createsDynPageData(inputs, options);
  
  return dyn_page_data_ids;
}

/**
 * 根据 id 修改动态页面数据
 */
export async function updateByIdDynPageData(
  dyn_page_data_id: DynPageDataId,
  input: DynPageDataInput,
): Promise<DynPageDataId> {
  
  const dyn_page_data_id2 = await dyn_page_dataDao.updateByIdDynPageData(dyn_page_data_id, input);
  
  return dyn_page_data_id2;
}

/** 校验动态页面数据是否存在 */
export async function validateOptionDynPageData(
  model0?: DynPageDataModel,
): Promise<DynPageDataModel> {
  const dyn_page_data_model = await dyn_page_dataDao.validateOptionDynPageData(model0);
  return dyn_page_data_model;
}

/**
 * 根据 ids 删除动态页面数据
 */
export async function deleteByIdsDynPageData(
  dyn_page_data_ids: DynPageDataId[],
): Promise<number> {
  
  const dyn_page_data_num = await dyn_page_dataDao.deleteByIdsDynPageData(dyn_page_data_ids);
  return dyn_page_data_num;
}

/**
 * 根据 ids 还原动态页面数据
 */
export async function revertByIdsDynPageData(
  dyn_page_data_ids: DynPageDataId[],
): Promise<number> {
  
  const dyn_page_data_num = await dyn_page_dataDao.revertByIdsDynPageData(dyn_page_data_ids);
  
  return dyn_page_data_num;
}

/**
 * 根据 ids 彻底删除动态页面数据
 */
export async function forceDeleteByIdsDynPageData(
  dyn_page_data_ids: DynPageDataId[],
): Promise<number> {
  
  const dyn_page_data_num = await dyn_page_dataDao.forceDeleteByIdsDynPageData(dyn_page_data_ids);
  
  return dyn_page_data_num;
}

/**
 * 获取动态页面数据字段注释
 */
export async function getFieldCommentsDynPageData(
  ref_code?: string | null,
): Promise<DynPageDataFieldComment> {
  const dyn_page_data_fields = await dyn_page_dataDao.getFieldCommentsDynPageData(ref_code);
  return dyn_page_data_fields;
}
