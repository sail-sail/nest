import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as iconDao from "./icon.dao.ts";

async function setSearchQuery(
  _search: IconSearch,
) {
  
}

/**
 * 根据条件查找图标库总数
 */
export async function findCount(
  search?: IconSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const icon_num = await iconDao.findCount(search);
  
  return icon_num;
}

/**
 * 根据搜索条件和分页查找图标库列表
 */
export async function findAll(
  search?: IconSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<IconModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const icon_models = await iconDao.findAll(search, page, sort);
  
  return icon_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: IconInput,
): Promise<void> {
  await iconDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个图标库
 */
export async function findOne(
  search?: IconSearch,
  sort?: SortInput[],
): Promise<IconModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const icon_model = await iconDao.findOne(search, sort);
  
  return icon_model;
}

/**
 * 根据 id 查找图标库
 */
export async function findById(
  icon_id?: IconId | null,
): Promise<IconModel | undefined> {
  
  const icon_model = await iconDao.findById(icon_id);
  
  return icon_model;
}

/**
 * 根据 ids 查找图标库
 */
export async function findByIds(
  icon_ids: IconId[],
): Promise<IconModel[]> {
  
  const icon_models = await iconDao.findByIds(icon_ids);
  
  return icon_models;
}

/**
 * 根据搜索条件查找图标库是否存在
 */
export async function exist(
  search?: IconSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const icon_exist = await iconDao.exist(search);
  
  return icon_exist;
}

/**
 * 根据 id 查找图标库是否存在
 */
export async function existById(
  icon_id?: IconId | null,
): Promise<boolean> {
  
  const icon_exist = await iconDao.existById(icon_id);
  
  return icon_exist;
}

/**
 * 增加和修改时校验图标库
 */
export async function validate(
  input: IconInput,
): Promise<void> {
  await iconDao.validate(input);
}

/**
 * 批量创建图标库
 */
export async function creates(
  inputs: IconInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<IconId[]> {
  const icon_ids = await iconDao.creates(inputs, options);
  
  return icon_ids;
}

/**
 * 根据 id 修改图标库
 */
export async function updateById(
  icon_id: IconId,
  input: IconInput,
): Promise<IconId> {
  
  const icon_id2 = await iconDao.updateById(icon_id, input);
  
  return icon_id2;
}

/** 校验图标库是否存在 */
export async function validateOption(
  model0?: IconModel,
): Promise<IconModel> {
  const icon_model = await iconDao.validateOption(model0);
  return icon_model;
}

/**
 * 根据 ids 删除图标库
 */
export async function deleteByIds(
  icon_ids: IconId[],
): Promise<number> {
  
  const icon_num = await iconDao.deleteByIds(icon_ids);
  return icon_num;
}

/**
 * 根据 ids 启用或者禁用图标库
 */
export async function enableByIds(
  ids: IconId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const icon_num = await iconDao.enableByIds(ids, is_enabled);
  return icon_num;
}

/**
 * 根据 ids 还原图标库
 */
export async function revertByIds(
  icon_ids: IconId[],
): Promise<number> {
  
  const icon_num = await iconDao.revertByIds(icon_ids);
  
  return icon_num;
}

/**
 * 根据 ids 彻底删除图标库
 */
export async function forceDeleteByIds(
  icon_ids: IconId[],
): Promise<number> {
  
  const icon_num = await iconDao.forceDeleteByIds(icon_ids);
  
  return icon_num;
}

/**
 * 获取图标库字段注释
 */
export async function getFieldComments(): Promise<IconFieldComment> {
  const icon_fields = await iconDao.getFieldComments();
  return icon_fields;
}

/**
 * 查找 图标库 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const icon_sort = await iconDao.findLastOrderBy();
  return icon_sort;
}
