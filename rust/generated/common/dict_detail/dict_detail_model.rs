use async_graphql::SimpleObject;
use serde::{Serialize, Deserialize};
use sqlx::{
  Row,
  FromRow,
  mysql::MySqlRow,
};

use crate::base::dict_detail::dict_detail_model::DictDetailId;

#[derive(
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

impl FromRow<'_, MySqlRow> for GetDict {
  fn from_row(row: &MySqlRow) -> Result<Self, sqlx::Error> {
    let id: DictDetailId = row.try_get("id")?;
    let code: String = row.try_get("code")?;
    let r#type: String = row.try_get("type")?;
    let lbl: String = row.try_get("lbl")?;
    let lbl_lang: Option<String> = row.try_get("lbl_lang")?;
    let val: String = row.try_get("val")?;
    Ok(Self {
      id,
      code,
      r#type,
      lbl,
      lbl_lang,
      val,
    })
  }
}
