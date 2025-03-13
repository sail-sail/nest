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
  
  const data = await dict_detailDao.findCount(search);
  return data;
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
  
  const models: DictDetailModel[] = await dict_detailDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: DictDetailInput,
) {
  const data = await dict_detailDao.setIdByLbl(input);
  return data;
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
  
  const model = await dict_detailDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找系统字典明细
 */
export async function findById(
  id?: DictDetailId | null,
): Promise<DictDetailModel | undefined> {
  const model = await dict_detailDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找系统字典明细是否存在
 */
export async function exist(
  search?: DictDetailSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await dict_detailDao.exist(search);
  return data;
}

/**
 * 根据 id 查找系统字典明细是否存在
 */
export async function existById(
  id?: DictDetailId | null,
): Promise<boolean> {
  const data = await dict_detailDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验系统字典明细
 */
export async function validate(
  input: DictDetailInput,
): Promise<void> {
  const data = await dict_detailDao.validate(input);
  return data;
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
  const ids = await dict_detailDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改系统字典明细
 */
export async function updateById(
  id: DictDetailId,
  input: DictDetailInput,
): Promise<DictDetailId> {
  
  const old_model = await dict_detailDao.validateOption(
    await dict_detailDao.findById(id),
  );
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 值
    input.val = undefined;
  }
  
  const id2 = await dict_detailDao.updateById(id, input);
  return id2;
}

/** 校验系统字典明细是否存在 */
export async function validateOption(
  model0?: DictDetailModel,
): Promise<DictDetailModel> {
  const model = await dict_detailDao.validateOption(model0);
  return model;
}

/**
 * 根据 ids 删除系统字典明细
 */
export async function deleteByIds(
  ids: DictDetailId[],
): Promise<number> {
  
  const old_models = await dict_detailDao.findAll({
    ids,
  });
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const data = await dict_detailDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用系统字典明细
 */
export async function enableByIds(
  ids: DictDetailId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await dict_detailDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 还原系统字典明细
 */
export async function revertByIds(
  ids: DictDetailId[],
): Promise<number> {
  const data = await dict_detailDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除系统字典明细
 */
export async function forceDeleteByIds(
  ids: DictDetailId[],
): Promise<number> {
  const data = await dict_detailDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取系统字典明细字段注释
 */
export async function getFieldComments(): Promise<DictDetailFieldComment> {
  const data = await dict_detailDao.getFieldComments();
  return data;
}

/**
 * 查找 系统字典明细 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await dict_detailDao.findLastOrderBy();
  return data;
}
