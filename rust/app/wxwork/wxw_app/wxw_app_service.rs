use color_eyre::eyre::Result;
use poem::{IntoResponse, Response, http::StatusCode};
use tracing::error;

use generated::common::context::Options;

use super::wxw_app_model::NotifyQuery;

use generated::wxwork::wxw_app::wxw_app_dao::find_one_ok_wxw_app;
use generated::wxwork::wxw_app::wxw_app_model::WxwAppSearch;

/// 企业微信应用回调通知
pub async fn wxwork_app_notify_get(
  notify_query: NotifyQuery,
  options: Option<Options>,
) -> Result<Response> {
  
  let NotifyQuery {
    msg_signature: _,
    timestamp: _,
    nonce: _,
    echostr,
    corpid,
    agentid,
  } = notify_query;
  
  let wxw_app_model = find_one_ok_wxw_app(
    Some(WxwAppSearch {
      corpid: Some(corpid),
      agentid: Some(agentid),
      ..Default::default()
    }),
    None,
    options,
  ).await?;
  
  let notify_token = wxw_app_model.notify_token;
  let notify_aeskey = wxw_app_model.notify_aeskey;
  
  let agent = wecom_crypto::Agent::new(
    notify_token.as_str(),
    notify_aeskey.as_str(),
  );
  let dec = agent.decrypt(echostr.as_str());
  let dec = match dec {
    Ok(d) => d,
    Err(e) => {
      error!("wxwork_app_notify_get: {e:#?}");
      return Ok(
        Response::builder()
          .status(StatusCode::INTERNAL_SERVER_ERROR)
          .body(e.to_string())
          .into_response()
      );
    }
  };

  let str = dec.text;

  Ok(
    Response::builder()
      .status(StatusCode::OK)
      .body(str)
      .into_response()
  )
}
