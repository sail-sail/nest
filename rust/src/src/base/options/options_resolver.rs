use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::get_req_id;

use super::options_service;
use crate::r#gen::base::options::options_model::OptionsModel;

#[function_name::named]
pub async fn get_options_by_lbl(
  lbl: String,
) -> Result<Vec<OptionsModel>> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = options_service::get_options_by_lbl(
    lbl,
  ).await?;
  
  Ok(res)
}
