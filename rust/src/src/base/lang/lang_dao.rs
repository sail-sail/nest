use anyhow::Result;
use crate::common::context::Ctx;

use crate::gen::base::lang::lang_dao;
use crate::gen::base::lang::lang_model::LangModel;

pub async fn get_login_langs<'a>(
  ctx: &mut impl Ctx<'a>,
) -> Result<Vec<LangModel>> {
  
  let res = lang_dao::find_all(
    ctx,
    None,
    None,
    None,
    None,
  ).await?;
  
  Ok(res)
}
