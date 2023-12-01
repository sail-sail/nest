use anyhow::Result;
// use crate::common::context::get_auth_tenant_id;

use crate::gen::base::tenant::tenant_dao::{
  find_all as find_all_tenant,
  del_cache as del_cache_tenant,
};
use crate::gen::base::tenant::tenant_model::TenantSearch;

use super::tenant_model::GetLoginTenants;

use crate::gen::base::domain::domain_dao::{
  find_all as find_all_domain,
  del_cache as del_cache_domain,
};
use crate::gen::base::domain::domain_model::{
  DomainSearch,
  DomainModel,
  DomainId,
};

// 获取当前租户绑定的网址
// pub async fn get_host_tenant() -> Result<String> {
  
//   let tenant_id = get_auth_tenant_id();
  
//   if tenant_id.is_none() {
//     return Err(anyhow::anyhow!("tenant_id is none"));
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
//     return Err(anyhow::anyhow!("tenant_id cannot be found"));
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
  
  let res: Vec<GetLoginTenants> = tenant_models
    .into_iter()
    .map(|item| GetLoginTenants {
      id: item.id,
      lbl: item.lbl,
    })
    .collect();
  
  Ok(res)
}
