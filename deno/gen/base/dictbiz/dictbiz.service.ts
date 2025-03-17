import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as dictbizDao from "./dictbiz.dao.ts";

async function setSearchQuery(
  _search: DictbizSearch,
) {
  
}

/**
 * 根据条件查找业务字典总数
 */
export async function findCount(
  search?: DictbizSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_num = await dictbizDao.findCount(search);
  
  return dictbiz_num;
}

/**
 * 根据搜索条件和分页查找业务字典列表
 */
export async function findAll(
  search?: DictbizSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictbizModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_models = await dictbizDao.findAll(search, page, sort);
  
  return dictbiz_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: DictbizInput,
): Promise<void> {
  await dictbizDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个业务字典
 */
export async function findOne(
  search?: DictbizSearch,
  sort?: SortInput[],
): Promise<DictbizModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_model = await dictbizDao.findOne(search, sort);
  
  return dictbiz_model;
}

/**
 * 根据 id 查找业务字典
 */
export async function findById(
  dictbiz_id?: DictbizId | null,
): Promise<DictbizModel | undefined> {
  
  const dictbiz_model = await dictbizDao.findById(dictbiz_id);
  
  return dictbiz_model;
}

/**
 * 根据 ids 查找业务字典
 */
export async function findByIds(
  dictbiz_ids: DictbizId[],
): Promise<DictbizModel[]> {
  
  const dictbiz_models = await dictbizDao.findByIds(dictbiz_ids);
  
  return dictbiz_models;
}

/**
 * 根据搜索条件查找业务字典是否存在
 */
export async function exist(
  search?: DictbizSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_exist = await dictbizDao.exist(search);
  
  return dictbiz_exist;
}

/**
 * 根据 id 查找业务字典是否存在
 */
export async function existById(
  dictbiz_id?: DictbizId | null,
): Promise<boolean> {
  
  const dictbiz_exist = await dictbizDao.existById(dictbiz_id);
  
  return dictbiz_exist;
}

/**
 * 增加和修改时校验业务字典
 */
export async function validate(
  input: DictbizInput,
): Promise<void> {
  await dictbizDao.validate(input);
}

/**
 * 批量创建业务字典
 */
export async function creates(
  inputs: DictbizInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DictbizId[]> {
  
  for (const input of inputs) {
    input.is_add = undefined;
  }
  
  const dictbiz_ids = await dictbizDao.creates(inputs, options);
  return dictbiz_ids;
}

/**
 * 根据 id 修改业务字典
 */
export async function updateById(
  dictbiz_id: DictbizId,
  input: DictbizInput,
): Promise<DictbizId> {
  
  input.is_add = undefined;
  
  const dictbiz_id2 = await dictbizDao.updateById(dictbiz_id, input);
  return dictbiz_id2;
}

/** 校验业务字典是否存在 */
export async function validateOption(
  model0?: DictbizModel,
): Promise<DictbizModel> {
  const dictbiz_model = await dictbizDao.validateOption(model0);
  return dictbiz_model;
}

/**
 * 根据 ids 删除业务字典
 */
export async function deleteByIds(
  dictbiz_ids: DictbizId[],
): Promise<number> {
  
  const old_models = await dictbizDao.findByIds(dictbiz_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const dictbiz_num = await dictbizDao.deleteByIds(dictbiz_ids);
  return dictbiz_num;
}

/**
 * 根据 ids 启用或者禁用业务字典
 */
export async function enableByIds(
  ids: DictbizId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const dictbiz_num = await dictbizDao.enableByIds(ids, is_enabled);
  return dictbiz_num;
}

/**
 * 根据 ids 还原业务字典
 */
export async function revertByIds(
  dictbiz_ids: DictbizId[],
): Promise<number> {
  
  const dictbiz_num = await dictbizDao.revertByIds(dictbiz_ids);
  
  return dictbiz_num;
}

/**
 * 根据 ids 彻底删除业务字典
 */
export async function forceDeleteByIds(
  dictbiz_ids: DictbizId[],
): Promise<number> {
  
  const dictbiz_num = await dictbizDao.forceDeleteByIds(dictbiz_ids);
  
  return dictbiz_num;
}

/**
 * 获取业务字典字段注释
 */
export async function getFieldComments(): Promise<DictbizFieldComment> {
  const dictbiz_fields = await dictbizDao.getFieldComments();
  return dictbiz_fields;
}

/**
 * 查找 业务字典 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const dictbiz_sort = await dictbizDao.findLastOrderBy();
  return dictbiz_sort;
}
