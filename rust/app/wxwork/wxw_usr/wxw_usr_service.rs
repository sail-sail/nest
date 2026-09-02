use std::sync::{Arc, OnceLock};

use tokio::sync::Mutex;

use color_eyre::eyre::{Result, eyre};
use poem::{IntoResponse, Response, http::StatusCode};
use tracing::error;

use generated::common::context::{
  get_now,
  get_server_tokentimeout,
  Options,
};

use super::wxw_usr_model::{
  NotifyQuery,
  WxwGetAppid,
  WxwLoginByCodeInput,
  WxwLoginByCode,
};

use generated::wxwork::wxw_usr::wxw_usr_model::WxwUsrInput;

use crate::wxwork::wxw_app_token::wxw_app_token_dao::{
  getuserinfo_by_code,
  getuser,
  // getuserdetail,
  getuseridlist,
};
use crate::wxwork::wxw_app_token::wxw_app_token_model::{
  GetuserRes,
  GetuserinfoModel,
};

use generated::base::role::role_dao::find_by_ids_role;
use generated::base::usr::usr_dao::{
  find_one_usr,
  find_by_id_usr,
  // create_usr,
  update_by_id_usr,
  validate_option_usr,
  validate_is_enabled_usr,
};
use generated::base::usr::usr_model::{
  UsrSearch,
  UsrInput,
};

use generated::wxwork::wxw_usr::wxw_usr_dao::{
  find_all_wxw_usr,
  find_one_wxw_usr,
  create_wxw_usr,
  update_by_id_wxw_usr,
};
use generated::wxwork::wxw_usr::wxw_usr_model::WxwUsrSearch;

use generated::wxwork::wxw_app::wxw_app_dao::{
  find_one_ok_wxw_app,
  find_one_wxw_app,
  validate_option_wxw_app,
  validate_is_enabled_wxw_app,
};
use generated::wxwork::wxw_app::wxw_app_model::WxwAppSearch;

use generated::common::auth::auth_dao::get_token_by_auth_model;

use generated::common::auth::auth_model::AuthModel;
use generated::common::usr::usr_model::GetLoginInfoorgIdModel;

use generated::base::domain::domain_dao::{
  find_one_domain,
  validate_option_domain,
  validate_is_enabled_domain,
};
use generated::base::domain::domain_model::DomainSearch;

use generated::base::org::org_model::OrgId;

/// 企业微信用户回调通知
pub async fn wxwork_usr_notify_get(
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

  let contact_notify_token = wxw_app_model.contact_notify_token;
  let contact_notify_aeskey = wxw_app_model.contact_notify_aeskey;

  let agent = wecom_crypto::Agent::new(
    contact_notify_token.as_str(),
    contact_notify_aeskey.as_str(),
  );
  let dec = agent.decrypt(echostr.as_str());
  let dec = match dec {
    Ok(d) => d,
    Err(e) => {
      error!(
        "wxwork_usr_notify_get: {e:#?}"
      );
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

/// 通过host获取appid, agentid
pub async fn wxw_get_appid(
  host: String,
) -> Result<WxwGetAppid> {
  
  // 获取域名
  let domain_model = find_one_domain(
    DomainSearch {
      lbl: host.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let domain_model = validate_option_domain(
    domain_model
  ).await?;
  validate_is_enabled_domain(
    &domain_model,
  ).await?;
  
  let domain_id = domain_model.id;
  
  let wxw_app_model = find_one_wxw_app(
    WxwAppSearch {
      domain_id: vec![domain_id].into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let wxw_app_model = validate_option_wxw_app(
    wxw_app_model,
  ).await?;
  validate_is_enabled_wxw_app(
    &wxw_app_model
  ).await?;
  
  let wxw_get_appid = WxwGetAppid {
    appid: wxw_app_model.corpid,
    agentid: wxw_app_model.agentid,
    scope: "snsapi_base".into(),
  };
  
  Ok(wxw_get_appid)
}

/// 企微单点登录
pub async fn wxw_login_by_code(
  input: WxwLoginByCodeInput,
  options: Option<Options>,
) -> Result<WxwLoginByCode> {
  
  let host = input.host;
  let code = input.code;
  let lang = input.lang.unwrap_or("zh_cn".into());
  
  // 获取域名
  let domain_model = find_one_domain(
    DomainSearch {
      lbl: host.clone().into(),
      ..Default::default()
    }.into(),
    None,
    options,
  ).await?;
  let domain_model = validate_option_domain(
    domain_model
  ).await?;
  validate_is_enabled_domain(
    &domain_model,
  ).await?;
  
  let domain_id = domain_model.id;
  
  let wxw_app_model = find_one_wxw_app(
    WxwAppSearch {
      domain_id: vec![domain_id].into(),
      ..Default::default()
    }.into(),
    None,
    options,
  ).await?;
  let wxw_app_model = validate_option_wxw_app(
    wxw_app_model,
  ).await?;
  validate_is_enabled_wxw_app(
    &wxw_app_model
  ).await?;
  
  let wxw_app_id = wxw_app_model.id;
  let wxw_app_lbl = wxw_app_model.lbl;
  let tenant_id = wxw_app_model.tenant_id;
  
  let GetuserinfoModel {
    userid,
    user_ticket: _,
  } = getuserinfo_by_code(
    wxw_app_id,
    code,
  ).await?;
  
  // let get_user_detail_res = getuserdetail(
  //   wxw_app_id,
  //   user_ticket,
  // ).await?;
  
  let get_user_res = getuser(
    wxw_app_id,
    userid.clone(),
  ).await?;
  if get_user_res.is_none() {
    return Err(eyre!("{userid} 不在应用 {wxw_app_lbl} 的可见范围内"));
  }
  let get_user_res = get_user_res.unwrap();
  
  let GetuserRes {
    name,
    position,
    ..
  } = get_user_res;
  
  // 企微用户
  let wxw_usr_model = find_one_wxw_usr(
    WxwUsrSearch {
      userid: userid.clone().into(),
      tenant_id: tenant_id.into(),
      ..Default::default()
    }.into(),
    None,
    options,
  ).await?;
  if let Some(wxw_usr_model) = wxw_usr_model {
    let id = wxw_usr_model.id;
    if wxw_app_id != wxw_usr_model.wxw_app_id ||
      wxw_app_model.corpid != wxw_usr_model.corpid ||
      wxw_app_model.agentid != wxw_usr_model.agentid ||
      wxw_usr_model.userid != userid ||
      wxw_usr_model.lbl != name ||
      // wxw_usr_model.mobile != get_user_detail_res.mobile ||
      // wxw_usr_model.email != get_user_detail_res.email ||
      // wxw_usr_model.qr_code != get_user_detail_res.qr_code ||
      // wxw_usr_model.avatar != get_user_detail_res.avatar ||
      // wxw_usr_model.gender != get_user_detail_res.gender.to_smolstr() ||
      wxw_usr_model.position != position ||
      wxw_usr_model.tenant_id.as_str() != tenant_id.as_str()
    {
      update_by_id_wxw_usr(
        id,
        WxwUsrInput {
          wxw_app_id: Some(wxw_app_id),
          corpid: Some(wxw_app_model.corpid.clone()),
          agentid: Some(wxw_app_model.agentid.clone()),
          userid: userid.clone().into(),
          lbl: name.clone().into(),
          // mobile: get_user_detail_res.mobile.clone().into(),
          // email: get_user_detail_res.email.clone().into(),
          // qr_code: get_user_detail_res.qr_code.clone().into(),
          // avatar: get_user_detail_res.avatar.clone().into(),
          // gender: get_user_detail_res.gender.to_smolstr().into(),
          position: position.clone().into(),
          tenant_id: tenant_id.into(),
          ..Default::default()
        },
        options,
      ).await?;
    }
  } else {
    create_wxw_usr(
      WxwUsrInput {
        wxw_app_id: Some(wxw_app_id),
        corpid: Some(wxw_app_model.corpid.clone()),
        agentid: Some(wxw_app_model.agentid.clone()),
        userid: userid.clone().into(),
        lbl: name.clone().into(),
        // mobile: get_user_detail_res.mobile.clone().into(),
        // email: get_user_detail_res.email.clone().into(),
        // qr_code: get_user_detail_res.qr_code.clone().into(),
        // avatar: get_user_detail_res.avatar.clone().into(),
        // gender: get_user_detail_res.gender.to_smolstr().into(),
        position: position.clone().into(),
        tenant_id: tenant_id.into(),
        ..Default::default()
      },
      options,
    ).await?;
  }
  let usr_model = find_one_usr(
    UsrSearch {
      // mobile: get_user_detail_res.mobile.clone().into(),
      lbl: name.clone().into(),
      tenant_id: tenant_id.into(),
      ..Default::default()
    }.into(),
    None,
    options,
  ).await?;
  let id;
  if let Some(usr_model) = usr_model {
    validate_is_enabled_usr(
      &usr_model,
    ).await?;
    id = usr_model.id;
    if usr_model.username != name ||
      usr_model.lbl != name ||
      // usr_model.mobile != get_user_detail_res.mobile ||
      usr_model.tenant_id.as_str() != tenant_id.as_str()
    {
      update_by_id_usr(
        id,
        UsrInput {
          username: name.clone().into(),
          lbl: name.clone().into(),
          // mobile: get_user_detail_res.mobile.clone().into(),
          tenant_id: tenant_id.into(),
          ..Default::default()
        },
        options,
      ).await?;
    }
  } else {
    
    // id = create_usr(
    //   UsrInput {
    //     username: name.clone().into(),
    //     lbl: name.clone().into(),
    //     mobile: get_user_detail_res.mobile.clone().into(),
    //     tenant_id: tenant_id.into(),
    //     ..Default::default()
    //   },
    //   options,
    // ).await?;
    // return Err(eyre!(
    //   "企微用户 {name} 的手机号 {mobile} 不存在于系统中, 请联系管理员添加",
    //   mobile = get_user_detail_res.mobile,
    // ));
    
    return Err(eyre!(
      "企微用户 {name} 不存在于系统中, 请联系管理员添加",
    ));
  }
  let usr_model = find_by_id_usr(
    id,
    options,
  ).await?;
  let usr_model = validate_option_usr(
    usr_model,
  ).await?;
  validate_is_enabled_usr(
    &usr_model,
  ).await?;

  let role_ids = usr_model.role_ids.clone();
  let usr_org_ids = usr_model.org_ids.clone();
  let usr_org_ids_lbl = usr_model.org_ids_lbl.clone();

  let role_models = find_by_ids_role(role_ids, options).await?;
  let role_codes = role_models
    .into_iter()
    .map(|item| item.code)
    .collect::<Vec<_>>();

  let org_id_models: Vec<GetLoginInfoorgIdModel> = usr_org_ids
    .into_iter()
    .zip(usr_org_ids_lbl)
    .map(|(id, lbl)| GetLoginInfoorgIdModel {
      id,
      lbl,
    })
    .collect();
  
  let org_ids = usr_model.org_ids;
  let mut org_id = usr_model.default_org_id;
  if !org_id.is_empty() {
    org_id = org_ids[0];
  }
  if !org_id.is_empty() && !org_ids.contains(&org_id) {
    org_id = OrgId::default();
  }
  let now = get_now();
  let server_tokentimeout = get_server_tokentimeout();
  let exp = now.and_utc().timestamp_millis() / 1000 + server_tokentimeout;
  
  let authorization = get_token_by_auth_model(&AuthModel {
    id: usr_model.id,
    tenant_id,
    org_id: org_id.into(),
    lang: Some(lang.clone()),
    exp,
    ..Default::default()
  })?;
  
  let wxw_login_by_code = WxwLoginByCode {
    authorization,
    org_id: Some(org_id),
    usr_id: usr_model.id,
    username: name.clone(),
    name,
    lbl: usr_model.lbl.clone(),
    role_codes,
    org_id_models,
    tenant_id,
    lang,
  };
  
  Ok(wxw_login_by_code)
}

static WXW_SYNC_USR_LOCK: OnceLock<Arc<Mutex<bool>>> = OnceLock::new();

fn get_wxw_sync_usr_lock() -> &'static Arc<Mutex<bool>> {
  WXW_SYNC_USR_LOCK.get_or_init(|| Arc::new(Mutex::new(false)))
}

/// 同步企微用户
pub async fn wxw_sync_usr(
  host: String,
) -> Result<i32> {
  let mut wxw_sync_usr_lock = get_wxw_sync_usr_lock().lock().await;
  if *wxw_sync_usr_lock {
    return Err(eyre!("企微用户正在同步中, 请稍后再试"));
  }
  *wxw_sync_usr_lock = true;
  
  let res = _wxw_sync_usr(
    host,
  ).await;
  
  *wxw_sync_usr_lock = false;
  res
}

/// 同步企微用户
async fn _wxw_sync_usr(
  host: String,
) -> Result<i32> {
  
  // 获取域名
  let domain_model = find_one_domain(
    DomainSearch {
      lbl: host.into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let domain_model = validate_option_domain(
    domain_model
  ).await?;
  validate_is_enabled_domain(
    &domain_model,
  ).await?;
  
  let domain_id = domain_model.id;
  
  let wxw_app_model = find_one_wxw_app(
    WxwAppSearch {
      domain_id: vec![domain_id].into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let wxw_app_model = validate_option_wxw_app(
    wxw_app_model,
  ).await?;
  validate_is_enabled_wxw_app(
    &wxw_app_model,
  ).await?;
  
  let wxw_app_id = wxw_app_model.id;
  let corpid = wxw_app_model.corpid;
  let agentid = wxw_app_model.agentid;
  
  let userids: Vec<String> = getuseridlist(
    wxw_app_id,
  ).await?;
  let wxw_usr_models = find_all_wxw_usr(
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
            && wxw_usr_model.corpid.as_str() == corpid
        )
    })
    .collect::<Vec<String>>();
  let mut wxw_usr_models4add: Vec<WxwUsrInput> = Vec::with_capacity(userids4add.len());
  for userid in userids4add {
    let get_user_res = getuser(
      wxw_app_id,
      userid.clone(),
    ).await?;
    if get_user_res.is_none() {
      continue;
    }
    let get_user_res = get_user_res.unwrap();
    let GetuserRes {
      name,
      position,
      ..
    } = get_user_res;
    wxw_usr_models4add.push(WxwUsrInput {
      wxw_app_id: Some(wxw_app_id),
      corpid: Some(corpid.clone()),
      agentid: Some(agentid.clone()),
      userid: userid.clone().into(),
      lbl: name.clone().into(),
      position: position.clone().into(),
      tenant_id: wxw_app_model.tenant_id.into(),
      ..Default::default()
    });
  }
  let mut num = 0;
  for wxw_usr_model4add in wxw_usr_models4add {
    create_wxw_usr(
      wxw_usr_model4add,
      None,
    ).await?;
    num += 1;
  }
  Ok(num)
}
