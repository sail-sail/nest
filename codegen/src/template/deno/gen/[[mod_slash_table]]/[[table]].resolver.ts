<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsMonth = columns.some((column) => column.isMonth);
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
} from "/lib/context.ts";<#
let hasDecimal = false;
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  if (column.noList) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (column_name === "version") continue;
  const foreignKey = column.foreignKey;
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE;
  if (!column_type) {
    continue;
  }
  if (!column_type.startsWith("decimal")) {
    continue;
  }
  hasDecimal = true;
}
#><#
if (hasDecimal) {
#>

import Decimal from "decimal.js";<#
}
#><#
if (hasIsMonth) {
#>

import dayjs from "dayjs";<#
}
#>

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  <#=inputName#>,
  <#=modelName#>,
  <#=searchName#>,
  <#=fieldCommentName#>,
} from "./<#=table#>.model.ts";<#
if (hasSummary) {
#>

import {
  <#=Table_Up#>Summary,
} from "/gen/types.ts";<#
}
#>

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCount<#=Table_Up#>(
  search?: <#=searchName#> & { $extra?: SearchExtra[] },
): Promise<number> {
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
): Promise<<#=modelName#>[]> {
  const { findAll } = await import("./<#=table#>.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments<#=Table_Up#>(): Promise<<#=fieldCommentName#>> {
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
): Promise<<#=Table_Up#>Summary> {
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
): Promise<<#=modelName#> | undefined> {
  const { findOne } = await import("./<#=table#>.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findById<#=Table_Up#>(
  id: string,
): Promise<<#=modelName#> | undefined> {
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
  unique_type?: UniqueType,
): Promise<string> {<#
  if (hasIsMonth) {
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (
      [
        "id",
        "create_usr_id",
        "create_time",
        "update_usr_id",
        "update_time",
      ].includes(column_name)
    ) continue;
    let column_comment = column.COLUMN_COMMENT || "";
  #><#
    if (column.isMonth) {
  #>
  // <#=column_comment#>
  if (input.<#=column_name#>) {
    input.<#=column_name#> = dayjs(input.<#=column_name#>).startOf("month").format("YYYY-MM-DD HH:mm:ss");
  }<#
    }
  #><#
  }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    if (column.noList) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "version") continue;
    const foreignKey = column.foreignKey;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    if (!column_type) {
      continue;
    }
    if (!column_type.startsWith("decimal")) {
      continue;
    }
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
  #>
  
  // <#=column_comment#>
  if (input.<#=column_name#> != null) {
    input.<#=column_name#> = new Decimal(input.<#=column_name#>);
  }<#
  }
  #>
  
  const {<#
    if (log) {
    #>
    findById,<#
    }
    #>
    validate,
    create,
  } = await import("./<#=table#>.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await validate(input);
  
  await usePermit(
    "/<#=mod#>/<#=table#>",
    "add",
  );<#
  if (log) {
  #>
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");<#
  }
  #>
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });<#
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
): Promise<string> {<#
  if (hasIsMonth) {
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (
      [
        "id",
        "create_usr_id",
        "create_time",
        "update_usr_id",
        "update_time",
      ].includes(column_name)
    ) continue;
    let column_comment = column.COLUMN_COMMENT || "";
  #><#
    if (column.isMonth) {
  #>
  // <#=column_comment#>
  if (input.<#=column_name#>) {
    input.<#=column_name#> = dayjs(input.<#=column_name#>).startOf("month").format("YYYY-MM-DD HH:mm:ss");
  }<#
    }
  #><#
  }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    if (column.noList) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "version") continue;
    const foreignKey = column.foreignKey;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    if (!column_type) {
      continue;
    }
    if (!column_type.startsWith("decimal")) {
      continue;
    }
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
  #>
  
  // <#=column_comment#>
  if (input.<#=column_name#> != null) {
    input.<#=column_name#> = new Decimal(input.<#=column_name#>);
  }<#
  }
  #>
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/<#=mod#>/<#=table#>",
    "edit",
  );
  
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
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/<#=mod#>/<#=table#>",
    "delete",
  );
  
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
  if (hasDefault && opts.noEdit !== true) {
#>

/**
 * 根据 id 设置默认记录
 */
export async function defaultById<#=Table_Up#>(
  id: string,
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/<#=mod#>/<#=table#>",
    "default",
  );
  
  const {
    defaultById,
  } = await import("./<#=table#>.service.ts");<#
  if (log) {
  #>
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");<#
  }
  #>
  const res = await defaultById(id);<#
  if (log) {
  #>
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "defaultById",
    method_lbl: "默认",
    lbl: "默认",
    old_data: JSON.stringify(ids),
    new_data: "[]",
  });<#
  }
  #>
  return res;
}<#
  }
#><#
  if (hasEnabled && opts.noEdit !== true) {
#>

/**
 * 根据 ids 启用或者禁用数据
 */
export async function enableByIds<#=Table_Up#>(
  ids: string[],
  is_enabled: 0 | 1,
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIds<#=Table_Up#>.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/<#=mod#>/<#=table#>",
    "enable",
  );
  
  const {
    enableByIds,
  } = await import("./<#=table#>.service.ts");<#
  if (log) {
  #>
  
  const { log } = await import("/src/base/operation_record/operation_record.service.ts");<#
  }
  #>
  const res = await enableByIds(ids, is_enabled);<#
  if (log) {
  #>
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "enableByIds",
    method_lbl: "启用",
    lbl: "启用",
    old_data: JSON.stringify(ids),
    new_data: "[]",
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
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIds<#=Table_Up#>.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/<#=mod#>/<#=table#>",
    "lock",
  );
  
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
    method_lbl: is_locked ? "锁定" : "解锁",
    lbl: is_locked ? "锁定" : "解锁",
    old_data: "",
    new_data: JSON.stringify({
      ids,
      is_locked,
    }),
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
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/<#=mod#>/<#=table#>",
    "delete",
  );
  
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
    old_data: "[]",
    new_data: JSON.stringify(ids),
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
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/<#=mod#>/<#=table#>",
    "force_delete",
  );
  
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
export async function findLastOrderBy<#=Table_Up#>(): Promise<number> {
  const { findLastOrderBy } = await import("./<#=table#>.service.ts");
  const res = findLastOrderBy();
  return res;
}<#
}
#>
