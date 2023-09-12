import {
  ns,
} from "/src/base/i18n/i18n.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  DataPermitInput,
  DataPermitModel,
  DataPermitSearch,
  DataPermitFieldComment,
} from "./data_permit.model.ts";

import * as data_permitDao from "./data_permit.dao.ts";

/**
 * 根据条件查找总数
 * @param {DataPermitSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: DataPermitSearch,
): Promise<number> {
  search = search || { };
  const data = await data_permitDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {DataPermitSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<DataPermitModel[]>} 
 */
export async function findAll(
  search?: DataPermitSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<DataPermitModel[]> {
  search = search || { };
  const data: DataPermitModel[] = await data_permitDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {DataPermitSearch} search? 搜索条件
 */
export async function findOne(
  search?: DataPermitSearch,
  sort?: SortInput|SortInput[],
): Promise<DataPermitModel | undefined> {
  search = search || { };
  const data = await data_permitDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
): Promise<DataPermitModel | undefined> {
  const data = await data_permitDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {DataPermitSearch} search? 搜索条件
 */
export async function exist(
  search?: DataPermitSearch,
): Promise<boolean> {
  search = search || { };
  const data = await data_permitDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
): Promise<boolean> {
  const data = await data_permitDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: DataPermitInput,
): Promise<void> {
  const data = await data_permitDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {DataPermitInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: DataPermitInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const data = await data_permitDao.create(input, options);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {DataPermitInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: DataPermitInput,
): Promise<string> {
  
  // 不能修改系统记录的系统字段
  const model = await data_permitDao.findById(id);
  if (model && model.is_sys === 1) {
    // 菜单
    input.menu_id = undefined;
    input.menu_id_lbl = "";
    // 范围
    input.scope = undefined;
    input.scope_lbl = "";
  }
  
  const data = await data_permitDao.updateById(id, input);
  return data;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
): Promise<number> {
  
  {
    const ids2: string[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const model = await data_permitDao.findById(id);
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
  
  const data = await data_permitDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
): Promise<number> {
  const data = await data_permitDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: string[],
): Promise<number> {
  const data = await data_permitDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<DataPermitFieldComment> {
  const data = await data_permitDao.getFieldComments();
  return data;
}
