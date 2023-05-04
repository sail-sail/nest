use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::{SimpleObject, InputObject, ID};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct LangModel {
  /// ID
  pub id: ID,
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
  /// 备注
  pub rem: String,
  /// 启用
  pub is_enabled: u8,
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: i64,
}

impl FromRow<'_, MySqlRow> for LangModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    let id: ID = id.into();
    // 编码
    let code: String = row.try_get("code")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 排序
    let order_by: i64 = row.try_get("order_by")?;
    
    let model = Self {
      id,
      code,
      lbl,
      rem,
      is_enabled,
      is_enabled_lbl,
      order_by,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct LangFieldComment {
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
  /// 备注
  pub rem: String,
  /// 启用
  pub is_enabled: String,
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct LangSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  pub is_deleted: Option<u8>,
  /// 编码
  pub code: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  pub order_by: Option<Vec<i64>>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct LangInput {
  pub id: Option<ID>,
  /// 编码
  pub code: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 启用
  pub is_enabled: Option<u8>,
  pub is_enabled_lbl: Option<String>,
  /// 排序
  pub order_by: Option<i64>,
}

impl From<LangInput> for LangSearch {
  fn from(input: LangInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      is_deleted: None,
      // 编码
      code: input.code,
      // 名称
      lbl: input.lbl,
      // 备注
      rem: input.rem,
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x.into()]),
      // 排序
      order_by: input.order_by.map(|x| vec![x.clone().into(), x.clone().into()]),
      ..Default::default()
    }
  }
}
