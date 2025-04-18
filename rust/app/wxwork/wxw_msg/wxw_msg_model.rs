use serde::{Serialize, Deserialize};

use generated::wxwork::wxw_app::wxw_app_model::WxwAppId;

#[derive(Serialize, Deserialize, Clone)]
pub struct SendCardMsgInput {
  pub wxw_app_id: WxwAppId,
  pub touser: String,
  pub title: String,
  pub description: String,
  pub url: String,
  pub btntxt: String,
}
