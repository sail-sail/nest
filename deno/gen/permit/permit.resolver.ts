import { Context } from "/lib/context.ts";
import { Page, Sort } from "/lib/page.model.ts";

import * as permitService from "./permit.service.ts";
import { PermitModel, PermitSearch } from "./permit.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountPermit(
  context: Context,
  search?: PermitSearch,
) {
  const result = await permitService.findCount(context, search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllPermit(
  context: Context,
  search?: PermitSearch,
  page?: Page,
  sort?: Sort[],
) {
  const result = await permitService.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelPermit(
  context: Context,
  search?: PermitSearch,
  sort?: Sort[],
) {
  const result = await permitService.exportExcel(context, search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOnePermit(
  context: Context,
  search?: PermitSearch,
) {
  const result = await permitService.findOne(context, search);
  return result;
}

/**
 * 根据id查找一条数据
 */
export async function findByIdPermit(
  context: Context,
  id: string,
) {
  const result = await permitService.findById(context, id);
  return result;
}

/**
 * 创建一条数据
 */
export async function createPermit(
  context: Context,
  model: PermitModel,
) {
  context.is_tran = true;
  const result = await permitService.create(context, model);
  return result;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdPermit(
  context: Context,
  id: string,
  model: PermitModel,
) {
  context.is_tran = true;
  const result = await permitService.updateById(context, id, model);
  return result;
}

/**
 * 根据ids删除数据
 */
export async function deleteByIdsPermit(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await permitService.deleteByIds(context, ids);
  return result;
}

/**
 * 导入权限
 */
// export async function importFilePermit(
//   context: Context,
//   id: string,
// ) {
//   const result = await permitService.importFile(context, id);
//   return result;
// }

/**
 * 根据ids还原数据
 */
export async function revertByIdsPermit(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await permitService.revertByIds(context, ids);
  return result;
}
