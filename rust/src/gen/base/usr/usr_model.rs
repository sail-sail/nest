use serde::{Serialize, Deserialize};
use sqlx::FromRow;
use async_graphql::{SimpleObject, InputObject};

#[derive(FromRow, SimpleObject, Debug, Default, Serialize, Deserialize)]
pub struct UsrModel {
  pub id: String,
  /// 用户名
  pub username: String,
  /// 密码
  pub password: String,
  /// 启用
  pub is_enabled: i8,
  /// 启用
  pub _is_enabled: String,
  /// 锁定
  pub is_locked: i8,
  /// 锁定
  pub _is_locked: String,
}

pub struct UsrFieldComment {
  /// 用户名
  pub username: String,
  /// 密码
  pub password: String,
  /// 启用
  pub is_enabled: String,
  /// 启用
  pub _is_enabled: String,
  /// 锁定
  pub is_locked: String,
  /// 锁定
  pub _is_locked: String,
}

#[derive(InputObject, Debug, Default)]
pub struct UsrSearch {
  pub id: Option<String>,
  pub username: Option<String>,
  pub is_deleted: Option<i8>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
}
