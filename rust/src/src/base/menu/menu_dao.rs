use anyhow::Result;
use crate::common::context::{
  query,
  get_auth_model,
  get_auth_tenant_id,
  QueryArgs,
  Options,
};

use super::menu_model::GetMenus;

async fn find_menus() -> Result<Vec<GetMenus>> {
  
  let table = "base_menu";
  
  let mut args = QueryArgs::new();
  
  let mut where_query = String::new();
  
  let tenant_id = get_auth_tenant_id();
  if let Some(tenant_id) = tenant_id {
    where_query.push_str(" and base_tenant_menu.tenant_id = ?");
    args.push(tenant_id.into());
  }
  
  let auth_model = get_auth_model();
  if let Some(auth_model) = auth_model {
    where_query.push_str(" and base_usr_role.usr_id = ?");
    args.push(auth_model.id.into());
  }
  
  let sql = format!(
    r#"select
      t.id,
      t.parent_id,
      t.lbl,
      t.route_path,
      t.route_query
    from {table} t
    inner join base_tenant_menu
      on t.id = base_tenant_menu.menu_id
      and base_tenant_menu.is_deleted = 0
    inner join base_tenant
      on base_tenant_menu.tenant_id = base_tenant.id
      and base_tenant.is_deleted = 0
      and base_tenant.is_enabled = 1
    inner join base_role_menu
      on t.id = base_role_menu.menu_id
      and base_role_menu.is_deleted = 0
    inner join base_usr_role
      on base_role_menu.role_id = base_usr_role.role_id
      and base_usr_role.is_deleted = 0
    where
      t.is_deleted = 0
      and t.is_enabled = 1
      {where_query}
    order by t.order_by asc"#,
  );
  
  let args = args.into();
  
  let options = Options::new();
  
  let options = options.set_is_debug(false);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let res: Vec<GetMenus> = query(
    sql,
    args,
    options,
  ).await?;
  
  Ok(res)
}

// fn tmp_fn(
//   parent_id: Option<String>,
//   all_models: Vec<GetMenus>,
//   menus: &mut Vec<GetMenus>,
// ) {
//   let mut models: Vec<GetMenus> = all_models.clone().into_iter()
//     .filter(|item| {
//       if let Some(parent_id) = parent_id.clone() {
//         item.parent_id == parent_id
//       } else {
//         item.parent_id == ""
//       }
//     })
//     .collect::<Vec<GetMenus>>();
//   if parent_id.is_none() {
//     *menus = models.clone();
//   } else {
//     let parent_id = parent_id.unwrap();
//     models = models.clone().into_iter()
//       .filter(|item| -> bool {
//         let id = item.id.to_string();
//         !menus.iter().any(|menu| menu.parent_id == id)
//       })
//       .collect::<Vec<GetMenus>>();
//     let parent = menus.iter_mut()
//       .find(|item| {
//         item.id.to_string() == parent_id
//       });
//     if parent.is_some() {
//       let parent = parent.unwrap();
//       parent.children = models.clone();
//     }
//   }
//   for item in &models {
//     tmp_fn(Some(item.id.to_string()), all_models.clone(), menus);
//   }
// }

/// 首页获取菜单列表
pub async fn get_menus() -> Result<Vec<GetMenus>> {
  let all_models: Vec<GetMenus> = find_menus().await?;
  // let mut menus: Vec<GetMenus> = vec![];
  // tmp_fn(None, all_models, &mut menus);
  // Ok(menus)
  Ok(all_models)
}