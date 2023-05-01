use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::{SimpleObject, InputObject, ID};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct I18nModel {
  /// ID
  pub id: ID,
  /// 语言
  pub lang_id: String,
  pub lang_id_lbl: String,
  /// 菜单
  pub menu_id: String,
  pub menu_id_lbl: String,
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
  /// 备注
  pub rem: String,
}

impl FromRow<'_, MySqlRow> for I18nModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    let id: ID = id.into();
    // 语言
    let lang_id: String = row.try_get("lang_id")?;
    let lang_id_lbl: String = lang_id.to_string();
    // 菜单
    let menu_id: String = row.try_get("menu_id")?;
    let menu_id_lbl: String = menu_id.to_string();
    // 编码
    let code: String = row.try_get("code")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    
    let model = Self {
      id,
      lang_id,
      lang_id_lbl,
      menu_id,
      menu_id_lbl,
      code,
      lbl,
      rem,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct I18nFieldComment {
  /// 语言
  pub lang_id: String,
  pub lang_id_lbl: String,
  /// 菜单
  pub menu_id: String,
  pub menu_id_lbl: String,
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
  /// 备注
  pub rem: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct I18nSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 语言
  pub lang_id: Option<Vec<String>>,
  pub lang_id_is_null: Option<bool>,
  /// 菜单
  pub menu_id: Option<Vec<String>>,
  pub menu_id_is_null: Option<bool>,
  /// 编码
  pub code: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct I18nInput {
  pub id: Option<ID>,
  /// 语言
  pub lang_id: Option<String>,
  pub lang_id_lbl: Option<String>,
  /// 菜单
  pub menu_id: Option<String>,
  pub menu_id_lbl: Option<String>,
  /// 编码
  pub code: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
}

impl From<I18nInput> for I18nSearch {
  fn from(input: I18nInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      tenant_id: None,
      is_deleted: None,
      // 语言
      lang_id: input.lang_id.map(|x| vec![x.into()]),
      // 菜单
      menu_id: input.menu_id.map(|x| vec![x.into()]),
      // 编码
      code: input.code,
      // 名称
      lbl: input.lbl,
      // 备注
      rem: input.rem,
      ..Default::default()
    }
  }
}
