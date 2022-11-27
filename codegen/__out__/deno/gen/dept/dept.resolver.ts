import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as deptService
} from "./dept.service.ts";

import {
  type DeptModel,
  type DeptSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

export const _internals = {
  findCountDept,
  findAllDept,
  exportExcelDept,
  findOneDept,
  findByIdDept,
  createDept,
  updateByIdDept,
  deleteByIdsDept,lockByIdsDept,
  importFileDept,
  revertByIdsDept,
  forceDeleteByIdsDept,
  findLastOrderByDept,
};

/**
 * 根据条件查找据数总数
 */
async function findCountDept(
  search?: DeptSearch & { $extra?: SearchExtra[] },
) {
  const result = await deptService.findCount(search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllDept(
  search?: DeptSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await deptService.findAll(search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelDept(
  search?: DeptSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await deptService.exportExcel(search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneDept(
  search?: DeptSearch & { $extra?: SearchExtra[] },
) {
  const result = await deptService.findOne(search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdDept(
  id: string,
) {
  const result = await deptService.findById(id);
  return result;
}

/**
 * 创建一条数据
 */
async function createDept(
  model: DeptModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await deptService.create(model);
  return result;
}

/**
 * 根据id修改一条数据
 */
async function updateByIdDept(
  id: string,
  model: DeptModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await deptService.updateById(id, model);
  return result;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsDept(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await deptService.deleteByIds(ids);
  return result;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
async function lockByIdsDept(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDept.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const result = await deptService.lockByIds(ids, is_locked);
  return result;
}

/**
 * 导入部门
 */
async function importFileDept(
  id: string,
) {
  const result = await deptService.importFile(id);
  return result;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsDept(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await deptService.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsDept(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await deptService.forceDeleteByIds(ids);
  return result;
}

/**
 * 查找 order_by 字段的最大值
 */
async function findLastOrderByDept() {
  const result = await deptService.findLastOrderBy();
  return result;
}
