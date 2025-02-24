use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::get_req_id;

use super::field_permit_service::get_field_permit as get_field_permit_service;

/// 字段权限
#[function_name::named]
pub async fn get_field_permit(
  route_path: String,
) -> Result<Option<Vec<String>>> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let fields = get_field_permit_service(route_path).await?;
  
  Ok(fields)
}
