use serde::{Serialize, Deserialize};
use tracing::{info, error};

use color_eyre::eyre::{Result, eyre};

use sha1::{Sha1, Digest};

use crate::common::context::{
  get_req_id,
  get_now,
};

use crate::r#gen::wxwork::wxw_app::wxw_app_model::WxwAppId;
use crate::r#gen::wxwork::wxw_app_token::wxw_app_token_dao::{
  find_one as find_one_wxw_app_token,
  create as create_wxw_app_token,
  update_by_id as update_by_id_wxw_app_token,
  validate_option as validate_option_wxw_app_token,
};
use crate::r#gen::wxwork::wxw_app_token::wxw_app_token_model::{
  WxwAppTokenInput,
  WxwAppTokenSearch,
};

use crate::r#gen::wxwork::wxw_app::wxw_app_dao::{
  find_by_id as find_by_id_wxw_app,
  validate_option as validate_option_wxw_app,
  validate_is_enabled as validate_is_enabled_wxw_app,
};

use super::wxw_app_token_model::{
  GetuserRes,
  GetJsapiTicketRes,
  GetuserinfoModel,
  WxwGetConfigSignature,
};

#[derive(Serialize, Deserialize)]
struct GetuserinfoRes {
  errcode: i32,
  #[serde(default)]
  errmsg: String,
  #[serde(default)]
  userid: String,
  #[serde(default)]
  user_ticket: String,
}

#[derive(Serialize, Deserialize, Default)]
struct GetuseridlistRes {
  errcode: i32,
  #[serde(default)]
  errmsg: String,
  #[serde(default)]
  dept_user: Vec<Userlist>,
}
#[derive(Serialize, Deserialize)]
struct Userlist {
  #[serde(default)]
  userid: String,
  // #[serde(default)]
  // department: i32,
}

/// 从企业微信获取 access_token
async fn fetch_access_token(
  corpid: &str,
  corpsecret: &str,
) -> Result<(String, u32)> {
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
    errmsg: String,
    #[serde(default)]
    access_token: String,
    #[serde(default)]
    expires_in: u32,
  }
  let data: GettokenRes = res.json().await?;
  let data_str = serde_json::to_string(&data)?;
  let (
    access_token,
    expires_in,
    errcode,
    errmsg,
  ) = (
    data.access_token,
    data.expires_in,
    data.errcode,
    data.errmsg,
  );
  if access_token.is_empty() || expires_in == 0 || errcode != 0 {
    let req_id = get_req_id();
    let msg =  serde_json::to_string(&data_str)?;
    error!("{req_id} 企业微信应用 获取 access_token 失败: {url}: {msg}");
    let msg = format!("企业微信应用 获取 access_token 失败: {errmsg}");
    return Err(eyre!(msg));
  }
  Ok((access_token, expires_in))
}

/// 获取企业微信应用的 access_token。
pub async fn get_access_token(
  wxw_app_id: WxwAppId,
  force: Option<bool>,
) -> Result<String> {
  let force = force.unwrap_or(false);
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
      wxw_app_id: vec![wxw_app_id.clone()].into(),
      r#type: "corp".to_owned().into(),
      tenant_id: tenant_id.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let now = get_now();
  let now_sec = now.and_utc().timestamp_millis() / 1000;
  if wxw_app_token_model.is_none() {
    let (
      access_token,
      expires_in,
    ) = fetch_access_token(
      &corpid,
      &corpsecret,
    ).await?;
    create_wxw_app_token(
      WxwAppTokenInput {
        wxw_app_id: wxw_app_id.into(),
        r#type: "corp".to_owned().into(),
        access_token: access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.clone().into(),
        ..Default::default()
      },
      None,
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
  if force
    || expires_in == 0
    || access_token.is_empty()
    || token_time_sec == 0
    || now_sec > token_time_sec + expires_in + 120
  {
    let req_id = get_req_id();
    info!("{req_id} 企微应用 access_token 过期, 重新获取: expires_in: {expires_in}");
    let (
      access_token,
      expires_in,
    ) = fetch_access_token(
      &corpid,
      &corpsecret,
    ).await?;
    let id = wxw_app_token_model.id;
    update_by_id_wxw_app_token(
      id,
      WxwAppTokenInput {
        access_token: access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.into(),
        ..Default::default()
      },
      None,
    ).await?;
    return Ok(access_token);
  }
  Ok(access_token)
}

/// 获取企微通讯录token
pub async fn get_contact_access_token(
  wxw_app_id: WxwAppId,
  force: Option<bool>,
) -> Result<String> {
  let force = force.unwrap_or(false);
  let wxw_app_model = find_by_id_wxw_app(
    wxw_app_id.clone(),
    None,
  ).await?;
  if wxw_app_model.is_none() {
    let msg = format!("企微应用不存在, id: {wxw_app_id}");
    return Err(eyre!(msg));
  }
  let wxw_app_model = wxw_app_model.unwrap();
  if wxw_app_model.is_enabled == 0 {
    let msg = format!(
      "企微应用已禁用 {lbl}",
      lbl = wxw_app_model.lbl,
    );
    return Err(eyre!(msg));
  }
  let corpid = wxw_app_model.corpid;
  let wxw_app_id = wxw_app_model.id;
  let contactsecret = wxw_app_model.contactsecret;
  let tenant_id = wxw_app_model.tenant_id;
  if contactsecret.is_empty() {
    let msg = format!("未设置企业微信应用 通讯录密钥, 企业ID: {corpid}");
    return Err(eyre!(msg));
  }
  let wxw_app_token_model = find_one_wxw_app_token(
    WxwAppTokenSearch {
      wxw_app_id: vec![wxw_app_id.clone()].into(),
      r#type: "contact".to_owned().into(),
      tenant_id: tenant_id.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let now = get_now();
  let now_sec = now.and_utc().timestamp_millis() / 1000;
  if wxw_app_token_model.is_none() {
    let (
      access_token,
      expires_in,
    ) = fetch_access_token(
      &corpid,
      &contactsecret,
    ).await?;
    create_wxw_app_token(
      WxwAppTokenInput {
        wxw_app_id: wxw_app_id.into(),
        r#type: "contact".to_owned().into(),
        access_token: access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.clone().into(),
        ..Default::default()
      },
      None,
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
  if force
    || expires_in == 0
    || access_token.is_empty()
    || token_time_sec == 0
    || now_sec > token_time_sec + expires_in + 120
  {
    let req_id = get_req_id();
    info!("{req_id} 企业微信应用 通讯录密钥 access_token 过期, 重新获取: expires_in: {expires_in}");
    let (
      access_token,
      expires_in,
    ) = fetch_access_token(
      &corpid,
      &contactsecret,
    ).await?;
    let id = wxw_app_token_model.id;
    update_by_id_wxw_app_token(
      id,
      WxwAppTokenInput {
        access_token: access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.into(),
        ..Default::default()
      },
      None,
    ).await?;
    return Ok(access_token);
  }
  Ok(access_token)
}

/// 获取企业的jsapi_ticket
async fn get_jsapi_ticket(
  wxw_app_id: WxwAppId,
  force: Option<bool>,
) -> Result<String> {
  
  let force = force.unwrap_or(false);
  
  let wxw_app_model = validate_option_wxw_app(
    find_by_id_wxw_app(
      wxw_app_id.clone(),
      None,
    ).await?,
  ).await?;
  
  validate_is_enabled_wxw_app(
    &wxw_app_model,
  ).await?;
  
  let wxw_app_token_model = validate_option_wxw_app_token(
    find_one_wxw_app_token(
      WxwAppTokenSearch {
        wxw_app_id: vec![wxw_app_id.clone()].into(),
        r#type: "corp".to_owned().into(),
        ..Default::default()
      }.into(),
      None,
      None,
    ).await?,
  ).await?;
  
  let now = get_now();
  let now_sec = now.and_utc().timestamp_millis() / 1000;
  
  let jsapi_ticket = wxw_app_token_model.jsapi_ticket;
  let jsapi_ticket_expires_in = wxw_app_token_model.jsapi_ticket_expires_in as i64;
  let jsapi_ticket_time = wxw_app_token_model.jsapi_ticket_time;
  let jsapi_ticket_time_sec = jsapi_ticket_time
    .map(|x| x.and_utc().timestamp_millis() / 1000)
    .unwrap_or(0);
  
  if force
    || jsapi_ticket_expires_in == 0
    || jsapi_ticket.is_empty()
    || jsapi_ticket_time_sec == 0
    || now_sec > jsapi_ticket_time_sec + jsapi_ticket_expires_in + 120
  {
    let access_token = get_access_token(
      wxw_app_id.clone(),
      force.into(),
    ).await?;
    
    let url = format!(
      "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token={access_token}",
      access_token = urlencoding::encode(&access_token),
    );
    let res = reqwest::get(&url).await?;
    
    let data_str = res.text().await?;
    let data: GetJsapiTicketRes = serde_json::from_str(&data_str)?;
    
    let (
      ticket,
      expires_in,
      errcode,
      errmsg,
    ) = (
      data.ticket,
      data.expires_in,
      data.errcode,
      data.errmsg,
    );
    
    if ticket.is_empty() || expires_in == 0 || errcode != 0 {
      let req_id = get_req_id();
      let msg =  serde_json::to_string(&data_str)?;
      error!("{req_id} 企业微信应用 获取 jsapi_ticket 失败: {url}: {msg}");
      let msg = format!("企业微信应用 获取 jsapi_ticket 失败: {errmsg}");
      return Err(eyre!(msg));
    }
    
    update_by_id_wxw_app_token(
      wxw_app_token_model.id,
      WxwAppTokenInput {
        jsapi_ticket: ticket.clone().into(),
        jsapi_ticket_expires_in: expires_in.into(),
        jsapi_ticket_time: now.into(),
        ..Default::default()
      },
      None,
    ).await?;
    
    return Ok(ticket);
  }
  
  Ok(jsapi_ticket)
}

/// 获取企业的jsapi_ticket, 跟签名
/// https://developer.work.weixin.qq.com/document/path/90506
pub async fn get_jsapi_ticket_signature(
  wxw_app_id: WxwAppId,
  url: String,
  force: Option<bool>,
) -> Result<WxwGetConfigSignature> {
  
  let jsapi_ticket = get_jsapi_ticket(
    wxw_app_id.clone(),
    force,
  ).await?;
  
  let nonce_str = uuid::Uuid::new_v4().to_string().replace('-', "");
  let timestamp = (get_now().and_utc().timestamp_millis() / 1000).to_string();
  
  let signature = format!(
    "jsapi_ticket={jsapi_ticket}&noncestr={nonce_str}&timestamp={timestamp}&url={url}",
  );
  
  let mut hasher = Sha1::new();
  hasher.update(signature.as_bytes());
  let signature = hasher.finalize();
  let signature = hex::encode(signature);
  
  Ok(WxwGetConfigSignature {
    timestamp,
    nonce_str,
    signature,
  })
}

/// 获取应用 jsapi_ticket
pub async fn get_jsapi_ticket_agent_config(
  wxw_app_id: WxwAppId,
  force: Option<bool>,
) -> Result<String> {
  
  let force = force.unwrap_or(false);
  
  let wxw_app_model = validate_option_wxw_app(
    find_by_id_wxw_app(
      wxw_app_id.clone(),
      None,
    ).await?,
  ).await?;
  
  validate_is_enabled_wxw_app(
    &wxw_app_model,
  ).await?;
  
  let wxw_app_token_model = validate_option_wxw_app_token(
    find_one_wxw_app_token(
      WxwAppTokenSearch {
        wxw_app_id: vec![wxw_app_id.clone()].into(),
        r#type: "corp".to_owned().into(),
        ..Default::default()
      }.into(),
      None,
      None,
    ).await?,
  ).await?;
  
  let now = get_now();
  let now_sec = now.and_utc().timestamp_millis() / 1000;
  
  let corpid = wxw_app_model.corpid;
  let corpsecret = wxw_app_model.corpsecret;
  if corpid.is_empty() || corpsecret.is_empty() {
    return Err(eyre!("未设置企微应用 应用密钥"));
  }
  
  let jsapi_ticket_agent_config = wxw_app_token_model.jsapi_ticket_agent_config;
  let jsapi_ticket_agent_config_expires_in = wxw_app_token_model.jsapi_ticket_agent_config_expires_in as i64;
  let jsapi_ticket_agent_config_time = wxw_app_token_model.jsapi_ticket_agent_config_time;
  let jsapi_ticket_agent_config_time_sec = jsapi_ticket_agent_config_time
    .map(|x| x.and_utc().timestamp_millis() / 1000)
    .unwrap_or(0);
  
  if force
    || jsapi_ticket_agent_config_expires_in == 0
    || jsapi_ticket_agent_config.is_empty()
    || jsapi_ticket_agent_config_time_sec == 0
    || now_sec > jsapi_ticket_agent_config_time_sec + jsapi_ticket_agent_config_expires_in + 120
    || corpid != wxw_app_token_model.corpid
    || corpsecret != wxw_app_token_model.corpsecret
  {
    let access_token = get_access_token(
      wxw_app_id.clone(),
      force.into(),
    ).await?;
    
    let url = format!(
      "https://qyapi.weixin.qq.com/cgi-bin/ticket/get?access_token={access_token}",
      access_token = urlencoding::encode(&access_token),
    );
    let res = reqwest::get(&url).await?;
    
    let data_str = res.text().await?;
    let data: GetJsapiTicketRes = serde_json::from_str(&data_str)?;
    
    let (
      ticket,
      expires_in,
      errcode,
      errmsg,
    ) = (
      data.ticket,
      data.expires_in,
      data.errcode,
      data.errmsg,
    );
    
    if ticket.is_empty() || expires_in == 0 || errcode != 0 {
      let req_id = get_req_id();
      let msg =  serde_json::to_string(&data_str)?;
      error!("{req_id} 企业微信应用 获取 应用jsapi_ticket 失败: {url}: {msg}");
      let msg = format!("企业微信应用 获取 应用jsapi_ticket 失败: {errmsg}");
      return Err(eyre!(msg));
    }
    
    update_by_id_wxw_app_token(
      wxw_app_token_model.id,
      WxwAppTokenInput {
        jsapi_ticket_agent_config: ticket.clone().into(),
        jsapi_ticket_agent_config_expires_in: expires_in.into(),
        jsapi_ticket_agent_config_time: now.into(),
        ..Default::default()
      },
      None,
    ).await?;
    
    return Ok(ticket);
  }
  
  Ok(jsapi_ticket_agent_config)
}

/// 获取应用的jsapi_ticket, 跟签名
/// https://developer.work.weixin.qq.com/document/path/90506
pub async fn get_jsapi_ticket_agent_config_signature(
  wxw_app_id: WxwAppId,
  url: String,
  force: Option<bool>,
) -> Result<WxwGetConfigSignature> {
  
  let jsapi_ticket = get_jsapi_ticket_agent_config(
    wxw_app_id.clone(),
    force,
  ).await?;
  
  let nonce_str = uuid::Uuid::new_v4().to_string().replace('-', "");
  let timestamp = (get_now().and_utc().timestamp_millis() / 1000).to_string();
  
  let signature = format!(
    "jsapi_ticket={jsapi_ticket}&noncestr={nonce_str}&timestamp={timestamp}&url={url}",
  );
  
  let mut hasher = Sha1::new();
  hasher.update(signature.as_bytes());
  let signature = hasher.finalize();
  let signature = hex::encode(signature);
  
  Ok(WxwGetConfigSignature {
    timestamp,
    nonce_str,
    signature,
  })
}

/// 获取访问用户身份
/// https://developer.work.weixin.qq.com/document/path/91023
async fn fetch_getuserinfo_by_code(
  wxw_app_id: WxwAppId,
  code: String,
  force: bool,
) -> Result<GetuserinfoRes> {
  let access_token = get_access_token(
    wxw_app_id,
    force.into(),
  ).await?;
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo?access_token={access_token}&code={code}",
    access_token = urlencoding::encode(&access_token),
    code = urlencoding::encode(&code),
  );
  info!(
    "{req_id} fetch_getuserinfo_by_code.url: {url}",
    req_id = get_req_id(),
  );
  let res = reqwest::get(&url).await?;
  let data = res.text().await?;
  info!(
    "{req_id} fetch_getuserinfo_by_code.data: {data}",
    req_id = get_req_id(),
  );
  let data: GetuserinfoRes = serde_json::from_str(&data)?;
  Ok(data)
}

/// 获取访问用户身份
/// https://developer.work.weixin.qq.com/document/path/91023
/// #### 参数
/// 
/// - `corpid` - 企业ID
/// - `code` - 临时授权码
/// - `force` - 是否强制刷新 access_token, 默认为 false
/// 
/// #### 返回值
/// 
/// 返回用户身份信息 `userid`, `user_ticket`
pub async fn getuserinfo_by_code(
  wxw_app_id: WxwAppId,
  code: String,
) -> Result<GetuserinfoModel> {
  let mut data: GetuserinfoRes = fetch_getuserinfo_by_code(
    wxw_app_id.clone(),
    code.clone(),
    false,
  ).await?;
  if data.errcode == 42001 {
    data = fetch_getuserinfo_by_code(
      wxw_app_id.clone(),
      code.clone(),
      true,
    ).await?;
  }
  let (
    errcode,
    errmsg,
    userid,
    user_ticket,
  ) = (
    data.errcode,
    data.errmsg.clone(),
    data.userid.clone(),
    data.user_ticket.clone(),
  );
  if errcode != 0 {
    error!(
      "{req_id} 获取访问用户身份失败: {errmsg}",
      req_id = get_req_id(),
      errmsg = serde_json::to_string(&data)?,
    );
    return Err(eyre!("获取访问用户身份失败: {errmsg}"));
  }
  Ok(GetuserinfoModel {
    userid,
    user_ticket,
  })
}

async fn fetch_getuseridlist(
  wxw_app_id: WxwAppId,
  force: bool,
) -> Result<GetuseridlistRes> {
  let req_id = get_req_id();
  let access_token = get_contact_access_token(
    wxw_app_id.clone(),
    force.into(),
  ).await?;
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/user/list_id?access_token={access_token}",
    access_token = urlencoding::encode(&access_token),
  );
  info!(
    "{req_id} fetch_getuseridlist.url: {url}",
  );
  let res = reqwest::get(&url).await?;
  let data: GetuseridlistRes = res.json().await?;
  info!(
    "{req_id} fetch_getuseridlist.data: {data}",
    data = serde_json::to_string(&data)?,
  );
  Ok(data)
}

/// 获取成员ID列表
pub async fn getuseridlist(
  wxw_app_id: WxwAppId,
) -> Result<Vec<String>> {
  let req_id = get_req_id();
  let mut data: GetuseridlistRes = fetch_getuseridlist(
    wxw_app_id.clone(),
    false,
  ).await?;
  if data.errcode == 42001 {
    data = fetch_getuseridlist(
      wxw_app_id.clone(),
      true,
    ).await?;
  }
  let data_str = serde_json::to_string(&data)?;
  let errcode = data.errcode;
  let errmsg = data.errmsg;
  let userlist = data.dept_user;
  if errcode != 0 {
    error!(
      "{req_id} 获取成员ID列表失败: {errmsg}",
      errmsg = &data_str,
    );
    return Err(eyre!("获取成员ID列表失败: {errmsg}"));
  }
  let mut userids: Vec<String> = Vec::with_capacity(userlist.len());
  for user in userlist {
    if userids.contains(&user.userid) {
      continue;
    }
    userids.push(user.userid);
  }
  Ok(userids)
}

async fn fetch_getuser(
  wxw_app_id: WxwAppId,
  userid: String,
  force: Option<bool>,
) -> Result<GetuserRes> {
  let req_id = get_req_id();
  let access_token = get_access_token(
    wxw_app_id.clone(),
    force,
  ).await?;
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token={access_token}&userid={userid}",
    access_token = urlencoding::encode(&access_token),
    userid = urlencoding::encode(&userid),
  );
  info!(
    "{req_id} fetch_getuser.url: {url}",
  );
  let res = reqwest::get(&url).await?;
  let data: GetuserRes = res.json().await?;
  info!(
    "{req_id} fetch_getuser.data: {data}",
    data = serde_json::to_string(&data)?,
  );
  Ok(data)
}

/// 从企业微信获取指定用户的信息
///
/// # 参数
///
/// - `corpid`：企业 ID
/// - `userid`：用户 ID
/// - `force`：是否强制刷新 access_token, 默认为 false
///
/// #### 返回值
///
/// 返回 `Result<GetuserRes>`，其中 `GetuserRes` 是获取到的用户信息结构体。
///
/// #### 异常
///
/// 如果获取用户信息失败，则返回 `Err`，其中包含错误信息。
pub async fn getuser(
  wxw_app_id: WxwAppId,
  userid: String,
) -> Result<Option<GetuserRes>> {
  let req_id = get_req_id();
  let data: GetuserRes = fetch_getuser(
    wxw_app_id.clone(),
    userid.clone(),
    false.into(),
  ).await?;
  let data_str = serde_json::to_string(&data)?;
  let errcode = data.errcode;
  let errmsg = data.errmsg.clone();
  // 指定的成员/部门/标签参数无权限, 指定的成员或部门或标签不在应用的可见范围之内
  if errcode == 60011 {
    return Ok(None);
  }
  if errcode == 42001 {
    let data: GetuserRes = fetch_getuser(
      wxw_app_id.clone(),
      userid.clone(),
      true.into(),
    ).await?;
    let data_str = serde_json::to_string(&data)?;
    let errcode = data.errcode;
    let errmsg = data.errmsg.clone();
    if errcode != 0 {
      error!(
        "{req_id} 读取成员失败: {errmsg}",
        errmsg = &data_str,
      );
      return Err(eyre!("读取成员失败: {errmsg}"));
    }
    return Ok(Some(data));
  }
  if errcode != 0 {
    error!(
      "{req_id} 读取成员失败: {errmsg}",
      errmsg = &data_str,
    );
    return Err(eyre!("读取成员失败: {errmsg}"));
  }
  Ok(Some(data))
}
