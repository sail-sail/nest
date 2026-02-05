use serde::{Serialize, Deserialize};

use smol_str::SmolStr;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[allow(dead_code)]
pub struct SendSmsResponse {
  #[serde(rename = "RequestId")]
  pub request_id: Option<SmolStr>,
  #[serde(rename = "Message")]
  pub message: Option<SmolStr>,
  #[serde(rename = "Code")]
  pub code: Option<SmolStr>,
}
