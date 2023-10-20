use anyhow::Result;
use crate::common::context::Ctx;

use crate::gen::base::lang::lang_model::LangModel;

use super::lang_dao;

pub async fn get_login_langs<'a>(
  ctx: &Ctx<'a>,
) -> Result<Vec<LangModel>> {
  
  let res = lang_dao::get_login_langs(
    ctx,
  ).await?;
  
  Ok(res)
}
