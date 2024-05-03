import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as permitDao from "./permit.dao.ts";

/**
 * 根据条件查找按钮权限总数
 * @param {PermitSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: PermitSearch,
): Promise<number> {
  search = search || { };
  const data = await permitDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找按钮权限列表
 * @param {PermitSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<PermitModel[]>} 
 */
export async function findAll(
  search?: PermitSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<PermitModel[]> {
  search = search || { };
  const models: PermitModel[] = await permitDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: PermitInput,
) {
  const data = await permitDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个按钮权限
 * @param {PermitSearch} search? 搜索条件
 */
export async function findOne(
  search?: PermitSearch,
  sort?: SortInput|SortInput[],
): Promise<PermitModel | undefined> {
  search = search || { };
  const model = await permitDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找按钮权限
 * @param {PermitId} id
 */
export async function findById(
  id?: PermitId | null,
): Promise<PermitModel | undefined> {
  const model = await permitDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找按钮权限是否存在
 * @param {PermitSearch} search? 搜索条件
 */
export async function exist(
  search?: PermitSearch,
): Promise<boolean> {
  search = search || { };
  const data = await permitDao.exist(search);
  return data;
}

/**
 * 根据 id 查找按钮权限是否存在
 * @param {PermitId} id
 */
export async function existById(
  id?: PermitId | null,
): Promise<boolean> {
  const data = await permitDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验按钮权限
 * @param input 
 */
export async function validate(
  input: PermitInput,
): Promise<void> {
  const data = await permitDao.validate(input);
  return data;
}

/**
 * 创建按钮权限
 * @param {PermitInput} input
 * @return {Promise<PermitId>} id
 */
export async function create(
  input: PermitInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<PermitId> {
  const id = await permitDao.create(input, options);
  return id;
}

/**
 * 批量创建按钮权限
 * @param {PermitInput[]} inputs
 * @return {Promise<PermitId[]>} ids
 */
export async function creates(
  inputs: PermitInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<PermitId[]> {
  const ids = await permitDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改按钮权限
 * @param {PermitId} id
 * @param {PermitInput} input
 * @return {Promise<PermitId>}
 */
export async function updateById(
  id: PermitId,
  input: PermitInput,
): Promise<PermitId> {
  
  // 不能修改系统记录的系统字段
  const model = await permitDao.findById(id);
  if (model && model.is_sys === 1) {
    // 菜单
    input.menu_id = undefined;
    input.menu_id_lbl = "";
    // 编码
    input.code = undefined;
  }
  
  const id2: PermitId = await permitDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除按钮权限
 * @param {PermitId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: PermitId[],
): Promise<number> {
  
  {
    const ids2: PermitId[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: PermitId = ids[i];
      const model = await permitDao.findById(id);
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
  
  const data = await permitDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原按钮权限
 * @param {PermitId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: PermitId[],
): Promise<number> {
  const data = await permitDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除按钮权限
 * @param {PermitId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: PermitId[],
): Promise<number> {
  const data = await permitDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取按钮权限字段注释
 */
export async function getFieldComments(): Promise<PermitFieldComment> {
  const data = await permitDao.getFieldComments();
  return data;
}
