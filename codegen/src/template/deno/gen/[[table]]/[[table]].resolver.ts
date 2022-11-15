<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("_");
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import * as <#=table#>Service from "./<#=table#>.service.ts";

import {
  type <#=Table_Up#>Model,
  type <#=Table_Up#>Search,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCount<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
) {
  const result = await <#=table#>Service.findCount(search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAll<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await <#=table#>Service.findAll(search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
export async function exportExcel<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await <#=table#>Service.exportExcel(search, sort);
  return result;
}<#
if (hasSummary) {
#>

/**
 * 根据搜索条件查找合计
 */
export async function findSummary<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
) {
  const result = await <#=table#>Service.findSummary(search);
  return result;
}<#
}
#>

/**
 * 根据条件查找第一条数据
 */
export async function findOne<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
) {
  const result = await <#=table#>Service.findOne(search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
export async function findById<#=tableUp#>(
  id: string,
) {
  const result = await <#=table#>Service.findById(id);
  return result;
}<#
if (opts.noAdd !== true) {
#>

/**
 * 创建一条数据
 */
export async function create<#=tableUp#>(
  model: <#=Table_Up#>Model,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await <#=table#>Service.create(model);
  return result;
}<#
}
#><#
if (opts.noEdit !== true) {
#>

/**
 * 根据id修改一条数据
 */
export async function updateById<#=tableUp#>(
  id: string,
  model: <#=Table_Up#>Model,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await <#=table#>Service.updateById(id, model);
  return result;
}<#
}
#><#
if (opts.noDelete !== true) {
#>

/**
 * 根据 ids 删除数据
 */
export async function deleteByIds<#=tableUp#>(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await <#=table#>Service.deleteByIds(ids);
  return result;
}<#
}
#><#
  if (hasLocked && opts.noEdit !== true) {
#>

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIds<#=tableUp#>(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIds<#=tableUp#>.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const result = await <#=table#>Service.lockByIds(ids, is_locked);
  return result;
}<#
  }
#><#
if (opts.noAdd !== true && opts.noEdit !== true) {
#>

/**
 * 导入<#=table_comment#>
 */
export async function importFile<#=tableUp#>(
  id: string,
) {
  const result = await <#=table#>Service.importFile(id);
  return result;
}<#
}
#><#
if (opts.noDelete !== true) {
#>

/**
 * 根据 ids 还原数据
 */
export async function revertByIds<#=tableUp#>(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await <#=table#>Service.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIds<#=tableUp#>(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await <#=table#>Service.forceDeleteByIds(ids);
  return result;
}<#
}
#><#
if (hasOrderBy) {
#>

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderBy<#=tableUp#>() {
  const result = await <#=table#>Service.findLastOrderBy();
  return result;
}<#
}
#>
