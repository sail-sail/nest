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
export async function findCountArchive(
  search?: ArchiveSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const archive_num = await archiveDao.findCountArchive(search);
  
  return archive_num;
}

/**
 * 根据搜索条件和分页查找全宗设置列表
 */
export async function findAllArchive(
  search?: ArchiveSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<ArchiveModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const archive_models = await archiveDao.findAllArchive(search, page, sort);
  
  return archive_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblArchive(
  input: ArchiveInput,
): Promise<void> {
  await archiveDao.setIdByLblArchive(input);
}

/**
 * 根据条件查找第一个全宗设置
 */
export async function findOneArchive(
  search?: ArchiveSearch,
  sort?: SortInput[],
): Promise<ArchiveModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const archive_model = await archiveDao.findOneArchive(search, sort);
  
  return archive_model;
}

/**
 * 根据条件查找第一个全宗设置, 如果不存在则抛错
 */
export async function findOneOkArchive(
  search?: ArchiveSearch,
  sort?: SortInput[],
): Promise<ArchiveModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const archive_model = await archiveDao.findOneOkArchive(search, sort);
  
  return archive_model;
}

/**
 * 根据 id 查找全宗设置
 */
export async function findByIdArchive(
  archive_id: ArchiveId,
): Promise<ArchiveModel | undefined> {
  
  const archive_model = await archiveDao.findByIdArchive(archive_id);
  
  return archive_model;
}

/**
 * 根据 id 查找全宗设置, 如果不存在则抛错
 */
export async function findByIdOkArchive(
  archive_id: ArchiveId,
): Promise<ArchiveModel> {
  
  const archive_model = await archiveDao.findByIdOkArchive(archive_id);
  
  return archive_model;
}

/**
 * 根据 ids 查找全宗设置
 */
export async function findByIdsArchive(
  archive_ids: ArchiveId[],
): Promise<ArchiveModel[]> {
  
  const archive_models = await archiveDao.findByIdsArchive(archive_ids);
  
  return archive_models;
}

/**
 * 根据 ids 查找全宗设置, 出现查询不到的 id 则报错
 */
export async function findByIdsOkArchive(
  archive_ids: ArchiveId[],
): Promise<ArchiveModel[]> {
  
  const archive_models = await archiveDao.findByIdsOkArchive(archive_ids);
  
  return archive_models;
}

/**
 * 根据搜索条件查找全宗设置是否存在
 */
export async function existArchive(
  search?: ArchiveSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const archive_exist = await archiveDao.existArchive(search);
  
  return archive_exist;
}

/**
 * 根据 id 查找全宗设置是否存在
 */
export async function existByIdArchive(
  archive_id?: ArchiveId | null,
): Promise<boolean> {
  
  const archive_exist = await archiveDao.existByIdArchive(archive_id);
  
  return archive_exist;
}

/**
 * 增加和修改时校验全宗设置
 */
export async function validateArchive(
  input: ArchiveInput,
): Promise<void> {
  await archiveDao.validateArchive(input);
}

/**
 * 批量创建全宗设置
 */
export async function createsArchive(
  inputs: ArchiveInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<ArchiveId[]> {
  const archive_ids = await archiveDao.createsArchive(inputs, options);
  
  return archive_ids;
}

/**
 * 根据 id 修改全宗设置
 */
export async function updateByIdArchive(
  archive_id: ArchiveId,
  input: ArchiveInput,
): Promise<ArchiveId> {
  
  const archive_id2 = await archiveDao.updateByIdArchive(archive_id, input);
  
  return archive_id2;
}

/** 校验全宗设置是否存在 */
export async function validateOptionArchive(
  model0?: ArchiveModel,
): Promise<ArchiveModel> {
  const archive_model = await archiveDao.validateOptionArchive(model0);
  return archive_model;
}

/**
 * 根据 ids 删除全宗设置
 */
export async function deleteByIdsArchive(
  archive_ids: ArchiveId[],
): Promise<number> {
  
  const archive_num = await archiveDao.deleteByIdsArchive(archive_ids);
  return archive_num;
}

/**
 * 根据 ids 还原全宗设置
 */
export async function revertByIdsArchive(
  archive_ids: ArchiveId[],
): Promise<number> {
  
  const archive_num = await archiveDao.revertByIdsArchive(archive_ids);
  
  return archive_num;
}

/**
 * 根据 ids 彻底删除全宗设置
 */
export async function forceDeleteByIdsArchive(
  archive_ids: ArchiveId[],
): Promise<number> {
  
  const archive_num = await archiveDao.forceDeleteByIdsArchive(archive_ids);
  
  return archive_num;
}

/**
 * 获取全宗设置字段注释
 */
export async function getFieldCommentsArchive(): Promise<ArchiveFieldComment> {
  const archive_fields = await archiveDao.getFieldCommentsArchive();
  return archive_fields;
}

/**
 * 查找 全宗设置 order_by 字段的最大值
 */
export async function findLastOrderByArchive(
): Promise<number> {
  const archive_sort = await archiveDao.findLastOrderByArchive();
  return archive_sort;
}
