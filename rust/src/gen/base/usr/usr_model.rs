use serde::{Serialize, Deserialize};
use sqlx::FromRow;
use async_graphql::{SimpleObject, InputObject};

#[derive(FromRow, SimpleObject, Debug, Default, Serialize, Deserialize)]
pub struct UsrModel {
  id: String,
  username: String,
}

#[derive(InputObject, Debug, Default)]
pub struct UsrSearch {
  pub id: Option<String>,
  pub username: Option<String>,
  pub is_deleted: Option<i8>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
}
