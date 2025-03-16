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
export async function findCount(
  search?: DictbizDetailSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_detail_num = await dictbiz_detailDao.findCount(search);
  
  return dictbiz_detail_num;
}

/**
 * 根据搜索条件和分页查找业务字典明细列表
 */
export async function findAll(
  search?: DictbizDetailSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictbizDetailModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_detail_models = await dictbiz_detailDao.findAll(search, page, sort);
  
  return dictbiz_detail_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: DictbizDetailInput,
): Promise<void> {
  await dictbiz_detailDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个业务字典明细
 */
export async function findOne(
  search?: DictbizDetailSearch,
  sort?: SortInput[],
): Promise<DictbizDetailModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_detail_model = await dictbiz_detailDao.findOne(search, sort);
  
  return dictbiz_detail_model;
}

/**
 * 根据 id 查找业务字典明细
 */
export async function findById(
  id?: DictbizDetailId | null,
): Promise<DictbizDetailModel | undefined> {
  
  const dictbiz_detail_model = await dictbiz_detailDao.findById(id);
  
  return dictbiz_detail_model;
}

/**
 * 根据搜索条件查找业务字典明细是否存在
 */
export async function exist(
  search?: DictbizDetailSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_detail_exist = await dictbiz_detailDao.exist(search);
  
  return dictbiz_detail_exist;
}

/**
 * 根据 id 查找业务字典明细是否存在
 */
export async function existById(
  id?: DictbizDetailId | null,
): Promise<boolean> {
  
  const dictbiz_detail_exist = await dictbiz_detailDao.existById(id);
  
  return dictbiz_detail_exist;
}

/**
 * 增加和修改时校验业务字典明细
 */
export async function validate(
  input: DictbizDetailInput,
): Promise<void> {
  await dictbiz_detailDao.validate(input);
}

/**
 * 批量创建业务字典明细
 */
export async function creates(
  inputs: DictbizDetailInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DictbizDetailId[]> {
  const dictbiz_detail_ids = await dictbiz_detailDao.creates(inputs, options);
  
  return dictbiz_detail_ids;
}

/**
 * 根据 id 修改业务字典明细
 */
export async function updateById(
  dictbiz_detail_id: DictbizDetailId,
  input: DictbizDetailInput,
): Promise<DictbizDetailId> {
  
  const dictbiz_detail_id2 = await dictbiz_detailDao.updateById(dictbiz_detail_id, input);
  
  return dictbiz_detail_id2;
}

/** 校验业务字典明细是否存在 */
export async function validateOption(
  model0?: DictbizDetailModel,
): Promise<DictbizDetailModel> {
  const dictbiz_detail_model = await dictbiz_detailDao.validateOption(model0);
  return dictbiz_detail_model;
}

/**
 * 根据 ids 删除业务字典明细
 */
export async function deleteByIds(
  ids: DictbizDetailId[],
): Promise<number> {
  
  const old_models = await dictbiz_detailDao.findAll({
    ids,
  });
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const dictbiz_detail_num = await dictbiz_detailDao.deleteByIds(ids);
  return dictbiz_detail_num;
}

/**
 * 根据 ids 启用或者禁用业务字典明细
 */
export async function enableByIds(
  ids: DictbizDetailId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const dictbiz_detail_num = await dictbiz_detailDao.enableByIds(ids, is_enabled);
  return dictbiz_detail_num;
}

/**
 * 根据 ids 还原业务字典明细
 */
export async function revertByIds(
  ids: DictbizDetailId[],
): Promise<number> {
  
  const dictbiz_detail_num = await dictbiz_detailDao.revertByIds(ids);
  
  return dictbiz_detail_num;
}

/**
 * 根据 ids 彻底删除业务字典明细
 */
export async function forceDeleteByIds(
  ids: DictbizDetailId[],
): Promise<number> {
  
  const dictbiz_detail_num = await dictbiz_detailDao.forceDeleteByIds(ids);
  
  return dictbiz_detail_num;
}

/**
 * 获取业务字典明细字段注释
 */
export async function getFieldComments(): Promise<DictbizDetailFieldComment> {
  const dictbiz_detail_fields = await dictbiz_detailDao.getFieldComments();
  return dictbiz_detail_fields;
}

/**
 * 查找 业务字典明细 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const dictbiz_detail_sort = await dictbiz_detailDao.findLastOrderBy();
  return dictbiz_detail_sort;
}
