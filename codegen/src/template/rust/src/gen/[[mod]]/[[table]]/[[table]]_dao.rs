<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasTenantId = columns.some((column) => column.COLUMN_NAME === "tenant_id");
const hasOrgId = columns.some((column) => column.COLUMN_NAME === "org_id");
const hasMany2many = columns.some((column) => column.foreignKey?.type === "many2many");
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
  if (column.ignoreCodegen) {
    return false;
  }
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") {
    return false;
  }
  return column.dict;
});
const hasDictbiz = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") {
    return false;
  }
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

use anyhow::Result;
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
use crate::common::util::string::*;<#
if (hasMany2many) {
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

use crate::src::data_permit::data_permit_dao::get_data_permits;
use crate::src::dept::dept_dao::{
  get_auth_dept_ids,
  get_auth_and_parents_dept_ids,
};
use crate::src::role::role_dao::get_auth_role_ids;<#
}
#>

#[allow(unused_imports)]
use crate::common::context::{
  get_auth_model,
  get_auth_id,
  get_auth_tenant_id,
  get_auth_org_id,
  execute,
  query,
  query_one,
  get_now,
  get_req_id,
  QueryArgs,
  Options,
  CountModel,
  UniqueType,
  SrvErr,<#
  if (hasOrderBy) {
  #>
  OrderByModel,<#
  }
  #>
  get_short_uuid,
  get_order_by_query,
  get_page_query,
  del_caches,
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
const findAllTableUps = [ ];
const createTableUps = [ ];
const deleteByIdsTableUps = [ ];
const revertByIdsTableUps = [ ];
const updateByIdTableUps = [ ];
const forceDeleteByIdsUps = [ ];
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
if (hasTenantId && !modelIds.includes("TenantId")) {
#>

use crate::gen::base::tenant::tenant_model::TenantId;<#
modelIds.push("TenantId");
#><#
}
#><#
if (hasOrgId && !modelIds.includes("OrgId")) {
#>

use crate::gen::base::org::org_model::OrgId;<#
modelIds.push("OrgId");
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
    column_name === "org_id" ||
    column_name === "is_sys" ||
    column_name === "is_deleted" ||
    column_name === "is_hidden"
  ) continue;
  const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
  if (column_name === 'id') continue;
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE?.toLowerCase() || "";
  let column_comment = column.COLUMN_COMMENT || "";
  let selectList = [ ];
  let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
  if (selectStr) {
    selectList = eval(`(${ selectStr })`);
  }
  if (column_comment.indexOf("[") !== -1) {
    column_comment = column_comment.substring(0, column_comment.indexOf("["));
  }
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
#>

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<<#=tableUP#>Search>,
) -> Result<String> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  let data_permit_models = get_data_permits(
    get_route_path(),
  ).await?;
  let has_usr_permit = data_permit_models.iter()
    .any(|item| item.type === "create_usr")
    .is_some();
  let has_role_permit = data_permit_models.iter()
    .any(|item| item.type === "role")
    .is_some();
  let has_dept_permit = data_permit_models.iter()
    .any(|item| item.type === "dept")
    .is_some();
  let has_dept_parent_permit = data_permit_models.iter()
    .any(|item| item.type === "dept_parent")
    .is_some();
  let has_tenant_permit = data_permit_models.iter()
    .any(|item| item.type === "tenant")
    .is_some();<#
  }
  #>
  let mut where_query = String::with_capacity(80 * 15 * 2);<#
  if (hasIsDeleted) {
  #>
  {
    let is_deleted = search.as_ref()
      .and_then(|item| item.is_deleted)
      .unwrap_or(0);
    where_query += " t.is_deleted = ?";
    args.push(is_deleted.into());
  }<#
  }
  #>
  {
    let id = match &search {
      Some(item) => &item.id,
      None => &None,
    };
    let id = match id {
      None => None,
      Some(item) => match item.as_str() {
        "-" => None,
        _ => item.into(),
      },
    };
    if let Some(id) = id {
      where_query += " and t.id = ?";
      args.push(id.into());
    }
  }
  {
    let ids: Vec<<#=Table_Up#>Id> = match &search {
      Some(item) => item.ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !ids.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(ids.len());
        for id in ids {
          args.push(id.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.id in ({arg})");
    }
  }<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  if !has_tenant_permit && !has_dept_permit && !has_role_permit && has_usr_permit {
    where_query += " and t.create_usr_id = ?";
    args.push(get_auth_id().into());
  } else if (!has_tenant_permit && has_dept_parent_permit)
    || (!has_tenant_permit && has_dept_permit)
  {
    let dept_ids = get_auth_and_parents_dept_ids().await?;
    let arg = {
      let mut dept_ids2 = Vec::with_capacity(dept_ids.len());
      for dept_id in dept_ids {
        args.push(dept_id.into());
        items.push("?");
      }
      items.join(",")
    };
    where_query += &format!(" and _permit_usr_dept_.dept_id in ({})", arg);
  }
  if !has_tenant_permit && has_dept_parent_permit {
    let role_ids = get_auth_role_ids().await?;
    let arg = {
      let mut items = Vec::with_capacity(role_ids.len());
      for role_id in role_ids {
        args.push(role_id.into());
        items.push("?");
      }
      items.join(",")
    };
    where_query += &format!(" and _permit_usr_role_.role_id in {}", arg);
  }<#
  }
  #><#
    if (hasTenantId) {
  #>
  {
    let tenant_id = {
      let tenant_id = match &search {
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
      where_query += " and t.tenant_id = ?";
      args.push(tenant_id.into());
    }
  }<#
    }
  #><#
    if (hasOrgId) {
  #>
  {
    let org_id = {
      let org_id = match &search {
        Some(item) => item.org_id.clone(),
        None => None,
      };
      let org_id = match org_id {
        None => get_auth_org_id(),
        Some(item) => match item.as_str() {
          "-" => None,
          _ => item.into(),
        },
      };
      org_id
    };
    if let Some(org_id) = org_id {
      where_query += " and t.org_id = ?";
      args.push(org_id.into());
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
      column_name === "org_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted"
    ) continue;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME); 
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE?.toLowerCase() || "";
    let column_comment = column.COLUMN_COMMENT || "";
    const isPassword = column.isPassword;
    if (isPassword) {
      continue;
    }
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
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
  {
    let <#=column_name_rust#>: Option<Vec<<#=_data_type#>>> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => Default::default(),
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      let arg = {
        let mut items = Vec::with_capacity(<#=column_name_rust#>.len());
        for item in <#=column_name_rust#> {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.<#=column_name#> in ({arg})");
    }
  }<#
    } else if (foreignKey && foreignKey.type !== "many2many") {
  #>
  {
    let <#=column_name_rust#>: Vec<<#=foreignTable_Up#>Id> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !<#=column_name_rust#>.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(<#=column_name_rust#>.len());
        for item in <#=column_name_rust#> {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and <#=column_name#>_lbl.id in ({})", arg);
    }
  }
  {
    let <#=column_name#>_is_null: bool = match &search {
      Some(item) => item.<#=column_name#>_is_null.unwrap_or(false),
      None => false,
    };
    if <#=column_name#>_is_null {
      where_query += " and <#=column_name#>_lbl.id is null";
    }
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #>
  {
    let <#=column_name_rust#>: Vec<<#=foreignTable_Up#>Id> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !<#=column_name_rust#>.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(<#=column_name_rust#>.len());
        for item in <#=column_name_rust#> {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and <#=foreignKey.mod#>_<#=foreignKey.table#>.id in ({})", arg);
    }
  }
  {
    let <#=column_name#>_is_null: bool = match &search {
      Some(item) => item.<#=column_name#>_is_null.unwrap_or(false),
      None => false,
    };
    if <#=column_name#>_is_null {
      where_query += " and <#=column_name#>_lbl.id is null";
    }
  }<#
    } else if ((selectList && selectList.length > 0) || column.dict || column.dictbiz) {
      const columnDictModels = [
        ...dictModels.filter(function(item) {
          return item.code === column.dict || item.code === column.dictbiz;
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
  {
    let <#=column_name_rust#>: Vec<<#=enumColumnName#>> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !<#=column_name_rust#>.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(<#=column_name_rust#>.len());
        for item in <#=column_name_rust#> {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.<#=column_name#> in ({})", arg);
    }
  }<#
    } else if (data_type === "int" && column_name.startsWith("is_")) {
  #>
  {
    let <#=column_name_rust#> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      where_query += &format!(" and t.<#=column_name#> = {}", args.push(<#=column_name_rust#>.into()));
    }
  }<#
    } else if (data_type === "int" || data_type === "decimal" || data_type === "double" || data_type === "datetime" || data_type === "date") {
  #>
  {
    let <#=column_name_rust#>: Vec<<#=_data_type#>> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone().unwrap_or_default(),
      None => vec![],
    };
    let <#=column_name#>_gt: Option<<#=_data_type#>> = match &<#=column_name_rust#>.len() {
      0 => None,
      _ => <#=column_name#>[0].into(),
    };
    let <#=column_name#>_lt: Option<<#=_data_type#>> = match &<#=column_name_rust#>.len() {
      0 => None,
      1 => None,
      _ => <#=column_name_rust#>[1].into(),
    };
    if let Some(<#=column_name#>_gt) = <#=column_name#>_gt {
      where_query += &format!(" and t.<#=column_name#> >= {}", args.push(<#=column_name#>_gt.into()));
    }
    if let Some(<#=column_name#>_lt) = <#=column_name#>_lt {
      where_query += &format!(" and t.<#=column_name#> <= {}", args.push(<#=column_name#>_lt.into()));
    }
  }<#
    } else if (data_type === "tinyint") {
  #>
  {
    let <#=column_name_rust#> = search.<#=column_name_rust#>;
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      where_query += &format!(" and t.<#=column_name#> = {}", args.push(<#=column_name_rust#>.into()));
    }
  }<#
    } else if (data_type === "varchar" || data_type === "text") {
  #>
  {
    let <#=column_name_rust#> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      where_query += &format!(" and t.<#=column_name#> = {}", args.push(<#=column_name_rust#>.into()));
    }
    let <#=column_name#>_like = match &search {
      Some(item) => item.<#=column_name#>_like.clone(),
      None => None,
    };
    if let Some(<#=column_name#>_like) = <#=column_name#>_like {
      where_query += &format!(
        " and t.<#=column_name#> like {}",
        args.push(
          format!("%{}%", sql_like(&<#=column_name#>_like)).into()
        ),
      );
    }
  }<#
    } else {
  #>
  {
    let <#=column_name_rust#> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      where_query += &format!(" and t.<#=column_name#> = {}", args.push(<#=column_name_rust#>.into()));
    }
  }<#
    }
  #><#
  }
  #>
  Ok(where_query)
}

async fn get_from_query() -> Result<String> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  let data_permit_models = get_data_permits(
    get_route_path(),
  ).await?;
  let has_usr_permit = data_permit_models.iter()
    .any(|item| item.type === "create_usr")
    .is_some();
  let has_role_permit = data_permit_models.iter()
    .any(|item| item.type === "role")
    .is_some();
  let has_dept_permit = data_permit_models.iter()
    .any(|item| item.type === "dept")
    .is_some();
  let has_dept_parent_permit = data_permit_models.iter()
    .any(|item| item.type === "dept_parent")
    .is_some();
  let has_tenant_permit = data_permit_models.iter()
    .any(|item| item.type === "tenant")
    .is_some();<#
  }
  #>
  let<#
  if (hasDataPermit() && hasCreateUsrId) {
  #> mut<#
  }
  #> from_query = r#"<#=mod#>_<#=table#> t<#
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
    #><#
      if (foreignKey && foreignKey.type === "many2many") {
    #>
    left join <#=many2many.mod#>_<#=many2many.table#>
      on <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column1#> = t.id
      and <#=many2many.mod#>_<#=many2many.table#>.is_deleted = 0
    left join <#=foreignKey.mod#>_<#=foreignTable#>
      on <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column2#> = <#=foreignKey.mod#>_<#=foreignTable#>.<#=foreignKey.column#>
      and <#=foreignKey.mod#>_<#=foreignTable#>.is_deleted = 0
    left join (
      select
        json_objectagg(<#=many2many.mod#>_<#=many2many.table#>.order_by, <#=foreignKey.mod#>_<#=foreignTable#>.id) <#=column_name#>,<#
          if (foreignKey.lbl) {
        #>
        json_objectagg(<#=many2many.mod#>_<#=many2many.table#>.order_by, <#=foreignKey.mod#>_<#=foreignTable#>.<#=foreignKey.lbl#>) <#=column_name#>_lbl,<#
          }
        #>
        <#=mod#>_<#=table#>.id <#=many2many.column1#>
      from <#=foreignKey.mod#>_<#=many2many.table#>
      inner join <#=foreignKey.mod#>_<#=foreignKey.table#>
        on <#=foreignKey.mod#>_<#=foreignKey.table#>.<#=foreignKey.column#> = <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column2#>
        and <#=foreignKey.mod#>_<#=foreignKey.table#>.is_deleted = 0
      inner join <#=mod#>_<#=table#>
        on <#=mod#>_<#=table#>.id = <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column1#>
      where
        <#=many2many.mod#>_<#=many2many.table#>.is_deleted = 0
      group by <#=many2many.column1#>
    ) _<#=foreignTable#>
      on _<#=foreignTable#>.<#=many2many.column1#> = t.id<#
      } else if (foreignKey && !foreignKey.multiple) {
    #>
    left join <#=foreignKey.mod#>_<#=foreignTable#> <#=column_name#>_lbl
      on <#=column_name#>_lbl.<#=foreignKey.column#> = t.<#=column_name#><#
      }
    #><#
    }
    #>"#.to_owned();<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  if !has_tenant_permit && has_dept_permit {
    from_query += r#"
      left join base_usr_dept _permit_usr_dept_
        on _permit_usr_dept_.usr_id  = t.create_usr_id
    "#;
  }
  if !has_tenant_permit && has_role_permit {
    from_query += r#"
      left join base_usr_role _permit_usr_role_
        on _permit_usr_role_.usr_id  = t.create_usr_id
    "#;
  }<#
  }
  #>
  Ok(from_query)
}

/// 根据搜索条件和分页查找<#=table_comment#>列表
#[allow(unused_variables)]
pub async fn find_all(
  search: Option<<#=tableUP#>Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {
  
  #[allow(unused_variables)]
  let table = "<#=mod#>_<#=table#>";
  let _method = "find_all";<#
  if (hasIsDeleted) {
  #>
  
  let is_deleted = search.as_ref()
    .and_then(|item| item.is_deleted);<#
  }
  #>
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query().await?;
  let where_query = get_where_query(&mut args, search).await?;<#
  if (hasCreateTime || opts?.defaultSort) {
  #>
  
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
    if (hasCreateTime) {
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
  <#
  }
  #>
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select
      t.*<#
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
      #><#
        if (foreignKey && foreignKey.type === "many2many") {
      #>
      ,max(<#=column_name#>) <#=column_name#><#
        if (!modelLabel) {
      #>
      ,max(<#=column_name#>_lbl) <#=column_name#>_lbl<#
        }
      #><#
      } else if (foreignKey && !foreignKey.multiple && foreignKey.lbl) {
      #><#
        if (!modelLabel) {
      #>
      ,<#=column_name#>_lbl.<#=foreignKey.lbl#> <#=column_name#>_lbl<#
        }
      #><#
        }
      #><#
      }
      #>
    from
      {from_query}
    where
      {where_query}
    group by t.id{order_by_query}{page_query}
  "#);
  
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
      column_name === "org_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (!column.dict) continue;
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
        column_name === "org_id" ||
        column_name === "is_sys" ||
        column_name === "is_deleted" ||
        column_name === "is_hidden"
      ) continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      if (!column.dict) continue;
    #>
    <#=column_name#>_dict,<#
      dictNum++;
    }
    #>
  ]: [Vec<_>; <#=dictNum#>] = dict_vec
    .try_into()
    .map_err(|_| anyhow::anyhow!("dict_vec.len() != 3"))?;<#
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
      column_name === "org_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (!column.dictbiz) continue;
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
        column_name === "org_id" ||
        column_name === "is_sys" ||
        column_name === "is_deleted" ||
        column_name === "is_hidden"
      ) continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      if (!column.dictbiz) continue;
    #>
    <#=column_name#>_dictbiz,<#
    dictBizNum++;
    }
    #>
  ]: [Vec<_>; <#=dictBizNum#>] = dictbiz_vec
    .try_into()
    .map_err(|_| anyhow::anyhow!("dictbiz_vec.len() != 3"))?;<#
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
  #>
  
  // <#=inlineForeignTab.label#>
  let <#=inlineForeignTable#>_models = find_all_<#=inlineForeignTable#>(
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
  #>
  
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
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
      const isPassword = column.isPassword;
  #><#
    if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
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
    #>
    
    // <#=inlineForeignTab.label#>
    model.<#=table#>_models = <#=table#>_models
      .clone()
      .into_iter()
      .filter(|item|
        item.<#=inlineForeignTab.column#> == model.id
      )
      .collect();<#
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
  
  #[allow(unused_variables)]
  let table = "<#=mod#>_<#=table#>";
  let _method = "find_count";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query().await?;
  let where_query = get_where_query(&mut args, search).await?;
  
  let sql = format!(r#"
    select
      count(1) total
    from
      (
        select
          1
        from
          {from_query}
        where
          {where_query}
        group by t.id
      ) t
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);<#
  if (cache) {
  #>
  
  let options = options.set_cache_key(table, &sql, &args);<#
  }
  #>
  
  let options = options.into();
  
  let res: Option<CountModel> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  let total = res
    .map(|item| item.total)
    .unwrap_or_default()
    ;
  
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
        column_name === "org_id" ||
        column_name === "is_sys" ||
        column_name === "is_deleted"
      ) continue;
      const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const isPassword = column.isPassword;
      if (isPassword) continue;
      const foreignKey = column.foreignKey;
    #><#
      if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
        || data_type === "datetime" || data_type === "date"
      ) {
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
        column_name === "org_id" ||
        column_name === "is_sys" ||
        column_name === "is_deleted" ||
        column_name === "is_hidden"
      ) continue;
      const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const isPassword = column.isPassword;
      if (isPassword) continue;
      const foreignKey = column.foreignKey;
    #><#
      if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
        || data_type === "datetime" || data_type === "date"
      ) {
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

/// 根据搜索条件判断<#=table_comment#>是否存在
pub async fn exists(
  search: Option<<#=tableUP#>Search>,
  options: Option<Options>,
) -> Result<bool> {
  
  let total = find_count(
    search,
    options,
  ).await?;
  
  Ok(total > 0)
}

/// 根据 id 判断<#=table_comment#>是否存在
pub async fn exists_by_id(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
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
      <#=unique_rust#>: search.<#=unique_rust#>,<#
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
fn equals_by_unique(
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
  unique_type: UniqueType,
) -> Result<Option<<#=Table_Up#>Id>> {
  let is_equals = equals_by_unique(
    &input,
    &model,
  );
  if !is_equals {
    return Ok(None);
  }
  if unique_type == UniqueType::Ignore {
    return Ok(None);
  }
  if unique_type == UniqueType::Update {
    let options = Options::new();<#
    if (hasEncrypt) {
    #>
    let options = options.set_is_encrypt(false);<#
    }
    #>
    let id = update_by_id(
      model.id.clone(),
      input,
      Some(options),
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
    return Err(SrvErr::msg(err_msg).into());
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
  #><#
    if (column.isMonth) {
  #>
  // <#=column_comment#>
  if input.<#=column_name_rust#>.is_none() {
    if let Some(<#=column_name#>_lbl) = input.<#=column_name#>_lbl.as_ref().filter(|s| !s.is_empty()) {
      input.<#=column_name_rust#> = chrono::NaiveDate::parse_from_str(<#=column_name#>_lbl, "%Y-%m-%d %H:%M:%S").ok();
      if input.<#=column_name_rust#>.is_none() {
        let field_comments = get_field_comments(
          None,
        ).await?;
        let column_comment = field_comments.<#=column_name_rust#>;
        
        let err_msg = i18n_dao::ns(
          "日期格式错误".to_owned(),
          None,
        ).await?;
        return Err(SrvErr::msg(format!("{column_comment} {err_msg}")).into());
      }
    }
  }
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    input.<#=column_name_rust#> = <#=column_name_rust#>.with_day(1);
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
      column_name === "org_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
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
      column_name === "org_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
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
      column_name === "org_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
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
      column_name === "org_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (!column.dictbiz) continue;
  #>
  
  // <#=column_comment#>
  if input.<#=column_name_rust#>.is_none() {
    let <#=column_name#>_dictbiz = &dictbiz_vec[<#=dictBizNum#>];
    if let Some(<#=column_name#>_lbl) = input.<#=column_name#>_lbl.clone() {
      input.<#=column_name_rust#> = <#=column_name#>_dictbiz
        .iter()
        .find(|item| {
          item.lbl == <#=column_name#>_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        })
        .into();
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
      column_name === "org_id" ||
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
    } else if (foreignKey && (foreignKey.type === "many2many" || foreignKey.multiple) && foreignKey.lbl) {
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
          lbl: lbl.into(),
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
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
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
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
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

/// 创建<#=table_comment#>
#[allow(unused_mut)]
pub async fn create(
  mut input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<<#=Table_Up#>Id> {<#
  if (false) {
  #>
  
  validate(
    &input,
  )?;<#
  }
  #>
  
  let table = "<#=mod#>_<#=table#>";
  let _method = "create";
  
  if input.id.is_some() {
    return Err(SrvErr::msg(
      format!("Can not set id when create in dao: {table}")
    ).into());
  }<#
  if (hasEncrypt) {
  #>
  
  let is_encrypt = options.as_ref()
    .map(|item|
      item.get_is_encrypt().unwrap_or(true)
    )
    .unwrap_or(true);
  if is_encrypt {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (!column.isEncrypt) {
        continue;
      }
      const column_name = column.COLUMN_NAME;
      let is_nullable = column.IS_NULLABLE === "YES";
      const foreignKey = column.foreignKey;
      let data_type = column.DATA_TYPE;
      let column_comment = column.COLUMN_COMMENT;
      let selectList = [ ];
      if (column_comment.endsWith("multiple")) {
        _data_type = "[String]";
      }
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.includes("[")) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      if (column_name === 'id') column_comment = 'ID';
    #>
    // <#=column_comment#>
    if input.<#=column_name#>.is_some() {
      input.<#=column_name#> = input.<#=column_name#>.as_ref().map(|item| {
        encrypt(item)
      });
    }<#
    }
    #>
  };<#
  }
  #>
  
  let now = get_now();
  
  let old_models = find_by_unique(
    input.clone().into(),
    None,
    None,
  ).await?;
  
  if !old_models.is_empty() {
    
    let unique_type = options.as_ref()
      .map(|item|
        item.get_unique_type().unwrap_or(UniqueType::Throw)
      )
      .unwrap_or(UniqueType::Throw);
    
    let mut id: Option<<#=Table_Up#>Id> = None;
    
    for old_model in old_models {
      
      id = check_by_unique(
        input.clone(),
        old_model,
        unique_type,
      ).await?;
      
      if id.is_some() {
        break;
      }
    }
    
    if let Some(id) = id {
      return Ok(id);
    }
  }<#
  if (mod === "base" && table === "role") {
  #>
  
  if input.menu_ids.is_some() {
    input.menu_ids = crate::src::base::tenant::tenant_dao::filter_menu_ids_by_tenant(
      input.menu_ids.unwrap(),
    ).await?.into();
  }<#
  }
  #>
  
  let mut id: <#=Table_Up#>Id;
  loop {
    id = get_short_uuid().into();
    let is_exist = exists_by_id(
      id.clone(),
      None,
    ).await?;
    if !is_exist {
      break;
    }
    error!(
      "{req_id} ID_COLLIDE: {table} {id}",
      req_id = get_req_id(),
    );
  }
  let id = id;
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "id,create_time".to_owned();
  
  let mut sql_values = "?,?".to_owned();
  
  args.push(id.clone().into());
  args.push(now.into());<#
  if (hasTenantId) {
  #>
  
  if let Some(tenant_id) = input.tenant_id {
    sql_fields += ",tenant_id";
    sql_values += ",?";
    args.push(tenant_id.into());
  } else if let Some(tenant_id) = get_auth_tenant_id() {
    sql_fields += ",tenant_id";
    sql_values += ",?";
    args.push(tenant_id.into());
  }<#
  }
  #><#
  if (hasOrgId) {
  #>
  
  if let Some(org_id) = input.org_id {
    sql_fields += ",org_id";
    sql_values += ",?";
    args.push(org_id.into());
  } else if let Some(org_id) = get_auth_org_id() {
    sql_fields += ",org_id";
    sql_values += ",?";
    args.push(org_id.into());
  }<#
  }
  #>
  
  if let Some(auth_model) = get_auth_model() {
    let usr_id = auth_model.id;
    sql_fields += ",create_usr_id";
    sql_values += ",?";
    args.push(usr_id.into());
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
    const column_name_mysql = mysqlKeyEscape(column_name);
    const modelLabel = column.modelLabel;
  #><#
    if (modelLabel) {
  #>
  // <#=column_comment#>
  if let Some(<#=modelLabel#>) = input.<#=modelLabel#> {
    if !<#=modelLabel#>.is_empty() {
      sql_fields += ",<#=modelLabel#>";
      sql_values += ",?";
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
      sql_fields += ",<#=column_name_mysql#>";
      sql_values += ",?";
      args.push(get_password(<#=column_name_rust#>)?.into());
    }
  }<#
    } else if (foreignKey && foreignKey.type === "json") {
  #><#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    sql_fields += ",<#=column_name_mysql#>";
    sql_values += ",?";
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
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
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
    sql_fields += ",<#=val#>";
    sql_values += ",?";
    args.push(<#=rustKeyEscape(val)#>.into());
  }<#
    }
  #><#
  }
  #>
  
  let sql = format!(
    "insert into {} ({}) values ({})",
    table,
    sql_fields,
    sql_values,
  );
  
  let args = args.into();
  
  let options = Options::from(options);<#
  if (cache) {
  #>
  
  let options = options.set_del_cache_key1s(get_foreign_tables());<#
  }
  #>
  
  let options = options.into();
  
  execute(
    sql,
    args,
    options,
  ).await?;<#
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
  #>
  
  // <#=inlineForeignTab.label#>
  if let Some(<#=table#>_models) = input.<#=table#>_models {
    for mut <#=table#>_model in <#=table#>_models {
      <#=table#>_model.<#=inlineForeignTab.column#> = id.clone().into();
      create_<#=table#>(
        <#=table#>_model,
        None,
      ).await?;
    }
  }<#
  }
  #>
  
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
  let _method = "update_tenant_by_id";
  
  let mut args = QueryArgs::new();
  
  let sql_fields = "tenant_id = ?,update_time = ?";
  args.push(tenant_id.into());
  args.push(get_now().into());
  
  let sql_where = "id = ?";
  args.push(id.into());
  
  let sql = format!(
    "update {} set {} where {}",
    table,
    sql_fields,
    sql_where,
  );
  
  let args = args.into();
  
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
if (hasOrgId) {
#>

/// <#=table_comment#>根据id修改组织id
pub async fn update_org_by_id(
  id: <#=Table_Up#>Id,
  org_id: OrgId,
  options: Option<Options>,
) -> Result<u64> {
  let table = "<#=mod#>_<#=table#>";
  let _method = "update_org_by_id";
  
  let mut args = QueryArgs::new();
  
  let sql_fields = "org_id = ?,update_time = ?";
  args.push(org_id.into());
  args.push(get_now().into());
  
  let sql_where = "id = ?";
  args.push(id.into());
  
  let sql = format!(
    "update {} set {} where {}",
    table,
    sql_fields,
    sql_where,
  );
  
  let args = args.into();
  
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
#>

/// 根据 id 修改<#=table_comment#>
#[allow(unused_mut)]
pub async fn update_by_id(
  id: <#=Table_Up#>Id,
  mut input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<<#=Table_Up#>Id> {<#
  if (hasEncrypt) {
  #>
  
  let is_encrypt = options.as_ref()
    .map(|item|
      item.get_is_encrypt().unwrap_or(true)
    )
    .unwrap_or(true);
  if is_encrypt {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (!column.isEncrypt) {
        continue;
      }
      const column_name = column.COLUMN_NAME;
      let is_nullable = column.IS_NULLABLE === "YES";
      const foreignKey = column.foreignKey;
      let data_type = column.DATA_TYPE;
      let column_comment = column.COLUMN_COMMENT;
      let selectList = [ ];
      if (column_comment.endsWith("multiple")) {
        _data_type = "[String]";
      }
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.includes("[")) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      if (column_name === 'id') column_comment = 'ID';
    #>
    // <#=column_comment#>
    if input.<#=column_name#>.is_some() {
      input.<#=column_name#> = input.<#=column_name#>.as_ref().map(|item| {
        encrypt(item)
      });
    }<#
    }
    #>
  };<#
  }
  #>
  
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
    return Err(SrvErr::msg(err_msg).into());
  }<#
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
        return Err(SrvErr::msg(err_msg).into());
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let table = "<#=mod#>_<#=table#>";
  let _method = "update_by_id";
  
  let now = get_now();
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "update_time = ?".to_owned();
  args.push(now.into());
  
  let mut field_num: usize = 0;<#
  if (hasTenantId) {
  #>
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += ",tenant_id = ?";
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
    if (column_name === "tenant_id") {
      continue;
    }
    if (column_name === "org_id") {
      continue;
    }
    const column_name_mysql = mysqlKeyEscape(column_name);
    const modelLabel = column.modelLabel;
  #><#
    if (modelLabel) {
  #>
  // <#=column_comment#>
  if let Some(<#=modelLabel#>) = input.<#=modelLabel#> {
    if !<#=modelLabel#>.is_empty() {
      field_num += 1;
      sql_fields += ",<#=modelLabel#> = ?";
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
      sql_fields += ",<#=column_name_mysql#> = ?";
      args.push(get_password(<#=column_name_rust#>)?.into());
    }
  }<#
    } else if (foreignKey && foreignKey.type === "json") {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    field_num += 1;
    sql_fields += ",<#=column_name_mysql#> = ?";
    args.push(<#=column_name_rust#>.into());
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    field_num += 1;
    sql_fields += ",<#=column_name_mysql#> = ?";
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
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
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
    sql_fields += ",<#=val_mysql#> = ?";
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
  #>
  
  // <#=inlineForeignTab.label#>
  if let Some(input_<#=table#>_models) = input.<#=table#>_models {
    let <#=table#>_models = find_all_<#=table#>(
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
    if !<#=table#>_models.is_empty() && !input_<#=table#>_models.is_empty() {
      field_num += 1;
    }
    for <#=table#>_model in <#=table#>_models.clone() {
      if input_<#=table#>_models
        .iter()
        .filter(|item| item.id.is_some())
        .any(|item| item.id == Some(<#=table#>_model.id.clone()))
      {
        continue;
      }
      delete_by_ids_<#=table#>(
        vec![<#=table#>_model.id],
        None,
      ).await?;
    }
    for <#=table#>_model in input_<#=table#>_models {
      if <#=table#>_model.id.is_none() {
        let mut <#=table#>_model = <#=table#>_model;
        <#=table#>_model.<#=inlineForeignTab.column#> = id.clone().into();
        create_<#=table#>(
          <#=table#>_model,
          None,
        ).await?;
        continue;
      }
      let id = <#=table#>_model.id.clone().unwrap();
      if !<#=table#>_models
        .iter()
        .any(|item| item.id == id)
      {
        revert_by_ids_<#=table#>(
          vec![id.clone()],
          None,
        ).await?;
      }
      update_by_id_<#=table#>(
        id.clone(),
        <#=table#>_model,
        None,
      ).await?;
    }
  }<#
  }
  #>
  
  if field_num > 0 {<#
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
            return Err(SrvErr::msg(err_msg).into());
          }
        }
        sql_fields += ",version = ?";
        args.push((version + 1).into());
      }
    }<#
    }
    #>
    
    if let Some(auth_model) = get_auth_model() {
      let usr_id = auth_model.id;
      sql_fields += ",update_usr_id = ?";
      args.push(usr_id.into());
    }
    
    let sql_where = "id = ?";
    args.push(id.clone().into());
    
    let sql = format!(
      "update {} set {} where {} limit 1",
      table,
      sql_fields,
      sql_where,
    );
    
    let args = args.into();
    
    let options = Options::from(options);<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_foreign_tables());<#
    }
    #>
    
    let options = options.into();
    
    execute(
      sql,
      args,
      options,
    ).await?;
    
  }<#
  if (mod === "base" && table === "role") {
  #>
  
  if input.menu_ids.is_some() {
    input.menu_ids = crate::src::base::tenant::tenant_dao::filter_menu_ids_by_tenant(
      input.menu_ids.unwrap(),
    ).await?.into();
  }<#
  }
  #><#
  if (hasMany2many) {
  #>
  
  let mut field_num = 0;<#
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
    let options = options.set_del_cache_key1s(get_foreign_tables());
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

/// 获取外键关联表, 第一个是主表
#[allow(dead_code)]
fn get_foreign_tables() -> Vec<&'static str> {
  let table = "<#=mod#>_<#=table#>";
  vec![
    table,<#
    let foreign_tableArr = [ ];
    const foreignTablesCache = [ ];
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
      if (foreignTablesCache.includes(foreignTable)) {
        continue;
      }
      foreignTablesCache.push(foreignTable);
    #><#
      if (foreignKey && foreignKey.type === "many2many") {
        if (foreign_tableArr.includes(many2many.table)) {
          continue;
        } else {
          foreign_tableArr.push(many2many.table);
        }
        if (foreign_tableArr.includes(foreignTable)) {
          continue;
        } else {
          foreign_tableArr.push(foreignTable);
        }
    #>
    "<#=many2many.mod#>_<#=many2many.table#>",
    "<#=foreignKey.mod#>_<#=foreignTable#>",<#
    } else if (foreignKey && !foreignKey.multiple) {
      if (foreign_tableArr.includes(foreignTable)) {
        continue;
      } else {
        foreign_tableArr.push(foreignTable);
      }
    #>
    "<#=foreignKey.mod#>_<#=foreignTable#>",<#
    }
    #><#
    }
    #>
  ]
}

/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache() -> Result<()> {
  let cache_key1s = get_foreign_tables();
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
  let _method = "delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=1,delete_time=? where id=? limit 1",
      table,
    );
    
    args.push(get_now().into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_foreign_tables());<#
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
  let _method = "default_by_id";
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_foreign_tables());
  
  {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_default=0 where is_default = 1 and id!=?",
      table,
    );
    
    args.push(id.clone().into());
    
    let args = args.into();
    
    let options = options.clone().into();
    
    execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  let mut num = 0;
  
  let mut args = QueryArgs::new();
    
  let sql = format!(
    "update {} set is_default=1 where id=?",
    table,
  );
  
  args.push(id.into());
  
  let args = args.into();
  
  let options = options.clone().into();
  
  num += execute(
    sql,
    args,
    options,
  ).await?;
  
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
  let _method = "enable_by_ids";
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_foreign_tables());
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_enabled=? where id=? limit 1",
      table,
    );
    
    args.push(is_enabled.into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone().into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
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
  let _method = "lock_by_ids";
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_foreign_tables());
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_locked=? where id=? limit 1",
      table,
    );
    
    args.push(is_locked.into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone().into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}<#
}
#>

/// 根据 ids 还原<#=table_comment#>
pub async fn revert_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let _method = "revert_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=0 where id=? limit 1",
      table,
    );
    
    args.push(id.clone().into());
    
    let args = args.into();
    
    let options = options.clone();<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_foreign_tables());<#
    }
    #>
    
    let options = options.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
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
        return Err(SrvErr::msg(err_msg).into());
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
    <#=table#>_models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<<#=Table_Up#>Id>>(),
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
}

/// 根据 ids 彻底删除<#=table_comment#>
pub async fn force_delete_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let model = find_all(
      <#=tableUP#>Search {
        id: id.clone().into(),
        is_deleted: 1.into(),
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
    
    let sql = format!(
      "delete from {table} where id=? and is_deleted = 1 limit 1",
    );
    
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_foreign_tables());<#
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
  #>
  
  Ok(num)
}<#
if (hasOrderBy) {
#>

/// 查找 <#=table_comment#> order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let table = "<#=mod#>_<#=table#>";
  let _method = "find_last_order_by";
  
  #[allow(unused_mut)]
  let mut args = QueryArgs::new();
  let mut sql_where = "".to_owned();<#
  if (hasIsDeleted) {
  #>
  
  sql_where += "t.is_deleted = 0";<#
  }
  #><#
  if (hasTenantId) {
  #>
  
  if let Some(tenant_id) = get_auth_tenant_id() {
    sql_where += " and t.tenant_id = ?";
    args.push(tenant_id.into());
  }<#
  }
  #><#
  if (hasOrgId) {
  #>
  
  if let Some(org_id) = get_auth_org_id() {
    sql_where += " and t.org_id = ?";
    args.push(org_id.into());
  }<#
  }
  #>
  
  let sql = format!(
    "select t.order_by order_by from {} t where {} order by t.order_by desc limit 1",
    table,
    sql_where,
  );
  
  let args = args.into();
  
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
#[function_name::named]
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
    return Err(SrvErr::new(function_name!().to_owned(), err_msg).into());
  }
  Ok(())
}<#
}
#>

/// 校验<#=table_comment#>是否存在
#[function_name::named]
#[allow(dead_code)]
pub async fn validate_option<'a, T>(
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
    return Err(SrvErr::new(function_name!().to_owned(), err_msg).into());
  }
  Ok(model.unwrap())
}<#
if (false) {
#>

/// 校验, 校验失败时抛出SrvErr异常
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
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE?.toLowerCase() || "";
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const isPassword = column.isPassword;
    if (isPassword) continue;
    const foreignKey = column.foreignKey;
    const validators = column.validators || [ ];
    if (validators.length === 0) {
      continue;
    }
  #><#
      if ((foreignKey || selectList.length > 0 || column.dict || column.dictbiz) && foreignKey?.multiple) {
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
      } else if ((foreignKey || selectList.length > 0 || column.dict || column.dictbiz) && !foreignKey?.multiple) {
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