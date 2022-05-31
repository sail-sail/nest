import { Context } from "/lib/context.ts";
import { Page, Sort } from "/lib/page.model.ts";

import * as usrService from "./usr.service.ts";
import { UsrModel, UsrSearch } from "./usr.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountUsr(
  context: Context,
  search?: UsrSearch,
) {
  const result = await usrService.findCount(context, search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllUsr(
  context: Context,
  search?: UsrSearch,
  page?: Page,
  sort?: Sort[],
) {
  const result = await usrService.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcelUsr(
  context: Context,
  search?: UsrSearch,
  sort?: Sort[],
) {
  const result = await usrService.exportExcel(context, search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneUsr(
  context: Context,
  search?: UsrSearch,
) {
  const result = await usrService.findOne(context, search);
  return result;
}

/**
 * 根据id查找一条数据
 */
export async function findByIdUsr(
  context: Context,
  id: string,
) {
  const result = await usrService.findById(context, id);
  return result;
}

/**
 * 创建一条数据
 */
export async function createUsr(
  context: Context,
  model: UsrModel,
) {
  const result = await usrService.create(context, model);
  return result;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdUsr(
  context: Context,
  id: string,
  model: UsrModel,
) {
  const result = await usrService.updateById(context, id, model);
  return result;
}

/**
 * 根据ids删除数据
 */
export async function deleteByIdsUsr(
  context: Context,
  ids: string[],
) {
  const result = await usrService.deleteByIds(context, ids);
  return result;
}

/**
 * 导入用户
 */
// export async function importFileUsr(
//   context: Context,
//   id: string,
// ) {
//   const result = await usrService.importFile(context, id);
//   return result;
// }

/**
 * 根据ids还原数据
 */
export async function revertByIdsUsr(
  context: Context,
  ids: string[],
) {
  const result = await usrService.revertByIds(context, ids);
  return result;
}
