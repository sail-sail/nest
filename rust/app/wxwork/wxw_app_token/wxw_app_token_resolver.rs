use color_eyre::eyre::Result;

use super::wxw_app_token_model::WxwGetConfigSignature;

use super::wxw_app_token_service;

/// 通过 appid, agentid, url 生成企业签名
pub async fn wxw_get_config_signature(
  appid: String,
  agentid: String,
  url: String,
) -> Result<WxwGetConfigSignature> {
    
  let wxw_get_config_signature = wxw_app_token_service::wxw_get_config_signature(
    appid,
    agentid,
    url,
  ).await?;
  
  Ok(wxw_get_config_signature)
}

/// 通过 appid, agentid, url 生成应用签名
pub async fn wxw_get_agent_config_signature(
  appid: String,
  agentid: String,
  url: String,
) -> Result<WxwGetConfigSignature> {
      
  let wxw_get_config_signature = wxw_app_token_service::wxw_get_agent_config_signature(
    appid,
    agentid,
    url,
  ).await?;
  
  Ok(wxw_get_config_signature)
}
