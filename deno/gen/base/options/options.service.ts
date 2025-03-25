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
export async function findCountOptions(
  search?: OptionsSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const options_num = await optionsDao.findCountOptions(search);
  
  return options_num;
}

/**
 * 根据搜索条件和分页查找系统选项列表
 */
export async function findAllOptions(
  search?: OptionsSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OptionsModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const options_models = await optionsDao.findAllOptions(search, page, sort);
  
  return options_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblOptions(
  input: OptionsInput,
): Promise<void> {
  await optionsDao.setIdByLblOptions(input);
}

/**
 * 根据条件查找第一个系统选项
 */
export async function findOneOptions(
  search?: OptionsSearch,
  sort?: SortInput[],
): Promise<OptionsModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const options_model = await optionsDao.findOneOptions(search, sort);
  
  return options_model;
}

/**
 * 根据 id 查找系统选项
 */
export async function findByIdOptions(
  options_id?: OptionsId | null,
): Promise<OptionsModel | undefined> {
  
  const options_model = await optionsDao.findByIdOptions(options_id);
  
  return options_model;
}

/**
 * 根据 ids 查找系统选项
 */
export async function findByIdsOptions(
  options_ids: OptionsId[],
): Promise<OptionsModel[]> {
  
  const options_models = await optionsDao.findByIdsOptions(options_ids);
  
  return options_models;
}

/**
 * 根据搜索条件查找系统选项是否存在
 */
export async function existOptions(
  search?: OptionsSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const options_exist = await optionsDao.existOptions(search);
  
  return options_exist;
}

/**
 * 根据 id 查找系统选项是否存在
 */
export async function existByIdOptions(
  options_id?: OptionsId | null,
): Promise<boolean> {
  
  const options_exist = await optionsDao.existByIdOptions(options_id);
  
  return options_exist;
}

/**
 * 增加和修改时校验系统选项
 */
export async function validateOptions(
  input: OptionsInput,
): Promise<void> {
  await optionsDao.validateOptions(input);
}

/**
 * 批量创建系统选项
 */
export async function createsOptions(
  inputs: OptionsInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<OptionsId[]> {
  const options_ids = await optionsDao.createsOptions(inputs, options);
  
  return options_ids;
}

/**
 * 根据 id 获取系统选项版本号
 */
export async function getVersionByIdOptions(id: OptionsId) {
  const version = await optionsDao.getVersionByIdOptions(id);
  return version;
}

/**
 * 根据 id 修改系统选项
 */
export async function updateByIdOptions(
  options_id: OptionsId,
  input: OptionsInput,
): Promise<OptionsId> {
  
  const old_model = await optionsDao.validateOptionOptions(
    await optionsDao.findByIdOptions(options_id),
  );
  
  const is_locked = await optionsDao.getIsLockedByIdOptions(options_id);
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
  
  const options_id2 = await optionsDao.updateByIdOptions(options_id, input);
  
  return options_id2;
}

/** 校验系统选项是否存在 */
export async function validateOptionOptions(
  model0?: OptionsModel,
): Promise<OptionsModel> {
  const options_model = await optionsDao.validateOptionOptions(model0);
  return options_model;
}

/**
 * 根据 ids 删除系统选项
 */
export async function deleteByIdsOptions(
  options_ids: OptionsId[],
): Promise<number> {
  
  const old_models = await optionsDao.findByIdsOptions(options_ids);
  
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
  
  const options_num = await optionsDao.deleteByIdsOptions(options_ids);
  return options_num;
}

/**
 * 根据 ids 启用或者禁用系统选项
 */
export async function enableByIdsOptions(
  ids: OptionsId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const options_num = await optionsDao.enableByIdsOptions(ids, is_enabled);
  return options_num;
}

/**
 * 根据 ids 锁定或者解锁系统选项
 */
export async function lockByIdsOptions(
  options_ids: OptionsId[],
  is_locked: 0 | 1,
): Promise<number> {
  const options_num = await optionsDao.lockByIdsOptions(options_ids, is_locked);
  return options_num;
}

/**
 * 根据 ids 还原系统选项
 */
export async function revertByIdsOptions(
  options_ids: OptionsId[],
): Promise<number> {
  
  const options_num = await optionsDao.revertByIdsOptions(options_ids);
  
  return options_num;
}

/**
 * 根据 ids 彻底删除系统选项
 */
export async function forceDeleteByIdsOptions(
  options_ids: OptionsId[],
): Promise<number> {
  
  const options_num = await optionsDao.forceDeleteByIdsOptions(options_ids);
  
  return options_num;
}

/**
 * 获取系统选项字段注释
 */
export async function getFieldCommentsOptions(): Promise<OptionsFieldComment> {
  const options_fields = await optionsDao.getFieldCommentsOptions();
  return options_fields;
}

/**
 * 查找 系统选项 order_by 字段的最大值
 */
export async function findLastOrderByOptions(
): Promise<number> {
  const options_sort = await optionsDao.findLastOrderByOptions();
  return options_sort;
}
