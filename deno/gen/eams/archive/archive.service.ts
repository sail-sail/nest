import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as archiveDao from "./archive.dao.ts";

async function setSearchQuery(
  _search: ArchiveSearch,
) {
  
}

/**
 * 根据条件查找全宗设置总数
 */
export async function findCount(
  search?: ArchiveSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await archiveDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找全宗设置列表
 */
export async function findAll(
  search?: ArchiveSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<ArchiveModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: ArchiveModel[] = await archiveDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: ArchiveInput,
) {
  const data = await archiveDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个全宗设置
 */
export async function findOne(
  search?: ArchiveSearch,
  sort?: SortInput[],
): Promise<ArchiveModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await archiveDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找全宗设置
 */
export async function findById(
  id?: ArchiveId | null,
): Promise<ArchiveModel | undefined> {
  const model = await archiveDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找全宗设置是否存在
 */
export async function exist(
  search?: ArchiveSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await archiveDao.exist(search);
  return data;
}

/**
 * 根据 id 查找全宗设置是否存在
 */
export async function existById(
  id?: ArchiveId | null,
): Promise<boolean> {
  const data = await archiveDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验全宗设置
 */
export async function validate(
  input: ArchiveInput,
): Promise<void> {
  const data = await archiveDao.validate(input);
  return data;
}

/**
 * 批量创建全宗设置
 */
export async function creates(
  inputs: ArchiveInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<ArchiveId[]> {
  const ids = await archiveDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改全宗设置
 */
export async function updateById(
  id: ArchiveId,
  input: ArchiveInput,
): Promise<ArchiveId> {
  
  const id2 = await archiveDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除全宗设置
 */
export async function deleteByIds(
  ids: ArchiveId[],
): Promise<number> {
  
  const data = await archiveDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原全宗设置
 */
export async function revertByIds(
  ids: ArchiveId[],
): Promise<number> {
  const data = await archiveDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除全宗设置
 */
export async function forceDeleteByIds(
  ids: ArchiveId[],
): Promise<number> {
  const data = await archiveDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取全宗设置字段注释
 */
export async function getFieldComments(): Promise<ArchiveFieldComment> {
  const data = await archiveDao.getFieldComments();
  return data;
}

/**
 * 查找 全宗设置 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await archiveDao.findLastOrderBy();
  return data;
}
