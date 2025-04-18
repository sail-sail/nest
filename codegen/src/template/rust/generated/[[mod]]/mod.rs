<#
for (let i = 0; i < allTables.length; i++) {
  const record = allTables[i];
  let table_name = record.TABLE_NAME;
  if (!optTables[table_name]) continue;
  let table_comment = record.TABLE_COMMENT;
  if (table_comment.includes("[")) {
    table_comment = table_comment.substring(0, table_comment.indexOf("["));
  }
  const mod2 = table_name.substring(0, table_name.indexOf("_"));
  if (mod !== mod2) continue;
  table_name = table_name.substring(table_name.indexOf("_") + 1);
  const table_nameUp = table_name.substring(0, 1).toUpperCase() + table_name.substring(1);
  const table_nameUP = table_nameUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
#>pub mod <#=table_name#>;
<#
}
#>