use serde::{Serialize, Deserialize};
use color_eyre::eyre::Result;

use crate::common::context::{
  Options,
  QueryArgs,
  ArgType,
  query_one,
  get_auth_lang,
};

use crate::common::cache::cache_dao;

use crate::base::lang::lang_dao;
use crate::base::lang::lang_model::{
  LangId,
  LangModel,
};

pub async fn get_login_langs() -> Result<Vec<LangModel>> {
  
  let res = lang_dao::find_all_lang(
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
  
  let cache_key1 = format!("dao.sql.{table}");
  let cache_key2 = crate::common::util::string::hash(serde_json::json!([ &sql, args ]).to_string().as_bytes());
  {
    let str = cache_dao::get_cache(&cache_key1, &cache_key2).await?;
    if let Some(str) = str {
      let res2: Option<LangId>;
      let res = serde_json::from_str::<Option<LangId>>(&str);
      if let Ok(res) = res {
        res2 = res;
      } else {
        res2 = None;
        cache_dao::del_cache(&cache_key1).await?;
      }
      return Ok(res2);
    }
  }
  
  let res: Option<LangIdModel> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  if res.is_none() {
    return Ok(None);
  }
  let res = res.unwrap();
  
  let lang_id = Some(LangId::from(res.id));
  
  {
    let str = serde_json::to_string(&lang_id)?;
    cache_dao::set_cache(&cache_key1, &cache_key2, &str).await?;
  }
  
  Ok(lang_id)
}
