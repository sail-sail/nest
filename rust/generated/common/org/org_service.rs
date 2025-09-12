use color_eyre::eyre::{Result, eyre};

use crate::common::auth::auth_dao::get_token_by_auth_model;
use crate::common::context::{
  Ctx,
  Options,
  get_auth_model,
  get_auth_org_id,
};

use crate::base::usr::usr_dao::find_by_id_usr;

use crate::base::org::org_model::OrgId;

pub async fn org_login_select(
  ctx: &mut Ctx,
  org_id: OrgId,
) -> Result<String> {
  let org_id2 = get_auth_org_id();
  if let Some(org_id2) = org_id2 && org_id == org_id2 {
    return Ok("".to_owned());
  }
  let mut auth_model = get_auth_model()
    .ok_or_else(|| 
      eyre!("auth_model.is_none()")
    )?;
  
  let options = Options::new();
  let options = options.set_is_debug(Some(false));
  let options = Some(options);
  
  let usr_model = find_by_id_usr(
    auth_model.id,
    options,
  ).await?;
  let org_ids: Vec<OrgId> = {
    if let Some(usr_model) = usr_model {
      usr_model.org_ids
    } else {
      vec![]
    }
  };
  if !org_ids.contains(&org_id) {
    return Err(eyre!("org_id: {org_id} dose not exit in login usr"));
  }
  auth_model.org_id = org_id.into();
  let token = get_token_by_auth_model(&auth_model)?;
  ctx.set_auth_model(auth_model);
  Ok(token)
}
