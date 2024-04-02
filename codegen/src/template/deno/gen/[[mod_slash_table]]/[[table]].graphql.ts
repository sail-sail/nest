<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by' && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasOrgId = columns.some((column) => column.COLUMN_NAME === "org_id");
const hasInlineForeignTabs = opts?.inlineForeignTabs && opts?.inlineForeignTabs.length > 0;
const inlineForeignTabs = opts?.inlineForeignTabs || [ ];
const hasIsHidden = columns.some((column) => column.COLUMN_NAME === "is_hidden");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let Table_Up2 = Table_Up;
// if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
//   && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
// ) {
//   Table_Up2 = Table_Up.substring(0, Table_Up.length - 1) + Table_Up.substring(Table_Up.length - 1).toUpperCase();
// }
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  modelName = Table_Up2 + "Model";
  fieldCommentName = Table_Up2 + "FieldComment";
  inputName = Table_Up2 + "Input";
  searchName = Table_Up2 + "Search";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
}
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./<#=table#>.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar <#=Table_Up#>Id
<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  if (
    column_name === "tenant_id" ||
    column_name === "org_id" ||
    column_name === "is_sys" ||
    column_name === "is_deleted" ||
    column_name === "is_hidden"
  ) continue;
  const data_type = column.DATA_TYPE;
  const column_comment = column.COLUMN_COMMENT;
#><#
  if (
    (column.dict || column.dictbiz) &&
    ![ "int", "decimal", "tinyint" ].includes(data_type)
  ) {
    let Column_Up = column_name.substring(0, 1).toUpperCase()+column_name.substring(1);
    Column_Up = Column_Up.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const enumColumnName = Table_Up + Column_Up;
    const columnDictModels = [
      ...dictModels.filter(function(item) {
        return item.code === column.dict || item.code === column.dictbiz;
      }),
      ...dictbizModels.filter(function(item) {
        return item.code === column.dict || item.code === column.dictbiz;
      }),
    ];
#><#
    if (columnDictModels.length > 0) {
#>
"<#=table_comment#><#=column_comment#>"
enum <#=enumColumnName#> {<#
    for (let i = 0; i < columnDictModels.length; i++) {
      const columnDictModel = columnDictModels[i];
      const val = columnDictModel.val;
      const lbl = columnDictModel.lbl;
#>
  "<#=lbl#>"
  <#=val#><#
    }
#>
}<#
    }
#><#
  }
  #><#
}
#>

type <#=modelName#> {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let data_type = column.DATA_TYPE;
    if (column_name === "is_sys") {
      continue;
    }
    if (column_name === 'is_deleted') {
      continue;
    }
    if (column_name === 'org_id') {
      continue;
    }
    if (column_name === 'tenant_id') {
      continue;
    }
    if (column_name === 'is_hidden') {
      continue;
    }
    let _data_type = "String";
    if (column_name === 'id') {
      data_type = `${ Table_Up }Id`;
      _data_type = 'String';
    }
    else if (foreignKey && foreignKey.multiple) {
      data_type = `[${ foreignTable_Up }Id!]`;
      _data_type = '[String!]';
      is_nullable = true;
    }
    else if (foreignKey && !foreignKey.multiple) {
      data_type = `${ foreignTable_Up }Id`;
      _data_type = 'String';
    }
    else if (column.DATA_TYPE === 'varchar') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'date') {
      data_type = 'NaiveDate';
    }
    else if (column.DATA_TYPE === 'datetime') {
      data_type = 'NaiveDateTime';
    }
    else if (column.DATA_TYPE === 'int') {
      data_type = 'Int';
      _data_type = "Int";
    }
    else if (column.DATA_TYPE === 'json') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'text') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'tinyint') {
      data_type = 'Int';
      _data_type = "Int";
    }
    else if (column.DATA_TYPE === 'decimal') {
      data_type = 'Decimal';
      _data_type = "String";
    }
    let column_comment = column.COLUMN_COMMENT;
    if (!column_comment && column_name !== "id") {
      console.log(column);
      throw `错误: 表: ${mod}_${ table } 字段: ${ column_name } 无 comment`;
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
    if (!foreignKey && selectList.length === 0 && !column.dict && !column.dictbiz
      && column.DATA_TYPE !== "date" && column.DATA_TYPE !== "datetime"
    ) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#><#
    } else if (column.DATA_TYPE === "date" || column.DATA_TYPE === "datetime") {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#>
  "<#=column_comment#>"
  <#=column_name#>_lbl: String!<#
    } else if (column.dict || column.dictbiz) {
      let enumColumnName = data_type;
      const columnDictModels = [
        ...dictModels.filter(function(item) {
          return item.code === column.dict || item.code === column.dictbiz;
        }),
        ...dictbizModels.filter(function(item) {
          return item.code === column.dict || item.code === column.dictbiz;
        }),
      ];
      if (![ "int", "decimal", "tinyint" ].includes(column.DATA_TYPE) && columnDictModels.length > 0) {
        let Column_Up = column_name.substring(0, 1).toUpperCase()+column_name.substring(1);
        Column_Up = Column_Up.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        enumColumnName = Table_Up + Column_Up;
      }
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=enumColumnName#>
  "<#=column_comment#>"
  <#=column_name#>_lbl: String!<#
    } else {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#>
  "<#=column_comment#>"
  <#=column_name#>_lbl: <#=_data_type#><#
    }
  }
  #><#
  if (hasVersion) {
  #>
  "版本号"
  version: Int!<#
  }
  #><#
  if (hasIsDeleted) {
  #>
  "是否已删除"
  is_deleted: Int!<#
  }
  #><#
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    if (!inlineForeignSchema) {
      throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
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
      modelName = Table_Up + "Model";
      fieldCommentName = Table_Up + "FieldComment";
      inputName = Table_Up + "Input";
      searchName = Table_Up + "Search";
    } else {
      modelName = Table_Up + "Model";
      fieldCommentName = Table_Up + "FieldComment";
      inputName = Table_Up + "Input";
      searchName = Table_Up + "Search";
    }
    const inline_column_name = inlineForeignTab.column_name;
    const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
  #><#
    if (inline_foreign_type === "one2many") {
  #>
  "<#=inlineForeignTab.label#>"
  <#=inline_column_name#>: [<#=modelName#>!]<#
    } else {
  #>
  "<#=inlineForeignTab.label#>"
  <#=inline_column_name#>: <#=modelName#><#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const comment = column.COLUMN_COMMENT;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let data_type = column.DATA_TYPE;
    const many2many = column.many2many;
    if (!many2many || !foreignKey) continue;
    if (!column.inlineMany2manyTab) continue;
    const inlineMany2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
    const table = many2many.table;
    const mod = many2many.mod;
    if (!inlineMany2manySchema) {
      throw `表: ${ mod }_${ table } 的 inlineMany2manyTab 中的 ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
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
      modelName = Table_Up + "Model";
      fieldCommentName = Table_Up + "FieldComment";
      inputName = Table_Up + "Input";
      searchName = Table_Up + "Search";
    } else {
      modelName = Table_Up + "Model";
      fieldCommentName = Table_Up + "FieldComment";
      inputName = Table_Up + "Input";
      searchName = Table_Up + "Search";
    }
  #>
  "<#=comment#>"
  <#=column_name#>_<#=table#>_models: [<#=modelName#>!]<#
  }
  #>
}
type <#=fieldCommentName#> {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let column_comment = column.COLUMN_COMMENT;
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (column_name === "is_sys") {
      continue;
    }
    if (column_name === "is_deleted") {
      continue;
    }
    if (column_name === "org_id") {
      continue;
    }
    if (column_name === "tenant_id") {
      continue;
    }
    if (column_name === 'is_hidden') {
      continue;
    }
    const isPassword = column.isPassword;
    if (isPassword) continue;
  #><#
    if (foreignKey) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: String!
  "<#=column_comment#>"
  <#=column_name#>_lbl: String!<#
    } else if (column.DATA_TYPE === "date" || column.DATA_TYPE === "datetime") {
  #>
  "<#=column_comment#>"
  <#=column_name#>: String!
  "<#=column_comment#>"
  <#=column_name#>_lbl: String!<#
    } else if ((selectList && selectList.length > 0) || column.dict || column.dictbiz) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: String!
  "<#=column_comment#>"
  <#=column_name#>_lbl: String!<#
    } else {
  #>
  "<#=column_comment#>"
  <#=column_name#>: String!<#
    }
  }
  #>
}
input <#=inputName#> {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "is_deleted") continue;
    if (column_name === "version") continue;
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let data_type = column.DATA_TYPE;
    if (
      [
        "is_sys",
        "org_id",
        "tenant_id",
        "is_hidden",
        "create_usr_id",
        "create_time",
        "update_usr_id",
        "update_time",
      ].includes(column_name)
    ) {
      continue;
    }
    let _data_type = "String";
    if (column_name === 'id') {
      data_type = `${ Table_Up }Id`;
    }
    else if (foreignKey && foreignKey.multiple) {
      data_type = `[${ foreignTable_Up }Id!]`;
      _data_type = '[String!]';
    }
    else if (foreignKey && !foreignKey.multiple) {
      data_type = `${ foreignTable_Up }Id`;
      _data_type = 'String';
    }
    else if (column.DATA_TYPE === 'varchar') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'date') {
      data_type = 'NaiveDate';
    }
    else if (column.DATA_TYPE === 'datetime') {
      data_type = 'NaiveDateTime';
    }
    else if (column.DATA_TYPE === 'int') {
      data_type = 'Int';
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
      data_type = 'Decimal';
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
    if (column_name === 'id') column_comment = 'ID';
  #><#
    if (foreignKey) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#>
  "<#=column_comment#>"
  <#=column_name#>_lbl: <#=_data_type#><#
    } else if (!foreignKey && selectList.length === 0 && !column.dict && !column.dictbiz
      && column.DATA_TYPE !== "date" && !column.DATA_TYPE === "datetime"
    ) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#><#
    } else if (column.DATA_TYPE === "date" || column.DATA_TYPE === "datetime") {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#>
  "<#=column_comment#>"
  <#=column_name#>_lbl: <#=_data_type#><#
    } else if (selectList.length > 0 || column.dict || column.dictbiz) {
      let enumColumnName = data_type;
      const columnDictModels = [
        ...dictModels.filter(function(item) {
          return item.code === column.dict || item.code === column.dictbiz;
        }),
        ...dictbizModels.filter(function(item) {
          return item.code === column.dict || item.code === column.dictbiz;
        }),
      ];
      if (![ "int", "decimal", "tinyint" ].includes(column.DATA_TYPE) && columnDictModels.length > 0) {
        let Column_Up = column_name.substring(0, 1).toUpperCase()+column_name.substring(1);
        Column_Up = Column_Up.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        enumColumnName = Table_Up + Column_Up;
      }
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=enumColumnName#>
  "<#=column_comment#>"
  <#=column_name#>_lbl: String<#
    } else {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#><#
    }
  #><#
  }
  #><#
  if (hasVersion) {
  #>
  "版本号"
  version: Int<#
  }
  #><#
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    if (!inlineForeignSchema) {
      throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
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
      modelName = Table_Up + "Model";
      fieldCommentName = Table_Up + "FieldComment";
      inputName = Table_Up + "Input";
      searchName = Table_Up + "Search";
    } else {
      modelName = Table_Up + "Model";
      fieldCommentName = Table_Up + "FieldComment";
      inputName = Table_Up + "Input";
      searchName = Table_Up + "Search";
    }
    const inline_column_name = inlineForeignTab.column_name;
    const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
  #><#
    if (inline_foreign_type === "one2many") {
  #>
  "<#=inlineForeignTab.label#>"
  <#=inline_column_name#>: [<#=inputName#>!]<#
    } else {
  #>
  "<#=inlineForeignTab.label#>"
  <#=inline_column_name#>: <#=inputName#><#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const comment = column.COLUMN_COMMENT;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let data_type = column.DATA_TYPE;
    const many2many = column.many2many;
    if (!many2many || !foreignKey) continue;
    if (!column.inlineMany2manyTab) continue;
    const inlineMany2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
    const table = many2many.table;
    const mod = many2many.mod;
    if (!inlineMany2manySchema) {
      throw `表: ${ mod }_${ table } 的 inlineMany2manyTab 中的 ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
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
      modelName = Table_Up + "Model";
      fieldCommentName = Table_Up + "FieldComment";
      inputName = Table_Up + "Input";
      searchName = Table_Up + "Search";
    } else {
      modelName = Table_Up + "Model";
      fieldCommentName = Table_Up + "FieldComment";
      inputName = Table_Up + "Input";
      searchName = Table_Up + "Search";
    }
  #>
  "<#=comment#>"
  <#=column_name#>_<#=table#>_models: [<#=inputName#>!]<#
  }
  #>
}
input <#=searchName#> {<#
  if (hasIsDeleted) {
  #>
  "是否已删除"
  is_deleted: Int<#
  }
  #>
  "ID列表"
  ids: [<#=Table_Up#>Id!]<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
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
    const isEncrypt = column.isEncrypt;
    if (isEncrypt) continue;
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
      data_type = `[${ foreignTable_Up }Id!]`;
    }
    else if (column.DATA_TYPE === 'varchar') {
      data_type = 'String';
    }
    else if (column.DATA_TYPE === 'date') {
      data_type = '[NaiveDate]';
    }
    else if (column.DATA_TYPE === 'datetime') {
      data_type = '[NaiveDateTime]';
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
      data_type = '[Decimal]';
    }
    if (column_name.startsWith("is_")) {
      data_type = 'Int';
    }
    if (column_name === 'id') {
      column_comment = 'ID';
    }
    if (column.dict || column.dictbiz) {
      if (column.DATA_TYPE === 'tinyint' || column.DATA_TYPE === 'int') {
        data_type = "[Int!]";
      } else {
        data_type = "[String!]";
      }
    }
  #><#
    if (foreignKey) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#>
  <#=column_name#>_is_null: Boolean<#
    } else if (column.dict || column.dictbiz) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#><#
    } else if (column_name === "id") {
  #>
  "ID"
  <#=column_name#>: <#=data_type#><#
    } else if (
      column.DATA_TYPE === "int"
      || column.DATA_TYPE === "decimal"
    ) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#><#
    } else if (
      column.DATA_TYPE === "date"
      || column.DATA_TYPE === "datetime"
    ) {
  #>
  "<#=column_comment#>"
  <#=column_name#>: <#=data_type#><#
    } else if (!column.isEncrypt) {
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
type <#=Table_Up2#>Summary {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    // if (column.isVirtual) continue;
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
  "根据条件查找<#=table_comment#>总数"
  findCount<#=Table_Up2#>(search: <#=searchName#>): Int!
  "根据搜索条件和分页查找<#=table_comment#>列表"
  findAll<#=Table_Up2#>(search: <#=searchName#>, page: PageInput, sort: [SortInput!]): [<#=modelName#>!]!
  "获取<#=table_comment#>字段注释"
  getFieldComments<#=Table_Up2#>: <#=fieldCommentName#>!<#
  if (hasSummary) {
  #>
  "根据搜索条件查找<#=table_comment#>合计"
  findSummary<#=Table_Up2#>(search: <#=searchName#>): <#=Table_Up2#>Summary!<#
  }
  #>
  "根据条件查找第一个<#=table_comment#>"
  findOne<#=Table_Up2#>(search: <#=searchName#>, sort: [SortInput!]): <#=modelName#>
  "根据 id 查找<#=table_comment#>"
  findById<#=Table_Up2#>(id: <#=Table_Up#>Id!): <#=modelName#><#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  "根据 ids 获取<#=table_comment#>是否可编辑数据权限"
  getEditableDataPermitsByIds<#=Table_Up2#>(ids: [<#=Table_Up#>Id!]!): [Int!]!<#
  }
  #><#
  if (hasOrderBy) {
  #>
  "查找 <#=table_comment#> order_by 字段的最大值"
  findLastOrderBy<#=Table_Up2#>: Int!<#
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
  "创建<#=table_comment#>"
  create<#=Table_Up2#>(input: <#=inputName#>!, unique_type: UniqueType): <#=Table_Up#>Id!<#
  }
  #><#
  if (opts.noEdit !== true) {
  #>
  "根据 id 修改<#=table_comment#>"
  updateById<#=Table_Up2#>(id: <#=Table_Up#>Id!, input: <#=inputName#>!): <#=Table_Up#>Id!<#
  }
  #><#
  if (opts.noDelete !== true) {
  #>
  "根据 ids 删除<#=table_comment#>"
  deleteByIds<#=Table_Up2#>(ids: [<#=Table_Up#>Id!]!): Int!<#
  }
  #><#
  if (hasDefault && opts.noEdit !== true) {
  #>
  "根据 id 设置默认<#=table_comment#>"
  defaultById<#=Table_Up2#>(id: <#=Table_Up#>Id!): Int!<#
  }
  #><#
  if (hasEnabled && opts.noEdit !== true) {
  #>
  "根据 ids 启用或者禁用<#=table_comment#>"
  enableByIds<#=Table_Up2#>(ids: [<#=Table_Up#>Id!]!, is_enabled: Int!): Int!<#
  }
  #><#
  if (hasLocked && opts.noEdit !== true) {
  #>
  "根据 ids 锁定或者解锁<#=table_comment#>"
  lockByIds<#=Table_Up2#>(ids: [<#=Table_Up#>Id!]!, is_locked: Int!): Int!<#
  }
  #><#
  if (opts.noRevert !== true && hasIsDeleted) {
  #>
  "根据 ids 还原<#=table_comment#>"
  revertByIds<#=Table_Up2#>(ids: [<#=Table_Up#>Id!]!): Int!<#
  }
  #><#
  if (opts.noDelete !== true && hasIsDeleted) {
  #>
  "根据 ids 彻底删除<#=table_comment#>"
  forceDeleteByIds<#=Table_Up2#>(ids: [<#=Table_Up#>Id!]!): Int!<#
  }
  #>
}<#
}
#>

`);
