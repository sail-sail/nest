use sqlx::{
  FromRow,
};

use async_graphql::{
  SimpleObject,
};

#[derive(FromRow, SimpleObject)]
pub struct UsrModel {
  username: String,
  id: String,
}