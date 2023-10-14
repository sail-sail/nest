use std::sync::Arc;
use tokio::sync::Mutex;

use anyhow::{Result, anyhow};
use crate::common::context::{
  Ctx,
  get_short_uuid,
};

use super::wxw_usr_model::{
  WxwGetAppid,
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
  validate_option as validate_option_usr,
  validate_is_enabled as validate_is_enabled_usr,
};
use crate::gen::base::usr::usr_model::{
  UsrSearch,
  UsrInput,
};

use crate::gen::wxwork::wxw_usr::wxw_usr_dao::{
  find_all as find_all_wxw_usr,
  find_one as find_one_wxw_usr,
  create as create_wxw_usr,
  update_by_id as update_by_id_wxw_usr,
};
use crate::gen::wxwork::wxw_usr::wxw_usr_model::WxwUsrSearch;

use crate::gen::wxwork::wxw_app::wxw_app_dao::{
  find_one as find_one_wxw_app,
  validate_option as validate_option_wxw_app,
  validate_is_enabled as validate_is_enabled_wxw_app,
};
use crate::gen::wxwork::wxw_app::wxw_app_model::WxwAppSearch;

use crate::common::auth::auth_dao::get_token_by_auth_model;

use crate::common::auth::auth_model::AuthModel;

use crate::gen::base::domain::domain_dao::{
  find_one as find_one_domain,
  validate_option as validate_option_domain,
  validate_is_enabled as validate_is_enabled_domain,
};
use crate::gen::base::domain::domain_model::DomainSearch;

/// 通过host获取appid, agentid
pub async fn wxw_get_appid<'a>(
  ctx: &Ctx<'a>,
  host: String,
) -> Result<WxwGetAppid> {
  
  // 获取域名
  let domain_model = find_one_domain(
    ctx,
    DomainSearch {
      lbl: host.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let domain_model = validate_option_domain(
    ctx,
    domain_model
  ).await?;
  validate_is_enabled_domain(
    ctx,
    &domain_model,
  ).await?;
  
  let domain_id = domain_model.id;
  
  let wxw_app_model = find_one_wxw_app(
    ctx,
    WxwAppSearch {
      domain_id: vec![domain_id].into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let wxw_app_model = validate_option_wxw_app(
    ctx,
    wxw_app_model,
  ).await?;
  validate_is_enabled_wxw_app(
    ctx,
    &wxw_app_model
  ).await?;
  
  let wxw_get_appid = WxwGetAppid {
    appid: wxw_app_model.corpid,
    agentid: wxw_app_model.agentid,
  };
  
  Ok(wxw_get_appid)
}

/// 企微单点登录
pub async fn wxw_login_by_code<'a>(
  ctx: &Ctx<'a>,
  input: WxwLoginByCodeInput,
) -> Result<WxwLoginByCode> {
  let host = input.host;
  let code = input.code;
  let lang = input.lang.unwrap_or("zh_cn".to_string());
  
  // 获取域名
  let domain_model = find_one_domain(
    ctx,
    DomainSearch {
      lbl: host.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let domain_model = validate_option_domain(
    ctx,
    domain_model
  ).await?;
  validate_is_enabled_domain(
    ctx,
    &domain_model,
  ).await?;
  
  let domain_id = domain_model.id;
  
  let wxw_app_model = find_one_wxw_app(
    ctx,
    WxwAppSearch {
      domain_id: vec![domain_id].into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let wxw_app_model = validate_option_wxw_app(
    ctx,
    wxw_app_model,
  ).await?;
  validate_is_enabled_wxw_app(
    ctx,
    &wxw_app_model
  ).await?;
  
  let wxw_app_id = wxw_app_model.id;
  let tenant_id = wxw_app_model.tenant_id;
  
  let GetuserinfoModel {
    userid,
    ..
  } = getuserinfo_by_code(
    ctx,
    wxw_app_id.clone(),
    code,
  ).await?;
  
  let GetuserRes {
    name,
    position,
    ..
  } = getuser(
    ctx,
    wxw_app_id.clone(),
    userid.clone(),
  ).await?;
  
  // 企微用户
  let wxw_usr_model = find_one_wxw_usr(
    ctx,
    WxwUsrSearch {
      lbl: name.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  if let Some(wxw_usr_model) = wxw_usr_model {
    let id = wxw_usr_model.id.clone();
    if wxw_usr_model.userid != userid ||
      wxw_usr_model.lbl != name ||
      wxw_usr_model.position != position ||
      wxw_usr_model.tenant_id != tenant_id.as_str()
    {
      update_by_id_wxw_usr(
        ctx,
        id.clone(),
        WxwUsrInput {
          userid: userid.clone().into(),
          lbl: name.clone().into(),
          position: position.clone().into(),
          tenant_id: tenant_id.clone().into(),
          ..Default::default()
        },
        None,
      ).await?;
    }
  } else {
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
      },
      None,
    ).await?;
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
  let mut id = get_short_uuid();
  if let Some(usr_model) = usr_model {
    validate_is_enabled_usr(
      ctx,
      &usr_model,
    ).await?;
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
        },
        None,
      ).await?;
    }
  } else {
    create_usr(
      ctx,
      UsrInput {
        id: id.clone().into(),
        username: name.clone().into(),
        lbl: name.clone().into(),
        tenant_id: tenant_id.clone().into(),
        ..Default::default()
      },
      None,
    ).await?;
  }
  let usr_model = find_by_id_usr(
    ctx,
    id.clone(),
    None,
  ).await?;
  let usr_model = validate_option_usr(
    ctx,
    usr_model,
  ).await?;
  validate_is_enabled_usr(
    ctx,
    &usr_model,
  ).await?;
  
  let org_ids = usr_model.org_ids;
  let mut org_id = usr_model.default_org_id;
  if !org_id.is_empty() {
    org_id = org_ids[0].clone();
  }
  if !org_id.is_empty() && !org_ids.contains(&org_id) {
    org_id = "".to_string();
  }
  let now = ctx.get_now();
  let server_tokentimeout = ctx.get_server_tokentimeout();
  let exp = now.timestamp_millis() / 1000 + server_tokentimeout;
  
  let authorization = get_token_by_auth_model(&AuthModel {
    id: usr_model.id,
    tenant_id: tenant_id.clone(),
    org_id: org_id.clone().into(),
    lang: lang.clone(),
    exp,
    ..Default::default()
  })?;
  
  let wxw_login_by_code = WxwLoginByCode {
    authorization,
    org_id: Some(org_id),
    username: name.clone(),
    name,
    tenant_id,
    lang,
  };
  
  Ok(wxw_login_by_code)
}

lazy_static! {
  static ref WXW_SYNC_USR_LOCK: Arc<Mutex<bool>> = Arc::new(Mutex::new(false));
}

/// 同步企微用户
pub async fn wxw_sync_usr<'a>(
  ctx: &Ctx<'a>,
  host: String,
) -> Result<i32> {
  let mut wxw_sync_usr_lock = WXW_SYNC_USR_LOCK.lock().await;
  if *wxw_sync_usr_lock {
    return Err(anyhow!("企微用户正在同步中, 请稍后再试"));
  }
  *wxw_sync_usr_lock = true;
  
  let res = _wxw_sync_usr(
    ctx,
    host,
  ).await;
  
  *wxw_sync_usr_lock = false;
  res
}

/// 同步企微用户
async fn _wxw_sync_usr<'a>(
  ctx: &Ctx<'a>,
  host: String,
) -> Result<i32> {
  
  // 获取域名
  let domain_model = find_one_domain(
    ctx,
    DomainSearch {
      lbl: host.into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let domain_model = validate_option_domain(
    ctx,
    domain_model
  ).await?;
  validate_is_enabled_domain(
    ctx,
    &domain_model,
  ).await?;
  
  let domain_id = domain_model.id;
  
  let wxw_app_model = find_one_wxw_app(
    ctx,
    WxwAppSearch {
      domain_id: vec![domain_id].into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let wxw_app_model = validate_option_wxw_app(
    ctx,
    wxw_app_model,
  ).await?;
  validate_is_enabled_wxw_app(
    ctx,
    &wxw_app_model,
  ).await?;
  
  let wxw_app_id = wxw_app_model.id;
  let userids: Vec<String> = getuseridlist(
    ctx,
    wxw_app_id.clone(),
  ).await?;
  let wxw_usr_models = find_all_wxw_usr(
    ctx,
    None,
    None,
    None,
    None,
  ).await?;
  let userids4add = userids.into_iter()
    .filter(|userid| {
      !wxw_usr_models.iter()
        .any(|wxw_usr_model|
          wxw_usr_model.userid == *userid
        )
    })
    .collect::<Vec<String>>();
  let mut wxw_usr_models4add: Vec<WxwUsrInput> = Vec::with_capacity(userids4add.len());
  for userid in userids4add {
    let GetuserRes {
      name,
      position,
      ..
    } = getuser(
      ctx,
      wxw_app_id.clone(),
      userid.clone(),
    ).await?;
    wxw_usr_models4add.push(WxwUsrInput {
      id: get_short_uuid().into(),
      userid: userid.clone().into(),
      lbl: name.clone().into(),
      position: position.clone().into(),
      tenant_id: wxw_app_model.tenant_id.clone().into(),
      ..Default::default()
    });
  }
  let mut num = 0;
  for wxw_usr_model4add in wxw_usr_models4add {
    create_wxw_usr(
      ctx,
      wxw_usr_model4add,
      None,
    ).await?;
    num += 1;
  }
  Ok(num)
}
