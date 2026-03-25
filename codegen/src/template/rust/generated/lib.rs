#![forbid(unsafe_code)]
#![recursion_limit = "512"]

pub mod common;<#
const mods = [ ];
for (let i = 0; i < allTables.length; i++) {
  const record = allTables[i];
  let table_name = record.TABLE_NAME;
  if (!optTables[table_name]) continue;
  const table_comment = record.TABLE_COMMENT;
  const mod = table_name.substring(0, table_name.indexOf("_"));
  table_name = table_name.substring(table_name.indexOf("_") + 1);
  const table_nameUp = table_name.substring(0, 1).toUpperCase() + table_name.substring(1);
  if (mods.includes(mod)) continue;
  mods.push(mod);
#>
pub mod <#=mod#>;<#
}
#>

use async_graphql::MergedObject;

#[derive(MergedObject, Default)]
pub struct GenQuery(<#
  for (let i = 0; i < mods.length; i++) {
    const mod2 = mods[i];
    const mod2Up = mod2.substring(0, 1).toUpperCase() + mod2.substring(1);
  #>
  <#=mod2#>::<#=mod2Up#>Query,<#
  }
  #>
);

#[derive(MergedObject, Default)]
pub struct GenMutation(<#
  for (let i = 0; i < mods.length; i++) {
    const mod2 = mods[i];
    const mod2Up = mod2.substring(0, 1).toUpperCase() + mod2.substring(1);
  #>
  <#=mod2#>::<#=mod2Up#>Mutation,<#
  }
  #>
);
