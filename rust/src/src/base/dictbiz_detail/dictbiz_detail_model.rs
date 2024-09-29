use async_graphql::SimpleObject;
use serde::{Serialize, Deserialize};
use sqlx::FromRow;

use crate::r#gen::base::dictbiz_detail::dictbiz_detail_model::DictbizDetailId;

#[derive(
  FromRow,
  SimpleObject,
  Debug,
  Default,
  Serialize,
  Deserialize,
  Clone,
)]
pub struct GetDictbiz {
  pub id: DictbizDetailId,
  pub code: String,
  pub r#type: String,
  pub lbl: String,
  pub val: String,
}
