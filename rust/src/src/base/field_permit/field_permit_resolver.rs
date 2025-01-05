use color_eyre::eyre::Result;

use super::field_permit_service::get_field_permit as get_field_permit_service;

/// 字段权限
pub async fn get_field_permit(
  route_path: String,
) -> Result<Option<Vec<String>>> {
  
  let fields = get_field_permit_service(route_path).await?;
  
  Ok(fields)
}
