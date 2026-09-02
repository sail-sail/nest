use poem::{
  IntoResponse,
  Response,
  http::StatusCode,
};
  use generated::common::context::Options;

use super::wxw_usr_service;

use super::wxw_usr_model::{
  NotifyQuery,
  WxwGetAppid,
  WxwLoginByCodeInput,
  WxwLoginByCode,
};

/// 企业微信用户回调通知
pub async fn wxwork_usr_notify_get(
  notify_query: NotifyQuery,
  options: Option<Options>,
) -> Response {
  match wxw_usr_service::wxwork_usr_notify_get(
    notify_query,
    options,
  ).await {
    Ok(res) => res,
    Err(err) => Response::builder()
      .status(StatusCode::INTERNAL_SERVER_ERROR)
      .body(err.to_string())
      .into_response(),
  }
}

/// 通过host获取appid, agentid
pub async fn wxw_get_appid(
  host: String,
) -> color_eyre::eyre::Result<WxwGetAppid> {
  
  let res = wxw_usr_service::wxw_get_appid(
    host,
  ).await?;
  
  Ok(res)
}

/// 微信企业号登录
pub async fn wxw_login_by_code(
  input: WxwLoginByCodeInput,
  options: Option<Options>,
) -> color_eyre::eyre::Result<WxwLoginByCode> {
  
  let res = wxw_usr_service::wxw_login_by_code(
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 同步企业微信用户
pub async fn wxw_sync_usr(
  host: String,
) -> color_eyre::eyre::Result<i32> {
  
  let res = wxw_usr_service::wxw_sync_usr(
    host,
  ).await?;
  
  Ok(res)
}
