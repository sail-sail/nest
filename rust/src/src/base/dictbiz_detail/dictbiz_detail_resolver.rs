use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::get_req_id;

use super::dictbiz_detail_model::GetDictbiz;
use super::dictbiz_detail_service;

#[function_name::named]
pub async fn get_dictbiz(
  codes: Vec<String>,
) -> Result<Vec<Vec<GetDictbiz>>> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let data = dictbiz_detail_service::get_dictbiz(
    codes,
  ).await?;
  
  Ok(data)
}
