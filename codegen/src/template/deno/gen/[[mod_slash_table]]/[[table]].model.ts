<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasOrgId = columns.some((column) => column.COLUMN_NAME === "org_id");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
const hasIsHidden = columns.some((column) => column.COLUMN_NAME === "is_hidden");
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let table_Up = Table_Up.substring(0, 1).toLowerCase() + Table_Up.substring(1);
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
let commentName = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
  commentName = Table_Up + "Comment";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
  commentName = Table_Up + "Comment";
}
const tenant_id_column = columns.find((column) => column.COLUMN_NAME === "tenant_id");
const org_id_column = columns.find((column) => column.COLUMN_NAME === "org_id");
#>

import type {
  <#=inputName#> as <#=inputName#>Type,
  <#=modelName#> as <#=modelName#>Type,
  <#=searchName#> as <#=searchName#>Type,
  <#=fieldCommentName#> as <#=fieldCommentName#>Type,
} from "/gen/types.ts";<#
const hasImportIds = [ ];
#><#
hasImportIds.push(Table_Up + "Id");
#><#
if (hasTenant_id) {
#><#
  if (!hasImportIds.includes("TenantId")) {
    hasImportIds.push("TenantId");
#>

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";<#
  }
#><#
}
#><#
if (hasOrgId) {
#><#
  if (!hasImportIds.includes("OrgId")) {
    hasImportIds.push("OrgId");
#>

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";<#
  }
#><#
}
#><#
if (!hasImportIds.includes("UsrId")) {
  hasImportIds.push("UsrId");
#>

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";<#
}
#>

declare const <#=table_Up#>Id: unique symbol;
export type <#=Table_Up#>Id = Distinct<string, typeof <#=table_Up#>Id>;

export interface <#=searchName#> extends <#=searchName#>Type {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (!column.onlyCodegenDeno) continue;
    // if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const isPassword = column.isPassword;
    if (isPassword) continue;
    const search = column.search;
    if (column_name === 'org_id') {
      continue;
    }
    if (column_name === 'tenant_id') {
      continue;
    }
    if (column_name === 'is_sys') {
      continue;
    }
    if (column_name === 'is_deleted') {
      continue;
    }
    if (column_name === 'is_hidden') {
      continue;
    }
    if (column_name === 'id') {
      data_type = `${ Table_Up }Id`;
    }
    else if (foreignKey) {
      data_type = `${ foreignTable_Up }Id[]`;
    }
    else if (column.DATA_TYPE === 'varchar') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'date') {
      data_type = 'string[]';
    }
    else if (column.DATA_TYPE === 'datetime') {
      data_type = 'string[]';
    }
    else if (column.DATA_TYPE === 'int') {
      data_type = 'number[]';
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
      data_type = 'string[]';
    }
    if (column_name.startsWith("is_")) {
      data_type = 'number';
    }
    if (column_name === 'id') {
      column_comment = 'ID';
    }
    if (column.dict || column.dictbiz) {
      if (column.DATA_TYPE === 'tinyint' || column.DATA_TYPE === 'int') {
        data_type = "number[]";
      } else {
        data_type = "string[]";
      }
    }
  #><#
    if (foreignKey) {
  #>
  /** <#=column_comment#> */
  <#=column_name#>?: <#=data_type#>;
  <#=column_name#>_is_null?: boolean;<#
    } else if (column.dict || column.dictbiz) {
  #>
  /** <#=column_comment#> */
  <#=column_name#>?: <#=data_type#>;<#
    } else if (column_name === "id") {
  #>
  /** ID */
  <#=column_name#>?: <#=data_type#>;<#
    } else if (
      column.DATA_TYPE === "int"
      || column.DATA_TYPE === "decimal"
    ) {
  #>
  /** <#=column_comment#> */
  <#=column_name#>?: <#=data_type#>;<#
    } else if (
      column.DATA_TYPE === "date"
      || column.DATA_TYPE === "datetime"
    ) {
  #>
  /** <#=column_comment#> */
  <#=column_name#>?: <#=data_type#>;<#
    } else if (!column.isEncrypt) {
  #>
  /** <#=column_comment#> */
  <#=column_name#>?: <#=data_type#>;
  <#=column_name#>_like?: <#=data_type#>;<#
    }
  #><#
  }
  #><#
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
  #><#
  if (hasCreateUsrId) {
  #>
  create_usr_id: UsrId;
  create_usr_id_lbl: string;<#
  }
  #><#
  if (hasCreateTime) {
  #>
  create_time?: string | null;
  create_time_lbl: string;<#
  }
  #><#
  if (hasUpdateUsrId) {
  #>
  update_usr_id: UsrId;
  update_usr_id_lbl: string;<#
  }
  #><#
  if (hasUpdateTime) {
  #>
  update_time?: string | null;
  update_time_lbl: string;<#
  }
  #><#
  if (hasTenant_id) {
  #>
  tenant_id: TenantId;<#
  }
  #><#
  if (hasOrgId) {
  #>
  org_id: OrgId;<#
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
    const foreignTableUp = foreignKey && foreignKey.table && foreignKey.table.substring(0, 1).toUpperCase()+foreignKey.table.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
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
    if (column_name === 'id') {
      data_type = `${ Table_Up }Id`;
    }
    else if (foreignKey && foreignKey.multiple) {
      data_type = `${ foreignTable_Up }Id[]`;
      _data_type = "string[]";
      is_nullable = true;
    }
    else if (foreignKey && !foreignKey.multiple) {
      data_type = `${ foreignTable_Up }Id`;
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
      _data_type = "string";
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
  #><#
  if (hasCreateUsrId) {
  #>
  create_usr_id?: UsrId | null;
  create_usr_id_lbl?: string | null;<#
  }
  #><#
  if (hasCreateTime) {
  #>
  create_time?: string | null;
  create_time_lbl?: string | null;<#
  }
  #><#
  if (hasUpdateUsrId) {
  #>
  update_usr_id?: UsrId | null;
  update_usr_id_lbl?: string | null;<#
  }
  #><#
  if (hasUpdateTime) {
  #>
  update_time?: string | null;
  update_time_lbl?: string | null;<#
  }
  #><#
  if (hasIsDeleted) {
  #>
  is_deleted?: number | null;<#
  }
  #><#
  if (hasTenant_id) {
  #>
  tenant_id?: TenantId | null;<#
  }
  #><#
  if (hasOrgId) {
  #>
  org_id?: OrgId | null;<#
  }
  #><#
  if (hasIsHidden) {
  #>
  is_hidden?: 0|1|null;<#
  }
  #>
}

export type { <#=fieldCommentName#>Type as <#=fieldCommentName#> };
