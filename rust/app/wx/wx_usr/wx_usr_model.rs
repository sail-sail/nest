use serde::Deserialize;

use smol_str::SmolStr;

#[derive(Deserialize)]
pub struct Code2sessionInput {
  pub appid: SmolStr,
  pub code: SmolStr,
  pub lang: Option<SmolStr>,
}

#[derive(Deserialize, Debug)]
#[allow(dead_code)]
pub struct Code2sessionModel {
  #[serde(default)]
  pub openid: SmolStr,
  #[serde(default)]
  pub session_key: SmolStr,
  pub unionid: Option<SmolStr>,
  pub errcode: Option<i32>,
  pub errmsg: Option<SmolStr>,
}
