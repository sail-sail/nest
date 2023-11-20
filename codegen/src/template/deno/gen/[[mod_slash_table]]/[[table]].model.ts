<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasOrgId = columns.some((column) => column.COLUMN_NAME === "org_id");
const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
const hasIsHidden = columns.some((column) => column.COLUMN_NAME === "is_hidden");
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
const tenant_id_column = columns.find((column) => column.COLUMN_NAME === "tenant_id");
const org_id_column = columns.find((column) => column.COLUMN_NAME === "org_id");
#>import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  <#=inputName#> as <#=inputName#>Type,
  <#=modelName#> as <#=modelName#>Type,
  <#=searchName#> as <#=searchName#>Type,
} from "/gen/types.ts";

export interface <#=searchName#> extends <#=searchName#>Type {<#
  if (hasTenant_id) {
  #>
  tenant_id?: string | null;<#
  }
  #><#
  if (hasOrgId) {
  #>
  org_id?: string | null;<#
  }
  #><#
  if (hasIsHidden) {
  #>
  is_hidden?: (0|1)[];<#
  }
  #>
  $extra?: SearchExtra[];
}

export interface <#=modelName#> extends <#=modelName#>Type {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (!column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if ([
      "create_usr_id",
      "create_time",
      "update_usr_id",
      "update_time",
      "tenant_id",
      "org_id",
      "is_hidden",
    ].includes(column_name)) continue;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    let data_type = column.DATA_TYPE;
    let column_comment = column.COLUMN_COMMENT;
    if (!column_comment && column_name !== "id") {
      throw `错误: 表: ${ table } 字段: ${ column_name } 无 comment`;
    }
    let selectList = [ ];
    if (column_comment.endsWith("multiple")) {
      _data_type = "[String]";
    }
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    let _data_type = "string";
    if (foreignKey && foreignKey.multiple) {
      data_type = 'string[]';
      _data_type = "string[]";
      is_nullable = true;
    }
    else if (foreignKey && !foreignKey.multiple) {
      data_type = 'string';
      _data_type = "string";
    }
    else if (column.DATA_TYPE === 'varchar') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'date') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'datetime') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'int') {
      data_type = 'number';
    }
    else if (column.DATA_TYPE === 'json') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'text') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'tinyint') {
      data_type = 'number';
    }
    else if (column.DATA_TYPE === 'decimal') {
      data_type = 'number';
    }
  #><#
    if (is_nullable) {
  #>
  /** <#=column_comment#> */
  <#=column_name#>?: <#=data_type#> | null;<#
    } else {
  #>
  /** <#=column_comment#> */
  <#=column_name#>: <#=data_type#>;<#
    }
  #><#
  }
  #>
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;<#
  if (hasTenant_id) {
  #>
  tenant_id: string;<#
  }
  #><#
  if (hasOrgId) {
  #>
  org_id: string;<#
  }
  #><#
  if (hasIsHidden) {
  #>
  is_hidden: 0|1;<#
  }
  #>
}

export interface <#=inputName#> extends <#=inputName#>Type {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (!column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if ([
      "create_usr_id",
      "create_time",
      "update_usr_id",
      "update_time",
      "tenant_id",
      "org_id",
      "is_hidden",
    ].includes(column_name)) continue;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    let data_type = column.DATA_TYPE;
    let column_comment = column.COLUMN_COMMENT;
    if (!column_comment && column_name !== "id") {
      throw `错误: 表: ${ table } 字段: ${ column_name } 无 comment`;
    }
    let selectList = [ ];
    if (column_comment.endsWith("multiple")) {
      _data_type = "[String]";
    }
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    let _data_type = "string";
    if (foreignKey && foreignKey.multiple) {
      data_type = 'string[]';
      _data_type = "string[]";
      is_nullable = true;
    }
    else if (foreignKey && !foreignKey.multiple) {
      data_type = 'string';
      _data_type = "string";
    }
    else if (column.DATA_TYPE === 'varchar') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'date') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'datetime') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'int') {
      data_type = 'number';
    }
    else if (column.DATA_TYPE === 'json') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'text') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'tinyint') {
      data_type = 'number';
    }
    else if (column.DATA_TYPE === 'decimal') {
      data_type = 'Decimal';
    }
  #><#
    if (is_nullable) {
  #>
  /** <#=column_comment#> */
  <#=column_name#>?: <#=data_type#> | null;<#
    } else {
  #>
  /** <#=column_comment#> */
  <#=column_name#>?: <#=data_type#>;<#
    }
  #><#
  }
  #>
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;<#
  if (hasTenant_id) {
  #>
  tenant_id?: string | null;<#
  }
  #><#
  if (hasOrgId) {
  #>
  org_id?: string | null;<#
  }
  #><#
  if (hasIsHidden) {
  #>
  is_hidden?: 0|1|null;<#
  }
  #>
}

export interface <#=fieldCommentName#> {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    if (column_name === "is_sys") {
      continue;
    }
    if (column_name === "tenant_id") {
      continue;
    }
    if (column_name === "org_id") {
      continue;
    }
    if (column_name === "is_deleted") {
      continue;
    }
    if (column_name === "is_hidden") {
      continue;
    }
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const isPassword = column.isPassword;
    if (isPassword) continue;
    const foreignKey = column.foreignKey;
  #><#
    if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
      || data_type === "datetime" || data_type === "date"
    ) {
  #>
  <#=column_name#>: string;<#
      if (!columns.some((item) => item.COLUMN_NAME === column_name + "_lbl")) {
  #>
  <#=column_name#>_lbl: string;<#
      }
  #><#
    } else {
  #>
  <#=column_name#>: string;<#
    }
  #><#
  }
  #>
}
