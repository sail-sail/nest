use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::{SimpleObject, InputObject, ID};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct UsrModel {
  /// ID
  pub id: ID,
  /// 名称
  pub lbl: String,
  /// 用户名
  pub username: String,
  /// 密码
  #[graphql(skip)]
  pub password: String,
  /// 默认部门
  pub default_dept_id: String,
  pub default_dept_id_lbl: String,
  /// 启用
  pub is_enabled: u8,
  pub is_enabled_lbl: String,
  /// 备注
  pub rem: String,
  /// 拥有部门
  pub dept_ids: Vec<String>,
  pub dept_ids_lbl: Vec<String>,
  /// 锁定
  pub is_locked: u8,
  pub is_locked_lbl: String,
  /// 拥有角色
  pub role_ids: Vec<String>,
  pub role_ids_lbl: Vec<String>,
}

impl FromRow<'_, MySqlRow> for UsrModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    let id: ID = id.into();
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 用户名
    let username: String = row.try_get("username")?;
    // 密码
    let password: String = row.try_get("password")?;
    // 默认部门
    let default_dept_id: String = row.try_get("default_dept_id")?;
    let default_dept_id_lbl: String = default_dept_id.to_string();
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 备注
    let rem: String = row.try_get("rem")?;
    // 拥有部门
    let dept_ids: sqlx::types::Json<Option<Vec<String>>> = row.try_get("dept_ids")?;
    let dept_ids = dept_ids.0.unwrap_or_default();
    let dept_ids_lbl: sqlx::types::Json<Option<Vec<String>>> = row.try_get("dept_ids_lbl")?;
    let dept_ids_lbl = dept_ids_lbl.0.unwrap_or_default();
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    // 拥有角色
    let role_ids: sqlx::types::Json<Option<Vec<String>>> = row.try_get("role_ids")?;
    let role_ids = role_ids.0.unwrap_or_default();
    let role_ids_lbl: sqlx::types::Json<Option<Vec<String>>> = row.try_get("role_ids_lbl")?;
    let role_ids_lbl = role_ids_lbl.0.unwrap_or_default();
    
    let model = Self {
      id,
      lbl,
      username,
      password,
      default_dept_id,
      default_dept_id_lbl,
      is_enabled,
      is_enabled_lbl,
      rem,
      dept_ids,
      dept_ids_lbl,
      is_locked,
      is_locked_lbl,
      role_ids,
      role_ids_lbl,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct UsrFieldComment {
  /// 名称
  pub lbl: String,
  /// 用户名
  pub username: String,
  /// 默认部门
  pub default_dept_id: String,
  pub default_dept_id_lbl: String,
  /// 启用
  pub is_enabled: String,
  pub is_enabled_lbl: String,
  /// 备注
  pub rem: String,
  /// 拥有部门
  pub dept_ids: String,
  pub dept_ids_lbl: String,
  /// 锁定
  pub is_locked: String,
  pub is_locked_lbl: String,
  /// 拥有角色
  pub role_ids: String,
  pub role_ids_lbl: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct UsrSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 名称
  pub lbl: Option<String>,
  pub lbl_like: Option<String>,
  /// 用户名
  pub username: Option<String>,
  pub username_like: Option<String>,
  /// 密码
  pub password: Option<String>,
  pub password_like: Option<String>,
  /// 默认部门
  pub default_dept_id: Option<Vec<String>>,
  pub default_dept_id_is_null: Option<bool>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 备注
  pub rem: Option<String>,
  pub rem_like: Option<String>,
  /// 拥有部门
  pub dept_ids: Option<Vec<String>>,
  pub dept_ids_is_null: Option<bool>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
  /// 拥有角色
  pub role_ids: Option<Vec<String>>,
  pub role_ids_is_null: Option<bool>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct UsrInput {
  pub id: Option<ID>,
  /// 名称
  pub lbl: Option<String>,
  /// 用户名
  pub username: Option<String>,
  /// 密码
  pub password: Option<String>,
  /// 默认部门
  pub default_dept_id: Option<String>,
  pub default_dept_id_lbl: Option<String>,
  /// 启用
  pub is_enabled: Option<u8>,
  pub is_enabled_lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 拥有部门
  pub dept_ids: Option<Vec<String>>,
  pub dept_ids_lbl: Option<Vec<String>>,
  /// 锁定
  pub is_locked: Option<u8>,
  pub is_locked_lbl: Option<String>,
  /// 拥有角色
  pub role_ids: Option<Vec<String>>,
  pub role_ids_lbl: Option<Vec<String>>,
}

impl From<UsrInput> for UsrSearch {
  fn from(input: UsrInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      tenant_id: None,
      is_deleted: None,
      // 名称
      lbl: input.lbl,
      // 用户名
      username: input.username,
      // 密码
      password: input.password,
      // 默认部门
      default_dept_id: input.default_dept_id.map(|x| vec![x.into()]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x.into()]),
      // 备注
      rem: input.rem,
      // 拥有部门
      dept_ids: input.dept_ids,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x.into()]),
      // 拥有角色
      role_ids: input.role_ids,
      ..Default::default()
    }
  }
}
