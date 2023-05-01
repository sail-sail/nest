use async_graphql::SimpleObject;
use serde::{Serialize, Deserialize};
use sqlx::FromRow;

#[derive(
  FromRow,
  SimpleObject,
  Debug,
  Default,
  Serialize,
  Deserialize,
  Clone,
)]
pub struct GetDict {
  pub id: String,
  pub code: String,
  pub r#type: String,
  pub lbl: String,
  pub val: String,
}
