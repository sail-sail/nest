use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[allow(dead_code)]
pub struct SendSmsResponse {
  #[serde(rename = "RequestId")]
  pub request_id: Option<String>,
  #[serde(rename = "Message")]
  pub message: Option<String>,
  #[serde(rename = "Code")]
  pub code: Option<String>,
}