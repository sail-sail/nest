use color_eyre::eyre::Result;

use super::options_dao;
use crate::base::options::options_model::OptionsModel;

pub async fn get_options_by_lbl(
  lbl: String,
) -> Result<Vec<OptionsModel>> {
  
  let res = options_dao::get_options_by_lbl(
    lbl,
  ).await?;
  
  Ok(res)
}
