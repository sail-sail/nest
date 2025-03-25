import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as dictbiz_detailDao from "./dictbiz_detail.dao.ts";

async function setSearchQuery(
  _search: DictbizDetailSearch,
) {
  
}

/**
 * 根据条件查找业务字典明细总数
 */
export async function findCountDictbizDetail(
  search?: DictbizDetailSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_detail_num = await dictbiz_detailDao.findCountDictbizDetail(search);
  
  return dictbiz_detail_num;
}

/**
 * 根据搜索条件和分页查找业务字典明细列表
 */
export async function findAllDictbizDetail(
  search?: DictbizDetailSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictbizDetailModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_detail_models = await dictbiz_detailDao.findAllDictbizDetail(search, page, sort);
  
  return dictbiz_detail_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblDictbizDetail(
  input: DictbizDetailInput,
): Promise<void> {
  await dictbiz_detailDao.setIdByLblDictbizDetail(input);
}

/**
 * 根据条件查找第一个业务字典明细
 */
export async function findOneDictbizDetail(
  search?: DictbizDetailSearch,
  sort?: SortInput[],
): Promise<DictbizDetailModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_detail_model = await dictbiz_detailDao.findOneDictbizDetail(search, sort);
  
  return dictbiz_detail_model;
}

/**
 * 根据 id 查找业务字典明细
 */
export async function findByIdDictbizDetail(
  dictbiz_detail_id?: DictbizDetailId | null,
): Promise<DictbizDetailModel | undefined> {
  
  const dictbiz_detail_model = await dictbiz_detailDao.findByIdDictbizDetail(dictbiz_detail_id);
  
  return dictbiz_detail_model;
}

/**
 * 根据 ids 查找业务字典明细
 */
export async function findByIdsDictbizDetail(
  dictbiz_detail_ids: DictbizDetailId[],
): Promise<DictbizDetailModel[]> {
  
  const dictbiz_detail_models = await dictbiz_detailDao.findByIdsDictbizDetail(dictbiz_detail_ids);
  
  return dictbiz_detail_models;
}

/**
 * 根据搜索条件查找业务字典明细是否存在
 */
export async function existDictbizDetail(
  search?: DictbizDetailSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_detail_exist = await dictbiz_detailDao.existDictbizDetail(search);
  
  return dictbiz_detail_exist;
}

/**
 * 根据 id 查找业务字典明细是否存在
 */
export async function existByIdDictbizDetail(
  dictbiz_detail_id?: DictbizDetailId | null,
): Promise<boolean> {
  
  const dictbiz_detail_exist = await dictbiz_detailDao.existByIdDictbizDetail(dictbiz_detail_id);
  
  return dictbiz_detail_exist;
}

/**
 * 增加和修改时校验业务字典明细
 */
export async function validateDictbizDetail(
  input: DictbizDetailInput,
): Promise<void> {
  await dictbiz_detailDao.validateDictbizDetail(input);
}

/**
 * 批量创建业务字典明细
 */
export async function createsDictbizDetail(
  inputs: DictbizDetailInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DictbizDetailId[]> {
  const dictbiz_detail_ids = await dictbiz_detailDao.createsDictbizDetail(inputs, options);
  
  return dictbiz_detail_ids;
}

/**
 * 根据 id 修改业务字典明细
 */
export async function updateByIdDictbizDetail(
  dictbiz_detail_id: DictbizDetailId,
  input: DictbizDetailInput,
): Promise<DictbizDetailId> {
  
  const dictbiz_detail_id2 = await dictbiz_detailDao.updateByIdDictbizDetail(dictbiz_detail_id, input);
  
  return dictbiz_detail_id2;
}

/** 校验业务字典明细是否存在 */
export async function validateOptionDictbizDetail(
  model0?: DictbizDetailModel,
): Promise<DictbizDetailModel> {
  const dictbiz_detail_model = await dictbiz_detailDao.validateOptionDictbizDetail(model0);
  return dictbiz_detail_model;
}

/**
 * 根据 ids 删除业务字典明细
 */
export async function deleteByIdsDictbizDetail(
  dictbiz_detail_ids: DictbizDetailId[],
): Promise<number> {
  
  const old_models = await dictbiz_detailDao.findByIdsDictbizDetail(dictbiz_detail_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const dictbiz_detail_num = await dictbiz_detailDao.deleteByIdsDictbizDetail(dictbiz_detail_ids);
  return dictbiz_detail_num;
}

/**
 * 根据 ids 启用或者禁用业务字典明细
 */
export async function enableByIdsDictbizDetail(
  ids: DictbizDetailId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const dictbiz_detail_num = await dictbiz_detailDao.enableByIdsDictbizDetail(ids, is_enabled);
  return dictbiz_detail_num;
}

/**
 * 根据 ids 还原业务字典明细
 */
export async function revertByIdsDictbizDetail(
  dictbiz_detail_ids: DictbizDetailId[],
): Promise<number> {
  
  const dictbiz_detail_num = await dictbiz_detailDao.revertByIdsDictbizDetail(dictbiz_detail_ids);
  
  return dictbiz_detail_num;
}

/**
 * 根据 ids 彻底删除业务字典明细
 */
export async function forceDeleteByIdsDictbizDetail(
  dictbiz_detail_ids: DictbizDetailId[],
): Promise<number> {
  
  const dictbiz_detail_num = await dictbiz_detailDao.forceDeleteByIdsDictbizDetail(dictbiz_detail_ids);
  
  return dictbiz_detail_num;
}

/**
 * 获取业务字典明细字段注释
 */
export async function getFieldCommentsDictbizDetail(): Promise<DictbizDetailFieldComment> {
  const dictbiz_detail_fields = await dictbiz_detailDao.getFieldCommentsDictbizDetail();
  return dictbiz_detail_fields;
}

/**
 * 查找 业务字典明细 order_by 字段的最大值
 */
export async function findLastOrderByDictbizDetail(
): Promise<number> {
  const dictbiz_detail_sort = await dictbiz_detailDao.findLastOrderByDictbizDetail();
  return dictbiz_detail_sort;
}
