use color_eyre::eyre::{Result, eyre};

use crate::common::auth::auth_dao::get_token_by_auth_model;
use crate::common::context::{
  Ctx,
  Options,
  QueryArgs,
};
use crate::common::cache::cache_dao;

use crate::base::org::org_model::OrgId;
use super::org_model::OrgIdModel;

pub async fn org_login_select(
  ctx: &mut Ctx,
  org_id: Option<OrgId>,
) -> Result<String> {
  
  let mut auth_model = ctx.get_auth_model()
    .ok_or_else(|| 
      eyre!("auth_model.is_none()")
    )?;
  
  let auth_org_id = auth_model.org_id;
  if org_id == auth_org_id {
    return Ok("".to_string());
  }
  let auth_tenant_id = auth_model.tenant_id;
  let auth_usr_id = auth_model.id;
  
  let org_id = org_id.unwrap_or_default();
  
  let options = Options::new();
  let options = options.set_is_debug(Some(false));
  let options = Some(options);

  let mut args = QueryArgs::new();
  let sql = "select base_usr_org.org_id as id from base_usr_org where base_usr_org.usr_id=? and base_usr_org.tenant_id=? and base_usr_org.is_deleted=0".to_string();
  args.push(auth_usr_id.into());
  args.push(auth_tenant_id.into());
  let org_ids: Vec<OrgId> = ctx
    .query::<OrgIdModel>(sql, args.into(), options)
    .await?
    .into_iter()
    .map(|item| item.id)
    .collect();
  if !org_id.is_empty() && !org_ids.contains(&org_id) {
    return Err(eyre!("org_id: {org_id} dose not exit in login usr"));
  }
  auth_model.org_id = org_id.into();
  
  // 更新用户的默认组织
  let sql = "update base_usr set default_org_id=? where id=? and tenant_id=? and is_deleted=0".to_string();
  let mut args = QueryArgs::new();
  args.push(org_id.into());
  args.push(auth_model.id.into());
  args.push(auth_model.tenant_id.into());
  ctx.execute(sql, args.into(), options).await?;
  
  let cache_enabled = cache_dao::get_cache_enabled();
  
  if cache_enabled {
    let cache_key1 = "dao.sql.base_usr";
    cache_dao::del_cache(cache_key1).await?;
  }
  
  let token = get_token_by_auth_model(&auth_model)?;
  ctx.set_auth_model(auth_model);
  Ok(token)
}
