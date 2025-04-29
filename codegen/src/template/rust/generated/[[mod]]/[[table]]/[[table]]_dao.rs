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
const hasIsIcon = columns.some((column) => column.isIcon);
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
const langTableExcludeArr = [
  "id",
  "lang_id",
  "create_usr_id",
  "create_usr_id_lbl",
  "create_time",
  "update_usr_id",
  "update_usr_id_lbl",
  "update_time",
  "is_deleted",
  "tenant_id",
  "deleted_usr_id",
  "deleted_usr_id_lbl",
  "deleted_time",
];
langTableExcludeArr.push(`${ table }_id`);
const langTableRecords = [ ];
for (let i = 0; i < (opts.langTable?.records?.length || 0); i++) {
  const record = opts.langTable.records[i];
  const column_name = record.COLUMN_NAME;
  if (
    langTableExcludeArr.includes(column_name)
  ) continue;
  langTableRecords.push(record);
}
const autoCodeColumn = columns.find((item) => item.autoCode);

// 审核
const hasAudit = !!opts?.audit;
let auditColumn = "";
let auditMod = "";
let auditTable = "";
if (hasAudit) {
  auditColumn = opts.audit.column;
  auditMod = opts.audit.auditMod;
  auditTable = opts.audit.auditTable;
}
// 是否有复核
const hasReviewed = opts?.hasReviewed;
const auditTableUp = auditTable.substring(0, 1).toUpperCase()+auditTable.substring(1);
const auditTable_Up = auditTableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const auditTableSchema = opts?.audit?.auditTableSchema;

#>#[allow(unused_imports)]
use serde::{Serialize, Deserialize};
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

use color_eyre::eyre::{Result, eyre};
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
use crate::common::util::string::sql_like;
#[allow(unused_imports)]
use crate::common::gql::model::SortOrderEnum;<#
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
use crate::base::data_permit::data_permit_model::{
  DataPermitType,
  DataPermitScope,
};
use crate::common::data_permit::data_permit_dao::get_data_permits;
#[allow(unused_imports)]
use crate::common::dept::dept_dao::{
  get_dept_ids,
  get_auth_dept_ids,
  get_parents_dept_ids,
  get_auth_and_parents_dept_ids,
  get_auth_and_children_dept_ids,
};
use crate::common::role::role_dao::{
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
  MAX_SAFE_INTEGER,
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
  get_is_silent_mode,
  get_is_creating,
};
use crate::common::exceptions::service_exception::ServiceException;<#
if (hasIsIcon) {
#>

use sha2::Digest;
use base64::Engine;
use base64::engine::general_purpose;

use crate::common::oss::oss_dao::{
  head_object,
  get_object,
  put_object,
};<#
}
#><#
if (isUseI18n) {
#>

use crate::common::i18n::i18n_dao;<#
}
#>

use crate::common::gql::model::{
  PageInput,
  SortInput,
};<#
if (hasAudit && auditTable_Up) {
#>

use crate::<#=auditMod#>::<#=auditTable#>::<#=auditTable#>_dao::find_all_<#=auditTable#>;
use crate::<#=auditMod#>::<#=auditTable#>::<#=auditTable#>_model::<#=auditTable_Up#>Search;<#
}
#><#
  if (hasDict) {
#>

use crate::common::dict_detail::dict_detail_dao::get_dict;<#
  }
#><#
  if (hasDictbiz) {
#>

use crate::common::dictbiz_detail::dictbiz_detail_dao::get_dictbiz;<#
  }
#><#
if (opts.langTable && isUseI18n) {
#>

use crate::common::lang::lang_dao::get_lang_id;
use crate::base::lang::lang_model::LangId;<#
}
#><#
if (isUseI18n) {
#>
use crate::common::i18n::i18n_dao::get_server_i18n_enable;<#
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
use crate::<#=mod#>::<#=table#>::<#=table#>_dao::{<#
  if (!hasFindAllTableUps) {
  #>
  find_all_<#=table#>,<#
  }
  #><#
  if (!hasCreateTableUps) {
  #>
  create_<#=table#>,<#
  }
  #><#
  if (!hasDeleteByIdsTableUps) {
  #>
  delete_by_ids_<#=table#>,<#
  }
  #><#
  if (!hasRevertByIdsTableUps) {
  #>
  revert_by_ids_<#=table#>,<#
  }
  #><#
  if (!hasUpdateByIdTableUps) {
  #>
  update_by_id_<#=table#>,<#
  }
  #><#
  if (!hasForceDeleteByIdsUps) {
  #>
  force_delete_by_ids_<#=table#>,<#
  }
  #>
};<#
}
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
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
use crate::<#=mod#>::<#=table#>::<#=table#>_dao::{<#
  if (!hasFindAllTableUps) {
  #>
  find_all_<#=table#>,<#
  }
  #><#
  if (!hasCreateTableUps) {
  #>
  create_<#=table#>,<#
  }
  #><#
  if (!hasDeleteByIdsTableUps) {
  #>
  delete_by_ids_<#=table#>,<#
  }
  #><#
  if (!hasRevertByIdsTableUps) {
  #>
  revert_by_ids_<#=table#>,<#
  }
  #><#
  if (!hasUpdateByIdTableUps) {
  #>
  update_by_id_<#=table#>,<#
  }
  #><#
  if (!hasForceDeleteByIdsUps) {
  #>
  force_delete_by_ids_<#=table#>,<#
  }
  #><#
  if (!hasEqualsByUniqueTableUps) {
  #>
  equals_by_unique_<#=table#>,<#
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
use crate::<#=mod#>::<#=table#>::<#=table#>_model::*;<#
}
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
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
use crate::<#=mod#>::<#=table#>::<#=table#>_model::*;<#
}
#><#
if (hasTenantId && !modelIds.includes("TenantId")) {
#>

use crate::base::tenant::tenant_model::TenantId;<#
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
use crate::<#=foreignKey.mod#>::<#=foreignTable#>::<#=foreignTable#>_model::<#=modelId#>;<#
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
#><#
if (table_name !== "base_usr") {
#>

use crate::base::usr::usr_dao::find_by_id_usr;<#
}
#><#
}
#>

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&<#=tableUP#>Search>,
  options: Option<&Options>,
) -> Result<String> {<#
  if (opts.langTable && isUseI18n) {
  #>
  
  let server_i18n_enable = get_server_i18n_enable();<#
  }
  #><#
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
    get_route_path_<#=table#>(),
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
  } else {
  #>
  
  where_query.push_str(" 1=1");<#
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
    let dept_ids = get_auth_and_children_dept_ids().await?;
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
  } else if !has_tenant_permit && has_dept_permit {
    let dept_ids = get_auth_dept_ids().await?;
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
  } else if !has_tenant_permit && has_role_permit {
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
    let foreignSchema = undefined;
    const foreignLangTableRecords = [ ];
    if (foreignKey) {
      foreignSchema = optTables[foreignKey.mod + "_" + foreignKey.table];
      for (let i = 0; i < (foreignSchema.opts.langTable?.records?.length || 0); i++) {
        const record = foreignSchema.opts.langTable.records[i];
        const column_name = record.COLUMN_NAME;
        if (
          langTableExcludeArr.includes(column_name)
        ) continue;
        foreignLangTableRecords.push(record);
      }
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
  {<#
    if (!langTableRecords.some((record) => record.COLUMN_NAME === modelLabel)) {
    #>
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
    }<#
    } else {
    #>
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
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and (t.<#=modelLabel#> in (");
      where_query.push_str(&arg);
      where_query.push(')');<#
      if (isUseI18n) {
      #>
      if server_i18n_enable {
        where_query.push_str(" or <#=opts.langTable.opts.table_name#>.<#=modelLabel#> in (");
        where_query.push_str(&arg);
        where_query.push(')');
      }<#
      }
      #>
      where_query.push(')');
    }<#
    }
    #>
    {
      let <#=modelLabel#>_like = match search {
        Some(item) => item.<#=modelLabel#>_like.clone(),
        None => None,
      };
      if let Some(<#=modelLabel#>_like) = <#=modelLabel#>_like {<#
        if (!langTableRecords.some((record) => record.COLUMN_NAME === modelLabel)) {
        #>
        if !<#=modelLabel#>_like.is_empty() {
          where_query.push_str(" and <#=modelLabel#> like ?");
          args.push(format!("%{}%", sql_like(&<#=modelLabel#>_like)).into());
        }<#
        } else {
        #>
        if !<#=modelLabel#>_like.is_empty() {<#
          if (isUseI18n) {
          #>
          if server_i18n_enable {
            where_query.push_str(" and (<#=modelLabel#> like ? or <#=opts.langTable.opts.table_name#>.<#=modelLabel#> like ?)");
            let like_str = format!("%{}%", sql_like(&<#=modelLabel#>_like));
            args.push(like_str.as_str().into());
            args.push(like_str.as_str().into());
          } else {
            where_query.push_str(" and <#=modelLabel#> like ?");
            args.push(format!("%{}%", sql_like(&<#=modelLabel#>_like)).into());
          }<#
          } else {
          #>
          where_query.push_str(" and <#=modelLabel#> like ?");
          args.push(format!("%{}%", sql_like(&<#=modelLabel#>_like)).into());<#
          }
          #>
        }<#
        }
        #>
      }
    }
  }<#
    } else if (foreignKey.lbl) {
  #>
  {
    let <#=column_name#>_<#=foreignKey.lbl#>: Option<Vec<String>> = match search {
      Some(item) => item.<#=column_name#>_<#=foreignKey.lbl#>.clone(),
      None => None,
    };
    if let Some(<#=column_name#>_<#=foreignKey.lbl#>) = <#=column_name#>_<#=foreignKey.lbl#> {
      let arg = {
        if <#=column_name#>_<#=foreignKey.lbl#>.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(<#=column_name#>_<#=foreignKey.lbl#>.len());
          for item in <#=column_name#>_<#=foreignKey.lbl#> {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and <#=column_name#>_lbl.<#=foreignKey.lbl#> in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let <#=column_name#>_<#=foreignKey.lbl#>_like = match search {
      Some(item) => item.<#=column_name#>_<#=foreignKey.lbl#>_like.clone(),
      None => None,
    };
    if let Some(<#=column_name#>_<#=foreignKey.lbl#>_like) = <#=column_name#>_<#=foreignKey.lbl#>_like {<#
      if (!isUseI18n || !foreignLangTableRecords.some((record) => record.COLUMN_NAME === column_name+"_"+foreignKey.lbl)) {
      #>
      where_query.push_str(" and <#=column_name#>_lbl.<#=foreignKey.lbl#> like ?");
      args.push(format!("%{}%", sql_like(&<#=column_name#>_<#=foreignKey.lbl#>_like)).into());<#
      } else {
      #>
      where_query.push_str(" and (<#=column_name#>_lbl.<#=foreignKey.lbl#> like ? or <#=foreignSchema.opts.langTable.opts.table_name#>.<#=column_name#>_<#=foreignKey.lbl#> like ?)");
      let like_str = format!("%{}%", sql_like(&<#=column_name#>_<#=foreignKey.lbl#>_like));
      args.push(like_str.as_str().into());
      args.push(like_str.as_str().into());<#
      }
      #>
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
    let <#=column_name_rust#>: Option<Vec<<#=_data_type#>>> = match search {
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
    } else if (data_type === "varchar" || data_type === "text") {
  #>
  // <#=column_comment#>
  {
    let <#=column_name_rust#> = match search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {<#
      if (!langTableRecords.some((record) => record.COLUMN_NAME === column_name)) {
      #>
      where_query.push_str(" and t.<#=column_name#>=?");
      args.push(<#=column_name_rust#>.into());<#
      } else {
      #><#
      if (isUseI18n) {
      #>
      if server_i18n_enable {
        where_query.push_str(" and (t.<#=column_name#>=? or <#=opts.langTable.opts.table_name#>.<#=column_name#>=?)");
        args.push(<#=column_name_rust#>.as_str().into());
        args.push(<#=column_name_rust#>.as_str().into());
      } else {
        where_query.push_str(" and t.<#=column_name#>=?");
        args.push(<#=column_name_rust#>.into());
      }<#
      } else {
      #>
      where_query.push_str(" and t.<#=column_name#>=?");
      args.push(<#=column_name_rust#>.into());<#
      }
      #><#
      }
      #>
    }
    let <#=column_name#>_like = match search {
      Some(item) => item.<#=column_name#>_like.clone(),
      None => None,
    };
    if let Some(<#=column_name#>_like) = <#=column_name#>_like {<#
      if (!langTableRecords.some((record) => record.COLUMN_NAME === column_name)) {
      #>
      where_query.push_str(" and t.<#=column_name#> like ?");
      args.push(format!("%{}%", sql_like(&<#=column_name#>_like)).into());<#
      } else {
      #><#
      if (isUseI18n) {
      #>
      if server_i18n_enable {
        where_query.push_str(" and (t.<#=column_name#> like ? or <#=opts.langTable.opts.table_name#>.<#=column_name#> like ?)");
        let like_str = format!("%{}%", sql_like(&<#=column_name#>_like));
        args.push(like_str.as_str().into());
        args.push(like_str.as_str().into());
      } else {
        where_query.push_str(" and t.<#=column_name#> like ?");
        args.push(format!("%{}%", sql_like(&<#=column_name#>_like)).into());
      }<#
      } else {
      #>
      where_query.push_str(" and t.<#=column_name#> like ?");
      args.push(format!("%{}%", sql_like(&<#=column_name#>_like)).into());<#
      }
      #><#
      }
      #>
    }
  }<#
    } else if (!column.isEncrypt) {
  #>
  // <#=column_comment#>
  {
    let <#=column_name_rust#> = match search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {<#
      if (!langTableRecords.some((record) => record.COLUMN_NAME === column_name)) {
      #>
      where_query.push_str(" and t.<#=column_name#>=?");
      args.push(<#=column_name_rust#>.into());<#
      } else {
      #><#
      if (isUseI18n) {
      #>
      if server_i18n_enable {
        where_query.push_str(" and (t.<#=column_name#>=? or <#=opts.langTable.opts.table_name#>.<#=column_name#>=?)");
        args.push(<#=column_name_rust#>.as_str().into());
        args.push(<#=column_name_rust#>.as_str().into());
      } else {
        where_query.push_str(" and t.<#=column_name#>=?");
        args.push(<#=column_name_rust#>.into());
      }<#
      } else {
      #>
      where_query.push_str(" and t.<#=column_name#>=?");
      args.push(<#=column_name_rust#>.into());<#
      }
      #><#
      }
      #>
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
  if (isUseI18n) {
  #>
  
  let server_i18n_enable = get_server_i18n_enable();<#
  }
  #><#
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
    get_route_path_<#=table#>(),
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
  if (
    (hasDataPermit() && hasCreateUsrId)
    || (opts.langTable && isUseI18n)
  ) {
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
    const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    const foreignHasIsDeleted = foreignSchema.columns.some((column) => column.COLUMN_NAME === "is_deleted");
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
    if (foreignHasIsDeleted) {
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
  #>
  for _ in 0..<#=fromQueryIsDeletedNum#> {
    args.push(is_deleted.into());
  }<#
  }
  #><#
  if (opts.langTable && isUseI18n) {
  #>
  if server_i18n_enable {
    from_query += " left join <#=opts.langTable.opts.table_name#> on <#=opts.langTable.opts.table_name#>.<#=table#>_id=t.id and <#=opts.langTable.opts.table_name#>.lang_id=?";
    args.push(get_lang_id().await?.unwrap_or_default().to_string().into());
  }<#
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

// MARK: find_all_<#=table#>
/// 根据搜索条件和分页查找<#=table_comment#>列表
#[allow(unused_mut)]
pub async fn find_all_<#=table#>(
  search: Option<<#=tableUP#>Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_all_<#=table#>";<#
  if (opts.langTable && isUseI18n) {
  #>
  
  let server_i18n_enable= get_server_i18n_enable();<#
  }
  #>
  
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
        return Err(eyre!("search.<#=column_name#>.length > {ids_limit}"));
      }
    }
  }<#
    }
  #><#
  }
  #><#
  if (opts.langTable && isUseI18n) {
  #>
  
  let lang_sql = {
    let mut lang_sql = String::new();
    if server_i18n_enable {<#
      for (let i = 0; i < langTableRecords.length; i++) {
        const record = langTableRecords[i];
        const column_name = record.COLUMN_NAME;
      #>
      lang_sql += ",max(<#=opts.langTable.opts.table_name#>.<#=column_name#>) <#=column_name#>_lang";<#
      }
      #>
    }
    lang_sql
  };<#
  }
  #>
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
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
    if (order === "asc") {
      order = "SortOrderEnum::Asc";
    } else if (order === "desc") {
      order = "SortOrderEnum::Desc";
    }
  #>
  
  if !sort.iter().any(|item| item.prop == "<#=prop#>") {
    sort.push(SortInput {
      prop: "<#=prop#>".into(),
      order: <#=order#>,
    });
  }<#
  }
  #><#
  if (hasCreateTime && opts?.defaultSort.prop !== "create_time") {
  #>
  
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: SortOrderEnum::Asc,
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
  #><#
  if (opts.langTable && isUseI18n) {
  #>
  {lang_sql}<#
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
  
  let mut res: Vec<<#=tableUP#>Model> = query(
    sql,
    args,
    Some(options),
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
    .map_err(|err| eyre!("{:#?}", err))?;<#
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
    .map_err(|err| eyre!("{:#?}", err))?;<#
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
  #><#
  if (hasAudit && auditTable_Up) {
  #>
  
  let <#=auditColumn#>_recent_models = find_all_<#=auditTable#>(
    <#=auditTable_Up#>Search {
      <#=table#>_id: res
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
    vec![SortInput {
      prop: "audit_time".to_string(),
      order: SortOrderEnum::Desc,
    }].into(),
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
      const isIcon = column.isIcon;
      if (!isIcon) continue;
    #>
    
    // <#=column_comment#>
    model.<#=column_name#>_lbl = {
      let res = get_object(&model.<#=column_name#>).await?;
      if let Some(res) = res {
        String::from_utf8(res.to_vec())?
      } else {
        String::new()
      }
    };<#
    }
    #><#
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
    #><#
    if (hasAudit && auditTable_Up) {
    #>
    
    model.<#=auditColumn#>_recent_model = <#=auditColumn#>_recent_models
      .clone()
      .into_iter()
      .filter(|item|
        item.<#=table#>_id == model.id
      )
      .take(1)
      .collect::<Vec<_>>()
      .pop();<#
    }
    #>
    
  }
  
  Ok(res)
}

// MARK: find_count_<#=table#>
/// 根据条件查找<#=table_comment#>总数
pub async fn find_count_<#=table#>(
  search: Option<<#=tableUP#>Search>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_count_<#=table#>";
  
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
        return Ok(0);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.<#=column_name#>.length > {ids_limit}"));
      }
    }
  }<#
    }
  #><#
  }
  #>
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
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
  
  let options = Some(options);<#
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
  
  if total > MAX_SAFE_INTEGER {
    return Err(eyre!("total > MAX_SAFE_INTEGER"));
  }
  
  Ok(total)
}<#
if (isUseI18n) {
#>

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path_<#=table#>().into(),
  }
}<#
}
#>

// MARK: get_field_comments_<#=table#>
/// 获取<#=table_comment#>字段注释
pub async fn get_field_comments_<#=table#>(
  _options: Option<Options>,
) -> Result<<#=tableUP#>FieldComment> {<#
  if (isUseI18n) {
  #>
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno && !column.onlyCodegenDenoButApi) continue;
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
      if (column.onlyCodegenDeno && !column.onlyCodegenDenoButApi) continue;
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
  };<#
  } else {
  #>
  
  let field_comments = <#=tableUP#>FieldComment {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno && !column.onlyCodegenDenoButApi) continue;
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
    #>
    <#=column_name_rust#>: "<#=column_comment#>".into(),
    <#=column_name#>_lbl: "<#=column_comment#>".into(),<#
      } else if (data_type === "datetime" || data_type === "date") {
    #>
    <#=column_name_rust#>: "<#=column_comment#>".into(),
    <#=column_name#>_lbl: "<#=column_comment#>".into(),<#
      } else {
    #>
    <#=column_name_rust#>: "<#=column_comment#>".into(),<#
      }
    #><#
    }
    #>
  };<#
  }
  #>
  Ok(field_comments)
}

// MARK: find_one_ok_<#=table#>
/// 根据条件查找第一个<#=table_comment#>
#[allow(dead_code)]
pub async fn find_one_ok_<#=table#>(
  search: Option<<#=tableUP#>Search>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<<#=tableUP#>Model> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_one_ok_<#=table#>";
  
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
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let <#=table#>_model = validate_option_<#=table#>(
    find_one_<#=table#>(
      search,
      sort,
      options,
    ).await?,
  ).await?;
  
  Ok(<#=table#>_model)
}

// MARK: find_one_<#=table#>
/// 根据条件查找第一个<#=table_comment#>
#[allow(dead_code)]
pub async fn find_one_<#=table#>(
  search: Option<<#=tableUP#>Search>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_one_<#=table#>";
  
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
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let page = PageInput {
    pg_offset: 0.into(),
    pg_size: 1.into(),
  }.into();
  
  let res = find_all_<#=table#>(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<<#=tableUP#>Model> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_<#=table#>
/// 根据 id 查找<#=table_comment#>
#[allow(dead_code)]
pub async fn find_by_id_ok_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<<#=tableUP#>Model> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_by_id_ok_<#=table#>";
  
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
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let <#=table#>_model = validate_option_<#=table#>(
    find_by_id_<#=table#>(
      id,
      options,
    ).await?,
  ).await?;
  
  Ok(<#=table#>_model)
}

// MARK: find_by_id_<#=table#>
/// 根据 id 查找<#=table_comment#>
pub async fn find_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_by_id_<#=table#>";
  
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
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let search = <#=tableUP#>Search {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let <#=table#>_model = find_one_<#=table#>(
    search,
    None,
    options,
  ).await?;
  
  Ok(<#=table#>_model)
}

// MARK: find_by_ids_<#=table#>
/// 根据 ids 查找<#=table_comment#>
#[allow(dead_code)]
pub async fn find_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<Vec<<#=Table_Up#>Model>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_by_ids_<#=table#>";
  
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
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let len = ids.len();
  
  if len > FIND_ALL_IDS_LIMIT {
    return Err(eyre!("find_by_ids: ids.length > FIND_ALL_IDS_LIMIT"));
  }
  
  let search = <#=Table_Up#>Search {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let models = find_all_<#=table#>(
    search,
    None,
    None,
    options,
  ).await?;
  
  if models.len() != len {<#
    if (isUseI18n) {
    #>
    let table_comment = i18n_dao::ns(
      "<#=table_comment#>".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "此 {0} 已被删除".to_owned(),
      map.into(),
    ).await?;<#
    } else {
    #>
    let err_msg = "此 <#=table_comment#> 已被删除";<#
    }
    #>
    return Err(eyre!(err_msg));
  }
  
  let models = ids
    .into_iter()
    .map(|id| {
      let model = models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }<#
      if (isUseI18n) {
      #>
      let table_comment = i18n_dao::ns(
        "<#=table_comment#>".to_owned(),
        None,
      ).await?;
      let map = HashMap::from([
        ("0".to_owned(), table_comment),
      ]);
      let err_msg = i18n_dao::ns(
        "此 {0} 已经被删除".to_owned(),
        map.into(),
      ).await?;<#
      } else {
      #>
      let err_msg = "此 <#=table_comment#> 已经被删除";<#
      }
      #>
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<<#=Table_Up#>Model>>>()?;
  
  Ok(models)
}

// MARK: exists_<#=table#>
/// 根据搜索条件判断<#=table_comment#>是否存在
#[allow(dead_code)]
pub async fn exists_<#=table#>(
  search: Option<<#=tableUP#>Search>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "exists_<#=table#>";
  
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
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let total = find_count_<#=table#>(
    search,
    options,
  ).await?;
  
  Ok(total > 0)
}

// MARK: exists_by_id_<#=table#>
/// 根据 id 判断<#=table_comment#>是否存在
#[allow(dead_code)]
pub async fn exists_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "exists_by_id_<#=table#>";
  
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
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let search = <#=tableUP#>Search {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = exists_<#=table#>(
    search,
    options,
  ).await?;
  
  Ok(res)
}

// MARK: find_by_unique_<#=table#>
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_<#=table#>(
  search: <#=tableUP#>Search,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_by_unique_<#=table#>";
  
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
    .set_is_debug(Some(false));
  let options = Some(options);
  
  if let Some(id) = search.id {
    let model = find_by_id_<#=table#>(
      id,
      options.clone(),
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
    
    find_all_<#=table#>(
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

// MARK: check_by_unique_<#=table#>
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_<#=table#>(
  input: <#=tableUP#>Input,
  model: <#=tableUP#>Model,
  options: Option<Options>,
) -> Result<Option<<#=Table_Up#>Id>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "check_by_unique_<#=table#>";
  
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
    .set_is_debug(Some(false));
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
    let id = update_by_id_<#=table#>(
      model.id.clone(),
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {<#
    if (isUseI18n) {
    #>
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
    ).await?;<#
    } else {
    #>
    let err_msg = "此 <#=table_comment#> 已经存在";<#
    }
    #>
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_<#=table#>
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_<#=table#>(
  input: <#=tableUP#>Input,
) -> Result<<#=tableUP#>Input> {
  
  #[allow(unused_mut)]
  let mut input = input;<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    if (column.isPassword) continue;
    if (column.isEncrypt) continue;
    if (column.onlyCodegenDeno) continue;
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
        let field_comments = get_field_comments_<#=table#>(
          None,
        ).await?;
        let column_comment = field_comments.<#=column_name_rust#>;<#
        if (isUseI18n) {
        #>
        
        let err_msg = i18n_dao::ns(
          "日期格式错误".to_owned(),
          None,
        ).await?;<#
        } else {
        #>
        
        let err_msg = "日期格式错误";<#
        }
        #>
        return Err(eyre!("{column_comment} {err_msg}"));
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
        let field_comments = get_field_comments_<#=table#>(
          None,
        ).await?;
        let column_comment = field_comments.<#=column_name_rust#>;<#
        if (isUseI18n) {
        #>
        
        let err_msg = i18n_dao::ns(
          "日期格式错误".to_owned(),
          None,
        ).await?;<#
        } else {
        #>
        
        let err_msg = "日期格式错误";<#
        }
        #>
        return Err(eyre!("{column_comment} {err_msg}"));
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
        let field_comments = get_field_comments_<#=table#>(
          None,
        ).await?;
        let column_comment = field_comments.<#=column_name_rust#>;<#
        if (isUseI18n) {
        #>
        
        let err_msg = i18n_dao::ns(
          "日期格式错误".to_owned(),
          None,
        ).await?;<#
        } else {
        #>
        
        let err_msg = "日期格式错误";<#
        }
        #>
        return Err(eyre!("{column_comment} {err_msg}"));
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
        daoStr = `crate::${ foreignKey.mod }::${ foreignTable }::${ foreignTable }_dao::`;
      }
    }
  #><#
    if (column.dict) {
      let Column_Up = column_name.substring(0, 1).toUpperCase()+column_name.substring(1);
      Column_Up = Column_Up.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const enumColumnName = Table_Up + Column_Up;
      const columnDictModels = [
        ...dictModels.filter(function(item) {
          return item.code === column.dict || item.code === column.dict;
        }),
        ...dictbizModels.filter(function(item) {
          return item.code === column.dict || item.code === column.dictbiz;
        }),
      ];
  #>
  
  // <#=column_comment#>
  if
    input.<#=column_name#>_lbl.is_some() && !input.<#=column_name#>_lbl.as_ref().unwrap().is_empty()
    && input.<#=column_name_rust#>.is_none()
  {
    let <#=column_name#>_dict = &dict_vec[<#=dictNumMap[column_name]#>];
    let dict_model = <#=column_name#>_dict.iter().find(|item| {
      item.lbl == input.<#=column_name#>_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.<#=column_name_rust#> = val<#
        if (columnDictModels.length > 0 && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
      #>.parse::<<#=enumColumnName#>>()?<#
        } else if ([ "int" ].includes(data_type) && column_type.endsWith("unsigned")) {
      #>.parse::<u32>()?<#
        } else if ([ "int" ].includes(data_type) && !column_type.endsWith("unsigned")) {
      #>.parse::<i32>()?<#
        } else if ([ "decimal" ].includes(data_type)) {
      #>.parse::<rust_decimal::Decimal>()?<#
        } else if ([ "tinyint" ].includes(data_type) && column_type.endsWith("unsigned")) {
      #>.parse::<u8>()?<#
        } else if ([ "tinyint" ].includes(data_type) && !column_type.endsWith("unsigned")) {
      #>.parse::<i8>()?<#
        }
      #>.into();
    }
  } else if
    (input.<#=column_name#>_lbl.is_none() || input.<#=column_name#>_lbl.as_ref().unwrap().is_empty())
    && input.<#=column_name_rust#>.is_some()
  {
    let <#=column_name#>_dict = &dict_vec[<#=dictNumMap[column_name]#>];
    let dict_model = <#=column_name#>_dict.iter().find(|item| {
      item.val == input.<#=column_name_rust#><#
        if (columnDictModels.length === 0 && [ "varchar", "char", "text" ].includes(data_type)) {
      #>.clone()<#
        }
      #>.unwrap_or_default()<#
        if (columnDictModels.length > 0 || ![ "varchar", "char", "text" ].includes(data_type)) {
      #>.to_string()<#
        }
      #>
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.<#=column_name#>_lbl = lbl;
  }<#
    } else if (column.dictbiz) {
      let Column_Up = column_name.substring(0, 1).toUpperCase()+column_name.substring(1);
      Column_Up = Column_Up.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const enumColumnName = Table_Up + Column_Up;
      const columnDictModels = [
        ...dictModels.filter(function(item) {
          return item.code === column.dict || item.code === column.dict;
        }),
        ...dictbizModels.filter(function(item) {
          return item.code === column.dict || item.code === column.dictbiz;
        }),
      ];
  #>
  
  // <#=column_comment#>
  if
    input.<#=column_name#>_lbl.is_some() && !input.<#=column_name#>_lbl.as_ref().unwrap().is_empty()
    && input.<#=column_name_rust#>.is_none()
  {
    let <#=column_name#>_dictbiz = &dictbiz_vec[<#=dictBizNumMap[column_name]#>];
    let dictbiz_model = <#=column_name#>_dictbiz.iter().find(|item| {
      item.lbl == input.<#=column_name#>_lbl.clone().unwrap_or_default()
    });
    let val = dictbiz_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.<#=column_name_rust#> = val<#
        if (columnDictModels.length > 0 && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
      #>.parse::<<#=enumColumnName#>>()?<#
        } else if ([ "int" ].includes(data_type)) {
      #>.parse::<u32>()?<#
        } else if ([ "decimal" ].includes(data_type)) {
      #>.parse::<rust_decimal::Decimal>()?<#
        } else if ([ "tinyint" ].includes(data_type)) {
      #>.parse::<u8>()?<#
        }
      #>.into();
    }
  } else if
    (input.<#=column_name#>_lbl.is_none() || input.<#=column_name#>_lbl.as_ref().unwrap().is_empty())
    && input.<#=column_name_rust#>.is_some()
  {
    let <#=column_name#>_dictbiz = &dictbiz_vec[<#=dictBizNumMap[column_name]#>];
    let dictbiz_model = <#=column_name#>_dictbiz.iter().find(|item| {
      item.val == input.<#=column_name_rust#><#
        if (columnDictModels.length === 0 && [ "varchar", "char", "text" ].includes(data_type)) {
      #>.clone()<#
        }
      #>.unwrap_or_default()<#
        if (columnDictModels.length > 0 || ![ "varchar", "char", "text" ].includes(data_type)) {
      #>.to_string()<#
        }
      #>
    });
    let lbl = dictbiz_model.map(|item| item.lbl.to_string());
    input.<#=column_name#>_lbl = lbl;
  }<#
    } else if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple && foreignKey.lbl) {
  #>
  
  // <#=column_comment#>
  if input.<#=column_name#>_<#=foreignKey.lbl#>.is_some()
    && !input.<#=column_name#>_<#=foreignKey.lbl#>.as_ref().unwrap().is_empty()
    && input.<#=column_name_rust#>.is_none()
  {
    input.<#=column_name#>_<#=foreignKey.lbl#> = input.<#=column_name#>_<#=foreignKey.lbl#>.map(|item| 
      item.trim().to_owned()
    );<#
    if (foreignTableUp !== tableUP) {
    #>
    let model = <#=daoStr#>find_one_<#=foreignTable#>(
      crate::<#=foreignKey.mod#>::<#=foreignTable#>::<#=foreignTable#>_model::<#=foreignTableUp#>Search {
        <#=rustKeyEscape(foreignKey.lbl)#>: input.<#=column_name#>_<#=foreignKey.lbl#>.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;<#
    } else {
    #>
    let model = <#=daoStr#>find_one_<#=foreignTable#>(
      <#=tableUP#>Search {
        <#=rustKeyEscape(foreignKey.lbl)#>: input.<#=column_name#>_<#=foreignKey.lbl#>.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;<#
    }
    #>
    if let Some(model) = model {
      input.<#=column_name_rust#> = model.id.into();
    }
  } else if
    (input.<#=column_name#>_<#=foreignKey.lbl#>.is_none() || input.<#=column_name#>_<#=foreignKey.lbl#>.as_ref().unwrap().is_empty())
    && input.<#=column_name_rust#>.is_some()
  {<#
    if (foreignTableUp !== tableUP) {
    #>
    let <#=foreignTable#>_model = <#=daoStr#>find_one_<#=foreignTable#>(
      crate::<#=foreignKey.mod#>::<#=foreignTable#>::<#=foreignTable#>_model::<#=foreignTableUp#>Search {
        id: input.<#=column_name_rust#>.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;<#
    } else {
    #>
    let <#=foreignTable#>_model = <#=daoStr#>find_one_<#=foreignTable#>(
      <#=tableUP#>Search {
        id: input.<#=column_name_rust#>.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;<#
    }
    #>
    if let Some(<#=foreignTable#>_model) = <#=foreignTable#>_model {
      input.<#=column_name#>_<#=foreignKey.lbl#> = <#=foreignTable#>_model.<#=rustKeyEscape(foreignKey.lbl)#>.into();
    }
  }<#
    } else if (foreignKey && (foreignKey.type === "many2many" || foreignKey.multiple) && foreignKey.lbl && !foreignKey.notSetIdByLbl) {
  #>
  
  // <#=column_comment#>
  if input.<#=column_name#>_<#=foreignKey.lbl#>.is_some() && input.<#=column_name_rust#>.is_none() {
    input.<#=column_name_rust#>_<#=foreignKey.lbl#> = input.<#=column_name_rust#>_<#=foreignKey.lbl#>.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .filter(|item| !item.is_empty())
        .collect::<Vec<String>>()
    );
    input.<#=column_name_rust#>_<#=foreignKey.lbl#> = input.<#=column_name_rust#>_<#=foreignKey.lbl#>.map(|item| {
      let mut set = HashSet::new();
      item.into_iter()
        .filter(|item| set.insert(item.clone()))
        .collect::<Vec<String>>()
    });
    let mut models = vec![];
    for lbl in input.<#=column_name_rust#>_<#=foreignKey.lbl#>.clone().unwrap_or_default() {
      let model = <#=daoStr#>find_one_<#=foreignTable#>(
        crate::<#=foreignKey.mod#>::<#=foreignTable#>::<#=foreignTable#>_model::<#=foreignTableUp#>Search {
          <#=foreignKey.lbl#>: lbl.into(),
          ..Default::default()
        }.into(),
        None,
        Some(Options::new().set_is_debug(Some(false))),
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
    let <#=column_name#>_dictbiz = &dictbiz_vec[<#=dictBizNumMap[column_name]#>];
    let dictbiz_model = <#=column_name#>_dictbiz.iter().find(|item| {
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
    let find_by_id_<#=foreignTable#> = crate::<#=foreignKey.mod#>::<#=foreignTable#>::<#=foreignTable#>_dao::find_by_id;
    let <#=foreignTable#>_model = find_by_id_<#=foreignTable#>(
      input.<#=column_name#>.clone().unwrap(),
      Some(Options::new().set_is_debug(Some(false))),
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

// MARK: creates_return_<#=table#>
/// 批量创建<#=table_comment#>并返回
#[allow(dead_code)]
pub async fn creates_return_<#=table#>(
  inputs: Vec<<#=tableUP#>Input>,
  options: Option<Options>,
) -> Result<Vec<<#=Table_Up#>Model>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "creates_return_<#=table#>";
  
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
    inputs.clone(),
    options.clone(),
  ).await?;
  
  let models_<#=table#> = find_by_ids_<#=table#>(
    ids,
    options,
  ).await?;
  
  Ok(models_<#=table#>)
}

// MARK: creates_<#=table#>
/// 批量创建<#=table_comment#>
pub async fn creates_<#=table#>(
  inputs: Vec<<#=tableUP#>Input>,
  options: Option<Options>,
) -> Result<Vec<<#=Table_Up#>Id>> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "creates_<#=table#>";
  
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
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<<#=tableUP#>Input>,
  options: Option<Options>,
) -> Result<Vec<<#=Table_Up#>Id>> {
  
  let table = "<#=mod#>_<#=table#>";
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();<#
  if (autoCodeColumn) {
    const dateSeq = autoCodeColumn.autoCode.dateSeq;
  #>
  
  // 设置自动编码
  let mut inputs = inputs;
  for input in &mut inputs {
    if input.<#=autoCodeColumn.COLUMN_NAME#>.is_some() && !input.<#=autoCodeColumn.COLUMN_NAME#>.as_ref().unwrap().is_empty() {
      continue;
    }
    let (<#
      if (dateSeq) {
      #>
      <#=dateSeq#>,<#
      }
      #>
      <#=autoCodeColumn.autoCode.seq#>,
      <#=autoCodeColumn.COLUMN_NAME#>,
    ) = find_auto_code_<#=table#>(options.clone()).await?;<#
    if (dateSeq) {
    #>
    input.<#=dateSeq#> = Some(<#=dateSeq#>);<#
    }
    #>
    input.<#=autoCodeColumn.autoCode.seq#> = Some(<#=autoCodeColumn.autoCode.seq#>);
    input.<#=autoCodeColumn.COLUMN_NAME#> = Some(<#=autoCodeColumn.COLUMN_NAME#>);
  }<#
  }
  #><#
  if (hasIsIcon) {
  #>
  
  // 设置图标
  let mut inputs = inputs;
  for input in &mut inputs {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.isVirtual) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "create_usr_id") continue;
      if (column_name === "create_time") continue;
      if (column_name === "update_usr_id") continue;
      if (column_name === "update_time") continue;
      const data_type = column.DATA_TYPE;
      const column_type = column.COLUMN_TYPE;
      const column_comment = column.COLUMN_COMMENT || "";
      const isIcon = column.isIcon;
      if (!isIcon) continue;
    #>
    // <#=column_comment#>
    if (input.<#=column_name#>.is_none() || input.<#=column_name#>.as_ref().unwrap().is_empty()) &&
      (input.<#=column_name#>_lbl.is_some() && !input.<#=column_name#>_lbl.as_ref().unwrap().is_empty())
    {
      let <#=column_name#>_lbl = input.<#=column_name#>_lbl.as_ref().unwrap();
      let mut hash = sha2::Sha256::new();
      hash.update(<#=column_name#>_lbl.clone().as_bytes());
      let hash = hash.finalize();
      let bytes = hash.as_slice();
      let <#=column_name#> = general_purpose::STANDARD.encode(bytes);
      let <#=column_name#> = <#=column_name#>.get(0..22).unwrap().to_string();
      let stat = head_object(&<#=column_name#>).await?;
      if stat.is_none() {
        let content_type = <#=column_name#>_lbl
          .get(<#=column_name#>_lbl.find("data:").unwrap_or_default() + 5..<#=column_name#>_lbl.find(";").unwrap_or(icon_lbl.len()))
          .unwrap_or_default();
        if !content_type.starts_with("image/") {
          error!(
            "{req_id} <#=column_name#>_lbl is not image: {<#=column_name#>_lbl}",
            req_id = get_req_id(),
          );
          return Err(eyre!("<#=column_name#>_lbl is not image"));
        }<#
        if (hasTenant_id) {
        #>
        let tenant_id = {
          if input.tenant_id.is_some() {
            input.tenant_id.clone()
          } else {
            get_auth_tenant_id()
          }
        };<#
        }
        #>
        put_object(
          &<#=column_name#>,
          <#=column_name#>_lbl.clone().as_bytes(),
          content_type,
          &<#=column_name#>,<#
          if (column.isPublicAtt) {
          #>
          Some("1"),<#
          } else {
          #>
          Some("0"),<#
          }
          #><#
          if (hasTenant_id) {
          #>
          tenant_id,<#
          } else {
          #>
          None,<#
          }
          #>
          Some("<#=table_name#>.<#=column_name#>"),
          Some(&<#=column_name#>),
        ).await?;
      }
      input.<#=column_name#> = Some(<#=column_name#>);
    }<#
    }
    #>
  }<#
  }
  #>
  
  let mut ids2: Vec<<#=Table_Up#>Id> = vec![];
  let mut inputs2: Vec<<#=tableUP#>Input> = vec![];
  
  for input in inputs<#
  if (opts.langTable && isUseI18n) {
  #>.clone()<#
  }
  #> {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
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
      input.menu_ids = crate::common::tenant::tenant_dao::filter_menu_ids_by_tenant(
        input.menu_ids.unwrap(),
      ).await?.into();
    }
    let input = input;<#
    }
    #>
    
    let old_models = find_by_unique_<#=table#>(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<<#=Table_Up#>Id> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique_<#=table#>(
          input.clone(),
          old_model,
          Some(options),
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
    
    if !is_silent_mode {
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
    if (hasUpdateTime) {
    #>
    
    if let Some(update_time) = input.update_time {
      sql_values += ",?";
      args.push(update_time.into());
    } else {
      sql_values += ",null";
    }<#
    }
    #><#
    if (hasCreateUsrId && !hasCreateUsrIdLbl) {
    #>
    
    if !is_silent_mode {
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
    } else if let Some(create_usr_id) = input.create_usr_id {
      sql_values += ",?";
      args.push(create_usr_id.into());
    } else {
      sql_values += ",default";
    }<#
    } else if (hasCreateUsrId && hasCreateUsrIdLbl) {
    #>
    
    if !is_silent_mode {
      if input.create_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.clone().unwrap(),
            options.clone(),
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
          options.clone(),
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
  
  let options = Some(options);<#
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
  
  let affected_rows = execute(
    sql,
    args,
    options.clone(),
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
  
  if affected_rows != inputs2_len as u64 {
    return Err(eyre!("affectedRows: {affected_rows} != {inputs2_len}"));
  }<#
  if (opts.langTable && isUseI18n) {
  #>
  for input in inputs.iter() {
    refresh_lang_by_input(input, options.clone()).await?;
  }<#
  }
  #><#
  let hasMany2manyInputs2 = false;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
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
    if (foreignKey && foreignKey.type === "many2many") {
      if (column.inlineMany2manyTab) continue;
      hasMany2manyInputs2 = true;
      break;
    }
    if (inlineForeignTabs.length > 0) {
      hasMany2manyInputs2 = true;
      break;
    }
    if (column.inlineMany2manyTab) {
      hasMany2manyInputs2 = true;
      break;
    }
  }
  #><#
  if (hasMany2manyInputs2) {
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
          options.clone(),
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
        options.clone(),
      ).await?;
    }<#
      }
    #><#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
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
          options.clone(),
        ).await?;
      }
    }<#
    }
    #>
  }<#
  }
  #>
  
  Ok(ids2)
}<#
const dateSeq = autoCodeColumn?.autoCode?.dateSeq;
if (autoCodeColumn && !dateSeq) {
#>

// MARK: find_auto_code_<#=table#>
/// 获得 <#=table_comment#> 自动编码
pub async fn find_auto_code_<#=table#>(
  options: Option<Options>,
) -> Result<(u32, String)> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_auto_code_<#=table#>";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let model = find_one_<#=table#>(
    None,
    Some(vec![
      SortInput {
        prop: "<#=autoCodeColumn.autoCode.seq#>".to_owned(),
        order: SortOrderEnum::Desc,
      },
    ]),
    options.clone(),
  ).await?;
  
  let <#=autoCodeColumn.autoCode.seq#> = model
    .as_ref()
    .map_or(0, |item| item.<#=autoCodeColumn.autoCode.seq#>) + 1;
  
  let model_deleted = find_one_<#=table#>(
    Some(<#=Table_Up#>Search {
      is_deleted: Some(1),
      ..Default::default()
    }),
    Some(vec![
      SortInput {
        prop: "<#=autoCodeColumn.autoCode.seq#>".to_owned(),
        order: SortOrderEnum::Desc,
      },
    ]),
    options.clone(),
  ).await?;
  
  let <#=autoCodeColumn.autoCode.seq#>_deleted = model_deleted
    .as_ref()
    .map_or(0, |item| item.<#=autoCodeColumn.autoCode.seq#>) + 1;
  
  let <#=autoCodeColumn.autoCode.seq#> = if <#=autoCodeColumn.autoCode.seq#>_deleted > <#=autoCodeColumn.autoCode.seq#> {
    <#=autoCodeColumn.autoCode.seq#>_deleted
  } else {
    <#=autoCodeColumn.autoCode.seq#>
  };
  
  let <#=autoCodeColumn.COLUMN_NAME#> = format!("<#=autoCodeColumn.autoCode.prefix#>{:0<#=autoCodeColumn.autoCode.seqPadStart0#>}<#=autoCodeColumn.autoCode.suffix#>", <#=autoCodeColumn.autoCode.seq#>);
  
  Ok((<#=autoCodeColumn.autoCode.seq#>, <#=autoCodeColumn.COLUMN_NAME#>))
}<#
} else if (autoCodeColumn && dateSeq) {
#>

// MARK: find_auto_code_<#=table#>
/// 获得 <#=table_comment#> 自动编码
pub async fn find_auto_code_<#=table#>(
  options: Option<Options>,
) -> Result<(chrono::NaiveDate, u32, String)> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_auto_code_<#=table#>";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let model = find_one_<#=table#>(
    None,
    Some(vec![
      SortInput {
        prop: "<#=dateSeq#>".to_owned(),
        order: SortOrderEnum::Desc,
      },
      SortInput {
        prop: "<#=autoCodeColumn.autoCode.seq#>".to_owned(),
        order: SortOrderEnum::Desc,
      },
    ]),
    options.clone(),
  ).await?;
  
  let now = get_now();
  let <#=dateSeq#> = now.format("%Y%m%d").to_string();
  
  let <#=dateSeq#>_old = model
    .as_ref()
    .map(|item|
      item.<#=dateSeq#>.format("%Y%m%d").to_string()
    );
  
  let <#=autoCodeColumn.autoCode.seq#>: u32 = {
    if <#=dateSeq#>_old.is_none() || <#=dateSeq#> != <#=dateSeq#>_old.unwrap() {
      1
    } else {
      
      let model_deleted = find_one_<#=table#>(
        Some(<#=Table_Up#>Search {
          <#=dateSeq#>: Some([ Some(item.<#=dateSeq#>), Some(item.<#=dateSeq#>) ]),
          is_deleted: Some(0),
          ..Default::default()
        }),
        Some(vec![
          SortInput {
            prop: "<#=dateSeq#>".to_owned(),
            order: SortOrderEnum::Desc,
          },
          SortInput {
            prop: "<#=autoCodeColumn.autoCode.seq#>".to_owned(),
            order: SortOrderEnum::Desc,
          },
        ]),
        options,
      ).await?;
      
      let seq = model
        .as_ref()
        .map_or(0, |item| item.<#=autoCodeColumn.autoCode.seq#>) + 1;
      
      let seq_deleted = model_deleted
        .as_ref()
        .map_or(0, |item| item.<#=autoCodeColumn.autoCode.seq#>) + 1;
      
      if seq_deleted > seq {
        seq_deleted
      } else {
        seq
      }
    }
  };
  
  let <#=autoCodeColumn.COLUMN_NAME#> = format!("<#=autoCodeColumn.autoCode.prefix#>{}{:0<#=autoCodeColumn.autoCode.seqPadStart0#>}<#=autoCodeColumn.autoCode.suffix#>", <#=dateSeq#>, <#=autoCodeColumn.autoCode.seq#>);
  
  Ok((now.date(), <#=autoCodeColumn.autoCode.seq#>, <#=autoCodeColumn.COLUMN_NAME#>))
}<#
}
#>

// MARK: create_return_<#=table#>
/// 创建<#=table_comment#>并返回
#[allow(dead_code)]
pub async fn create_return_<#=table#>(
  #[allow(unused_mut)]
  mut input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<<#=Table_Up#>Model> {
  
  let id = create_<#=table#>(
    input.clone(),
    options.clone(),
  ).await?;
  
  let model_<#=table#> = find_by_id_<#=table#>(
    id,
    options,
  ).await?;
  
  if model_<#=table#>.is_none() {
    let err_msg = "create_return_<#=table#>: model_<#=table#>.is_none()";
    return Err(eyre!(
      ServiceException {
        code: String::new(),
        message: err_msg.to_owned(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  let model_<#=table#> = model_<#=table#>.unwrap();
  
  Ok(model_<#=table#>)
}

// MARK: create_<#=table#>
/// 创建<#=table_comment#>
#[allow(dead_code)]
pub async fn create_<#=table#>(
  #[allow(unused_mut)]
  mut input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<<#=Table_Up#>Id> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "create_<#=table#>";
  
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
    return Err(eyre!("_creates: Create failed in dao: {table}"));
  }
  let id = ids[0].clone();
  
  Ok(id)
}<#
if (hasTenantId) {
#>

// MARK: update_tenant_by_id_<#=table#>
/// <#=table_comment#>根据id修改租户id
pub async fn update_tenant_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = "<#=mod#>_<#=table#>";
  let method = "update_tenant_by_id_<#=table#>";
  
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
    .set_is_debug(Some(false));
  
  let mut args = QueryArgs::new();
  
  args.push(tenant_id.into());
  args.push(id.into());
  
  let sql = format!("update {table} set tenant_id=? where id=?");
  
  let args: Vec<_> = args.into();
  
  let num = execute(
    sql,
    args,
    Some(options.clone()),
  ).await?;
  
  Ok(num)
}<#
}
#><#
if (hasVersion) {
#>

// MARK: get_version_by_id_<#=table#>
pub async fn get_version_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<Option<u32>> {
  
  let <#=table#>_model = find_by_id_<#=table#>(
    id,
    options,
  ).await?;
  
  if let Some(<#=table#>_model) = <#=table#>_model {
    return Ok(<#=table#>_model.version.into());
  }
  
  Ok(0.into())
}<#
}
#><#
if (hasDataPermit() && hasCreateUsrId) {
#>

// MARK: get_editable_data_permits_by_ids_<#=table#>
/// 根据 ids 获取<#=table_comment#>是否可编辑数据权限
pub async fn get_editable_data_permits_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<Vec<u8>> {
  if ids.is_empty() {
    return Ok(vec![]);
  }
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = options.set_is_debug(Some(false));
  let options = Some(options);
  
  let data_permit_models = get_data_permits(
    get_route_path_<#=table#>(),
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
  
  let models = find_all_<#=table#>(
    <#=Table_Up#>Search {
      ids: ids.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options,
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
      let dept_ids = get_auth_and_parents_dept_ids().await?;
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
#><#
if (opts.langTable && isUseI18n) {
#>

#[allow(unused_variables)]
async fn refresh_lang_by_input(
  input: &<#=tableUP#>Input,
  options: Option<Options>,
) -> Result<()> {
  
  if input.id.is_none() || input.id.as_ref().unwrap().is_empty() {
    return Err(eyre!("refresh_lang_by_input: input.id is empty"));
  }
  
  let server_i18n_enable = get_server_i18n_enable();
  
  if !server_i18n_enable {
    return Ok(());
  }<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
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
    const ForeighTableUp = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const modelLabel = column.modelLabel;
    if (!modelLabel) continue;
    if (!langTableRecords.some((item) => item.COLUMN_NAME === modelLabel)) {
      continue;
    }
    let foreignSchema = undefined;
    const foreignLangTableRecords = [ ];
    if (foreignKey) {
      foreignSchema = optTables[foreignKey.mod + "_" + foreignKey.table];
      for (let i = 0; i < (foreignSchema.opts.langTable?.records?.length || 0); i++) {
        const record = foreignSchema.opts.langTable.records[i];
        const column_name = record.COLUMN_NAME;
        if (
          langTableExcludeArr.includes(column_name)
        ) continue;
        foreignLangTableRecords.push(record);
      }
    }
  #>
  
  // <#=column_comment#>
  {
    #[derive(Serialize, Deserialize, sqlx::FromRow)]
    struct ResultTmp {
      lang_id: String,
      <#=foreignKey.lbl#>: String,
    }
    #[derive(Serialize, Deserialize, sqlx::FromRow)]
    struct ResultTmp2 {
      lang_id: String,
      <#=modelLabel#>: String,
    }
    let sql = "select lang_id,<#=foreignKey.lbl#> from <#=foreignSchema.opts.langTable.opts.table_name#> where <#=foreignTable#>_id=?".to_owned();
    let mut args = QueryArgs::new();
    args.push(input.<#=column_name#>.clone().into());
    let models = query::<ResultTmp>(
      sql,
      args.into(),
      options.clone(),
    ).await?;
    for model in models {
      let sql = "select id,<#=modelLabel#> from <#=opts.langTable.opts.table_name#> where lang_id=? and <#=table#>_id=?";
      let mut args = QueryArgs::new();
      args.push(model.lang_id.into());
      args.push(input.id.clone().unwrap_or_default().into());
      let lang_model = query_one::<ResultTmp2>(
        sql,
        args.into(),
        options.clone(),
      ).await?;
      let lang_id: Option<LangId> = lang_model.map(|item| item.lang_id.unwrap_or_default()).into();
      if lang_id.is_none() {
        let lang_sql = "insert into <#=opts.langTable.opts.table_name#>(id,lang_id,<#=table#>_id,<#=modelLabel#>)values(?,?,?,?)".to_owned();
        let mut lang_args = QueryArgs::new();
        let id: LangId = get_short_uuid().into();
        lang_args.push(id.into());
        lang_args.push(model.lang_id.into());
        lang_args.push(input.id.clone().unwrap_or_default().into());
        lang_args.push(model.<#=foreignKey.lbl#>.into());
        execute(
          lang_sql,
          lang_args.into(),
          options.clone(),
        ).await?;
        continue;
      }
      let lang_id = lang_id.unwrap();
      let lang_model = lang_model.unwrap();
      if lang_model.<#=modelLabel#> != model.<#=foreignKey.lbl#> {
        let lang_sql = "update <#=opts.langTable.opts.table_name#> set <#=modelLabel#>=? where id=?";
        let mut lang_args = QueryArgs::new();
        lang_args.push(model.<#=foreignKey.lbl#>.into());
        lang_args.push(lang_id.into());
        execute(
          lang_sql,
          lang_args.into(),
          options.clone(),
        ).await?;
      }
    }
  }<#
  }
  #>
  #[derive(Serialize, Deserialize, sqlx::FromRow)]
  struct ResultTmp {
    id: String,
  }
  let lang_sql = "select id from <#=opts.langTable.opts.table_name#> where lang_id=? and <#=table#>_id=?".to_owned();
  let mut lang_args = QueryArgs::new();
  lang_args.push(get_lang_id().await?.unwrap_or_default().to_string().into());
  lang_args.push(input.id.clone().unwrap_or_default().clone().into());
  let model = query_one::<ResultTmp>(
    lang_sql,
    lang_args.into(),
    options.clone(),
  ).await?;
  let lang_id: Option<LangId> = model.map(|item| item.id).map(|item| item.into());
  if let Some(lang_id) = lang_id {
    let mut lang_sql = "update <#=opts.langTable.opts.table_name#> set ".to_owned();
    let mut lang_args = QueryArgs::new();<#
    for (let i = 0; i < langTableRecords.length; i++) {
      const record = langTableRecords[i];
      const column_name = record.COLUMN_NAME;
      const column_name_rust = rustKeyEscape(column_name);
      const column_name_mysql = mysqlKeyEscape(column_name);
      const column_comment = record.COLUMN_COMMENT || "";
    #>
    // <#=column_comment#>
    if input.<#=column_name_rust#>.is_some() {
      lang_sql += "<#=column_name_mysql#>=?,";
      lang_args.push(input.<#=column_name_rust#>.clone().unwrap_or_default().into());
    }<#
    }
    #>
    lang_sql.pop();
    lang_sql += " where id=?";
    lang_args.push(lang_id.into());
    execute(
      lang_sql,
      lang_args.into(),
      options.clone(),
    ).await?;
  } else {
    let mut sql_fields: Vec<&'static str> = vec![];
    let mut lang_args = QueryArgs::new();
    let id: LangId = get_short_uuid().into();
    lang_args.push(id.into());
    lang_args.push(get_lang_id().await?.unwrap_or_default().to_string().into());
    lang_args.push(input.id.clone().unwrap_or_default().clone().into());<#
    for (let i = 0; i < langTableRecords.length; i++) {
      const record = langTableRecords[i];
      const column_name = record.COLUMN_NAME;
      const column_name_rust = rustKeyEscape(column_name);
      const column_name_mysql = mysqlKeyEscape(column_name);
      const column_comment = record.COLUMN_COMMENT || "";
    #>
    // <#=column_comment#>
    if input.<#=column_name_rust#>.is_some() {
      sql_fields.push("<#=column_name_mysql#>");
      lang_args.push(input.<#=column_name_rust#>.clone().unwrap_or_default().into());
    }<#
    }
    #>
    let mut lang_sql = "insert into <#=opts.langTable.opts.table_name#>(id,lang_id,<#=table#>_id".to_owned();
    let sql_fields_len = sql_fields.len();
    for sql_field in sql_fields {
      lang_sql += ",";
      lang_sql += sql_field;
    }
    lang_sql += ")values(?,?,?";
    for _ in 0..sql_fields_len {
      lang_sql += ",?";
    }
    lang_sql += ")";
    execute(
      lang_sql,
      lang_args.into(),
      options.clone(),
    ).await?;
  }
  
  Ok(())
}<#
}
#>

// MARK: update_by_id_<#=table#>
/// 根据 id 修改<#=table_comment#>
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  mut input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<<#=Table_Up#>Id> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "update_by_id_<#=table#>";
  
  let is_debug = get_is_debug(options.as_ref());<#
  if (hasVersion || hasUpdateUsrId || hasUpdateTime) {
  #>
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());<#
  }
  #>
  let is_creating = get_is_creating(options.as_ref());<#
  if (opts.langTable && isUseI18n) {
  #>
  
  let server_i18n_enable = get_server_i18n_enable();<#
  }
  #>
  
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
    .set_is_debug(Some(false));
  let options = Some(options);<#
  if (mod === "base" && table === "role") {
  #>
  
  if input.menu_ids.is_some() {
    input.menu_ids = crate::common::tenant::tenant_dao::filter_menu_ids_by_tenant(
      input.menu_ids.unwrap(),
    ).await?.into();
  }<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "create_usr_id") continue;
    if (column_name === "create_time") continue;
    if (column_name === "update_usr_id") continue;
    if (column_name === "update_time") continue;
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE;
    const column_comment = column.COLUMN_COMMENT || "";
    const isIcon = column.isIcon;
    if (!isIcon) continue;
  #>
  // <#=column_comment#>
  if (input.<#=column_name#>.is_none() || input.<#=column_name#>.as_ref().unwrap().is_empty()) &&
    (input.<#=column_name#>_lbl.is_some() && !input.<#=column_name#>_lbl.as_ref().unwrap().is_empty())
  {
    let <#=column_name#>_lbl = input.<#=column_name#>_lbl.as_ref().unwrap();
    let mut hash = sha2::Sha256::new();
    hash.update(<#=column_name#>_lbl.clone().as_bytes());
    let hash = hash.finalize();
    let bytes = hash.as_slice();
    let <#=column_name#> = general_purpose::STANDARD.encode(bytes);
    let <#=column_name#> = <#=column_name#>.get(0..22).unwrap().to_string();
    let stat = head_object(&<#=column_name#>).await?;
    if stat.is_none() {
      let content_type = <#=column_name#>_lbl
        .get(<#=column_name#>_lbl.find("data:").unwrap_or_default() + 5..<#=column_name#>_lbl.find(";").unwrap_or(icon_lbl.len()))
        .unwrap_or_default();
      if !content_type.starts_with("image/") {
        error!(
          "{req_id} <#=column_name#>_lbl is not image: {<#=column_name#>_lbl}",
          req_id = get_req_id(),
        );
        return Err(eyre!("<#=column_name#>_lbl is not image"));
      }<#
      if (hasTenant_id) {
      #>
      let tenant_id = {
        if input.tenant_id.is_some() {
          input.tenant_id.clone()
        } else {
          get_auth_tenant_id()
        }
      };<#
      }
      #>
      put_object(
        &<#=column_name#>,
        <#=column_name#>_lbl.clone().as_bytes(),
        content_type,
        &<#=column_name#>,<#
        if (column.isPublicAtt) {
        #>
        Some("1"),<#
        } else {
        #>
        Some("0"),<#
        }
        #><#
        if (hasTenant_id) {
        #>
        tenant_id,<#
        } else {
        #>
        None,<#
        }
        #>
        Some("<#=table_name#>.<#=column_name#>"),
        Some(&<#=column_name#>),
      ).await?;
    }
    input.<#=column_name#> = Some(<#=column_name#>);
  }<#
  }
  #>
  
  let old_model = find_by_id_<#=table#>(
    id.clone(),
    options.clone(),
  ).await?;
  
  if old_model.is_none() {<#
    if (isUseI18n) {
    #>
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
    ).await?;<#
    } else {
    #>
    let err_msg = "编辑失败, 此 <#=table_comment#> 已被删除";<#
    }
    #>
    return Err(eyre!(err_msg));
  }
  let old_model = old_model.unwrap();<#
  if (hasVersion || hasUpdateUsrId || hasUpdateTime) {
  #>
  
  if !is_silent_mode {
    info!(
      "{} {}.{}: {}",
      get_req_id(),
      table,
      method,
      serde_json::to_string(&old_model)?,
    );
  }<#
  }
  #><#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let data_permit_models = get_data_permits(
    get_route_path_<#=table#>(),
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
  
  async fn get_not_permit_err_fn() -> Result<<#=Table_Up#>Id> {<#
    if (isUseI18n) {
    #>
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
    ).await?;<#
    } else {
    #>
    let err_msg = "没有权限编辑此 <#=table_comment#>";<#
    }
    #>
    Err(eyre!(err_msg))
  }
  
  if !data_permit_models.is_empty() && !has_tenant_permit && !has_dept_permit && !has_dept_parent_permit && !has_role_permit && !has_create_permit {
    return get_not_permit_err_fn().await;
  } else if !has_tenant_permit && has_dept_parent_permit {
    let dept_ids = get_auth_and_parents_dept_ids().await?;
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
  #><#
  if (opts.langTable && isUseI18n) {
  #>
  
  if server_i18n_enable {
    let mut input = input.clone();
    input.id = Some(id.clone());
    refresh_lang_by_input(
      &input,
      options.clone(),
    ).await?;
  }<#
  }
  #>
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique_<#=table#>(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<<#=tableUP#>Model>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {<#
        if (isUseI18n) {
        #>
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
        ).await?;<#
        } else {
        #>
        let err_msg = "此 <#=table_comment#> 已经存在";<#
        }
        #>
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
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
      field_num += 1;<#
      if (!langTableRecords.some((item) => item.COLUMN_NAME === modelLabel)) {
      #>
      sql_fields += "<#=modelLabel#>=?,";
      args.push(<#=modelLabel#>.into());<#
      } else {
      #><#
      if (isUseI18n) {
      #>
      if !server_i18n_enable {
        sql_fields += "<#=modelLabel#>=?,";
        args.push(<#=modelLabel#>.into());
      }<#
      } else {
      #>
      sql_fields += "<#=modelLabel#>=?,";
      args.push(<#=modelLabel#>.into());<#
      }
      #><#
      }
      #>
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
    field_num += 1;<#
      if (!langTableRecords.some((item) => item.COLUMN_NAME === column_name)) {
    #>
    sql_fields += "<#=column_name_mysql#>=?,";
    args.push(<#=column_name_rust#>.into());<#
      } else {
    #><#
    if (isUseI18n) {
    #>
    if !server_i18n_enable {
      sql_fields += "<#=column_name_mysql#>=?,";
      args.push(<#=column_name_rust#>.into());
    }<#
    } else {
    #>
    sql_fields += "<#=column_name_mysql#>=?,";
    args.push(<#=column_name_rust#>.into());<#
    }
    #><#
      }
    #>
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
    field_num += 1;<#
      if (!langTableRecords.some((item) => item.COLUMN_NAME === val)) {
    #>
    sql_fields += "<#=val_mysql#>=?,";
    args.push(<#=rustKeyEscape(val)#>.into());<#
      } else {
    #><#
    if (isUseI18n) {
    #>
    if !server_i18n_enable {
      sql_fields += "<#=val_mysql#>=?,";
      args.push(<#=rustKeyEscape(val)#>.into());
    }<#
    } else {
    #>
    sql_fields += "<#=val_mysql#>=?,";
    args.push(<#=rustKeyEscape(val)#>.into());<#
    }
    #><#
      }
    #>
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
      options.clone(),
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
        options.clone(),
      ).await?;
    }
    for mut input in <#=inline_column_name#>_input {
      if input.id.is_none() {
        input.<#=inlineForeignTab.column#> = id.clone().into();
        create_<#=table#>(
          input,
          options.clone(),
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
          options.clone(),
        ).await?;
      }
      input.id = None;
      update_by_id_<#=table#>(
        id.clone(),
        input,
        options.clone(),
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
      options.clone(),
    ).await?;
    for model in <#=inline_column_name#>_models.clone() {
      if <#=inline_column_name#>_input.id == model.id.clone().into() {
        continue;
      }
      delete_by_ids_<#=table#>(
        vec![model.id],
        options.clone(),
      ).await?;
    }
    if let Some(id) = <#=inline_column_name#>_input.id.clone() {
      if !<#=inline_column_name#>_models
        .iter()
        .any(|item| item.id == id)
      {
        revert_by_ids_<#=table#>(
          vec![id.clone()],
          options.clone(),
        ).await?;
      }
      let mut <#=inline_column_name#>_input = <#=inline_column_name#>_input;
      <#=inline_column_name#>_input.id = None;
      update_by_id_<#=table#>(
        id.clone(),
        <#=inline_column_name#>_input,
        options.clone(),
      ).await?;
    } else {
      let mut <#=inline_column_name#>_input = <#=inline_column_name#>_input;
      <#=inline_column_name#>_input.<#=inlineForeignTab.column#> = id.clone().into();
      create_<#=table#>(
        <#=inline_column_name#>_input,
        options.clone(),
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
      options.clone(),
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
        options.clone(),
      ).await?;
    }
    
    for UpdateModel { id, input } in <#=table#>_update_models {
      let mut input = input;
      input.id = None;
      update_by_id_<#=table#>(
        id,
        input,
        options.clone(),
      ).await?;
    }
    
    delete_by_ids_<#=table#>(
      <#=table#>_delete_ids.clone(),
      options.clone(),
    ).await?;
    
    force_delete_by_ids_<#=table#>(
      <#=table#>_delete_ids,
      options.clone(),
    ).await?;
    
    field_num += 1;
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
    const column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
  #><#
  if (foreignKey && foreignKey.type === "many2many") {
    if (column.inlineMany2manyTab) continue;
  #>
  
  // <#=column_comment#>
  if input.<#=column_name_rust#>.is_some() {
    field_num += 1;
  }<#
  }
  #><#
  }
  #>
  
  if field_num > 0 {<#
    if (hasVersion) {
    #>
    if !is_silent_mode {
      if let Some(version) = input.version {
        if version > 0 {
          let version2 = get_version_by_id_<#=table#>(id.clone(), options.clone()).await?;
          if let Some(version2) = version2 {
            if version2 > version {<#
              if (isUseI18n) {
              #>
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
              ).await?;<#
              } else {
              #>
              let err_msg = "此 <#=table_comment#> 已被修改，请刷新后重试";<#
              }
              #>
              return Err(eyre!(err_msg));
            }
          }
          sql_fields += "version=?,";
          args.push((version + 1).into());
        }
      }
    } else if let Some(version) = input.version {
      sql_fields += "version=?,";
      args.push((version).into());
    }<#
    }
    #><#
    if (hasUpdateUsrId && !hasUpdateUsrIdLbl) {
    #>
    if !is_silent_mode && !is_creating {
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
      }
    } else if let Some(update_usr_id) = input.update_usr_id {
      if update_usr_id.as_str() != "-" {
        sql_fields += "update_usr_id=?,";
        args.push(update_usr_id.into());
      }
    }<#
    } else if (hasUpdateUsrId && hasUpdateUsrIdLbl) {
    #>
    if !is_silent_mode && !is_creating {
      if input.update_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_id_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.clone().unwrap(),
            options.clone(),
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
            options.clone(),
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
      }
    } else {
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
      }
    }<#
    }
    #><#
    if (hasUpdateTime) {
    #>
    if !is_silent_mode && !is_creating {
      if let Some(update_time) = input.update_time {
        sql_fields += "update_time=?,";
        args.push(update_time.into());
      } else {
        sql_fields += "update_time=?,";
        args.push(get_now().into());
      }
    } else if let Some(update_time) = input.update_time {
      sql_fields += "update_time=?,";
      args.push(update_time.into());
    }<#
    }
    #>
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql_where = "id=?";
    args.push(id.clone().into());
    
    let sql = format!("update {table} set {sql_fields} where {sql_where} limit 1");
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_cache_tables());<#
    }
    #>
    
    let options = Some(options);<#
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
      options.clone(),
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
    const column_comment = column.COLUMN_COMMENT || "";
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
  if (cache) {
  #>
  
  if field_num > 0 {
    let options = Options::from(options);
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
    crate::<#=mod#>::<#=historyTable#>::<#=historyTable#>_dao::create(
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

// MARK: del_cache_<#=table#>
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_<#=table#>() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

// MARK: delete_by_ids_<#=table#>
/// 根据 ids 删除<#=table_comment#>
#[allow(unused_variables)]
pub async fn delete_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "delete_by_ids_<#=table#>";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());<#
  if (opts.langTable && isUseI18n) {
  #>
  let server_i18n_enable = get_server_i18n_enable();<#
  }
  #>
  
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
  
  if ids.len() as u64 > MAX_SAFE_INTEGER {
    return Err(eyre!("ids.len(): {} > MAX_SAFE_INTEGER", ids.len()));
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
    get_route_path_<#=table#>(),
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
  
  async fn get_not_permit_err_fn() -> Result<u64> {<#
    if (isUseI18n) {
    #>
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
    ).await?;<#
    } else {
    #>
    let err_msg = "没有权限删除此 <#=table_comment#>";<#
    }
    #>
    Err(eyre!(err_msg))
  }
  
  if !data_permit_models.is_empty() && !has_tenant_permit && !has_dept_permit && !has_dept_parent_permit && !has_role_permit && !has_create_permit {
    return get_not_permit_err_fn().await;
  }<#
  }
  #>
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_by_id_<#=table#>(
      id.clone(),
      options.clone(),
    ).await?;
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
    if !is_silent_mode {
      info!(
        "{} {}.{}: {}",
        get_req_id(),
        table,
        method,
        serde_json::to_string(&old_model)?,
      );
    }<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    
    if !has_tenant_permit && !has_dept_permit && !has_dept_parent_permit && !has_role_permit && has_create_permit {
      let usr_id = get_auth_id().unwrap_or_default();
      if old_model.create_usr_id != usr_id {
        return get_not_permit_err_fn().await;
      }
    } else if !has_tenant_permit && has_dept_parent_permit {
      let dept_ids = get_auth_and_parents_dept_ids().await?;
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
    sql_fields.push_str("is_deleted=1,");<#
    if (hasDeleteUsrId || hasDeleteUsrIdLbl) {
    #>
    let mut usr_id = get_auth_id();
    let mut usr_lbl = String::new();
    if usr_id.is_some() {
      let usr_model = find_by_id_usr(
        usr_id.clone().unwrap(),
        options.clone(),
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
    
    if !is_silent_mode && !is_creating {
      if let Some(usr_id) = usr_id {
        sql_fields.push_str("delete_usr_id=?,");
        args.push(usr_id.into());
      }
    }<#
    }
    #><#
    if (hasDeleteUsrIdLbl) {
    #>
    
    if !is_silent_mode && !is_creating {
      sql_fields.push_str("delete_usr_id_lbl=?,");
      args.push(usr_lbl.into());
    }<#
    }
    #><#
    if (hasDeleteTime) {
    #>
    
    if !is_silent_mode && !is_creating {
      sql_fields.push_str("delete_time=?,");
      args.push(get_now().into());
    }<#
    }
    #>
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql = format!("update {table} set {sql_fields} where id=? limit 1");<#
    } else {
    #>
    
    let sql = format!("delete from {table} where id=? limit 1");<#
    }
    #>
    
    args.push(id.clone().into());
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_cache_tables());<#
    }
    #>
    
    let options = Some(options);
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;<#
    if (opts.langTable && isUseI18n) {
    #>
    
    if server_i18n_enable {<#
      if (hasIsDeleted) {
      #>
      let sql = "update <#=opts.langTable.opts.table_name#> set is_deleted=1 where <#=table#>_id=?".to_owned();<#
      } else {
      #>
      let sql = "delete from <#=opts.langTable.opts.table_name#> where <#=table#>_id=?".to_owned();<#
      }
      #>
      let mut args = QueryArgs::new();
      args.push(id.clone().into());
      execute(
        sql,
        args.into(),
        options.clone(),
      ).await?;
    }<#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.inlineMany2manyTab) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      const many2many_no_cascade_delete = foreignKey.many2many_no_cascade_delete;
      const many2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
      if (!many2manySchema) {
        throw `many2many 中的表: ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
        process.exit(1);
      }
    #>
    {
      let <#=column_name#> = old_model.<#=column_name#>.clone();
      if !<#=column_name#>.is_empty() {
        let mut args = QueryArgs::new();<#
        if (!many2many_no_cascade_delete) {
        #><#
        if (hasIsDeleted) {
        #>
        let mut sql = "update <#=mod#>_<#=many2many.table#> set is_deleted=1 where <#=many2many.column1#>=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(<#=column_name#>.len());
          for item in <#=column_name#> {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" <#=many2many.column2#> in (");
        sql.push_str(&arg);
        sql.push(')');
        sql.push_str(" and is_deleted=0");
        let sql = sql;<#
        } else {
        #>
        let mut sql = "delete from <#=mod#>_<#=many2many.table#> where <#=many2many.column1#>=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(<#=column_name#>.len());
          for item in <#=column_name#> {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" <#=many2many.column2#> in (");
        sql.push_str(&arg);
        sql.push(')');<#
        }
        #>
        let args: Vec<_> = args.into();
        execute(
          sql,
          args,
          options.clone(),
        ).await?;<#
        } else {
        #>
        let mut sql = "select count(id) as total from <#=mod#>_<#=many2many.table#> where <#=many2many.column1#>=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(<#=column_name#>.len());
          for item in <#=column_name#> {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" <#=many2many.column2#> in (");
        sql.push_str(&arg);
        sql.push(')');
        sql.push_str(" and is_deleted=0");
        let args: Vec<_> = args.into();
        let res: Option<CountModel> = query_one(
          sql,
          args,
          options.clone(),
        ).await?;
        
        let total = res
          .map(|item| item.total)
          .unwrap_or_default();
        
        if total <= 0 {<#
          if (isUseI18n) {
          #>
          let err_msg = i18n_dao::ns(
            "请先删除关联数据".to_owned(),
            None,
          ).await?;<#
          } else {
          #>
          let err_msg = "请先删除关联数据";<#
          }
          #>
          return Err(eyre!(err_msg));
        }<#
        }
        #>
      }
    }<#
    }
    #><#
    for (const table_name of table_names) {
    const optTable = optTables[table_name];
    const hasIsDeleted = optTable.columns.some((column) => column.COLUMN_NAME === "is_deleted");
    for (const column of optTable.columns) {
      if (column.inlineMany2manyTab) continue;
      const foreignKey = column.foreignKey;
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      if (foreignKey.mod !== mod || foreignKey.table !== table) continue;
      const many2many_no_cascade_delete = foreignKey.many2many_no_cascade_delete;
    #>
    {
      let mut args = QueryArgs::new();<#
      if (!many2many_no_cascade_delete) {
      #><#
      if (hasIsDeleted) {
      #>
      let sql = "update <#=mod#>_<#=many2many.table#> set is_deleted=1 where <#=many2many.column2#>=? and is_deleted=0".to_owned();
      args.push(id.clone().into());<#
      } else {
      #>
      let sql = "delete from <#=mod#>_<#=many2many.table#> where <#=many2many.column2#>=? and is_deleted=0".to_owned();
      args.push(id.clone().into());<#
      }
      #>
      let args: Vec<_> = args.into();
      execute(
        sql,
        args,
        options.clone(),
      ).await?;<#
      } else {
      #>
      let sql = "select count(id) as total from <#=mod#>_<#=many2many.table#> where <#=many2many.column2#>=? and is_deleted=0".to_owned();
      let args: Vec<_> = args.into();
      let res: Option<CountModel> = query_one(
        sql,
        args,
        options.clone(),
      ).await?;
        
      let total = res
        .map(|item| item.total)
        .unwrap_or_default();
      
      if total <= 0 {<#
        if (isUseI18n) {
        #>
        let err_msg = i18n_dao::ns(
          "请先删除关联数据".to_owned(),
          None,
        ).await?;<#
        } else {
        #>
        let err_msg = "请先删除关联数据";<#
        }
        #>
        return Err(eyre!(err_msg));
      }<#
      }
      #>
    }<#
    }
    #><#
    }
    #>
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
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
    options.clone(),
  ).await?;
  
  delete_by_ids_<#=table#>(
    <#=table#>_models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<<#=Table_Up#>Id>>(),
    options.clone(),
  ).await?;<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
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
    options.clone(),
  ).await?;
  
  force_delete_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<_>>(),
    options.clone(),
  ).await?;
  
  let <#=table#>_models = find_all_<#=table#>(
    <#=Table_Up#>Search {
      <#=many2many.column1#>: ids.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options.clone(),
  ).await?;
  
  delete_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<_>>(),
    options.clone(),
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
  #>
  
  Ok(num)
}<#
if (hasDefault) {
#>

// MARK: default_by_id_<#=table#>
/// 根据 id 设置默认<#=table_comment#>
pub async fn default_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "default_by_id_<#=table#>";
  
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
    .set_is_debug(Some(false));
  
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

// MARK: get_is_enabled_by_id_<#=table#>
/// 根据 id 查找<#=table_comment#>是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_<#=table#>(
    id,
    options,
  ).await?;
  
  let is_enabled = {
    if let Some(model) = model {
      model.is_enabled == 1
    } else {
      false
    }
  };
  
  Ok(is_enabled)
}

// MARK: enable_by_ids_<#=table#>
/// 根据 ids 启用或者禁用<#=table_comment#>
pub async fn enable_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "enable_by_ids_<#=table#>";
  
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
    .set_is_debug(Some(false));
  
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

// MARK: get_is_locked_by_id_<#=table#>
/// 根据 id 查找<#=table_comment#>是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_<#=table#>(
    id,
    options,
  ).await?;
  
  let is_locked = {
    if let Some(model) = model {
      model.is_locked == 1
    } else {
      false
    }
  };
  
  Ok(is_locked)
}

// MARK: lock_by_ids_<#=table#>
/// 根据 ids 锁定或者解锁<#=table_comment#>
pub async fn lock_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "lock_by_ids_<#=table#>";
  
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

// MARK: revert_by_ids_<#=table#>
/// 根据 ids 还原<#=table_comment#>
pub async fn revert_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "revert_by_ids_<#=table#>";
  
  let is_debug = get_is_debug(options.as_ref());<#
  if (opts.langTable && isUseI18n) {
  #>
  let server_i18n_enable = get_server_i18n_enable();<#
  }
  #>
  
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
  #>
  
  let options = Options::from(options)
    .set_is_debug(Some(false));<#
  if (cache) {
  #>
  let options = options.set_del_cache_key1s(get_cache_tables());<#
  }
  #>
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_deleted=0 where id=? limit 1");
    
    args.push(id.clone().into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one_<#=table#>(
      <#=tableUP#>Search {
        id: Some(id.clone()),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_<#=table#>(
        id.clone(),
        options.clone(),
      ).await?;
    }
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
    {
      let mut input: <#=tableUP#>Input = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_<#=table#>(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<<#=tableUP#>Model> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {<#
        if (isUseI18n) {
        #>
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
        ).await?;<#
        } else {
        #>
        let err_msg = "此 <#=table_comment#> 已经存在";<#
        }
        #>
        return Err(eyre!(err_msg));
      }
    }
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;<#
    if (opts.langTable && isUseI18n) {
    #>
    
    if server_i18n_enable {
      let sql = "update <#=opts.langTable.opts.table_name#> set is_deleted=0 where <#=table#>_id=?".to_owned();
      let mut args = QueryArgs::new();
      args.push(id.clone().into());
      execute(
        sql,
        args.into(),
        options.clone(),
      ).await?;
    }<#
    }
    #><#
    let has_many2many_no_cascade_delete_revert = false;
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.inlineMany2manyTab) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      const many2many_no_cascade_delete = foreignKey.many2many_no_cascade_delete;
      const many2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
      if (!many2manySchema) {
        throw `many2many 中的表: ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
        process.exit(1);
      }
      if (many2many_no_cascade_delete) continue;
      has_many2many_no_cascade_delete_revert = true;
    }
    #><#
    if (has_many2many_no_cascade_delete_revert) {
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.inlineMany2manyTab) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      const many2many_no_cascade_delete = foreignKey.many2many_no_cascade_delete;
      const many2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
      if (!many2manySchema) {
        throw `many2many 中的表: ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
        process.exit(1);
      }
      if (many2many_no_cascade_delete) continue;
    #>
    {
      let <#=column_name#> = old_model.<#=column_name#>.clone();
      if !<#=column_name#>.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update <#=mod#>_<#=many2many.table#> set is_deleted=0 where <#=many2many.column1#>=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(<#=column_name#>.len());
          for item in <#=column_name#> {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" <#=many2many.column2#> in (");
        sql.push_str(&arg);
        sql.push(')');
        sql.push_str(" and is_deleted=1");
        let sql = sql;
        let args: Vec<_> = args.into();
        execute(
          sql,
          args,
          options.clone(),
        ).await?;
      }
    }<#
    }
    #><#
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
    options.clone(),
  ).await?;
  
  revert_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<<#=Table_Up#>Id>>(),
    options.clone(),
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
    options.clone(),
  ).await?;
  
  revert_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .take(1)
      .map(|item| item.id)
      .collect::<Vec<<#=Table_Up#>Id>>(),
    options.clone(),
  ).await?;<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
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
    options.clone(),
  ).await?;
  
  revert_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<_>>(),
    options.clone(),
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
  #>
  
  Ok(num)
}<#
}
#><#
if (hasIsDeleted) {
#>

// MARK: force_delete_by_ids_<#=table#>
/// 根据 ids 彻底删除<#=table_comment#>
#[allow(unused_variables)]
pub async fn force_delete_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "force_delete_by_ids_<#=table#>";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());<#
  if (opts.langTable && isUseI18n) {
  #>
  let server_i18n_enable = get_server_i18n_enable();<#
  }
  #>
  
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
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_all_<#=table#>(
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
      options.clone(),
    ).await?.into_iter().next();
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
    if !is_silent_mode {
      info!(
        "{} {}.{}: {}",
        get_req_id(),
        table,
        method,
        serde_json::to_string(&old_model)?,
      );
    }
    
    let mut args = QueryArgs::new();
    
    let sql = format!("delete from {table} where id=?<#
    if (hasIsDeleted) {
    #> and is_deleted=1<#
    }
    #> limit 1");
    
    args.push(id.clone().into());
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_cache_tables());<#
    }
    #>
    
    let options = Some(options);<#
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
      options.clone(),
    ).await?;<#
    if (opts.langTable && isUseI18n) {
    #>
    
    if server_i18n_enable {
      let sql = "delete from <#=opts.langTable.opts.table_name#> where <#=table#>_id=?".to_owned();
      let mut args = QueryArgs::new();
      args.push(id.clone().into());
      execute(
        sql,
        args.into(),
        options.clone(),
      ).await?;
    }<#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.inlineMany2manyTab) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      const many2many_no_cascade_delete = foreignKey.many2many_no_cascade_delete;
      const many2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
      if (!many2manySchema) {
        throw `many2many 中的表: ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
        process.exit(1);
      }
    #>
    {
      let <#=column_name#> = old_model.<#=column_name#>.clone();
      if !<#=column_name#>.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "delete from <#=mod#>_<#=many2many.table#> where <#=many2many.column1#>=? and".to_owned();
        args.push(id.clone().into());
        let mut items = Vec::with_capacity(<#=column_name#>.len());
        for item in <#=column_name#> {
          items.push("?");
          args.push(item.clone().into());
        }
        sql.push_str(" <#=many2many.column2#> in (");
        sql.push_str(&items.join(","));
        sql.push(')');
        let args: Vec<_> = args.into();
        execute(
          sql,
          args,
          options.clone(),
        ).await?;
      }
    }<#
    }
    #><#
    for (const table_name of table_names) {
    const optTable = optTables[table_name];
    const hasIsDeleted = optTable.columns.some((column) => column.COLUMN_NAME === "is_deleted");
    for (const column of optTable.columns) {
      if (column.inlineMany2manyTab) continue;
      const foreignKey = column.foreignKey;
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      if (foreignKey.mod !== mod || foreignKey.table !== table) continue;
      const many2many_no_cascade_delete = foreignKey.many2many_no_cascade_delete;
    #>
    {
      let mut args = QueryArgs::new();
      let sql = "delete from <#=mod#>_<#=many2many.table#> where <#=many2many.column2#>=?".to_owned();
      args.push(id.clone().into());
      let args: Vec<_> = args.into();
      execute(
        sql,
        args,
        options.clone(),
      ).await?;
    }<#
    }
    #><#
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
    options.clone(),
  ).await?;
  
  force_delete_by_ids_<#=table#>(
    <#=table#>_models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<<#=Table_Up#>Id>>(),
    options.clone(),
  ).await?;<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
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
    options.clone(),
  ).await?;
  
  delete_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<_>>(),
    options.clone(),
  ).await?;
  
  let <#=table#>_models = find_all_<#=table#>(
    <#=Table_Up#>Search {
      <#=many2many.column1#>: ids.clone().into(),
      is_deleted: 1.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options.clone(),
  ).await?;
  
  force_delete_by_ids_<#=table#>(
    <#=table#>_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<_>>(),
    options.clone(),
  ).await?;<#
  }
  #>
  
  Ok(num)
}<#
}
#><#
if (hasOrderBy) {
#>

// MARK: find_last_order_by_<#=table#>
/// 查找 <#=table_comment#> order_by 字段的最大值
pub async fn find_last_order_by_<#=table#>(
  options: Option<Options>,
) -> Result<u32> {
  
  let table = "<#=mod#>_<#=table#>";
  let method = "find_last_order_by_<#=table#>";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let msg = format!("{table}.{method}:");
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  #[allow(unused_mut)]
  let mut args = QueryArgs::new();
  #[allow(unused_mut)]
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
  
  let options = Options::from(options);<#
  if (cache) {
  #>
  
  let options = options.set_cache_key(table, &sql, &args);<#
  }
  #>
  
  let options = Some(options);
  
  let model = query_one::<OrderByModel>(
    sql,
    args,
    options.clone(),
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

// MARK: validate_is_enabled_<#=table#>
/// 校验<#=table_comment#>是否启用
#[allow(dead_code)]
pub async fn validate_is_enabled_<#=table#>(
  model: &<#=tableUP#>Model,
) -> Result<()> {
  if model.is_enabled == 0 {<#
    if (isUseI18n) {
    #>
    let table_comment = i18n_dao::ns(
      "<#=table_comment#>".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      "已禁用".to_owned(),
      None,
    ).await?;
    let err_msg = table_comment + msg1.as_str();<#
    } else {
    #>
    let err_msg = "<#=table_comment#>已禁用";<#
    }
    #>
    return Err(eyre!(err_msg));
  }
  Ok(())
}<#
}
#>

// MARK: validate_option_<#=table#>
/// 校验<#=table_comment#>是否存在
#[allow(dead_code)]
pub async fn validate_option_<#=table#>(
  model: Option<<#=tableUP#>Model>,
) -> Result<<#=tableUP#>Model> {
  if model.is_none() {<#
    if (isUseI18n) {
    #>
    let table_comment = i18n_dao::ns(
      "<#=table_comment#>".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      "不存在".to_owned(),
      None,
    ).await?;
    let err_msg = table_comment + msg1.as_str();<#
    } else {
    #>
    let err_msg = "<#=table_comment#>不存在";<#
    }
    #>
    error!(
      "{req_id} {err_msg}",
      req_id = get_req_id(),
    );
    return Err(eyre!(
      ServiceException {
        code: String::new(),
        message: err_msg.to_owned(),
        rollback: true,
        trace: true,
      },
    ));
  }
  let model = model.unwrap();
  Ok(model)
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
