use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct SendCardMsgInput {
  pub wxw_app_id: String,
  pub touser: String,
  pub title: String,
  pub description: String,
  pub url: String,
  pub btntxt: String,
}
