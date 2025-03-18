import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as langDao from "./lang.dao.ts";

async function setSearchQuery(
  _search: LangSearch,
) {
  
}

/**
 * 根据条件查找语言总数
 */
export async function findCount(
  search?: LangSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const lang_num = await langDao.findCount(search);
  
  return lang_num;
}

/**
 * 根据搜索条件和分页查找语言列表
 */
export async function findAll(
  search?: LangSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<LangModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const lang_models = await langDao.findAll(search, page, sort);
  
  return lang_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: LangInput,
): Promise<void> {
  await langDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个语言
 */
export async function findOne(
  search?: LangSearch,
  sort?: SortInput[],
): Promise<LangModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const lang_model = await langDao.findOne(search, sort);
  
  return lang_model;
}

/**
 * 根据 id 查找语言
 */
export async function findById(
  lang_id?: LangId | null,
): Promise<LangModel | undefined> {
  
  const lang_model = await langDao.findById(lang_id);
  
  return lang_model;
}

/**
 * 根据 ids 查找语言
 */
export async function findByIds(
  lang_ids: LangId[],
): Promise<LangModel[]> {
  
  const lang_models = await langDao.findByIds(lang_ids);
  
  return lang_models;
}

/**
 * 根据搜索条件查找语言是否存在
 */
export async function exist(
  search?: LangSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const lang_exist = await langDao.exist(search);
  
  return lang_exist;
}

/**
 * 根据 id 查找语言是否存在
 */
export async function existById(
  lang_id?: LangId | null,
): Promise<boolean> {
  
  const lang_exist = await langDao.existById(lang_id);
  
  return lang_exist;
}

/**
 * 增加和修改时校验语言
 */
export async function validate(
  input: LangInput,
): Promise<void> {
  await langDao.validate(input);
}

/**
 * 批量创建语言
 */
export async function creates(
  inputs: LangInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<LangId[]> {
  const lang_ids = await langDao.creates(inputs, options);
  
  return lang_ids;
}

/**
 * 根据 id 修改语言
 */
export async function updateById(
  lang_id: LangId,
  input: LangInput,
): Promise<LangId> {
  
  const lang_id2 = await langDao.updateById(lang_id, input);
  
  return lang_id2;
}

/** 校验语言是否存在 */
export async function validateOption(
  model0?: LangModel,
): Promise<LangModel> {
  const lang_model = await langDao.validateOption(model0);
  return lang_model;
}

/**
 * 根据 ids 删除语言
 */
export async function deleteByIds(
  lang_ids: LangId[],
): Promise<number> {
  
  const old_models = await langDao.findByIds(lang_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const lang_num = await langDao.deleteByIds(lang_ids);
  return lang_num;
}

/**
 * 根据 ids 启用或者禁用语言
 */
export async function enableByIds(
  ids: LangId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const lang_num = await langDao.enableByIds(ids, is_enabled);
  return lang_num;
}

/**
 * 根据 ids 还原语言
 */
export async function revertByIds(
  lang_ids: LangId[],
): Promise<number> {
  
  const lang_num = await langDao.revertByIds(lang_ids);
  
  return lang_num;
}

/**
 * 根据 ids 彻底删除语言
 */
export async function forceDeleteByIds(
  lang_ids: LangId[],
): Promise<number> {
  
  const lang_num = await langDao.forceDeleteByIds(lang_ids);
  
  return lang_num;
}

/**
 * 获取语言字段注释
 */
export async function getFieldComments(): Promise<LangFieldComment> {
  const lang_fields = await langDao.getFieldComments();
  return lang_fields;
}

/**
 * 查找 语言 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const lang_sort = await langDao.findLastOrderBy();
  return lang_sort;
}
