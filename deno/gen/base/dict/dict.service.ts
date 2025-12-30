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
export async function findCountDict(
  search?: DictSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_num = await dictDao.findCountDict(search);
  
  return dict_num;
}

/**
 * 根据搜索条件和分页查找系统字典列表
 */
export async function findAllDict(
  search?: DictSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_models = await dictDao.findAllDict(search, page, sort);
  
  return dict_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblDict(
  input: DictInput,
): Promise<void> {
  await dictDao.setIdByLblDict(input);
}

/**
 * 根据条件查找第一个系统字典
 */
export async function findOneDict(
  search?: DictSearch,
  sort?: SortInput[],
): Promise<DictModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_model = await dictDao.findOneDict(search, sort);
  
  return dict_model;
}

/**
 * 根据条件查找第一个系统字典, 如果不存在则抛错
 */
export async function findOneOkDict(
  search?: DictSearch,
  sort?: SortInput[],
): Promise<DictModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_model = await dictDao.findOneOkDict(search, sort);
  
  return dict_model;
}

/**
 * 根据 id 查找系统字典
 */
export async function findByIdDict(
  dict_id: DictId,
): Promise<DictModel | undefined> {
  
  const dict_model = await dictDao.findByIdDict(dict_id);
  
  return dict_model;
}

/**
 * 根据 id 查找系统字典, 如果不存在则抛错
 */
export async function findByIdOkDict(
  dict_id: DictId,
): Promise<DictModel> {
  
  const dict_model = await dictDao.findByIdOkDict(dict_id);
  
  return dict_model;
}

/**
 * 根据 ids 查找系统字典
 */
export async function findByIdsDict(
  dict_ids: DictId[],
): Promise<DictModel[]> {
  
  const dict_models = await dictDao.findByIdsDict(dict_ids);
  
  return dict_models;
}

/**
 * 根据 ids 查找系统字典, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDict(
  dict_ids: DictId[],
): Promise<DictModel[]> {
  
  const dict_models = await dictDao.findByIdsOkDict(dict_ids);
  
  return dict_models;
}

/**
 * 根据搜索条件查找系统字典是否存在
 */
export async function existDict(
  search?: DictSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dict_exist = await dictDao.existDict(search);
  
  return dict_exist;
}

/**
 * 根据 id 查找系统字典是否存在
 */
export async function existByIdDict(
  dict_id?: DictId | null,
): Promise<boolean> {
  
  const dict_exist = await dictDao.existByIdDict(dict_id);
  
  return dict_exist;
}

/**
 * 增加和修改时校验系统字典
 */
export async function validateDict(
  input: DictInput,
): Promise<void> {
  await dictDao.validateDict(input);
}

/**
 * 批量创建系统字典
 */
export async function createsDict(
  inputs: DictInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DictId[]> {
  
  for (const input of inputs) {
    input.is_add = undefined;
  }
  
  const dict_ids = await dictDao.createsDict(inputs, options);
  return dict_ids;
}

/**
 * 根据 id 修改系统字典
 */
export async function updateByIdDict(
  dict_id: DictId,
  input: DictInput,
): Promise<DictId> {
  
  input.is_add = undefined;
  
  const old_model = await dictDao.validateOptionDict(
    await dictDao.findByIdDict(dict_id),
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
  
  const dict_id2 = await dictDao.updateByIdDict(dict_id, input);
  
  return dict_id2;
}

/** 校验系统字典是否存在 */
export async function validateOptionDict(
  model0?: DictModel,
): Promise<DictModel> {
  const dict_model = await dictDao.validateOptionDict(model0);
  return dict_model;
}

/**
 * 根据 ids 删除系统字典
 */
export async function deleteByIdsDict(
  dict_ids: DictId[],
): Promise<number> {
  
  const old_models = await dictDao.findByIdsDict(dict_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const dict_num = await dictDao.deleteByIdsDict(dict_ids);
  return dict_num;
}

/**
 * 根据 ids 启用或者禁用系统字典
 */
export async function enableByIdsDict(
  ids: DictId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const dict_num = await dictDao.enableByIdsDict(ids, is_enabled);
  return dict_num;
}

/**
 * 根据 ids 还原系统字典
 */
export async function revertByIdsDict(
  dict_ids: DictId[],
): Promise<number> {
  
  const dict_num = await dictDao.revertByIdsDict(dict_ids);
  
  return dict_num;
}

/**
 * 根据 ids 彻底删除系统字典
 */
export async function forceDeleteByIdsDict(
  dict_ids: DictId[],
): Promise<number> {
  
  const dict_num = await dictDao.forceDeleteByIdsDict(dict_ids);
  
  return dict_num;
}

/**
 * 获取系统字典字段注释
 */
export async function getFieldCommentsDict(): Promise<DictFieldComment> {
  const dict_fields = await dictDao.getFieldCommentsDict();
  return dict_fields;
}

/**
 * 查找 系统字典 order_by 字段的最大值
 */
export async function findLastOrderByDict(
  search?: DictSearch,
): Promise<number> {
  
  const order_by = await dictDao.findLastOrderByDict(search);
  
  return order_by;
}
