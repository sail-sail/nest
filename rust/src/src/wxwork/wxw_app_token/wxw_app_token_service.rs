use color_eyre::eyre::Result;

use super::wxw_app_token_model::WxwGetConfigSignature;

use super::wxw_app_token_dao;

use crate::r#gen::wxwork::wxw_app::wxw_app_dao::{
  find_one as find_one_wxw_app,
  validate_option as validate_option_wxw_app,
  validate_is_enabled as validate_is_enabled_wxw_app,
};
use crate::r#gen::wxwork::wxw_app::wxw_app_model::WxwAppSearch;

/// 通过 appid, agentid, url 生成企业签名
pub async fn wxw_get_config_signature(
  appid: String,
  agentid: String,
  url: String,
) -> Result<WxwGetConfigSignature> {
  
  let wx_app_model = validate_option_wxw_app(
    find_one_wxw_app(
      WxwAppSearch {
        corpid: Some(appid.clone()),
        agentid: Some(agentid.clone()),
        ..Default::default()
      }.into(),
      None,
      None,
    ).await?,
  ).await?;
  validate_is_enabled_wxw_app(&wx_app_model).await?;
  
  let wx_app_id = wx_app_model.id;
  
  let wxw_get_config_signature = wxw_app_token_dao::get_jsapi_ticket_signature(
    wx_app_id,
    url,
    None,
  ).await?;
  
  Ok(wxw_get_config_signature)
}


/// 通过 appid, agentid, url 生成应用签名
pub async fn wxw_get_agent_config_signature(
  appid: String,
  agentid: String,
  url: String,
) -> Result<WxwGetConfigSignature> {
  
  let wx_app_model = validate_option_wxw_app(
    find_one_wxw_app(
      WxwAppSearch {
        corpid: Some(appid.clone()),
        agentid: Some(agentid.clone()),
        ..Default::default()
      }.into(),
      None,
      None,
    ).await?,
  ).await?;
  validate_is_enabled_wxw_app(&wx_app_model).await?;
  
  let wx_app_id = wx_app_model.id;
  
  let wxw_get_config_signature = wxw_app_token_dao::get_jsapi_ticket_agent_config_signature(
    wx_app_id,
    url,
    None,
  ).await?;
  
  Ok(wxw_get_config_signature)
}
