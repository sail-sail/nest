<#
const tableUP = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
#>use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::{SimpleObject, InputObject, ID};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct <#=tableUP#>Model {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
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
    const foreignKey = column.foreignKey;
    let is_nullable = column.IS_NULLABLE === "YES";
    let _data_type = "String";
    if (foreignKey && foreignKey.multiple) {
      _data_type = "Vec<String>";
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
    } else if (data_type === 'int') {
      _data_type = 'i64';
    } else if (data_type === 'json') {
      _data_type = 'String';
    } else if (data_type === 'text') {
      _data_type = 'String';
    } else if (data_type === 'tinyint') {
      _data_type = 'u8';
    } else if (data_type === 'decimal') {
      _data_type = "rust_decimal::Decimal";
    }
  #><#
    if (column_name === "id") {
  #>
  /// ID
  pub id: ID,<#
    } else if (foreignKey && foreignKey.multiple) {
  #>
  /// <#=column_comment#>
  pub <#=column_name#>: <#=_data_type#>,
  pub <#=column_name#>_lbl: <#=_data_type#>,<#
    } else if (foreignKey && !foreignKey.multiple) {
  #>
  /// <#=column_comment#>
  pub <#=column_name#>: <#=_data_type#>,
  pub <#=column_name#>_lbl: <#=_data_type#>,<#
    } else if (selectList.length > 0 || column.dict || column.dictbiz) {
  #>
  /// <#=column_comment#>
  pub <#=column_name#>: <#=_data_type#>,
  pub <#=column_name#>_lbl: String,<#
    } else {
  #>
  /// <#=column_comment#><#
    if (isPassword) {
  #>
  #[graphql(skip)]<#
    }
  #>
  pub <#=column_name#>: <#=_data_type#>,<#
    }
  #><#
  }
  #>
}

impl FromRow<'_, MySqlRow> for <#=tableUP#>Model {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {<#
    for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
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
    const foreignKey = column.foreignKey;
    let is_nullable = column.IS_NULLABLE === "YES";
    #><#
      if (column_name === "id") {
    #>
    // ID
    let id: String = row.try_get("id")?;
    let id: ID = id.into();<#
      } else if (foreignKey && foreignKey.multiple) {
    #>
    // <#=column_comment#>
    let <#=column_name#>: sqlx::types::Json<Vec<String>> = row.try_get("<#=column_name#>")?;
    let <#=column_name#> = <#=column_name#>.0;
    let <#=column_name#>_lbl: sqlx::types::Json<Vec<String>> = row.try_get("<#=column_name#>_lbl")?;
    let <#=column_name#>_lbl = <#=column_name#>_lbl.0;<#
      } else if (foreignKey && !foreignKey.multiple) {
    #>
    // <#=column_comment#>
    let <#=column_name#>: String = row.try_get("<#=column_name#>")?;
    let <#=column_name#>_lbl: String = <#=column_name#>.to_string();<#
      } else if (column.DATA_TYPE === 'tinyint') {
    #>
    // <#=column_comment#>
    let <#=column_name#>: u8 = row.try_get("<#=column_name#>")?;
    let <#=column_name#>_lbl: String = <#=column_name#>.to_string();<#
      } else if (selectList.length > 0 || column.dict || column.dictbiz) {
    #>
    // <#=column_comment#>
    let <#=column_name#>: String = row.try_get("<#=column_name#>")?;
    let <#=column_name#>_lbl: String = <#=column_name#>.to_string();<#
      } else {
    #>
    // <#=column_comment#>
    let <#=column_name#>: String = row.try_get("<#=column_name#>")?;<#
      }
    #><#
    }
    #>
    
    let model = Self {<#
      for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
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
      const foreignKey = column.foreignKey;
      let is_nullable = column.IS_NULLABLE === "YES";
      #><#
        if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz) {
      #>
      <#=column_name#>,
      <#=column_name#>_lbl,<#
        } else if (column.DATA_TYPE === 'tinyint') {
      #>
      <#=column_name#>,
      <#=column_name#>_lbl,<#
        } else {
      #>
      <#=column_name#>,<#
        }
      #><#
      }
      #>
    };
    
    Ok(model)
  }
}

pub struct <#=tableUP#>FieldComment {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
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
    if (column_name === 'id') continue;
    const isPassword = column.isPassword;
    if (isPassword) continue;
    const foreignKey = column.foreignKey;
    let is_nullable = column.IS_NULLABLE === "YES";
  #><#
    if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz) {
  #>
  /// <#=column_comment#>
  pub <#=column_name#>: String,
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
pub struct <#=tableUP#>Search {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === 'id') continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.DATA_TYPE;
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
      _data_type = "Vec<String>";
    } else if (column.DATA_TYPE === 'varchar') {
      _data_type = 'String';
    } else if (column.DATA_TYPE === 'date') {
      _data_type = "Vec<chrono::NaiveDate>";
    } else if (column.DATA_TYPE === 'datetime') {
      _data_type = "Vec<chrono::NaiveDateTime>";
    } else if (column.DATA_TYPE === 'time') {
      _data_type = "Vec<chrono::NaiveTime>";
    } else if (column.DATA_TYPE === 'int') {
      _data_type = "Vec<i64>";
    } else if (column.DATA_TYPE === 'json') {
      _data_type = 'String';
    } else if (column.DATA_TYPE === 'text') {
      _data_type = 'String';
    } else if (column.DATA_TYPE === 'tinyint') {
      _data_type = "Vec<u8>";
    } else if (column.DATA_TYPE === 'decimal') {
      _data_type = "Vec<rust_decimal::Decimal>";
    }
  #><#
    if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz) {
  #>
  /// <#=column_comment#>
  pub <#=column_name#>: Option<<#=_data_type#>>,<#
    } else {
  #>
  /// <#=column_comment#>
  pub <#=column_name#>: Option<<#=_data_type#>>,<#
    }
  #><#
  }
  #>
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
pub struct <#=tableUP#>Input {
  pub id: Option<ID>,<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === 'id') continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.DATA_TYPE;
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
    } else if (data_type === 'int') {
      _data_type = "i64";
    } else if (data_type === 'json') {
      _data_type = 'String';
    } else if (data_type === 'text') {
      _data_type = 'String';
    } else if (data_type === 'tinyint') {
      _data_type = "u8";
    } else if (data_type === 'decimal') {
      _data_type = "rust_decimal::Decimal";
    }
    if (column_name === "id") {
      _data_type = "ID";
    }
  #><#
    if ((foreignKey || selectList.length > 0 || column.dict || column.dictbiz) && foreignKey?.multiple) {
  #>
  // <#=column_comment#>
  pub <#=column_name#>: Option<Vec<<#=_data_type#>>>,
  pub <#=column_name#>_lbl: Option<Vec<String>>,<#
  } else if ((foreignKey || selectList.length > 0 || column.dict || column.dictbiz) && !foreignKey?.multiple) {
  #>
  // <#=column_comment#>
  pub <#=column_name#>: Option<<#=_data_type#>>,
  pub <#=column_name#>_lbl: Option<String>,<#
  } else {
  #>
  // <#=column_comment#>
  pub <#=column_name#>: Option<<#=_data_type#>>,<#
  }
  #><#
  }
  #>
}

impl From<<#=tableUP#>Input> for <#=tableUP#>Search {
  fn from(input: <#=tableUP#>Input) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      tenant_id: None,
      is_deleted: None,<#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        if (column.isVirtual) continue;
        const column_name = column.COLUMN_NAME;
        if (column_name === 'id') continue;
        let data_type = column.DATA_TYPE;
        let column_type = column.DATA_TYPE;
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
    }
  }
}
