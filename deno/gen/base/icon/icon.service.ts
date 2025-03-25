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
export async function findCountIcon(
  search?: IconSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const icon_num = await iconDao.findCountIcon(search);
  
  return icon_num;
}

/**
 * 根据搜索条件和分页查找图标库列表
 */
export async function findAllIcon(
  search?: IconSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<IconModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const icon_models = await iconDao.findAllIcon(search, page, sort);
  
  return icon_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblIcon(
  input: IconInput,
): Promise<void> {
  await iconDao.setIdByLblIcon(input);
}

/**
 * 根据条件查找第一个图标库
 */
export async function findOneIcon(
  search?: IconSearch,
  sort?: SortInput[],
): Promise<IconModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const icon_model = await iconDao.findOneIcon(search, sort);
  
  return icon_model;
}

/**
 * 根据 id 查找图标库
 */
export async function findByIdIcon(
  icon_id?: IconId | null,
): Promise<IconModel | undefined> {
  
  const icon_model = await iconDao.findByIdIcon(icon_id);
  
  return icon_model;
}

/**
 * 根据 ids 查找图标库
 */
export async function findByIdsIcon(
  icon_ids: IconId[],
): Promise<IconModel[]> {
  
  const icon_models = await iconDao.findByIdsIcon(icon_ids);
  
  return icon_models;
}

/**
 * 根据搜索条件查找图标库是否存在
 */
export async function existIcon(
  search?: IconSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const icon_exist = await iconDao.existIcon(search);
  
  return icon_exist;
}

/**
 * 根据 id 查找图标库是否存在
 */
export async function existByIdIcon(
  icon_id?: IconId | null,
): Promise<boolean> {
  
  const icon_exist = await iconDao.existByIdIcon(icon_id);
  
  return icon_exist;
}

/**
 * 增加和修改时校验图标库
 */
export async function validateIcon(
  input: IconInput,
): Promise<void> {
  await iconDao.validateIcon(input);
}

/**
 * 批量创建图标库
 */
export async function createsIcon(
  inputs: IconInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<IconId[]> {
  const icon_ids = await iconDao.createsIcon(inputs, options);
  
  return icon_ids;
}

/**
 * 根据 id 修改图标库
 */
export async function updateByIdIcon(
  icon_id: IconId,
  input: IconInput,
): Promise<IconId> {
  
  const icon_id2 = await iconDao.updateByIdIcon(icon_id, input);
  
  return icon_id2;
}

/** 校验图标库是否存在 */
export async function validateOptionIcon(
  model0?: IconModel,
): Promise<IconModel> {
  const icon_model = await iconDao.validateOptionIcon(model0);
  return icon_model;
}

/**
 * 根据 ids 删除图标库
 */
export async function deleteByIdsIcon(
  icon_ids: IconId[],
): Promise<number> {
  
  const icon_num = await iconDao.deleteByIdsIcon(icon_ids);
  return icon_num;
}

/**
 * 根据 ids 启用或者禁用图标库
 */
export async function enableByIdsIcon(
  ids: IconId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const icon_num = await iconDao.enableByIdsIcon(ids, is_enabled);
  return icon_num;
}

/**
 * 根据 ids 还原图标库
 */
export async function revertByIdsIcon(
  icon_ids: IconId[],
): Promise<number> {
  
  const icon_num = await iconDao.revertByIdsIcon(icon_ids);
  
  return icon_num;
}

/**
 * 根据 ids 彻底删除图标库
 */
export async function forceDeleteByIdsIcon(
  icon_ids: IconId[],
): Promise<number> {
  
  const icon_num = await iconDao.forceDeleteByIdsIcon(icon_ids);
  
  return icon_num;
}

/**
 * 获取图标库字段注释
 */
export async function getFieldCommentsIcon(): Promise<IconFieldComment> {
  const icon_fields = await iconDao.getFieldCommentsIcon();
  return icon_fields;
}

/**
 * 查找 图标库 order_by 字段的最大值
 */
export async function findLastOrderByIcon(
): Promise<number> {
  const icon_sort = await iconDao.findLastOrderByIcon();
  return icon_sort;
}
