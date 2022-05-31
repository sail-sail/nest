import { Context } from "/lib/context.ts";
import { Page, Sort } from "/lib/page.model.ts";
import { renderExcel } from "ejsexcel";
import { AuthModel } from "/lib/auth/auth.constants.ts";
import * as authDao from "/lib/auth/auth.dao.ts";
import * as tmpfileDao from "/lib/tmpfile/tmpfile.dao.ts";

import { readFile } from "std/node/fs/promises.ts";

import { Background_taskModel, Background_taskSearch } from "./background_task.model.ts";
import * as background_taskDao from "./background_task.dao.ts";

/**
 * 根据条件查找总数
 * @param {Background_taskSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  context: Context,
  search?: Background_taskSearch,
): Promise<number> {
  const result = await background_taskDao.findCount(context, search);
  return result;
}

/**
 * 根据条件和分页查找数据
 * @param {Background_taskSearch} search? 搜索条件
 * @param {Page} page? 分页条件
 * @param {Sort|Sort[]} sort? 排序
 * @return {Promise<Background_taskModel[]>} 
 */
export async function findAll(
  context: Context,
  search?: Background_taskSearch,
  page?: Page,
  sort?: Sort|Sort[],
): Promise<Background_taskModel[]> {
  
  search = search || { };
  const { id: usr_id } = await authDao.getAuthModel(context) as AuthModel;
  search.create_usr_id = [ usr_id ];
  const result: Background_taskModel[] = await background_taskDao.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 * @param {Background_taskSearch} search? 搜索条件
 * @return {Promise<Background_taskModel>} 
 */
export async function findOne(
  context: Context,
  search?: Background_taskSearch,
): Promise<Background_taskModel> {
  const result = await background_taskDao.findOne(context, search);
  return result;
}

/**
 * 根据id查找数据
 * @param {string} id
 * @return {Promise<Background_taskModel>}
 */
export async function findById(
  context: Context,
  id?: string,
): Promise<Background_taskModel | undefined> {
  const result = await background_taskDao.findById(context, id);
  return result;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {Background_taskSearch} search? 搜索条件
 * @return {Promise<boolean>}
 */
export async function exist(
  context: Context,
  search?: Background_taskSearch,
): Promise<boolean> {
  const result = await background_taskDao.exist(context, search);
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
  const result = await background_taskDao.existById(context, id);
  return result;
}

/**
 * 创建数据
 * @param {Background_taskModel} model
 * @return {Promise<string | undefined>} 
 */
export async function create(
  context: Context,
  model: Background_taskModel,
): Promise<string | undefined> {
  const result = await background_taskDao.create(context, model);
  return result;
}

/**
 * 根据id修改数据
 * @param {string} id
 * @param {Background_taskModel} model
 * @return {Promise<string | undefined>}
 */
export async function updateById(
  context: Context,
  id: string,
  model: Background_taskModel,
): Promise<string | undefined> {
  await background_taskDao.updateById(context, id, model);
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
  const result = await background_taskDao.deleteByIds(context, ids);
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
  const result = await background_taskDao.revertByIds(context, ids);
  return result;
}

/**
 * 导出Excel
 * @param {Background_taskSearch} search? 搜索条件
 * @param {Sort|Sort[]} sort? 排序
 * @return {Promise<string>} 临时文件id
 */
export async function exportExcel(
  context: Context,
  search?: Background_taskSearch,
  sort?: Sort|Sort[],
): Promise<string> {
  const models = await findAll(context, search, undefined, sort);
  const buffer0 = await readFile(`./background_task.xlsx`);
  const buffer = await renderExcel(buffer0, { models });
  const result = await tmpfileDao.upload(
    {
      content: buffer,
      name: "file",
      originalName: "后台任务.xlsx",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  return result;
}
