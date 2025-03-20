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
export async function findCount(
  search?: DictDetailSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_detail_num = await dict_detailDao.findCount(search);
  
  return dict_detail_num;
}

/**
 * 根据搜索条件和分页查找系统字典明细列表
 */
export async function findAll(
  search?: DictDetailSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictDetailModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_detail_models = await dict_detailDao.findAll(search, page, sort);
  
  return dict_detail_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: DictDetailInput,
): Promise<void> {
  await dict_detailDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个系统字典明细
 */
export async function findOne(
  search?: DictDetailSearch,
  sort?: SortInput[],
): Promise<DictDetailModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_detail_model = await dict_detailDao.findOne(search, sort);
  
  return dict_detail_model;
}

/**
 * 根据 id 查找系统字典明细
 */
export async function findById(
  dict_detail_id?: DictDetailId | null,
): Promise<DictDetailModel | undefined> {
  
  const dict_detail_model = await dict_detailDao.findById(dict_detail_id);
  
  return dict_detail_model;
}

/**
 * 根据 ids 查找系统字典明细
 */
export async function findByIds(
  dict_detail_ids: DictDetailId[],
): Promise<DictDetailModel[]> {
  
  const dict_detail_models = await dict_detailDao.findByIds(dict_detail_ids);
  
  return dict_detail_models;
}

/**
 * 根据搜索条件查找系统字典明细是否存在
 */
export async function exist(
  search?: DictDetailSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_detail_exist = await dict_detailDao.exist(search);
  
  return dict_detail_exist;
}

/**
 * 根据 id 查找系统字典明细是否存在
 */
export async function existById(
  dict_detail_id?: DictDetailId | null,
): Promise<boolean> {
  
  const dict_detail_exist = await dict_detailDao.existById(dict_detail_id);
  
  return dict_detail_exist;
}

/**
 * 增加和修改时校验系统字典明细
 */
export async function validate(
  input: DictDetailInput,
): Promise<void> {
  await dict_detailDao.validate(input);
}

/**
 * 批量创建系统字典明细
 */
export async function creates(
  inputs: DictDetailInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DictDetailId[]> {
  const dict_detail_ids = await dict_detailDao.creates(inputs, options);
  
  return dict_detail_ids;
}

/**
 * 根据 id 修改系统字典明细
 */
export async function updateById(
  dict_detail_id: DictDetailId,
  input: DictDetailInput,
): Promise<DictDetailId> {
  
  const old_model = await dict_detailDao.validateOption(
    await dict_detailDao.findById(dict_detail_id),
  );
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 值
    input.val = undefined;
  }
  
  const dict_detail_id2 = await dict_detailDao.updateById(dict_detail_id, input);
  
  return dict_detail_id2;
}

/** 校验系统字典明细是否存在 */
export async function validateOption(
  model0?: DictDetailModel,
): Promise<DictDetailModel> {
  const dict_detail_model = await dict_detailDao.validateOption(model0);
  return dict_detail_model;
}

/**
 * 根据 ids 删除系统字典明细
 */
export async function deleteByIds(
  dict_detail_ids: DictDetailId[],
): Promise<number> {
  
  const old_models = await dict_detailDao.findByIds(dict_detail_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const dict_detail_num = await dict_detailDao.deleteByIds(dict_detail_ids);
  return dict_detail_num;
}

/**
 * 根据 ids 启用或者禁用系统字典明细
 */
export async function enableByIds(
  ids: DictDetailId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const dict_detail_num = await dict_detailDao.enableByIds(ids, is_enabled);
  return dict_detail_num;
}

/**
 * 根据 ids 还原系统字典明细
 */
export async function revertByIds(
  dict_detail_ids: DictDetailId[],
): Promise<number> {
  
  const dict_detail_num = await dict_detailDao.revertByIds(dict_detail_ids);
  
  return dict_detail_num;
}

/**
 * 根据 ids 彻底删除系统字典明细
 */
export async function forceDeleteByIds(
  dict_detail_ids: DictDetailId[],
): Promise<number> {
  
  const dict_detail_num = await dict_detailDao.forceDeleteByIds(dict_detail_ids);
  
  return dict_detail_num;
}

/**
 * 获取系统字典明细字段注释
 */
export async function getFieldComments(): Promise<DictDetailFieldComment> {
  const dict_detail_fields = await dict_detailDao.getFieldComments();
  return dict_detail_fields;
}

/**
 * 查找 系统字典明细 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const dict_detail_sort = await dict_detailDao.findLastOrderBy();
  return dict_detail_sort;
}
