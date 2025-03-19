use serde::Deserialize;

#[derive(Deserialize, Debug)]
#[allow(dead_code)]
pub struct GetAccessTokenModel {
  #[serde(default)]
  pub access_token: String,
  #[serde(default)]
  pub expires_in: u32,
  pub errcode: Option<i32>,
  pub errmsg: Option<String>,
}
