
const componentMapSelectInput: Record<string, () => Promise<Component>> = {<#
  for (let i = 0; i < allTables.length; i++) {
    const record = allTables[i];
    let table_name = record.TABLE_NAME;
    if (!optTables[table_name]) continue;
    const table_nameUp = table_name.substring(0, 1).toUpperCase() + table_name.substring(1);
    const table_comment = record.TABLE_COMMENT;
    const mod = table_name.substring(0, table_name.indexOf("_"));
    const mod_slash_table = table_name.replace("_", "/");
    table_name = table_name.substring(table_name.indexOf("_") + 1);
    
    const table = table_name;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    
    record.opts = record.opts || { };
    const opts = record.opts;
    if (opts.hasSelectInput !== true) {
      continue;
    }
  #>
  "<#=Table_Up#>SelectInput": () => import("@/views/<#=mod#>/<#=table#>/SelectInput.vue"),<#
  }
  #>
};

const componentKeysSelectInput = [<#
  for (let i = 0; i < allTables.length; i++) {
    const record = allTables[i];
    let table_name = record.TABLE_NAME;
    if (!optTables[table_name]) continue;
    const table_nameUp = table_name.substring(0, 1).toUpperCase() + table_name.substring(1);
    const table_comment = record.TABLE_COMMENT;
    const mod = table_name.substring(0, table_name.indexOf("_"));
    const mod_slash_table = table_name.replace("_", "/");
    table_name = table_name.substring(table_name.indexOf("_") + 1);
    
    const table = table_name;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    
    record.opts = record.opts || { };
    const opts = record.opts;
    if (opts.hasSelectInput !== true) {
      continue;
    }
  #>
  {
    value: "<#=Table_Up#>SelectInput",
    label: "<#=table_comment#>选择框",
  },<#
  }
  #>
];

export async function getComponentKeysSelectInput() {
  return componentKeysSelectInput;
}

export default componentMapSelectInput;
