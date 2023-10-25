use anyhow::Result;

use crate::gen::base::lang::lang_model::LangModel;

use super::lang_service;

pub async fn get_login_langs() -> Result<Vec<LangModel>> {
  
  let res = lang_service::get_login_langs().await?;
  
  Ok(res)
}
