<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasDeptId = columns.some((column) => column.COLUMN_NAME === "dept_id");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
#>import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type <#=Table_Up#>Model as <#=Table_Up#>ModelType,
  type <#=Table_Up#>Search as <#=Table_Up#>SearchType,
} from "/gen/types.ts";

export interface <#=Table_Up#>Search extends <#=Table_Up#>SearchType {<#
  if (hasTenant_id) {
  #>
  tenant_id?: string | null;<#
  }
  #><#
  if (hasDeptId) {
  #>
  dept_id?: string | null;<#
  }
  #>
  $extra?: SearchExtra[];
}

export interface <#=Table_Up#>Model extends <#=Table_Up#>ModelType {<#
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
      "dept_id",
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
  tenant_id?: string | null;<#
  }
  #><#
  if (hasDeptId) {
  #>
  dept_id?: string | null;<#
  }
  #>
}
