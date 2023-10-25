use anyhow::Result;

use crate::gen::base::lang::lang_dao;
use crate::gen::base::lang::lang_model::LangModel;

pub async fn get_login_langs() -> Result<Vec<LangModel>> {
  
  let res = lang_dao::find_all(
    None,
    None,
    None,
    None,
  ).await?;
  
  Ok(res)
}
