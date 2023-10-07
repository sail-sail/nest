use anyhow::Result;
use crate::common::context::Ctx;

use crate::gen::base::tenant::tenant_dao;
use crate::gen::base::tenant::tenant_model::{
  TenantSearch,
  TenantModel,
};

use crate::gen::base::domain::domain_dao;
use crate::gen::base::domain::domain_model::{
  DomainSearch,
  DomainModel,
};

// 获取当前租户绑定的网址
// pub async fn get_host_tenant<'a>(
//   ctx: &mut impl Ctx<'a>,
// ) -> Result<String> {
  
//   let tenant_id = ctx.get_auth_tenant_id();
  
//   if tenant_id.is_none() {
//     return Err(anyhow::anyhow!("tenant_id is none"));
//   }
  
//   let tenant_id = tenant_id.unwrap();
  
//   let model = tenant_dao::find_one(
//     ctx,
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
#[allow(unused_variables)]
pub async fn get_login_tenants<'a>(
  ctx: &mut impl Ctx<'a>,
  domain: String,
) -> Result<Vec<TenantModel>> {
  
  let domain_models: Vec<DomainModel> = domain_dao::find_all(
    ctx,
    DomainSearch {
      lbl: domain.into(),
      is_enabled: vec![1].into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  let res: Vec<TenantModel> = if domain_models.is_empty() {
    vec![]
  } else {
    let domain_ids: Vec<String> = domain_models.into_iter()
      .map(|x| x.id)
      .collect();
    tenant_dao::find_all(
      ctx,
      TenantSearch {
        domain_ids: domain_ids.into(),
        is_enabled: vec![1].into(),
        ..Default::default()
      }.into(),
      None,
      None,
      None,
    ).await?
  };
  
  Ok(res)
}
