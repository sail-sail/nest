import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

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
  
  const data = await langDao.findCount(search);
  return data;
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
  
  const models: LangModel[] = await langDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: LangInput,
) {
  const data = await langDao.setIdByLbl(input);
  return data;
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
  
  const model = await langDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找语言
 */
export async function findById(
  id?: LangId | null,
): Promise<LangModel | undefined> {
  const model = await langDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找语言是否存在
 */
export async function exist(
  search?: LangSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await langDao.exist(search);
  return data;
}

/**
 * 根据 id 查找语言是否存在
 */
export async function existById(
  id?: LangId | null,
): Promise<boolean> {
  const data = await langDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验语言
 */
export async function validate(
  input: LangInput,
): Promise<void> {
  const data = await langDao.validate(input);
  return data;
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
  const ids = await langDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改语言
 */
export async function updateById(
  id: LangId,
  input: LangInput,
): Promise<LangId> {
  
  const id2 = await langDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除语言
 */
export async function deleteByIds(
  ids: LangId[],
): Promise<number> {
  
  {
    const models = await langDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw await ns("不能删除系统记录");
      }
    }
  }
  
  const data = await langDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用语言
 */
export async function enableByIds(
  ids: LangId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await langDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 还原语言
 */
export async function revertByIds(
  ids: LangId[],
): Promise<number> {
  const data = await langDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除语言
 */
export async function forceDeleteByIds(
  ids: LangId[],
): Promise<number> {
  const data = await langDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取语言字段注释
 */
export async function getFieldComments(): Promise<LangFieldComment> {
  const data = await langDao.getFieldComments();
  return data;
}

/**
 * 查找 语言 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await langDao.findLastOrderBy();
  return data;
}
