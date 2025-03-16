import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as optionsDao from "./options.dao.ts";

async function setSearchQuery(
  _search: OptionsSearch,
) {
  
}

/**
 * 根据条件查找系统选项总数
 */
export async function findCount(
  search?: OptionsSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const options_num = await optionsDao.findCount(search);
  
  return options_num;
}

/**
 * 根据搜索条件和分页查找系统选项列表
 */
export async function findAll(
  search?: OptionsSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OptionsModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const options_models = await optionsDao.findAll(search, page, sort);
  
  return options_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: OptionsInput,
): Promise<void> {
  await optionsDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个系统选项
 */
export async function findOne(
  search?: OptionsSearch,
  sort?: SortInput[],
): Promise<OptionsModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const options_model = await optionsDao.findOne(search, sort);
  
  return options_model;
}

/**
 * 根据 id 查找系统选项
 */
export async function findById(
  id?: OptionsId | null,
): Promise<OptionsModel | undefined> {
  
  const options_model = await optionsDao.findById(id);
  
  return options_model;
}

/**
 * 根据搜索条件查找系统选项是否存在
 */
export async function exist(
  search?: OptionsSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const options_exist = await optionsDao.exist(search);
  
  return options_exist;
}

/**
 * 根据 id 查找系统选项是否存在
 */
export async function existById(
  id?: OptionsId | null,
): Promise<boolean> {
  
  const options_exist = await optionsDao.existById(id);
  
  return options_exist;
}

/**
 * 增加和修改时校验系统选项
 */
export async function validate(
  input: OptionsInput,
): Promise<void> {
  await optionsDao.validate(input);
}

/**
 * 批量创建系统选项
 */
export async function creates(
  inputs: OptionsInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<OptionsId[]> {
  const options_ids = await optionsDao.creates(inputs, options);
  
  return options_ids;
}

/**
 * 根据 id 获取系统选项版本号
 */
export async function getVersionById(id: OptionsId) {
  const version = await optionsDao.getVersionById(id);
  return version;
}

/**
 * 根据 id 修改系统选项
 */
export async function updateById(
  options_id: OptionsId,
  input: OptionsInput,
): Promise<OptionsId> {
  
  const old_model = await optionsDao.validateOption(
    await optionsDao.findById(id),
  );
  
  const is_locked = await optionsDao.getIsLockedById(options_id);
  if (is_locked) {
    throw "不能修改已经锁定的 系统选项";
  }
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 名称
    input.lbl = undefined;
    // 键
    input.ky = undefined;
  }
  
  const options_id2 = await optionsDao.updateById(options_id, input);
  
  return options_id2;
}

/** 校验系统选项是否存在 */
export async function validateOption(
  model0?: OptionsModel,
): Promise<OptionsModel> {
  const options_model = await optionsDao.validateOption(model0);
  return options_model;
}

/**
 * 根据 ids 删除系统选项
 */
export async function deleteByIds(
  ids: OptionsId[],
): Promise<number> {
  
  const old_models = await optionsDao.findAll({
    ids,
  });
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 系统选项";
    }
  }
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const options_num = await optionsDao.deleteByIds(ids);
  return options_num;
}

/**
 * 根据 ids 启用或者禁用系统选项
 */
export async function enableByIds(
  ids: OptionsId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const options_num = await optionsDao.enableByIds(ids, is_enabled);
  return options_num;
}

/**
 * 根据 ids 锁定或者解锁系统选项
 */
export async function lockByIds(
  ids: OptionsId[],
  is_locked: 0 | 1,
): Promise<number> {
  const options_num = await optionsDao.lockByIds(ids, is_locked);
  return options_num;
}

/**
 * 根据 ids 还原系统选项
 */
export async function revertByIds(
  ids: OptionsId[],
): Promise<number> {
  
  const options_num = await optionsDao.revertByIds(ids);
  
  return options_num;
}

/**
 * 根据 ids 彻底删除系统选项
 */
export async function forceDeleteByIds(
  ids: OptionsId[],
): Promise<number> {
  
  const options_num = await optionsDao.forceDeleteByIds(ids);
  
  return options_num;
}

/**
 * 获取系统选项字段注释
 */
export async function getFieldComments(): Promise<OptionsFieldComment> {
  const options_fields = await optionsDao.getFieldComments();
  return options_fields;
}

/**
 * 查找 系统选项 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const options_sort = await optionsDao.findLastOrderBy();
  return options_sort;
}
