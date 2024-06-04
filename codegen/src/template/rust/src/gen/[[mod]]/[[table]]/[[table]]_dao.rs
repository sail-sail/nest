<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasTenantId = columns.some((column) => column.COLUMN_NAME === "tenant_id");
const hasMany2manyNotInline = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const foreignKey = column.foreignKey;
  if (foreignKey && foreignKey.type === "many2many" && !column.inlineMany2manyTab) {
    return true;
  }
  return false;
});
const hasMany2many = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const foreignKey = column.foreignKey;
  if (foreignKey && foreignKey.type === "many2many") {
    return true;
  }
  return false;
});
const hasCreateTime = columns.some((column) => column.COLUMN_NAME === "create_time");
const hasIsMonth = columns.some((column) => column.isMonth);
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
const hasInlineForeignTabs = opts?.inlineForeignTabs && opts?.inlineForeignTabs.length > 0;
const inlineForeignTabs = opts?.inlineForeignTabs || [ ];
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const tableUP = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const hasDict = columns.some((column) => {
  if (column.ignoreCodegen) return false;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") return false;
  if (
    column_name === "tenant_id" ||
    column_name === "is_sys" ||
    column_name === "is_deleted" ||
    column_name === "is_hidden"
  ) return false;
  const column_comment = column.COLUMN_COMMENT || "";
  if (!column.dict) return false;
  return true;
});
const hasDictbiz = columns.some((column) => {
  if (column.ignoreCodegen) return false;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") return false;
  if (
    column_name === "tenant_id" ||
    column_name === "is_sys" ||
    column_name === "is_deleted" ||
    column_name === "is_hidden"
  ) return false;
  const column_comment = column.COLUMN_COMMENT || "";
  if (!column.dictbiz) return false;
  return true;
});
const hasDictModelLabel = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") return false;
  if (column_name === "is_sys") return false;
  if (column_name === "is_deleted") return false;
  if (column_name === "is_hidden") return false;
  const modelLabel = column.modelLabel;
  if (modelLabel) return false;
  return column.dict;
});
const hasDictbizModelLabel = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") return false;
  if (column_name === "is_sys") return false;
  if (column_name === "is_deleted") return false;
  if (column_name === "is_hidden") return false;
  const modelLabel = column.modelLabel;
  if (modelLabel) return false;
  return column.dictbiz;
});
const hasEncrypt = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  return !!column.isEncrypt;
});
#>#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

use anyhow::{Result,anyhow};
#[allow(unused_imports)]
use tracing::{info, error};<#
if (hasPassword) {
#>
use crate::common::auth::auth_dao::get_password;<#
}
#><#
if (hasIsMonth) {
#>
use chrono::Datelike;<#
}
#>
#[allow(unused_imports)]
use crate::common::util::string::*;<#
if (hasMany2manyNotInline) {
#>

use crate::common::util::dao::{
  many2many_update,
  ManyOpts,
};<#
}
#><#
if (hasEncrypt) {
#>

use crate::common::util::dao::encrypt;<#
}
#><#
if (hasDataPermit()) {
#>

#[allow(unused_imports)]
use crate::gen::base::data_permit::data_permit_model::{
  DataPermitType,
  DataPermitScope,
};
use crate::src::base::data_permit::data_permit_dao::get_data_permits;
#[allow(unused_imports)]
use crate::src::base::dept::dept_dao::{
  get_dept_ids,
  get_auth_dept_ids,
  get_parents_dept_ids,
  get_auth_and_parents_dept_ids,
};
use crate::src::base::role::role_dao::{
  get_role_ids,
  get_auth_role_ids,
};<#
}
#>

#[allow(unused_imports)]
use crate::common::context::{
  get_auth_id,
  get_auth_tenant_id,
  execute,
  query,
  query_one,
  get_now,
  get_req_id,
  QueryArgs,
  Options,
  FIND_ALL_IDS_LIMIT,
  CountModel,
  UniqueType,<#
  if (hasOrderBy) {
  #>
  OrderByModel,<#
  }
  #>
  get_short_uuid,
  get_order_by_query,
  get_page_query,
  del_caches,
  get_is_debug,
  get_silent_mode,
};

use crate::src::base::i18n::i18n_dao;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};<#
  if (hasDict) {
#>

use crate::src::base::dict_detail::dict_detail_dao::get_dict;<#
  }
#><#
  if (hasDictbiz) {
#>

use crate::src::base::dictbiz_detail::dictbiz_detail_dao::get_dictbiz;<#
  }
#>

use super::<#=table#>_model::*;<#
const findByIdTableUps = [ ];
const findOneTableUps = [ ];
const findAllTableUps = [ ];
const createTableUps = [ ];
const deleteByIdsTableUps = [ ];
const revertByIdsTableUps = [ ];
const updateByIdTableUps = [ ];
const forceDeleteByIdsUps = [ ];
const equalsByUniqueTableUps = [ ];
for (const inlineForeignTab of inlineForeignTabs) {
  const table = inlineForeignTab.table;
  const mod = inlineForeignTab.mod;
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  if (
    findAllTableUps.includes(Table_Up) &&
    createTableUps.includes(Table_Up) &&
    deleteByIdsTableUps.includes(Table_Up) &&
    revertByIdsTableUps.includes(Table_Up) &&
    updateByIdTableUps.includes(Table_Up) &&
    forceDeleteByIdsUps.includes(Table_Up)
  ) {
    continue;
  }
  const hasFindAllTableUps = findAllTableUps.includes(Table_Up);
  if (!hasFindAllTableUps) {
    findAllTableUps.push(Table_Up);
  }
  const hasCreateTableUps = createTableUps.includes(Table_Up);
  if (!hasCreateTableUps) {
    createTableUps.push(Table_Up);
  }
  const hasDeleteByIdsTableUps = deleteByIdsTableUps.includes(Table_Up);
  if (!hasDeleteByIdsTableUps) {
    deleteByIdsTableUps.push(Table_Up);
  }
  const hasRevertByIdsTableUps = revertByIdsTableUps.includes(Table_Up);
  if (!hasRevertByIdsTableUps) {
    revertByIdsTableUps.push(Table_Up);
  }
  const hasUpdateByIdTableUps = updateByIdTableUps.includes(Table_Up);
  if (!hasUpdateByIdTableUps) {
    updateByIdTableUps.push(Table_Up);
  }
  const hasForceDeleteByIdsUps = forceDeleteByIdsUps.includes(Table_Up);
  if (!hasForceDeleteByIdsUps) {
    forceDeleteByIdsUps.push(Table_Up);
  }
#>

// <#=inlineForeignTab.label#>
use crate::gen::<#=mod#>::<#=table#>::<#=table#>_dao::{<#
  if (!hasFindAllTableUps) {
  #>
  find_all as find_all_<#=table#>,<#
  }
  #><#
  if (!hasCreateTableUps) {
  #>
  create as create_<#=table#>,<#
  }
  #><#
  if (!hasDeleteByIdsTableUps) {
  #>
  delete_by_ids as delete_by_ids_<#=table#>,<#
  }
  #><#
  if (!hasRevertByIdsTableUps) {
  #>
  revert_by_ids as revert_by_ids_<#=table#>,<#
  }
  #><#
  if (!hasUpdateByIdTableUps) {
  #>
  update_by_id as update_by_id_<#=table#>,<#
  }
  #><#
  if (!hasForceDeleteByIdsUps) {
  #>
  force_delete_by_ids as force_delete_by_ids_<#=table#>,<#
  }
  #>
};<#
}
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const column_name = column.COLUMN_NAME;
  const table_comment = column.COLUMN_COMMENT;
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
  if (
    findAllTableUps.includes(Table_Up) &&
    createTableUps.includes(Table_Up) &&
    deleteByIdsTableUps.includes(Table_Up) &&
    revertByIdsTableUps.includes(Table_Up) &&
    updateByIdTableUps.includes(Table_Up) &&
    forceDeleteByIdsUps.includes(Table_Up) &&
    equalsByUniqueTableUps.includes(Table_Up)
  ) {
    continue;
  }
  const hasFindAllTableUps = findAllTableUps.includes(Table_Up);
  if (!hasFindAllTableUps) {
    findAllTableUps.push(Table_Up);
  }
  const hasCreateTableUps = createTableUps.includes(Table_Up);
  if (!hasCreateTableUps) {
    createTableUps.push(Table_Up);
  }
  const hasDeleteByIdsTableUps = deleteByIdsTableUps.includes(Table_Up);
  if (!hasDeleteByIdsTableUps) {
    deleteByIdsTableUps.push(Table_Up);
  }
  const hasRevertByIdsTableUps = revertByIdsTableUps.includes(Table_Up);
  if (!hasRevertByIdsTableUps) {
    revertByIdsTableUps.push(Table_Up);
  }
  const hasUpdateByIdTableUps = updateByIdTableUps.includes(Table_Up);
  if (!hasUpdateByIdTableUps) {
    updateByIdTableUps.push(Table_Up);
  }
  const hasForceDeleteByIdsUps = forceDeleteByIdsUps.includes(Table_Up);
  if (!hasForceDeleteByIdsUps) {
    forceDeleteByIdsUps.push(Table_Up);
  }
  const hasEqualsByUniqueTableUps = equalsByUniqueTableUps.includes(Table_Up);
  if (!hasEqualsByUniqueTableUps) {
    equalsByUniqueTableUps.push(Table_Up);
  }
#>

// <#=table_comment#>
use crate::gen::<#=mod#>::<#=table#>::<#=table#>_dao::{<#
  if (!hasFindAllTableUps) {
  #>
  find_all as find_all_<#=table#>,<#
  }
  #><#
  if (!hasCreateTableUps) {
  #>
  create as create_<#=table#>,<#
  }
  #><#
  if (!hasDeleteByIdsTableUps) {
  #>
  delete_by_ids as delete_by_ids_<#=table#>,<#
  }
  #><#
  if (!hasRevertByIdsTableUps) {
  #>
  revert_by_ids as revert_by_ids_<#=table#>,<#
  }
  #><#
  if (!hasUpdateByIdTableUps) {
  #>
  update_by_id as update_by_id_<#=table#>,<#
  }
  #><#
  if (!hasForceDeleteByIdsUps) {
  #>
  force_delete_by_ids as force_delete_by_ids_<#=table#>,<#
  }
  #><#
  if (!hasEqualsByUniqueTableUps) {
  #>
  equals_by_unique as equals_by_unique_<#=table#>,<#
  }
  #>
};<#
}
#><#

// 已经导入的ID列表
const modelIds = [ ];
modelIds.push(Table_Up + "Id");
#><#
const modelTableUps = [ ];
for (const inlineForeignTab of inlineForeignTabs) {
  const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
  if (!inlineForeignSchema) {
    throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
    process.exit(1);
  }
  const table = inlineForeignTab.table;
  const mod = inlineForeignTab.mod;
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const hasModelTableUps = modelTableUps.includes(Table_Up);
  if (hasModelTableUps) {
    continue;
  }
  modelTableUps.push(Table_Up);
  const modelId = Table_Up + "ID";
  modelIds.push(modelId);
#>

// <#=inlineForeignTab.label#>
use crate::gen::<#=mod#>::<#=table#>::<#=table#>_model::*;<#
}
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const column_name = column.COLUMN_NAME;
  const table_comment = column.COLUMN_COMMENT;
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
  const hasModelTableUps = modelTableUps.includes(Table_Up);
  if (hasModelTableUps) {
    continue;
  }
  modelTableUps.push(Table_Up);
  const modelId = Table_Up + "ID";
  modelIds.push(modelId);
#>

// <#=table_comment#>
use crate::gen::<#=mod#>::<#=table#>::<#=table#>_model::*;<#
}
#><#
if (hasTenantId && !modelIds.includes("TenantId")) {
#>

use crate::gen::base::tenant::tenant_model::TenantId;<#
modelIds.push("TenantId");
#><#
}
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.isVirtual) continue;
  const column_name = column.COLUMN_NAME;
  if (
    column_name === "tenant_id" ||
    column_name === "is_sys" ||
    column_name === "is_deleted" ||
    column_name === "is_hidden"
  ) continue;
  const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
  if (column_name === 'id') continue;
  const data_type = column.DATA_TYPE;
  const column_type = column.COLUMN_TYPE?.toLowerCase() || "";
  const column_comment = column.COLUMN_COMMENT || "";
  const foreignKey = column.foreignKey;
  if (!foreignKey) {
    continue;
  }
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const foreignTable_Up = foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
  if (!foreignSchema) {
    throw `表: ${ mod }_${ table } 的外键 ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
    process.exit(1);
  }
  const modelId = foreignTable_Up + "Id";
  if (modelIds.includes(modelId)) {
    continue;
  }
  modelIds.push(modelId);
#>
use crate::gen::<#=foreignKey.mod#>::<#=foreignTable#>::<#=foreignTable#>_model::<#=modelId#>;<#
}
#><#
if (
  (
    (hasCreateUsrId && hasCreateUsrIdLbl)
    || (hasUpdateUsrId && hasUpdateUsrIdLbl)
  )
  && !findByIdTableUps.includes(Table_Up)
) {
  const hasFindByIdTableUps = findByIdTableUps.includes(Table_Up);
  if (!hasFindByIdTableUps) {
    findByIdTableUps.push(Table_Up);
  }
#>

use crate::gen::base::usr::usr_dao::find_by_id as find_by_id_usr;<#
}
#>

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&<#=tableUP#>Search>,
  options: Option<&Options>,
) -> Result<String> {<#
  if (hasIsDeleted) {
  #>
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);<#
  }
  #><#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let data_permit_models = get_data_permits(
    get_route_path(),
    options,
  ).await?;
  let has_create_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Create);
  let has_role_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Role);
  let has_dept_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Dept);
  let has_dept_parent_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::DeptParent);
  let has_tenant_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Tenant);<#
  }
  #>
  let mut where_query = String::with_capacity(80 * <#=columns.length#> * 2);<#
  if (hasIsDeleted) {
  #>
  where_query.push_str(" t.is_deleted=?");
  args.push(is_deleted.into());<#
  }
  #>
  {
    let id = match search {
      Some(item) => item.id.as_ref(),
      None => None,
    };
    if let Some(id) = id {
      where_query.push_str(" and t.id=?");
      args.push(id.into());
    }
  }
  {
    let ids: Option<Vec<<#=Table_Up#>Id>> = match search {
      Some(item) => item.ids.clone(),
      None => None,
    };
    if let Some(ids) = ids {
      let arg = {
        if ids.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(ids.len());
          for id in ids {
            args.push(id.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  if !has_tenant_permit && !has_dept_permit && !has_role_permit && has_create_permit {
    let usr_id = get_auth_id().unwrap_or_default();
    where_query.push_str(" and t.create_usr_id=?");
    args.push(usr_id.into());
  } else if !has_tenant_permit && has_dept_parent_permit {
    let dept_ids = get_auth_and_parents_dept_ids().await?;
    let arg = {
      if dept_ids.is_empty() {
        "null".to_string()
      } else {
        let mut items = Vec::with_capacity(dept_ids.len());
        for dept_id in dept_ids {
          args.push(dept_id.into());
          items.push("?");
        }
        items.join(",")
      }
    };
    where_query.push_str(" and _permit_usr_dept_.dept_id in (");
    where_query.push_str(&arg);
    where_query.push(')');
  }
  if !has_tenant_permit && has_dept_parent_permit {
    let role_ids = get_auth_role_ids().await?;
    let arg = {
      if role_ids.is_empty() {
        "null".to_string()
      } else {
        let mut items = Vec::with_capacity(role_ids.len());
        for role_id in role_ids {
          args.push(role_id.into());
          items.push("?");
        }
        items.join(",")
      }
    };
    where_query.push_str(" and _permit_usr_role_.role_id in (");
    where_query.push_str(&arg);
    where_query.push(')');
  }<#
  }
  #><#
    if (hasTenantId) {
  #>
  {
    let tenant_id = {
      let tenant_id = match search {
        Some(item) => item.tenant_id.clone(),
        None => None,
      };
      let tenant_id = match tenant_id {
        None => get_auth_tenant_id(),
        Some(item) => match item.as_str() {
          "-" => None,
          _ => item.into(),
        },
      };
      tenant_id
    };
    if let Some(tenant_id) = tenant_id {
      where_query.push_str(" and t.tenant_id=?");
      args.push(tenant_id.into());
    }
  }<#
    }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === 'id') continue;
    if (
      column_name === "tenant_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted"
    ) continue;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME); 
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE?.toLowerCase() || "";
    const column_comment = column.COLUMN_COMMENT || "";
    const isPassword = column.isPassword;
    if (isPassword) {
      continue;
    }
    if (column.isEncrypt) {
      continue;
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const modelLabel = column.modelLabel;
    const modelLabel_rust = rustKeyEscape(modelLabel);
    let is_nullable = column.IS_NULLABLE === "YES";
    let _data_type = "String";
    if (foreignKey && foreignKey.multiple) {
      _data_type = `Vec<${ foreignTable_Up }Id>`;
      is_nullable = true;
    } else if (foreignKey && !foreignKey.multiple) {
      _data_type = `${ foreignTable_Up }Id`;
    } else if (data_type === 'varchar') {
      _data_type = 'String';
    } else if (data_type === 'date') {
      _data_type = "chrono::NaiveDate";
    } else if (data_type === 'datetime') {
      _data_type = "chrono::NaiveDateTime";
    } else if (data_type === 'time') {
      _data_type = "chrono::NaiveTime";
    } else if (data_type === 'int' && !column_type.endsWith("unsigned")) {
      _data_type = 'i32';
    } else if (data_type === 'int' && column_type.endsWith("unsigned")) {
      _data_type = 'u32';
    } else if (data_type === 'json') {
      _data_type = 'String';
    } else if (data_type === 'text') {
      _data_type = 'String';
    } else if (data_type === 'tinyint' && !column_type.endsWith("unsigned")) {
      _data_type = 'i8';
    } else if (data_type === 'tinyint' && column_type.endsWith("unsigned")) {
      _data_type = 'u8';
    } else if (data_type === 'decimal') {
      _data_type = "rust_decimal::Decimal";
    }
  #><#
    if ([
      "is_hidden",
      "is_sys",
    ].includes(column_name)) {
  #>
  // <#=column_comment#>
  {
    let <#=column_name_rust#>: Option<Vec<<#=_data_type#>>> = match search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => Default::default(),
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      let arg = {
        if <#=column_name_rust#>.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(<#=column_name_rust#>.len());
          for item in <#=column_name_rust#> {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.<#=column_name#> in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }<#
    } else if (foreignKey && foreignKey.type !== "many2many") {
  #>
  // <#=column_comment#>
  {
    let <#=column_name_rust#>: Option<Vec<<#=foreignTable_Up#>Id>> = match search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      let arg = {
        if <#=column_name_rust#>.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(<#=column_name_rust#>.len());
          for item in <#=column_name_rust#> {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.<#=column_name#> in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let <#=column_name#>_is_null: bool = match search {
      Some(item) => item.<#=column_name#>_is_null.unwrap_or(false),
      None => false,
    };
    if <#=column_name#>_is_null {
      where_query.push_str(" and t.<#=column_name#> is null");
    }
  }<#
    if (modelLabel) {
  #>
  {
    let <#=modelLabel_rust#>: Option<Vec<String>> = match search {
      Some(item) => item.<#=modelLabel_rust#>.clone(),
      None => None,
    };
    if let Some(<#=modelLabel_rust#>) = <#=modelLabel_rust#> {
      let arg = {
        if <#=modelLabel_rust#>.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(<#=modelLabel_rust#>.len());
          for item in <#=modelLabel_rust#> {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.<#=modelLabel#> in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }<#
    }
  #><#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #>
  // <#=column_comment#>
  {
    let <#=column_name_rust#>: Option<Vec<<#=foreignTable_Up#>Id>> = match search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      let arg = {
        if <#=column_name_rust#>.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(<#=column_name_rust#>.len());
          for item in <#=column_name_rust#> {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and <#=foreignKey.mod#>_<#=foreignKey.table#>.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let <#=column_name#>_is_null: bool = match search {
      Some(item) => item.<#=column_name#>_is_null.unwrap_or(false),
      None => false,
    };
    if <#=column_name#>_is_null {
      where_query.push_str(" and t.<#=column_name#> is null");
    }
  }<#
    } else if (column.dict || column.dictbiz) {
      const columnDictModels = [
        ...dictModels.filter(function(item) {
          return item.code === column.dict || item.code === column.dict;
        }),
        ...dictbizModels.filter(function(item) {
          return item.code === column.dict || item.code === column.dictbiz;
        }),
      ];
      let enumColumnName = _data_type;
      if (![ "int", "decimal", "tinyint" ].includes(data_type) && columnDictModels.length > 0) {
        let Column_Up = column_name.substring(0, 1).toUpperCase()+column_name.substring(1);
        Column_Up = Column_Up.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
        enumColumnName = Table_Up + Column_Up;
      }
  #>
  // <#=column_comment#>
  {
    let <#=column_name_rust#>: Option<Vec<<#=enumColumnName#>>> = match search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      let arg = {
        if <#=column_name_rust#>.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(<#=column_name_rust#>.len());
          for item in <#=column_name_rust#> {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.<#=column_name#> in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }<#
    } else if (data_type === "int" && column_name.startsWith("is_")) {
  #>
  // <#=column_comment#>
  {
    let <#=column_name_rust#> = match search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      where_query.push_str(" and t.<#=column_name#>=?");
      args.push(<#=column_name_rust#>.into());
    }
  }<#
    } else if (data_type === "int" || data_type === "decimal" || data_type === "double" || data_type === "datetime" || data_type === "date") {
  #>
  // <#=column_comment#>
  {
    let mut <#=column_name_rust#> = match search {
      Some(item) => item.<#=column_name_rust#>.unwrap_or_default(),
      None => Default::default(),
    };
    let <#=column_name#>_gt = <#=column_name_rust#>[0].take();
    let <#=column_name#>_lt = <#=column_name_rust#>[1].take();
    if let Some(<#=column_name#>_gt) = <#=column_name#>_gt {
      where_query.push_str(" and t.<#=column_name#> >= ?");
      args.push(<#=column_name#>_gt.into());
    }
    if let Some(<#=column_name#>_lt) = <#=column_name#>_lt {
      where_query.push_str(" and t.<#=column_name#> <= ?");
      args.push(<#=column_name#>_lt.into());
    }
  }<#
    } else if (data_type === "tinyint") {
  #>
  // <#=column_comment#>
  {
    let <#=column_name_rust#> = search.<#=column_name_rust#>;
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      where_query.push_str(" and t.<#=column_name#> = ?");
      args.push(<#=column_name_rust#>.into());
    }
  }<#
    } else if (data_type === "varchar" || data_type === "text") {
  #>
  // <#=column_comment#>
  {
    let <#=column_name_rust#> = match search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      where_query.push_str(" and t.<#=column_name#> = ?");
      args.push(<#=column_name_rust#>.into());
    }
    let <#=column_name#>_like = match search {
      Some(item) => item.<#=column_name#>_like.clone(),
      None => None,
    };
    if let Some(<#=column_name#>_like) = <#=column_name#>_like {
      where_query.push_str(" and t.<#=column_name#> like ?");
      args.push(format!("%{}%", sql_like(&<#=column_name#>_like)).into());
    }
  }<#
    } else {
  #>
  // <#=column_comment#>
  {
    let <#=column_name_rust#> = match search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      where_query.push_str(" and t.<#=column_name#> = ?");
      args.push(<#=column_name_rust#>.into());
    }
  }<#
    }
  #><#
  }
  #>
  Ok(where_query)
}

#[allow(unused_variables)]
async fn get_from_query(
  args: &mut QueryArgs,
  search: Option<&<#=tableUP#>Search>,
  options: Option<&Options>,
) -> Result<String> {<#
  if (hasIsDeleted && hasMany2many) {
  #>
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);<#
  }
  #><#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  let data_permit_models = get_data_permits(
    get_route_path(),
    options,
  ).await?;
  let has_create_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Create);
  let has_role_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Role);
  let has_dept_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Dept || item.scope == DataPermitScope::DeptParent);
  let has_tenant_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Tenant);<#
  }
  #>
  let<#
  if (hasDataPermit() && hasCreateUsrId) {
  #> mut<#
  }
  #> from_query = r#"<#=mod#>_<#=table#> t<#
  let fromQueryIsDeletedNum = 0;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const foreignKey = column.foreignKey;
    let data_type = column.DATA_TYPE;
    if (!foreignKey) continue;
    const foreignTable = foreignKey.table;
    const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
    const modelLabel = column.modelLabel;
    let cascade_fields = foreignKey.cascade_fields || [ ];
    if (foreignKey.lbl && cascade_fields.includes(foreignKey.lbl) && !modelLabel) {
      cascade_fields = cascade_fields.filter((item) => item !== foreignKey.lbl);
    }
  #><#
    if (foreignKey.type === "many2many") {
  #>
  left join <#=many2many.mod#>_<#=many2many.table#> on <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column1#>=t.id<#
    if (hasIsDeleted) {
      fromQueryIsDeletedNum++;
    #> and <#=many2many.mod#>_<#=many2many.table#>.is_deleted=?<#
    }
    #>
  left join <#=foreignKey.mod#>_<#=foreignTable#> on <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column2#>=<#=foreignKey.mod#>_<#=foreignTable#>.<#=foreignKey.column#><#
    if (hasIsDeleted) {
      fromQueryIsDeletedNum++;
    #> and <#=foreignKey.mod#>_<#=foreignTable#>.is_deleted=?<#
    }
    #>
  left join (select json_objectagg(<#=many2many.mod#>_<#=many2many.table#>.order_by,<#=foreignKey.mod#>_<#=foreignTable#>.id) <#=column_name#>,<#
    if (foreignKey.lbl && !modelLabel) {
  #>
  json_objectagg(<#=many2many.mod#>_<#=many2many.table#>.order_by,<#=foreignKey.mod#>_<#=foreignTable#>.<#=foreignKey.lbl#>) <#=column_name#>_lbl,<#
    }
  #><#
    for (let j = 0; j < cascade_fields.length; j++) {
      const cascade_field = cascade_fields[j];
  #>
  json_objectagg(<#=many2many.mod#>_<#=many2many.table#>.order_by,<#=foreignKey.mod#>_<#=foreignTable#>.<#=cascade_field#>) <#=column_name#>_<#=cascade_field#>,<#
    }
  #>
  <#=mod#>_<#=table#>.id <#=many2many.column1#> from <#=foreignKey.mod#>_<#=many2many.table#>
  inner join <#=foreignKey.mod#>_<#=foreignKey.table#> on <#=foreignKey.mod#>_<#=foreignKey.table#>.<#=foreignKey.column#>=<#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column2#>
  inner join <#=mod#>_<#=table#> on <#=mod#>_<#=table#>.id=<#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column1#><#
  if (hasIsDeleted) {
    fromQueryIsDeletedNum++;
  #> where <#=many2many.mod#>_<#=many2many.table#>.is_deleted=?<#
  }
  #>
  group by <#=many2many.column1#>) _<#=foreignTable#> on _<#=foreignTable#>.<#=many2many.column1#>=t.id<#
    } else if (foreignKey && !foreignKey.multiple) {
      if (modelLabel) {
        continue;
      }
  #>
  left join <#=foreignKey.mod#>_<#=foreignTable#> <#=column_name#>_lbl on <#=column_name#>_lbl.<#=foreignKey.column#>=t.<#=column_name#><#
    }
  #><#
  }
  #>"#.to_owned();<#
  if (hasIsDeleted && hasMany2many) {
    for (let i = 0; i < fromQueryIsDeletedNum; i++) {
  #>
  args.push(is_deleted.into());<#
    }
  }
  #><#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  if !has_tenant_permit && has_dept_permit {
    from_query += r#" left join base_usr_dept _permit_usr_dept_ on _permit_usr_dept_.usr_id=t.create_usr_id"#;
  }
  if !has_tenant_permit && has_role_permit {
    from_query += r#" left join base_usr_role _permit_usr_role_ on _permit_usr_role_.usr_id=t.create_usr_id"#;
  }<#
  }
  #>
  Ok(from_query)
}

/// 根据搜索条件和分页查找<#=table_comment#>列表
#[allow(unused_mut)]
pub async fn find_all(
  search: Option<<#=tableUP#>Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_all";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(page) = &page {
      msg += &format!(" page: {:?}", &page);
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
    if search.ids.is_some() && search.ids.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === 'id') continue;
    if (
      column_name === "tenant_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted"
    ) continue;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME); 
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE?.toLowerCase() || "";
    const column_comment = column.COLUMN_COMMENT || "";
    const isPassword = column.isPassword;
    if (isPassword) {
      continue;
    }
    if (column.isEncrypt) {
      continue;
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #><#
    if (
      [
        "is_hidden",
        "is_sys",
      ].includes(column_name)
      || foreignKey
      || column.dict || column.dictbiz
    ) {
  #>
  // <#=column_comment#>
  if let Some(search) = &search {
    if search.<#=column_name_rust#>.is_some() {
      let len = search.<#=column_name_rust#>.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(anyhow!("search.<#=column_name#>.length > {ids_limit}"));
      }
    }
  }<#
    }
  #><#
  }
  #>
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);<#
  if (hasIsDeleted) {
  #>
  
  #[allow(unused_variables)]
  let is_deleted = search.as_ref()
    .and_then(|item| item.is_deleted);<#
  }
  #>
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let mut sort = sort.unwrap_or_default();<#
  if (opts?.defaultSort) {
    const prop = opts?.defaultSort.prop;
    let order = "asc";
    if (opts?.defaultSort.order === "ascending") {
      order = "asc";
    } else if (opts?.defaultSort.order === "descending") {
      order = "desc";
    }
  #>
  
  if !sort.iter().any(|item| item.prop == "<#=prop#>") {
    sort.push(SortInput {
      prop: "<#=prop#>".into(),
      order: "<#=order#>".into(),
    });
  }<#
  }
  #><#
  if (hasCreateTime && opts?.defaultSort.prop !== "create_time") {
  #>
  
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: "asc".into(),
    });
  }<#
  }
  #>
  
  let sort = sort.into();
  
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const foreignKey = column.foreignKey;
    let data_type = column.DATA_TYPE;
    if (!foreignKey) continue;
    const foreignTable = foreignKey.table;
    const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
    let modelLabel = column.modelLabel;
    let cascade_fields = [ ];
    if (foreignKey) {
      cascade_fields = foreignKey.cascade_fields || [ ];
      if (foreignKey.lbl && cascade_fields.includes(foreignKey.lbl) && !modelLabel) {
        cascade_fields = cascade_fields.filter((item) => item !== column_name + "_" + foreignKey.lbl);
      } else if (modelLabel) {
        cascade_fields = cascade_fields.filter((item) => item !== modelLabel);
      }
    }
    if (foreignKey && foreignKey.lbl && !modelLabel) {
      modelLabel = column_name + "_" + foreignKey.lbl;
    } else if (!foreignKey && !modelLabel) {
      modelLabel = column_name + "_lbl";
    }
    let hasModelLabel = !!column.modelLabel;
    if (column.dict || column.dictbiz || data_type === "date" || data_type === "datetime") {
      hasModelLabel = true;
    } else if (foreignKey && foreignKey.lbl) {
      hasModelLabel = true;
    }
  #><#
    if (foreignKey.type === "many2many") {
  #>
  ,max(<#=column_name#>) <#=column_name#><#
    if (!column.modelLabel && modelLabel) {
  #>
  ,max(<#=modelLabel#>) <#=modelLabel#><#
    }
  #><#
    for (let j = 0; j < cascade_fields.length; j++) {
      const cascade_field = cascade_fields[j];
  #>
  ,max(<#=column_name#>_<#=cascade_field#>) <#=column_name#>_<#=cascade_field#><#
    }
  #><#
  } else {
  #><#
    if (!column.modelLabel && foreignKey.lbl) {
  #>
  ,<#=column_name#>_lbl.<#=foreignKey.lbl#> <#=modelLabel#><#
    }
  #><#
    for (let j = 0; j < cascade_fields.length; j++) {
      const cascade_field = cascade_fields[j];
  #>
  ,max(<#=column_name#>_<#=cascade_field#>) <#=column_name#>_<#=cascade_field#><#
    }
  #><#
  }
  #><#
  }
  #>
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);<#
  if (cache) {
  #>
  
  let options = options.set_cache_key(table, &sql, &args);<#
  }
  #>
  
  let options = options.into();
  
  let mut res: Vec<<#=tableUP#>Model> = query(
    sql,
    args,
    options,
  ).await?;<#
    if (hasDictModelLabel) {
  #>
  
  let dict_vec = get_dict(&[<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (
      column_name === "tenant_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    const column_comment = column.COLUMN_COMMENT || "";
    if (!column.dict) continue;
    const modelLabel = column.modelLabel;
    if (modelLabel) continue;
  #>
    "<#=column.dict#>",<#
  }
  #>
  ]).await?;
  let [<#
    let dictNum = 0;
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (
        column_name === "tenant_id" ||
        column_name === "is_sys" ||
        column_name === "is_deleted" ||
        column_name === "is_hidden"
      ) continue;
      const column_comment = column.COLUMN_COMMENT || "";
      if (!column.dict) continue;
      const modelLabel = column.modelLabel;
    if (modelLabel) continue;
    #>
    <#=column_name#>_dict,<#
      dictNum++;
    }
    #>
  ]: [Vec<_>; <#=dictNum#>] = dict_vec
    .try_into()
    .map_err(|err| anyhow!("{:#?}", err))?;<#
    }
  #><#
    if (hasDictbizModelLabel) {
  #>
  
  let dictbiz_vec = get_dictbiz(&[<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (
      column_name === "tenant_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    const column_comment = column.COLUMN_COMMENT || "";
    if (!column.dictbiz) continue;
    const modelLabel = column.modelLabel;
    if (modelLabel) continue;
  #>
    "<#=column.dictbiz#>",<#
  }
  #>
  ]).await?;
  let [<#
    let dictBizNum = 0;
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (
        column_name === "tenant_id" ||
        column_name === "is_sys" ||
        column_name === "is_deleted" ||
        column_name === "is_hidden"
      ) continue;
      const column_comment = column.COLUMN_COMMENT || "";
      if (!column.dictbiz) continue;
      const modelLabel = column.modelLabel;
      if (modelLabel) continue;
    #>
    <#=column_name#>_dict,<#
    dictBizNum++;
    }
    #>
  ]: [Vec<_>; <#=dictBizNum#>] = dictbiz_vec
    .try_into()
    .map_err(|err| anyhow!("{:#?}", err))?;<#
    }
  #><#
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    const inlineForeignTable = inlineForeignTab.table;
    const inlineForeignMod = inlineForeignTab.mod;
    const inlineForeignTableUp = inlineForeignTable.substring(0, 1).toUpperCase()+inlineForeignTable.substring(1);
    const inlineForeignTable_Up = inlineForeignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const inline_column_name = inlineForeignTab.column_name;
    const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
  #>
  
  // <#=inlineForeignTab.label#>
  let <#=inline_column_name#>_models = find_all_<#=inlineForeignTable#>(
    <#=inlineForeignTable_Up#>Search {
      <#=inlineForeignTab.column#>: res
        .iter()
        .map(|item| item.id.clone())
        .collect::<Vec<<#=Table_Up#>Id>>()
        .into(),<#
      if (hasIsDeleted) {
      #>
      is_deleted,<#
      }
      #>
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;<#
  }
  #><#
  const oldTable = table;
  const oldTableUp = tableUp;
  const oldTable_UP = Table_Up;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const table_comment = column.COLUMN_COMMENT;
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
      throw `表: ${ mod }_${ table } 的 inlineMany2manyTab 中的 ${ many2many.mod }_${ many2many.table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=table_comment#>
  let <#=column_name#>_<#=table#>_models = find_all_<#=table#>(
    <#=Table_Up#>Search {
      <#=many2many.column1#>: res
        .iter()
        .map(|item| item.id.clone())
        .collect::<Vec<<#=oldTable_UP#>Id>>()
        .into(),<#
      if (hasIsDeleted) {
      #>
      is_deleted,<#
      }
      #>
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;<#
  }
  #>
  
  #[allow(unused_variables)]
  for model in &mut res {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = rustKeyEscape(column.COLUMN_NAME);
      if (column_name === "id") continue;
      if (
        [
          "is_deleted",
          "is_sys",
          "is_hidden",
        ].includes(column_name)
      ) continue;
      const data_type = column.DATA_TYPE;
      const column_type = column.COLUMN_TYPE;
      const column_comment = column.COLUMN_COMMENT || "";
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
      const modelLabel = column.modelLabel;
      const isPassword = column.isPassword;
  #><#
    if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
      if (modelLabel) {
        continue;
      }
    #>
    
    // <#=column_comment#>
    model.<#=column_name#>_lbl = {
      <#=column_name#>_dict
        .iter()
        .find(|item| item.val == model.<#=column_name#>.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.<#=column_name#>.to_string())
    };<#
    } else if ((column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(data_type)) {
      if (modelLabel) {
        continue;
      }
    #>
    
    // <#=column_comment#>
    model.<#=column_name#>_lbl = {
      <#=column_name#>_dict
        .iter()
        .find(|item| item.val == model.<#=column_name#>.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.<#=column_name#>.to_string())
    };<#
    }
    #><#
    }
    #><#
    for (const inlineForeignTab of inlineForeignTabs) {
      const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
      const table = inlineForeignTab.table;
      const mod = inlineForeignTab.mod;
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const inline_column_name = inlineForeignTab.column_name;
      const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
    #><#
      if (inline_foreign_type === "one2many") {
    #>
    
    // <#=inlineForeignTab.label#>
    model.<#=inline_column_name#> = <#=inline_column_name#>_models
      .clone()
      .into_iter()
      .filter(|item|
        item.<#=inlineForeignTab.column#> == model.id
      )
      .collect();<#
    } else if (inline_foreign_type === "one2one") {
    #>
    
    // <#=inlineForeignTab.label#>
    model.<#=inline_column_name#> = <#=inline_column_name#>_models
      .clone()
      .into_iter()
      .filter(|item|
        item.<#=inlineForeignTab.column#> == model.id
      )
      .take(1)
      .collect::<Vec<_>>()
      .pop();<#
      }
    #><#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
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
        throw `表: ${ mod }_${ table } 的 inlineMany2manyTab 中的 ${ many2many.mod }_${ many2many.table } 不存在`;
        process.exit(1);
      }
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
    #>
    
    // <#=column_comment#>
    model.<#=column_name#>_<#=table#>_models = <#=column_name#>_<#=table#>_models.clone()
      .into_iter()
      .filter(|item|
        item.<#=many2many.column1#> == model.id
      )
      .collect::<Vec<_>>()
      .into();<#
    }
    #>
    
  }
  
  Ok(res)
}

/// 根据条件查找<#=table_comment#>总数
pub async fn find_count(
  search: Option<<#=tableUP#>Search>,
  options: Option<Options>,
) -> Result<i64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_count";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(0);
    }
    if search.ids.is_some() && search.ids.as_ref().unwrap().is_empty() {
      return Ok(0);
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"select count(1) total from(select 1 from {from_query} where {where_query} group by t.id) t"#);
  
  let args = args.into();<#
  if (cache) {
  #>
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();<#
  }
  #>
  
  let res: Option<CountModel> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  let total = res
    .map(|item| item.total)
    .unwrap_or_default();
  
  Ok(total)
}

/// 获取路由地址
pub fn get_route_path() -> String {
  "/<#=mod#>/<#=table#>".to_owned()
}

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path().into(),
  }
}

/// 获取<#=table_comment#>字段注释
pub async fn get_field_comments(
  _options: Option<Options>,
) -> Result<<#=tableUP#>FieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (
        column_name === "tenant_id" ||
        column_name === "is_sys" ||
        column_name === "is_deleted"
      ) continue;
      const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
      const data_type = column.DATA_TYPE;
      const column_type = column.COLUMN_TYPE;
      const column_comment = column.COLUMN_COMMENT || "";
      const isPassword = column.isPassword;
      if (isPassword) continue;
      const foreignKey = column.foreignKey;
      let modelLabel = column.modelLabel;
      let cascade_fields = [ ];
      if (foreignKey) {
        cascade_fields = foreignKey.cascade_fields || [ ];
        if (foreignKey.lbl && cascade_fields.includes(foreignKey.lbl) && !modelLabel) {
          cascade_fields = cascade_fields.filter((item) => item !== column_name + "_" + foreignKey.lbl);
        } else if (modelLabel) {
          cascade_fields = cascade_fields.filter((item) => item !== modelLabel);
        }
      }
      if (foreignKey && foreignKey.lbl && !modelLabel) {
        modelLabel = column_name + "_" + foreignKey.lbl;
      } else if (!foreignKey && !modelLabel) {
        modelLabel = column_name + "_lbl";
      }
      let hasModelLabel = !!column.modelLabel;
      if (column.dict || column.dictbiz || data_type === "date" || data_type === "datetime") {
        hasModelLabel = true;
      } else if (foreignKey && foreignKey.lbl) {
        hasModelLabel = true;
      }
    #><#
      if (foreignKey || column.dict || column.dictbiz) {
    #>
    "<#=column_comment#>".into(),<#
      if (!columns.some((item) => item.COLUMN_NAME === column_name + "_lbl")) {
    #>
    "<#=column_comment#>".into(),<#
      }
    #><#
      } else if (data_type === "datetime" || data_type === "date") {
    #>
    "<#=column_comment#>".into(),<#
      if (!columns.some((item) => item.COLUMN_NAME === column_name + "_lbl")) {
    #>
    "<#=column_comment#>".into(),<#
      }
    #><#
      } else {
    #>
    "<#=column_comment#>".into(),<#
      }
    #><#
    }
    #>
  ];
  
  let map = n_route.n_batch(
    i18n_code_maps.clone(),
  ).await?;
  
  let vec = i18n_code_maps.into_iter()
    .map(|item|
      map.get(&item.code)
        .map(|item| item.to_owned())
        .unwrap_or_default()
    )
    .collect::<Vec<String>>();
  
  let field_comments = <#=tableUP#>FieldComment {<#
    var num = -1;
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (
        column_name === "tenant_id" ||
        column_name === "is_sys" ||
        column_name === "is_deleted" ||
        column_name === "is_hidden"
      ) continue;
      const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
      const data_type = column.DATA_TYPE;
      const column_type = column.COLUMN_TYPE;
      const column_comment = column.COLUMN_COMMENT || "";
      const isPassword = column.isPassword;
      if (isPassword) continue;
      const foreignKey = column.foreignKey;
      let modelLabel = column.modelLabel;
      let cascade_fields = [ ];
      if (foreignKey) {
        cascade_fields = foreignKey.cascade_fields || [ ];
        if (foreignKey.lbl && cascade_fields.includes(foreignKey.lbl) && !modelLabel) {
          cascade_fields = cascade_fields.filter((item) => item !== column_name + "_" + foreignKey.lbl);
        } else if (modelLabel) {
          cascade_fields = cascade_fields.filter((item) => item !== modelLabel);
        }
      }
      if (foreignKey && foreignKey.lbl && !modelLabel) {
        modelLabel = column_name + "_" + foreignKey.lbl;
      } else if (!foreignKey && !modelLabel) {
        modelLabel = column_name + "_lbl";
      }
      let hasModelLabel = !!column.modelLabel;
      if (column.dict || column.dictbiz || data_type === "date" || data_type === "datetime") {
        hasModelLabel = true;
      } else if (foreignKey && foreignKey.lbl) {
        hasModelLabel = true;
      }
    #><#
      if (foreignKey || column.dict || column.dictbiz) {
        num++;
    #>
    <#=column_name_rust#>: vec[<#=String(num)#>].to_owned(),<#
        if (!columns.some((item) => item.COLUMN_NAME === column_name + "_lbl")) {
          num++;
    #>
    <#=column_name#>_lbl: vec[<#=String(num)#>].to_owned(),<#
        }
    #><#
      } else if (data_type === "datetime" || data_type === "date") {
        num++;
    #>
    <#=column_name_rust#>: vec[<#=String(num)#>].to_owned(),<#
        if (!columns.some((item) => item.COLUMN_NAME === column_name + "_lbl")) {
          num++;
    #>
    <#=column_name#>_lbl: vec[<#=String(num)#>].to_owned(),<#
        }
    #><#
      } else {
        num++;
    #>
    <#=column_name_rust#>: vec[<#=String(num)#>].to_owned(),<#
      }
    #><#
    }
    #>
  };
  Ok(field_comments)
}

/// 根据条件查找第一个<#=table_comment#>
pub async fn find_one(
  search: Option<<#=tableUP#>Search>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_one";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(None);
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
  let page = PageInput {
    pg_offset: 0.into(),
    pg_size: 1.into(),
  }.into();
  
  let res = find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<<#=tableUP#>Model> = res.into_iter().next();
  
  Ok(model)
}

/// 根据 id 查找<#=table_comment#>
pub async fn find_by_id(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_by_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if id.is_empty() {
    return Ok(None);
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
  let search = <#=tableUP#>Search {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = find_one(
    search,
    None,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 查找<#=table_comment#>
#[allow(dead_code)]
pub async fn find_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<Vec<<#=Table_Up#>Model>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(vec![]);
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
  let len = ids.len();
  
  let search = <#=Table_Up#>Search {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let models = find_all(
    search,
    None,
    None,
    options,
  ).await?;
  
  if models.len() != len {
    return Err(anyhow!("find_by_ids: models.length !== ids.length"));
  }
  
  let models = ids
    .into_iter()
    .map(|id| {
      let model = models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      Err(anyhow!("find_by_ids: id: {id} not found"))
    })
    .collect::<Result<Vec<<#=Table_Up#>Model>>>()?;
  
  Ok(models)
}

/// 根据搜索条件判断<#=table_comment#>是否存在
#[allow(dead_code)]
pub async fn exists(
  search: Option<<#=tableUP#>Search>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "exists";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
  let total = find_count(
    search,
    options,
  ).await?;
  
  Ok(total > 0)
}

/// 根据 id 判断<#=table_comment#>是否存在
#[allow(dead_code)]
pub async fn exists_by_id(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "exists_by_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
  let search = <#=tableUP#>Search {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = exists(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique(
  search: <#=tableUP#>Search,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_by_unique";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" search: {:?}", &search);
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
  if let Some(id) = search.id {
    let model = find_by_id(
      id,
      None,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }<#
  if (!opts.uniques || opts.uniques.length === 0) {
  #>
  
  Ok(vec![])<#
  } else {
  #>
  
  let mut models: Vec<<#=tableUP#>Model> = vec![];<#
  for (let i = 0; i < (opts.uniques || [ ]).length; i++) {
    const uniques = opts.uniques[i];
  #>
  
  let mut models_tmp = {
    if<#
      for (let k = 0; k < uniques.length; k++) {
        const unique = uniques[k];
        const unique_rust = rustKeyEscape(unique);
      #>
      search.<#=unique_rust#>.is_none()<#=k === (uniques.length - 1) ? "" : " ||"#><#
      }
      #>
    {
      return Ok(vec![]);
    }
    
    let search = <#=tableUP#>Search {<#
      for (let k = 0; k < uniques.length; k++) {
        const unique = uniques[k];
        const unique_rust = rustKeyEscape(unique);
      #>
      <#=unique_rust#>: search.<#=unique_rust#>.clone(),<#
      }
      #>
      ..Default::default()
    };
    
    find_all(
      search.into(),
      None,
      sort.clone(),
      options.clone(),
    ).await?
  };
  models.append(&mut models_tmp);<#
  }
  #>
  
  Ok(models)<#
  }
  #>
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
pub fn equals_by_unique(
  input: &<#=tableUP#>Input,
  model: &<#=tableUP#>Model,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }<#
  if (opts.uniques && opts.uniques.length > 0) {
  #><#
  for (let i = 0; i < (opts.uniques || [ ]).length; i++) {
    const uniques = opts.uniques[i];
  #>
  
  if<#
    for (let i = 0; i < uniques.length; i++) {
      const unique = uniques[i];
      const unique_rust = rustKeyEscape(unique);
    #>
    input.<#=unique_rust#>.as_ref().is_some() && input.<#=unique_rust#>.as_ref().unwrap() == &model.<#=unique_rust#><#
      if (i !== uniques.length - 1) {
    #> &&<#
      }
    #><#
    }
    #>
  {
    return true;
  }<#
  }
  #>
  false<#
  } else {
  #>
  false<#
  }
  #>
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique(
  input: <#=tableUP#>Input,
  model: <#=tableUP#>Model,
  options: Option<Options>,
) -> Result<Option<<#=Table_Up#>Id>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "check_by_unique";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {:?}", &input);
    msg += &format!(" model: {:?}", &model);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
  let is_equals = equals_by_unique(
    &input,
    &model,
  );
  if !is_equals {
    return Ok(None);
  }
  
  let unique_type = options
    .as_ref()
    .and_then(|item| item.get_unique_type())
    .unwrap_or_default();
  
  if unique_type == UniqueType::Ignore {
    return Ok(None);
  }
  if unique_type == UniqueType::Update {
    let id = update_by_id(
      model.id.clone(),
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let table_comment = i18n_dao::ns(
      "<#=table_comment#>".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "此 {0} 已经存在".to_owned(),
      map.into(),
    ).await?;
    return Err(anyhow!(err_msg));
  }
  Ok(None)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables)]
pub async fn set_id_by_lbl(
  input: <#=tableUP#>Input,
) -> Result<<#=tableUP#>Input> {
  
  #[allow(unused_mut)]
  let mut input = input;<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (
      [
        "id",
        "create_usr_id",
        "create_time",
        "update_usr_id",
        "update_time",
        "is_deleted",
        "is_sys",
        "is_hidden",
      ].includes(column_name)
    ) continue;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    let column_comment = column.COLUMN_COMMENT || "";
    const data_type = column.DATA_TYPE;
  #><#
    if (column.isMonth) {
  #>
  
  // <#=column_comment#>
  if input.<#=column_name_rust#>.is_none() {
    if let Some(<#=column_name#>_lbl) = input.<#=column_name#>_lbl.as_ref().filter(|s| !s.is_empty()) {
      input.<#=column_name_rust#> = chrono::NaiveDate::parse_from_str(<#=column_name#>_lbl, "%Y-%m-%d %H:%M:%S").ok();
      if input.<#=column_name_rust#>.is_none() {
        input.<#=column_name_rust#> = chrono::NaiveDate::parse_from_str(<#=column_name#>_lbl, "%Y-%m-%d").ok();
      }
      if input.<#=column_name_rust#>.is_none() {
        let field_comments = get_field_comments(
          None,
        ).await?;
        let column_comment = field_comments.<#=column_name_rust#>;
        
        let err_msg = i18n_dao::ns(
          "日期格式错误".to_owned(),
          None,
        ).await?;
        return Err(anyhow!("{column_comment} {err_msg}"));
      }
    }
  }
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    input.<#=column_name_rust#> = <#=column_name_rust#>.with_day(1);
  }<#
    } else if (data_type === "date") {
  #>
  
  // <#=column_comment#>
  if input.<#=column_name_rust#>.is_none() {
    if let Some(<#=column_name#>_lbl) = input.<#=column_name#>_lbl.as_ref().filter(|s| !s.is_empty()) {
      input.<#=column_name_rust#> = chrono::NaiveDate::parse_from_str(<#=column_name#>_lbl, "%Y-%m-%d %H:%M:%S").ok();
      if input.<#=column_name_rust#>.is_none() {
        input.<#=column_name_rust#> = chrono::NaiveDate::parse_from_str(<#=column_name#>_lbl, "%Y-%m-%d").ok();
      }
      if input.<#=column_name_rust#>.is_none() {
        let field_comments = get_field_comments(
          None,
        ).await?;
        let column_comment = field_comments.<#=column_name_rust#>;
        
        let err_msg = i18n_dao::ns(
          "日期格式错误".to_owned(),
          None,
        ).await?;
        return Err(anyhow!("{column_comment} {err_msg}"));
      }
    }
  }<#
    } else if (data_type === "datetime") {
  #>
  
  // <#=column_comment#>
  if input.<#=column_name_rust#>.is_none() {
    if let Some(<#=column_name#>_lbl) = input.<#=column_name#>_lbl.as_ref().filter(|s| !s.is_empty()) {
      input.<#=column_name_rust#> = chrono::NaiveDateTime::parse_from_str(<#=column_name#>_lbl, "%Y-%m-%d %H:%M:%S").ok();
      if input.<#=column_name_rust#>.is_none() {
        input.<#=column_name_rust#> = chrono::NaiveDateTime::parse_from_str(<#=column_name#>_lbl, "%Y-%m-%d").ok();
      }
      if input.<#=column_name_rust#>.is_none() {
        let field_comments = get_field_comments(
          None,
        ).await?;
        let column_comment = field_comments.<#=column_name_rust#>;
        
        let err_msg = i18n_dao::ns(
          "日期格式错误".to_owned(),
          None,
        ).await?;
        return Err(anyhow!("{column_comment} {err_msg}"));
      }
    }
  }<#
    }
  #><#
  }
  #><#
  let dictNumMap = { };
  let dictBizNumMap = { };
    if (hasDict) {
  #>
  
  let dict_vec = get_dict(&[<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (
      column_name === "tenant_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    const column_comment = column.COLUMN_COMMENT || "";
    if (!column.dict) continue;
  #>
    "<#=column.dict#>",<#
  }
  #>
  ]).await?;<#
  let dictNum = 0;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    if (column_name === "id") continue;
    if (
      column_name === "tenant_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    const column_comment = column.COLUMN_COMMENT || "";
    if (!column.dict) continue;
  #>
  
  // <#=column_comment#>
  if input.<#=column_name_rust#>.is_none() {
    let <#=column_name#>_dict = &dict_vec[<#=String(dictNum)#>];
    if let Some(<#=column_name#>_lbl) = input.<#=column_name#>_lbl.clone() {
      input.<#=column_name_rust#> = <#=column_name#>_dict
        .iter()
        .find(|item| {
          item.lbl == <#=column_name#>_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }<#
    dictNumMap[column_name] = dictNum.toString();
    dictNum++;
  }
  #><#
    }
  #><#
    if (hasDictbiz) {
  #>
  let dictbiz_vec = get_dictbiz(&[<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (
      column_name === "tenant_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    const column_comment = column.COLUMN_COMMENT || "";
    if (!column.dictbiz) continue;
  #>
    "<#=column.dictbiz#>",<#
  }
  #>
  ]).await?;<#
  let dictBizNum = 0;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (
      column_name === "tenant_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    const column_comment = column.COLUMN_COMMENT || "";
    if (!column.dictbiz) continue;
  #>
  
  // <#=column_comment#>
  if input.<#=column_name_rust#>.is_none() {
    let <#=column_name#>_dictbiz = &dictbiz_vec[<#=dictBizNum.toString()#>];
    if let Some(<#=column_name#>_lbl) = input.<#=column_name#>_lbl.clone() {
      input.<#=column_name_rust#> = <#=column_name#>_dictbiz
        .iter()
        .find(|item| {
          item.lbl == <#=column_name#>_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }<#
  dictBizNumMap[column_name] = dictBizNum.toString();
  dictBizNum++;
  }
  #><#
    }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if ([ "id", "create_usr_id", "create_time", "update_usr_id", "update_time" ].includes(column_name)) continue;
    if (
      column_name === "tenant_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    const column_name_rust = rustKeyEscape(column_name);
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    let foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    foreignTableUp = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const foreignTable_Up = foreignTableUp && foreignTableUp.substring(0, 1).toUpperCase()+foreignTableUp.substring(1);
    const many2many = column.many2many;
    const isPassword = column.isPassword;
    let daoStr = "";
    if (foreignKey && foreignTable) {
      if (foreignTable !== table) {
        daoStr = `crate::gen::${ foreignKey.mod }::${ foreignTable }::${ foreignTable }_dao::`;
      }
    }
  #><#
    if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple && foreignKey.lbl) {
  #>
  
  // <#=column_comment#>
  if input.<#=column_name#>_lbl.is_some()
    && !input.<#=column_name#>_lbl.as_ref().unwrap().is_empty()
    && input.<#=column_name_rust#>.is_none()
  {
    input.<#=column_name#>_lbl = input.<#=column_name#>_lbl.map(|item| 
      item.trim().to_owned()
    );<#
    if (foreignTableUp !== tableUP) {
    #>
    let model = <#=daoStr#>find_one(
      crate::gen::<#=foreignKey.mod#>::<#=foreignTable#>::<#=foreignTable#>_model::<#=foreignTableUp#>Search {
        <#=rustKeyEscape(foreignKey.lbl)#>: input.<#=column_name#>_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      None,
    ).await?;<#
    } else {
    #>
    let model = <#=daoStr#>find_one(
      <#=tableUP#>Search {
        <#=rustKeyEscape(foreignKey.lbl)#>: input.<#=column_name#>_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      None,
    ).await?;<#
    }
    #>
    if let Some(model) = model {
      input.<#=column_name_rust#> = model.id.into();
    }
  }<#
    } else if (foreignKey && (foreignKey.type === "many2many" || foreignKey.multiple) && foreignKey.lbl && !foreignKey.notSetIdByLbl) {
  #>
  
  // <#=column_comment#>
  if input.<#=column_name#>_lbl.is_some() && input.<#=column_name_rust#>.is_none() {
    input.<#=column_name_rust#>_lbl = input.<#=column_name_rust#>_lbl.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .filter(|item| !item.is_empty())
        .collect::<Vec<String>>()
    );
    input.<#=column_name_rust#>_lbl = input.<#=column_name_rust#>_lbl.map(|item| {
      let mut set = HashSet::new();
      item.into_iter()
        .filter(|item| set.insert(item.clone()))
        .collect::<Vec<String>>()
    });
    let mut models = vec![];
    for lbl in input.<#=column_name_rust#>_lbl.clone().unwrap_or_default() {
      let model = <#=daoStr#>find_one(
        crate::gen::<#=foreignKey.mod#>::<#=foreignTable#>::<#=foreignTable#>_model::<#=foreignTableUp#>Search {
          <#=foreignKey.lbl#>: lbl.into(),
          ..Default::default()
        }.into(),
        None,
        None,
      ).await?;
      if let Some(model) = model {
        models.push(model);
      }
    }
    input.<#=column_name_rust#> = models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<<#=foreignTable_Up#>Id>>()
      .into();
  }<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    const column_comment = column.COLUMN_COMMENT || "";
    const redundLbl = column.redundLbl;
    if (!redundLbl) {
      continue;
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    if (foreignTable) {
      continue;
    }
    const redundLblKeys = Object.keys(redundLbl);
    if (redundLblKeys.length === 0) {
      continue;
    }
  #><#
    if (column.dict) {
  #>
  
  // <#=column_comment#>
  if input.<#=column_name#>.is_some() {
    let <#=column_name#>_dict = &dict_vec[<#=dictNumMap[column_name]#>];
    let dict_model = <#=column_name#>_dict.iter().find(|item| {
      item.val.to_string() == input.<#=column_name#>.unwrap_or_default().to_string()
    });
    if let Some(dict_model) = dict_model {<#
      for (const key of redundLblKeys) {
        const val = redundLbl[key];
      #>
      input.<#=rustKeyEscape(val)#> = dict_model.<#=rustKeyEscape(key)#>.to_owned().into();<#
      }
      #>
    }
  }<#
    } else if (column.dictbiz) {
  #>
  
  // <#=column_comment#>
  if input.<#=column_name#>.is_some() {
    let <#=column_name#>_dict = &dict_vec[<#=dictBizNumMap[column_name]#>];
    let dictbiz_model = <#=column_name#>_dict.iter().find(|item| {
      item.val.to_string() == input.<#=column_name#>.unwrap_or_default().to_string()
    });
    if let Some(dictbiz_model) = dictbiz_model {<#
      for (const key of redundLblKeys) {
        const val = redundLbl[key];
      #>
      input.<#=rustKeyEscape(val)#> = dictbiz_model.<#=rustKeyEscape(key)#>.to_owned().into();<#
      }
      #>
    }
  }<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    const column_comment = column.COLUMN_COMMENT || "";
    const redundLbl = column.redundLbl;
    if (!redundLbl) {
      continue;
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    if (!foreignTable) {
      continue;
    }
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const redundLblKeys = Object.keys(redundLbl);
    if (redundLblKeys.length === 0) {
      continue;
    }
  #>
  
  // <#=column_comment#>
  if input.<#=column_name#>.is_some()
    && !input.<#=column_name#>.as_ref().unwrap().is_empty()
  {
    let find_by_id_<#=foreignTable#> = crate::gen::<#=foreignKey.mod#>::<#=foreignTable#>::<#=foreignTable#>_dao::find_by_id;
    let <#=foreignTable#>_model = find_by_id_<#=foreignTable#>(
      input.<#=column_name#>.clone().unwrap(),
      None,
    ).await?;
    if <#=foreignTable#>_model.is_some() {
      let <#=foreignTable#>_model = <#=foreignTable#>_model.unwrap();<#
      for (const key of redundLblKeys) {
        const val = redundLbl[key];
      #>
      input.<#=rustKeyEscape(val)#> = <#=foreignTable#>_model.<#=rustKeyEscape(key)#>.into();<#
      }
      #>
    }
  }<#
  }
  #>
  
  Ok(input)
}

/// 批量创建<#=table_comment#>
pub async fn creates(
  inputs: Vec<<#=tableUP#>Input>,
  options: Option<Options>,
) -> Result<Vec<<#=Table_Up#>Id>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "creates";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {:?}", &inputs);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids = _creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 批量创建<#=table_comment#>
#[allow(unused_variables)]
async fn _creates(
  inputs: Vec<<#=tableUP#>Input>,
  options: Option<Options>,
) -> Result<Vec<<#=Table_Up#>Id>> {
  
  let table = "<#=mod#>_<#=table#>";
  
  let silent_mode = get_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<<#=Table_Up#>Id> = vec![];
  let mut inputs2: Vec<<#=tableUP#>Input> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(anyhow!("Can not set id when create in dao: {table}"));
    }<#
    if (false) {
    #>
    
    validate(
      &input,
    )?;<#
    }
    #><#
    if (mod === "base" && table === "role") {
    #>
    
    let mut input = input;
    if input.menu_ids.is_some() {
      input.menu_ids = crate::src::base::tenant::tenant_dao::filter_menu_ids_by_tenant(
        input.menu_ids.unwrap(),
      ).await?.into();
    }
    let input = input;<#
    }
    #>
    
    let old_models = find_by_unique(
      input.clone().into(),
      None,
      None,
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<<#=Table_Up#>Id> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        let options = Some(options);
        
        id = check_by_unique(
          input.clone(),
          old_model,
          options,
        ).await?;
        
        if id.is_some() {
          break;
        }
      }
      if let Some(id) = id {
        ids2.push(id);
        continue;
      }
      inputs2.push(input);
    } else {
      inputs2.push(input);
    }
    
  }
  
  if inputs2.is_empty() {
    return Ok(ids2);
  }
    
  let mut args = QueryArgs::new();
  let mut sql_fields = String::with_capacity(80 * <#=columns.length#> + 20);
  
  sql_fields += "id";<#
  if (hasCreateTime) {
  #>
  sql_fields += ",create_time";<#
  }
  #><#
  if (hasUpdateTime) {
  #>
  sql_fields += ",update_time";<#
  }
  #><#
  if (hasCreateUsrId) {
  #>
  sql_fields += ",create_usr_id";<#
  }
  #><#
  if (hasCreateUsrIdLbl) {
  #>
  sql_fields += ",create_usr_id_lbl";<#
  }
  #><#
  if (hasUpdateUsrId) {
  #>
  sql_fields += ",update_usr_id";<#
  }
  #><#
  if (hasUpdateUsrIdLbl) {
  #>
  sql_fields += ",update_usr_id_lbl";<#
  }
  #><#
  if (hasTenantId) {
  #>
  sql_fields += ",tenant_id";<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    if (column_name === "id") continue;
    if (column_name === "create_usr_id") continue;
    if (column_name === "create_time") continue;
    if (column_name === "update_usr_id") continue;
    if (column_name === "update_time") continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
    const column_name_mysql = mysqlKeyEscape(column_name);
    const modelLabel = column.modelLabel;
    const isEncrypt = column.isEncrypt;
  #><#
    if (modelLabel) {
  #>
  // <#=column_comment#>
  sql_fields += ",<#=modelLabel#>";<#
    }
  #><#
    if (column.isPassword) {
  #>
  // <#=column_comment#>
  sql_fields += ",<#=column_name_mysql#>";<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else if (isEncrypt && [ "varchar", "text" ].includes(data_type)) {
  #>
  // <#=column_comment#>
  sql_fields += ",<#=column_name_mysql#>";<#
    } else if (isEncrypt && [ "decimal" ].includes(data_type)) {
  #>
  // <#=column_comment#>
  sql_fields += ",<#=column_name_mysql#>";<#
    } else if (isEncrypt && [ "int" ].includes(data_type)) {
  #>
  // <#=column_comment#>
  sql_fields += ",<#=column_name_mysql#>";<#
    } else {
  #>
  // <#=column_comment#>
  sql_fields += ",<#=column_name_mysql#>";<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    const column_comment = column.COLUMN_COMMENT || "";
    const redundLbl = column.redundLbl;
    if (!redundLbl) {
      continue;
    }
    const redundLblKeys = Object.keys(redundLbl);
    if (redundLblKeys.length === 0) {
      continue;
    }
  #><#
    for (const key of redundLblKeys) {
      const val = redundLbl[key];
  #>
  // <#=column_comment#>
  sql_fields += ",<#=val#>";<#
    }
  #><#
  }
  #>
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * <#=columns.length#> + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: <#=Table_Up#>Id = get_short_uuid().into();
    ids2.push(id.clone());
    
    inputs2_ids.push(id.clone());
    
    sql_values += "(?";
    args.push(id.into());<#
    if (hasCreateTime) {
    #>
    
    if !silent_mode {
      if let Some(create_time) = input.create_time {
        sql_values += ",?";
        args.push(create_time.into());
      } else if input.create_time_save_null == Some(true) {
        sql_values += ",null";
      } else {
        sql_values += ",?";
        args.push(get_now().into());
      }
    } else if let Some(create_time) = input.create_time {
      sql_values += ",?";
      args.push(create_time.into());
    } else {
      sql_values += ",null";
    }<#
    }
    #><#
    if (hasCreateUsrId && !hasCreateUsrIdLbl) {
    #>
    
    if !silent_mode {
      if let Some(create_usr_id) = input.create_usr_id {
        if create_usr_id.as_str() != "-" {
          sql_values += ",?";
          args.push(create_usr_id.into());
        } else {
          sql_values += ",default";
        }
      } else {
        let usr_id = get_auth_id();
        if let Some(usr_id) = usr_id {
          sql_values += ",?";
          args.push(usr_id.into());
        } else {
          sql_values += ",default";
        }
      }
    } else {
      if let Some(create_usr_id) = input.create_usr_id {
        sql_values += ",?";
        args.push(create_usr_id.into());
      } else {
        sql_values += ",default";
      }
    }<#
    } else if (hasCreateUsrId && hasCreateUsrIdLbl) {
    #>
    
    if !silent_mode {
      if input.create_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.clone().unwrap(),
            None,
          ).await?;
          if let Some(usr_model) = usr_model {
            usr_lbl = usr_model.lbl;
          } else {
            usr_id = None;
          }
        }
        if let Some(usr_id) = usr_id {
          sql_values += ",?";
          args.push(usr_id.into());
        } else {
          sql_values += ",default";
        }
        sql_values += ",?";
        args.push(usr_lbl.into());
      } else if input.create_usr_id.clone().unwrap().as_str() == "-" {
        sql_values += ",default";
        sql_values += ",default";
      } else {
        let mut usr_id = input.create_usr_id.clone();
        let mut usr_lbl = String::new();
        let usr_model = find_by_id_usr(
          usr_id.clone().unwrap(),
          None,
        ).await?;
        if let Some(usr_model) = usr_model {
          usr_lbl = usr_model.lbl;
        } else {
          usr_id = None;
        }
        if let Some(usr_id) = usr_id {
          sql_values += ",?";
          args.push(usr_id.into());
        } else {
          sql_values += ",default";
        }
        sql_values += ",?";
        args.push(usr_lbl.into());
      }
    } else {
      if let Some(create_usr_id) = input.create_usr_id {
        sql_values += ",?";
        args.push(create_usr_id.into());
      } else {
        sql_values += ",default";
      }
      if let Some(create_usr_id_lbl) = input.create_usr_id_lbl {
        sql_values += ",?";
        args.push(create_usr_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    }<#
    }
    #><#
    if (hasUpdateUsrId) {
    #>
    
    if let Some(update_usr_id) = input.update_usr_id {
      sql_values += ",?";
      args.push(update_usr_id.into());
    } else {
      sql_values += ",default";
    }<#
    }
    #><#
    if (hasUpdateUsrIdLbl) {
    #>
    
    if let Some(update_usr_id_lbl) = input.update_usr_id_lbl {
      sql_values += ",?";
      args.push(update_usr_id_lbl.into());
    } else {
      sql_values += ",default";
    }<#
    }
    #><#
    if (hasTenantId) {
    #>
    
    if let Some(tenant_id) = input.tenant_id {
      sql_values += ",?";
      args.push(tenant_id.into());
    } else if let Some(tenant_id) = get_auth_tenant_id() {
      sql_values += ",?";
      args.push(tenant_id.into());
    } else {
      sql_values += ",default";
    }<#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.isVirtual) continue;
      const column_name = column.COLUMN_NAME;
      const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
      if (column_name === "id") continue;
      if (column_name === "create_usr_id") continue;
      if (column_name === "create_time") continue;
      if (column_name === "update_usr_id") continue;
      if (column_name === "update_time") continue;
      const is_nullable = column.IS_NULLABLE === "YES";
      const data_type = column.DATA_TYPE;
      const column_type = column.COLUMN_TYPE;
      const column_comment = column.COLUMN_COMMENT || "";
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
      const column_name_mysql = mysqlKeyEscape(column_name);
      const modelLabel = column.modelLabel;
      const isEncrypt = column.isEncrypt;
    #><#
      if (modelLabel) {
    #>
    // <#=column_comment#>
    if let Some(<#=modelLabel#>) = input.<#=modelLabel#> {
      if !<#=modelLabel#>.is_empty() {
        sql_values += ",?";
        args.push(<#=modelLabel#>.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }<#
      }
    #><#
      if (column.isPassword) {
    #>
    // <#=column_comment#>
    if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
      if !<#=column_name_rust#>.is_empty() {
        sql_values += ",?";
        args.push(get_password(<#=column_name_rust#>)?.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }<#
      } else if (foreignKey && foreignKey.type === "many2many") {
    #><#
      } else if (isEncrypt && [ "varchar", "text" ].includes(data_type)) {
    #>
    // <#=column_comment#>
    if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
      sql_values += ",?";
      args.push(encrypt(&<#=column_name_rust#>).into());
    } else {
      sql_values += ",default";
    }<#
      } else if (isEncrypt && [ "decimal" ].includes(data_type)) {
    #>
    // <#=column_comment#>
    if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
      sql_values += ",?";
      args.push(encrypt(&<#=column_name_rust#>.to_string()).into());
    } else {
      sql_values += ",default";
    }<#
      } else if (isEncrypt && [ "int" ].includes(data_type)) {
    #>
    // <#=column_comment#>
    if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
      sql_values += ",?";
      args.push(encrypt(&<#=column_name_rust#>.to_string()).into());
    } else {
      sql_values += ",default";
    }<#
      } else if (is_nullable && [ "date", "datetime" ].includes(data_type)) {
    #>
    // <#=column_comment#>
    if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
      sql_values += ",?";
      args.push(<#=column_name_rust#>.into());
    } else if input.<#=column_name#>_save_null == Some(true) {
      sql_values += ",null";
    } else {
      sql_values += ",default";
    }<#
      } else {
    #>
    // <#=column_comment#>
    if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
      sql_values += ",?";
      args.push(<#=column_name_rust#>.into());
    } else {
      sql_values += ",default";
    }<#
      }
    #><#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      const column_comment = column.COLUMN_COMMENT || "";
      const redundLbl = column.redundLbl;
      if (!redundLbl) {
        continue;
      }
      const redundLblKeys = Object.keys(redundLbl);
      if (redundLblKeys.length === 0) {
        continue;
      }
    #><#
      for (const key of redundLblKeys) {
        const val = redundLbl[key];
    #>
    // <#=column_comment#>
    if let Some(<#=rustKeyEscape(val)#>) = input.<#=rustKeyEscape(val)#> {
      sql_values += ",?";
      args.push(<#=rustKeyEscape(val)#>.into());
    } else {
      sql_values += ",default";
    }<#
      }
    #><#
    }
    #>
    
    sql_values.push(')');
    if i < inputs2_len - 1 {
      sql_values.push(',');
    }
    
  }
  
  let sql = format!("insert into {table} ({sql_fields}) values {sql_values}");
  
  let args: Vec<_> = args.into();
  
  let options = Options::from(options);<#
  if (cache) {
  #>
  
  let options = options.set_del_cache_key1s(get_cache_tables());<#
  }
  #>
  
  let options = options.into();<#
  if (
    cache &&
    (mod === "base" && table === "tenant") ||
    (mod === "base" && table === "role") ||
    (mod === "base" && table === "menu") ||
    (mod === "base" && table === "usr")
  ) {
  #>
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;<#
  }
  #>
  
  execute(
    sql,
    args,
    options,
  ).await?;<#
  if (
    cache &&
    (mod === "base" && table === "tenant") ||
    (mod === "base" && table === "role") ||
    (mod === "base" && table === "menu") ||
    (mod === "base" && table === "usr")
  ) {
  #>
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;<#
  }
  #>
  
  for (i, input) in inputs2
    .into_iter()
    .enumerate()
  {
    let id = inputs2_ids.get(i).unwrap().clone();<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.isVirtual) continue;
      const column_name = column.COLUMN_NAME;
      const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
      if (column_name === "id") continue;
      if (column_name === "create_usr_id") continue;
      if (column_name === "create_time") continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
    #><#
    if (foreignKey && foreignKey.type === "many2many") {
      if (column.inlineMany2manyTab) continue;
    #>
    
    // <#=column_comment#>
    if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
      many2many_update(
        id.clone().into(),
        <#=column_name_rust#>
          .iter()
          .map(|item| item.clone().into())
          .collect(),
        ManyOpts {
          r#mod: "<#=many2many.mod#>",
          table: "<#=many2many.table#>",
          column1: "<#=many2many.column1#>",
          column2: "<#=many2many.column2#>",
        },
      ).await?;
    }<#
    }
    #><#
    }
    #><#
    for (const inlineForeignTab of inlineForeignTabs) {
      const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
      const table = inlineForeignTab.table;
      const mod = inlineForeignTab.mod;
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const inline_column_name = inlineForeignTab.column_name;
      const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
    #><#
      if (inline_foreign_type === "one2many") {
    #>
    
    // <#=inlineForeignTab.label#>
    if let Some(<#=inline_column_name#>) = input.<#=inline_column_name#> {
      for mut model in <#=inline_column_name#> {
        model.<#=inlineForeignTab.column#> = id.clone().into();
        create_<#=table#>(
          model,
          None,
        ).await?;
      }
    }<#
      } else if (inline_foreign_type === "one2one") {
    #>
    
    // <#=inlineForeignTab.label#>
    if let Some(mut <#=inline_column_name#>) = input.<#=inline_column_name#> {
      <#=inline_column_name#>.<#=inlineForeignTab.column#> = id.clone().into();
      create_<#=table#>(
        <#=inline_column_name#>,
        None,
      ).await?;
    }<#
      }
    #><#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
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
        throw `inlineMany2manyTab 中的表: ${ mod }_${ table } 不存在`;
        process.exit(1);
      }
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
    #>
    
    // <#=column_comment#>
    if let Some(<#=column_name#>_<#=table#>_models) = input.<#=column_name#>_<#=table#>_models {
      for input in <#=column_name#>_<#=table#>_models {
        let mut input = input;
        input.<#=many2many.column1#> = id.clone().into();
        create_<#=table#>(
          input,
          None,
        ).await?;
      }
    }<#
    }
    #>
  }
  
  Ok(ids2)
}

/// 创建<#=table_comment#>
#[allow(dead_code)]
pub async fn create(
  #[allow(unused_mut)]
  mut input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<<#=Table_Up#>Id> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "create";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {:?}", &input);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids = _creates(
    vec![input],
    options,
  ).await?;
  
  if ids.is_empty() {
    return Err(anyhow!("_creates: Create failed in dao: {table}"));
  }
  let id = ids[0].clone();
  
  Ok(id)
}<#
if (hasTenantId) {
#>

/// <#=table_comment#>根据id修改租户id
pub async fn update_tenant_by_id(
  id: <#=Table_Up#>Id,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = "<#=mod#>_<#=table#>";
  let method = "update_tenant_by_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    msg += &format!(" tenant_id: {:?}", &tenant_id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = options.into();
  
  let mut args = QueryArgs::new();
  
  args.push(tenant_id.into());
  args.push(id.into());
  
  let sql = format!("update {table} set tenant_id=? where id=?");
  
  let args: Vec<_> = args.into();
  
  let options = Options::from(options);
  
  let options = options.into();
  
  let num = execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#><#
if (hasVersion) {
#>

pub async fn get_version_by_id(
  id: <#=Table_Up#>Id,
) -> Result<Option<u32>> {
  
  let model = find_by_id(id, None).await?;
  
  if let Some(model) = model {
    return Ok(model.version.into());
  }
  
  Ok(0.into())
}<#
}
#><#
if (hasDataPermit() && hasCreateUsrId) {
#>

/// 根据 ids 获取<#=table_comment#>是否可编辑数据权限 getEditableDataPermitsByIds
pub async fn get_editable_data_permits_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<Vec<u8>> {
  if ids.is_empty() {
    return Ok(vec![]);
  }
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  
  let options = Some(options);
  
  let data_permit_models = get_data_permits(
    get_route_path(),
    options.as_ref(),
  ).await?;
  
  let has_create_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Create && item.r#type == DataPermitType::Editable);
  let has_role_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Role && item.r#type == DataPermitType::Editable);
  let has_dept_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Dept && item.r#type == DataPermitType::Editable);
  let has_dept_parent_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::DeptParent && item.r#type == DataPermitType::Editable);
  let has_tenant_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Tenant && item.r#type == DataPermitType::Editable);
  
  let mut editable_data_permits = vec![];
  
  let models = find_all(
    <#=Table_Up#>Search {
      ids: ids.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  for id in ids {
    let model = models.iter()
      .find(|item| item.id == id);
    if model.is_none() {
      editable_data_permits.push(0);
      continue;
    }
    let model = model.unwrap();
    
    if model.create_usr_id.is_empty() {
      editable_data_permits.push(1);
      continue;
    }
    
    if !has_tenant_permit && !has_dept_permit && !has_dept_parent_permit && !has_role_permit && !has_create_permit {
      let usr_id = get_auth_id();
      if usr_id.is_none() {
        editable_data_permits.push(0);
        continue;
      }
      let usr_id = usr_id.unwrap();
      if usr_id == model.create_usr_id {
        editable_data_permits.push(1);
      } else {
        editable_data_permits.push(0);
      }
    } else if !has_tenant_permit && has_dept_parent_permit {
      let dept_ids = get_auth_dept_ids().await?;
      let model_dept_ids = get_parents_dept_ids(
        Some(model.create_usr_id.clone()),
      ).await?;
      if model_dept_ids.iter().any(|item| dept_ids.contains(item)) {
        editable_data_permits.push(1);
      } else {
        editable_data_permits.push(0);
      }
    } else if !has_tenant_permit && has_dept_permit {
      let dept_ids = get_auth_dept_ids().await?;
      let model_dept_ids = get_dept_ids(
        model.create_usr_id.clone(),
      ).await?;
      if model_dept_ids.iter().any(|item| dept_ids.contains(item)) {
        editable_data_permits.push(1);
      } else {
        editable_data_permits.push(0);
      }
    }
    
    if !has_tenant_permit && has_role_permit {
      let role_ids = get_auth_role_ids().await?;
      let model_role_ids = get_role_ids(
        model.create_usr_id.clone(),
      ).await?;
      if model_role_ids.iter().any(|item| role_ids.contains(item)) {
        editable_data_permits.push(1);
      } else {
        editable_data_permits.push(0);
      }
    }
  }
  
  Ok(editable_data_permits)
}<#
}
#>

/// 根据 id 修改<#=table_comment#>
#[allow(unused_mut)]
pub async fn update_by_id(
  id: <#=Table_Up#>Id,
  mut input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<<#=Table_Up#>Id> {<#
  if (mod === "base" && table === "role") {
  #>
  
  if input.menu_ids.is_some() {
    input.menu_ids = crate::src::base::tenant::tenant_dao::filter_menu_ids_by_tenant(
      input.menu_ids.unwrap(),
    ).await?.into();
  }<#
  }
  #>
  
  let silent_mode = get_silent_mode(options.as_ref());
  
  let old_model = find_by_id(
    id.clone(),
    None,
  ).await?;
  
  if old_model.is_none() {
    let table_comment = i18n_dao::ns(
      "<#=table_comment#>".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "编辑失败, 此 {0} 已被删除".to_owned(),
      map.into(),
    ).await?;
    return Err(anyhow!(err_msg));
  }<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  let old_model = old_model.unwrap();
  
  let data_permit_models = get_data_permits(
    get_route_path(),
    options.as_ref(),
  ).await?;
  
  let has_create_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Create && item.r#type == DataPermitType::Editable);
  let has_role_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Role && item.r#type == DataPermitType::Editable);
  let has_dept_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Dept && item.r#type == DataPermitType::Editable);
  let has_dept_parent_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::DeptParent && item.r#type == DataPermitType::Editable);
  let has_tenant_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Tenant && item.r#type == DataPermitType::Editable);
  
  async fn get_not_permit_err_fn() -> Result<<#=Table_Up#>Id> {
    let table_comment = i18n_dao::ns(
      "<#=table_comment#>".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "没有权限编辑此 {0}".to_owned(),
      map.into(),
    ).await?;
    Err(anyhow!(err_msg))
  }
  
  if !data_permit_models.is_empty() && !has_tenant_permit && !has_dept_permit && !has_dept_parent_permit && !has_role_permit && !has_create_permit {
    return get_not_permit_err_fn().await;
  } else if !has_tenant_permit && has_dept_parent_permit {
    let dept_ids = get_auth_dept_ids().await?;
    let model_dept_ids = get_parents_dept_ids(
      old_model.create_usr_id.clone().into(),
    ).await?;
    if !dept_ids.iter().any(|item| model_dept_ids.contains(item)) {
      return get_not_permit_err_fn().await;
    }
  } else if !has_tenant_permit && has_dept_permit {
    let dept_ids = get_auth_dept_ids().await?;
    let model_dept_ids = get_dept_ids(
      old_model.create_usr_id.clone(),
    ).await?;
    if !model_dept_ids.iter().any(|item| dept_ids.contains(item)) {
      return get_not_permit_err_fn().await;
    }
  }
  
  if !has_tenant_permit && has_role_permit {
    let role_ids = get_auth_role_ids().await?;
    let model_role_ids = get_role_ids(
      old_model.create_usr_id.clone(),
    ).await?;
    if !model_role_ids.iter().any(|item| role_ids.contains(item)) {
      return get_not_permit_err_fn().await;
    }
  }<#
  }
  #><#
  if (false) {
  #>
  
  validate(
    &input,
  )?;<#
  }
  #>
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique(
      input.into(),
      None,
      None,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<<#=tableUP#>Model>>();
    
    if !models.is_empty() {
      let unique_type = {
        if let Some(options) = options.as_ref() {
          options.get_unique_type()
            .unwrap_or(UniqueType::Throw)
        } else {
          UniqueType::Throw
        }
      };
      if unique_type == UniqueType::Throw {
        let table_comment = i18n_dao::ns(
          "<#=table_comment#>".to_owned(),
          None,
        ).await?;
        let map = HashMap::from([
          ("0".to_owned(), table_comment),
        ]);
        let err_msg = i18n_dao::ns(
          "此 {0} 已经存在".to_owned(),
          map.into(),
        ).await?;
        return Err(anyhow!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let table = "<#=mod#>_<#=table#>";
  let method = "update_by_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    msg += &format!(" input: {:?}", &input);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * <#=columns.length#> + 20);
  
  let mut field_num: usize = 0;<#
  if (hasTenantId) {
  #>
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += "tenant_id=?,";
    args.push(tenant_id.into());
  }<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    if ([ "id", "create_usr_id", "create_time", "update_usr_id", "update_time" ].includes(column_name)) continue;
    const is_nullable = column.IS_NULLABLE === "YES";
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE;
    const column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
    if (column_name === "tenant_id") {
      continue;
    }
    const column_name_mysql = mysqlKeyEscape(column_name);
    const modelLabel = column.modelLabel;
    const isEncrypt = column.isEncrypt;
  #><#
    if (modelLabel) {
  #>
  // <#=column_comment#>
  if let Some(<#=modelLabel#>) = input.<#=modelLabel#> {
    if !<#=modelLabel#>.is_empty() {
      field_num += 1;
      sql_fields += "<#=modelLabel#>=?,";
      args.push(<#=modelLabel#>.into());
    }
  }<#
    }
  #><#
    if (column.isPassword) {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    if !<#=column_name_rust#>.is_empty() {
      field_num += 1;
      sql_fields += "<#=column_name_mysql#>=?,";
      args.push(get_password(<#=column_name_rust#>)?.into());
    }
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else if (isEncrypt && [ "varchar", "text" ].includes(data_type)) {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    field_num += 1;
    sql_fields += "<#=column_name_mysql#>=?,";
    args.push(encrypt(&<#=column_name_rust#>).into());
  }<#
    } else if (isEncrypt && [ "decimal" ].includes(data_type)) {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    field_num += 1;
    sql_fields += "<#=column_name_mysql#>=?,";
    args.push(encrypt(&<#=column_name_rust#>.to_string()).into());
  }<#
    } else if (isEncrypt && [ "int" ].includes(data_type)) {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    field_num += 1;
    sql_fields += "<#=column_name_mysql#>=?,";
    args.push(encrypt(&<#=column_name_rust#>.to_string()).into());
  }<#
    } else if (is_nullable && [ "date", "datetime" ].includes(data_type)) {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    field_num += 1;
    sql_fields += "<#=column_name_mysql#>=?,";
    args.push(<#=column_name_rust#>.into());
  } else if input.<#=column_name#>_save_null == Some(true) {
    field_num += 1;
    sql_fields += "<#=column_name_mysql#>=null,";
  }<#
    } else {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    field_num += 1;
    sql_fields += "<#=column_name_mysql#>=?,";
    args.push(<#=column_name_rust#>.into());
  }<#
  }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    const column_comment = column.COLUMN_COMMENT || "";
    const redundLbl = column.redundLbl;
    if (!redundLbl) {
      continue;
    }
    const redundLblKeys = Object.keys(redundLbl);
    if (redundLblKeys.length === 0) {
      continue;
    }
  #><#
    for (const key of redundLblKeys) {
      const val = redundLbl[key];
      const val_mysql = mysqlKeyEscape(val);
  #>
  // <#=column_comment#>
  if let Some(<#=rustKeyEscape(val)#>) = input.<#=rustKeyEscape(val)#> {
    field_num += 1;
    sql_fields += "<#=val_mysql#>=?,";
    args.push(<#=rustKeyEscape(val)#>.into());
  }<#
    }
  #><#
  }
  #><#
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const inline_column_name = inlineForeignTab.column_name;
    const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
  #><#
    if (inline_foreign_type === "one2many") {
  #>
  
  // <#=inlineForeignTab.label#>
  if let Some(<#=inline_column_name#>_input) = input.<#=inline_column_name#> {
    let <#=inline_column_name#>_models = find_all_<#=table#>(
      <#=Table_Up#>Search {
        <#=inlineForeignTab.column#>: vec![id.clone()].into(),<#
        if (hasIsDeleted) {
        #>
        is_deleted: 0.into(),<#
        }
        #>
        ..Default::default()
      }.into(),
      None,
      None,
      None,
    ).await?;
    if !<#=inline_column_name#>_models.is_empty() && !<#=inline_column_name#>_input.is_empty() {
      field_num += 1;
    }
    for model in <#=inline_column_name#>_models.clone() {
      if <#=inline_column_name#>_input
        .iter()
        .filter(|item| item.id.is_some())
        .any(|item| item.id == Some(model.id.clone()))
      {
        continue;
      }
      delete_by_ids_<#=table#>(
        vec![model.id],
        None,
      ).await?;
    }
    for mut input in <#=inline_column_name#>_input {
      if input.id.is_none() {
        input.<#=inlineForeignTab.column#> = id.clone().into();
        create_<#=table#>(
          input,
          None,
        ).await?;
        continue;
      }
      let id = input.id.clone().unwrap();
      if !<#=inline_column_name#>_models
        .iter()
        .any(|item| item.id == id)
      {
        revert_by_ids_<#=table#>(
          vec![id.clone()],
          None,
        ).await?;
      }
      input.id = None;
      update_by_id_<#=table#>(
        id.clone(),
        input,
        None,
      ).await?;
    }
  }<#
    } else if (inline_foreign_type === "one2one") {
  #>
  
  // <#=inlineForeignTab.label#>
  if let Some(<#=inline_column_name#>_input) = input.<#=inline_column_name#> {
    field_num += 1;
    let <#=inline_column_name#>_models = find_all_<#=table#>(
      <#=Table_Up#>Search {
        <#=inlineForeignTab.column#>: vec![id.clone()].into(),<#
        if (hasIsDeleted) {
        #>
        is_deleted: 0.into(),<#
        }
        #>
        ..Default::default()
      }.into(),
      None,
      None,
      None,
    ).await?;
    for model in <#=inline_column_name#>_models.clone() {
      if <#=inline_column_name#>_input.id == model.id.clone().into() {
        continue;
      }
      delete_by_ids_<#=table#>(
        vec![model.id],
        None,
      ).await?;
    }
    if let Some(id) = <#=inline_column_name#>_input.id.clone() {
      if !<#=inline_column_name#>_models
        .iter()
        .any(|item| item.id == id)
      {
        revert_by_ids_<#=table#>(
          vec![id.clone()],
          None,
        ).await?;
      }
      let mut <#=inline_column_name#>_input = <#=inline_column_name#>_input;
      <#=inline_column_name#>_input.id = None;
      update_by_id_<#=table#>(
        id.clone(),
        <#=inline_column_name#>_input,
        None,
      ).await?;
    } else {
      let mut <#=inline_column_name#>_input = <#=inline_column_name#>_input;
      <#=inline_column_name#>_input.<#=inlineForeignTab.column#> = id.clone().into();
      create_<#=table#>(
        <#=inline_column_name#>_input,
        None,
      ).await?;
    }
  }<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const column_comment = column.COLUMN_COMMENT;
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
      throw `inlineMany2manyTab 中的表: ${ mod }_${ table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=column_comment#>
  {
    let <#=table#>_models = find_all_<#=table#>(
      <#=Table_Up#>Search {
        <#=many2many.column1#>: vec![id.clone()].into(),
        ..Default::default()
      }.into(),
      None,
      None,
      None,
    ).await?;
    
    struct UpdateModel {
      id: <#=Table_Up#>Id,
      input: <#=Table_Up#>Input,
    }
    
    let mut <#=table#>_create_models = vec![];
    let mut <#=table#>_update_models = vec![];
    let mut <#=table#>_delete_ids = vec![];
    
    let mut <#=column_name#>_<#=table#>_models = input.<#=column_name#>_<#=table#>_models
      .clone()
      .unwrap_or_default();
    
    for <#=table#>_model in &<#=table#>_models {
      let mut has_in = false;
      for <#=table#>_input in &<#=column_name#>_<#=table#>_models {
        let is_equals = equals_by_unique_<#=table#>(
          <#=table#>_input,
          <#=table#>_model,
        );
        if is_equals {
          has_in = true;
          break;
        }
      }
      if !has_in {
        <#=table#>_delete_ids.push(<#=table#>_model.id.clone());
      }
    }
    
    for (i, input) in <#=column_name#>_<#=table#>_models
      .into_iter()
      .enumerate()
    {
      let mut input = input;
      let i: u32 = i.try_into()?;
      input.order_by = Some(i + 1);
      let mut old_id: Option<<#=Table_Up#>Id> = None;
      for model in &<#=table#>_models {
        let is_equals = equals_by_unique_<#=table#>(
          &input,
          model,
        );
        if is_equals {
          old_id = Some(model.id.clone());
          break;
        }
      }
      if let Some(old_id) = old_id {
        <#=table#>_update_models.push(UpdateModel {
          id: old_id.clone(),
          input,
        });
      } else {
        <#=table#>_create_models.push(input);
      }
    }
    
    for input in <#=table#>_create_models {
      let mut input = input;
      input.<#=many2many.column1#> = id.clone().into();
      create_<#=table#>(
        input,
        None,
      ).await?;
    }
    
    for UpdateModel { id, input } in <#=table#>_update_models {
      let mut input = input;
      input.id = None;
      update_by_id_<#=table#>(
        id,
        input,
        None,
      ).await?;
    }
    
    delete_by_ids_<#=table#>(
      <#=table#>_delete_ids.clone(),
      None,
    ).await?;
    
    force_delete_by_ids_<#=table#>(
      <#=table#>_delete_ids,
      None,
    ).await?;
    
    field_num += 1;
  }<#
  }
  #>
  
  if field_num > 0 {
    if !silent_mode {<#
      if (hasVersion) {
      #>
      if let Some(version) = input.version {
        if version > 0 {
          let version2 = get_version_by_id(id.clone()).await?;
          if let Some(version2) = version2 {
            if version2 > version {
              let table_comment = i18n_dao::ns(
                "<#=table_comment#>".to_owned(),
                None,
              ).await?;
              let map = HashMap::from([
                ("0".to_owned(), table_comment),
              ]);
              let err_msg = i18n_dao::ns(
                "此 {0} 已被修改，请刷新后重试".to_owned(),
                map.into(),
              ).await?;
              return Err(anyhow!(err_msg));
            }
          }
          sql_fields += "version=?,";
          args.push((version + 1).into());
        }
      }<#
      }
      #><#
      if (hasUpdateUsrId && !hasUpdateUsrIdLbl) {
      #>
      if let Some(update_usr_id) = input.update_usr_id {
        if update_usr_id.as_str() != "-" {
          sql_fields += "update_usr_id=?,";
          args.push(update_usr_id.into());
        }
      } else {
        let usr_id = get_auth_id();
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
        }
      }<#
      } else if (hasUpdateUsrId && hasUpdateUsrIdLbl) {
      #>
      if input.update_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_id_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.clone().unwrap(),
            None,
          ).await?;
          if let Some(usr_model) = usr_model {
            usr_id_lbl = usr_model.lbl;
          } else {
            usr_id = None;
          }
        }
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
        }
        if !usr_id_lbl.is_empty() {
          sql_fields += "update_usr_id_lbl=?,";
          args.push(usr_id_lbl.into());
        }
      } else if input.update_usr_id.clone().unwrap().as_str() != "-" {
        let mut usr_id = input.update_usr_id.clone();
        let mut usr_id_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.clone().unwrap(),
            None,
          ).await?;
          if let Some(usr_model) = usr_model {
            usr_id_lbl = usr_model.lbl;
          } else {
            usr_id = None;
          }
        }
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
          sql_fields += "update_usr_id_lbl=?,";
          args.push(usr_id_lbl.into());
        }
      }<#
      }
      #><#
      if (hasUpdateTime) {
      #>
      if let Some(update_time) = input.update_time {
        sql_fields += "update_time=?,";
        args.push(update_time.into());
      } else {
        sql_fields += "update_time=?,";
        args.push(get_now().into());
      }<#
      }
      #>
    } else {<#
      if (hasVersion) {
      #>
      if let Some(version) = input.version {
        sql_fields += "version=?,";
        args.push((version).into());
      }<#
      }
      #><#
      if (hasUpdateUsrId && !hasUpdateUsrIdLbl) {
      #>
      if let Some(update_usr_id) = input.update_usr_id {
        if update_usr_id.as_str() != "-" {
          sql_fields += "update_usr_id=?,";
          args.push(update_usr_id.into());
        }
      }<#
      } else if (hasUpdateUsrId && hasUpdateUsrIdLbl) {
      #>
      if input.update_usr_id.is_some() && input.update_usr_id.clone().unwrap().as_str() != "-" {
        let usr_id = input.update_usr_id.clone();
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
        }
      }
      if let Some(update_usr_id_lbl) = input.update_usr_id_lbl {
        sql_fields += "update_usr_id=?,";
        args.push(update_usr_id_lbl.into());
      }<#
      }
      #><#
      if (hasUpdateTime) {
      #>
      if let Some(update_time) = input.update_time {
        sql_fields += "update_time=?,";
        args.push(update_time.into());
      }<#
      }
      #>
    }
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql_where = "id=?";
    args.push(id.clone().into());
    
    let sql = format!("update {table} set {sql_fields} where {sql_where} limit 1");
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options);<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_cache_tables());<#
    }
    #>
    
    let options = options.into();<#
    if (
      cache &&
      (mod === "base" && table === "tenant") ||
      (mod === "base" && table === "role") ||
      (mod === "base" && table === "menu") ||
      (mod === "base" && table === "usr")
    ) {
    #>
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;<#
    }
    #>
    
    execute(
      sql,
      args,
      options,
    ).await?;<#
    if (
      cache &&
      (mod === "base" && table === "tenant") ||
      (mod === "base" && table === "role") ||
      (mod === "base" && table === "menu") ||
      (mod === "base" && table === "usr")
    ) {
    #>
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;<#
    }
    #>
    
  }<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    if (column_name === "id") continue;
    if (column_name === "create_usr_id") continue;
    if (column_name === "create_time") continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
  #><#
  if (foreignKey && foreignKey.type === "many2many") {
    if (column.inlineMany2manyTab) continue;
  #>
  
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    many2many_update(
      id.clone().into(),
      <#=column_name_rust#>
        .iter()
        .map(|item| item.clone().into())
        .collect(),
      ManyOpts {
        r#mod: "<#=many2many.mod#>",
        table: "<#=many2many.table#>",
        column1: "<#=many2many.column1#>",
        column2: "<#=many2many.column2#>",
      },
    ).await?;
    
    field_num += 1;
  }<#
  }
  #><#
  }
  #>
  
  if field_num > 0 {
    let options = Options::from(None);
    let options = options.set_del_cache_key1s(get_cache_tables());
    if let Some(del_cache_key1s) = options.get_del_cache_key1s() {
      del_caches(
        del_cache_key1s
          .iter()
          .map(|item| item.as_str())
          .collect::<Vec<&str>>()
          .as_slice()
      ).await?;
    }
  }<#
    if (mod === "base" && table === "i18n") {
  #>
  
  crate::src::base::options::options_dao::update_i18n_version().await?;<#
    }
  #><#
  if (opts?.history_table) {
    const historyTable = opts.history_table;
    const historyTableUp = historyTable.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  if field_num > 0 {
    let old_model = old_model.unwrap();
    crate::gen::<#=mod#>::<#=historyTable#>::<#=historyTable#>_dao::create(
      old_model.into(),
      None,
    ).await?;
  }<#
  }
  #>
  
  Ok(id)
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = "<#=mod#>_<#=table#>";
  vec![
    table,
  ]
}

/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

/// 根据 ids 删除<#=table_comment#>
pub async fn delete_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "delete_by_ids";
  
  let silent_mode = get_silent_mode(options.as_ref());
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }<#
  if (
    cache &&
    (mod === "base" && table === "tenant") ||
    (mod === "base" && table === "role") ||
    (mod === "base" && table === "menu") ||
    (mod === "base" && table === "usr")
  ) {
  #>
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;<#
  }
  #><#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let data_permit_models = get_data_permits(
    get_route_path(),
    options.as_ref(),
  ).await?;
  
  let has_create_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Create && item.r#type == DataPermitType::Editable);
  let has_role_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Role && item.r#type == DataPermitType::Editable);
  let has_dept_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Dept && item.r#type == DataPermitType::Editable);
  let has_dept_parent_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::DeptParent && item.r#type == DataPermitType::Editable);
  let has_tenant_permit = data_permit_models.iter()
    .any(|item| item.scope == DataPermitScope::Tenant && item.r#type == DataPermitType::Editable);
  
  async fn get_not_permit_err_fn() -> Result<u64> {
    let table_comment = i18n_dao::ns(
      "<#=table_comment#>".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "没有权限删除此 {0}".to_owned(),
      map.into(),
    ).await?;
    Err(anyhow!(err_msg))
  }
  
  if !data_permit_models.is_empty() && !has_tenant_permit && !has_dept_permit && !has_dept_parent_permit && !has_role_permit && !has_create_permit {
    return get_not_permit_err_fn().await;
  }<#
  }
  #>
  
  let options = Options::from(options)
    .set_is_debug(false);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_by_id(
      id.clone(),
      None,
    ).await?;
    if old_model.is_none() {
      continue;
    }<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    
    let old_model = old_model.unwrap();
    
    if !has_tenant_permit && has_dept_parent_permit {
      let dept_ids = get_auth_dept_ids().await?;
      let model_dept_ids = get_parents_dept_ids(
        old_model.create_usr_id.clone().into(),
      ).await?;
      if !dept_ids.iter().any(|item| model_dept_ids.contains(item)) {
        return get_not_permit_err_fn().await;
      }
    } else if !has_tenant_permit && has_dept_permit {
      let dept_ids = get_auth_dept_ids().await?;
      let model_dept_ids = get_dept_ids(
        old_model.create_usr_id.clone(),
      ).await?;
      if !model_dept_ids.iter().any(|item| dept_ids.contains(item)) {
        return get_not_permit_err_fn().await;
      }
    }
    
    if !has_tenant_permit && has_role_permit {
      let role_ids = get_auth_role_ids().await?;
      let model_role_ids = get_role_ids(
        old_model.create_usr_id.clone(),
      ).await?;
      if !model_role_ids.iter().any(|item| role_ids.contains(item)) {
        return get_not_permit_err_fn().await;
      }
    }<#
    }
    #>
    
    let mut args = QueryArgs::new();<#
    if (hasIsDeleted) {
    #>
    
    let mut sql_fields = String::with_capacity(30);
    sql_fields.push_str("is_deleted=1,");
    
    if !silent_mode {<#
      if (hasDeleteUsrId || hasDeleteUsrIdLbl) {
      #>
      
      let mut usr_id = get_auth_id();
      let mut usr_lbl = String::new();
      if usr_id.is_some() {
        let usr_model = find_by_id_usr(
          usr_id.clone().unwrap(),
          None,
        ).await?;
        if let Some(usr_model) = usr_model {
          usr_lbl = usr_model.lbl;
        } else {
          usr_id = None;
        }
      }<#
      }
      #><#
      if (hasDeleteUsrId) {
      #>
      
      if let Some(usr_id) = usr_id {
        sql_fields.push_str("delete_usr_id=?,");
        args.push(usr_id.into());
      }<#
      }
      #><#
      if (hasDeleteUsrIdLbl) {
      #>
      
      sql_fields.push_str("delete_usr_id_lbl=?,");
      args.push(usr_lbl.into());<#
      }
      #><#
      if (hasDeleteTime) {
      #>
      
      sql_fields.push_str("delete_time=?,");
      args.push(get_now().into());<#
      }
      #>
      
    }
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql = format!("update {table} set {sql_fields} where id=? limit 1");<#
    } else {
    #>
    
    let sql = format!("delete from {table} where id=? limit 1");<#
    }
    #>
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let options = options.clone();<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_cache_tables());<#
    }
    #>
    
    let options = options.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }<#
  for (const inlineForeignTab of inlineForeignTabs) {
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const inline_column_name = inlineForeignTab.column_name;
  #>
  
  // <#=inlineForeignTab.label#>
  let <#=table#>_models = find_all_<#=table#>(
    <#=Table_Up#>Search {
      <#=inlineForeignTab.column#>: ids.clone().into(),<#
      if (hasIsDeleted) {
      #>
      is_deleted: 0.into(),<#
      }
      #>
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  delete_by_ids_<#=table#>(
    <#=table#>_models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<<#=Table_Up#>Id>>(),
    None,
  ).await?;<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const column_comment = column.COLUMN_COMMENT;
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
      throw `inlineMany2manyTab 中的表: ${ mod }_${ table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=column_comment#>
  let <#=table#>_models = find_all_<#=table#>(
    <#=Table_Up#>Search {
      <#=many2many.column1#>: ids.clone().into(),
      is_deleted: 1.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  force_delete_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<_>>(),
    None,
  ).await?;
  
  let <#=table#>_models = find_all_<#=table#>(
    <#=Table_Up#>Search {
      <#=many2many.column1#>: ids.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  delete_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<_>>(),
    None,
  ).await?;<#
  }
  #><#
  if (
    cache &&
    (mod === "base" && table === "tenant") ||
    (mod === "base" && table === "role") ||
    (mod === "base" && table === "menu") ||
    (mod === "base" && table === "usr")
  ) {
  #>
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;<#
  }
  #><#
    if (table === "i18n" && mod === "base") {
  #>
  
  crate::src::base::options::options_dao::update_i18n_version().await?;<#
    }
  #>
  
  Ok(num)
}<#
if (hasDefault) {
#>

/// 根据 id 设置默认<#=table_comment#>
pub async fn default_by_id(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "default_by_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }<#
  if (
    cache &&
    (mod === "base" && table === "tenant") ||
    (mod === "base" && table === "role") ||
    (mod === "base" && table === "menu") ||
    (mod === "base" && table === "usr")
  ) {
  #>
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;<#
  }
  #>
  
  let options = Options::from(options)
    .set_is_debug(false);
  
  let options = options.set_del_cache_key1s(get_cache_tables());
  
  {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_default=0 where is_default=1 and id!=?");
    
    args.push(id.clone().into());
    
    let args: Vec<_> = args.into();
    
    let options = options.clone().into();
    
    execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  let mut num = 0;
  
  let mut args = QueryArgs::new();
    
  let sql = format!("update {table} set is_default=1 where id=?");
  
  args.push(id.into());
  
  let args: Vec<_> = args.into();
  
  let options = options.clone().into();
  
  num += execute(
    sql,
    args,
    options,
  ).await?;<#
  if (
    cache &&
    (mod === "base" && table === "tenant") ||
    (mod === "base" && table === "role") ||
    (mod === "base" && table === "menu") ||
    (mod === "base" && table === "usr")
  ) {
  #>
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;<#
  }
  #>
  
  Ok(num)
}<#
}
#><#
if (hasEnabled) {
#>

/// 根据 id 查找<#=table_comment#>是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  let model = find_by_id(id, options).await?;
  
  let is_enabled = {
    if let Some(model) = model {
      model.is_enabled == 1
    } else {
      false
    }
  };
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用<#=table_comment#>
pub async fn enable_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "enable_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    msg += &format!(" is_enabled: {:?}", &is_enabled);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }<#
  if (
    cache &&
    (mod === "base" && table === "tenant") ||
    (mod === "base" && table === "role") ||
    (mod === "base" && table === "menu") ||
    (mod === "base" && table === "usr")
  ) {
  #>
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;<#
  }
  #>
  
  let options = Options::from(options)
    .set_is_debug(false);
  
  let options = options.set_del_cache_key1s(get_cache_tables());
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_enabled=? where id=? limit 1");
    
    args.push(is_enabled.into());
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let options = options.clone().into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }<#
  if (
    cache &&
    (mod === "base" && table === "tenant") ||
    (mod === "base" && table === "role") ||
    (mod === "base" && table === "menu") ||
    (mod === "base" && table === "usr")
  ) {
  #>
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;<#
  }
  #>
  
  Ok(num)
}<#
}
#><#
if (hasLocked) {
#>

/// 根据 id 查找<#=table_comment#>是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  let model = find_by_id(id, options).await?;
  
  let is_locked = {
    if let Some(model) = model {
      model.is_locked == 1
    } else {
      false
    }
  };
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁<#=table_comment#>
pub async fn lock_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "lock_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    msg += &format!(" is_locked: {:?}", &is_locked);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }<#
  if (
    cache &&
    (mod === "base" && table === "tenant") ||
    (mod === "base" && table === "role") ||
    (mod === "base" && table === "menu") ||
    (mod === "base" && table === "usr")
  ) {
  #>
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;<#
  }
  #>
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_cache_tables());
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_locked=? where id=? limit 1");
    
    args.push(is_locked.into());
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let options = options.clone().into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }<#
  if (
    cache &&
    (mod === "base" && table === "tenant") ||
    (mod === "base" && table === "role") ||
    (mod === "base" && table === "menu") ||
    (mod === "base" && table === "usr")
  ) {
  #>
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;<#
  }
  #>
  
  Ok(num)
}<#
}
#><#
if (hasIsDeleted) {
#>

/// 根据 ids 还原<#=table_comment#>
pub async fn revert_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "revert_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_deleted=0 where id=? limit 1");
    
    args.push(id.clone().into());
    
    let args: Vec<_> = args.into();
    
    let options = options.clone();<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_cache_tables());<#
    }
    #>
    
    let options = options.into();<#
    if (
      cache &&
      (mod === "base" && table === "tenant") ||
      (mod === "base" && table === "role") ||
      (mod === "base" && table === "menu") ||
      (mod === "base" && table === "usr")
    ) {
    #>
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;<#
    }
    #>
    
    num += execute(
      sql,
      args,
      options,
    ).await?;<#
    if (
      cache &&
      (mod === "base" && table === "tenant") ||
      (mod === "base" && table === "role") ||
      (mod === "base" && table === "menu") ||
      (mod === "base" && table === "usr")
    ) {
    #>
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;<#
    }
    #>
    
    // 检查数据的唯一索引
    {
      let old_model = find_by_id(
        id.clone(),
        None,
      ).await?;
      
      if old_model.is_none() {
        continue;
      }
      let old_model = old_model.unwrap();
      
      let mut input: <#=tableUP#>Input = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<<#=tableUP#>Model> = models.into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let table_comment = i18n_dao::ns(
          "<#=table_comment#>".to_owned(),
          None,
        ).await?;
        let map = HashMap::from([
          ("0".to_owned(), table_comment),
        ]);
        let err_msg = i18n_dao::ns(
          "此 {0} 已经存在".to_owned(),
          map.into(),
        ).await?;
        return Err(anyhow!(err_msg));
      }
    }
    
  }<#
  for (const inlineForeignTab of inlineForeignTabs) {
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const inline_column_name = inlineForeignTab.column_name;
    const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
  #><#
    if (inline_foreign_type === "one2many") {
  #>
  
  // <#=inlineForeignTab.label#>
  let <#=table#>_models = find_all_<#=table#>(
    <#=Table_Up#>Search {
      <#=inlineForeignTab.column#>: ids.clone().into(),<#
      if (hasIsDeleted) {
      #>
      is_deleted: 1.into(),<#
      }
      #>
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  revert_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<<#=Table_Up#>Id>>(),
    None,
  ).await?;<#
    } else if (inline_foreign_type === "one2one") {
  #>
  
  // <#=inlineForeignTab.label#>
  let <#=table#>_models = find_all_<#=table#>(
    <#=Table_Up#>Search {
      <#=inlineForeignTab.column#>: ids.clone().into(),<#
      if (hasIsDeleted) {
      #>
      is_deleted: 1.into(),<#
      }
      #>
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  revert_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .take(1)
      .map(|item| item.id)
      .collect::<Vec<<#=Table_Up#>Id>>(),
    None,
  ).await?;<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const column_comment = column.COLUMN_COMMENT;
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
      throw `inlineMany2manyTab 中的表: ${ mod }_${ table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=column_comment#>
  let <#=table#>_models = find_all_<#=table#>(
    <#=Table_Up#>Search {
      <#=many2many.column1#>: ids.clone().into(),
      is_deleted: 1.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  revert_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<_>>(),
    None,
  ).await?;<#
  }
  #><#
    if (table === "i18n" && mod === "base") {
  #>
  
  crate::src::base::options::options_dao::update_i18n_version().await?;<#
    }
  #>
  
  Ok(num)
}<#
}
#><#
if (hasIsDeleted) {
#>

/// 根据 ids 彻底删除<#=table_comment#>
pub async fn force_delete_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "force_delete_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let model = find_all(
      <#=tableUP#>Search {
        id: id.clone().into(),<#
        if (hasIsDeleted) {
        #>
        is_deleted: 1.into(),<#
        }
        #>
        ..Default::default()
      }.into(),
      None,
      None, 
      options.clone().into(),
    ).await?.into_iter().next();
    
    if model.is_none() {
      continue;
    }
    
    info!("force_delete_by_ids: {}", serde_json::to_string(&model)?);
    
    let mut args = QueryArgs::new();
    
    let sql = format!("delete from {table} where id=? and is_deleted=1 limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let options = options.clone();<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_cache_tables());<#
    }
    #>
    
    let options = options.into();<#
    if (
      cache &&
      (mod === "base" && table === "tenant") ||
      (mod === "base" && table === "role") ||
      (mod === "base" && table === "menu") ||
      (mod === "base" && table === "usr")
    ) {
    #>
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;<#
    }
    #>
    
    num += execute(
      sql,
      args,
      options,
    ).await?;<#
    if (
      cache &&
      (mod === "base" && table === "tenant") ||
      (mod === "base" && table === "role") ||
      (mod === "base" && table === "menu") ||
      (mod === "base" && table === "usr")
    ) {
    #>
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;<#
    }
    #>
  }<#
  for (const inlineForeignTab of inlineForeignTabs) {
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const inline_column_name = inlineForeignTab.column_name;
  #>
  
  // <#=inlineForeignTab.label#>
  let <#=table#>_models = find_all_<#=table#>(
    <#=Table_Up#>Search {
      <#=inlineForeignTab.column#>: ids.clone().into(),
      is_deleted: 0.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  force_delete_by_ids_<#=table#>(
    <#=table#>_models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<<#=Table_Up#>Id>>(),
    None,
  ).await?;<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const column_comment = column.COLUMN_COMMENT;
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
      throw `inlineMany2manyTab 中的表: ${ mod }_${ table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  // <#=column_comment#>
  let <#=table#>_models = find_all_<#=table#>(
    <#=Table_Up#>Search {
      <#=many2many.column1#>: ids.clone().into(),
      is_deleted: 0.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  delete_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<_>>(),
    None,
  ).await?;
  
  let <#=table#>_models = find_all_<#=table#>(
    <#=Table_Up#>Search {
      <#=many2many.column1#>: ids.clone().into(),
      is_deleted: 1.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  force_delete_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<_>>(),
    None,
  ).await?;<#
  }
  #>
  
  Ok(num)
}<#
}
#><#
if (hasOrderBy) {
#>

/// 查找 <#=table_comment#> order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_last_order_by";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let msg = format!("{table}.{method}:");
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
  #[allow(unused_mut)]
  let mut args = QueryArgs::new();
  let mut sql_wheres: Vec<&'static str> = Vec::with_capacity(3);<#
  if (hasIsDeleted) {
  #>
  
  sql_wheres.push("t.is_deleted=0");<#
  }
  #><#
  if (hasTenantId) {
  #>
  
  if let Some(tenant_id) = get_auth_tenant_id() {
    sql_wheres.push("t.tenant_id=?");
    args.push(tenant_id.into());
  }<#
  }
  #>
  
  let sql_where = sql_wheres.join(" and ");
  let sql = format!("select t.order_by order_by from {table} t where {sql_where} order by t.order_by desc limit 1");
  
  let args: Vec<_> = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let model = query_one::<OrderByModel>(
    sql,
    args,
    options,
  ).await?;
  
  let order_by = {
    if let Some(model) = model {
      model.order_by
    } else {
      0
    }
  };
  
  Ok(order_by)
}<#
}
#><#
if (hasEnabled) {
#>

/// 校验<#=table_comment#>是否启用
#[allow(dead_code)]
pub async fn validate_is_enabled(
  model: &<#=tableUP#>Model,
) -> Result<()> {
  if model.is_enabled == 0 {
    let table_comment = i18n_dao::ns(
      "<#=table_comment#>".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      "已禁用".to_owned(),
      None,
    ).await?;
    let err_msg = table_comment + &msg1;
    return Err(anyhow!(err_msg));
  }
  Ok(())
}<#
}
#>

/// 校验<#=table_comment#>是否存在
#[allow(dead_code)]
pub async fn validate_option<T>(
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let table_comment = i18n_dao::ns(
      "<#=table_comment#>".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      "不存在".to_owned(),
      None,
    ).await?;
    let err_msg = table_comment + &msg1;
    return Err(anyhow!(err_msg));
  }
  Ok(model.unwrap())
}<#
if (false) {
#>

/// 校验
#[allow(unused_imports)]
pub fn validate(
  input: &<#=tableUP#>Input,
) -> Result<()> {
  
  use crate::common::validators::max_items::max_items;
  use crate::common::validators::min_items::min_items;
  use crate::common::validators::maximum::maximum;
  use crate::common::validators::minimum::minimum;
  use crate::common::validators::chars_max_length::chars_max_length;
  use crate::common::validators::chars_min_length::chars_min_length;
  use crate::common::validators::multiple_of::multiple_of;
  use crate::common::validators::regex::regex;
  use crate::common::validators::email::email;
  use crate::common::validators::url::url;
  use crate::common::validators::ip::ip;<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE?.toLowerCase() || "";
    const column_comment = column.COLUMN_COMMENT || "";
    const isPassword = column.isPassword;
    if (isPassword) continue;
    const foreignKey = column.foreignKey;
    const validators = column.validators || [ ];
    if (validators.length === 0) {
      continue;
    }
  #><#
      if ((foreignKey || column.dict || column.dictbiz) && foreignKey?.multiple) {
  #>
  
  // <#=column_comment#><#
  for (let j = 0; j < validators.length; j++) {
    const validator = validators[j];
  #><#
    if (validator.max_items != null) {
  #>
  max_items(
    input.<#=column_name_rust#>.as_ref(),
    <#=validator.max_items#>,
    "",
  )?;
  max_items(
    input.<#=column_name#>_lbl.as_ref(),
    <#=validator.max_items#>,
    &field_comments.<#=column_name#>_lbl,
  )?;<#
    } else if (validator.min_items != null) {
  #>
  min_items(
    input.<#=column_name_rust#>.as_ref(),
    <#=validator.min_items#>,
    "",
  )?;
  min_items(
    input.<#=column_name#>_lbl.as_ref(),
    <#=validator.min_items#>,
    &field_comments.<#=column_name#>_lbl,
  )?;<#
    }
  #><#
  }
  #><#
      } else if ((foreignKey || column.dict || column.dictbiz) && !foreignKey?.multiple) {
  #>
  
  // <#=column_comment#><#
  for (let j = 0; j < validators.length; j++) {
    const validator = validators[j];
  #><#
    if (validator.chars_max_length != null) {
  #>
  chars_max_length(
    input.<#=column_name_rust#>.clone(),
    <#=validator.chars_max_length#>,
    "",
  )?;<#
    }
  #><#
    if (validator.chars_min_length != null) {
  #>
  chars_min_length(
    input.<#=column_name_rust#>.clone(),
    <#=validator.chars_min_length#>,
    "",
  )?;<#
    }
  #><#
    }
  #><#
    } else {
  #>
  
  // <#=column_comment#><#
  if (validators && validators.length > 0) {
  #><#
  for (let j = 0; j < validators.length; j++) {
    const validator = validators[j];
  #><#
    if (validator.maximum != null && [ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  maximum(
    input.<#=column_name_rust#>.as_ref(),
    <#=validator.maximum#>,
    "",
  )?;<#
    } else if (validator.minimum != null && [ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  minimum(
    input.<#=column_name_rust#>.as_ref(),
    <#=validator.minimum#>,
    "",
  )?;<#
    } else if (validator.multiple_of != null && [ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  multiple_of(
    input.<#=column_name_rust#>.as_ref(),
    <#=validator.multiple_of#>,
    "",
  )?;<#
    } else if (validator.chars_max_length != null && [ "varchar", "text" ].includes(data_type)) {
  #>
  chars_max_length(
    input.<#=column_name_rust#>.clone(),
    <#=validator.chars_max_length#>,
    "",
  )?;<#
    } else if (validator.chars_min_length != null && [ "varchar", "text" ].includes(data_type)) {
  #>
  chars_min_length(
    input.<#=column_name_rust#>.clone(),
    <#=validator.chars_min_length#>,
    "",
  )?;<#
    } else if (validator.email && data_type === "varchar") {
  #>
  email(
    input.<#=column_name_rust#>.clone(),
    "",
  )?;<#
    } else if (validator.url && data_type === "varchar") {
  #>
  url(
    input.<#=column_name_rust#>.clone(),
    "",
  )?;<#
    } else if (validator.ip && data_type === "varchar") {
  #>
  ip(
    input.<#=column_name_rust#>.clone(),
    "",
  )?;<#
    } else if (validator.regex && data_type === "varchar") {
  #>
  regex(
    input.<#=column_name_rust#>.clone(),
    "<#=validator.regex#>".to_owned(),
    "",
  )?;<#
    } else if (validator.email && data_type === "varchar") {
  #>
  email(
    input.<#=column_name_rust#>.clone(),
    "",
  )?;<#
    } else if (validator.url && data_type === "varchar") {
  #>
  url(
    input.<#=column_name_rust#>.clone(),
    "",
  )?;<#
    } else if (validator.ip && data_type === "varchar") {
  #>
  ip(
    input.<#=column_name_rust#>.clone(),
    "",
  )?;<#
    }
  #><#
  }
  #><#
    }
  #><#
  }
  #><#
  }
  #>
  
  Ok(())
}<#
}
#>
