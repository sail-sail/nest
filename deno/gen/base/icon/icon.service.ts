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
  
  const data = await iconDao.findCount(search);
  return data;
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
  
  const models: IconModel[] = await iconDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: IconInput,
) {
  const data = await iconDao.setIdByLbl(input);
  return data;
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
  
  const model = await iconDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找图标库
 */
export async function findById(
  id?: IconId | null,
): Promise<IconModel | undefined> {
  const model = await iconDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找图标库是否存在
 */
export async function exist(
  search?: IconSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await iconDao.exist(search);
  return data;
}

/**
 * 根据 id 查找图标库是否存在
 */
export async function existById(
  id?: IconId | null,
): Promise<boolean> {
  const data = await iconDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验图标库
 */
export async function validate(
  input: IconInput,
): Promise<void> {
  const data = await iconDao.validate(input);
  return data;
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
  const ids = await iconDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改图标库
 */
export async function updateById(
  id: IconId,
  input: IconInput,
): Promise<IconId> {
  
  const id2 = await iconDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除图标库
 */
export async function deleteByIds(
  ids: IconId[],
): Promise<number> {
  
  const data = await iconDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用图标库
 */
export async function enableByIds(
  ids: IconId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await iconDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 还原图标库
 */
export async function revertByIds(
  ids: IconId[],
): Promise<number> {
  const data = await iconDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除图标库
 */
export async function forceDeleteByIds(
  ids: IconId[],
): Promise<number> {
  const data = await iconDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取图标库字段注释
 */
export async function getFieldComments(): Promise<IconFieldComment> {
  const data = await iconDao.getFieldComments();
  return data;
}

/**
 * 查找 图标库 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await iconDao.findLastOrderBy();
  return data;
}
