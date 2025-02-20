use color_eyre::eyre::Result;
// use crate::common::context::get_auth_tenant_id;

use crate::r#gen::base::tenant::tenant_dao::{
  find_all as find_all_tenant,
  del_cache as del_cache_tenant,
};
use crate::r#gen::base::tenant::tenant_model::TenantSearch;

use super::tenant_model::GetLoginTenants;

use crate::r#gen::base::domain::domain_dao::{
  find_all as find_all_domain,
  del_cache as del_cache_domain,
};
use crate::r#gen::base::domain::domain_model::{
  DomainSearch,
  DomainModel,
  DomainId,
};

// 租户
use crate::r#gen::base::tenant::tenant_dao::{
  find_by_id as find_by_id_tenant,
  validate_option as validate_option_tenant,
};

// 语言
use crate::r#gen::base::lang::lang_dao::find_by_id as find_by_id_lang;

// 用户
use crate::r#gen::base::usr::usr_dao::{
  find_one as find_one_usr,
  update_by_id as update_by_id_usr,
  create as create_usr,
};
use crate::r#gen::base::usr::usr_model::{
  UsrInput,
  UsrSearch,
};

use super::tenant_model::SetTenantAdminPwdInput;

// 获取当前租户绑定的网址
// pub async fn get_host_tenant() -> Result<String> {
  
//   let tenant_id = get_auth_tenant_id();
  
//   if tenant_id.is_none() {
//     return Err(eyre!("tenant_id is none"));
//   }
  
//   let tenant_id = tenant_id.unwrap();
  
//   let model = tenant_dao::find_one(
//     TenantSearch {
//       id: tenant_id.into(),
//       ..Default::default()
//     }.into(),
//     None,
//     None,
//   ).await?;
  
//   if model.is_none() {
//     return Err(eyre!("tenant_id cannot be found"));
//   }
  
//   let model = model.unwrap();
  
//   let domain = model.domain;
  
//   Ok(domain)
// }

/// 根据 当前网址的域名+端口 获取 租户列表
pub async fn get_login_tenants(
  domain: String,
) -> Result<Vec<GetLoginTenants>> {
  
  let mut domain_models: Vec<DomainModel> = find_all_domain(
    DomainSearch {
      lbl: domain.clone().into(),
      is_enabled: vec![1].into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  if domain_models.is_empty() {
    del_cache_domain().await?;
    domain_models = find_all_domain(
      DomainSearch {
        lbl: domain.into(),
        is_enabled: vec![1].into(),
        ..Default::default()
      }.into(),
      None,
      None,
      None,
    ).await?;
  }
  
  let domain_ids: Vec<DomainId> = domain_models
    .into_iter()
    .map(|x| x.id)
    .collect();
  
  if domain_ids.is_empty() {
    return Ok(vec![]);
  }
  
  let mut tenant_models = find_all_tenant(
    TenantSearch {
      domain_ids: domain_ids.clone().into(),
      is_enabled: vec![1].into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  if tenant_models.is_empty() {
    del_cache_domain().await?;
    del_cache_tenant().await?;
    tenant_models = find_all_tenant(
      TenantSearch {
        domain_ids: domain_ids.into(),
        is_enabled: vec![1].into(),
        ..Default::default()
      }.into(),
      None,
      None,
      None,
    ).await?;
  }
  
  let mut res: Vec<GetLoginTenants> = vec![];
  
  for tenant_model in tenant_models {
    
    let lang_model = find_by_id_lang(
      tenant_model.lang_id.clone(),
      None,
    ).await?;
    
    let lang = lang_model
      .map(|x| x.code)
      .unwrap_or_else(|| "zh-CN".to_owned());
    
    res.push(GetLoginTenants {
      id: tenant_model.id,
      lbl: tenant_model.lbl,
      lang,
    });
    
  }
  
  Ok(res)
}

/// 设置租户管理员密码
pub async fn set_tenant_admin_pwd(
  input: SetTenantAdminPwdInput,
) -> Result<bool> {
  
  let tenant_id = input.tenant_id;
  let pwd = input.pwd;
  
  let tenant_model = find_by_id_tenant(
    tenant_id.clone(),
    None,
  ).await?;
  validate_option_tenant(tenant_model).await?;
  
  let usr_model = find_one_usr(
    UsrSearch {
      username: "admin".to_owned().into(),
      tenant_id: tenant_id.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  
  if let Some(usr_model) = usr_model {
    update_by_id_usr(
      usr_model.id,
      UsrInput {
        password: Some(pwd),
        ..Default::default()
      },
      None,
    ).await?;
  } else {
    create_usr(
      UsrInput {
        username: "admin".to_owned().into(),
        password: pwd.to_owned().into(),
        tenant_id: tenant_id.into(),
        ..Default::default()
      },
      None,
    ).await?;
  }
  
  Ok(true)
}
