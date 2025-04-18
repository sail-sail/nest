use serde::{Serialize, Deserialize};
use serde_json::json;
use tracing::{info, error};

use color_eyre::eyre::{Result, eyre};
use generated::common::context::get_req_id;

use crate::wxwork::wxw_app_token::wxw_app_token_dao::get_access_token;

use generated::wxwork::wxw_app::wxw_app_dao::{
  find_by_id_wxw_app,
  validate_option_wxw_app,
  validate_is_enabled_wxw_app,
};

use generated::wxwork::wxw_msg::wxw_msg_dao::create_wxw_msg;
use generated::wxwork::wxw_msg::wxw_msg_model::WxwMsgInput;

use super::wxw_msg_model::SendCardMsgInput;

use generated::common::util::http::client;

#[derive(Serialize, Deserialize)]
struct SendRes {
  errcode: i32,
  #[serde(default)]
  errmsg: String,
  #[serde(default)]
  msgid: String,
  #[serde(default)]
  response_code: String,
}

#[allow(dead_code)]
async fn fetch_send_card_msg(
  input: SendCardMsgInput,
  force: bool,
) -> Result<SendRes> {
  let wxw_app_id = input.wxw_app_id.clone();
  let access_token = get_access_token(
    wxw_app_id.clone(),
    force.into(),
  ).await?;
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token={access_token}",
  );
  if input.touser.is_empty() {
    return Err(eyre!("touser 不能为空"));
  }
  if input.title.is_empty() {
    return Err(eyre!("title 不能为空"));
  }
  if input.description.is_empty() {
    return Err(eyre!("description 不能为空"));
  }
  let wxw_app_model = find_by_id_wxw_app(
    wxw_app_id.clone(),
    None,
  ).await?;
  let wxw_app_model = validate_option_wxw_app(
    wxw_app_model,
  ).await?;
  validate_is_enabled_wxw_app(
    &wxw_app_model,
  ).await?;
  let agentid = wxw_app_model.agentid;
  let res = client().post(&url)
    .json(&json!({
      "touser": input.touser,
      "msgtype": "textcard",
      "agentid": agentid,
      "textcard": {
        "title": input.title,
        "description": input.description,
        "url": input.url,
        "btntxt": input.btntxt,
      },
    }))
    .send().await?;
  let data: SendRes = res.json().await?;
  Ok(data)
}

/// 发送卡片消息
#[allow(dead_code)]
pub async fn send_card_msg(
  input: SendCardMsgInput,
) -> Result<bool> {
  let req_id = get_req_id();
  let wxw_app_id = input.wxw_app_id.clone();
  let wxw_app_model = find_by_id_wxw_app(
    wxw_app_id.clone(),
    None,
  ).await?;
  let wxw_app_model = validate_option_wxw_app(
    wxw_app_model,
  ).await?;
  validate_is_enabled_wxw_app(
    &wxw_app_model,
  ).await?;
  let tenant_id = wxw_app_model.tenant_id;
  info!(
    "{req_id} 发送卡片消息: {msg}",
    msg = serde_json::to_string(&input)?,
  );
  let mut data = fetch_send_card_msg(
    input.clone(),
    false,
  ).await?;
  if data.errcode == 42001 {
    data = fetch_send_card_msg(
      input.clone(),
      true,
    ).await?;
  }
  let data_str = serde_json::to_string(&data)?;
  let (
    errcode,
    errmsg,
    msgid,
  ) = (
    data.errcode,
    data.errmsg,
    data.msgid,
  );
  info!(
    "{req_id} 发送卡片消息结果: {msg}",
    msg = &data_str,
  );
  let errmsg: String = if errcode == 0 {
    "".to_owned()
  } else {
    errmsg.chars().take(256).collect()
  };
  create_wxw_msg(
    WxwMsgInput {
      wxw_app_id: wxw_app_id.into(),
      errcode: errcode.to_string().into(),
      touser: input.touser.into(),
      title: input.title.into(),
      description: input.description.into(),
      url: input.url.into(),
      btntxt: input.btntxt.into(),
      errmsg: errmsg.into(),
      msgid: msgid.into(),
      tenant_id: tenant_id.into(),
      ..Default::default()
    },
    None,
  ).await?;
  // 如果全部接收人无权限或不存在，则本次调用返回失败，errcode为81013
  if errcode == 81013 {
    return Ok(false);
  }
  if errcode != 0 {
    error!(
      "{req_id} 发送卡片消息失败: {msg}",
      msg = &data_str,
    );
    return Ok(false);
  }
  Ok(true)
}
