<#
const mods = [ ];
for (let i = 0; i < allTables.length; i++) {
  const record = allTables[i];
  let table_name = record.TABLE_NAME;
  if (!optTables[table_name]) continue;
  let table_comment = record.TABLE_COMMENT;
  if (table_comment.includes("[")) {
    table_comment = table_comment.substring(0, table_comment.indexOf("["));
  }
  const mod = table_name.substring(0, table_name.indexOf("_"));
  table_name = table_name.substring(table_name.indexOf("_") + 1);
  const table_nameUp = table_name.substring(0, 1).toUpperCase() + table_name.substring(1);
  if (mods.includes(mod)) continue;
  mods.push(mod);
#>import "/gen/<#=mod#>/graphql.ts";
<#
}
#>