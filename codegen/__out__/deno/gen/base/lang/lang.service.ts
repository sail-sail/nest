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
export async function findCountLang(
  search?: LangSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const lang_num = await langDao.findCountLang(search);
  
  return lang_num;
}

/**
 * 根据搜索条件和分页查找语言列表
 */
export async function findAllLang(
  search?: LangSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<LangModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const lang_models = await langDao.findAllLang(search, page, sort);
  
  return lang_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblLang(
  input: LangInput,
): Promise<void> {
  await langDao.setIdByLblLang(input);
}

/**
 * 根据条件查找第一个语言
 */
export async function findOneLang(
  search?: LangSearch,
  sort?: SortInput[],
): Promise<LangModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const lang_model = await langDao.findOneLang(search, sort);
  
  return lang_model;
}

/**
 * 根据 id 查找语言
 */
export async function findByIdLang(
  lang_id?: LangId | null,
): Promise<LangModel | undefined> {
  
  const lang_model = await langDao.findByIdLang(lang_id);
  
  return lang_model;
}

/**
 * 根据 ids 查找语言
 */
export async function findByIdsLang(
  lang_ids: LangId[],
): Promise<LangModel[]> {
  
  const lang_models = await langDao.findByIdsLang(lang_ids);
  
  return lang_models;
}

/**
 * 根据搜索条件查找语言是否存在
 */
export async function existLang(
  search?: LangSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const lang_exist = await langDao.existLang(search);
  
  return lang_exist;
}

/**
 * 根据 id 查找语言是否存在
 */
export async function existByIdLang(
  lang_id?: LangId | null,
): Promise<boolean> {
  
  const lang_exist = await langDao.existByIdLang(lang_id);
  
  return lang_exist;
}

/**
 * 增加和修改时校验语言
 */
export async function validateLang(
  input: LangInput,
): Promise<void> {
  await langDao.validateLang(input);
}

/**
 * 批量创建语言
 */
export async function createsLang(
  inputs: LangInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<LangId[]> {
  const lang_ids = await langDao.createsLang(inputs, options);
  
  return lang_ids;
}

/**
 * 根据 id 修改语言
 */
export async function updateByIdLang(
  lang_id: LangId,
  input: LangInput,
): Promise<LangId> {
  
  const lang_id2 = await langDao.updateByIdLang(lang_id, input);
  
  return lang_id2;
}

/** 校验语言是否存在 */
export async function validateOptionLang(
  model0?: LangModel,
): Promise<LangModel> {
  const lang_model = await langDao.validateOptionLang(model0);
  return lang_model;
}

/**
 * 根据 ids 删除语言
 */
export async function deleteByIdsLang(
  lang_ids: LangId[],
): Promise<number> {
  
  const old_models = await langDao.findByIdsLang(lang_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const lang_num = await langDao.deleteByIdsLang(lang_ids);
  return lang_num;
}

/**
 * 根据 ids 启用或者禁用语言
 */
export async function enableByIdsLang(
  ids: LangId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const lang_num = await langDao.enableByIdsLang(ids, is_enabled);
  return lang_num;
}

/**
 * 根据 ids 还原语言
 */
export async function revertByIdsLang(
  lang_ids: LangId[],
): Promise<number> {
  
  const lang_num = await langDao.revertByIdsLang(lang_ids);
  
  return lang_num;
}

/**
 * 根据 ids 彻底删除语言
 */
export async function forceDeleteByIdsLang(
  lang_ids: LangId[],
): Promise<number> {
  
  const lang_num = await langDao.forceDeleteByIdsLang(lang_ids);
  
  return lang_num;
}

/**
 * 获取语言字段注释
 */
export async function getFieldCommentsLang(): Promise<LangFieldComment> {
  const lang_fields = await langDao.getFieldCommentsLang();
  return lang_fields;
}

/**
 * 查找 语言 order_by 字段的最大值
 */
export async function findLastOrderByLang(
): Promise<number> {
  const lang_sort = await langDao.findLastOrderByLang();
  return lang_sort;
}
