#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

use serde::{Serialize, Deserialize};
use serde_json::json;
use tracing::{info, error};

use color_eyre::eyre::{Result, eyre};
use smol_str::SmolStr;

use crate::base::domain::domain_dao::find_by_id_domain;
use crate::base::message::message_dao::create_return_message;
use crate::base::message::message_model::{MessageInput, MessageModel};
use crate::base::message_receiver::message_receiver_dao::creates_message_receiver;
use crate::base::message_receiver::message_receiver_model::MessageReceiverInput;
use crate::base::tenant::tenant_dao::find_by_id_tenant;
use crate::base::usr::usr_dao::{
  find_by_id_usr,
  find_by_ids_usr,
};
use crate::base::usr::usr_model::UsrId;
use crate::common::context::{
  Options,
  get_auth_id_ok,
  get_now,
  get_req_id,
};
use crate::common::util::http::client;
use crate::wxwork::wxw_app::wxw_app_dao::{
  find_by_id_wxw_app,
  validate_is_enabled_wxw_app,
  validate_option_wxw_app,
};
use crate::wxwork::wxw_usr::wxw_usr_dao::find_one_wxw_usr;
use crate::wxwork::wxw_usr::wxw_usr_model::WxwUsrSearch;
use crate::wxwork::wxw_app_token::wxw_app_token_dao::{
  create_wxw_app_token,
  update_by_id_wxw_app_token,
  find_one_wxw_app_token,
};
use crate::wxwork::wxw_app_token::wxw_app_token_model::{
  WxwAppTokenInput,
  WxwAppTokenSearch,
};
use crate::wxwork::wxw_app::wxw_app_model::WxwAppId;
use crate::wxwork::wxw_msg::wxw_msg_dao::{
  create_wxw_msg,
};
use crate::wxwork::wxw_msg::wxw_msg_model::{SendCardMsgInput, WxwMsgInput};

#[derive(Serialize, Deserialize)]
struct SendRes {
  errcode: i32,
  #[serde(default)]
  errmsg: SmolStr,
  #[serde(default)]
  msgid: SmolStr,
  #[serde(default)]
  response_code: SmolStr,
}

async fn fetch_access_token(corpid: &str, corpsecret: &str) -> Result<(SmolStr, u32)> {
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid={corpid}&corpsecret={corpsecret}",
    corpid = urlencoding::encode(corpid),
    corpsecret = urlencoding::encode(corpsecret),
  );
  let res = reqwest::get(&url).await?;

  #[derive(Serialize, Deserialize)]
  struct GettokenRes {
    errcode: i32,
    #[serde(default)]
    errmsg: SmolStr,
    #[serde(default)]
    access_token: SmolStr,
    #[serde(default)]
    expires_in: u32,
  }

  let data: GettokenRes = res.json().await?;
  let data_str = serde_json::to_string(&data)?;
  let (access_token, expires_in, errcode, errmsg) = (
    data.access_token,
    data.expires_in,
    data.errcode,
    data.errmsg,
  );

  if access_token.is_empty() || expires_in == 0 || errcode != 0 {
    let req_id = get_req_id();
    let msg = serde_json::to_string(&data_str)?;
    error!("{req_id} 企业微信应用 获取 access_token 失败: {url}: {msg}");
    let msg = format!("企业微信应用 获取 access_token 失败: {errmsg}");
    return Err(eyre!(msg));
  }

  Ok((access_token, expires_in))
}

async fn get_access_token(
  wxw_app_id: WxwAppId,
  force: Option<bool>,
  options: Option<Options>,
) -> Result<SmolStr> {
  let force = force.unwrap_or(false);
  let wxw_app_model = find_by_id_wxw_app(wxw_app_id, None).await?;
  let wxw_app_model = validate_option_wxw_app(wxw_app_model).await?;
  validate_is_enabled_wxw_app(&wxw_app_model).await?;

  let corpid = wxw_app_model.corpid;
  let wxw_app_id = wxw_app_model.id;
  let corpsecret = wxw_app_model.corpsecret;
  let tenant_id = wxw_app_model.tenant_id;

  if corpsecret.is_empty() {
    let msg = format!("未设置企微应用 应用密钥, corpid: {corpid}");
    return Err(eyre!(msg));
  }

  let wxw_app_token_model = find_one_wxw_app_token(
    WxwAppTokenSearch {
      wxw_app_id: vec![wxw_app_id].into(),
      r#type: SmolStr::new("corp").into(),
      tenant_id: tenant_id.into(),
      ..Default::default()
    }
    .into(),
    None,
    options,
  ).await?;

  let now = get_now();
  let now_sec = now.and_utc().timestamp_millis() / 1000;
  if wxw_app_token_model.is_none() {
    let (access_token, expires_in) = fetch_access_token(&corpid, &corpsecret).await?;
    create_wxw_app_token(
      WxwAppTokenInput {
        wxw_app_id: wxw_app_id.into(),
        r#type: SmolStr::new("corp").into(),
        access_token: access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.into(),
        ..Default::default()
      },
      options,
    ).await?;
    return Ok(access_token);
  }

  let wxw_app_token_model = wxw_app_token_model.unwrap();
  let access_token = wxw_app_token_model.access_token;
  let expires_in = wxw_app_token_model.expires_in as i64;
  let token_time = wxw_app_token_model.token_time;
  let token_time_sec = token_time
    .map(|x| x.and_utc().timestamp_millis() / 1000)
    .unwrap_or(0);

  if force || expires_in == 0 || access_token.is_empty() || token_time_sec == 0 || now_sec - token_time_sec >= expires_in {
    let (new_access_token, expires_in) = fetch_access_token(&corpid, &corpsecret).await?;
    update_by_id_wxw_app_token(
      wxw_app_token_model.id,
      WxwAppTokenInput {
        wxw_app_id: wxw_app_id.into(),
        r#type: SmolStr::new("corp").into(),
        access_token: new_access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.into(),
        ..Default::default()
      },
      options,
    ).await?;
    return Ok(new_access_token);
  }

  Ok(access_token)
}

fn normalize_wecom_system_message(mut input: MessageInput) -> MessageInput {
  input.channel = input.channel.or(Some("wecom".into()));
  input.route_path = input.route_path.or_else(|| Some("/base/message".into()));
  input.route_query = input.route_query.or_else(|| Some("".into()));
  input.is_sys_msg = input.is_sys_msg.or(Some(1));
  input.is_pinned = input.is_pinned.or(Some(0));
  input
}

async fn get_tenant_url_prefix(
  tenant_id: Option<crate::base::tenant::tenant_model::TenantId>,
  options: Option<Options>,
) -> Result<String> {
  let Some(tenant_id) = tenant_id else {
    return Ok(String::new());
  };

  let Some(tenant_model) = find_by_id_tenant(tenant_id, options).await? else {
    return Ok(String::new());
  };

  let Some(domain_id) = tenant_model.domain_ids.first().cloned() else {
    return Ok(String::new());
  };

  let Some(domain_model) = find_by_id_domain(domain_id, options).await? else {
    return Ok(String::new());
  };

  let protocol = domain_model.protocol.trim();
  let lbl = domain_model.lbl.trim();

  if protocol.is_empty() && lbl.is_empty() {
    return Ok(String::new());
  }

  let prefix = if protocol.is_empty() || lbl.starts_with("http://") || lbl.starts_with("https://") {
    lbl.to_string()
  } else {
    format!("{protocol}://{lbl}")
  };

  Ok(prefix.trim_end_matches('/').to_string())
}

fn build_url_with_tenant_prefix(prefix: &str, route_path: &str, route_query: &str) -> String {
  let prefix = prefix.trim();
  let route_path = route_path.trim();
  let route_query = route_query.trim();

  let base = if prefix.is_empty() {
    route_path.to_string()
  } else if route_path.is_empty() {
    prefix.to_string()
  } else if route_path.starts_with('/') {
    format!("{}{}", prefix.trim_end_matches('/'), route_path)
  } else {
    format!("{}/{}", prefix.trim_end_matches('/'), route_path.trim_start_matches('/'))
  };

  if route_query.is_empty() {
    base
  } else if base.is_empty() {
    format!("?{route_query}")
  } else if base.contains('?') {
    format!("{base}&{route_query}")
  } else {
    format!("{base}?{route_query}")
  }
}

#[allow(dead_code)]
async fn fetch_send_text_msg(
  input: SendCardMsgInput,
  force: bool,
  options: Option<Options>,
) -> Result<SendRes> {
  let wxw_app_id = input.wxw_app_id;
  let access_token = get_access_token(
    wxw_app_id,
    force.into(),
    options,
  ).await?;
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token={access_token}",
  );
  if input.touser.is_empty() {
    return Err(eyre!("touser 不能为空"));
  }
  if input.description.is_empty() {
    return Err(eyre!("description 不能为空"));
  }

  let wxw_app_model = find_by_id_wxw_app(wxw_app_id, None).await?;
  let wxw_app_model = validate_option_wxw_app(wxw_app_model).await?;
  validate_is_enabled_wxw_app(&wxw_app_model).await?;
  let agentid = wxw_app_model.agentid;

  let res = client()
    .post(&url)
    .json(&json!({
      "touser": input.touser,
      "msgtype": "text",
      "agentid": agentid,
      "text": {
        "content": input.description,
      },
    }))
    .send().await?;

  let data: SendRes = res.json().await?;
  Ok(data)
}

#[allow(dead_code)]
async fn fetch_send_card_msg(
  input: SendCardMsgInput,
  force: bool,
  options: Option<Options>,
) -> Result<Option<SendRes>> {
  
  if input.touser.is_empty() {
    return Ok(None);
  }
  if input.title.is_empty() {
    return Ok(None);
  }
  if input.description.is_empty() {
    return Ok(None);
  }
  
  if input.url.trim().is_empty() {
    return Ok(Some(fetch_send_text_msg(input, force, options).await?));
  }

  let wxw_app_id = input.wxw_app_id;
  let access_token = get_access_token(
    wxw_app_id,
    force.into(),
    options,
  ).await?;
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token={access_token}",
  );

  let wxw_app_model = find_by_id_wxw_app(wxw_app_id, None).await?;
  let wxw_app_model = validate_option_wxw_app(wxw_app_model).await?;
  validate_is_enabled_wxw_app(&wxw_app_model).await?;
  let agentid = wxw_app_model.agentid;

  let res = client()
    .post(&url)
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
  Ok(Some(data))
}

/// 发送卡片消息
#[allow(dead_code)]
pub async fn send_card_msg(
  input: SendCardMsgInput,
  options: Option<Options>,
) -> Result<bool> {
  
  let req_id = get_req_id();
  
  info!(
    "{req_id} 发送卡片消息: {msg}",
    msg = serde_json::to_string(&input)?,
  );
  
  let wxwork_msg_enable = std::env::var("wxwork_msg_enable")
    .unwrap_or_else(|_| "false".to_string())
    .trim()
    .to_ascii_lowercase();
  
  if wxwork_msg_enable != "true" {
    return Ok(false);
  }
  
  if input.touser.is_empty() {
    return Ok(false);
  }
  if input.title.is_empty() {
    return Ok(false);
  }
  if input.description.is_empty() {
    return Ok(false);
  }
  
  let wxw_app_id = input.wxw_app_id;
  let wxw_app_model = find_by_id_wxw_app(wxw_app_id, options).await?;
  let wxw_app_model = validate_option_wxw_app(wxw_app_model).await?;
  validate_is_enabled_wxw_app(&wxw_app_model).await?;
  
  if wxw_app_model.is_send_msg == 0 {
    return Ok(false);
  }
  
  let tenant_id = wxw_app_model.tenant_id;

  let data = fetch_send_card_msg(input.clone(), false, options).await?;
  let mut data = match data {
    Some(data) => data,
    None => {
      return Ok(true);
    }
  };
  if data.errcode == 42001 {
    let data_opt = fetch_send_card_msg(input.clone(), true, options).await?;
    data = match data_opt {
      Some(data) => data,
      None => {
        return Ok(true);
      }
    };
  }

  let data_str = serde_json::to_string(&data)?;

  info!(
    "{req_id} 发送卡片消息结果: {msg}",
    msg = &data_str,
  );
  
  let (
    errcode,
    errmsg,
    msgid,
  ) = (
    data.errcode,
    data.errmsg,
    data.msgid,
  );

  let errmsg: SmolStr = if errcode == 0 {
    SmolStr::new("")
  } else {
    errmsg.chars().take(256).collect::<String>().into()
  };

  create_wxw_msg(
    WxwMsgInput {
      wxw_app_id: wxw_app_id.into(),
      errcode: SmolStr::new(errcode.to_string()).into(),
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
    options,
  ).await?;

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

/// 发送企微系统消息并在 base_message 表中保留记录
#[allow(dead_code, unused)]
pub async fn send_message_wxwork(
  input: MessageInput,
  receiver_usr_ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<MessageModel> {
  let sender_usr_id = get_auth_id_ok()?;
  let mut message_input = normalize_wecom_system_message(input);
  message_input.sender_usr_id = Some(sender_usr_id);

  let title = message_input.title.clone().unwrap_or_else(|| "新消息".into()).to_string();
  let content = message_input.content.clone().unwrap_or_else(|| "您收到一条新消息".into()).to_string();
  let route_path = message_input.route_path.clone().unwrap_or_default().to_string();
  let route_query = message_input.route_query.clone().unwrap_or_default().to_string();
  let tenant_id = message_input.tenant_id;
  let tenant_url_prefix = get_tenant_url_prefix(tenant_id, options).await?;

  let message = create_return_message(message_input, None).await?;

  let mut receiver_inputs = Vec::with_capacity(receiver_usr_ids.len());
  for receiver_usr_id in &receiver_usr_ids {
    receiver_inputs.push(MessageReceiverInput {
      message_id: Some(message.id.clone()),
      receiver_usr_id: Some(receiver_usr_id.clone()),
      is_read: Some(0),
      tenant_id,
      ..Default::default()
    });
  }

  if !receiver_inputs.is_empty() {
    creates_message_receiver(receiver_inputs, options).await?;
  }

  if receiver_usr_ids.is_empty() {
    return Ok(message);
  }

  // 获取 wxw_app_id 企微应用, 遍历所有接收人, 找到存在 wxw_app_id 的人
  let mut wxw_app_id: Option<WxwAppId> = None;
  for receiver_usr_id in &receiver_usr_ids {
    let usr_model = find_by_id_usr(receiver_usr_id.clone(), options).await?;
    let usr_model = match usr_model {
      Some(model) => model,
      None => continue,
    };
    let usr_lbl = usr_model.lbl;
    if let Some(wxw_usr_model) = find_one_wxw_usr(
      WxwUsrSearch {
        lbl: Some(usr_lbl.clone()),
        tenant_id,
        ..Default::default()
      }.into(),
      None,
      options,
    ).await?
      && wxw_app_id.is_none()
    {
      wxw_app_id = Some(wxw_usr_model.wxw_app_id);
      break;
    }
  }
  let wxw_app_id = match wxw_app_id {
    Some(id) => id,
    None => return Ok(message),
  };
  
  let receiver_usr_models = find_by_ids_usr(
    receiver_usr_ids.clone(),
    options,
  ).await?;
  
  let receiver_usr_lbls = receiver_usr_models
    .iter()
    .map(|model| model.lbl.clone())
    .collect::<Vec<_>>();
  
  let mut wxw_usr_models = Vec::with_capacity(receiver_usr_lbls.len());
  for receiver_usr_lbl in &receiver_usr_lbls {
    if let Some(model) = find_one_wxw_usr(
      WxwUsrSearch {
        tenant_id,
        is_deleted: Some(0),
        lbl: Some(receiver_usr_lbl.clone()),
        ..Default::default()
      }
      .into(),
      None,
      options,
    ).await? {
      wxw_usr_models.push(model);
    }
  }

  let touser = wxw_usr_models
    .iter()
    .map(|item| item.userid.clone())
    .collect::<Vec<_>>()
    .join("|");
  
  let url = if route_path.is_empty() {
    String::new()
  } else {
    build_url_with_tenant_prefix(&tenant_url_prefix, &route_path, &route_query)
  };
  
  let url = "".to_string(); // 先不发 url

  let wecom_input = SendCardMsgInput {
    wxw_app_id,
    touser: touser.into(),
    title: title.clone().into(),
    description: content.clone().into(),
    url: url.clone().into(),
    btntxt: if url.is_empty() { "".into() } else { "查看".into() },
  };

  send_card_msg(wecom_input, options).await?;

  Ok(message)
}
