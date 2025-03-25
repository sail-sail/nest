use color_eyre::eyre::{Result,eyre};
use crate::common::context::{
  Ctx,
  Options,
  get_auth_model_err,
  get_auth_org_id,
  get_now,
  get_server_tokentimeout,
};
use crate::common::exceptions::service_exception::ServiceExceptionBuilder;

use super::usr_model::LoginModel;

use crate::common::auth::auth_dao::{
  get_password,
  get_token_by_auth_model,
};

use crate::common::auth::auth_model::AuthModel;

use crate::r#gen::base::usr::usr_dao::{
  find_by_id_usr,
  find_one_usr,
  validate_option_usr,
  validate_is_enabled_usr,
  update_by_id_usr,
};
use crate::r#gen::base::usr::usr_model::{
  UsrInput,
  UsrSearch,
};

// 角色
use crate::r#gen::base::role::role_dao::find_by_ids_role;

// 租户
use crate::r#gen::base::tenant::tenant_dao::{
  find_by_id_tenant,
  validate_option_tenant,
  validate_is_enabled_tenant,
};

// 语言
use crate::r#gen::base::lang::lang_dao::find_by_id_lang;

use super::usr_model::{
  LoginInput,
  GetLoginInfo,
  GetLoginInfoorgIdModel,
  ChangePasswordInput,
};

#[allow(unused_imports)]
use crate::r#gen::base::login_log::login_log_dao::{
  create_login_log,
  find_count_login_log,
};

#[allow(unused_imports)]
use crate::r#gen::base::login_log::login_log_model::{
  LoginLogInput,
  LoginLogSearch,
};

use crate::src::base::i18n::i18n_dao::NRoute;

use chrono::{NaiveDateTime, Duration};

/// 登录, 获得token
#[allow(unused_variables)]
pub async fn login(
  ip: String,
  input: LoginInput,
) -> Result<LoginModel> {
  let n_route = NRoute {
    route_path: "/base/usr".to_owned().into()
  };
  
  let LoginInput {
    username,
    password,
    tenant_id,
    org_id,
  } = input;
  if username.is_empty() || password.is_empty() {
    let err_msg = n_route.n(
      "用户名或密码不能为空".to_owned(),
      None,
    ).await?;
    return Err(eyre!(err_msg));
  }
  if tenant_id.is_empty() {
    let err_msg = n_route.n(
      "请选择租户".to_owned(),
      None,
    ).await?;
    return Err(eyre!(err_msg));
  }
  
  // 获取租户
  let tenant_model = validate_option_tenant(
    find_by_id_tenant(
      tenant_id.clone(),
      None,
    ).await?
  ).await?;
  
  validate_is_enabled_tenant(
    &tenant_model,
  ).await?;
  
  let lang_id = tenant_model.lang_id;
  
  // 获取语言
  let lang_model = find_by_id_lang(
    lang_id.clone(),
    None,
  ).await?;
  
  let lang = lang_model.map_or(
    "zh-CN".to_owned(),
    |lang_model| lang_model.code,
  );
  
  // 最近10分钟内密码错误6次, 此用户名锁定10分钟
  let now = get_now();
  let begin: NaiveDateTime = now - Duration::minutes(10);
  let end: NaiveDateTime = now;
  
  #[cfg(not(debug_assertions))]
  {
    let count = find_count_login_log(
      LoginLogSearch {
        username: username.clone().into(),
        ip: ip.clone().into(),
        is_succ: vec![1].into(),
        tenant_id: tenant_id.clone().into(),
        ..Default::default()
      }.into(),
      None,
    ).await?;
    
    if count == 0 {
      let count = find_count_login_log(
        LoginLogSearch {
          username: username.clone().into(),
          ip: ip.clone().into(),
          is_succ: vec![0].into(),
          create_time: [begin.into(), end.into()].into(),
          tenant_id: tenant_id.clone().into(),
          ..Default::default()
        }.into(),
        None,
      ).await?;
      if count >= 6 {
        let err_msg = n_route.n(
          "密码错误次数过多, 请10分钟后再试".to_owned(),
          None,
        ).await?;
        return Err(eyre!(err_msg));
      }
    }
  }
  
  let usr_model = find_one_usr(
    UsrSearch {
      username: username.clone().into(),
      tenant_id: tenant_id.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  
  if usr_model.is_none() || usr_model.as_ref().unwrap().is_enabled == 0 {
    
    #[cfg(not(debug_assertions))]
    {
      create_login_log(
        LoginLogInput {
          username: username.clone().into(),
          ip: ip.clone().into(),
          is_succ: 0.into(),
          tenant_id: tenant_id.clone().into(),
          ..Default::default()
        },
        None,
      ).await?;
    }
    
    let err_msg = n_route.n(
      "用户名或密码错误".to_owned(),
      None,
    ).await?;
    return Err(
      ServiceExceptionBuilder::default()
        .code("username_or_password_error")
        .message(err_msg)
        .rollback(false)
        .build()?
        .into()
    );
  }
  let usr_model = usr_model.unwrap();
  
  if usr_model.password != get_password(password)? {
    
    #[cfg(not(debug_assertions))]
    {
      create_login_log(
        LoginLogInput {
          username: username.clone().into(),
          ip: ip.clone().into(),
          is_succ: 0.into(),
          tenant_id: tenant_id.clone().into(),
          ..Default::default()
        },
        None,
      ).await?;
    }
    
    let err_msg = n_route.n(
      "用户名或密码错误".to_owned(),
      None,
    ).await?;
    return Err(
      ServiceExceptionBuilder::default()
        .code("username_or_password_error")
        .message(err_msg)
        .rollback(false)
        .build()?
        .into()
    );
  }
  
  #[cfg(not(debug_assertions))]
  {
    create_login_log(
      LoginLogInput {
        username: username.clone().into(),
        ip: ip.clone().into(),
        is_succ: 1.into(),
        tenant_id: tenant_id.clone().into(),
        ..Default::default()
      },
      None,
    ).await?;
  }
  
  let usr_id = usr_model.id;
  let username = usr_model.username;
  
  let org_ids = usr_model.org_ids;
  
  let mut org_id = org_id;
  if org_id.is_none() {
    if !usr_model.default_org_id.is_empty() {
      org_id = usr_model.default_org_id.into();
    } else if !org_ids.is_empty() {
      org_id = org_ids[0].clone().into();
    }
  }
  let org_id = org_id;
  
  let now = get_now();
  let server_tokentimeout = get_server_tokentimeout();
  let exp = now.and_utc().timestamp_millis() / 1000 + server_tokentimeout;
  
  let authorization = get_token_by_auth_model(&AuthModel {
    id: usr_id.clone(),
    tenant_id: tenant_id.clone(),
    org_id: org_id.clone(),
    lang: Some(lang.clone()),
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
    return Err(eyre!("语言编码不能为空"));
  }
  
  let mut auth_model = get_auth_model_err()?;
  
  auth_model.lang = Some(lang);
  
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
    return Err(eyre!(err_msg));
  }
  if password.is_empty() {
    let err_msg = n_route.n(
      "新密码不能为空".to_owned(),
      None,
    ).await?;
    return Err(eyre!(err_msg));
  }
  if confirm_password.is_empty() {
    let err_msg = n_route.n(
      "确认密码不能为空".to_owned(),
      None,
    ).await?;
    return Err(eyre!(err_msg));
  }
  if password != confirm_password {
    let err_msg = n_route.n(
      "两次输入的密码不一致".to_owned(),
      None,
    ).await?;
    return Err(eyre!(err_msg));
  }
  
  let auth_model = get_auth_model_err()?;
  
  let usr_id = auth_model.id;
  
  let options = Options::new()
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let usr_model = find_by_id_usr(
    usr_id.clone(),
    options.clone(),
  ).await?;
  let usr_model = validate_option_usr(
    usr_model
  ).await?;
  validate_is_enabled_usr(
    &usr_model,
  ).await?;
  
  let old_password = get_password(old_password)?;
  
  if usr_model.password != old_password {
    let err_msg = n_route.n(
      "旧密码错误".to_owned(),
      None,
    ).await?;
    return Err(eyre!(err_msg));
  }
  
  update_by_id_usr(
    usr_id,
    UsrInput {
      password: password.into(),
      ..Default::default()
    },
    options.clone(),
  ).await?;
  
  Ok(true)
}

pub async fn get_login_info() -> Result<GetLoginInfo> {
  
  let options = Options::new()
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let auth_model = get_auth_model_err()?;
  
  let usr_model = validate_option_usr(
    find_by_id_usr(
      auth_model.id,
      options.clone(),
    ).await?
  ).await?;
  
  let role_ids = usr_model.role_ids;
  let org_ids = usr_model.org_ids;
  let org_ids_lbl = usr_model.org_ids_lbl;
  
  // 角色
  let role_models = find_by_ids_role(
    role_ids,
    options.clone(),
  ).await?;
  
  let role_codes = role_models
    .into_iter()
    .map(|item| item.code)
    .collect::<Vec<_>>();
  
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
    role_codes,
    lang: auth_model.lang,
    org_id,
    org_id_models,
  })
  
}
