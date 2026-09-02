use serde::Deserialize;

#[derive(Deserialize)]
pub struct NotifyQuery {
  #[serde(rename = "msg_signature")]
  pub msg_signature: String,
  #[serde(rename = "timestamp")]
  pub timestamp: String,
  #[serde(rename = "nonce")]
  pub nonce: String,
  #[serde(rename = "echostr")]
  pub echostr: String,
  pub corpid: String,
  pub agentid: String,
}
