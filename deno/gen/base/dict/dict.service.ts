import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as dictDao from "./dict.dao.ts";

async function setSearchQuery(
  _search: DictSearch,
) {
  
}

/**
 * 根据条件查找系统字典总数
 */
export async function findCount(
  search?: DictSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_num = await dictDao.findCount(search);
  
  return dict_num;
}

/**
 * 根据搜索条件和分页查找系统字典列表
 */
export async function findAll(
  search?: DictSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_models = await dictDao.findAll(search, page, sort);
  
  return dict_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: DictInput,
): Promise<void> {
  await dictDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个系统字典
 */
export async function findOne(
  search?: DictSearch,
  sort?: SortInput[],
): Promise<DictModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_model = await dictDao.findOne(search, sort);
  
  return dict_model;
}

/**
 * 根据 id 查找系统字典
 */
export async function findById(
  id?: DictId | null,
): Promise<DictModel | undefined> {
  
  const dict_model = await dictDao.findById(id);
  
  return dict_model;
}

/**
 * 根据搜索条件查找系统字典是否存在
 */
export async function exist(
  search?: DictSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_exist = await dictDao.exist(search);
  
  return dict_exist;
}

/**
 * 根据 id 查找系统字典是否存在
 */
export async function existById(
  id?: DictId | null,
): Promise<boolean> {
  
  const dict_exist = await dictDao.existById(id);
  
  return dict_exist;
}

/**
 * 增加和修改时校验系统字典
 */
export async function validate(
  input: DictInput,
): Promise<void> {
  await dictDao.validate(input);
}

/**
 * 批量创建系统字典
 */
export async function creates(
  inputs: DictInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DictId[]> {
  
  for (const input of inputs) {
    input.is_add = undefined;
  }
  
  const dict_ids = await dictDao.creates(inputs, options);
  return dict_ids;
}

/**
 * 根据 id 修改系统字典
 */
export async function updateById(
  dict_id: DictId,
  input: DictInput,
): Promise<DictId> {
  
  input.is_add = undefined;
  
  const old_model = await dictDao.validateOption(
    await dictDao.findById(dict_id),
  );
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 编码
    input.code = undefined;
    // 数据类型
    input.type = undefined;
    input.type_lbl = "";
    // 启用
    input.is_enabled = undefined;
    input.is_enabled_lbl = "";
  }
  
  const dict_id2 = await dictDao.updateById(dict_id, input);
  
  return dict_id2;
}

/** 校验系统字典是否存在 */
export async function validateOption(
  model0?: DictModel,
): Promise<DictModel> {
  const dict_model = await dictDao.validateOption(model0);
  return dict_model;
}

/**
 * 根据 ids 删除系统字典
 */
export async function deleteByIds(
  ids: DictId[],
): Promise<number> {
  
  const old_models = await dictDao.findAll({
    ids,
  });
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const dict_num = await dictDao.deleteByIds(ids);
  return dict_num;
}

/**
 * 根据 ids 启用或者禁用系统字典
 */
export async function enableByIds(
  ids: DictId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const dict_num = await dictDao.enableByIds(ids, is_enabled);
  return dict_num;
}

/**
 * 根据 ids 还原系统字典
 */
export async function revertByIds(
  ids: DictId[],
): Promise<number> {
  
  const dict_num = await dictDao.revertByIds(ids);
  
  return dict_num;
}

/**
 * 根据 ids 彻底删除系统字典
 */
export async function forceDeleteByIds(
  ids: DictId[],
): Promise<number> {
  
  const dict_num = await dictDao.forceDeleteByIds(ids);
  
  return dict_num;
}

/**
 * 获取系统字典字段注释
 */
export async function getFieldComments(): Promise<DictFieldComment> {
  const dict_fields = await dictDao.getFieldComments();
  return dict_fields;
}

/**
 * 查找 系统字典 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const dict_sort = await dictDao.findLastOrderBy();
  return dict_sort;
}
