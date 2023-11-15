use anyhow::Result;

use crate::common::auth::auth_dao;
use crate::common::context::{
  Ctx,
  get_auth_model,
  get_auth_org_id,
};
use crate::common::id::ID;

use crate::gen::base::usr::usr_dao;

pub async fn org_login_select(
  ctx: &mut Ctx,
  org_id: ID,
) -> Result<String> {
  let org_id2 = get_auth_org_id();
  if let Some(org_id2) = org_id2 {
    if org_id == org_id2 {
      return Ok("".to_owned());
    }
  }
  let mut auth_model = get_auth_model()
    .ok_or_else(|| 
      anyhow::anyhow!("auth_model.is_none()")
    )?;
  let usr_model = usr_dao::find_by_id(
    auth_model.id.clone(),
    None,
  ).await?;
  let org_ids: Vec<ID> = {
    if let Some(usr_model) = usr_model {
      usr_model.org_ids
    } else {
      vec![]
    }
  };
  if !org_ids.contains(&org_id) {
    return Err(anyhow::anyhow!("org_id: {org_id} dose not exit in login usr"));
  }
  auth_model.org_id = org_id.into();
  let token = auth_dao::get_token_by_auth_model(&auth_model)?;
  ctx.set_auth_model(auth_model);
  Ok(token)
}
