use anyhow::Result;

use crate::common::util::string::*;

use crate::common::context::{
  Ctx,
  QueryArgs,
  Options,
  CountModel,
  get_order_by_query,
  get_page_query,
};

use crate::common::gql::model::{PageInput, SortInput};

use crate::src::base::dict_detail::dict_detail_dao::get_dict;

use super::usr_model::*;

fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<UsrSearch>,
) -> String {
  let mut where_query = String::with_capacity(80 * 15 * 2);
  {
    let is_deleted = search.as_ref()
      .and_then(|item| item.is_deleted)
      .unwrap_or(0);
    where_query += &format!(" t.is_deleted = {}", args.push(is_deleted.into()));
  }
  {
    let id = match &search {
      Some(item) => &item.id,
      None => &None,
    };
    let id = match trim_opt(id) {
      None => None,
      Some(item) => match item.as_str() {
        "-" => None,
        _ => item.into(),
      },
    };
    if let Some(id) = id {
      where_query += &format!(" and t.id = {}", args.push(id.into()));
    }
  }
  {
    let ids: Vec<String> = match &search {
      Some(item) => item.ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !ids.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in ids {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and id in ({})", arg);
    }
  }
  {
    let tenant_id = {
      let tenant_id = match &search {
        Some(item) => &item.tenant_id,
        None => &None,
      };
      let tenant_id = match trim_opt(tenant_id) {
        None => ctx.get_auth_tenant_id(),
        Some(item) => match item.as_str() {
          "-" => None,
          _ => item.into(),
        },
      };
      tenant_id
    };
    if let Some(tenant_id) = tenant_id {
      where_query += &format!(" and t.tenant_id = {}", args.push(tenant_id.into()));
    }
  }
  {
    let id = match &search {
      Some(item) => item.id.clone(),
      None => None,
    };
    if let Some(id) = id {
      where_query += &format!(" and t.id = {}", args.push(id.into()));
    }
    let id_like = match &search {
      Some(item) => item.id.clone(),
      None => None,
    };
    if let Some(id_like) = id_like {
      where_query += &format!(" and t.id like {}", args.push((sql_like(&id_like) + "%").into()));
    }
  }
  {
    let lbl = match &search {
      Some(item) => item.lbl.clone(),
      None => None,
    };
    if let Some(lbl) = lbl {
      where_query += &format!(" and t.lbl = {}", args.push(lbl.into()));
    }
    let lbl_like = match &search {
      Some(item) => item.lbl.clone(),
      None => None,
    };
    if let Some(lbl_like) = lbl_like {
      where_query += &format!(" and t.lbl like {}", args.push((sql_like(&lbl_like) + "%").into()));
    }
  }
  {
    let username = match &search {
      Some(item) => item.username.clone(),
      None => None,
    };
    if let Some(username) = username {
      where_query += &format!(" and t.username = {}", args.push(username.into()));
    }
    let username_like = match &search {
      Some(item) => item.username.clone(),
      None => None,
    };
    if let Some(username_like) = username_like {
      where_query += &format!(" and t.username like {}", args.push((sql_like(&username_like) + "%").into()));
    }
  }
  {
    let default_dept_id: Vec<String> = match &search {
      Some(item) => item.default_dept_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !default_dept_id.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in default_dept_id {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and default_dept_id_lbl.id in ({})", arg);
    }
  }
  {
    let is_enabled: Vec<String> = match &search {
      Some(item) => item.is_enabled.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !is_enabled.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in is_enabled {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and t.is_enabled in ({})", arg);
    }
  }
  {
    let rem = match &search {
      Some(item) => item.rem.clone(),
      None => None,
    };
    if let Some(rem) = rem {
      where_query += &format!(" and t.rem = {}", args.push(rem.into()));
    }
    let rem_like = match &search {
      Some(item) => item.rem.clone(),
      None => None,
    };
    if let Some(rem_like) = rem_like {
      where_query += &format!(" and t.rem like {}", args.push((sql_like(&rem_like) + "%").into()));
    }
  }
  {
    let dept_ids: Vec<String> = match &search {
      Some(item) => item.dept_ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !dept_ids.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in dept_ids {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and dept.id in ({})", arg);
    }
  }
  {
    let is_locked: Vec<String> = match &search {
      Some(item) => item.is_locked.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !is_locked.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in is_locked {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and t.is_locked in ({})", arg);
    }
  }
  {
    let role_ids: Vec<String> = match &search {
      Some(item) => item.role_ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !role_ids.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in role_ids {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and role.id in ({})", arg);
    }
  }
  where_query
}

fn get_from_query() -> &'static str {
  let from_query = r#"base_usr t
    left join base_dept default_dept_id_lbl
      on default_dept_id_lbl.id = t.default_dept_id
    left join base_usr_dept
      on base_usr_dept.usr_id = t.id
      and base_usr_dept.is_deleted = 0
    left join base_dept
      on base_usr_dept.dept_id = base_dept.id
      and base_dept.is_deleted = 0
    left join (
      select
        json_arrayagg(base_dept.id) dept_ids,
        json_arrayagg(base_dept.lbl) dept_ids_lbl,
        base_usr.id usr_id
      from base_usr_dept
      inner join base_dept
        on base_dept.id = base_usr_dept.dept_id
        and base_dept.is_deleted = 0
      inner join base_usr
        on base_usr.id = base_usr_dept.usr_id
        and base_usr.is_deleted = 0
      where
      base_usr_dept.is_deleted = 0
      group by usr_id
    ) _dept
      on _dept.usr_id = t.id
    left join base_usr_role
      on base_usr_role.usr_id = t.id
      and base_usr_role.is_deleted = 0
    left join base_role
      on base_usr_role.role_id = base_role.id
      and base_role.is_deleted = 0
    left join (
      select
        json_arrayagg(base_role.id) role_ids,
        json_arrayagg(base_role.lbl) role_ids_lbl,
        base_usr.id usr_id
      from base_usr_role
      inner join base_role
        on base_role.id = base_usr_role.role_id
        and base_role.is_deleted = 0
      inner join base_usr
        on base_usr.id = base_usr_role.usr_id
        and base_usr.is_deleted = 0
      where
      base_usr_role.is_deleted = 0
      group by usr_id
    ) _role
      on _role.usr_id = t.id"#;
  from_query
}

/// 根据搜索条件和分页查找数据
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<UsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  let table = "base_usr";
  let _method = "find_all";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query();
  let where_query = get_where_query(ctx, &mut args, search);
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select
      t.*
      ,default_dept_id_lbl.lbl default_dept_id_lbl
      ,max(dept_ids) dept_ids
      ,max(dept_ids_lbl) dept_ids_lbl
      ,max(role_ids) role_ids
      ,max(role_ids_lbl) role_ids_lbl
    from
      {from_query}
    where
      {where_query}
    group by t.id{order_by_query}{page_query}
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let mut res: Vec<UsrModel> = ctx.query(
    sql,
    args,
    options,
  ).await?;
  
  let dict_vec = get_dict(ctx, &vec![
    "is_enabled",
    "is_locked",
  ]).await?;
  
  let is_enabled_dict = &dict_vec[0];
  let is_locked_dict = &dict_vec[1];
  
  for model in &mut res {
    
    // 密码
    model.password = "".to_owned();
    
    // 启用
    model.is_enabled_lbl = {
      is_enabled_dict.iter()
        .find(|item| item.val == model.is_enabled.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_enabled.to_string())
    };
    
    // 锁定
    model.is_locked_lbl = {
      is_locked_dict.iter()
        .find(|item| item.val == model.is_locked.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_locked.to_string())
    };
    
  }
  
  Ok(res)
}

pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<UsrSearch>,
  options: Option<Options>,
) -> Result<i64> {
  let table = "base_usr";
  let _method = "find_count";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query();
  let where_query = get_where_query(ctx, &mut args, search);
  
  let sql = format!(r#"
    select
      count(1) total
    from
      (
        select
          1
        from
          {from_query}
        where
          {where_query}
        group by t.id
      ) t
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let res: Option<CountModel> = ctx.query_one(
    sql,
    args,
    options,
  ).await?;
  
  let total = res
    .map(|item| item.total)
    .unwrap_or_default()
    ;
  
  Ok(total)
}

/// 获取字段对应的国家化后的名称
pub async fn get_field_comments() -> Result<UsrFieldComment> {
  let field_comments = UsrFieldComment {
    lbl: "名称".to_owned(),
    username: "用户名".to_owned(),
    default_dept_id: "默认部门".to_owned(),
    default_dept_id_lbl: "默认部门".to_owned(),
    is_enabled: "启用".to_owned(),
    is_enabled_lbl: "启用".to_owned(),
    rem: "备注".to_owned(),
    dept_ids: "拥有部门".to_owned(),
    dept_ids_lbl: "拥有部门".to_owned(),
    is_locked: "锁定".to_owned(),
    is_locked_lbl: "锁定".to_owned(),
    role_ids: "拥有角色".to_owned(),
    role_ids_lbl: "拥有角色".to_owned(),
  };
  Ok(field_comments)
}

/// 获得表的唯一字段名列表
pub fn get_unique_keys() -> Vec<&'static str> {
  let unique_keys = vec![
    "lbl",
  ];
  unique_keys
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<UsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  let page = PageInput {
    pg_offset: 0.into(),
    pg_size: 1.into(),
  }.into();
  
  let res = find_all(
    ctx,
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<UsrModel> = res.into_iter().next();
  
  Ok(model)
}
