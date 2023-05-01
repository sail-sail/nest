<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by' && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import { defineGraphql } from "/lib/context.ts";

import * as <#=table#>Resolver from "./<#=table#>.resolver.ts";

defineGraphql(<#=table#>Resolver, /* GraphQL */ `

type <#=Table_Up#>Model {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    let data_type = column.DATA_TYPE;
    let _data_type = "String";
    if (column_name === 'id') {
      data_type = 'ID';
    }
    else if (foreignKey && foreignKey.multiple) {
      data_type = '[ID!]';
      _data_type = "[String!]";
      is_nullable = true;
    }
    else if (foreignKey && !foreignKey.multiple) {
      data_type = 'ID';
      _data_type = "String";
    }
    else if (column.DATA_TYPE === 'varchar') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'date') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'datetime') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'int') {
      data_type = 'Int';
    }
    else if (column.DATA_TYPE === 'json') {
      data_type = 'JSON';
    }
    else if (column.DATA_TYPE === 'text') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'tinyint') {
      data_type = 'Int';
    }
    else if (column.DATA_TYPE === 'decimal') {
      data_type = 'Float';
    }
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
    if (column_name === 'id') column_comment = 'ID';
    if (!is_nullable) {
      data_type += "!";
    }
  #><#
    if (!foreignKey && selectList.length === 0 && !column.dict && !column.dictbiz) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#><#
    } else {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#>
  "<#=column_comment#>"
  <#=column_name#>_lbl: <#=_data_type#><#
    }
  }
  #>
}
type <#=Table_Up#>FieldComment {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    let column_comment = column.COLUMN_COMMENT;
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (column_name === 'id') {
      continue;
    }
    const isPassword = column.isPassword;
    if (isPassword) continue;
  #><#
    if (!foreignKey && selectList.length === 0 && !column.dict && !column.dictbiz) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: String!<#
    } else {
  #>
  "<#=column_comment#>"
  <#=column_name#>: String!
  "<#=column_comment#>"
  <#=column_name#>_lbl: String!<#
    }
  }
  #>
}
input <#=Table_Up#>Input {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const foreignKey = column.foreignKey;
    let data_type = column.DATA_TYPE;
    let _data_type = "String";
    if (column_name === 'id') {
      data_type = 'ID';
    }
    else if (foreignKey && foreignKey.multiple) {
      data_type = '[ID!]';
      _data_type = "[String!]";
    }
    else if (foreignKey && !foreignKey.multiple) {
      data_type = 'ID';
      _data_type = "String";
    }
    else if (column.DATA_TYPE === 'varchar') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'date') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'datetime') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'int') {
      data_type = 'Int';
    }
    else if (column.DATA_TYPE === 'json') {
      data_type = 'JSON';
    }
    else if (column.DATA_TYPE === 'text') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'tinyint') {
      data_type = 'Int';
    }
    else if (column.DATA_TYPE === 'decimal') {
      data_type = 'Float';
    }
    let column_comment = column.COLUMN_COMMENT;
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
    if (column_name === 'id') column_comment = '';
  #><#
    if (!foreignKey && selectList.length === 0 && !column.dict && !column.dictbiz) {
  #><#
    if (column_name === 'id') {
  #>
  "租户ID"
  tenant_id: String<#
    }
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#><#
    } else {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#>
  "<#=column_comment#>"
  <#=column_name#>_lbl: <#=_data_type#><#
    }
  }
  #>
}
input <#=Table_Up#>Search {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    let data_type = column.DATA_TYPE;
    let column_type = column.DATA_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const isPassword = column.isPassword;
    if (isPassword) continue;
    const search = column.search;
    if (column_name === 'id') {
      data_type = 'ID';
    }
    else if (foreignKey) {
      data_type = '[String]';
    }
    else if (column.DATA_TYPE === 'varchar') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'date') {
      data_type = '[String]';
    }
    else if (column.DATA_TYPE === 'datetime') {
      data_type = '[String]';
    }
    else if (column.DATA_TYPE === 'int') {
      data_type = '[Int]';
    }
    else if (column.DATA_TYPE === 'json') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'text') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'tinyint') {
      data_type = 'Int';
    }
    else if (column.DATA_TYPE === 'decimal') {
      data_type = '[Float]';
    }
    if (column_name.startsWith("is_")) {
      data_type = 'Int';
    }
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (selectList.length > 0) {
      data_type = '['+data_type+']';
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (column_name === 'id') {
      column_comment = 'ID';
    }
    if (selectList.length > 0) {
      if (column.DATA_TYPE === 'tinyint' || column.DATA_TYPE === 'int') {
        data_type = "[Int]";
      } else {
        data_type = "[String]";
      }
    } else if (column.dict || column.dictbiz) {
      if (column.DATA_TYPE === 'tinyint' || column.DATA_TYPE === 'int') {
        data_type = "[Int]";
      } else {
        data_type = "[String]";
      }
    }
  #><#
    if (foreignKey) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#>
  <#=column_name#>_lbl: <#=data_type#><#
    } else if (selectList && selectList.length > 0) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#><#
    } else if (column.dict || column.dictbiz) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#><#
    } else if (column_name === "id") {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#><#
    } else if (
      column.DATA_TYPE === "int"
      || column.DATA_TYPE === "decimal"
      || column.DATA_TYPE === "date"
      || column.DATA_TYPE === "datetime"
    ) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#><#
    } else {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#>
  <#=column_name#>_like: <#=data_type#><#
    }
  #><#
  }
  #>
}<#
if (hasSummary) {
#>
type <#=Table_Up#>Summary {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    if (column.onlyCodegenDeno) continue;
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
  #><#
    if (column.showSummary) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: Int<#
    }
  #><#
  }
  #>
}<#
}
#>
type Query {
  "根据条件查找据数总数"
  findCount<#=tableUp#>(search: <#=Table_Up#>Search): Int!
  "根据搜索条件和分页查找数据"
  findAll<#=tableUp#>(search: <#=Table_Up#>Search, page: PageInput, sort: [SortInput]): [<#=Table_Up#>Model!]!
  "获取字段对应的名称"
  getFieldComments<#=tableUp#>: <#=Table_Up#>FieldComment!<#
  if (hasSummary) {
  #>
  "根据搜索条件查找合计"
  findSummary<#=tableUp#>(search: <#=Table_Up#>Search): <#=Table_Up#>Summary!<#
  }
  #>
  "根据条件查找第一条数据"
  findOne<#=tableUp#>(search: <#=Table_Up#>Search, sort: [SortInput]): <#=Table_Up#>Model
  "根据id查找一条数据"
  findById<#=tableUp#>(id: ID!): <#=Table_Up#>Model<#
  if (hasOrderBy) {
  #>
  "查找order_by字段的最大值"
  findLastOrderBy<#=tableUp#>: Int!<#
  }
  #>
}<#
if (opts.noAdd !== true
  || opts.noEdit !== true
  || opts.noDelete !== true
) {
#>
type Mutation {<#
  if (opts.noAdd !== true) {
  #>
  "创建一条数据"
  create<#=tableUp#>(model: <#=Table_Up#>Input!): ID!<#
  }
  #><#
  if (opts.noEdit !== true) {
  #>
  "根据id修改一条数据"
  updateById<#=tableUp#>(id: ID!, model: <#=Table_Up#>Input!): ID!<#
  }
  #><#
  if (opts.noAdd !== true && opts.noEdit !== true) {
  #>
  "批量导入"
  importModels<#=tableUp#>(models: [<#=Table_Up#>Input!]!): String<#
  }
  #><#
  if (opts.noDelete !== true) {
  #>
  "根据 ids 删除数据"
  deleteByIds<#=tableUp#>(ids: [ID!]!): Int!<#
  }
  #><#
  if (hasLocked && opts.noEdit !== true) {
  #>
  "根据 ids 锁定或者解锁数据"
  lockByIds<#=tableUp#>(ids: [ID!]!, is_locked: Int!): Int!<#
  }
  #><#
  if (opts.noDelete !== true) {
  #>
  "根据 ids 还原数据"
  revertByIds<#=tableUp#>(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIds<#=tableUp#>(ids: [ID!]!): Int!<#
  }
  #>
}<#
}
#>

`);
