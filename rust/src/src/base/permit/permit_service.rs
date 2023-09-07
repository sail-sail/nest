use std::collections::HashMap;

use anyhow::Result;
use crate::common::context::Ctx;

// use crate::src::base::i18n::i18n_dao::ns;

use crate::gen::base::menu::menu_dao::find_by_id as find_by_id_menu;
// use crate::gen::base::menu::menu_model::MenuSearch;

use super::permit_model::GetUsrPermits;

use crate::gen::base::usr::usr_dao;

use crate::gen::base::role::role_dao::find_all as find_all_role;
use crate::gen::base::role::role_model::RoleSearch;

use crate::gen::base::permit::permit_dao::find_all as find_all_permit;
use crate::gen::base::permit::permit_model::PermitSearch;
use crate::gen::base::permit::permit_model::PermitModel;

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
  
  let role_models = find_all_role(
    ctx,
    RoleSearch {
      ids: role_ids.into(),
      is_enabled: vec![1].into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  let mut permit_ids = Vec::<String>::new();
  for role_model in role_models {
    for permit_id in role_model.permit_ids {
      if permit_ids.contains(&permit_id) {
        continue;
      }
      permit_ids.push(permit_id);
    }
  }
  let permit_len = permit_ids.len();
  
  // 切分成多个批次查询
  let batch_size = 100;
  let mut batch_count = permit_len / batch_size;
  if permit_len % batch_size != 0 {
    batch_count += 1;
  }
  let batch_count = batch_count;
  let mut permit_ids_arr = Vec::<Vec<String>>::with_capacity(batch_count);
  for i in 0..batch_count {
    let start = i * batch_size;
    let mut end = (i + 1) * batch_size;
    if end > permit_len {
      end = permit_len;
    }
    let end = end;
    let permit_ids = permit_ids[start..end].to_vec();
    permit_ids_arr.push(permit_ids);
  }
  let permit_ids_arr = permit_ids_arr;
  
  let mut permit_models: Vec<PermitModel> = Vec::with_capacity(permit_len);
  for permit_ids in permit_ids_arr {
    let mut permit_models_tmp = find_all_permit(
      ctx,
      PermitSearch {
        ids: permit_ids.into(),
        ..Default::default()
      }.into(),
      None,
      None,
      None,
    ).await?;
    permit_models.append(&mut permit_models_tmp);
  }
  let permit_models = permit_models;
  
  let mut menu_id_map = HashMap::<String, String>::with_capacity(permit_len);
  
  for permit_model in permit_models.iter() {
    let menu_id = permit_model.menu_id.clone();
    if menu_id_map.contains_key(&menu_id) {
      continue;
    }
    if menu_id == "" {
      menu_id_map.insert(menu_id.clone(), "".to_owned());
    }
    
    let menu_model = find_by_id_menu(
      ctx,
      menu_id.clone(),
      None,
    ).await?;
    
    if menu_model.is_none() {
      menu_id_map.insert(menu_id.clone(), "".to_owned());
      continue;
    }
    let menu_model = menu_model.unwrap();
    
    let route_path = menu_model.route_path;
    menu_id_map.insert(menu_id, route_path);
  }
  
  let permits: Vec<GetUsrPermits> = permit_models.into_iter()
    .map(|item| {
      let menu_id = item.menu_id;
      let route_path: Option<&String> = menu_id_map.get(menu_id.as_str());
      let route_path: String = route_path
        .map_or_else(
          || "".to_owned(),
          |item| item.to_owned()
        );
      GetUsrPermits {
        id: item.id,
        menu_id,
        route_path,
        code: item.code,
        lbl: item.lbl,
      }
    })
    .collect();
  
  Ok(permits)
}

///// 后端按钮权限校验
// pub async fn use_permit<'a>(
//   ctx: &mut impl Ctx<'a>,
//   route_path: String,
//   code: String,
// ) -> Result<()> {
//   let menu_model = find_one_menu(
//     ctx,
//     MenuSearch {
//       route_path: route_path.clone().into(),
//       is_enabled: vec![1].into(),
//       ..Default::default()
//     }.into(),
//     None,
//     None,
//   ).await?;
  
//   if menu_model.is_none() {
//     return Ok(());
//   }
  
//   let menu_model = menu_model.unwrap();
  
//   let auth_model = ctx.get_auth_model();
  
//   if auth_model.is_none() {
//     let err_msg = ns(
//       ctx,
//       "无权限".to_owned(),
//       None,
//     ).await?;
//     return Err(anyhow::anyhow!(err_msg));
//   }
  
//   let auth_model = auth_model.unwrap();
  
//   let usr_id = auth_model.id;
  
//   let usr_model = usr_dao::find_by_id(
//     ctx,
//     usr_id,
//     None,
//   ).await?;
  
//   if usr_model.is_none() {
//     let err_msg = ns(
//       ctx,
//       "无权限".to_owned(),
//       None,
//     ).await?;
//     return Err(anyhow::anyhow!(err_msg));
//   }
  
//   let usr_model = usr_model.unwrap();
  
//   if usr_model.username == "admin" {
//     return Ok(());
//   }
  
//   let role_ids = usr_model.role_ids;
  
//   if role_ids.is_empty() {
//     let err_msg = ns(
//       ctx,
//       "无权限".to_owned(),
//       None,
//     ).await?;
//     return Err(anyhow::anyhow!(err_msg));
//   }
  
//   let role_models = find_all_role(
//     ctx,
//     RoleSearch {
//       ids: role_ids.into(),
//       is_enabled: vec![1].into(),
//       ..Default::default()
//     }.into(),
//     None,
//     None,
//     None,
//   ).await?;
  
//   // 过滤掉重复的 permit_ids
//   let mut permit_ids = Vec::<String>::new();
//   for role_model in role_models.into_iter() {
//     for permit_id in role_model.permit_ids.into_iter() {
//       if permit_ids.contains(&permit_id) {
//         continue;
//       }
//       permit_ids.push(permit_id);
//     }
//   }
//   let permit_ids = permit_ids;
  
//   // 切分成多个批次查询
//   let mut permit_ids_arr = Vec::<Vec<String>>::new();
//   let batch_size = 100;
//   let batch_count = permit_ids.len() / batch_size;
//   for i in 0..batch_count {
//     let start = i * batch_size;
//     let end = (i + 1) * batch_size;
//     let permit_ids = permit_ids[start..end].to_vec();
//     permit_ids_arr.push(permit_ids);
//   }
//   let menu_id = menu_model.id;
//   for permit_ids in permit_ids_arr.into_iter() {
//     let permit_model = find_one_permit(
//       ctx,
//       PermitSearch {
//         ids: permit_ids.into(),
//         menu_id: vec![menu_id.clone()].into(),
//         code: code.clone().into(),
//         ..Default::default()
//       }.into(),
//       None,
//       None,
//     ).await?;
//     if permit_model.is_some() {
//       return Ok(());
//     }
//   }
  
//   let mut map: HashMap<String, String> = HashMap::with_capacity(2);
//   map.insert("0".to_owned(), menu_model.lbl);
//   map.insert("1".to_owned(), code);
  
//   let err_msg = ns(
//     ctx,
//     "{0} {1} 无权限".to_owned(),
//     Some(map),
//   ).await?;
  
//   return Err(anyhow::anyhow!(err_msg));
// }
