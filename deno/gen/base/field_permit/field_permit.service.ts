import {
  ns,
} from "/src/base/i18n/i18n.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  FieldPermitInput,
  FieldPermitModel,
  FieldPermitSearch,
  FieldPermitFieldComment,
  FieldPermitId,
} from "./field_permit.model.ts";

import * as field_permitDao from "./field_permit.dao.ts";

/**
 * 根据条件查找总数
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
 * 根据条件和分页查找数据
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
 * 根据条件查找第一条数据
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
 * 根据id查找数据
 * @param {FieldPermitId} id
 */
export async function findById(
  id?: FieldPermitId | null,
): Promise<FieldPermitModel | undefined> {
  const model = await field_permitDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
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
 * 根据id查找数据是否存在
 * @param {FieldPermitId} id
 */
export async function existById(
  id?: FieldPermitId | null,
): Promise<boolean> {
  const data = await field_permitDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: FieldPermitInput,
): Promise<void> {
  const data = await field_permitDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {FieldPermitInput} input
 * @return {Promise<FieldPermitId>} id
 */
export async function create(
  input: FieldPermitInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<FieldPermitId> {
  const id: FieldPermitId = await field_permitDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改数据
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
 * 根据 ids 删除数据
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
 * 根据 ids 还原数据
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
 * 根据 ids 彻底删除数据
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
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<FieldPermitFieldComment> {
  const data = await field_permitDao.getFieldComments();
  return data;
}
