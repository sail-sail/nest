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

pub async fn login<'a>(
  ctx: &mut impl Ctx<'a>,
  username: String,
  password: String,
  tenant_id: String,
  mut dept_id: Option<String>,
  lang: String,
) -> Result<Login> {
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
  
  let dept_ids = usr_model.dept_ids;
  
  if dept_id.is_none() {
    if !usr_model.default_dept_id.is_empty() {
      dept_id = usr_model.default_dept_id.into();
    } else {
      if dept_ids.is_empty() {
        return Err(anyhow::anyhow!("用户没有部门"));
      }
      dept_id = dept_ids[0].clone().into();
    }
  }
  
  let dept_id: String = dept_id.unwrap();
  
  let authorization = get_token_by_auth_model(&AuthModel {
    id: usr_model.id.into(),
    tenant_id: tenant_id.into(),
    dept_id: dept_id.clone().into(),
    lang: lang.into(),
    ..Default::default()
  })?;
  
  return Ok(Login {
    authorization,
    dept_id,
  });
}
