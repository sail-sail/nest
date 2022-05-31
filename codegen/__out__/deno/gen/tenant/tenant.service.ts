import { Context } from "/lib/context.ts";
import { Page, Sort } from "/lib/page.model.ts";
import { renderExcel } from "ejsexcel";
import { AuthModel } from "/lib/auth/auth.constants.ts";
import * as authDao from "/lib/auth/auth.dao.ts";
import * as tmpfileDao from "/lib/tmpfile/tmpfile.dao.ts";

import { readFile } from "std/node/fs/promises.ts";

import { TenantModel, TenantSearch } from "./tenant.model.ts";
import * as tenantDao from "./tenant.dao.ts";

/**
 * 根据条件查找总数
 * @param {TenantSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  context: Context,
  search?: TenantSearch,
): Promise<number> {
  const result = await tenantDao.findCount(context, search);
  return result;
}

/**
 * 根据条件和分页查找数据
 * @param {TenantSearch} search? 搜索条件
 * @param {Page} page? 分页条件
 * @param {Sort|Sort[]} sort? 排序
 * @return {Promise<TenantModel[]>} 
 */
export async function findAll(
  context: Context,
  search?: TenantSearch,
  page?: Page,
  sort?: Sort|Sort[],
): Promise<TenantModel[]> {
  const result: TenantModel[] = await tenantDao.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 * @param {TenantSearch} search? 搜索条件
 * @return {Promise<TenantModel>} 
 */
export async function findOne(
  context: Context,
  search?: TenantSearch,
): Promise<TenantModel> {
  const result = await tenantDao.findOne(context, search);
  return result;
}

/**
 * 根据id查找数据
 * @param {string} id
 * @return {Promise<TenantModel>}
 */
export async function findById(
  context: Context,
  id?: string,
): Promise<TenantModel | undefined> {
  const result = await tenantDao.findById(context, id);
  return result;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {TenantSearch} search? 搜索条件
 * @return {Promise<boolean>}
 */
export async function exist(
  context: Context,
  search?: TenantSearch,
): Promise<boolean> {
  const result = await tenantDao.exist(context, search);
  return result;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 * @return {Promise<boolean>}
 */
export async function existById(
  context: Context,
  id: string,
): Promise<boolean> {
  const result = await tenantDao.existById(context, id);
  return result;
}

/**
 * 创建数据
 * @param {TenantModel} model
 * @return {Promise<string | undefined>} 
 */
export async function create(
  context: Context,
  model: TenantModel,
): Promise<string | undefined> {
  const result = await tenantDao.create(context, model);
  return result;
}

/**
 * 根据id修改数据
 * @param {string} id
 * @param {TenantModel} model
 * @return {Promise<string | undefined>}
 */
export async function updateById(
  context: Context,
  id: string,
  model: TenantModel,
): Promise<string | undefined> {
  await tenantDao.updateById(context, id, model);
  return id;
}

/**
 * 根据id列表删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  context: Context,
  ids: string[],
): Promise<number> {
  const result = await tenantDao.deleteByIds(context, ids);
  return result;
}

/**
 * 根据id列表还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  context: Context,
  ids: string[],
): Promise<number> {
  const result = await tenantDao.revertByIds(context, ids);
  return result;
}

/**
 * 导出Excel
 * @param {TenantSearch} search? 搜索条件
 * @param {Sort|Sort[]} sort? 排序
 * @return {Promise<string>} 临时文件id
 */
export async function exportExcel(
  context: Context,
  search?: TenantSearch,
  sort?: Sort|Sort[],
): Promise<string> {
  const models = await findAll(context, search, undefined, sort);
  const buffer0 = await readFile(`./tenant.xlsx`);
  const buffer = await renderExcel(buffer0, { models });
  const result = await tmpfileDao.upload(
    {
      content: buffer,
      name: "file",
      originalName: "租户.xlsx",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  return result;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  context: Context,
): Promise<number> {
  const result = await tenantDao.findLastOrderBy(context);
  return result;
}
