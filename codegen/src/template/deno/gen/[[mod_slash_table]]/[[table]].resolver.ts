<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type <#=Table_Up#>Input,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type <#=Table_Up#>Model,
  type <#=Table_Up#>Search,
} from "./<#=table#>.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCount<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./<#=table#>.service.ts");
  const data = await findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAll<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const { findAll } = await import("./<#=table#>.service.ts");
  const data = await findAll(search, page, sort);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments<#=tableUp#>() {
  const { getFieldComments } = await import("./<#=table#>.service.ts");
  const data = await getFieldComments();
  return data;
}<#
if (hasSummary) {
#>

/**
 * 根据搜索条件查找合计
 */
export async function findSummary<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
) {
  const { findSummary } = await import("./<#=table#>.service.ts");
  const data = await findSummary(search);
  return data;
}<#
}
#>

/**
 * 根据条件查找第一条数据
 */
export async function findOne<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./<#=table#>.service.ts");
  const data = await findOne(search, sort);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findById<#=tableUp#>(
  id: string,
) {
  const { findById } = await import("./<#=table#>.service.ts");
  const data = await findById(id);
  return data;
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
  const { create } = await import("./<#=table#>.service.ts");
  const data = await create(model);
  return data;
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
  const { updateById } = await import("./<#=table#>.service.ts");
  const data = await updateById(id, model);
  return data;
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
  const { deleteByIds } = await import("./<#=table#>.service.ts");
  const data = await deleteByIds(ids);
  return data;
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
  const { lockByIds } = await import("./<#=table#>.service.ts");
  const data = await lockByIds(ids, is_locked);
  return data;
}<#
  }
#><#
if (opts.noAdd !== true && opts.noEdit !== true) {
#>

/**
 * 批量导入
 */
export async function importModels<#=tableUp#>(
  models: <#=Table_Up#>Input[],
) {
  const { importModels } = await import("./<#=table#>.service.ts");
  const data = await importModels(models);
  return data;
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
  const { revertByIds } = await import("./<#=table#>.service.ts");
  const data = await revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIds<#=tableUp#>(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const { forceDeleteByIds } = await import("./<#=table#>.service.ts");
  const data = await forceDeleteByIds(ids);
  return data;
}<#
}
#><#
if (hasOrderBy) {
#>

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderBy<#=tableUp#>() {
  const { findLastOrderBy } = await import("./<#=table#>.service.ts");
  const data = findLastOrderBy();
  return data;
}<#
}
#>
