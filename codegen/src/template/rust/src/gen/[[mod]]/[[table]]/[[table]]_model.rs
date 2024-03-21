<#
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const tableUP = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const hasTenantId = columns.some((column) => column.COLUMN_NAME === "tenant_id");
const hasOrgId = columns.some((column) => column.COLUMN_NAME === "org_id");
const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
const hasIsHidden = columns.some((column) => column.COLUMN_NAME === "is_hidden");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
const hasInlineForeignTabs = opts?.inlineForeignTabs && opts?.inlineForeignTabs.length > 0;
const inlineForeignTabs = opts?.inlineForeignTabs || [ ];
const hasEncrypt = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  return !!column.isEncrypt;
});
#>
use std::fmt;
use std::ops::Deref;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use serde::{Serialize, Deserialize};

use sqlx::encode::{Encode, IsNull};
use sqlx::MySql;
use smol_str::SmolStr;

use sqlx::{
  FromRow,
  mysql::MySqlRow,
  Row,
};

#[allow(unused_imports)]
use async_graphql::{
  SimpleObject,
  InputObject,
  Enum,
};

use crate::common::context::ArgType;<#
if (hasEncrypt) {
#>
use crate::common::util::dao::decrypt;<#
}
#><#
const foreignTableArr = [];
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
  if (foreignTableArr.includes(table)) continue;
  foreignTableArr.push(table);
#>

use crate::gen::<#=mod#>::<#=table#>::<#=table#>_model::{
  <#=Table_Up#>Model,
  <#=Table_Up#>Input,
};<#
}
#><#

// 已经导入的ID列表
const modelIds = [ ];
modelIds.push(Table_Up + "Id");
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

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case"<#
if (table === "i18n") {
#>, name = "<#=tableUP#>Model"<#
}
#>)]
pub struct <#=tableUP#>Model {<#
  if (hasTenantId) {
  #>
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,<#
  }
  #><#
  if (hasOrgId) {
  #>
  /// 组织ID
  #[graphql(skip)]
  pub org_id: OrgId,<#
  }
  #><#
  if (hasIsSys) {
  #>
  /// 系统字段
  #[graphql(skip)]
  pub is_sys: u8,<#
  }
  #><#
  if (hasIsHidden) {
  #>
  /// 隐藏字段
  #[graphql(skip)]
  pub is_hidden: u8,<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (
      column_name === "tenant_id" ||
      column_name === "org_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden" ||
      column_name === "create_usr_id" ||
      column_name === "create_time" ||
      column_name === "update_usr_id" ||
      column_name === "update_time"
    ) continue;
    const column_name_rust = rustKeyEscape(column_name);
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
      is_nullable = false;
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
    if (is_nullable) {
      _data_type = "Option<"+_data_type+">";
    }
    const onlyCodegenDeno = column.onlyCodegenDeno;
  #><#
    if (column_name === "id") {
  #>
  /// ID
  pub id: <#=Table_Up#>Id,<#
    } else if (foreignKey && foreignKey.multiple) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: <#=_data_type#>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name#>_lbl: Vec<String>,<#
    } else if (foreignKey && !foreignKey.multiple) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: <#=_data_type#>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name#>_lbl: String,<#
    } else if (data_type === "date" || data_type === "datetime") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: <#=_data_type#>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name#>_lbl: String,<#
    } else if (selectList.length > 0 || column.dict || column.dictbiz) {
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
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: <#=enumColumnName#>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name#>_lbl: String,<#
    } else {
  #>
  /// <#=column_comment#>
  pub <#=column_name_rust#>: <#=_data_type#>,<#
    }
  #><#
  }
  #><#
  if (hasIsDeleted) {
  #>
  /// 是否已删除
  pub is_deleted: u8,<#
  }
  #><#
  if (hasCreateUsrId) {
  #>
  /// 创建人<#
  if (!columns.some((column) => column.COLUMN_NAME === "create_usr_id")
    || columns.find((column) => column.COLUMN_NAME === "create_usr_id").onlyCodegenDeno
  ) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub create_usr_id: UsrId,
  /// 创建人<#
  if (!columns.some((column) => column.COLUMN_NAME === "create_usr_id")
    || columns.find((column) => column.COLUMN_NAME === "create_usr_id").onlyCodegenDeno
  ) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub create_usr_id_lbl: String,<#
  }
  #><#
  if (hasCreateTime) {
  #>
  /// 创建时间<#
  if (!columns.some((column) => column.COLUMN_NAME === "create_time")
    || columns.find((column) => column.COLUMN_NAME === "create_time").onlyCodegenDeno
  ) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间<#
  if (!columns.some((column) => column.COLUMN_NAME === "create_time")
    || columns.find((column) => column.COLUMN_NAME === "create_time").onlyCodegenDeno
  ) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub create_time_lbl: String,<#
  }
  #><#
  if (hasUpdateUsrId) {
  #>
  /// 更新人<#
  if (!columns.some((column) => column.COLUMN_NAME === "update_usr_id")
    || columns.find((column) => column.COLUMN_NAME === "update_usr_id").onlyCodegenDeno
  ) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub update_usr_id: UsrId,
  /// 更新人<#
  if (!columns.some((column) => column.COLUMN_NAME === "update_usr_id")
    || columns.find((column) => column.COLUMN_NAME === "update_usr_id").onlyCodegenDeno
  ) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub update_usr_id_lbl: String,<#
  }
  #><#
  if (hasUpdateTime) {
  #>
  /// 更新时间<#
  if (!columns.some((column) => column.COLUMN_NAME === "update_time")
    || columns.find((column) => column.COLUMN_NAME === "update_time").onlyCodegenDeno
  ) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间<#
  if (!columns.some((column) => column.COLUMN_NAME === "update_time")
    || columns.find((column) => column.COLUMN_NAME === "update_time").onlyCodegenDeno
  ) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub update_time_lbl: String,<#
  }
  #><#
  if (hasVersion) {
  #>
  /// 版本号
  pub version: u32,<#
  }
  #><#
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
  #>
  /// <#=inlineForeignTab.label#>
  pub <#=table#>_models: Vec<<#=Table_Up#>Model>,
  <#
  }
  #>
}

impl FromRow<'_, MySqlRow> for <#=tableUP#>Model {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {<#
    if (hasTenantId) {
    #>
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;<#
    }
    #><#
    if (hasOrgId) {
    #>
    // 组织ID
    let org_id = row.try_get("org_id")?;<#
    }
    #><#
    if (hasIsSys) {
    #>
    // 系统记录
    let is_sys = row.try_get("is_sys")?;<#
    }
    #><#
    if (hasIsHidden) {
    #>
    // 隐藏字段
    let is_hidden = row.try_get("is_hidden")?;<#
    }
    #><#
    if (hasVersion) {
    #>
    // 版本号
    let version = row.try_get("version")?;<#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (
      column_name === "tenant_id" ||
      column_name === "org_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden" ||
      column_name === "create_usr_id" ||
      column_name === "create_time" ||
      column_name === "update_usr_id" ||
      column_name === "update_time"
    ) continue;
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
      is_nullable = false;
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
    if (is_nullable) {
      _data_type = "Option<"+_data_type+">";
    }
    #><#
      if (column_name === "id") {
    #>
    // ID
    let id: <#=Table_Up#>Id = row.try_get("id")?;<#
      } else if (foreignKey && foreignKey.multiple) {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: Option<sqlx::types::Json<HashMap<String, <#=foreignTable_Up#>Id>>> = row.try_get("<#=column_name#>")?;
    let <#=column_name_rust#> = <#=column_name#>.unwrap_or_default().0;
    let <#=column_name_rust#> = {
      let mut keys: Vec<u32> = <#=column_name_rust#>.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          <#=column_name_rust#>.get(&x.to_string())
            .unwrap_or(&<#=foreignTable_Up#>Id::default())
            .to_owned()
        )
        .collect::<Vec<<#=foreignTable_Up#>Id>>()
    };
    let <#=column_name#>_lbl: Option<sqlx::types::Json<HashMap<String, String>>> = row.try_get("<#=column_name#>_lbl")?;
    let <#=column_name#>_lbl = <#=column_name#>_lbl.unwrap_or_default().0;
    let <#=column_name#>_lbl = {
      let mut keys: Vec<u32> = <#=column_name#>_lbl.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          <#=column_name#>_lbl.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };<#
      } else if (foreignKey && !foreignKey.multiple) {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=foreignTable_Up#>Id = row.try_get("<#=column_name#>")?;
    let <#=column_name#>_lbl: Option<String> = row.try_get("<#=column_name#>_lbl")?;
    let <#=column_name#>_lbl = <#=column_name#>_lbl.unwrap_or_default();<#
      } else if (column.DATA_TYPE === 'tinyint') {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;
    let <#=column_name#>_lbl: String = <#=column_name_rust#>.to_string();<#
      } else if ((selectList.length > 0 || column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
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
    #><#
      if (columnDictModels.length > 0) {
    #>
    // <#=column_comment#>
    let <#=column_name#>_lbl: String = row.try_get("<#=column_name#>")?;
    let <#=column_name_rust#>: <#=enumColumnName#> = <#=column_name#>_lbl.clone().try_into()?;<#
      } else {
    #>
    // <#=column_comment#>
    let <#=column_name#>_lbl: String = row.try_get("<#=column_name#>")?;
    let <#=column_name_rust#>: <#=enumColumnName#> = <#=column_name#>_lbl.clone();<#
      }
    #><#
      } else if ((selectList.length > 0 || column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(data_type)) {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;
    let <#=column_name#>_lbl: String = <#=column_name_rust#>.to_string();<#
      } else if (data_type === "datetime") {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;<#
      if (is_nullable) {
    #>
    let <#=column_name#>_lbl: String = match <#=column_name_rust#> {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };<#
      } else {
    #>
    let <#=column_name#>_lbl: String = <#=column_name_rust#>.format("%Y-%m-%d %H:%M:%S").to_string();<#
      }
    #><#
      } else if (data_type === "date") {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;<#
      if (is_nullable) {
    #>
    let <#=column_name#>_lbl: String = match <#=column_name_rust#> {
      Some(item) => item.format(<#
        if (column.isMonth) {
      #>"%Y-%m"<#
        } else {
      #>"%Y-%m-%d"<#
        }
      #>).to_string(),
      None => "".to_owned(),
    };<#
      } else {
    #>
    let <#=column_name#>_lbl: String = <#=column_name_rust#>.format(<#
        if (column.isMonth) {
      #>"%Y-%m"<#
        } else {
      #>"%Y-%m-%d"<#
        }
      #>).to_string();<#
      }
    #><#
      } else {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;<#
        if (column.isEncrypt) { 
    #>
    let <#=column_name_rust#>: <#=_data_type#> = decrypt(<#=column_name_rust#>.as_str());<#
        }
    #><#
      }
    #><#
    }
    #><#
    if (hasCreateUsrId) {
    #>
    // 创建人
    let create_usr_id: UsrId = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<String> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = create_usr_id_lbl.unwrap_or_default();<#
    }
    #><#
    if (hasCreateTime) {
    #>
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: String = match create_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };<#
    }
    #><#
    if (hasUpdateUsrId) {
    #>
    // 更新人
    let update_usr_id: UsrId = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<String> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = update_usr_id_lbl.unwrap_or_default();<#
    }
    #><#
    if (hasUpdateTime) {
    #>
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: String = match update_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };<#
    }
    #><#
    if (hasIsDeleted) {
    #>
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;<#
    }
    #>
    
    let model = Self {<#
      if (hasTenantId) {
      #>
      tenant_id,<#
      }
      #><#
      if (hasOrgId) {
      #>
      org_id,<#
      }
      #><#
      if (hasIsSys) {
      #>
      is_sys,<#
      }
      #><#
      if (hasVersion) {
      #>
      version,<#
      }
      #><#
      if (hasIsHidden) {
      #>
      is_hidden,<#
      }
      #><#
      if (hasIsDeleted) {
      #>
      is_deleted,<#
      }
      #><#
      for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (
        column_name === "tenant_id" ||
        column_name === "org_id" ||
        column_name === "is_sys" ||
        column_name === "is_deleted" ||
        column_name === "is_hidden" ||
        column_name === "create_usr_id" ||
        column_name === "create_time" ||
        column_name === "update_usr_id" ||
        column_name === "update_time"
      ) continue;
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
      const foreignKey = column.foreignKey;
      let is_nullable = column.IS_NULLABLE === "YES";
      #><#
        if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
          || data_type === "date" || data_type === "datetime"
        ) {
      #>
      <#=column_name_rust#>,
      <#=column_name#>_lbl,<#
        } else if (column.DATA_TYPE === 'tinyint') {
      #>
      <#=column_name_rust#>,
      <#=column_name#>_lbl,<#
        } else {
      #>
      <#=column_name_rust#>,<#
        }
      #><#
      }
      #><#
      if (hasCreateUsrId) {
      #>
      create_usr_id,
      create_usr_id_lbl,<#
      }
      #><#
      if (hasCreateTime) {
      #>
      create_time,
      create_time_lbl,<#
      }
      #><#
      if (hasUpdateUsrId) {
      #>
      update_usr_id,
      update_usr_id_lbl,<#
      }
      #><#
      if (hasUpdateTime) {
      #>
      update_time,
      update_time_lbl,<#
      }
      #><#
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
      #>
      <#=table#>_models: vec![],<#
      }
      #>
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case"<#
if (table === "i18n") {
#>, name = "<#=tableUP#>FieldComment"<#
}
#>)]
pub struct <#=tableUP#>FieldComment {<#
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
    const column_name_rust = rustKeyEscape(column_name);
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
    let is_nullable = column.IS_NULLABLE === "YES";
    const onlyCodegenDeno = column.onlyCodegenDeno;
  #><#
    if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
      || data_type === "date" || data_type === "datetime"
    ) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: String,
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name#>_lbl: String,<#
    } else {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: String,<#
    }
  #><#
  }
  #>
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case"<#
if (table === "i18n") {
#>, name = "<#=tableUP#>Search"<#
}
#>)]
pub struct <#=tableUP#>Search {
  /// ID
  pub id: Option<<#=Table_Up#>Id>,
  /// ID列表
  pub ids: Option<Vec<<#=Table_Up#>Id>>,<#
  if (hasTenantId) {
  #>
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,<#
  }
  #><#
  if (hasOrgId) {
  #>
  /// 组织ID
  pub org_id: Option<OrgId>,<#
  }
  #><#
  if (hasIsHidden) {
  #>
  #[graphql(skip)]
  pub is_hidden: Option<Vec<u8>>,<#
  }
  #><#
  if (hasIsDeleted) {
  #>
  pub is_deleted: Option<u8>,<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    if (column_name === 'id') continue;
    if (
      column_name === "tenant_id" ||
      column_name === "org_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden"
    ) continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE?.toLowerCase() || "";
    const column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const isPassword = column.isPassword;
    const isEncrypt = column.isEncrypt;
    if (isEncrypt) continue;
    let is_nullable = column.IS_NULLABLE === "YES";
    let _data_type = "String";
    if (foreignKey && foreignKey.multiple) {
      _data_type = `${ foreignTable_Up }Id`;
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
    const onlyCodegenDeno = column.onlyCodegenDeno;
  #><#
    if (foreignKey && foreignKey.type !== "many2many") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name#>_is_null: Option<bool>,<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name#>_is_null: Option<bool>,<#
    } else if (column.dict || column.dictbiz) {
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
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: Option<Vec<<#=enumColumnName#>>>,<#
    } else if (foreignKey) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,<#
    } else if (data_type === "int" || data_type === "decimal" || data_type === "double" || data_type === "datetime" || data_type === "date") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,<#
    } else if (data_type === "tinyint") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,<#
    } else if (data_type === "varchar" || data_type === "text") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name#>_like: Option<<#=_data_type#>>,<#
    } else {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,<#
    }
  #><#
  }
  #>
}

impl std::fmt::Debug for <#=tableUP#>Search {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("<#=tableUP#>Search");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref ids) = self.ids {
      item = item.field("ids", ids);
    }<#
    if (hasTenantId) {
    #>
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }<#
    }
    #><#
    if (hasOrgId) {
    #>
    if let Some(ref org_id) = self.org_id {
      item = item.field("org_id", org_id);
    }<#
    }
    #><#
    if (hasIsHidden) {
    #>
    if let Some(ref is_hidden) = self.is_hidden {
      item = item.field("is_hidden", is_hidden);
    }<#
    }
    #><#
    if (hasIsDeleted) {
    #>
    if let Some(ref is_deleted) = self.is_deleted {
      if *is_deleted == 1 {
        item = item.field("is_deleted", is_deleted);
      }
    }<#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.isVirtual) continue;
      const column_name = column.COLUMN_NAME;
      const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
      if (column_name === 'id') continue;
      if (
        column_name === "tenant_id" ||
        column_name === "org_id" ||
        column_name === "is_sys" ||
        column_name === "is_deleted" ||
        column_name === "is_hidden"
      ) continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE?.toLowerCase() || "";
      const column_comment = column.COLUMN_COMMENT || "";
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const isPassword = column.isPassword;
      const isEncrypt = column.isEncrypt;
      if (isEncrypt) continue;
      let is_nullable = column.IS_NULLABLE === "YES";
    #><#
      if (foreignKey) {
    #>
    // <#=column_comment#>
    if let Some(ref <#=column_name_rust#>) = self.<#=column_name_rust#> {
      item = item.field("<#=column_name_rust#>", <#=column_name_rust#>);
    }
    if let Some(ref <#=column_name_rust#>_is_null) = self.<#=column_name_rust#>_is_null {
      item = item.field("<#=column_name_rust#>_is_null", <#=column_name_rust#>_is_null);
    }<#
      } else if (foreignKey && foreignKey.type === "many2many") {
    #>
    // <#=column_comment#>
    if let Some(ref <#=column_name_rust#>) = self.<#=column_name_rust#> {
      item = item.field("<#=column_name_rust#>", <#=column_name_rust#>);
    }<#
      } else if (!column.dict && !column.dictbiz && (data_type === "varchar" || data_type === "text")) {
    #>
    // <#=column_comment#>
    if let Some(ref <#=column_name_rust#>) = self.<#=column_name_rust#> {
      item = item.field("<#=column_name_rust#>", <#=column_name_rust#>);
    }
    if let Some(ref <#=column_name_rust#>_like) = self.<#=column_name_rust#>_like {
      item = item.field("<#=column_name_rust#>_like", <#=column_name_rust#>_like);
    }<#
      } else {
    #>
    // <#=column_comment#>
    if let Some(ref <#=column_name_rust#>) = self.<#=column_name_rust#> {
      item = item.field("<#=column_name_rust#>", <#=column_name_rust#>);
    }<#
      }
    #><#
    }
    #>
    item.finish()
  }
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case"<#
if (table === "i18n") {
#>, name = "<#=tableUP#>Input"<#
}
#>)]
pub struct <#=tableUP#>Input {
  /// ID
  pub id: Option<<#=Table_Up#>Id>,<#
  if (hasIsDeleted) {
  #>
  #[graphql(skip)]
  pub is_deleted: Option<u8>,<#
  }
  #><#
  if (hasTenantId) {
  #>
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,<#
  }
  #><#
  if (hasOrgId) {
  #>
  /// 组织ID
  #[graphql(skip)]
  pub org_id: Option<OrgId>,<#
  }
  #><#
  if (hasIsSys) {
  #>
  /// 系统记录
  #[graphql(skip)]
  pub is_sys: Option<u8>,<#
  }
  #><#
  if (hasIsHidden) {
  #>
  /// 隐藏字段
  #[graphql(skip)]
  pub is_hidden: Option<u8>,<#
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
      column_name === "is_hidden" ||
      column_name === "create_usr_id" ||
      column_name === "create_time" ||
      column_name === "update_usr_id" ||
      column_name === "update_time"
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
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const isPassword = column.isPassword;
    let _data_type = "String";
    if (foreignKey) {
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
    if (column_name === "id") {
      _data_type = "String";
    }
    const onlyCodegenDeno = column.onlyCodegenDeno;
  #><#
    if (selectList.length > 0 || column.dict || column.dictbiz) {
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
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: Option<<#=enumColumnName#>>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name#>_lbl: Option<String>,<#
    } else if (foreignKey && foreignKey?.multiple) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name#>_lbl: Option<Vec<String>>,<#
  } else if (foreignKey && !foreignKey?.multiple) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name#>_lbl: Option<String>,<#
  } else if (data_type === "date" || data_type === "datetime") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name#>_lbl: Option<String>,<#
  } else {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno) {
  #>
  #[graphql(skip)]<#
  }
  #>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,<#
  }
  #><#
  }
  #><#
  if (hasCreateUsrId) {
  #>
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: Option<UsrId>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: Option<String>,<#
  }
  #><#
  if (hasCreateTime) {
  #>
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_lbl: Option<String>,<#
  }
  #><#
  if (hasUpdateUsrId) {
  #>
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: Option<UsrId>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: Option<String>,<#
  }
  #><#
  if (hasUpdateTime) {
  #>
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: Option<String>,<#
  }
  #><#
  if (hasVersion) {
  #>
  /// 版本号
  pub version: Option<u32>,<#
  }
  #><#
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
  #>
  /// <#=inlineForeignTab.label#>
  pub <#=table#>_models: Option<Vec<<#=Table_Up#>Input>>,<#
  }
  #>
}

impl From<<#=tableUP#>Model> for <#=tableUP#>Input {
  fn from(model: <#=tableUP#>Model) -> Self {
    Self {
      id: model.id.into(),<#
      if (hasIsDeleted) {
      #>
      is_deleted: model.is_deleted.into(),<#
      }
      #><#
      if (hasTenantId) {
      #>
      tenant_id: model.tenant_id.into(),<#
      }
      #><#
      if (hasOrgId) {
      #>
      org_id: model.org_id.into(),<#
      }
      #><#
      if (hasIsSys) {
      #>
      is_sys: model.is_sys.into(),<#
      }
      #><#
      if (hasVersion) {
      #>
      version: model.version.into(),<#
      }
      #><#
      if (hasIsHidden) {
      #>
      is_hidden: model.is_hidden.into(),<#
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
          column_name === "is_hidden" ||
          column_name === "create_usr_id" ||
          column_name === "create_time" ||
          column_name === "update_usr_id" ||
          column_name === "update_time"
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
        const foreignTable = foreignKey && foreignKey.table;
        const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        let is_nullable = column.IS_NULLABLE === "YES";
        if (foreignKey && foreignKey.multiple) {
          is_nullable = false;
        }
      #><#
        if (
          (foreignKey || selectList.length > 0 || column.dict || column.dictbiz)
          || (data_type === "date" || data_type === "datetime")
        ) {
      #>
      // <#=column_comment#>
      <#=column_name_rust#>: model.<#=column_name_rust#><#
        if (!is_nullable) {
      #>.into()<#
        }
      #>,
      <#=column_name#>_lbl: model.<#=column_name#>_lbl.into(),<#
        } else {
      #>
      // <#=column_comment#>
      <#=column_name_rust#>: model.<#=column_name_rust#><#
        if (!is_nullable) {
      #>.into()<#
        }
      #>,<#
        }
      #><#
      }
      #><#
      if (hasCreateUsrId) {
      #>
      // 创建人
      create_usr_id: model.create_usr_id.into(),
      create_usr_id_lbl: model.create_usr_id_lbl.into(),<#
      }
      #><#
      if (hasCreateTime) {
      #>
      // 创建时间
      create_time: model.create_time,
      create_time_lbl: model.create_time_lbl.into(),<#
      }
      #><#
      if (hasUpdateUsrId) {
      #>
      // 更新人
      update_usr_id: model.update_usr_id.into(),
      update_usr_id_lbl: model.update_usr_id_lbl.into(),<#
      }
      #><#
      if (hasUpdateTime) {
      #>
      // 更新时间
      update_time: model.update_time,
      update_time_lbl: model.update_time_lbl.into(),<#
      }
      #><#
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
      #>
      // <#=inlineForeignTab.label#>
      <#=table#>_models: model.<#=table#>_models
        .into_iter()
        .map(|x| x.into())
        .collect::<Vec<<#=Table_Up#>Input>>()
        .into(),<#
      }
      #>
    }
  }
}

impl From<<#=tableUP#>Input> for <#=tableUP#>Search {
  fn from(input: <#=tableUP#>Input) -> Self {
    Self {
      id: input.id,
      ids: None,<#
      if (hasTenantId) {
      #>
      // 租户ID
      tenant_id: input.tenant_id,<#
      }
      #><#
      if (hasOrgId) {
      #>
      // 组织ID
      org_id: input.org_id,<#
      }
      #><#
      if (hasIsHidden) {
      #>
      // 隐藏字段
      is_hidden: input.is_hidden.map(|x| vec![x]),<#
      }
      #><#
      if (hasIsDeleted) {
      #>
      is_deleted: None,<#
      }
      #><#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        if (column.isVirtual) continue;
        const column_name = rustKeyEscape(column.COLUMN_NAME);
        if (
          column_name === "tenant_id" ||
          column_name === "org_id" ||
          column_name === "is_sys" ||
          column_name === "is_deleted" ||
          column_name === "is_hidden"
        ) continue;
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
        const foreignTable = foreignKey && foreignKey.table;
        const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        const isPassword = column.isPassword;
        if (column_name === "id") {
          continue;
        }
      #><#
      if (foreignKey && foreignKey.multiple) {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>,<#
      } else if (foreignKey && !foreignKey.multiple) {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>.map(|x| vec![x]),<#
        } else if ((selectList && selectList.length > 0) || column.dict || column.dictbiz) {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>.map(|x| vec![x]),<#
      } else if (["tinyint"].includes(data_type)) {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>.map(|x| vec![x]),<#
      } else if (["date","datetime","time","int","decimal"].includes(data_type)) {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>.map(|x| vec![x, x]),<#
      } else {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>,<#
      }
      #><#
      }
      #>
      ..Default::default()
    }
  }
}<#
if (opts?.history_table) {
  const historyTable = opts.history_table;
  const historyTableUp = historyTable.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
#>

impl From<<#=tableUP#>Model> for crate::gen::<#=mod#>::<#=historyTable#>::<#=historyTable#>_model::<#=historyTableUp#>Input {
  fn from(model: <#=tableUP#>Model) -> Self {
    Self {<#
      if (hasTenantId) {
      #>
      // 租户ID
      tenant_id: input.tenant_id,<#
      }
      #><#
      if (hasOrgId) {
      #>
      // 组织ID
      org_id: input.org_id,<#
      }
      #><#
      if (hasIsSys) {
      #>
      // 系统记录
      is_sys: input.is_sys,<#
      }
      #><#
      if (hasIsHidden) {
      #>
      // 隐藏字段
      is_hidden: input.is_hidden,<#
      }
      #><#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        const column_name = column.COLUMN_NAME;
        if (column_name === "id") {
          continue;
        }
        if (
          column_name === "tenant_id" ||
          column_name === "org_id" ||
          column_name === "is_sys" ||
          column_name === "is_deleted"
        ) continue;
        const column_name_rust = rustKeyEscape(column_name);
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
        const foreignKey = column.foreignKey;
        if (isPassword) {
          continue;
        }
      #><#
        if (foreignKey && foreignKey.multiple) {
      #>
      /// <#=column_comment#>
      <#=column_name#>: model.<#=column_name#>.into(),
      <#=column_name#>_lbl: model.<#=column_name#>_lbl.into(),<#
        } else if (foreignKey && !foreignKey.multiple) {
      #>
      /// <#=column_comment#>
      <#=column_name#>: model.<#=column_name#>.into(),
      <#=column_name#>_lbl: model.<#=column_name#>_lbl.into(),<#
        } else if (selectList.length > 0 || column.dict || column.dictbiz
          || data_type === "date" || data_type === "datetime"
        ) {
      #>
      /// <#=column_comment#>
      <#=column_name#>: model.<#=column_name#>.into(),
      <#=column_name#>_lbl: model.<#=column_name#>_lbl.into(),<#
        } else {
      #>
      /// <#=column_comment#>
      <#=column_name#>: model.<#=column_name#>.into(),<#
        }
      #><#
      }
      #>
      <#=table#>_id: model.id.into(),
      ..Default::default()
    }
  }
}<#
}
#>

#[derive(Default, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct <#=Table_Up#>Id(SmolStr);

impl fmt::Display for <#=Table_Up#>Id {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "<#=Table_Up#>Id")]
impl async_graphql::ScalarType for <#=Table_Up#>Id {
  fn parse(value: async_graphql::Value) -> async_graphql::InputValueResult<Self> {
    match value {
      async_graphql::Value::String(s) => Ok(Self(s.into())),
      _ => Err(async_graphql::InputValueError::expected_type(value)),
    }
  }
  
  fn to_value(&self) -> async_graphql::Value {
    async_graphql::Value::String(self.0.clone().into())
  }
}

impl From<<#=Table_Up#>Id> for ArgType {
  fn from(value: <#=Table_Up#>Id) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&<#=Table_Up#>Id> for ArgType {
  fn from(value: &<#=Table_Up#>Id) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<<#=Table_Up#>Id> for SmolStr {
  fn from(id: <#=Table_Up#>Id) -> Self {
    id.0
  }
}

impl From<SmolStr> for <#=Table_Up#>Id {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for <#=Table_Up#>Id {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for <#=Table_Up#>Id {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for <#=Table_Up#>Id {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for <#=Table_Up#>Id {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for <#=Table_Up#>Id {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> IsNull {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for <#=Table_Up#>Id {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for <#=Table_Up#>Id {
  fn decode(
    value: <MySql as sqlx::database::HasValueRef>::ValueRef,
  ) -> Result<Self, sqlx::error::BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}<#
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
  const column_default = column.COLUMN_DEFAULT;
  if (!column.dict && !column.dictbiz) continue;
  const data_type = column.DATA_TYPE;
  if ([ "int", "decimal", "tinyint" ].includes(data_type)) {
    continue;
  }
  let Column_Up = column_name.substring(0, 1).toUpperCase()+column_name.substring(1);
  Column_Up = Column_Up.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const enumColumnName = Table_Up + Column_Up;
  const columnDictModels = [
    ...dictModels.filter(function(item) {
      return item.code === column.dict || item.code === column.dictbiz;
    }),
    ...dictbizModels.filter(function(item) {
      return item.code === column.dict || item.code === column.dictbiz;
    }),
  ];
  if (columnDictModels.length === 0) continue;
  const columnDictDefault = column_default && columnDictModels.find(function(item) {
    return item.val === column_default;
  });
  const require = column.require;
  if (require && !columnDictDefault) {
    throw `表: ${ mod }_${ table } 的字段: ${ column_name } 的默认值: ${ column_default } 在字典中不存在`;
    process.exit(1);
  }
#>

/// <#=table_comment#><#=column_comment#>
#[derive(Enum, Copy, Clone, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum <#=enumColumnName#> {<#
  for (const columnDictModel of columnDictModels) {
    const val = columnDictModel.val;
    const lbl = columnDictModel.lbl;
    let valUp = val.substring(0, 1).toUpperCase()+val.substring(1);
    valUp = valUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  /// <#=lbl#>
  #[graphql(name="<#=val#>")]
  <#=valUp#>,<#
  }
  #>
}

impl fmt::Display for <#=enumColumnName#> {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {<#
      for (const columnDictModel of columnDictModels) {
        const val = columnDictModel.val;
        const lbl = columnDictModel.lbl;
        let valUp = val.substring(0, 1).toUpperCase()+val.substring(1);
        valUp = valUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
      #>
      Self::<#=valUp#> => write!(f, "<#=val#>"),<#
      }
      #>
    }
  }
}

impl From<<#=enumColumnName#>> for SmolStr {
  fn from(value: <#=enumColumnName#>) -> Self {
    match value {<#
      for (const columnDictModel of columnDictModels) {
        const val = columnDictModel.val;
        const lbl = columnDictModel.lbl;
        let valUp = val.substring(0, 1).toUpperCase()+val.substring(1);
        valUp = valUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
      #>
      <#=enumColumnName#>::<#=valUp#> => "<#=val#>".into(),<#
      }
      #>
    }
  }
}

impl From<<#=enumColumnName#>> for String {
  fn from(value: <#=enumColumnName#>) -> Self {
    match value {<#
      for (const columnDictModel of columnDictModels) {
        const val = columnDictModel.val;
        const lbl = columnDictModel.lbl;
        let valUp = val.substring(0, 1).toUpperCase()+val.substring(1);
        valUp = valUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
      #>
      <#=enumColumnName#>::<#=valUp#> => "<#=val#>".into(),<#
      }
      #>
    }
  }
}

impl From<<#=enumColumnName#>> for ArgType {
  fn from(value: <#=enumColumnName#>) -> Self {
    ArgType::SmolStr(value.into())
  }
}<#
if (columnDictDefault) {
#>

impl Default for <#=enumColumnName#> {
  fn default() -> Self {<#
    if (columnDictDefault) {
      const val = columnDictDefault.val;
      let valUp = val.substring(0, 1).toUpperCase()+val.substring(1);
      valUp = valUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
    #>
    Self::<#=valUp#><#
    }
    #>
  }
}<#
}
#>

impl FromStr for <#=enumColumnName#> {
  type Err = anyhow::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {<#
      for (const columnDictModel of columnDictModels) {
        const val = columnDictModel.val;
        const lbl = columnDictModel.lbl;
        let valUp = val.substring(0, 1).toUpperCase()+val.substring(1);
        valUp = valUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
      #>
      "<#=val#>" => Ok(Self::<#=valUp#>),<#
      }
      #>
      _ => Err(anyhow::anyhow!("<#=enumColumnName#> can't convert from {s}")),
    }
  }
}

impl <#=enumColumnName#> {
  pub fn as_str(&self) -> &str {
    match self {<#
      for (const columnDictModel of columnDictModels) {
        const val = columnDictModel.val;
        const lbl = columnDictModel.lbl;
        let valUp = val.substring(0, 1).toUpperCase()+val.substring(1);
        valUp = valUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
      #>
      Self::<#=valUp#> => "<#=val#>",<#
      }
      #>
    }
  }
}

impl TryFrom<String> for <#=enumColumnName#> {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {<#
      for (const columnDictModel of columnDictModels) {
        const val = columnDictModel.val;
        const lbl = columnDictModel.lbl;
        let valUp = val.substring(0, 1).toUpperCase()+val.substring(1);
        valUp = valUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1);
        }).join("");
      #>
      "<#=val#>" => Ok(Self::<#=valUp#>),<#
      }
      #>
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "<#=column_name#>".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "<#=enumColumnName#> can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}<#
}
#>
