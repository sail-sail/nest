use anyhow::Result;
use crate::common::context::Ctx;

use crate::gen::base::lang::lang_model::LangModel;

use super::lang_service;

pub async fn get_login_langs<'a>(
  ctx: &Ctx<'a>,
) -> Result<Vec<LangModel>> {
  
  let res = lang_service::get_login_langs(
    ctx,
  ).await?;
  
  Ok(res)
}
