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
  
  const archive_num = await archiveDao.findCount(search);
  
  return archive_num;
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
  
  const archive_models = await archiveDao.findAll(search, page, sort);
  
  return archive_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: ArchiveInput,
): Promise<void> {
  await archiveDao.setIdByLbl(input);
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
  
  const archive_model = await archiveDao.findOne(search, sort);
  
  return archive_model;
}

/**
 * 根据 id 查找全宗设置
 */
export async function findById(
  archive_id?: ArchiveId | null,
): Promise<ArchiveModel | undefined> {
  
  const archive_model = await archiveDao.findById(archive_id);
  
  return archive_model;
}

/**
 * 根据 ids 查找全宗设置
 */
export async function findByIds(
  archive_ids: ArchiveId[],
): Promise<ArchiveModel[]> {
  
  const archive_models = await archiveDao.findByIds(archive_ids);
  
  return archive_models;
}

/**
 * 根据搜索条件查找全宗设置是否存在
 */
export async function exist(
  search?: ArchiveSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const archive_exist = await archiveDao.exist(search);
  
  return archive_exist;
}

/**
 * 根据 id 查找全宗设置是否存在
 */
export async function existById(
  archive_id?: ArchiveId | null,
): Promise<boolean> {
  
  const archive_exist = await archiveDao.existById(archive_id);
  
  return archive_exist;
}

/**
 * 增加和修改时校验全宗设置
 */
export async function validate(
  input: ArchiveInput,
): Promise<void> {
  await archiveDao.validate(input);
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
  const archive_ids = await archiveDao.creates(inputs, options);
  
  return archive_ids;
}

/**
 * 根据 id 修改全宗设置
 */
export async function updateById(
  archive_id: ArchiveId,
  input: ArchiveInput,
): Promise<ArchiveId> {
  
  const archive_id2 = await archiveDao.updateById(archive_id, input);
  
  return archive_id2;
}

/** 校验全宗设置是否存在 */
export async function validateOption(
  model0?: ArchiveModel,
): Promise<ArchiveModel> {
  const archive_model = await archiveDao.validateOption(model0);
  return archive_model;
}

/**
 * 根据 ids 删除全宗设置
 */
export async function deleteByIds(
  archive_ids: ArchiveId[],
): Promise<number> {
  
  const archive_num = await archiveDao.deleteByIds(archive_ids);
  return archive_num;
}

/**
 * 根据 ids 还原全宗设置
 */
export async function revertByIds(
  archive_ids: ArchiveId[],
): Promise<number> {
  
  const archive_num = await archiveDao.revertByIds(archive_ids);
  
  return archive_num;
}

/**
 * 根据 ids 彻底删除全宗设置
 */
export async function forceDeleteByIds(
  archive_ids: ArchiveId[],
): Promise<number> {
  
  const archive_num = await archiveDao.forceDeleteByIds(archive_ids);
  
  return archive_num;
}

/**
 * 获取全宗设置字段注释
 */
export async function getFieldComments(): Promise<ArchiveFieldComment> {
  const archive_fields = await archiveDao.getFieldComments();
  return archive_fields;
}

/**
 * 查找 全宗设置 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const archive_sort = await archiveDao.findLastOrderBy();
  return archive_sort;
}
