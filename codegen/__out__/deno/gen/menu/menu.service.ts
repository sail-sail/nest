import { Context } from "/lib/context.ts";
import { Page, Sort } from "/lib/page.model.ts";
import { renderExcel } from "ejsexcel";
import { AuthModel } from "/lib/auth/auth.constants.ts";
import * as authDao from "/lib/auth/auth.dao.ts";
import * as tmpfileDao from "/lib/tmpfile/tmpfile.dao.ts";

import { readFile } from "std/node/fs/promises.ts";

import { MenuModel, MenuSearch } from "./menu.model.ts";
import * as menuDao from "./menu.dao.ts";

/**
 * 根据条件查找总数
 * @param {MenuSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  context: Context,
  search?: MenuSearch,
): Promise<number> {
  const result = await menuDao.findCount(context, search);
  return result;
}

/**
 * 根据条件和分页查找数据
 * @param {MenuSearch} search? 搜索条件
 * @param {Page} page? 分页条件
 * @param {Sort|Sort[]} sort? 排序
 * @return {Promise<MenuModel[]>} 
 */
export async function findAll(
  context: Context,
  search?: MenuSearch,
  page?: Page,
  sort?: Sort|Sort[],
): Promise<MenuModel[]> {
  const result: MenuModel[] = await menuDao.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 * @param {MenuSearch} search? 搜索条件
 * @return {Promise<MenuModel>} 
 */
export async function findOne(
  context: Context,
  search?: MenuSearch,
): Promise<MenuModel> {
  const result = await menuDao.findOne(context, search);
  return result;
}

/**
 * 根据id查找数据
 * @param {string} id
 * @return {Promise<MenuModel>}
 */
export async function findById(
  context: Context,
  id?: string,
): Promise<MenuModel | undefined> {
  const result = await menuDao.findById(context, id);
  return result;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {MenuSearch} search? 搜索条件
 * @return {Promise<boolean>}
 */
export async function exist(
  context: Context,
  search?: MenuSearch,
): Promise<boolean> {
  const result = await menuDao.exist(context, search);
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
  const result = await menuDao.existById(context, id);
  return result;
}

/**
 * 创建数据
 * @param {MenuModel} model
 * @return {Promise<string | undefined>} 
 */
export async function create(
  context: Context,
  model: MenuModel,
): Promise<string | undefined> {
  const result = await menuDao.create(context, model);
  return result;
}

/**
 * 根据id修改数据
 * @param {string} id
 * @param {MenuModel} model
 * @return {Promise<string | undefined>}
 */
export async function updateById(
  context: Context,
  id: string,
  model: MenuModel,
): Promise<string | undefined> {
  await menuDao.updateById(context, id, model);
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
  const result = await menuDao.deleteByIds(context, ids);
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
  const result = await menuDao.revertByIds(context, ids);
  return result;
}

/**
 * 导出Excel
 * @param {MenuSearch} search? 搜索条件
 * @param {Sort|Sort[]} sort? 排序
 * @return {Promise<string>} 临时文件id
 */
export async function exportExcel(
  context: Context,
  search?: MenuSearch,
  sort?: Sort|Sort[],
): Promise<string> {
  const models = await findAll(context, search, undefined, sort);
  const buffer0 = await readFile(`./menu.xlsx`);
  const buffer = await renderExcel(buffer0, { models });
  const result = await tmpfileDao.upload(
    {
      content: buffer,
      name: "file",
      originalName: "菜单.xlsx",
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
  const result = await menuDao.findLastOrderBy(context);
  return result;
}
