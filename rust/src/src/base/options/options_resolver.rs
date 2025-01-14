use color_eyre::eyre::Result;

use super::options_service;
use crate::r#gen::base::options::options_model::OptionsModel;

pub async fn get_options_by_lbl(
  lbl: String,
) -> Result<Vec<OptionsModel>> {
  
  let res = options_service::get_options_by_lbl(
    lbl,
  ).await?;
  
  Ok(res)
}
