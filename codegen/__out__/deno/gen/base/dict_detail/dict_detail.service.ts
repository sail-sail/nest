import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as dict_detailDao from "./dict_detail.dao.ts";

async function setSearchQuery(
  _search: DictDetailSearch,
) {
  
}

/**
 * 根据条件查找系统字典明细总数
 */
export async function findCountDictDetail(
  search?: DictDetailSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_detail_num = await dict_detailDao.findCountDictDetail(search);
  
  return dict_detail_num;
}

/**
 * 根据搜索条件和分页查找系统字典明细列表
 */
export async function findAllDictDetail(
  search?: DictDetailSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictDetailModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_detail_models = await dict_detailDao.findAllDictDetail(search, page, sort);
  
  return dict_detail_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblDictDetail(
  input: DictDetailInput,
): Promise<void> {
  await dict_detailDao.setIdByLblDictDetail(input);
}

/**
 * 根据条件查找第一个系统字典明细
 */
export async function findOneDictDetail(
  search?: DictDetailSearch,
  sort?: SortInput[],
): Promise<DictDetailModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_detail_model = await dict_detailDao.findOneDictDetail(search, sort);
  
  return dict_detail_model;
}

/**
 * 根据 id 查找系统字典明细
 */
export async function findByIdDictDetail(
  dict_detail_id?: DictDetailId | null,
): Promise<DictDetailModel | undefined> {
  
  const dict_detail_model = await dict_detailDao.findByIdDictDetail(dict_detail_id);
  
  return dict_detail_model;
}

/**
 * 根据 ids 查找系统字典明细
 */
export async function findByIdsDictDetail(
  dict_detail_ids: DictDetailId[],
): Promise<DictDetailModel[]> {
  
  const dict_detail_models = await dict_detailDao.findByIdsDictDetail(dict_detail_ids);
  
  return dict_detail_models;
}

/**
 * 根据搜索条件查找系统字典明细是否存在
 */
export async function existDictDetail(
  search?: DictDetailSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_detail_exist = await dict_detailDao.existDictDetail(search);
  
  return dict_detail_exist;
}

/**
 * 根据 id 查找系统字典明细是否存在
 */
export async function existByIdDictDetail(
  dict_detail_id?: DictDetailId | null,
): Promise<boolean> {
  
  const dict_detail_exist = await dict_detailDao.existByIdDictDetail(dict_detail_id);
  
  return dict_detail_exist;
}

/**
 * 增加和修改时校验系统字典明细
 */
export async function validateDictDetail(
  input: DictDetailInput,
): Promise<void> {
  await dict_detailDao.validateDictDetail(input);
}

/**
 * 批量创建系统字典明细
 */
export async function createsDictDetail(
  inputs: DictDetailInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DictDetailId[]> {
  const dict_detail_ids = await dict_detailDao.createsDictDetail(inputs, options);
  
  return dict_detail_ids;
}

/**
 * 根据 id 修改系统字典明细
 */
export async function updateByIdDictDetail(
  dict_detail_id: DictDetailId,
  input: DictDetailInput,
): Promise<DictDetailId> {
  
  const old_model = await dict_detailDao.validateOptionDictDetail(
    await dict_detailDao.findByIdDictDetail(dict_detail_id),
  );
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 值
    input.val = undefined;
  }
  
  const dict_detail_id2 = await dict_detailDao.updateByIdDictDetail(dict_detail_id, input);
  
  return dict_detail_id2;
}

/** 校验系统字典明细是否存在 */
export async function validateOptionDictDetail(
  model0?: DictDetailModel,
): Promise<DictDetailModel> {
  const dict_detail_model = await dict_detailDao.validateOptionDictDetail(model0);
  return dict_detail_model;
}

/**
 * 根据 ids 删除系统字典明细
 */
export async function deleteByIdsDictDetail(
  dict_detail_ids: DictDetailId[],
): Promise<number> {
  
  const old_models = await dict_detailDao.findByIdsDictDetail(dict_detail_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const dict_detail_num = await dict_detailDao.deleteByIdsDictDetail(dict_detail_ids);
  return dict_detail_num;
}

/**
 * 根据 ids 启用或者禁用系统字典明细
 */
export async function enableByIdsDictDetail(
  ids: DictDetailId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const dict_detail_num = await dict_detailDao.enableByIdsDictDetail(ids, is_enabled);
  return dict_detail_num;
}

/**
 * 根据 ids 还原系统字典明细
 */
export async function revertByIdsDictDetail(
  dict_detail_ids: DictDetailId[],
): Promise<number> {
  
  const dict_detail_num = await dict_detailDao.revertByIdsDictDetail(dict_detail_ids);
  
  return dict_detail_num;
}

/**
 * 根据 ids 彻底删除系统字典明细
 */
export async function forceDeleteByIdsDictDetail(
  dict_detail_ids: DictDetailId[],
): Promise<number> {
  
  const dict_detail_num = await dict_detailDao.forceDeleteByIdsDictDetail(dict_detail_ids);
  
  return dict_detail_num;
}

/**
 * 获取系统字典明细字段注释
 */
export async function getFieldCommentsDictDetail(): Promise<DictDetailFieldComment> {
  const dict_detail_fields = await dict_detailDao.getFieldCommentsDictDetail();
  return dict_detail_fields;
}

/**
 * 查找 系统字典明细 order_by 字段的最大值
 */
export async function findLastOrderByDictDetail(
): Promise<number> {
  const dict_detail_sort = await dict_detailDao.findLastOrderByDictDetail();
  return dict_detail_sort;
}
