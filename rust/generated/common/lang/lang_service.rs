use color_eyre::eyre::Result;

use crate::base::lang::lang_model::LangModel;

use crate::common::lang::lang_dao;

pub async fn get_login_langs() -> Result<Vec<LangModel>> {
  
  let res = lang_dao::get_login_langs().await?;
  
  Ok(res)
}
