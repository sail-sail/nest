<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  Table_Up = Table_Up.substring(0, Table_Up.length - 1) + Table_Up.substring(Table_Up.length - 1).toUpperCase();
  modelName = Table_Up + "model";
  fieldCommentName = Table_Up + "fieldComment";
  inputName = Table_Up + "input";
  searchName = Table_Up + "search";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
}
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type <#=modelName#>,
  type <#=searchName#>,
} from "./<#=table#>.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCount<#=Table_Up#>(
  search?: <#=searchName#> & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./<#=table#>.service.ts");
  const data = await findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAll<#=Table_Up#>(
  search?: <#=searchName#> & { $extra?: SearchExtra[] },
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
export async function getFieldComments<#=Table_Up#>() {
  const { getFieldComments } = await import("./<#=table#>.service.ts");
  const data = await getFieldComments();
  return data;
}<#
if (hasSummary) {
#>

/**
 * 根据搜索条件查找合计
 */
export async function findSummary<#=Table_Up#>(
  search?: <#=searchName#> & { $extra?: SearchExtra[] },
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
export async function findOne<#=Table_Up#>(
  search?: <#=searchName#> & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const { findOne } = await import("./<#=table#>.service.ts");
  const data = await findOne(search, sort);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
export async function findById<#=Table_Up#>(
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
export async function create<#=Table_Up#>(
  model: <#=modelName#>,
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
export async function updateById<#=Table_Up#>(
  id: string,
  model: <#=modelName#>,
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
export async function deleteByIds<#=Table_Up#>(
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
export async function lockByIds<#=Table_Up#>(
  ids: string[],
  is_locked: 0 | 1,
) {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIds<#=Table_Up#>.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  const { lockByIds } = await import("./<#=table#>.service.ts");
  const data = await lockByIds(ids, is_locked);
  return data;
}<#
  }
#><#
if (opts.noDelete !== true) {
#>

/**
 * 根据 ids 还原数据
 */
export async function revertByIds<#=Table_Up#>(
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
export async function forceDeleteByIds<#=Table_Up#>(
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
export async function findLastOrderBy<#=Table_Up#>() {
  const { findLastOrderBy } = await import("./<#=table#>.service.ts");
  const data = findLastOrderBy();
  return data;
}<#
}
#>
