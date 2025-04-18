use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::get_req_id;

use super::dict_detail_model::GetDict;
use super::dict_detail_service;

#[function_name::named]
pub async fn get_dict(
  codes: Vec<String>,
) -> Result<Vec<Vec<GetDict>>> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let data = dict_detail_service::get_dict(
    codes,
  ).await?;
  
  Ok(data)
}
