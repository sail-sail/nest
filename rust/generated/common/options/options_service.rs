use color_eyre::eyre::Result;

use smol_str::SmolStr;

use super::options_dao;
use crate::base::options::options_model::OptionsModel;

pub async fn get_options_by_lbl(
  lbl: SmolStr,
) -> Result<Vec<OptionsModel>> {
  
  let res = options_dao::get_options_by_lbl(
    lbl,
  ).await?;
  
  Ok(res)
}
