use serde::{
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
};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppTokenModel {
  /// 租户ID
  pub tenant_id: String,
  /// ID
  pub id: String,
  /// 企业微信应用
  pub wxw_app_id: String,
  /// 企业微信应用
  pub wxw_app_id_lbl: String,
  /// 类型corp和contact
  pub r#type: String,
  /// 令牌
  pub access_token: String,
  /// 令牌创建时间
  pub token_time: Option<chrono::NaiveDateTime>,
  /// 令牌创建时间
  pub token_time_lbl: String,
  /// 令牌超时时间
  pub expires_in: u32,
  /// 是否已删除
  pub is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for WxwAppTokenModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: String = row.try_get("id")?;
    // 企业微信应用
    let wxw_app_id: String = row.try_get("wxw_app_id")?;
    let wxw_app_id_lbl: Option<String> = row.try_get("wxw_app_id_lbl")?;
    let wxw_app_id_lbl = wxw_app_id_lbl.unwrap_or_default();
    // 类型corp和contact
    let r#type: String = row.try_get("type")?;
    // 令牌
    let access_token: String = row.try_get("access_token")?;
    // 令牌创建时间
    let token_time: Option<chrono::NaiveDateTime> = row.try_get("token_time")?;
    let token_time_lbl: String = match token_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 令牌超时时间
    let expires_in: u32 = row.try_get("expires_in")?;
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      id,
      wxw_app_id,
      wxw_app_id_lbl,
      r#type,
      access_token,
      token_time,
      token_time_lbl,
      expires_in,
      is_deleted,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppTokenFieldComment {
  /// ID
  pub id: String,
  /// 企业微信应用
  pub wxw_app_id: String,
  /// 企业微信应用
  pub wxw_app_id_lbl: String,
  /// 类型corp和contact
  pub r#type: String,
  /// 令牌
  pub access_token: String,
  /// 令牌创建时间
  pub token_time: String,
  /// 令牌创建时间
  pub token_time_lbl: String,
  /// 令牌超时时间
  pub expires_in: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppTokenSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 企业微信应用
  pub wxw_app_id: Option<Vec<String>>,
  /// 企业微信应用
  pub wxw_app_id_is_null: Option<bool>,
  /// 类型corp和contact
  pub r#type: Option<String>,
  /// 类型corp和contact
  pub type_like: Option<String>,
  /// 令牌
  pub access_token: Option<String>,
  /// 令牌
  pub access_token_like: Option<String>,
  /// 令牌创建时间
  pub token_time: Option<Vec<chrono::NaiveDateTime>>,
  /// 令牌超时时间
  pub expires_in: Option<Vec<u32>>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppTokenInput {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  /// ID
  pub id: Option<String>,
  /// 企业微信应用
  pub wxw_app_id: Option<String>,
  /// 企业微信应用
  pub wxw_app_id_lbl: Option<String>,
  /// 类型corp和contact
  pub r#type: Option<String>,
  /// 令牌
  pub access_token: Option<String>,
  /// 令牌创建时间
  pub token_time: Option<chrono::NaiveDateTime>,
  /// 令牌创建时间
  pub token_time_lbl: Option<String>,
  /// 令牌超时时间
  pub expires_in: Option<u32>,
}

impl From<WxwAppTokenInput> for WxwAppTokenSearch {
  fn from(input: WxwAppTokenInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 住户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 企业微信应用
      wxw_app_id: input.wxw_app_id.map(|x| vec![x]),
      // 类型corp和contact
      r#type: input.r#type,
      // 令牌
      access_token: input.access_token,
      // 令牌创建时间
      token_time: input.token_time.map(|x| vec![x, x]),
      // 令牌超时时间
      expires_in: input.expires_in.map(|x| vec![x, x]),
      ..Default::default()
    }
  }
}
