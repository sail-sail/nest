use color_eyre::eyre::Result;

use crate::common::context::Options;

use super::optbiz_service;

/// 移动端是否发版中 uni_releasing
pub async fn get_uni_releasing(
  options: Option<Options>,
) -> Result<bool> {
  
  let res = optbiz_service::get_uni_releasing(
    options.clone(),
  ).await?;
  
  Ok(res)
}
