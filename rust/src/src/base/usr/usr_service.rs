use anyhow::Result;
use crate::common::context::Ctx;

use super::usr_model::Login;

use crate::common::auth::auth_dao::{
  get_password,
  get_token_by_auth_model,
};

use crate::common::auth::auth_model::AuthModel;

use crate::gen::base::usr::usr_dao;
use crate::gen::base::usr::usr_model::UsrSearch;

use super::usr_model::{
  LoginInput,
  GetLoginInfo,
  GetLoginInfoorgIdModel,
};

/// 登录, 获得token
pub async fn login<'a>(
  ctx: &mut impl Ctx<'a>,
  input: LoginInput,
) -> Result<Login> {
  let LoginInput {
    username,
    password,
    tenant_id,
    mut org_id,
    lang,
  } = input;
  if username.is_empty() || password.is_empty() {
    return Err(anyhow::anyhow!("用户名或密码不能为空"));
  }
  if tenant_id.is_empty() {
    return Err(anyhow::anyhow!("请选择租户"));
  }
  let password2 = get_password(password)?;
  
  let usr_model = usr_dao::find_one(
    ctx,
    UsrSearch {
      username: username.into(),
      password: password2.into(),
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
  
  if usr_model.is_enabled == 0 {
    return Err(anyhow::anyhow!("用户已被禁用"));
  }
  
  let org_ids = usr_model.org_ids;
  
  if org_id.is_none() {
    if !usr_model.default_org_id.is_empty() {
      org_id = usr_model.default_org_id.into();
    } else {
      if org_ids.is_empty() {
        return Err(anyhow::anyhow!("用户没有部门"));
      }
      org_id = org_ids[0].clone().into();
    }
  }
  
  let org_id: String = org_id.unwrap();
  
  let now = ctx.get_now();
  let server_tokentimeout = ctx.get_server_tokentimeout();
  let exp = now.timestamp_millis() / 1000 + server_tokentimeout;
  
  let authorization = get_token_by_auth_model(&AuthModel {
    id: usr_model.id.into(),
    tenant_id: tenant_id.into(),
    org_id: org_id.clone().into(),
    lang,
    exp,
    ..Default::default()
  })?;
  
  return Ok(Login {
    authorization,
    org_id,
  });
}

/// 选择语言
pub async fn select_lang<'a>(
  ctx: &mut impl Ctx<'a>,
  lang: String,
) -> Result<String> {
  
  if lang.is_empty() {
    return Err(anyhow::anyhow!("语言编码不能为空"));
  }
  
  let auth_model = ctx.get_auth_model();
  
  if auth_model.is_none() {
    return Err(anyhow::anyhow!("未登录"));
  }
  
  let mut auth_model = auth_model.unwrap();
  auth_model.lang = lang;
  
  let authorization = get_token_by_auth_model(&auth_model)?;
  ctx.set_auth_model_impl(auth_model.into());
  ctx.set_auth_token(authorization.clone().into());
  
  Ok(authorization)
}

pub async fn get_login_info<'a>(
  ctx: &mut impl Ctx<'a>,
) -> Result<GetLoginInfo> {
  
  let auth_model = ctx.get_auth_model();
  if auth_model.is_none() {
    return Err(anyhow::anyhow!("未登录"));
  }
  let auth_model = auth_model.unwrap();
  
  let usr_model = usr_dao::find_by_id(ctx, auth_model.id, None).await?;
  
  if usr_model.is_none() {
    return Err(anyhow::anyhow!("用户不存在"));
  }
  
  let usr_model = usr_model.unwrap();
  
  let org_ids = usr_model.org_ids;
  let org_ids_lbl = usr_model.org_ids_lbl;
  
  let org_id = ctx.get_auth_org_id();
  if org_id.is_none() {
    return Err(anyhow::anyhow!("未登录"));
  }
  
  let org_id_models: Vec<GetLoginInfoorgIdModel> = org_ids.iter().zip(org_ids_lbl.iter()).map(|(id, lbl)| {
    GetLoginInfoorgIdModel {
      id: id.into(),
      lbl: lbl.into(),
    }
  }).collect();
  
  Ok(GetLoginInfo {
    lbl: usr_model.lbl,
    lang: auth_model.lang,
    org_id,
    org_id_models,
  })
  
}
