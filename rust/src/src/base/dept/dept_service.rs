use anyhow::Result;
use crate::common::auth::auth_dao;
use crate::common::context::Ctx;

use crate::gen::base::usr::usr_dao;

pub async fn dept_login_select<'a>(
  ctx: &mut impl Ctx<'a>,
  dept_id: String,
) -> Result<String> {
  let dept_id2 = ctx.get_auth_dept_id();
  if let Some(dept_id2) = dept_id2 {
    if dept_id == dept_id2 {
      return Ok("".to_owned());
    }
  }
  let mut auth_model = ctx.get_auth_model()
    .ok_or_else(|| 
      anyhow::anyhow!("auth_model.is_none()")
    )?;
  let usr_model = usr_dao::find_by_id(ctx, auth_model.id.clone(), None).await?;
  let dept_ids: Vec<String> = {
    if let Some(usr_model) = usr_model {
      usr_model.dept_ids
    } else {
      vec![]
    }
  };
  if !dept_ids.contains(&dept_id) {
    return Err(anyhow::anyhow!("dept_id: {dept_id} dose not exit in login usr"));
  }
  auth_model.dept_id = dept_id.into();
  let token = auth_dao::get_token_by_auth_model(&auth_model)?;
  ctx.set_auth_token(token.clone().into());
  Ok(token)
}
