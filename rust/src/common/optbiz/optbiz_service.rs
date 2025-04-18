use color_eyre::eyre::Result;

use crate::common::context::Options;

use crate::r#gen::base::optbiz::optbiz_dao::find_one_optbiz;
use crate::r#gen::base::optbiz::optbiz_model::OptbizSearch;

/// 移动端是否发版中 uni_releasing
pub async fn get_uni_releasing(
  options: Option<Options>,
) -> Result<bool> {
  
  let optbiz_model = find_one_optbiz(
    Some(OptbizSearch {
      ky: Some("uni_releasing".to_string()),
      ..Default::default()
    }),
    None,
    options.clone(),
  ).await?;
  
  if optbiz_model.is_none() {
    return Ok(false);
  }
  let optbiz_model = optbiz_model.unwrap();
  
  if optbiz_model.is_enabled == 0 {
    return Ok(false);
  }
  
  Ok(optbiz_model.val == "1")
}
