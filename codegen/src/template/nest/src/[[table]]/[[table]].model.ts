<#
const hasSummary = columns.some((column) => column.showSummary);
#>
export interface <#=tableUp#>Model {
  [key: string]: any,<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if ([ "tenant_id", "create_usr_id", "create_time", "update_usr_id", "update_time", "is_deleted", "delete_time" ].includes(column_name)) continue;
    let data_type = column.DATA_TYPE;
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    if (column_name === 'id') {
      data_type = 'string';
    }
    else if (foreignKey) {
      if (foreignKey.multiple) {
        data_type = 'string[]';
      } else {
        data_type = 'string';
      }
    }
    else if (column.DATA_TYPE === 'varchar') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'date') {
      data_type = 'Date';
    }
    else if (column.DATA_TYPE === 'datetime') {
      data_type = 'Date';
    }
    else if (column.DATA_TYPE === 'int') {
      data_type = 'number';
    }
    else if (column.DATA_TYPE === 'json') {
      data_type = 'any';
    }
    else if (column.DATA_TYPE === 'text') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'tinyint') {
      data_type = "number";
    }
    else if (column.DATA_TYPE === 'decimal') {
      data_type = 'number';
    }
    if (column_name.startsWith("is_")) {
      data_type = "0|1";
    }
    let column_comment = column.COLUMN_COMMENT;
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (data_type === 'id') column_comment = '';
    else {
      column_comment = ' //' + column_comment;
    }
  #><#
    if (!foreignKey && selectList.length === 0) {
  #>
  <#=column_name#>?: <#=data_type#>,<#=column_comment#><#
    } else {
  #>
  <#=column_name#>?: <#=data_type#>,<#=column_comment#>ID
  _<#=column_name#>?: <#
    if (foreignKey && foreignKey.multiple) {
  #>string[],<#
    } else {
  #>string,<#
    }
  #><#=column_comment#>名称<#
    }
  }
  #>
  tenant_id?: string, // 租户ID
  create_usr_id?: string, // 创建用户ID
  create_time?: Date, // 创建时间
  update_usr_id?: string, // 更新用户ID
  update_time?: Date, // 更新时间
  is_deleted?: 0|1, // 是否删除
  delete_time?: Date, // 删除时间
}

export interface <#=tableUp#>Search {
  is_deleted?: 0|1; // 是否已删除
  ids?: string[]; //ID列表<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if ([ "is_deleted" ].includes(column_name)) continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.DATA_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const search = column.search;
    if (column_name === 'id') {
      data_type = 'string';
    }
    else if (foreignKey) {
      if (foreignKey.multiple) {
        data_type = 'string[]';
      } else {
        data_type = 'string';
      }
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
      data_type = 'any';
    }
    else if (column.DATA_TYPE === 'text') {
      data_type = 'string';
    }
    else if (column.DATA_TYPE === 'tinyint') {
      data_type = "number";
    }
    else if (column.DATA_TYPE === 'decimal') {
      data_type = 'number';
    }
    if (column_name.startsWith("is_")) {
      data_type = "0|1";
    }
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (foreignKey || selectList.length > 0) {
      data_type = data_type+"[]";
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (data_type === 'id') {
      column_comment = '';
    } else {
      column_comment = ' //' + column_comment;
    }
    /* if (!search) continue; */
  #><#
    if (foreignKey) {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#>,
  _<#=column_name#>?: <#=data_type#>;<#=column_comment#><#
    } else if (selectList && selectList.length > 0) {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#><#
    } else if (column_name === "id") {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#><#
    } else if (data_type === "0|1") {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#><#
    } else if (column.DATA_TYPE === "int" || column.DATA_TYPE === "decimal" || column.DATA_TYPE === "double" || column.DATA_TYPE === "datetime" || column.DATA_TYPE === "date") {
  #>
  <#=column_name#>?: <#=data_type#>[];<#=column_comment#><#
    } else {
  #>
  <#=column_name#>?: <#=data_type#>;<#=column_comment#>
  <#=column_name#>Like?: <#=data_type#>;<#=column_comment#><#
    }
  #><#
  }
  #>
}<#
if (hasSummary) {
#>

export interface <#=tableUp#>Summary {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    let column_comment = column.COLUMN_COMMENT;
    let data_type = column.DATA_TYPE;
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (data_type === 'id') column_comment = '';
    else {
      column_comment = ' //' + column_comment;
    }
  #><#
    if (column.showSummary) {
  #>
  <#=column_name#>: number;<#=column_comment#><#
    }
  #><#
  }
  #>
}<#
}
#>
