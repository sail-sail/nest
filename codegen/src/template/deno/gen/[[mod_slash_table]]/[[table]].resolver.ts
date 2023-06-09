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
  type <#=inputName#>,
  type <#=searchName#>,
} from "./<#=table#>.model.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCount<#=Table_Up#>(
  search?: <#=searchName#> & { $extra?: SearchExtra[] },
) {
  const { findCount } = await import("./<#=table#>.service.ts");
  const res = await findCount(search);
  return res;
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
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments<#=Table_Up#>() {
  const { getFieldComments } = await import("./<#=table#>.service.ts");
  const res = await getFieldComments();
  return res;
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
  const res = await findSummary(search);
  return res;
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
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findById<#=Table_Up#>(
  id: string,
) {
  const { findById } = await import("./<#=table#>.service.ts");
  const res = await findById(id);
  return res;
}<#
if (opts.noAdd !== true) {
#>

/**
 * 创建一条数据
 */
export async function create<#=Table_Up#>(
  input: <#=inputName#>,
) {
  const context = useContext();
  
  context.is_tran = true;
  const {<#
    if (log) {
    #>
    findById,<#
    }
    #>
    create,
  } = await import("./<#=table#>.service.ts");<#
  if (log) {
  #>
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");<#
  }
  #>
  const res = await create(input);<#
  if (log) {
  #>
  
  const new_data = await findById(res);
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "create",
    method_lbl: "创建",
    lbl: "创建",
    old_data: "{}",
    new_data: JSON.stringify(new_data),
  });<#
  }
  #>
  return res;
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
  input: <#=inputName#>,
) {
  const context = useContext();
  
  context.is_tran = true;
  const {<#
    if (log) {
    #>
    findById,<#
    }
    #>
    updateById,
  } = await import("./<#=table#>.service.ts");<#
  if (log) {
  #>
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");
  const old_data = await findById<#=Table_Up#>(id);<#
  }
  #>
  const res = await updateById(id, input);<#
  if (log) {
  #>
  
  const new_data = await findById(res);
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "updateById",
    method_lbl: "修改",
    lbl: "修改",
    old_data: JSON.stringify(old_data),
    new_data: JSON.stringify(new_data),
  });<#
  }
  #>
  return res;
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
  const {<#
    if (log) {
    #>
    findAll,<#
    }
    #>
    deleteByIds,
  } = await import("./<#=table#>.service.ts");<#
  if (log) {
  #>
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");
  const old_data = await findAll({
    ids,
  });<#
  }
  #>
  const res = await deleteByIds(ids);<#
  if (log) {
  #>
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "deleteByIds",
    method_lbl: "删除",
    lbl: "删除",
    old_data: JSON.stringify(old_data),
    new_data: "{}",
  });<#
  }
  #>
  return res;
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
  const {
    lockByIds,
  } = await import("./<#=table#>.service.ts");<#
  if (log) {
  #>
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");<#
  }
  #>
  const res = await lockByIds(ids, is_locked);<#
  if (log) {
  #>
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "lockByIds",
    method_lbl: "锁定",
    lbl: "锁定",
    old_data: JSON.stringify(ids),
    new_data: "[]",
  });<#
  }
  #>
  return res;
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
  const {
    revertByIds,
  } = await import("./<#=table#>.service.ts");<#
  if (log) {
  #>
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");<#
  }
  #>
  const res = await revertByIds(ids);<#
  if (log) {
  #>
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "revertByIds",
    method_lbl: "还原",
    lbl: "还原",
    old_data: JSON.stringify(ids),
    new_data: "[]",
  });<#
  }
  #>
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIds<#=Table_Up#>(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const {
    forceDeleteByIds,
  } = await import("./<#=table#>.service.ts");<#
  if (log) {
  #>
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");<#
  }
  #>
  const res = await forceDeleteByIds(ids);<#
  if (log) {
  #>
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "forceDeleteByIds",
    method_lbl: "彻底删除",
    lbl: "彻底删除",
    old_data: JSON.stringify(ids),
    new_data: "[]",
  });<#
  }
  #>
  return res;
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
  const res = findLastOrderBy();
  return res;
}<#
}
#>
