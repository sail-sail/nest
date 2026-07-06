use serde::Deserialize;

use smol_str::SmolStr;

#[derive(Deserialize)]
pub struct NotifyQuery {
  #[serde(rename = "msg_signature")]
  pub msg_signature: SmolStr,
  #[serde(rename = "timestamp")]
  pub timestamp: SmolStr,
  #[serde(rename = "nonce")]
  pub nonce: SmolStr,
  #[serde(rename = "echostr")]
  pub echostr: SmolStr,
  pub corpid: SmolStr,
  pub agentid: SmolStr,
}
