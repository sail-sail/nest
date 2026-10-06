use color_eyre::eyre::Result;
use poem::{IntoResponse, Response, http::StatusCode};
use serde::Deserialize;
use tracing::{error, info};

use generated::common::context::{Options, get_short_uuid};

use super::wxw_app_model::NotifyQuery;

use generated::wxwork::wxw_app::wxw_app_dao::find_one_ok_wxw_app;
use generated::wxwork::wxw_app::wxw_app_model::WxwAppSearch;
use generated::wxwork::wxw_oa_approval_detail::wxw_oa_approval_detail_dao::create_wxw_oa_approval_detail;
use generated::wxwork::wxw_oa_approval_detail::wxw_oa_approval_detail_model::WxwOaApprovalDetailInput;

#[derive(Debug, Default, Deserialize)]
#[serde(rename = "xml")]
#[allow(dead_code)]
struct WxworkAppNotifyXml {
  #[serde(rename = "MsgType", default)]
  msg_type: String,
  #[serde(rename = "Event", default)]
  event: String,
  #[serde(rename = "ApprovalInfo", default)]
  approval_info: Option<WxworkApprovalInfo>,
}

#[derive(Debug, Default, Deserialize)]
struct WxworkApprovalInfo {
  #[serde(rename = "SpNo", default)]
  sp_no: String,
  #[serde(rename = "SpName", default)]
  sp_name: String,
  #[serde(rename = "SpStatus", default)]
  sp_status: String,
  #[serde(rename = "TemplateId", default)]
  template_id: String,
  #[serde(rename = "ApplyTime", default)]
  apply_time: String,
  #[serde(rename = "Applyer", default)]
  applyer: Option<WxworkApprovalUser>,
  #[serde(rename = "BatchApplyer", default)]
  batch_applyer: Option<WxworkApprovalUser>,
}

#[derive(Debug, Default, Deserialize, Clone)]
#[serde(untagged)]
enum WxworkApprovalUser {
  #[default]
  Empty,
  Object(WxworkApprovalUserObj),
  String(String),
}

#[derive(Debug, Default, Deserialize, Clone)]
struct WxworkApprovalUserObj {
  #[serde(rename = "UserId", default)]
  user_id: String,
}

fn parse_applyer_userid(value: Option<&WxworkApprovalUser>) -> String {
  match value {
    Some(WxworkApprovalUser::Object(item)) => item.user_id.clone(),
    Some(WxworkApprovalUser::String(item)) => item.clone(),
    _ => String::new(),
  }
}

fn parse_approval_apply_time(value: &str) -> Option<chrono::NaiveDateTime> {
  let ts = value.trim();
  let ts = match ts.parse::<i64>() {
    Ok(item) => item,
    Err(_) => return None,
  };

  chrono::DateTime::from_timestamp(ts, 0)
    .map(|dt| dt.naive_utc())
}

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

/// 企业微信应用回调通知 POST
pub async fn wxwork_app_notify_post(
  notify_query: NotifyQuery,
  body: String,
  options: Option<Options>,
) -> Result<Response> {
  let NotifyQuery {
    msg_signature: _,
    timestamp: _,
    nonce: _,
    echostr: _,
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

  let notify_token = wxw_app_model.notify_token.clone();
  let notify_aeskey = wxw_app_model.notify_aeskey.clone();
  let tenant_id = wxw_app_model.tenant_id;

  let agent = wecom_crypto::Agent::new(
    notify_token.as_str(),
    notify_aeskey.as_str(),
  );
  let dec = agent.decrypt(body.trim());
  let dec = match dec {
    Ok(d) => d,
    Err(e) => {
      error!("wxwork_app_notify_post decrypt: {e:#?}");
      return Ok(
        Response::builder()
          .status(StatusCode::INTERNAL_SERVER_ERROR)
          .body(e.to_string())
          .into_response(),
      );
    }
  };

  let decrypted_xml = dec.text;
  info!("企业微信应用回调通知 POST 解密后原始消息: {decrypted_xml}");

  let notify_xml: WxworkAppNotifyXml = match serde_xml_rs::from_str(&decrypted_xml) {
    Ok(item) => item,
    Err(e) => {
      error!("wxwork_app_notify_post xml parse: {e:#?}");
      return Ok(
        Response::builder()
          .status(StatusCode::BAD_REQUEST)
          .body(e.to_string())
          .into_response(),
      );
    }
  };

  if !notify_xml.event.eq_ignore_ascii_case("sys_approval_change") {
    return Ok(
      Response::builder()
        .status(StatusCode::OK)
        .body("success")
        .into_response(),
    );
  }

  let Some(approval_info) = notify_xml.approval_info else {
    error!("wxwork_app_notify_post: sys_approval_change without ApprovalInfo");
    return Ok(
      Response::builder()
        .status(StatusCode::OK)
        .body("success")
        .into_response(),
    );
  };

  let sp_no = approval_info.sp_no.trim().to_string();
  let sp_name = approval_info.sp_name.trim().to_string();
  let sp_status = approval_info.sp_status.trim().parse::<u8>().unwrap_or_default();
  let template_id = approval_info.template_id.trim().to_string();
  let apply_time = parse_approval_apply_time(&approval_info.apply_time).unwrap_or_default();
  let applyer_userid = parse_applyer_userid(approval_info.applyer.as_ref());
  let batch_applyer_userid = parse_applyer_userid(approval_info.batch_applyer.as_ref());

  let input = WxwOaApprovalDetailInput {
    id: Some(get_short_uuid().into()),
    tenant_id: Some(tenant_id),
    sp_no: Some(sp_no),
    sp_name: Some(sp_name),
    sp_status: Some(sp_status),
    sp_status_lbl: None,
    template_id: Some(template_id),
    apply_time: Some(apply_time),
    apply_time_lbl: None,
    apply_time_save_null: None,
    applyer_userid: Some(applyer_userid),
    batch_applyer_userid: Some(batch_applyer_userid),
    raw_data: Some(decrypted_xml.clone()),
    org_id: None,
    org_id_lbl: None,
  };

  match create_wxw_oa_approval_detail(input, options).await {
    Ok(_) => Ok(
      Response::builder()
        .status(StatusCode::OK)
        .body("success")
        .into_response(),
    ),
    Err(e) => {
      error!("wxwork_app_notify_post save approval detail: {e:#?}");
      Ok(
        Response::builder()
          .status(StatusCode::INTERNAL_SERVER_ERROR)
          .body(e.to_string())
          .into_response(),
      )
    }
  }
}
