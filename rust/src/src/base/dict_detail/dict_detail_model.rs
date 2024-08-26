use async_graphql::SimpleObject;
use serde::{Serialize, Deserialize};
use sqlx::FromRow;

use crate::r#gen::base::dict_detail::dict_detail_model::DictDetailId;

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
  pub id: DictDetailId,
  pub code: String,
  pub r#type: String,
  pub lbl: String,
  pub val: String,
}
