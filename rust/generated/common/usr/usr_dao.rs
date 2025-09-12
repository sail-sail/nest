use color_eyre::eyre::Result;

use crate::common::context::{
  Options,
  get_now,
  get_server_tokentimeout,
};

use crate::common::auth::auth_dao::get_token_by_auth_model;
use crate::common::auth::auth_model::AuthModel;

use crate::base::usr::usr_model::UsrId;
use crate::base::tenant::tenant_model::TenantId;
use crate::base::org::org_model::OrgId;

use crate::base::usr::usr_dao::{
  find_by_id_usr,
  validate_option_usr,
  validate_is_enabled_usr,
};

use super::usr_model::LoginModel;

/// 根据 UsrId 获取 token, 用于内部登录
#[allow(dead_code)]
pub async fn get_token_by_usr_id(
  usr_id: UsrId,
  tenant_id: Option<TenantId>,
  lang: Option<String>,
  org_id: Option<OrgId>,
) -> Result<LoginModel> {
  
  let usr_model = validate_option_usr(
    find_by_id_usr(
      usr_id,
      None,
    ).await?,
  ).await?;
  validate_is_enabled_usr(&usr_model).await?;
  
  let username = usr_model.username;
  let org_ids = usr_model.org_ids;
  let tenant_id = tenant_id.unwrap_or(usr_model.tenant_id);
  let lang = lang.unwrap_or("zh-CN".to_owned());
  
  let mut org_id = org_id;
  if org_id.is_none() || org_id.as_ref().unwrap().is_empty() {
    org_id = Some(usr_model.default_org_id);
  }
  if let Some(item) = org_id.as_ref()
    && !org_ids.contains(item) {
      org_id = None;
    }
  let org_id = org_id;
  
  let now = get_now();
  let server_tokentimeout = get_server_tokentimeout();
  let exp = now.and_utc().timestamp_millis() / 1000 + server_tokentimeout;
  
  let authorization = get_token_by_auth_model(&AuthModel {
    id: usr_id,
    tenant_id,
    org_id,
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

/// 返回用户是否为超级管理员
#[allow(dead_code)]
pub async fn is_admin(
  usr_id: UsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  let usr_model = find_by_id_usr(
    usr_id,
    options,
  ).await?;
  
  if usr_model.is_none() {
    return Ok(false);
  }
  let usr_model = usr_model.unwrap();
  
  if usr_model.is_enabled == 0 {
    return Ok(false);
  }
  
  let username = usr_model.username;
  
  Ok(username == "admin")
}
