use color_eyre::eyre::Result;
use crate::common::context::{
  query,
  get_auth_id,
  get_auth_tenant_id,
  QueryArgs,
  Options,
};

use super::menu_model::GetMenus;

use crate::r#gen::base::usr::usr_dao::{
  find_by_id_usr,
  validate_option_usr,
  validate_is_enabled_usr,
};

use crate::common::lang::lang_dao::get_lang_id;
use crate::common::i18n::i18n_dao::get_server_i18n_enable;

async fn find_menus() -> Result<Vec<GetMenus>> {
  
  let usr_id = get_auth_id();
  if usr_id.is_none() {
    return Ok(vec![]);
  }
  let usr_id = usr_id.unwrap();
  
  let server_i18n_enable = get_server_i18n_enable();
  
  let mut args = QueryArgs::new();
  let mut lang_join = "";
  let mut lang_select = "";
  
  if server_i18n_enable {
    let lang_id = get_lang_id().await?;
    if let Some(lang_id) = lang_id {
      lang_join = r#"
      left join base_menu_lang
        on t.id=base_menu_lang.menu_id
        and base_menu_lang.lang_id=?
      "#;
      args.push(lang_id.into());
      lang_select = "base_menu_lang.lbl as lbl_lang,";
    }
  } else {
    lang_select = "null as lbl_lang,";
  }
  let lang_join = lang_join;
  let lang_select = lang_select;
  
  let mut where_query = String::new();
  
  let tenant_id = get_auth_tenant_id();
  if let Some(tenant_id) = tenant_id {
    where_query.push_str(" and base_tenant_menu.tenant_id=?");
    args.push(tenant_id.into());
  }
  
  let options = Options::new();
  let options = options.set_is_debug(Some(false));
  let options = Some(options);
  
  let usr_model = validate_option_usr(
    find_by_id_usr(
      usr_id.clone(),
      options,
    ).await?,
  ).await?;
  validate_is_enabled_usr(&usr_model).await?;
  
  let username = usr_model.username;
  
  if username != "admin" {
    where_query.push_str(" and base_usr_role.usr_id=?");
    args.push(usr_id.into());
  }
  
  let sql = format!(
    r#"select distinct
      t.id,
      t.parent_id,
      t.lbl,
      t.route_path,
      t.route_query,
      {lang_select}
      t.order_by
    from base_menu t
    inner join base_tenant_menu
      on t.id = base_tenant_menu.menu_id
      and base_tenant_menu.is_deleted=0
    inner join base_tenant
      on base_tenant_menu.tenant_id=base_tenant.id
      and base_tenant.is_deleted=0
      and base_tenant.is_enabled=1
    inner join base_role_menu
      on t.id=base_role_menu.menu_id
      and base_role_menu.is_deleted=0
    inner join base_usr_role
      on base_role_menu.role_id=base_usr_role.role_id
      and base_usr_role.is_deleted=0
    {lang_join}
    where
      t.is_deleted=0
      and t.is_enabled=1
      {where_query}"#,
  );
  
  let args = args.into();
  
  let options = Options::new();
  
  let options = options.set_is_debug(Some(false));
  
  let options = options.set_cache_key("base_menu._getMenus", &sql, &args);
  
  let options = Some(options);
  
  let mut res: Vec<GetMenus> = query(
    sql,
    args,
    options,
  ).await?;
  
  res.sort_by(|a, b| a.order_by.cmp(&b.order_by));
  
  if server_i18n_enable {
    for item in &mut res {
      if !item.lbl_lang.is_empty() {
        item.lbl = item.lbl_lang.clone();
      }
    }
  }
  
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
