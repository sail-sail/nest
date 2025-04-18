use async_graphql::SimpleObject;
use serde::{Serialize, Deserialize};
use sqlx::FromRow;

use crate::base::dict_detail::dict_detail_model::DictDetailId;

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
  #[graphql(skip)]
  pub lbl_lang: Option<String>,
  pub val: String,
}
