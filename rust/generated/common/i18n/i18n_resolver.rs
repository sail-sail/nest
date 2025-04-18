use std::collections::HashMap;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::get_req_id;

use super::i18n_service;

#[function_name::named]
pub async fn n_lang(
  lang_code: String,
  route_path: Option<String>,
  code: String,
  args: Option<HashMap<String, String>>,
) -> Result<String> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = i18n_service::n_lang(
    lang_code,
    route_path,
    code,
    args,
  ).await?;
  
  Ok(res)
}
