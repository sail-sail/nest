use std::collections::HashMap;

use color_eyre::eyre::Result;

use super::i18n_service;

pub async fn n_lang(
  lang_code: String,
  route_path: Option<String>,
  code: String,
  args: Option<HashMap<String, String>>,
) -> Result<String> {
  
  let res = i18n_service::n_lang(
    lang_code,
    route_path,
    code,
    args,
  ).await?;
  
  Ok(res)
}
