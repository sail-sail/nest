<#
for (let i = 0; i < records.length; i++) {
  const record = records[i];
  const table_name = record.TABLE_NAME;
  if (!optTables[table_name]) continue;
  const table_nameUp = table_name.substring(0, 1).toUpperCase() + table_name.substring(1);
  let table_comment = record.TABLE_COMMENT;
  if (table_comment.includes("[")) {
    table_comment = table_comment.substring(0, table_comment.indexOf("["));
  }
#>import "/gen/<#=table_name#>/<#=table_name#>.graphql.ts";
<#
}
#>