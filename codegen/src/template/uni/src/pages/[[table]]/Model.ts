/* eslint-disable @typescript-eslint/no-empty-object-type */
<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
const hasIsHidden = columns.some((column) => column.COLUMN_NAME === "is_hidden");
const hasInlineForeignTabs = opts?.inlineForeignTabs && opts?.inlineForeignTabs.length > 0;
const inlineForeignTabs = opts?.inlineForeignTabs || [ ];
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let table_Up = Table_Up.substring(0, 1).toLowerCase() + Table_Up.substring(1);
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
let commentName = "";
let fieldsName = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
  commentName = Table_Up + "Comment";
  fieldsName = table_Up + "Fields";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
  commentName = Table_Up + "Comment";
  fieldsName = table_Up + "Fields";
}
#>import type {
  <#=inputName#> as <#=inputName#>Type,
  <#=modelName#> as <#=modelName#>Type,
  <#=searchName#> as <#=searchName#>Type,
  <#=fieldCommentName#> as <#=fieldCommentName#>Type,
} from "#/types.ts";<#
for (const inlineForeignTab of inlineForeignTabs) {
  const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
  const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
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
  const table_Up = Table_Up.substring(0, 1).toLowerCase() + Table_Up.substring(1);
#>

import {
  <#=table_Up#>QueryField,
} from "@/pages/<#=table#>/Model.ts";<#
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
  const table = many2many.table;
  const mod = many2many.mod;
  const inlineMany2manySchema = optTables[mod + "_" + table];
  if (!inlineMany2manySchema) {
    throw `表: ${ mod }_${ table } 的 inlineMany2manyTab 中的 ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
    process.exit(1);
  }
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const table_Up = Table_Up.substring(0, 1).toLowerCase() + Table_Up.substring(1);
  const inlineMany2manyColumns = inlineMany2manySchema.columns;
#>

import {
  <#=table_Up#>QueryField,
} from "@/pages/<#=table#>/Model.ts";<#
}
#>

declare global {
  
  /** <#=table_comment#> */
  interface <#=modelName#> extends <#=modelName#>Type {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      const data_type = column.DATA_TYPE;
      const column_type = column.COLUMN_TYPE;
      const column_comment = column.COLUMN_COMMENT || "";
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
    #><#
      if (data_type === "decimal") {
    #>
    /** <#=column_comment#> */
    <#=column_name#>_lbl: string;<#
      } else if (column.isImg) {
    #>
    /** <#=column_comment#> */
    <#=column_name#>_lbl: string;<#
      }
    #><#
    }
    #>
  }
  
  /** <#=table_comment#> */
  interface <#=inputName#> extends <#=inputName#>Type {<#
    if (hasIsSys) {
    #>
    /** 系统字段 */
    is_sys?: number | null;<#
    }
    #>
  }
  
  /** <#=table_comment#> */
  interface <#=searchName#> extends <#=searchName#>Type {<#
    if (hasIsDeleted) {
    #>
    is_deleted?: 0 | 1 | null;<#
    }
    #>
  }
  
  /** <#=table_comment#> */
  interface <#=fieldCommentName#> extends <#=fieldCommentName#>Type {
  }
  
}

export const <#=fieldsName#> = [<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno && !column.onlyCodegenDenoButApi) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "is_deleted") continue;
    if (column_name === "tenant_id") continue;
    const column_type = column.COLUMN_TYPE;
    const data_type = column.DATA_TYPE;
    const column_comment = column.COLUMN_COMMENT;
    const foreignKey = column.foreignKey;
    const isPassword = column.isPassword;
    if (isPassword) continue;
    const modelLabel = column.modelLabel;
    let cascade_fields = [ ];
    if (foreignKey) {
      cascade_fields = foreignKey.cascade_fields || [ ];
      if (foreignKey.lbl && cascade_fields.includes(foreignKey.lbl) && !modelLabel) {
        cascade_fields = cascade_fields.filter((item) => item !== foreignKey.lbl);
      }
    }
    const isIcon = column.isIcon;
  #><#
    if (isIcon) {
  #>
  // <#=column_comment#>
  "<#=column_name#>",
  // <#=column_comment#>
  "<#=column_name#>_lbl",<#
    } else if (foreignKey) {
  #>
  // <#=column_comment#>
  "<#=column_name#>",<#
    if (foreignKey.lbl) {
  #>
  "<#=column_name#>_lbl",<#
    }
  #><#
    for (let j = 0; j < cascade_fields.length; j++) {
      const cascade_field = cascade_fields[j];
  #>
  "<#=column_name#>_<#=cascade_field#>",<#
    }
  #><#
    } else if (column.dict || column.dictbiz || data_type === "datetime" || data_type === "date") {
  #>
  // <#=column_comment#>
  "<#=column_name#>",
  "<#=column_name#>_lbl",<#
    } else {
  #>
  // <#=column_comment#>
  "<#=column_name#>",<#
    }
  #><#
  }
  #><#
  if (hasVersion) {
  #>
  "version",<#
  }
  #><#
  if (hasIsDeleted) {
  #>
  "is_deleted",<#
  }
  #><#
  if (hasIsSys) {
  #>
  "is_sys",<#
  }
  #>
];

export const <#=table_Up#>QueryField = `
  ${ <#=fieldsName#>.join(" ") }<#
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
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
    const table_Up = Table_Up.substring(0, 1).toLowerCase() + Table_Up.substring(1);
    const inline_column_name = inlineForeignTab.column_name;
  #>
  <#=inline_column_name#> {
    ${ <#=table_Up#>Fields.join(" ") }
  }<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno && !column.onlyCodegenDenoButApi) continue;
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
    const table = many2many.table;
    const mod = many2many.mod;
    const inlineMany2manySchema = optTables[mod + "_" + table];
    if (!inlineMany2manySchema) {
      throw `表: ${ mod }_${ table } 的 inlineMany2manyTab 中的 ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const table_Up = Table_Up.substring(0, 1).toLowerCase() + Table_Up.substring(1);
    const inlineMany2manyColumns = inlineMany2manySchema.columns;
  #>
  <#=column_name#>_<#=table#>_models {
    ${ <#=table_Up#>QueryField }
  }<#
  }
  #>
`;
