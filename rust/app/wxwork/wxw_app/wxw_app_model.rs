use serde::Deserialize;

#[derive(Deserialize, Debug, Default)]
pub struct NotifyQuery {
  #[serde(default, rename = "msg_signature")]
  pub msg_signature: String,
  #[serde(default, rename = "timestamp")]
  pub timestamp: String,
  #[serde(default, rename = "nonce")]
  pub nonce: String,
  #[serde(default, rename = "echostr")]
  pub echostr: String,
  #[serde(default)]
  pub lbl: String,
}
