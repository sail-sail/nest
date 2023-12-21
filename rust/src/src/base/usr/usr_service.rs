use anyhow::Result;
use crate::common::context::{
  Ctx,
  get_auth_model_err,
  get_auth_org_id,
  get_now,
  get_server_tokentimeout,
};

use super::usr_model::LoginModel;

use crate::common::auth::auth_dao::{
  get_password,
  get_token_by_auth_model,
};

use crate::common::auth::auth_model::AuthModel;

use crate::gen::base::usr::usr_dao;
use crate::gen::base::usr::usr_model::{
  UsrInput,
  UsrSearch,
};

use super::usr_model::{
  LoginInput,
  GetLoginInfo,
  GetLoginInfoorgIdModel,
  ChangePasswordInput,
};

use crate::src::base::i18n::i18n_dao::NRoute;

/// 登录, 获得token
pub async fn login(
  input: LoginInput,
) -> Result<LoginModel> {
  let LoginInput {
    username,
    password,
    tenant_id,
    org_id,
    lang,
  } = input;
  if username.is_empty() || password.is_empty() {
    return Err(anyhow::anyhow!("用户名或密码不能为空"));
  }
  if tenant_id.is_empty() {
    return Err(anyhow::anyhow!("请选择租户"));
  }
  let usr_model = usr_dao::find_one(
    UsrSearch {
      username: username.into(),
      tenant_id: tenant_id.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  if usr_model.is_none() {
    return Err(anyhow::anyhow!("用户名或密码错误"));
  }
  let usr_model = usr_model.unwrap();
  usr_dao::validate_is_enabled(
    &usr_model,
  ).await?;
  
  if usr_model.password != get_password(password)? {
    return Err(anyhow::anyhow!("用户名或密码错误"));
  }
  let usr_id = usr_model.id;
  let username = usr_model.username;
  
  let org_ids = usr_model.org_ids;
  
  let mut org_id = org_id;
  if org_id.is_none() {
    if !usr_model.default_org_id.is_empty() {
      org_id = usr_model.default_org_id.into();
    } else {
      if !org_ids.is_empty() {
        org_id = org_ids[0].clone().into();
      }
    }
  }
  let org_id = org_id;
  
  let now = get_now();
  let server_tokentimeout = get_server_tokentimeout();
  let exp = now.timestamp_millis() / 1000 + server_tokentimeout;
  
  let authorization = get_token_by_auth_model(&AuthModel {
    id: usr_id.clone(),
    tenant_id: tenant_id.to_string().into(),
    org_id: org_id.clone().into(),
    lang: lang.clone(),
    exp,
    ..Default::default()
  })?;
  
  Ok(LoginModel {
    usr_id,
    username,
    tenant_id,
    authorization,
    org_id,
    lang,
  })
}

/// 选择语言
pub async fn select_lang(
  ctx: &mut Ctx,
  lang: String,
) -> Result<String> {
  
  if lang.is_empty() {
    return Err(anyhow::anyhow!("语言编码不能为空"));
  }
  
  let mut auth_model = get_auth_model_err()?;
  
  auth_model.lang = lang;
  
  let authorization = get_token_by_auth_model(&auth_model)?;
  ctx.set_auth_model(auth_model);
  
  Ok(authorization)
}

/// 修改密码
pub async fn change_password(
  input: ChangePasswordInput,
) -> Result<bool> {
  
  let n_route = NRoute {
    route_path: "/base/usr".to_owned().into()
  };
  
  let old_password = input.old_password;
  let password = input.password;
  let confirm_password = input.confirm_password;
  
  if old_password.is_empty() {
    let err_msg = n_route.n(
      "旧密码不能为空".to_owned(),
      None,
    ).await?;
    return Err(anyhow::anyhow!(err_msg));
  }
  if password.is_empty() {
    let err_msg = n_route.n(
      "新密码不能为空".to_owned(),
      None,
    ).await?;
    return Err(anyhow::anyhow!(err_msg));
  }
  if confirm_password.is_empty() {
    let err_msg = n_route.n(
      "确认密码不能为空".to_owned(),
      None,
    ).await?;
    return Err(anyhow::anyhow!(err_msg));
  }
  if password != confirm_password {
    let err_msg = n_route.n(
      "两次输入的密码不一致".to_owned(),
      None,
    ).await?;
    return Err(anyhow::anyhow!(err_msg));
  }
  
  let auth_model = get_auth_model_err()?;
  
  let usr_id = auth_model.id;
  
  let usr_model = usr_dao::find_by_id(
    usr_id.clone(),
    None,
  ).await?;
  let usr_model = usr_dao::validate_option(
    usr_model
  ).await?;
  usr_dao::validate_is_enabled(
    &usr_model,
  ).await?;
  
  let old_password = get_password(old_password)?;
  
  if usr_model.password != old_password {
    let err_msg = n_route.n(
      "旧密码错误".to_owned(),
      None,
    ).await?;
    return Err(anyhow::anyhow!(err_msg));
  }
  
  usr_dao::update_by_id(
    usr_id,
    UsrInput {
      password: password.into(),
      ..Default::default()
    },
    None,
  ).await?;
  
  Ok(true)
}

pub async fn get_login_info() -> Result<GetLoginInfo> {
  
  let auth_model = get_auth_model_err()?;
  
  let usr_model = usr_dao::find_by_id(
    auth_model.id,
    None,
  ).await?;
  let usr_model = usr_dao::validate_option(
    usr_model
  ).await?;
  
  let org_ids = usr_model.org_ids;
  let org_ids_lbl = usr_model.org_ids_lbl;
  
  let org_id = get_auth_org_id();
  
  let org_id_models: Vec<GetLoginInfoorgIdModel> = org_ids
    .into_iter()
    .zip(org_ids_lbl.into_iter())
    .map(|(id, lbl)| {
      GetLoginInfoorgIdModel {
        id,
        lbl,
      }
    }).collect();
  
  Ok(GetLoginInfo {
    lbl: usr_model.lbl,
    username: usr_model.username,
    lang: auth_model.lang,
    org_id,
    org_id_models,
  })
  
}
