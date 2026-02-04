use async_graphql::SimpleObject;
use serde::{Serialize, Deserialize};
use sqlx::{
  Row,
  FromRow,
  mysql::MySqlRow,
};

use smol_str::SmolStr;

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
  pub code: SmolStr,
  pub r#type: SmolStr,
  pub lbl: SmolStr,
  #[graphql(skip)]
  pub lbl_lang: Option<SmolStr>,
  pub val: SmolStr,
}

impl FromRow<'_, MySqlRow> for GetDict {
  fn from_row(row: &MySqlRow) -> Result<Self, sqlx::Error> {
    let id: DictDetailId = row.try_get("id")?;
    let code: &str = row.try_get("code")?;
    let code = SmolStr::new(code);
    let r#type: &str = row.try_get("type")?;
    let r#type = SmolStr::new(r#type);
    let lbl: &str = row.try_get("lbl")?;
    let lbl = SmolStr::new(lbl);
    let lbl_lang: Option<&str> = row.try_get("lbl_lang")?;
    let lbl_lang = lbl_lang.map(SmolStr::new);
    let val: &str = row.try_get("val")?;
    let val = SmolStr::new(val);
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
