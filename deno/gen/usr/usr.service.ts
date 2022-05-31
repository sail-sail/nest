import { Context } from "/lib/context.ts";
import { Page, Sort } from "/lib/page.model.ts";
import { renderExcel } from "ejsexcel";
import { AuthModel } from "/lib/auth/auth.constants.ts";
import * as authDao from "/lib/auth/auth.dao.ts";
import * as tmpfileDao from "/lib/tmpfile/tmpfile.dao.ts";

import { readFile } from "std/node/fs/promises.ts";

import { UsrModel, UsrSearch } from "./usr.model.ts";
import * as usrDao from "./usr.dao.ts";

/**
 * 根据条件查找总数
 * @param {UsrSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  context: Context,
  search?: UsrSearch,
): Promise<number> {
  const result = await usrDao.findCount(context, search);
  return result;
}

/**
 * 根据条件和分页查找数据
 * @param {UsrSearch} search? 搜索条件
 * @param {Page} page? 分页条件
 * @param {Sort|Sort[]} sort? 排序
 * @return {Promise<UsrModel[]>} 
 */
export async function findAll(
  context: Context,
  search?: UsrSearch,
  page?: Page,
  sort?: Sort|Sort[],
): Promise<UsrModel[]> {
  const result: UsrModel[] = await usrDao.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 * @param {UsrSearch} search? 搜索条件
 * @return {Promise<UsrModel>} 
 */
export async function findOne(
  context: Context,
  search?: UsrSearch,
): Promise<UsrModel> {
  const result = await usrDao.findOne(context, search);
  return result;
}

/**
 * 根据id查找数据
 * @param {string} id
 * @return {Promise<UsrModel>}
 */
export async function findById(
  context: Context,
  id?: string,
): Promise<UsrModel | undefined> {
  const result = await usrDao.findById(context, id);
  return result;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {UsrSearch} search? 搜索条件
 * @return {Promise<boolean>}
 */
export async function exist(
  context: Context,
  search?: UsrSearch,
): Promise<boolean> {
  const result = await usrDao.exist(context, search);
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
  const result = await usrDao.existById(context, id);
  return result;
}

/**
 * 创建数据
 * @param {UsrModel} model
 * @return {Promise<string | undefined>} 
 */
export async function create(
  context: Context,
  model: UsrModel,
): Promise<string | undefined> {
  const result = await usrDao.create(context, model);
  return result;
}

/**
 * 根据id修改数据
 * @param {string} id
 * @param {UsrModel} model
 * @return {Promise<string | undefined>}
 */
export async function updateById(
  context: Context,
  id: string,
  model: UsrModel,
): Promise<string | undefined> {
  await usrDao.updateById(context, id, model);
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
  const result = await usrDao.deleteByIds(context, ids);
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
  const result = await usrDao.revertByIds(context, ids);
  return result;
}

/**
 * 导出Excel
 * @param {UsrSearch} search? 搜索条件
 * @param {Sort|Sort[]} sort? 排序
 * @return {Promise<string>} 临时文件id
 */
export async function exportExcel(
  context: Context,
  search?: UsrSearch,
  sort?: Sort|Sort[],
): Promise<string> {
  const models = await findAll(context, search, undefined, sort);
  const buffer0 = await readFile(`./usr.xlsx`);
  const buffer = await renderExcel(buffer0, { models });
  const result = await tmpfileDao.upload(
    {
      content: buffer,
      name: "file",
      originalName: "用户.xlsx",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  return result;
}
