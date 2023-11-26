export const scalars = {<#
  for (let i = 0; i < allTables.length; i++) {
    const record = allTables[i];
    let table_name = record.TABLE_NAME;
    const tableSchema = optTables[table_name];
    if (!tableSchema) continue;
    const table_nameUp = table_name.substring(0, 1).toUpperCase() + table_name.substring(1);
    const Table_Up = table_nameUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let table_comment = record.TABLE_COMMENT;
    if (table_comment.includes("[")) {
      table_comment = table_comment.substring(0, table_comment.indexOf("["));
    }
    const mod = table_name.substring(0, table_name.indexOf("_"));
    const mod_slash_table = table_name.replace("_", "/");
    table_name = table_name.substring(table_name.indexOf("_") + 1);
    const columns = tableSchema.columns;
  #>
  
  // <#=table_comment#>ID
  "<#=Table_Up#>Id": {
    "input": `import("/gen/<#=mod#>/<#=table_name#>/<#=table_name#>.model.ts").<#=Table_Up#>Id`,
    "output": `import("/gen/<#=mod#>/<#=table_name#>/<#=table_name#>.model.ts").<#=Table_Up#>Id`,
  },<#
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
  #>
  // <#=table_comment#><#=column_comment#>
  "<#=enumColumnName#>": {
    "input": `import("/gen/<#=mod#>/<#=table_name#>/<#=table_name#>.model.ts").<#=enumColumnName#>`,
    "output": `import("/gen/<#=mod#>/<#=table_name#>/<#=table_name#>.model.ts").<#=enumColumnName#>`,
  },<#
      }
  #><#
    }
  #><#
  }
  #>
  
};
