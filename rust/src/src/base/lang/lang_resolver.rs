use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::get_req_id;

use crate::r#gen::base::lang::lang_model::LangModel;

use super::lang_service;

#[function_name::named]
pub async fn get_login_langs() -> Result<Vec<LangModel>> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = lang_service::get_login_langs().await?;
  
  Ok(res)
}
