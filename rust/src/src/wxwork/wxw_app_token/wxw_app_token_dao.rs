use serde::{Serialize, Deserialize};
use tracing::{info, error};

use anyhow::{Result, anyhow};
use crate::common::context::{
  Ctx,
  get_short_uuid,
};

use crate::gen::wxwork::wxw_app_token::wxw_app_token_dao::{
  find_one as find_one_wxw_app_token,
  create as create_wxw_app_token,
  update_by_id as update_by_id_wxw_app_token,
};
use crate::gen::wxwork::wxw_app_token::wxw_app_token_model::{
  WxwAppTokenInput,
  WxwAppTokenSearch,
};

use crate::gen::wxwork::wxw_app::wxw_app_dao::find_one as find_one_wxw_app;
use crate::gen::wxwork::wxw_app::wxw_app_model::WxwAppSearch;

#[derive(Serialize, Deserialize)]
struct GettokenModel {
  errcode: i32,
  errmsg: String,
  access_token: String,
  expires_in: u32,
}

/// 从企业微信获取 access_token
///
/// #### 参数
///
/// - `ctx`：上下文对象
/// - `corpid`：企业 ID
/// - `corpsecret`：应用的凭证密钥
///
/// #### 返回值
///
/// 返回一个元组，包含 access_token 和过期时间（单位：秒）
///
/// #### 异常
///
/// 如果获取 access_token 失败，则返回一个 anyhow::Error 对象
async fn fetch_access_token(
  ctx: &mut impl Ctx<'_>,
  corpid: &str,
  corpsecret: &str,
) -> Result<(String, u32)> {
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid={}&corpsecret={}",
    urlencoding::encode(&corpid),
    urlencoding::encode(&corpsecret),
  );
  let res = reqwest::get(&url).await?;
  let data: GettokenModel = res.json().await?;
  let access_token = data.access_token.clone();
  let expires_in = data.expires_in;
  let errcode = data.errcode;
  if access_token.is_empty() || expires_in <= 0 || errcode != 0 {
    let req_id = ctx.get_req_id();
    let msg =  serde_json::to_string(&data)?;
    error!("{req_id} 企业微信应用 获取 access_token 失败: {url}: {msg}");
    let msg = format!("企业微信应用 获取 access_token 失败: {url}");
    return Err(anyhow!(msg));
  }
  Ok((access_token, expires_in))
}

/// 获取企业微信应用的 access_token。
///
/// #### 参数
///
/// - `ctx` - 上下文。
/// - `corpid` - 企业 ID。
/// - `force` - 是否强制刷新 access_token
///
/// # ###返回值
///
/// 返回 access_token。
///
/// #### 异常
///
/// 如果未设置企业微信应用或应用密钥，则返回错误。
pub async fn get_access_token<'a>(
  ctx: &mut impl Ctx<'a>,
  corpid: String,
  force: Option<bool>,
) -> Result<String> {
  let force = force.unwrap_or(false);
  let wxw_app_model = find_one_wxw_app(
    ctx,
    WxwAppSearch {
      corpid: corpid.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  if wxw_app_model.is_none() {
    let msg = format!("未设置企业微信应用, corpid: {corpid}");
    return Err(anyhow!(msg));
  }
  let wxw_app_model = wxw_app_model.unwrap();
  let wxw_app_id = wxw_app_model.id;
  let corpsecret = wxw_app_model.corpsecret;
  let tenant_id = wxw_app_model.tenant_id;
  if corpsecret.is_empty() {
    let msg = format!("未设置企业微信应用 应用密钥, corpid: {corpid}");
    return Err(anyhow!(msg));
  }
  let wxw_app_token_model = find_one_wxw_app_token(
    ctx,
    WxwAppTokenSearch {
      wxw_app_id: vec![wxw_app_id.clone()].into(),
      r#type: "corp".to_owned().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let now = ctx.get_now();
  let now_sec = now.timestamp_millis() / 1000;
  if wxw_app_token_model.is_none() {
    let (
      access_token,
      expires_in,
    ) = fetch_access_token(
      ctx,
      &corpid,
      &corpsecret,
    ).await?;
    let id = get_short_uuid();
    create_wxw_app_token(
      ctx,
      WxwAppTokenInput {
        id: id.into(),
        wxw_app_id: wxw_app_id.into(),
        r#type: "crop".to_owned().into(),
        access_token: access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.clone().into(),
        ..Default::default()
      }.into(),
      None,
    ).await?;
    return Ok(access_token);
  }
  let wxw_app_token_model = wxw_app_token_model.unwrap();
  let access_token = wxw_app_token_model.access_token;
  let expires_in = wxw_app_token_model.expires_in as i64;
  let token_time = wxw_app_token_model.token_time;
  let token_time_sec = token_time
    .map(|x| x.timestamp_millis() / 1000)
    .unwrap_or(0);
  if force
    || expires_in == 0
    || access_token.is_empty()
    || token_time_sec == 0
    || now_sec > token_time_sec + expires_in + 120
  {
    let req_id = ctx.get_req_id();
    info!("{req_id} 企业微信应用 access_token 过期, 重新获取: expires_in: {expires_in}");
    let (
      access_token,
      expires_in,
    ) = fetch_access_token(
      ctx,
      &corpid,
      &corpsecret,
    ).await?;
    let id = wxw_app_token_model.id;
    update_by_id_wxw_app_token(
      ctx,
      id,
      WxwAppTokenInput {
        access_token: access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.into(),
        ..Default::default()
      }.into(),
      None,
    ).await?;
    return Ok(access_token);
  }
  Ok(access_token)
}

/// 获取企微通讯录token
pub async fn get_contact_access_token<'a>(
  ctx: &mut impl Ctx<'a>,
  corpid: String,
  force: Option<bool>,
) -> Result<String> {
  let force = force.unwrap_or(false);
  let wxw_app_model = find_one_wxw_app(
    ctx,
    WxwAppSearch {
      corpid: corpid.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  if wxw_app_model.is_none() {
    let msg = format!("未设置企业微信应用, 企业ID: {corpid}");
    return Err(anyhow!(msg));
  }
  let wxw_app_model = wxw_app_model.unwrap();
  let wxw_app_id = wxw_app_model.id;
  let contactsecret = wxw_app_model.contactsecret;
  let tenant_id = wxw_app_model.tenant_id;
  if contactsecret.is_empty() {
    let msg = format!("未设置企业微信应用 通讯录密钥, 企业ID: {corpid}");
    return Err(anyhow!(msg));
  }
  let wxw_app_token_model = find_one_wxw_app_token(
    ctx,
    WxwAppTokenSearch {
      wxw_app_id: vec![wxw_app_id.clone()].into(),
      r#type: "contact".to_owned().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let now = ctx.get_now();
  let now_sec = now.timestamp_millis() / 1000;
  if wxw_app_token_model.is_none() {
    let (
      access_token,
      expires_in,
    ) = fetch_access_token(
      ctx,
      &corpid,
      &contactsecret,
    ).await?;
    let id = get_short_uuid();
    create_wxw_app_token(
      ctx,
      WxwAppTokenInput {
        id: id.into(),
        wxw_app_id: wxw_app_id.into(),
        r#type: "contact".to_owned().into(),
        access_token: access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.clone().into(),
        ..Default::default()
      }.into(),
      None,
    ).await?;
    return Ok(access_token);
  }
  let wxw_app_token_model = wxw_app_token_model.unwrap();
  let access_token = wxw_app_token_model.access_token;
  let expires_in = wxw_app_token_model.expires_in as i64;
  let token_time = wxw_app_token_model.token_time;
  let token_time_sec = token_time
    .map(|x| x.timestamp_millis() / 1000)
    .unwrap_or(0);
  if force
    || expires_in == 0
    || access_token.is_empty()
    || token_time_sec == 0
    || now_sec > token_time_sec + expires_in + 120
  {
    let req_id = ctx.get_req_id();
    info!("{req_id} 企业微信应用 通讯录密钥 access_token 过期, 重新获取: expires_in: {expires_in}");
    let (
      access_token,
      expires_in,
    ) = fetch_access_token(
      ctx,
      &corpid,
      &contactsecret,
    ).await?;
    let id = wxw_app_token_model.id;
    update_by_id_wxw_app_token(
      ctx,
      id,
      WxwAppTokenInput {
        access_token: access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.into(),
        ..Default::default()
      }.into(),
      None,
    ).await?;
    return Ok(access_token);
  }
  Ok(access_token)
}
