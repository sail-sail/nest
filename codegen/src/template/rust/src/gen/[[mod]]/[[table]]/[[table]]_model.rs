<#
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const tableUP = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const hasTenantId = columns.some((column) => column.COLUMN_NAME === "tenant_id");
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
let hasDecimal = false;
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.noList) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (column_name === "version") continue;
  const foreignKey = column.foreignKey;
  const data_type = column.DATA_TYPE;
  if (data_type !== "decimal") {
    continue;
  }
  hasDecimal = true;
  break;
}
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

const tableFieldPermit = columns.some((item) => item.fieldPermit);

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

#>
use std::fmt;
use std::ops::Deref;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use std::sync::OnceLock;

use serde::{Serialize, Deserialize};

use color_eyre::eyre::{Result,eyre};

use sqlx::encode::{Encode, IsNull};
use sqlx::error::BoxDynError;
use sqlx::MySql;
use sqlx::mysql::MySqlValueRef;
use smol_str::SmolStr;<#
if (hasDecimal) {
#>
use rust_decimal::Decimal;<#
}
#>

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

use crate::common::context::ArgType;
use crate::common::gql::model::SortInput;<#
if (hasAudit && auditTable_Up) {
#>

use crate::r#gen::<#=auditMod#>::<#=auditTable#>::<#=auditTable#>_model::<#=auditTable_Up#>Model;<#
}
#><#
if (hasEncrypt) {
#>

use crate::common::util::dao::decrypt;<#
}
#><#
if (opts.langTable && isUseI18n) {
#>

use crate::src::base::i18n::i18n_dao::get_server_i18n_enable;<#
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

use crate::r#gen::<#=mod#>::<#=table#>::<#=table#>_model::{
  <#=Table_Up#>Model,
  <#=Table_Up#>Input,
};<#
}
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const column_name = column.COLUMN_NAME;
  const table_comment = column.COLUMN_COMMENT;
  const is_nullable = column.IS_NULLABLE === "YES";
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
  if (foreignTableArr.includes(table)) continue;
  foreignTableArr.push(table);
#>

// <#=table_comment#>
use crate::r#gen::<#=mod#>::<#=table#>::<#=table#>_model::{
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

use crate::r#gen::base::tenant::tenant_model::TenantId;<#
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
use crate::r#gen::<#=foreignKey.mod#>::<#=foreignTable#>::<#=foreignTable#>_model::<#=modelId#>;<#
}
#><#
if (tableFieldPermit) {
#>

use crate::src::base::field_permit::field_permit_service::get_field_permit;<#
}
#>

<#
const can_sort_in_api_props = [ ];
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
  const data_type = column.DATA_TYPE;
  const column_comment = column.COLUMN_COMMENT;
  const foreignKey = column.foreignKey;
  const foreignTable = foreignKey && foreignKey.table;
  const canSortInApi = column.canSortInApi;
  if (!canSortInApi) continue;
  if (foreignKey && foreignKey.type === "multiple") continue;
  let sortBy = column_name;
  if (foreignKey) {
    sortBy = sortBy + "_lbl";
  }
  can_sort_in_api_props.push(sortBy);
}
#>static CAN_SORT_IN_API_<#=table.toUpperCase()#>: OnceLock<[&'static str; <#=can_sort_in_api_props.length#>]> = OnceLock::new();

/// <#=table_comment#> 前端允许排序的字段
fn get_can_sort_in_api_<#=table#>() -> &'static [&'static str; <#=can_sort_in_api_props.length#>] {
  CAN_SORT_IN_API_<#=table.toUpperCase()#>.get_or_init(|| [<#
    for (let i = 0; i < can_sort_in_api_props.length; i++) {
      const prop = can_sort_in_api_props[i];
    #>
    "<#=prop#>",<#
    }
    #>
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "<#=tableUP#>Model")]
#[allow(dead_code)]
pub struct <#=tableUP#>Model {<#
  if (hasTenantId) {
  #>
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,<#
  }
  #><#
  if (hasIsSys) {
  #>
  /// 系统字段
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
    const column_type = column.COLUMN_TYPE?.toLowerCase() || "";
    const column_comment = column.COLUMN_COMMENT || "";
    const isPassword = column.isPassword;
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let foreignSchema = undefined;
    if (foreignKey) {
      foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
      if (!foreignSchema) {
        throw `表: ${ mod }_${ table } 的外键 ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
        process.exit(1);
      }
    }
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
      _data_type = "Decimal";
    }
    if (is_nullable) {
      _data_type = "Option<"+_data_type+">";
    }
    const onlyCodegenDeno = column.onlyCodegenDeno;
    const onlyCodegenDenoButApi = column.onlyCodegenDenoButApi;
    const isAuditColumn = hasAudit && auditColumn === column_name;
  #><#
    if (column_name === "id") {
  #>
  /// ID
  pub id: <#=Table_Up#>Id,<#
    } else if (foreignKey && foreignKey.multiple) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: <#=_data_type#>,<#
    if (hasModelLabel) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=modelLabel#>")]<#
  }
  #>
  pub <#=modelLabel#>: Vec<String>,<#
    }
  #><#
    for (let j = 0; j < cascade_fields.length; j++) {
      const cascade_field = cascade_fields[j];
      // 查找外键表的字段的数据类型, 重置 _data_type
      const cascade_field_column = foreignSchema.columns.find((itemTmp) => itemTmp.COLUMN_NAME === cascade_field);
      if (!cascade_field_column) {
        throw `表: ${ foreignKey.mod }_${ foreignKey.table } 的外键字段 ${ cascade_field } 不存在`;
        process.exit(1);
      }
      let _data_type = "String";
      if (cascade_field_column.DATA_TYPE === 'varchar') {
        _data_type = 'String';
      }
      else if (cascade_field_column.DATA_TYPE === 'date') {
        _data_type = "chrono::NaiveDate";
      }
      else if (cascade_field_column.DATA_TYPE === 'datetime') {
        _data_type = "chrono::NaiveDateTime";
      }
      else if (cascade_field_column.DATA_TYPE === 'time') {
        _data_type = "chrono::NaiveTime";
      }
      else if (cascade_field_column.DATA_TYPE === 'int' && !cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
        _data_type = 'i32';
      }
      else if (cascade_field_column.DATA_TYPE === 'int' && cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
        _data_type = 'u32';
      }
      else if (cascade_field_column.DATA_TYPE === 'json') {
        _data_type = 'String';
      }
      else if (cascade_field_column.DATA_TYPE === 'text') {
        _data_type = 'String';
      }
      else if (cascade_field_column.DATA_TYPE === 'tinyint' && !cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
        _data_type = 'i8';
      }
      else if (cascade_field_column.DATA_TYPE === 'tinyint' && cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
        _data_type = 'u8';
      }
      else if (cascade_field_column.DATA_TYPE === 'decimal') {
        _data_type = 'Decimal';
      }
  #>
  /// <#=column_comment#><#=cascade_field_column.COLUMN_COMMENT#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>_<#=cascade_field#>")]<#
  }
  #>
  pub <#=column_name#>_<#=cascade_field#>: Vec<<#=_data_type#>>,<#
    }
  #><#
    } else if (foreignKey && !foreignKey.multiple) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: <#=_data_type#>,<#
    if (hasModelLabel) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=modelLabel#>")]<#
  }
  #>
  pub <#=modelLabel#>: String,<#
    }
  #><#
    for (let j = 0; j < cascade_fields.length; j++) {
      const cascade_field = cascade_fields[j];
      // 查找外键表的字段的数据类型, 重置 _data_type
      const cascade_field_column = foreignSchema.columns.find((itemTmp) => itemTmp.COLUMN_NAME === cascade_field);
      if (!cascade_field_column) {
        throw `表: ${ foreignKey.mod }_${ foreignKey.table } 的外键字段 ${ cascade_field } 不存在`;
        process.exit(1);
      }
      let _data_type = "String";
      if (cascade_field_column.DATA_TYPE === 'varchar') {
        _data_type = 'String';
      }
      else if (cascade_field_column.DATA_TYPE === 'date') {
        _data_type = "chrono::NaiveDate";
      }
      else if (cascade_field_column.DATA_TYPE === 'datetime') {
        _data_type = "chrono::NaiveDateTime";
      }
      else if (cascade_field_column.DATA_TYPE === 'time') {
        _data_type = "chrono::NaiveTime";
      }
      else if (cascade_field_column.DATA_TYPE === 'int' && !cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
        _data_type = 'i32';
      }
      else if (cascade_field_column.DATA_TYPE === 'int' && cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
        _data_type = 'u32';
      }
      else if (cascade_field_column.DATA_TYPE === 'json') {
        _data_type = 'String';
      }
      else if (cascade_field_column.DATA_TYPE === 'text') {
        _data_type = 'String';
      }
      else if (cascade_field_column.DATA_TYPE === 'tinyint' && !cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
        _data_type = 'i8';
      }
      else if (cascade_field_column.DATA_TYPE === 'tinyint' && cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
        _data_type = 'u8';
      }
      else if (cascade_field_column.DATA_TYPE === 'decimal') {
        _data_type = 'Decimal';
      }
  #>
  /// <#=column_comment#><#=cascade_field_column.COLUMN_COMMENT#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>_<#=cascade_field#>")]<#
  }
  #>
  pub <#=column_name#>_<#=cascade_field#>: <#=_data_type#>,<#
    }
  #><#
    } else if (data_type === "date" || data_type === "datetime") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: <#=_data_type#>,<#
    if (hasModelLabel) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=modelLabel#>")]<#
  }
  #>
  pub <#=modelLabel#>: String,<#
    }
  #><#
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
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: <#=enumColumnName#>,<#
    if (hasModelLabel) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=modelLabel#>")]<#
  }
  #>
  pub <#=modelLabel#>: String,<#
    }
  #><#
  if (isAuditColumn && auditTable_Up) {
  #>
  #[graphql(name = "<#=column_name_rust#>_recent_model")]
  pub <#=column_name_rust#>_recent_model: Option<<#=auditTable_Up#>Model>,<#
  }
  #><#
    } else if (data_type === "tinyint") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: <#=_data_type#>,<#
    } else {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
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
    const inline_column_name = inlineForeignTab.column_name;
    const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
  #><#
    if (inline_foreign_type === "one2many") {
  #>
  /// <#=inlineForeignTab.label#>
  pub <#=inline_column_name#>: Vec<<#=Table_Up#>Model>,<#
    } else if (inline_foreign_type === "one2one") {
  #>
  /// <#=inlineForeignTab.label#>
  pub <#=inline_column_name#>: Option<<#=Table_Up#>Model>,<#
    }
  #><#
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
  #>
  // <#=table_comment#>
  pub <#=column_name#>_<#=table#>_models: Option<Vec<<#=Table_Up#>Model>>,<#
  }
  #>
}

impl FromRow<'_, MySqlRow> for <#=tableUP#>Model {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {<#
    if (opts.langTable && isUseI18n) {
    #>
    
    let server_i18n_enable = get_server_i18n_enable();<#
    }
    #><#
    if (hasTenantId) {
    #>
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;<#
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
      column_name === "is_sys" ||
      column_name === "is_deleted" ||
      column_name === "is_hidden" ||
      column_name === "create_usr_id" ||
      column_name === "create_time" ||
      column_name === "update_usr_id" ||
      column_name === "update_time"
    ) continue;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE?.toLowerCase() || "";
    const column_comment = column.COLUMN_COMMENT || "";
    const isPassword = column.isPassword;
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let foreignSchema = undefined;
    if (foreignKey) {
      foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
      if (!foreignSchema) {
        throw `表: ${ mod }_${ table } 的外键 ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
        process.exit(1);
      }
    }
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
      _data_type = "Decimal";
    }
    if (is_nullable) {
      _data_type = "Option<"+_data_type+">";
    }
    const isVirtual = column.isVirtual;
    const isEncrypt = column.isEncrypt;
    let precision = 0;
    if (data_type === "decimal") {
      const arr = JSON.parse("["+column_type.substring(column_type.indexOf("(")+1, column_type.lastIndexOf(")"))+"]");
      precision = Number(arr[1]);
    }
    const column_default = column.COLUMN_DEFAULT || "";
    #><#
      if (data_type === "decimal" && isVirtual) {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#> = Decimal::try_from(<#=column_default || 0#>).unwrap();<#
        continue;
      } else if ((data_type === "varchar" || data_type === "text") && isVirtual) {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#> = "<#=column_default || ""#>".to_owned();<#
        continue;
      } else if ([ "int", "tinyint" ].includes(data_type) && isVirtual) {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#> = <#=column_default || 0#>.to_owned();<#
        continue;
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
    };<#
      if (hasModelLabel && !column.modelLabel) {
    #>
    let <#=column_name#>_lbl: Option<sqlx::types::Json<HashMap<String, String>>> = row.try_get("<#=column_name#>_lbl")?;
    let <#=column_name#>_lbl = <#=column_name#>_lbl.unwrap_or_default().0;
    let <#=column_name#>_lbl = {
      let mut keys: Vec<u32> = <#=column_name#>_lbl.keys()
        .map(|x| 
          x.parse::<u32>()
            .map_err(|_| sqlx::Error::Decode(
              Box::new(sqlx::error::Error::Protocol(
                "<#=column_name#>_lbl order_by Invalid u32".to_string()
              ))
            ))
        )
        .collect::<Result<_, _>>()?;
      keys.sort();
      keys
        .into_iter()
        .map(|x| 
          <#=column_name#>_lbl.get(&x.to_string())
            .map(|x| x.to_owned())
            .unwrap_or_default()
        )
        .collect::<Vec<String>>()
    };<#
      } else if (hasModelLabel) {
    #>
    let <#=modelLabel#>: Option<String> = row.try_get("<#=modelLabel#>")?;
    let <#=modelLabel#>: String = <#=modelLabel#>.unwrap_or_default();
    let <#=modelLabel#> = <#=modelLabel#>
      .split(',')
      .map(|x| x.to_owned())
      .collect::<Vec<String>>();<#
    }
    #><#
      for (let j = 0; j < cascade_fields.length; j++) {
        const cascade_field = cascade_fields[j];
        // 查找外键表的字段的数据类型, 重置 _data_type
        const cascade_field_column = foreignSchema.columns.find((itemTmp) => itemTmp.COLUMN_NAME === cascade_field);
        if (!cascade_field_column) {
          throw `表: ${ foreignKey.mod }_${ foreignKey.table } 的外键字段 ${ cascade_field } 不存在`;
          process.exit(1);
        }
        let _data_type = "String";
        if (cascade_field_column.DATA_TYPE === 'varchar') {
          _data_type = 'String';
        }
        else if (cascade_field_column.DATA_TYPE === 'date') {
          _data_type = "chrono::NaiveDate";
        }
        else if (cascade_field_column.DATA_TYPE === 'datetime') {
          _data_type = "chrono::NaiveDateTime";
        }
        else if (cascade_field_column.DATA_TYPE === 'time') {
          _data_type = "chrono::NaiveTime";
        }
        else if (cascade_field_column.DATA_TYPE === 'int' && !cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
          _data_type = 'i32';
        }
        else if (cascade_field_column.DATA_TYPE === 'int' && cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
          _data_type = 'u32';
        }
        else if (cascade_field_column.DATA_TYPE === 'json') {
          _data_type = 'String';
        }
        else if (cascade_field_column.DATA_TYPE === 'text') {
          _data_type = 'String';
        }
        else if (cascade_field_column.DATA_TYPE === 'tinyint' && !cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
          _data_type = 'i8';
        }
        else if (cascade_field_column.DATA_TYPE === 'tinyint' && cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
          _data_type = 'u8';
        }
        else if (cascade_field_column.DATA_TYPE === 'decimal') {
          _data_type = 'Decimal';
        }
    #>
    // <#=column_comment#><#=cascade_field_column.COLUMN_COMMENT#>
    let <#=column_name#>_<#=cascade_field#>: Option<sqlx::types::Json<HashMap<String, <#=_data_type#>>>> = row.try_get("<#=column_name#>_<#=cascade_field#>")?;
    let <#=column_name#>_<#=cascade_field#> = <#=column_name#>_<#=cascade_field#>.unwrap_or_default().0;
    let <#=column_name#>_<#=cascade_field#> = {
      let mut keys: Vec<u32> = <#=column_name#>_<#=cascade_field#>.keys()
        .map(|x| 
          x.parse::<u32>()
            .map_err(|_| sqlx::Error::Decode(
              Box::new(sqlx::error::Error::Protocol(
                "<#=column_name#>_<#=cascade_field#> order_by Invalid u32".to_string()
              ))
            ))
        )
        .collect::<Result<_, _>>()?;
      keys.sort();
      keys
        .into_iter()
        .map(|x| 
          <#=column_name#>_<#=cascade_field#>
            .get(&x.to_string())
            .map(|x| x.to_owned())
            .unwrap_or_default()
        )
        .collect::<Vec<<#=_data_type#>>>()
    };<#
      }
    #><#
      } else if (foreignKey && !foreignKey.multiple) {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=foreignTable_Up#>Id = row.try_get("<#=column_name#>")?;<#
      if (hasModelLabel) {
    #>
    let <#=modelLabel#>: Option<String> = row.try_get("<#=modelLabel#>")?;
    let <#=modelLabel#> = <#=modelLabel#>.unwrap_or_default();<#
      }
    #><#
      for (let j = 0; j < cascade_fields.length; j++) {
        const cascade_field = cascade_fields[j];
        // 查找外键表的字段的数据类型, 重置 _data_type
        const cascade_field_column = foreignSchema.columns.find((itemTmp) => itemTmp.COLUMN_NAME === cascade_field);
        if (!cascade_field_column) {
          throw `表: ${ foreignKey.mod }_${ foreignKey.table } 的外键字段 ${ cascade_field } 不存在`;
          process.exit(1);
        }
        let _data_type = "String";
        if (cascade_field_column.DATA_TYPE === 'varchar') {
          _data_type = 'String';
        }
        else if (cascade_field_column.DATA_TYPE === 'date') {
          _data_type = "chrono::NaiveDate";
        }
        else if (cascade_field_column.DATA_TYPE === 'datetime') {
          _data_type = "chrono::NaiveDateTime";
        }
        else if (cascade_field_column.DATA_TYPE === 'time') {
          _data_type = "chrono::NaiveTime";
        }
        else if (cascade_field_column.DATA_TYPE === 'int' && !cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
          _data_type = 'i32';
        }
        else if (cascade_field_column.DATA_TYPE === 'int' && cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
          _data_type = 'u32';
        }
        else if (cascade_field_column.DATA_TYPE === 'json') {
          _data_type = 'String';
        }
        else if (cascade_field_column.DATA_TYPE === 'text') {
          _data_type = 'String';
        }
        else if (cascade_field_column.DATA_TYPE === 'tinyint' && !cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
          _data_type = 'i8';
        }
        else if (cascade_field_column.DATA_TYPE === 'tinyint' && cascade_field_column.COLUMN_TYPE.endsWith("unsigned")) {
          _data_type = 'u8';
        }
        else if (cascade_field_column.DATA_TYPE === 'decimal') {
          _data_type = 'Decimal';
        }
    #>
    // <#=column_comment#><#=cascade_field_column.COLUMN_COMMENT#>
    let <#=column_name#>_<#=cascade_field#>: Option<<#_data_type#>> = row.try_get("<#=column_name#>_<#=cascade_field#>")?;
    let <#=column_name#>_<#=cascade_field#> = <#=column_name#>_<#=cascade_field#>.unwrap_or_default();<#
      }
    #><#
      } else if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
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
    #><#
      if (columnDictModels.length > 0) {
    #>
    // <#=column_comment#><#
      if (!column.modelLabel) {
    #>
    let <#=modelLabel#>: String = row.try_get("<#=column_name#>")?;
    let <#=column_name_rust#>: <#=enumColumnName#> = <#=modelLabel#>.clone().try_into()?;<#
      } else {
    #>
    let <#=modelLabel#>: String = row.try_get("<#=modelLabel#>")?;
    let <#=column_name_rust#>: <#=enumColumnName#> = row.try_get("<#=column_name#>")?.try_into()?;<#
      }
    #><#
      } else {
    #>
    // <#=column_comment#><#
      if (!column.modelLabel) {
    #>
    let <#=modelLabel#>: String = row.try_get("<#=column_name#>")?;
    let <#=column_name_rust#>: <#=enumColumnName#> = <#=modelLabel#>.clone();<#
      } else {
    #>
    let <#=modelLabel#>: String = row.try_get("<#=modelLabel#>")?;
    let <#=column_name_rust#>: <#=enumColumnName#> = row.try_get("<#=column_name#>")?;<#
      }
    #><#
      }
    #><#
      } else if ((column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(data_type)) {
    #>
    // <#=column_comment#><#
      if (!column.modelLabel) {
    #>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;
    let <#=modelLabel#>: String = <#=column_name_rust#>.to_string();<#
      } else {
    #>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;
    let <#=modelLabel#>: String = row.try_get("<#=modelLabel#>")?;<#
      }
    #><#
      } else if (data_type === "datetime") {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;<#
      if (is_nullable) {
    #>
    let <#=modelLabel#>: String = match <#=column_name_rust#> {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => String::new(),
    };<#
      } else {
    #>
    let <#=modelLabel#>: String = <#=column_name_rust#>.format("%Y-%m-%d %H:%M:%S").to_string();<#
      }
    #><#
      } else if (data_type === "date") {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;<#
      if (is_nullable) {
    #>
    let <#=modelLabel#>: String = match <#=column_name_rust#> {
      Some(item) => item.format(<#
        if (column.isMonth) {
      #>"%Y-%m"<#
        } else {
      #>"%Y-%m-%d"<#
        }
      #>).to_string(),
      None => String::new(),
    };<#
      } else {
    #>
    let <#=modelLabel#>: String = <#=column_name_rust#>.format(<#
        if (column.isMonth) {
      #>"%Y-%m"<#
        } else {
      #>"%Y-%m-%d"<#
        }
      #>).to_string();<#
      }
    #><#
      } else {
    #><#
        if (isEncrypt && [ "varchar", "text" ].includes(data_type)) {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;
    let <#=column_name_rust#>: <#=_data_type#> = decrypt(<#=column_name_rust#>.as_str());<#
        } else if (isEncrypt && [ "decimal" ].includes(data_type)) {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: String = row.try_get("<#=column_name#>")?;
    let <#=column_name_rust#>: <#=_data_type#> = decrypt(<#=column_name_rust#>.as_str())
      .parse::<Decimal>()
      .unwrap_or_default()
      .round_dp(<#=precision#>);<#
        } else if (isEncrypt && [ "int" ].includes(data_type)) {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: String = row.try_get("<#=column_name#>")?;
    let <#=column_name_rust#>: <#=_data_type#> = decrypt(<#=column_name_rust#>.as_str())
      .try_into()
      .unwrap_or_default();<#
        } else {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;<#
        }
    #><#
      }
    #><#
    }
    #><#
    if (opts.langTable) {
    #><#
    for (let i = 0; i < langTableRecords.length; i++) {
      const record = langTableRecords[i];
      const column_name = record.COLUMN_NAME;
      const column_name_rust = rustKeyEscape(record.COLUMN_NAME);
      const column_comment = record.COLUMN_COMMENT || "";
    #><#
    if (isUseI18n) {
    #>
    
    // <#=column_comment#>
    let <#=column_name_rust#> = if server_i18n_enable {
      let <#=column_name#>_lang: Option<String> = row.try_get("<#=column_name#>_lang")?;
      if <#=column_name#>_lang.as_ref().map(|x| x.is_empty()).unwrap_or(true) {
        <#=column_name_rust#>
      } else {
        <#=column_name#>_lang.unwrap()
      }
    } else {
      <#=column_name_rust#>
    };<#
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
      None => String::new(),
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
      None => String::new(),
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
          column_name === "is_sys" ||
          column_name === "is_deleted" ||
          column_name === "is_hidden" ||
          column_name === "create_usr_id" ||
          column_name === "create_time" ||
          column_name === "update_usr_id" ||
          column_name === "update_time"
        ) continue;
        const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
        const data_type = column.DATA_TYPE;
        const column_type = column.COLUMN_TYPE?.toLowerCase() || "";
        const column_comment = column.COLUMN_COMMENT || "";
        const isPassword = column.isPassword;
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
        let is_nullable = column.IS_NULLABLE === "YES";
        const isAuditColumn = hasAudit && auditColumn === column_name;
      #><#
        if (foreignKey && foreignKey.multiple) {
      #>
      <#=column_name_rust#>,<#
        if (hasModelLabel) {
      #>
      <#=modelLabel#>,<#
        }
      #><#
        for (let j = 0; j < cascade_fields.length; j++) {
          const cascade_field = cascade_fields[j];
      #>
      <#=column_name#>_<#=cascade_field#>,<#
        }
      #><#
        } else if (foreignKey && !foreignKey.multiple) {
      #>
      <#=column_name_rust#>,<#
        if (foreignKey.lbl && !modelLabel) {
      #>
      <#=column_name#>_lbl,<#
        } else if (modelLabel) {
      #>
      <#=modelLabel#>,<#
        }
      #><#
        for (let j = 0; j < cascade_fields.length; j++) {
          const cascade_field = cascade_fields[j];
      #>
      <#=column_name#>_<#=cascade_field#>,<#
        }
      #><#
        } else if (column.dict || column.dictbiz
          || data_type === "date" || data_type === "datetime"
        ) {
      #>
      <#=column_name_rust#>,
      <#=modelLabel#>,<#
      if (isAuditColumn && auditTable_Up) {
      #>
      <#=column_name_rust#>_recent_model: None,<#
      }
      #><#
        } else if (data_type === "tinyint") {
      #>
      <#=column_name_rust#>,<#
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
        const inline_column_name = inlineForeignTab.column_name;
        const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
      #><#
        if (inline_foreign_type === "one2many") {
      #>
      // <#=inlineForeignTab.label#>
      <#=inline_column_name#>: vec![],<#
        } else if (inline_foreign_type === "one2one") {
      #>
      // <#=inlineForeignTab.label#>
      <#=inline_column_name#>: None,<#
        }
      #><#
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
      #>
      <#=column_name#>_<#=table#>_models: None,<#
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
#[allow(dead_code)]
pub struct <#=tableUP#>FieldComment {<#
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
    const column_name_rust = rustKeyEscape(column_name);
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE;
    const column_comment = column.COLUMN_COMMENT || "";
    const isPassword = column.isPassword;
    if (isPassword) continue;
    const foreignKey = column.foreignKey;
    let is_nullable = column.IS_NULLABLE === "YES";
    const onlyCodegenDeno = column.onlyCodegenDeno;
    const onlyCodegenDenoButApi = column.onlyCodegenDenoButApi;
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
    if (foreignKey || column.dict || column.dictbiz
      || data_type === "date" || data_type === "datetime"
    ) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: String,
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>_lbl")]<#
  }
  #>
  pub <#=column_name#>_lbl: String,<#
    } else {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
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
#[allow(dead_code)]
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
    const modelLabel = column.modelLabel;
    const modelLabel_rust = rustKeyEscape(modelLabel);
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
      _data_type = "chrono::NaiveDateTime";
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
      _data_type = "Decimal";
    }
    const onlyCodegenDeno = column.onlyCodegenDeno;
    const search = column.search;
    const canSearch = column.canSearch;
  #><#
    if (foreignKey && foreignKey.type !== "many2many") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>_save_null")]<#
  }
  #>
  pub <#=column_name#>_is_null: Option<bool>,<#
    if (modelLabel) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=modelLabel#>")]<#
  }
  #>
  pub <#=modelLabel_rust#>: Option<Vec<String>>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>_<#=foreignKey.lbl#>_like")]<#
  }
  #>
  pub <#=column_name#>_<#=foreignKey.lbl#>_like: Option<String>,<#
    } else if (foreignKey.lbl) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>_<#=foreignKey.lbl#>")]<#
  }
  #>
  pub <#=column_name#>_<#=foreignKey.lbl#>: Option<Vec<String>>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>_<#=foreignKey.lbl#>_like")]<#
  }
  #>
  pub <#=column_name#>_<#=foreignKey.lbl#>_like: Option<String>,<#
    }
  #><#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>_save_null")]<#
  }
  #>
  pub <#=column_name#>_is_null: Option<bool>,<#
    } else if ((column.dict || column.dictbiz) && data_type !== "tinyint") {
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
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: Option<Vec<<#=enumColumnName#>>>,<#
    } else if (foreignKey) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,<#
    } else if (data_type === "int" || data_type === "decimal" || data_type === "double" || data_type === "datetime" || data_type === "date") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: Option<[Option<<#=_data_type#>>; 2]>,<#
    } else if (data_type === "tinyint") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,<#
    } else if (data_type === "varchar" || data_type === "text") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>_like")]<#
  }
  #>
  pub <#=column_name#>_like: Option<<#=_data_type#>>,<#
    } else {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno || !canSearch) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
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
      if (foreignKey && foreignKey.type !== "many2many") {
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
#[graphql(rename_fields = "snake_case", name = "<#=tableUP#>Input")]
#[allow(dead_code)]
pub struct <#=tableUP#>Input {
  /// ID
  pub id: Option<<#=Table_Up#>Id>,<#
  if (hasIsDeleted) {
  #>
  /// 已删除
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
  if (hasIsSys) {
  #>
  /// 系统记录
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
    const is_nullable = column.IS_NULLABLE === "YES";
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE?.toLowerCase() || "";
    const column_comment = column.COLUMN_COMMENT || "";
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
      _data_type = "Decimal";
    }
    if (column_name === "id") {
      _data_type = "String";
    }
    const onlyCodegenDeno = column.onlyCodegenDeno;
    const onlyCodegenDenoButApi = column.onlyCodegenDenoButApi;
    let modelLabel = column.modelLabel;
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
    if (column.dict || column.dictbiz) {
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
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: Option<<#=enumColumnName#>>,<#
    if (hasModelLabel) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=modelLabel#>")]<#
  }
  #>
  pub <#=modelLabel#>: Option<String>,<#
    }
  #><#
    } else if (foreignKey && foreignKey?.multiple) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,<#
    if (hasModelLabel) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=modelLabel#>")]<#
  }
  #>
  pub <#=modelLabel#>: Option<Vec<String>>,<#
    }
  #><#
  } else if (foreignKey && !foreignKey?.multiple) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,<#
    if (hasModelLabel) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=modelLabel#>")]<#
  }
  #>
  pub <#=modelLabel#>: Option<String>,<#
    }
  #><#
  } else if (data_type === "date" || data_type === "datetime") {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
  }
  #>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>_lbl")]<#
  }
  #>
  pub <#=column_name#>_lbl: Option<String>,<#
  if (is_nullable) {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>_save_null")]<#
  }
  #>
  pub <#=column_name#>_save_null: Option<bool>,<#
  }
  #><#
  } else {
  #>
  /// <#=column_comment#><#
  if (onlyCodegenDeno && !onlyCodegenDenoButApi) {
  #>
  #[graphql(skip)]<#
  } else {
  #>
  #[graphql(name = "<#=column_name#>")]<#
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
  pub create_time_lbl: Option<String>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_save_null: Option<bool>,<#
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
  pub update_time_lbl: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_save_null: Option<bool>,<#
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
    const inline_column_name = inlineForeignTab.column_name;
    const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
  #><#
    if (inline_foreign_type === "one2many") {
  #>
  /// <#=inlineForeignTab.label#>
  pub <#=inline_column_name#>: Option<Vec<<#=Table_Up#>Input>>,<#
    } else if (inline_foreign_type === "one2one") {
  #>
  /// <#=inlineForeignTab.label#>
  pub <#=inline_column_name#>: Option<<#=Table_Up#>Input>,<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno && !column.onlyCodegenDenoButApi) continue;
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
  #>
  // <#=table_comment#>
  pub <#=column_name#>_<#=table#>_models: Option<Vec<<#=Table_Up#>Input>>,<#
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
        const data_type = column.DATA_TYPE;
        const column_type = column.COLUMN_TYPE?.toLowerCase() || "";
        const column_comment = column.COLUMN_COMMENT || "";
        const foreignKey = column.foreignKey;
        const foreignTable = foreignKey && foreignKey.table;
        const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        let is_nullable = column.IS_NULLABLE === "YES";
        if (foreignKey && foreignKey.multiple) {
          is_nullable = false;
        }
        let modelLabel = column.modelLabel;
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
        if (
          (foreignKey || column.dict || column.dictbiz)
        ) {
      #>
      // <#=column_comment#>
      <#=column_name_rust#>: model.<#=column_name_rust#><#
        if (!is_nullable) {
      #>.into()<#
        }
      #>,<#
        if (hasModelLabel) {
      #>
      <#=modelLabel#>: model.<#=modelLabel#>.into(),<#
        }
      #><#
        } else if (data_type === "date" || data_type === "datetime") {
      #>
      // <#=column_comment#>
      <#=column_name_rust#>: model.<#=column_name_rust#><#
        if (!is_nullable) {
      #>.into()<#
        }
      #>,
      <#=column_name#>_lbl: model.<#=column_name#>_lbl.into(),<#
        if (is_nullable) {
      #>
      <#=column_name#>_save_null: Some(true),<#
        }
      #><#
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
      create_time_lbl: model.create_time_lbl.into(),
      create_time_save_null: Some(true),<#
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
      update_time_lbl: model.update_time_lbl.into(),
      update_time_save_null: Some(true),<#
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
        const inline_column_name = inlineForeignTab.column_name;
        const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
      #><#
        if (inline_foreign_type === "one2many") {
      #>
      // <#=inlineForeignTab.label#>
      <#=inline_column_name#>: model.<#=inline_column_name#>
        .into_iter()
        .map(|x| x.into())
        .collect::<Vec<<#=Table_Up#>Input>>()
        .into(),<#
        } else if (inline_foreign_type === "one2one") {
      #>
      // <#=inlineForeignTab.label#>
      <#=inline_column_name#>: model.<#=inline_column_name#>.map(|x| x.into()),<#
        }
      #><#
      }
      #><#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        if (column.onlyCodegenDeno && !column.onlyCodegenDenoButApi) continue;
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
      #>
      // <#=table_comment#>
      <#=column_name#>_<#=table#>_models: model.<#=column_name#>_<#=table#>_models
        .map(|model|
          model
          .into_iter()
          .map(|x| x.into())
          .collect::<Vec<_>>(),
        ),<#
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
          column_name === "is_sys" ||
          column_name === "is_deleted" ||
          column_name === "is_hidden"
        ) continue;
        if (column_name === 'id') continue;
        const data_type = column.DATA_TYPE;
        const column_type = column.COLUMN_TYPE?.toLowerCase() || "";
        const column_comment = column.COLUMN_COMMENT || "";
        const foreignKey = column.foreignKey;
        const foreignTable = foreignKey && foreignKey.table;
        const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        const modelLabel = column.modelLabel;
        const modelLabel_rust = rustKeyEscape(modelLabel);
        const isPassword = column.isPassword;
        if (column_name === "id") {
          continue;
        }
        const isEncrypt = column.isEncrypt;
        if (isEncrypt) continue;
      #><#
      if (foreignKey && foreignKey.type === "many2many") {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>,<#
      } else if (foreignKey && foreignKey.type !== "many2many") {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>.map(|x| vec![x]),<#
        if (modelLabel) {
      #>
      // <#=column_comment#>
      <#=modelLabel_rust#>: input.<#=modelLabel_rust#>.map(|x| vec![x]),<#
        }
      #><#
        } else if ((column.dict || column.dictbiz) && data_type !== "tinyint") {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>.map(|x| vec![x]),<#
      } else if (["tinyint"].includes(data_type)) {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>.map(|x| vec![x]),<#
      } else if (["date"].includes(data_type)) {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>.map(|x| [Some(x.and_hms_opt(0, 0, 0).unwrap()), Some(x.and_hms_opt(23, 59, 59).unwrap())]),<#
      } else if (["datetime","time","int","decimal"].includes(data_type)) {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>.map(|x| [Some(x), Some(x)]),<#
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

impl From<<#=tableUP#>Model> for crate::r#gen::<#=mod#>::<#=historyTable#>::<#=historyTable#>_model::<#=historyTableUp#>Input {
  fn from(model: <#=tableUP#>Model) -> Self {
    Self {<#
      if (hasTenantId) {
      #>
      // 租户ID
      tenant_id: input.tenant_id,<#
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
          column_name === "is_sys" ||
          column_name === "is_deleted"
        ) continue;
        const is_nullable = column.IS_NULLABLE === "YES";
        const column_name_rust = rustKeyEscape(column_name);
        const data_type = column.DATA_TYPE;
        const column_type = column.COLUMN_TYPE?.toLowerCase() || "";
        const column_comment = column.COLUMN_COMMENT || "";
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
        } else if (column.dict || column.dictbiz) {
      #><#
        } else if (data_type === "date" || data_type === "datetime") {
      #>
      /// <#=column_comment#>
      <#=column_name#>: model.<#=column_name#>.into(),
      <#=column_name#>_lbl: model.<#=column_name#>_lbl.into(),<#
        if (is_nullable) {
      #>
      <#=column_name#>_save_null: Some(true),<#
        }
      #><#
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
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
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
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for <#=Table_Up#>Id {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}<#
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
      return item.code === column.dict || item.code === column.dict;
    }),
    ...dictbizModels.filter(function(item) {
      return item.code === column.dict || item.code === column.dictbiz;
    }),
  ];
  if (columnDictModels.length === 0) continue;
  let columnDictDefault = column_default && columnDictModels.find(function(item) {
    return item.val === column_default;
  });
  if (!columnDictDefault) {
    columnDictDefault = columnDictModels[0];
  }
  const require = column.require;
#>

/// <#=table_comment#><#=column_comment#>
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum <#=enumColumnName#> {<#
  for (const columnDictModel of columnDictModels) {
    const val = columnDictModel.val;
    const lbl = columnDictModel.lbl;
    let valUp = val.substring(0, 1).toUpperCase()+val.substring(1);
    valUp = valUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1).toLowerCase();
    }).join("");
  #>
  /// <#=lbl#><#
  if (columnDictDefault.val === val) {
  #>
  #[default]<#
  }
  #>
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
          return item.substring(0, 1).toUpperCase() + item.substring(1).toLowerCase();
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
          return item.substring(0, 1).toUpperCase() + item.substring(1).toLowerCase();
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
          return item.substring(0, 1).toUpperCase() + item.substring(1).toLowerCase();
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
}

impl FromStr for <#=enumColumnName#> {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {<#
      for (const columnDictModel of columnDictModels) {
        const val = columnDictModel.val;
        const lbl = columnDictModel.lbl;
        let valUp = val.substring(0, 1).toUpperCase()+val.substring(1);
        valUp = valUp.split("_").map(function(item) {
          return item.substring(0, 1).toUpperCase() + item.substring(1).toLowerCase();
        }).join("");
      #>
      "<#=val#>" => Ok(Self::<#=valUp#>),<#
      }
      #>
      _ => Err(eyre!("<#=enumColumnName#> can't convert from {s}")),
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
          return item.substring(0, 1).toUpperCase() + item.substring(1).toLowerCase();
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
          return item.substring(0, 1).toUpperCase() + item.substring(1).toLowerCase();
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

/// <#=table_comment#> 检测字段是否允许前端排序
pub fn check_sort_<#=table#>(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_<#=table#> = get_can_sort_in_api_<#=table#>();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_<#=table#>.contains(&prop) {
      return Err(eyre!("check_sort_<#=table#>: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
pub fn get_route_path_<#=table#>() -> String {
  "/<#=mod#>/<#=table#>".to_owned()
}<#
if (tableFieldPermit) {
#><#
if (opts.noAdd !== true || opts.noEdit !== true) {
#>

/// 过滤 input 字段权限
pub async fn field_permit_input_<#=table#>(
  input: &mut <#=tableUP#>Input,
  mut fields: Option<Vec<String>>,
) -> Result<()> {
  
  let route_path = get_route_path_<#=table#>();
  
  if fields.is_none() {
    fields = get_field_permit(route_path).await?;
  }
  
  if fields.is_none() {
    return Ok(());
  }
  let fields = fields.unwrap();<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (!column.fieldPermit) continue;
    const column_name = column.COLUMN_NAME;
    if ([
      "id",
      "create_usr_id",
      "create_time",
      "update_usr_id",
      "update_time",
      "tenant_id",
      "is_hidden",
      "is_deleted",
      "is_sys",
    ].includes(column_name)) continue;
    let data_type = column.DATA_TYPE;
    const column_comment = column.COLUMN_COMMENT;
    if (!column_comment && column_name !== "id") {
      throw `错误: 表: ${ table } 字段: ${ column_name } 无 comment`;
    }
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    const foreignTableUp = foreignKey && foreignKey.table && foreignKey.table.substring(0, 1).toUpperCase()+foreignKey.table.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
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
  #>
  
  // <#=column_comment#>
  if !fields.contains(&"<#=column_name#>".to_owned()) {<#
    if (!foreignKey && !column.dict && !column.dictbiz
      && column.DATA_TYPE !== "date" && !column.DATA_TYPE === "datetime"
    ) {
    #>
    input.<#=column_name#> = None;<#
    } else if (column.DATA_TYPE === "date" || column.DATA_TYPE === "datetime") {
    #>
    input.<#=column_name#> = None;
    input.<#=column_name#>_lbl = None;<#
      if (is_nullable) {
    #>
    input.<#=column_name#>_save_null = false;<#
      }
    #><#
    } else if (foreignKey) {
    #>
    input.<#=column_name#> = None;<#
      if (hasModelLabel) {
    #>
    input.<#=modelLabel#> = None;<#
      }
    #><#
    } else if (column.dict || column.dictbiz) {
    #>
    input.<#=column_name#> = None;<#
      if (hasModelLabel) {
    #>
    input.<#=modelLabel#> = None;<#
      }
    #><#
    } else {
    #>
    input.<#=column_name#> = None;<#
    }
    #>
    return Ok(());
  }<#
  }
  #>
  
  Ok(())
}<#
}
#>

/// 过滤 model 字段权限
pub async fn field_permit_model_<#=table#>(
  model: &mut <#=tableUP#>Model,
  mut fields: Option<Vec<String>>,
) -> Result<()> {
  
  let route_path = get_route_path_<#=table#>();
  
  if fields.is_none() {
    fields = get_field_permit(route_path).await?;
  }
  
  if fields.is_none() {
    return Ok(());
  }
  let fields = fields.unwrap();<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (!column.fieldPermit) continue;
    const column_name = column.COLUMN_NAME;
    if ([
      "id",
      "create_usr_id",
      "create_time",
      "update_usr_id",
      "update_time",
      "tenant_id",
      "is_hidden",
      "is_deleted",
      "is_sys",
    ].includes(column_name)) continue;
    let data_type = column.DATA_TYPE;
    const column_comment = column.COLUMN_COMMENT;
    if (!column_comment && column_name !== "id") {
      throw `错误: 表: ${ table } 字段: ${ column_name } 无 comment`;
    }
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    const foreignTableUp = foreignKey && foreignKey.table && foreignKey.table.substring(0, 1).toUpperCase()+foreignKey.table.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
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
  #>
  
  // <#=column_comment#>
  if !fields.contains(&"<#=column_name#>".to_owned()) {<#
    if (!foreignKey && !column.dict && !column.dictbiz
      && column.DATA_TYPE !== "date" && !column.DATA_TYPE === "datetime"
    ) {
    #>
    model.<#=column_name#> = Default::default();<#
    } else if (column.DATA_TYPE === "date" || column.DATA_TYPE === "datetime") {
    #>
    model.<#=column_name#> = Default::default();
    model.<#=column_name#>_lbl = Default::default();<#
    } else if (foreignKey) {
    #>
    model.<#=column_name#> = Default::default();<#
      if (hasModelLabel) {
    #>
    model.<#=modelLabel#> = Default::default();<#
      }
    #><#
    } else if (column.dict || column.dictbiz) {
    #>
    model.<#=column_name#> = Default::default();<#
      if (hasModelLabel) {
    #>
    model.<#=modelLabel#> = Default::default();<#
      }
    #><#
    } else {
    #>
    model.<#=column_name#> = Default::default();<#
    }
    #>
    return Ok(());
  }<#
  }
  #>
  
  Ok(())
}<#
}
#>
