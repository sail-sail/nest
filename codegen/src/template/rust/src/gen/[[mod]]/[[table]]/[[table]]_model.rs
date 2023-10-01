<#
const tableUP = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const hasOrgId = columns.some((column) => column.COLUMN_NAME === "org_id");
const hasEncrypt = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  return !!column.isEncrypt;
});
#>use serde::{
  Serialize,
  Deserialize,
};

use sqlx::{
  FromRow,
  mysql::MySqlRow,
  Row,
};

use async_graphql::{
  SimpleObject,
  InputObject,
};<#
if (hasEncrypt) {
#>
use crate::common::util::dao::encrypt;<#
}
#>

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct <#=tableUP#>Model {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = rustKeyEscape(column.COLUMN_NAME);
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
    let _data_type = "String";
    if (foreignKey && foreignKey.multiple) {
      _data_type = "Vec<String>";
      is_nullable = false;
    } else if (foreignKey && !foreignKey.multiple) {
      _data_type = "String";
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
  /// ID
  pub id: String,<#
    } else if (foreignKey && foreignKey.multiple) {
  #>
  /// <#=column_comment#>
  pub <#=column_name#>: <#=_data_type#>,
  /// <#=column_comment#>
  pub <#=column_name#>_lbl: <#=_data_type#>,<#
    } else if (foreignKey && !foreignKey.multiple) {
  #>
  /// <#=column_comment#>
  pub <#=column_name#>: <#=_data_type#>,
  /// <#=column_comment#>
  pub <#=column_name#>_lbl: <#=_data_type#>,<#
    } else if (selectList.length > 0 || column.dict || column.dictbiz
      || data_type === "date" || data_type === "datetime"
    ) {
  #>
  /// <#=column_comment#>
  pub <#=column_name#>: <#=_data_type#>,
  /// <#=column_comment#>
  pub <#=column_name#>_lbl: String,<#
    } else {
  #>
  /// <#=column_comment#>
  pub <#=column_name#>: <#=_data_type#>,<#
    }
  #><#
  }
  #>
  /// 是否已删除
  is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for <#=tableUP#>Model {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {<#
    for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
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
    const foreignKey = column.foreignKey;
    let is_nullable = column.IS_NULLABLE === "YES";
    let _data_type = "String";
    if (foreignKey && foreignKey.multiple) {
      _data_type = "Vec<String>";
      is_nullable = false;
    } else if (foreignKey && !foreignKey.multiple) {
      _data_type = "String";
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
    let id: String = row.try_get("id")?;<#
      } else if (isPassword) {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#> = "".to_owned();<#
      } else if (foreignKey && foreignKey.multiple) {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: Option<sqlx::types::Json<std::collections::HashMap<String, String>>> = row.try_get("<#=column_name#>")?;
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
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
    let <#=column_name#>_lbl: Option<sqlx::types::Json<std::collections::HashMap<String, String>>> = row.try_get("<#=column_name#>_lbl")?;
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
    let <#=column_name_rust#>: String = row.try_get("<#=column_name#>")?;
    let <#=column_name#>_lbl: Option<String> = row.try_get("<#=column_name#>_lbl")?;
    let <#=column_name#>_lbl = <#=column_name#>_lbl.unwrap_or_default();<#
      } else if (column.DATA_TYPE === 'tinyint') {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;
    let <#=column_name#>_lbl: String = <#=column_name_rust#>.to_string();<#
      } else if (selectList.length > 0 || column.dict || column.dictbiz) {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;
    let <#=column_name#>_lbl: String = <#=column_name_rust#>.to_string();<#
      } else if (data_type === "datetime") {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;
    let <#=column_name#>_lbl: String = match <#=column_name_rust#> {
      Some(<#=column_name_rust#>) => <#=column_name_rust#>.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };<#
      } else if (data_type === "date") {
    #>
    // <#=column_comment#>
    let <#=column_name_rust#>: <#=_data_type#> = row.try_get("<#=column_name#>")?;
    let <#=column_name#>_lbl: String = match <#=column_name_rust#> {
      Some(<#=column_name_rust#>) => <#=column_name_rust#>.format("%Y-%m-%d").to_string(),
      None => "".to_owned(),
    };<#
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
    #>
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
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
      #>
      is_deleted,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct <#=tableUP#>FieldComment {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = rustKeyEscape(column.COLUMN_NAME);
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
  #><#
    if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
      || data_type === "date" || data_type === "datetime"
    ) {
  #>
  /// <#=column_comment#>
  pub <#=column_name#>: String,
  /// <#=column_comment#>
  pub <#=column_name#>_lbl: String,<#
    } else {
  #>
  /// <#=column_comment#>
  pub <#=column_name#>: String,<#
    }
  #><#
  }
  #>
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct <#=tableUP#>Search {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,<#
  if (hasTenant_id) {
  #>
  #[graphql(skip)]
  pub tenant_id: Option<String>,<#
  }
  #>
  pub is_deleted: Option<u8>,<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
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
    const isPassword = column.isPassword;
    let is_nullable = column.IS_NULLABLE === "YES";
    let _data_type = "String";
    if (foreignKey && foreignKey.multiple) {
      _data_type = "String";
      is_nullable = true;
    } else if (foreignKey && !foreignKey.multiple) {
      _data_type = "String";
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
    if (foreignKey && foreignKey.type !== "many2many") {
  #>
  /// <#=column_comment#>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,
  /// <#=column_comment#>
  pub <#=column_name#>_is_null: Option<bool>,<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #>
  /// <#=column_comment#>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,
  /// <#=column_comment#>
  pub <#=column_name#>_is_null: Option<bool>,<#
    } else if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz) {
  #>
  /// <#=column_comment#>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,<#
    } else if (data_type === "int" || data_type === "decimal" || data_type === "double" || data_type === "datetime" || data_type === "date") {
  #>
  /// <#=column_comment#>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,<#
    } else if (data_type === "tinyint") {
  #>
  /// <#=column_comment#>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,<#
    } else if (data_type === "varchar" || data_type === "text") {
  #>
  /// <#=column_comment#>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,
  /// <#=column_comment#>
  pub <#=column_name#>_like: Option<<#=_data_type#>>,<#
    } else {
  #>
  /// <#=column_comment#>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,<#
    }
  #><#
  }
  #><#
  if (hasOrgId) {
  #>
  /// 组织ID
  pub org_id: Option<String>,<#
  }
  #>
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct <#=tableUP#>Input {
  /// ID
  pub id: Option<String>,<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
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
    const isPassword = column.isPassword;
    let _data_type = "String";
    if (foreignKey) {
      _data_type = "String";
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
  #><#
    if ((foreignKey || selectList.length > 0 || column.dict || column.dictbiz) && foreignKey?.multiple) {
  #>
  /// <#=column_comment#>
  pub <#=column_name_rust#>: Option<Vec<<#=_data_type#>>>,
  /// <#=column_comment#>
  pub <#=column_name#>_lbl: Option<Vec<String>>,<#
  } else if ((foreignKey || selectList.length > 0 || column.dict || column.dictbiz) && !foreignKey?.multiple) {
  #>
  /// <#=column_comment#>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,
  /// <#=column_comment#>
  pub <#=column_name#>_lbl: Option<String>,<#
  } else if (data_type === "date" || data_type === "datetime") {
  #>
  /// <#=column_comment#>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,
  /// <#=column_comment#>
  pub <#=column_name#>_lbl: Option<String>,<#
  } else {
  #>
  /// <#=column_comment#>
  pub <#=column_name_rust#>: Option<<#=_data_type#>>,<#
  }
  #><#
  }
  #>
}

impl From<<#=tableUP#>Input> for <#=tableUP#>Search {
  fn from(input: <#=tableUP#>Input) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,<#
      if (hasTenant_id) {
      #>
      tenant_id: None,<#
      }
      #>
      is_deleted: None,<#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        if (column.isVirtual) continue;
        const column_name = rustKeyEscape(column.COLUMN_NAME);
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
      <#=column_name#>: input.<#=column_name#>.map(|x| vec![x.into()]),<#
        } else if ((selectList && selectList.length > 0) || column.dict || column.dictbiz) {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>.map(|x| vec![x.into()]),<#
      } else if (["tinyint"].includes(data_type)) {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>.map(|x| vec![x.into()]),<#
      } else if (["date","datetime","time","int","decimal"].includes(data_type)) {
      #>
      // <#=column_comment#>
      <#=column_name#>: input.<#=column_name#>.map(|x| vec![x.clone().into(), x.clone().into()]),<#
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
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        const column_name = rustKeyEscape(column.COLUMN_NAME);
        if (column_name === "id") {
          continue;
        }
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
