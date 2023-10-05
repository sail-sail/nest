use std::sync::Arc;
use tokio::sync::Mutex;

use anyhow::{Result, anyhow};
use crate::common::context::{
  Ctx,
  get_short_uuid,
};

use super::wxw_usr_model::{
  WxwLoginByCodeInput,
  WxwLoginByCode,
};

use crate::gen::wxwork::wxw_usr::wxw_usr_model::WxwUsrInput;

use crate::src::wxwork::wxw_app_token::wxw_app_token_dao::{
  getuserinfo_by_code,
  getuser,
  getuseridlist,
};
use crate::src::wxwork::wxw_app_token::wxw_app_token_model::{
  GetuserRes,
  GetuserinfoModel,
};

use crate::gen::base::usr::usr_dao::{
  find_one as find_one_usr,
  find_by_id as find_by_id_usr,
  create as create_usr,
  update_by_id as update_usr_by_id,
};
use crate::gen::base::usr::usr_model::{
  UsrSearch,
  UsrInput,
};

use crate::gen::wxwork::wxw_usr::wxw_usr_dao::{
  find_all as find_all_wxw_usr,
  find_one as find_one_wxw_usr,
  find_by_id as find_by_id_wxw_usr,
  create as create_wxw_usr,
  update_by_id as update_by_id_wxw_usr,
};
use crate::gen::wxwork::wxw_usr::wxw_usr_model::WxwUsrSearch;

use crate::gen::wxwork::wxw_app::wxw_app_dao::{
  find_one as find_one_wxw_app,
};
use crate::gen::wxwork::wxw_app::wxw_app_model::WxwAppSearch;

use crate::common::auth::auth_dao::{
  get_password,
  get_token_by_auth_model,
};

use crate::common::auth::auth_model::AuthModel;

/// 企业微信单点登录
pub async fn wxw_login_by_code<'a>(
  ctx: &mut impl Ctx<'a>,
  input: WxwLoginByCodeInput,
) -> Result<WxwLoginByCode> {
  let corpid = input.corpid;
  let agentid = input.agentid;
  let code = input.code;
  let lang = input.lang.unwrap_or("zh_CN".to_string());
  let GetuserinfoModel {
    userid,
    ..
  } = getuserinfo_by_code(
    ctx,
    corpid.clone(),
    code,
  ).await?;
  let GetuserRes {
    name,
    position,
    ..
  } = getuser(
    ctx,
    corpid.clone(),
    userid.clone(),
  ).await?;
  let wxw_app_model = find_one_wxw_app(
    ctx,
    WxwAppSearch {
      corpid: corpid.clone().into(),
      agentid: agentid.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  if wxw_app_model.is_none() {
    return Err(anyhow!(
      "企业微信应用 未配置 corpid: {corpid}, agentid: {agentid}",
    ));
  }
  let wxw_app_model = wxw_app_model.unwrap();
  if wxw_app_model.is_enabled == 0 {
    return Err(anyhow!(
      "企业微信应用 已禁用 corpid: {corpid}, agentid: {agentid}",
    ));
  }
  let tenant_id = wxw_app_model.tenant_id;
  // 企业微信用户
  let wxw_usr_model = find_one_wxw_usr(
    ctx,
    WxwUsrSearch {
      lbl: name.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  if wxw_usr_model.is_none() {
    let id = get_short_uuid();
    create_wxw_usr(
      ctx,
      WxwUsrInput {
        id: id.into(),
        userid: userid.clone().into(),
        lbl: name.clone().into(),
        position: position.clone().into(),
        tenant_id: tenant_id.clone().into(),
        ..Default::default()
      }.into(),
      None,
    ).await?;
  } else {
    let wxw_usr_model = wxw_usr_model.unwrap();
    let id = wxw_usr_model.id.clone();
    if wxw_usr_model.userid != userid ||
      wxw_usr_model.lbl != name ||
      wxw_usr_model.position != position ||
      wxw_usr_model.tenant_id != tenant_id.as_str() {
      update_by_id_wxw_usr(
        ctx,
        id.clone(),
        WxwUsrInput {
          userid: userid.clone().into(),
          lbl: name.clone().into(),
          position: position.clone().into(),
          tenant_id: tenant_id.clone().into(),
          ..Default::default()
        }.into(),
        None,
      ).await?;
    }
  }
  let usr_model = find_one_usr(
    ctx,
    UsrSearch {
      lbl: name.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  if usr_model.is_some() && usr_model.as_ref().unwrap().is_enabled == 0 {
    return Err(anyhow!(
      "用户已禁用",
    ));
  }
  let mut id = get_short_uuid();
  if usr_model.is_none() {
    create_usr(
      ctx,
      UsrInput {
        id: id.clone().into(),
        username: name.clone().into(),
        lbl: name.clone().into(),
        tenant_id: tenant_id.clone().into(),
        ..Default::default()
      }.into(),
      None,
    ).await?;
  } else {
    let usr_model = usr_model.unwrap();
    id = usr_model.id;
    if usr_model.username != name ||
      usr_model.lbl != name ||
      usr_model.tenant_id != tenant_id.as_str()
    {
      update_usr_by_id(
        ctx,
        id.clone(),
        UsrInput {
          username: name.clone().into(),
          lbl: name.clone().into(),
          tenant_id: tenant_id.clone().into(),
          ..Default::default()
        }.into(),
        None,
      ).await?;
    }
  }
  let usr_model = find_by_id_usr(
    ctx,
    id.clone(),
    None,
  ).await?;
  if usr_model.is_none() {
    return Err(anyhow!(
      "usr_model 不存在 id: {id}",
    ));
  }
  let usr_model = usr_model.unwrap();
  let org_ids = usr_model.org_ids;
  let mut org_id = usr_model.default_org_id;
  if org_id.is_empty() {
    org_id = org_ids[0].clone();
  }
  if org_id != "" {
    if !org_ids.contains(&org_id) {
      org_id = "".to_string();
    }
  }
  let now = ctx.get_now();
  let server_tokentimeout = ctx.get_server_tokentimeout();
  let exp = now.timestamp_millis() / 1000 + server_tokentimeout;
  
  let authorization = get_token_by_auth_model(&AuthModel {
    id: usr_model.id.into(),
    tenant_id: tenant_id.clone().into(),
    org_id: org_id.clone().into(),
    lang: lang.clone().into(),
    exp,
    ..Default::default()
  })?;
  Ok(WxwLoginByCode {
    authorization,
    org_id: Some(org_id),
    username: name.clone(),
    name,
    tenant_id,
    lang,
  })
}

lazy_static! {
  static ref WXW_SYNC_USR_LOCK: Arc<Mutex<bool>> = Arc::new(Mutex::new(false));
}

/// 同步企业微信用户
pub async fn wxw_sync_usr<'a>(
  ctx: &mut impl Ctx<'a>,
) -> Result<i32> {
  let mut wxw_sync_usr_lock: tokio::sync::MutexGuard<'_, bool> = WXW_SYNC_USR_LOCK.lock().await;
  if *wxw_sync_usr_lock {
    return Err(anyhow!("企微用户正在同步中, 请稍后再试"));
  }
  *wxw_sync_usr_lock = true;
  let res = _wxw_sync_usr(ctx).await;
  *wxw_sync_usr_lock = false;
  res
}

/// 同步企业微信用户 // TODO
async fn _wxw_sync_usr<'a>(
  ctx: &mut impl Ctx<'a>,
) -> Result<i32> {
  todo!()
}
