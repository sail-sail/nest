use anyhow::Result;
use crate::common::context::Ctx;

use super::options_dao;
use crate::gen::base::options::options_model::OptionsModel;

pub async fn get_options_by_lbl<'a>(
  ctx: &Ctx<'a>,
  lbl: String,
) -> Result<Vec<OptionsModel>> {
  
  let res = options_dao::get_options_by_lbl(
    ctx,
    lbl,
  ).await?;
  
  Ok(res)
}
