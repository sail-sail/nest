<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import { Context } from "/lib/context.ts";
import { Page, Sort } from "/lib/page.model.ts";
import { renderExcel } from "ejsexcel";
import { AuthModel } from "/lib/auth/auth.constants.ts";
import * as authDao from "/lib/auth/auth.dao.ts";
import * as tmpfileDao from "/lib/tmpfile/tmpfile.dao.ts";

import { readFile } from "std/node/fs/promises.ts";

import { <#=tableUp#>Model, <#=tableUp#>Search } from "./<#=table#>.model.ts";<#
if (hasSummary) {
#>
import { <#=tableUp#>Summary } from "./<#=table#>.model.ts";<#
}
#>
import * as <#=table#>Dao from "./<#=table#>.dao.ts";

/**
 * 根据条件查找总数
 * @param {<#=tableUp#>Search} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  context: Context,
  search?: <#=tableUp#>Search,
): Promise<number> {
  const result = await <#=table#>Dao.findCount(context, search);
  return result;
}

/**
 * 根据条件和分页查找数据
 * @param {<#=tableUp#>Search} search? 搜索条件
 * @param {Page} page? 分页条件
 * @param {Sort|Sort[]} sort? 排序
 * @return {Promise<<#=tableUp#>Model[]>} 
 */
export async function findAll(
  context: Context,
  search?: <#=tableUp#>Search,
  page?: Page,
  sort?: Sort|Sort[],
): Promise<<#=tableUp#>Model[]> {<#
    if (opts.filterDataByCreateUsr) {
  #>
  
  search = search || { };
  const { id: usr_id } = await authDao.getAuthModel(context) as AuthModel;
  search.create_usr_id = [ usr_id ];<#
    }
  #>
  const result: <#=tableUp#>Model[] = await <#=table#>Dao.findAll(context, search, page, sort);
  return result;
}<#
if (hasSummary) {
#>

/**
 * 根据条件和分页查找数据
 * @param {<#=tableUp#>Search} search? 搜索条件
 * @return {Promise<<#=tableUp#>Summary>} 
 */
export async function findSummary(
  context: Context,
  search?: <#=tableUp#>Search,
): Promise<<#=tableUp#>Summary> {
  const result = await <#=table#>Dao.findSummary(context, search);
  return result;
}<#
}
#>

/**
 * 根据条件查找第一条数据
 * @param {<#=tableUp#>Search} search? 搜索条件
 * @return {Promise<<#=tableUp#>Model>} 
 */
export async function findOne(
  context: Context,
  search?: <#=tableUp#>Search,
): Promise<<#=tableUp#>Model> {
  const result = await <#=table#>Dao.findOne(context, search);
  return result;
}

/**
 * 根据id查找数据
 * @param {string} id
 * @return {Promise<<#=tableUp#>Model>}
 */
export async function findById(
  context: Context,
  id?: string,
): Promise<<#=tableUp#>Model | undefined> {
  const result = await <#=table#>Dao.findById(context, id);
  return result;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {<#=tableUp#>Search} search? 搜索条件
 * @return {Promise<boolean>}
 */
export async function exist(
  context: Context,
  search?: <#=tableUp#>Search,
): Promise<boolean> {
  const result = await <#=table#>Dao.exist(context, search);
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
  const result = await <#=table#>Dao.existById(context, id);
  return result;
}

/**
 * 创建数据
 * @param {<#=tableUp#>Model} model
 * @return {Promise<string | undefined>} 
 */
export async function create(
  context: Context,
  model: <#=tableUp#>Model,
): Promise<string | undefined> {
  const result = await <#=table#>Dao.create(context, model);
  return result;
}

/**
 * 根据id修改数据
 * @param {string} id
 * @param {<#=tableUp#>Model} model
 * @return {Promise<string | undefined>}
 */
export async function updateById(
  context: Context,
  id: string,
  model: <#=tableUp#>Model,
): Promise<string | undefined> {
  await <#=table#>Dao.updateById(context, id, model);
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
  const result = await <#=table#>Dao.deleteByIds(context, ids);
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
  const result = await <#=table#>Dao.revertByIds(context, ids);
  return result;
}

/**
 * 导出Excel
 * @param {<#=tableUp#>Search} search? 搜索条件
 * @param {Sort|Sort[]} sort? 排序
 * @return {Promise<string>} 临时文件id
 */
export async function exportExcel(
  context: Context,
  search?: <#=tableUp#>Search,
  sort?: Sort|Sort[],
): Promise<string> {
  const models = await findAll(context, search, undefined, sort);
  const buffer0 = await readFile(`./<#=table#>.xlsx`);
  const buffer = await renderExcel(buffer0, { models });
  const result = await tmpfileDao.upload(
    {
      content: buffer,
      name: "file",
      originalName: "<#=table_comment#>.xlsx",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  return result;
}<#
if (hasOrderBy) {
#>

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  context: Context,
): Promise<number> {
  const result = await <#=table#>Dao.findLastOrderBy(context);
  return result;
}<#
}
#>
