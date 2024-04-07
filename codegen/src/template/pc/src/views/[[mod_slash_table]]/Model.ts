<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasOrgId = columns.some((column) => column.COLUMN_NAME === "org_id");
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
} from "#/types";

export interface <#=modelName#> extends <#=modelName#>Type {<#
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

export interface <#=inputName#> extends <#=inputName#>Type {
}

export interface <#=searchName#> extends <#=searchName#>Type {
}

export interface <#=fieldCommentName#> extends <#=fieldCommentName#>Type {
}

export const <#=fieldsName#> = [<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "is_deleted") continue;
    if (column_name === "tenant_id") continue;
    if (column_name === "org_id") continue;
    let column_type = column.COLUMN_TYPE;
    let data_type = column.DATA_TYPE;
    let column_comment = column.COLUMN_COMMENT;
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.includes("[")) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const isPassword = column.isPassword;
    if (isPassword) continue;
  #><#
    if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
      || data_type === "datetime" || data_type === "date"
    ) {
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
    const inline_column_name = inlineForeignTab.column_name;
  #>
  <#=inline_column_name#> {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "is_deleted") continue;
      if (column_name === "tenant_id") continue;
      let column_type = column.COLUMN_TYPE;
      let data_type = column.DATA_TYPE;
      let column_comment = column.COLUMN_COMMENT;
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.includes("[")) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
    #><#
      if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
        || data_type === "datetime" || data_type === "date"
      ) {
    #>
    // <#=column_comment#>
    "<#=column_name#>",
    "<#=column_name#>_lbl",<#
      } else {
    #>
    // <#=column_comment#>
    "<#=column_name#>",<#
      }
    }
    #>
  }<#
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
    const inlineMany2manyColumns = inlineMany2manySchema.columns;
  #>
  <#=column_name#>_<#=table#>_models {<#
    for (let i = 0; i < inlineMany2manyColumns.length; i++) {
      const column = inlineMany2manyColumns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "is_deleted") continue;
      if (column_name === "tenant_id") continue;
      let column_type = column.COLUMN_TYPE;
      let data_type = column.DATA_TYPE;
      let column_comment = column.COLUMN_COMMENT;
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.includes("[")) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
    #><#
      if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
        || data_type === "datetime" || data_type === "date"
      ) {
    #>
    // <#=column_comment#>
    "<#=column_name#>",
    "<#=column_name#>_lbl",<#
      } else {
    #>
    // <#=column_comment#>
    "<#=column_name#>",<#
      }
    }
    #>
  }<#
  }
  #>
];
