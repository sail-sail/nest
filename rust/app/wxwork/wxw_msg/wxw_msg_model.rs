use serde::{Serialize, Deserialize};

use smol_str::SmolStr;

use generated::wxwork::wxw_app::wxw_app_model::WxwAppId;

#[derive(Serialize, Deserialize, Clone)]
pub struct SendCardMsgInput {
  pub wxw_app_id: WxwAppId,
  pub touser: SmolStr,
  pub title: SmolStr,
  pub description: SmolStr,
  pub url: SmolStr,
  pub btntxt: SmolStr,
}
