import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as dictbizDao from "./dictbiz.dao.ts";

async function setSearchQuery(
  _search: DictbizSearch,
) {
  
}

/**
 * 根据条件查找业务字典总数
 */
export async function findCountDictbiz(
  search?: DictbizSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_num = await dictbizDao.findCountDictbiz(search);
  
  return dictbiz_num;
}

/**
 * 根据搜索条件和分页查找业务字典列表
 */
export async function findAllDictbiz(
  search?: DictbizSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DictbizModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_models = await dictbizDao.findAllDictbiz(search, page, sort);
  
  return dictbiz_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblDictbiz(
  input: DictbizInput,
): Promise<void> {
  await dictbizDao.setIdByLblDictbiz(input);
}

/**
 * 根据条件查找第一个业务字典
 */
export async function findOneDictbiz(
  search?: DictbizSearch,
  sort?: SortInput[],
): Promise<DictbizModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_model = await dictbizDao.findOneDictbiz(search, sort);
  
  return dictbiz_model;
}

/**
 * 根据条件查找第一个业务字典, 如果不存在则抛错
 */
export async function findOneOkDictbiz(
  search?: DictbizSearch,
  sort?: SortInput[],
): Promise<DictbizModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_model = await dictbizDao.findOneOkDictbiz(search, sort);
  
  return dictbiz_model;
}

/**
 * 根据 id 查找业务字典
 */
export async function findByIdDictbiz(
  dictbiz_id: DictbizId,
): Promise<DictbizModel | undefined> {
  
  const dictbiz_model = await dictbizDao.findByIdDictbiz(dictbiz_id);
  
  return dictbiz_model;
}

/**
 * 根据 id 查找业务字典, 如果不存在则抛错
 */
export async function findByIdOkDictbiz(
  dictbiz_id: DictbizId,
): Promise<DictbizModel> {
  
  const dictbiz_model = await dictbizDao.findByIdOkDictbiz(dictbiz_id);
  
  return dictbiz_model;
}

/**
 * 根据 ids 查找业务字典
 */
export async function findByIdsDictbiz(
  dictbiz_ids: DictbizId[],
): Promise<DictbizModel[]> {
  
  const dictbiz_models = await dictbizDao.findByIdsDictbiz(dictbiz_ids);
  
  return dictbiz_models;
}

/**
 * 根据 ids 查找业务字典, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDictbiz(
  dictbiz_ids: DictbizId[],
): Promise<DictbizModel[]> {
  
  const dictbiz_models = await dictbizDao.findByIdsOkDictbiz(dictbiz_ids);
  
  return dictbiz_models;
}

/**
 * 根据搜索条件查找业务字典是否存在
 */
export async function existDictbiz(
  search?: DictbizSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const dictbiz_exist = await dictbizDao.existDictbiz(search);
  
  return dictbiz_exist;
}

/**
 * 根据 id 查找业务字典是否存在
 */
export async function existByIdDictbiz(
  dictbiz_id?: DictbizId | null,
): Promise<boolean> {
  
  const dictbiz_exist = await dictbizDao.existByIdDictbiz(dictbiz_id);
  
  return dictbiz_exist;
}

/**
 * 增加和修改时校验业务字典
 */
export async function validateDictbiz(
  input: DictbizInput,
): Promise<void> {
  await dictbizDao.validateDictbiz(input);
}

/**
 * 批量创建业务字典
 */
export async function createsDictbiz(
  inputs: DictbizInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DictbizId[]> {
  const dictbiz_ids = await dictbizDao.createsDictbiz(inputs, options);
  
  return dictbiz_ids;
}

/**
 * 根据 id 修改业务字典
 */
export async function updateByIdDictbiz(
  dictbiz_id: DictbizId,
  input: DictbizInput,
): Promise<DictbizId> {
  
  const dictbiz_id2 = await dictbizDao.updateByIdDictbiz(dictbiz_id, input);
  
  return dictbiz_id2;
}

/** 校验业务字典是否存在 */
export async function validateOptionDictbiz(
  model0?: DictbizModel,
): Promise<DictbizModel> {
  const dictbiz_model = await dictbizDao.validateOptionDictbiz(model0);
  return dictbiz_model;
}

/**
 * 根据 ids 删除业务字典
 */
export async function deleteByIdsDictbiz(
  dictbiz_ids: DictbizId[],
): Promise<number> {
  
  const old_models = await dictbizDao.findByIdsDictbiz(dictbiz_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const dictbiz_num = await dictbizDao.deleteByIdsDictbiz(dictbiz_ids);
  return dictbiz_num;
}

/**
 * 根据 ids 启用或者禁用业务字典
 */
export async function enableByIdsDictbiz(
  ids: DictbizId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const dictbiz_num = await dictbizDao.enableByIdsDictbiz(ids, is_enabled);
  return dictbiz_num;
}

/**
 * 根据 ids 还原业务字典
 */
export async function revertByIdsDictbiz(
  dictbiz_ids: DictbizId[],
): Promise<number> {
  
  const dictbiz_num = await dictbizDao.revertByIdsDictbiz(dictbiz_ids);
  
  return dictbiz_num;
}

/**
 * 根据 ids 彻底删除业务字典
 */
export async function forceDeleteByIdsDictbiz(
  dictbiz_ids: DictbizId[],
): Promise<number> {
  
  const dictbiz_num = await dictbizDao.forceDeleteByIdsDictbiz(dictbiz_ids);
  
  return dictbiz_num;
}

/**
 * 获取业务字典字段注释
 */
export async function getFieldCommentsDictbiz(): Promise<DictbizFieldComment> {
  const dictbiz_fields = await dictbizDao.getFieldCommentsDictbiz();
  return dictbiz_fields;
}

/**
 * 查找 业务字典 order_by 字段的最大值
 */
export async function findLastOrderByDictbiz(
  search?: DictbizSearch,
): Promise<number> {
  
  const order_by = await dictbizDao.findLastOrderByDictbiz(search);
  
  return order_by;
}
