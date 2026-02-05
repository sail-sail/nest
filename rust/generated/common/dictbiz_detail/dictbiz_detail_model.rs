use async_graphql::SimpleObject;
use serde::{Serialize, Deserialize};
use sqlx::{
  Row,
  FromRow,
  mysql::MySqlRow,
};

use smol_str::SmolStr;

use crate::base::dictbiz_detail::dictbiz_detail_model::DictbizDetailId;

#[derive(
  SimpleObject,
  Debug,
  Default,
  Serialize,
  Deserialize,
  Clone,
)]
pub struct GetDictbiz {
  pub id: DictbizDetailId,
  pub code: SmolStr,
  pub r#type: SmolStr,
  pub lbl: SmolStr,
  pub val: SmolStr,
}

impl FromRow<'_, MySqlRow> for GetDictbiz {
  fn from_row(row: &MySqlRow) -> Result<Self, sqlx::Error> {
    let id: DictbizDetailId = row.try_get("id")?;
    let code: &str = row.try_get("code")?;
    let code = SmolStr::new(code);
    let r#type: &str = row.try_get("type")?;
    let r#type = SmolStr::new(r#type);
    let lbl: &str = row.try_get("lbl")?;
    let lbl = SmolStr::new(lbl);
    let val: &str = row.try_get("val")?;
    let val = SmolStr::new(val);
    Ok(Self {
      id,
      code,
      r#type,
      lbl,
      val,
    })
  }
}

