use std::collections::HashMap;

use anyhow::Result;
use crate::common::context::Ctx;

use super::i18n_service;

pub async fn n_lang(
  ctx: &Ctx,
  lang_code: String,
  route_path: Option<String>,
  code: String,
  args: Option<HashMap<String, String>>,
) -> Result<String> {
  
  let res = i18n_service::n_lang(
    ctx,
    lang_code,
    route_path,
    code,
    args,
  ).await?;
  
  Ok(res)
}
