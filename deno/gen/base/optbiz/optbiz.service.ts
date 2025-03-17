import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as optbizDao from "./optbiz.dao.ts";

async function setSearchQuery(
  _search: OptbizSearch,
) {
  
}

/**
 * 根据条件查找业务选项总数
 */
export async function findCount(
  search?: OptbizSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const optbiz_num = await optbizDao.findCount(search);
  
  return optbiz_num;
}

/**
 * 根据搜索条件和分页查找业务选项列表
 */
export async function findAll(
  search?: OptbizSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<OptbizModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const optbiz_models = await optbizDao.findAll(search, page, sort);
  
  return optbiz_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: OptbizInput,
): Promise<void> {
  await optbizDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个业务选项
 */
export async function findOne(
  search?: OptbizSearch,
  sort?: SortInput[],
): Promise<OptbizModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const optbiz_model = await optbizDao.findOne(search, sort);
  
  return optbiz_model;
}

/**
 * 根据 id 查找业务选项
 */
export async function findById(
  optbiz_id?: OptbizId | null,
): Promise<OptbizModel | undefined> {
  
  const optbiz_model = await optbizDao.findById(optbiz_id);
  
  return optbiz_model;
}

/**
 * 根据 ids 查找业务选项
 */
export async function findByIds(
  optbiz_ids: OptbizId[],
): Promise<OptbizModel[]> {
  
  const optbiz_models = await optbizDao.findByIds(optbiz_ids);
  
  return optbiz_models;
}

/**
 * 根据搜索条件查找业务选项是否存在
 */
export async function exist(
  search?: OptbizSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const optbiz_exist = await optbizDao.exist(search);
  
  return optbiz_exist;
}

/**
 * 根据 id 查找业务选项是否存在
 */
export async function existById(
  optbiz_id?: OptbizId | null,
): Promise<boolean> {
  
  const optbiz_exist = await optbizDao.existById(optbiz_id);
  
  return optbiz_exist;
}

/**
 * 增加和修改时校验业务选项
 */
export async function validate(
  input: OptbizInput,
): Promise<void> {
  await optbizDao.validate(input);
}

/**
 * 批量创建业务选项
 */
export async function creates(
  inputs: OptbizInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<OptbizId[]> {
  const optbiz_ids = await optbizDao.creates(inputs, options);
  
  return optbiz_ids;
}

/**
 * 根据 id 获取业务选项版本号
 */
export async function getVersionById(id: OptbizId) {
  const version = await optbizDao.getVersionById(id);
  return version;
}

/**
 * 根据 id 修改业务选项
 */
export async function updateById(
  optbiz_id: OptbizId,
  input: OptbizInput,
): Promise<OptbizId> {
  
  const old_model = await optbizDao.validateOption(
    await optbizDao.findById(optbiz_id),
  );
  
  const is_locked = await optbizDao.getIsLockedById(optbiz_id);
  if (is_locked) {
    throw "不能修改已经锁定的 业务选项";
  }
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 名称
    input.lbl = undefined;
    // 键
    input.ky = undefined;
  }
  
  const optbiz_id2 = await optbizDao.updateById(optbiz_id, input);
  
  return optbiz_id2;
}

/** 校验业务选项是否存在 */
export async function validateOption(
  model0?: OptbizModel,
): Promise<OptbizModel> {
  const optbiz_model = await optbizDao.validateOption(model0);
  return optbiz_model;
}

/**
 * 根据 ids 删除业务选项
 */
export async function deleteByIds(
  optbiz_ids: OptbizId[],
): Promise<number> {
  
  const old_models = await optbizDao.findByIds(optbiz_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 业务选项";
    }
  }
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const optbiz_num = await optbizDao.deleteByIds(optbiz_ids);
  return optbiz_num;
}

/**
 * 根据 ids 启用或者禁用业务选项
 */
export async function enableByIds(
  ids: OptbizId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const optbiz_num = await optbizDao.enableByIds(ids, is_enabled);
  return optbiz_num;
}

/**
 * 根据 ids 锁定或者解锁业务选项
 */
export async function lockByIds(
  optbiz_ids: OptbizId[],
  is_locked: 0 | 1,
): Promise<number> {
  const optbiz_num = await optbizDao.lockByIds(optbiz_ids, is_locked);
  return optbiz_num;
}

/**
 * 根据 ids 还原业务选项
 */
export async function revertByIds(
  optbiz_ids: OptbizId[],
): Promise<number> {
  
  const optbiz_num = await optbizDao.revertByIds(optbiz_ids);
  
  return optbiz_num;
}

/**
 * 根据 ids 彻底删除业务选项
 */
export async function forceDeleteByIds(
  optbiz_ids: OptbizId[],
): Promise<number> {
  
  const optbiz_num = await optbizDao.forceDeleteByIds(optbiz_ids);
  
  return optbiz_num;
}

/**
 * 获取业务选项字段注释
 */
export async function getFieldComments(): Promise<OptbizFieldComment> {
  const optbiz_fields = await optbizDao.getFieldComments();
  return optbiz_fields;
}

/**
 * 查找 业务选项 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const optbiz_sort = await optbizDao.findLastOrderBy();
  return optbiz_sort;
}
