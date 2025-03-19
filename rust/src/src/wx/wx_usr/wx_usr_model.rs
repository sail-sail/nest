use serde::Deserialize;

#[derive(Deserialize)]
pub struct Code2sessionInput {
  pub appid: String,
  pub code: String,
  pub lang: Option<String>,
}

#[derive(Deserialize, Debug)]
#[allow(dead_code)]
pub struct Code2sessionModel {
  pub openid: String,
  pub session_key: String,
  pub unionid: Option<String>,
  pub errcode: Option<i32>,
  pub errmsg: Option<String>,
}
