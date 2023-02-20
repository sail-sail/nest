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

import {
  _internals as <#=table#>Service
} from "./<#=table#>.service.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type <#=Table_Up#>Model,
  type <#=Table_Up#>Search,
} from "./<#=table#>.model.ts";

export const _internals = {
  findCount<#=tableUp#>,
  findAll<#=tableUp#>,
  exportExcel<#=tableUp#>,<#
  if (hasSummary) {
  #>
  findSummary<#=tableUp#>,<#
  }
  #>
  findOne<#=tableUp#>,
  findById<#=tableUp#>,<#
  if (opts.noAdd !== true) {
  #>
  create<#=tableUp#>,<#
  }
  #><#
  if (opts.noEdit !== true) {
  #>
  updateById<#=tableUp#>,<#
  }
  #><#
  if (opts.noDelete !== true) {
  #>
  deleteByIds<#=tableUp#>,<#
  }
  #><#
    if (hasLocked && opts.noEdit !== true) {
  #>lockByIds<#=tableUp#>,<#
  }
  #><#
  if (opts.noAdd !== true && opts.noEdit !== true) {
  #>
  importFile<#=tableUp#>,<#
  }
  #><#
  if (opts.noDelete !== true) {
  #>
  revertByIds<#=tableUp#>,
  forceDeleteByIds<#=tableUp#>,<#
  }
  #><#
  if (hasOrderBy) {
  #>
  findLastOrderBy<#=tableUp#>,<#
  }
  #>
};

/**
 * 根据条件查找据数总数
 */
async function findCount<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
) {
  const data = await <#=table#>Service.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAll<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const data = await <#=table#>Service.findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
async function exportExcel<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await <#=table#>Service.exportExcel(search, sort);
  return data;
}<#
if (hasSummary) {
#>

/**
 * 根据搜索条件查找合计
 */
async function findSummary<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
) {
  const data = await <#=table#>Service.findSummary(search);
  return data;
}<#
}
#>

/**
 * 根据条件查找第一条数据
 */
async function findOne<#=tableUp#>(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
) {
  const data = await <#=table#>Service.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
async function findById<#=tableUp#>(
  id: string,
) {
  const data = await <#=table#>Service.findById(id);
  return data;
}<#
if (opts.noAdd !== true) {
#>

/**
 * 创建一条数据
 */
async function create<#=tableUp#>(
  model: <#=Table_Up#>Model,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await <#=table#>Service.create(model);
  return data;
}<#
}
#><#
if (opts.noEdit !== true) {
#>

/**
 * 根据id修改一条数据
 */
async function updateById<#=tableUp#>(
  id: string,
  model: <#=Table_Up#>Model,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await <#=table#>Service.updateById(id, model);
  return data;
}<#
}
#><#
if (opts.noDelete !== true) {
#>

/**
 * 根据 ids 删除数据
 */
async function deleteByIds<#=tableUp#>(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await <#=table#>Service.deleteByIds(ids);
  return data;
}<#
}
#><#
  if (hasLocked && opts.noEdit !== true) {
#>

/**
 * 根据 ids 锁定或者解锁数据
 */
async function lockByIds<#=tableUp#>(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIds<#=tableUp#>.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const data = await <#=table#>Service.lockByIds(ids, is_locked);
  return data;
}<#
  }
#><#
if (opts.noAdd !== true && opts.noEdit !== true) {
#>

/**
 * 导入<#=table_comment#>
 */
async function importFile<#=tableUp#>(
  id: string,
) {
  const data = await <#=table#>Service.importFile(id);
  return data;
}<#
}
#><#
if (opts.noDelete !== true) {
#>

/**
 * 根据 ids 还原数据
 */
async function revertByIds<#=tableUp#>(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await <#=table#>Service.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIds<#=tableUp#>(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await <#=table#>Service.forceDeleteByIds(ids);
  return data;
}<#
}
#><#
if (hasOrderBy) {
#>

/**
 * 查找 order_by 字段的最大值
 */
async function findLastOrderBy<#=tableUp#>() {
  const data = await <#=table#>Service.findLastOrderBy();
  return data;
}<#
}
#>
