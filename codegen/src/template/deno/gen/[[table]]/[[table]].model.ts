<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasDeptId = columns.some((column) => column.COLUMN_NAME === "dept_id");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("_");
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

export interface <#=Table_Up#>Model extends <#=Table_Up#>ModelType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
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
