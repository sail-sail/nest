use serde::{Serialize, Deserialize};
use color_eyre::eyre::Result;

use crate::common::context::{
  Options,
  QueryArgs,
  ArgType,
  query_one,
  get_auth_lang,
};

use crate::r#gen::base::lang::lang_dao;
use crate::r#gen::base::lang::lang_model::{
  LangId,
  LangModel,
};

pub async fn get_login_langs() -> Result<Vec<LangModel>> {
  
  let res = lang_dao::find_all(
    None,
    None,
    None,
    None,
  ).await?;
  
  Ok(res)
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct LangIdModel {
  
  pub id: String,
  
}

/// 获取当前登录用户的语言ID
#[allow(dead_code)]
pub async fn get_lang_id() -> Result<Option<LangId>> {
  
  let lang_code = get_auth_lang();
  
  if lang_code.is_none() || lang_code.as_ref().unwrap().is_empty() {
    return Ok(None);
  }
  
  let table = "base_lang";
  
  let lang_code = lang_code.unwrap();
  
  let options = Options::new()
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let sql = String::from("select id from base_lang where code=?");
  args.push(lang_code.into());
  
  let args: Vec<ArgType> = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = Some(options);
  
  let res: Option<LangIdModel> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  if res.is_none() {
    return Ok(None);
  }
  let res = res.unwrap();
  
  let lang_id = LangId::from(res.id);
  
  Ok(Some(lang_id))
}
