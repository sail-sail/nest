import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as field_permitDao from "./field_permit.dao.ts";

/**
 * 根据条件查找字段权限总数
 * @param {FieldPermitSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: FieldPermitSearch,
): Promise<number> {
  search = search || { };
  const data = await field_permitDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找字段权限列表
 * @param {FieldPermitSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<FieldPermitModel[]>} 
 */
export async function findAll(
  search?: FieldPermitSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<FieldPermitModel[]> {
  search = search || { };
  const models: FieldPermitModel[] = await field_permitDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: FieldPermitInput,
) {
  const data = await field_permitDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个字段权限
 * @param {FieldPermitSearch} search? 搜索条件
 */
export async function findOne(
  search?: FieldPermitSearch,
  sort?: SortInput|SortInput[],
): Promise<FieldPermitModel | undefined> {
  search = search || { };
  const model = await field_permitDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找字段权限
 * @param {FieldPermitId} id
 */
export async function findById(
  id?: FieldPermitId | null,
): Promise<FieldPermitModel | undefined> {
  const model = await field_permitDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找字段权限是否存在
 * @param {FieldPermitSearch} search? 搜索条件
 */
export async function exist(
  search?: FieldPermitSearch,
): Promise<boolean> {
  search = search || { };
  const data = await field_permitDao.exist(search);
  return data;
}

/**
 * 根据 id 查找字段权限是否存在
 * @param {FieldPermitId} id
 */
export async function existById(
  id?: FieldPermitId | null,
): Promise<boolean> {
  const data = await field_permitDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验字段权限
 * @param input 
 */
export async function validate(
  input: FieldPermitInput,
): Promise<void> {
  const data = await field_permitDao.validate(input);
  return data;
}

/**
 * 批量创建字段权限
 * @param {FieldPermitInput[]} inputs
 * @return {Promise<FieldPermitId[]>} ids
 */
export async function creates(
  inputs: FieldPermitInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<FieldPermitId[]> {
  const ids = await field_permitDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改字段权限
 * @param {FieldPermitId} id
 * @param {FieldPermitInput} input
 * @return {Promise<FieldPermitId>}
 */
export async function updateById(
  id: FieldPermitId,
  input: FieldPermitInput,
): Promise<FieldPermitId> {
  
  // 不能修改系统记录的系统字段
  const model = await field_permitDao.findById(id);
  if (model && model.is_sys === 1) {
    // 菜单
    input.menu_id = undefined;
    input.menu_id_lbl = "";
    // 编码
    input.code = undefined;
  }
  
  const id2: FieldPermitId = await field_permitDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除字段权限
 * @param {FieldPermitId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: FieldPermitId[],
): Promise<number> {
  
  {
    const ids2: FieldPermitId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: FieldPermitId = ids[i];
      const model = await field_permitDao.findById(id);
      if (model && model.is_sys === 1) {
        continue;
      }
      ids2.push(id);
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除系统记录");
    }
    ids = ids2;
  }
  
  const data = await field_permitDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原字段权限
 * @param {FieldPermitId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: FieldPermitId[],
): Promise<number> {
  const data = await field_permitDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除字段权限
 * @param {FieldPermitId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: FieldPermitId[],
): Promise<number> {
  const data = await field_permitDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段权限字段注释
 */
export async function getFieldComments(): Promise<FieldPermitFieldComment> {
  const data = await field_permitDao.getFieldComments();
  return data;
}
