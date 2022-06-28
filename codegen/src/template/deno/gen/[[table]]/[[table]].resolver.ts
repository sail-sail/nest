<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("_");
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import { Context } from "/lib/context.ts";
import { Page, Sort } from "/lib/page.model.ts";

import * as <#=table#>Service from "./<#=table#>.service.ts";
import {
  <#=Table_Up#>Model,
  <#=Table_Up#>Search,
} from "/gen/types.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCount<#=tableUp#>(
  context: Context,
  search?: <#=Table_Up#>Search,
) {
  const result = await <#=table#>Service.findCount(context, search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAll<#=tableUp#>(
  context: Context,
  search?: <#=Table_Up#>Search,
  page?: Page,
  sort?: Sort[],
) {
  const result = await <#=table#>Service.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcel<#=tableUp#>(
  context: Context,
  search?: <#=Table_Up#>Search,
  sort?: Sort[],
) {
  const result = await <#=table#>Service.exportExcel(context, search, sort);
  return result;
}<#
if (hasSummary) {
#>

/**
 * 根据搜索条件查找合计
 */
export async function findSummary<#=tableUp#>(
  context: Context,
  search?: <#=Table_Up#>Search,
) {
  const result = await <#=table#>Service.findSummary(context, search);
  return result;
}<#
}
#>

/**
 * 根据条件查找第一条数据
 */
export async function findOne<#=tableUp#>(
  context: Context,
  search?: <#=Table_Up#>Search,
) {
  const result = await <#=table#>Service.findOne(context, search);
  return result;
}

/**
 * 根据id查找一条数据
 */
export async function findById<#=tableUp#>(
  context: Context,
  id: string,
) {
  const result = await <#=table#>Service.findById(context, id);
  return result;
}

/**
 * 创建一条数据
 */
export async function create<#=tableUp#>(
  context: Context,
  model: <#=Table_Up#>Model,
) {
  context.is_tran = true;
  const result = await <#=table#>Service.create(context, model);
  return result;
}

/**
 * 根据id修改一条数据
 */
export async function updateById<#=tableUp#>(
  context: Context,
  id: string,
  model: <#=Table_Up#>Model,
) {
  context.is_tran = true;
  const result = await <#=table#>Service.updateById(context, id, model);
  return result;
}

/**
 * 根据ids删除数据
 */
export async function deleteByIds<#=tableUp#>(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await <#=table#>Service.deleteByIds(context, ids);
  return result;
}

/**
 * 导入<#=table_comment#>
 */
export async function importFile<#=tableUp#>(
  context: Context,
  id: string,
) {
  const result = await <#=table#>Service.importFile(context, id);
  return result;
}

/**
 * 根据ids还原数据
 */
export async function revertByIds<#=tableUp#>(
  context: Context,
  ids: string[],
) {
  context.is_tran = true;
  const result = await <#=table#>Service.revertByIds(context, ids);
  return result;
}<#
if (hasOrderBy) {
#>

/**
 * 查找order_by字段的最大值
 */
export async function findLastOrderBy<#=tableUp#>(
  context: Context,
) {
  const result = await <#=table#>Service.findLastOrderBy(context);
  return result;
}<#
}
#>
