use std::collections::HashMap;

use anyhow::Result;
use crate::common::context::Ctx;
use crate::gen::base::menu::menu_dao;
use crate::gen::base::menu::menu_model::MenuSearch;

use crate::src::base::i18n::i18n_dao::NRoute;

use super::permit_model::GetUsrPermits;

use crate::gen::base::usr::usr_dao;
use crate::gen::base::permit::permit_dao;

use crate::gen::base::permit::permit_model::PermitSearch;

/// 根据当前用户获取权限列表
pub async fn get_usr_permits<'a>(
  ctx: &mut impl Ctx<'a>,
) -> Result<Vec<GetUsrPermits>> {
  let auth_model = ctx.get_auth_model();
  if auth_model.is_none() {
    return Ok(Vec::new());
  }
  let auth_model = auth_model.unwrap();
  
  let usr_model = usr_dao::find_by_id(
    ctx,
    auth_model.id,
    None,
  ).await?;
  if usr_model.is_none() {
    return Ok(Vec::new());
  }
  let usr_model = usr_model.unwrap();
  
  let role_ids = usr_model.role_ids;
  if role_ids.is_empty() {
    return Ok(Vec::new());
  }
  
  let permit_models = permit_dao::find_all(
    ctx,
    PermitSearch {
      role_id: role_ids.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  let mut menu_id_map = HashMap::<String, String>::new();
  for permit_model in permit_models.iter() {
    let menu_id = &permit_model.menu_id;
    if menu_id_map.contains_key(menu_id) {
      continue;
    }
    let menu_model = menu_dao::find_by_id(
      ctx,
      menu_id.to_string(),
      None,
    ).await?;
    if menu_model.is_none() {
      menu_id_map.insert(menu_id.to_string(), "".into());
      continue;
    }
    let menu_model = menu_model.unwrap();
    let route_path = menu_model.route_path;
    menu_id_map.insert(menu_id.to_string(), route_path);
  }
  
  let permits = permit_models.into_iter().map(|permit_model| {
    let menu_id = permit_model.menu_id;
    let route_path = menu_id_map.get(&menu_id).unwrap().clone();
    GetUsrPermits {
      id: permit_model.id,
      menu_id,
      code: permit_model.code,
      lbl: permit_model.lbl,
      route_path,
      is_visible: permit_model.is_visible == 1,
    }
  }).collect::<Vec<GetUsrPermits>>();
  
  Ok(permits)
}

pub async fn use_permit<'a>(
  ctx: &mut impl Ctx<'a>,
  route_path: String,
  code: String,
) -> Result<()> {
  let menu_model = menu_dao::find_one(
    ctx,
    MenuSearch {
      route_path: route_path.clone().into(),
      is_enabled: vec![1].into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  
  if menu_model.is_none() {
    return Ok(());
  }
  
  let menu_model = menu_model.unwrap();
  
  let auth_model = ctx.get_auth_model();
  
  if auth_model.is_none() {
    return Ok(());
  }
  
  let auth_model = auth_model.unwrap();
  
  let usr_id = auth_model.id;
  
  let usr_model = usr_dao::find_by_id(
    ctx,
    usr_id,
    None,
  ).await?;
  
  if usr_model.is_none() {
    return Ok(());
  }
  
  let usr_model = usr_model.unwrap();
  
  let role_ids = usr_model.role_ids;
  
  if role_ids.is_empty() {
    return Ok(());
  }
  
  let permit_model = permit_dao::find_one(
    ctx,
    PermitSearch {
      menu_id: vec![menu_model.id].into(),
      role_id: role_ids.into(),
      code: code.clone().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  
  if permit_model.is_none() {
    return Ok(());
  }
  
  let permit_model = permit_model.unwrap();
  
  if permit_model.is_visible == 1 {
    return Ok(());
  }
  
  let n_route = NRoute {
    route_path: route_path.into(),
  };
  
  let mut map: HashMap<String, String> = HashMap::with_capacity(2);
  map.insert("0".to_owned(), menu_model.lbl);
  map.insert("1".to_owned(), code);
  
  let err_msg = n_route.n(
    ctx,
    "{0} {1} 无权限".to_owned(),
    Some(map),
  ).await?;
  
  return Err(anyhow::anyhow!(err_msg));
}
