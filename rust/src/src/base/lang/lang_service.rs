use color_eyre::eyre::Result;

use crate::r#gen::base::lang::lang_model::LangModel;

use super::lang_dao;

pub async fn get_login_langs() -> Result<Vec<LangModel>> {
  
  let res = lang_dao::get_login_langs().await?;
  
  Ok(res)
}
