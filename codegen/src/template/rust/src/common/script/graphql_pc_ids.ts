// prefix: /gen
export function getScalars() {
  const scalars = {<#
    for (let i = 0; i < allTables.length; i++) {
      const record = allTables[i];
      let table_name = record.TABLE_NAME;
      const tableSchema = optTables[table_name];
      if (!tableSchema) continue;
      const table = table_name.substring(table_name.indexOf("_") + 1);
      const tableUp = table.substring(0, 1).toUpperCase() + table.substring(1);
      let Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      let table_comment = record.TABLE_COMMENT;
      if (table_comment.includes("[")) {
        table_comment = table_comment.substring(0, table_comment.indexOf("["));
      }
      const mod = table_name.substring(0, table_name.indexOf("_"));
      const columns = tableSchema.columns;
      /*if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
        && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
      ) {
        Table_Up = Table_Up.substring(0, Table_Up.length - 1) + Table_Up.substring(Table_Up.length - 1).toUpperCase();
      }*/
    #>
    
    // <#=table_comment#>
    "<#=Table_Up#>Id": {
      "input": "<#=Table_Up#>Id",
      "output": "<#=Table_Up#>Id",
    },<#
    }
    #>
    
  };
  return scalars;
}
