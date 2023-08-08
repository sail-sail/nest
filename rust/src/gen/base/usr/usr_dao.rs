use anyhow::Result;
use tracing::info;

use crate::common::auth::auth_dao::get_password;
use crate::common::util::string::*;
use crate::common::util::dao::{many2many_update, ManyOpts};

#[allow(unused_imports)]
use crate::common::context::{
  Ctx,
  QueryArgs,
  Options,
  CountModel,
  UniqueType,
  SrvErr,
  get_short_uuid,
  get_order_by_query,
  get_page_query,
};

use crate::src::base::i18n::i18n_dao;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use crate::src::base::dict_detail::dict_detail_dao::get_dict;

use super::usr_model::*;

#[allow(unused_variables)]
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
    where_query += " t.is_deleted = ?";
    args.push(is_deleted.into());
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
      where_query += " and t.id = ?";
      args.push(id.into());
    }
  }
  {
    let ids: Vec<String> = match &search {
      Some(item) => item.ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !ids.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(ids.len());
        for id in ids {
          args.push(id.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.id in ({})", arg);
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
      where_query += " and t.tenant_id = ?";
      args.push(tenant_id.into());
    }
  }
  {
    let img = match &search {
      Some(item) => item.img.clone(),
      None => None,
    };
    if let Some(img) = img {
      where_query += &format!(" and t.img = {}", args.push(img.into()));
    }
    let img_like = match &search {
      Some(item) => item.img_like.clone(),
      None => None,
    };
    if let Some(img_like) = img_like {
      where_query += &format!(" and t.img like {}", args.push((sql_like(&img_like) + "%").into()));
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
      Some(item) => item.lbl_like.clone(),
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
      Some(item) => item.username_like.clone(),
      None => None,
    };
    if let Some(username_like) = username_like {
      where_query += &format!(" and t.username like {}", args.push((sql_like(&username_like) + "%").into()));
    }
  }
  {
    let default_org_id: Vec<String> = match &search {
      Some(item) => item.default_org_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !default_org_id.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(default_org_id.len());
        for item in default_org_id {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and default_org_id_lbl.id in ({})", arg);
    }
  }
  {
    let default_org_id_is_null: bool = match &search {
      Some(item) => item.default_org_id_is_null.unwrap_or(false),
      None => false,
    };
    if default_org_id_is_null {
      where_query += &format!(" and default_org_id_lbl.id is null");
    }
  }
  {
    let is_locked: Vec<u8> = match &search {
      Some(item) => item.is_locked.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !is_locked.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(is_locked.len());
        for item in is_locked {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.is_locked in ({})", arg);
    }
  }
  {
    let is_enabled: Vec<u8> = match &search {
      Some(item) => item.is_enabled.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !is_enabled.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(is_enabled.len());
        for item in is_enabled {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.is_enabled in ({})", arg);
    }
  }
  {
    let org_ids: Vec<String> = match &search {
      Some(item) => item.org_ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !org_ids.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(org_ids.len());
        for item in org_ids {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and base_org.id in ({})", arg);
    }
  }
  {
    let org_ids_is_null: bool = match &search {
      Some(item) => item.org_ids_is_null.unwrap_or(false),
      None => false,
    };
    if org_ids_is_null {
      where_query += &format!(" and org_ids_lbl.id is null");
    }
  }
  {
    let role_ids: Vec<String> = match &search {
      Some(item) => item.role_ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !role_ids.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(role_ids.len());
        for item in role_ids {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and base_role.id in ({})", arg);
    }
  }
  {
    let role_ids_is_null: bool = match &search {
      Some(item) => item.role_ids_is_null.unwrap_or(false),
      None => false,
    };
    if role_ids_is_null {
      where_query += &format!(" and role_ids_lbl.id is null");
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
      Some(item) => item.rem_like.clone(),
      None => None,
    };
    if let Some(rem_like) = rem_like {
      where_query += &format!(" and t.rem like {}", args.push((sql_like(&rem_like) + "%").into()));
    }
  }
  where_query
}

fn get_from_query() -> &'static str {
  let from_query = r#"base_usr t
    left join base_org default_org_id_lbl
      on default_org_id_lbl.id = t.default_org_id
    left join base_usr_org
      on base_usr_org.usr_id = t.id
      and base_usr_org.is_deleted = 0
    left join base_org
      on base_usr_org.org_id = base_org.id
      and base_org.is_deleted = 0
    left join (
      select
        json_arrayagg(base_org.id) org_ids,
        json_arrayagg(base_org.lbl) org_ids_lbl,
        base_usr.id usr_id
      from base_usr_org
      inner join base_org
        on base_org.id = base_usr_org.org_id
        and base_org.is_deleted = 0
      inner join base_usr
        on base_usr.id = base_usr_org.usr_id
      where
        base_usr_org.is_deleted = 0
      group by usr_id
    ) _org
      on _org.usr_id = t.id
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
      where
        base_usr_role.is_deleted = 0
      group by usr_id
    ) _role
      on _role.usr_id = t.id"#;
  from_query
}

/// 根据搜索条件和分页查找数据
#[allow(unused_variables)]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<UsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  #[allow(unused_variables)]
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
      ,default_org_id_lbl.lbl default_org_id_lbl
      ,max(org_ids) org_ids
      ,max(org_ids_lbl) org_ids_lbl
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
    "is_locked",
    "is_enabled",
  ]).await?;
  
  let is_locked_dict = &dict_vec[0];
  let is_enabled_dict = &dict_vec[1];
  
  for model in &mut res {
    
    // 锁定
    model.is_locked_lbl = {
      is_locked_dict.iter()
        .find(|item| item.val == model.is_locked.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_locked.to_string())
    };
    
    // 启用
    model.is_enabled_lbl = {
      is_enabled_dict.iter()
        .find(|item| item.val == model.is_enabled.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_enabled.to_string())
    };
    
  }
  
  Ok(res)
}

/// 根据搜索条件查询数据总数
pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<UsrSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
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
pub async fn get_field_comments<'a>(
  ctx: &mut impl Ctx<'a>,
  _options: Option<Options>,
) -> Result<UsrFieldComment> {
  
  let n_route = i18n_dao::NRoute {
    route_path: "/base/usr".to_owned().into(),
  };
  
  let field_comments = UsrFieldComment {
    img: n_route.n(ctx, "头像".to_owned(), None).await?,
    lbl: n_route.n(ctx, "名称".to_owned(), None).await?,
    username: n_route.n(ctx, "用户名".to_owned(), None).await?,
    default_org_id: n_route.n(ctx, "默认组织".to_owned(), None).await?,
    default_org_id_lbl: n_route.n(ctx, "默认组织".to_owned(), None).await?,
    is_locked: n_route.n(ctx, "锁定".to_owned(), None).await?,
    is_locked_lbl: n_route.n(ctx, "锁定".to_owned(), None).await?,
    is_enabled: n_route.n(ctx, "启用".to_owned(), None).await?,
    is_enabled_lbl: n_route.n(ctx, "启用".to_owned(), None).await?,
    org_ids: n_route.n(ctx, "拥有组织".to_owned(), None).await?,
    org_ids_lbl: n_route.n(ctx, "拥有组织".to_owned(), None).await?,
    role_ids: n_route.n(ctx, "拥有角色".to_owned(), None).await?,
    role_ids_lbl: n_route.n(ctx, "拥有角色".to_owned(), None).await?,
    rem: n_route.n(ctx, "备注".to_owned(), None).await?,
  };
  Ok(field_comments)
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

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  let search = UsrSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = find_one(
    ctx,
    search,
    None,
    options,
  ).await?;
  
  Ok(res)
}

/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  search: UsrSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  if let Some(id) = search.id {
    let model = find_by_id(
      ctx,
      id.into(),
      None,
    ).await?;
    if let Some(model) = model {
      return Ok(vec![model]);
    }
    return Ok(vec![]);
  }
  
  let mut models: Vec<UsrModel> = vec![];
  
  let mut models_tmp = {
    if
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = UsrSearch {
      lbl: search.lbl,
      ..Default::default()
    };
    
    find_all(
      ctx,
      search.into(),
      None,
      None,
      None,
    ).await?
  };
  models.append(&mut models_tmp);
  
  Ok(models)
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
fn equals_by_unique(
  input: &UsrInput,
  model: &UsrModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.lbl.as_ref().is_some() && input.lbl.as_ref().unwrap() == &model.lbl
  {
    return true;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  input: UsrInput,
  model: UsrModel,
  unique_type: UniqueType,
) -> Result<Option<String>> {
  let is_equals = equals_by_unique(
    &input,
    &model,
  );
  if !is_equals {
    return Ok(None);
  }
  if unique_type == UniqueType::Ignore {
    return Ok(None);
  }
  if unique_type == UniqueType::Update {
    let id = update_by_id(
      ctx,
      model.id.clone(),
      input,
      None,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = i18n_dao::ns(
      ctx,
      "记录已经存在".to_owned(),
      None,
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  Ok(None)
}

#[allow(unused_variables)]
pub async fn set_id_by_lbl<'a>(
  ctx: &mut impl Ctx<'a>,
  input: UsrInput,
) -> Result<UsrInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(ctx, &vec![
    "is_locked",
    "is_enabled",
  ]).await?;
  
  // 锁定
  if input.is_locked.is_none() {
    let is_locked_dict = &dict_vec[0];
    if let Some(is_locked_lbl) = input.is_locked_lbl.clone() {
      input.is_locked = is_locked_dict.into_iter()
        .find(|item| {
          item.lbl == is_locked_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        })
        .into();
    }
  }
  
  // 启用
  if input.is_enabled.is_none() {
    let is_enabled_dict = &dict_vec[1];
    if let Some(is_enabled_lbl) = input.is_enabled_lbl.clone() {
      input.is_enabled = is_enabled_dict.into_iter()
        .find(|item| {
          item.lbl == is_enabled_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        })
        .into();
    }
  }
  
  // 默认组织
  if input.default_org_id.is_none() {
    if is_not_empty_opt(&input.default_org_id_lbl) && input.default_org_id.is_none() {
      input.default_org_id_lbl = input.default_org_id_lbl.map(|item| 
        item.trim().to_owned()
      );
      let model = crate::gen::base::org::org_dao::find_one(
        ctx,
        crate::gen::base::org::org_model::OrgSearch {
          lbl: input.default_org_id_lbl.clone(),
          ..Default::default()
        }.into(),
        None,
        None,
      ).await?;
      if let Some(model) = model {
        input.default_org_id = model.id.into();
      }
    }
  }
  
  // 拥有组织
  if input.org_ids.is_none() {
    if input.org_ids_lbl.is_some() && input.org_ids.is_none() {
      input.org_ids_lbl = input.org_ids_lbl.map(|item| 
        item.into_iter()
          .map(|item| item.trim().to_owned())
          .collect::<Vec<String>>()
      );
      let mut models = vec![];
      for lbl in input.org_ids_lbl.clone().unwrap_or_default() {
        let model = crate::gen::base::org::org_dao::find_one(
          ctx,
          crate::gen::base::org::org_model::OrgSearch {
            lbl: lbl.into(),
            ..Default::default()
          }.into(),
          None,
          None,
        ).await?;
        if let Some(model) = model {
          models.push(model);
        }
      }
      if !models.is_empty() {
        input.org_ids = models.into_iter()
          .map(|item| item.id)
          .collect::<Vec<String>>()
          .into();
      }
    }
  }
  
  // 拥有角色
  if input.role_ids.is_none() {
    if input.role_ids_lbl.is_some() && input.role_ids.is_none() {
      input.role_ids_lbl = input.role_ids_lbl.map(|item| 
        item.into_iter()
          .map(|item| item.trim().to_owned())
          .collect::<Vec<String>>()
      );
      let mut models = vec![];
      for lbl in input.role_ids_lbl.clone().unwrap_or_default() {
        let model = crate::gen::base::role::role_dao::find_one(
          ctx,
          crate::gen::base::role::role_model::RoleSearch {
            lbl: lbl.into(),
            ..Default::default()
          }.into(),
          None,
          None,
        ).await?;
        if let Some(model) = model {
          models.push(model);
        }
      }
      if !models.is_empty() {
        input.role_ids = models.into_iter()
          .map(|item| item.id)
          .collect::<Vec<String>>()
          .into();
      }
    }
  }
  
  Ok(input)
}

/// 创建数据
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  mut input: UsrInput,
  options: Option<Options>,
) -> Result<String> {
  
  let table = "base_usr";
  let _method = "create";
  
  let now = ctx.get_now();
  
  input = set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  let old_models = find_by_unique(
    ctx,
    input.clone().into(),
    None,
    None,
  ).await?;
  
  if old_models.len() > 0 {
    
    let unique_type = options.as_ref()
      .map(|item|
        item.get_unique_type()
          .map(|item| item.clone())
          .unwrap_or(UniqueType::Throw)
      )
      .unwrap_or(UniqueType::Throw);
    
    let mut id: Option<String> = None;
    
    for old_model in old_models {
      
      id = check_by_unique(
        ctx,
        input.clone(),
        old_model,
        unique_type,
      ).await?;
      
      if id.is_some() {
        break;
      }
    }
    
    match id {
      Some(id) => return Ok(id),
      None => {},
    }
  }
  
  let id = get_short_uuid();
  
  if input.id.is_none() {
    input.id = Some(id.clone().into());
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "id,create_time".to_owned();
  
  let mut sql_values = "?,?".to_owned();
  
  args.push(id.clone().into());
  args.push(now.into());
  
  if let Some(tenant_id) = ctx.get_auth_tenant_id() {
    sql_fields += ",tenant_id";
    sql_values += ",?";
    args.push(tenant_id.into());
  }
  
  if let Some(auth_model) = ctx.get_auth_model() {
    let usr_id = auth_model.id;
    sql_fields += ",create_usr_id";
    sql_values += ",?";
    args.push(usr_id.into());
  }
  // 头像
  if let Some(img) = input.img {
    sql_fields += ",img";
    sql_values += ",?";
    args.push(img.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    sql_fields += ",lbl";
    sql_values += ",?";
    args.push(lbl.into());
  }
  // 用户名
  if let Some(username) = input.username {
    sql_fields += ",username";
    sql_values += ",?";
    args.push(username.into());
  }
  // 密码
  if let Some(password) = input.password {
    sql_fields += ",password";
    sql_values += ",?";
    args.push(get_password(password)?.into());
  }
  // 默认组织
  if let Some(default_org_id) = input.default_org_id {
    sql_fields += ",default_org_id";
    sql_values += ",?";
    args.push(default_org_id.into());
  }
  // 锁定
  if let Some(is_locked) = input.is_locked {
    sql_fields += ",is_locked";
    sql_values += ",?";
    args.push(is_locked.into());
  }
  // 启用
  if let Some(is_enabled) = input.is_enabled {
    sql_fields += ",is_enabled";
    sql_values += ",?";
    args.push(is_enabled.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    sql_fields += ",rem";
    sql_values += ",?";
    args.push(rem.into());
  }
  
  let sql = format!(
    "insert into {} ({}) values ({})",
    table,
    sql_fields,
    sql_values,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_foreign_tables());
  
  let options = options.into();
  
  ctx.execute(
    sql,
    args,
    options,
  ).await?;
  
  // 拥有组织
  if let Some(org_ids) = input.org_ids {
    many2many_update(
      ctx,
      id.clone(),
      org_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "usr_org",
        column1: "usr_id",
        column2: "org_id",
      },
    ).await?;
  }
  
  // 拥有角色
  if let Some(role_ids) = input.role_ids {
    many2many_update(
      ctx,
      id.clone(),
      role_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "usr_role",
        column1: "usr_id",
        column2: "role_id",
      },
    ).await?;
  }
  
  Ok(id)
}

/// 根据id修改租户id
pub async fn update_tenant_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  tenant_id: String,
  options: Option<Options>,
) -> Result<u64> {
  let table = "base_usr";
  let _method = "update_tenant_by_id";
  
  let mut args = QueryArgs::new();
  
  let sql_fields = "tenant_id = ?,update_time = ?";
  args.push(tenant_id.into());
  args.push(ctx.get_now().into());
  
  let sql_where = "id = ?";
  args.push(id.into());
  
  let sql = format!(
    "update {} set {} where {}",
    table,
    sql_fields,
    sql_where,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.into();
  
  let num = ctx.execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据id修改数据
pub async fn update_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  mut input: UsrInput,
  options: Option<Options>,
) -> Result<String> {
  
  let old_model = find_by_id(
    ctx,
    id.clone(),
    None,
  ).await?;
  
  if old_model.is_none() {
    let err_msg = i18n_dao::ns(
      ctx,
      "数据已删除".to_owned(),
      None,
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  
  input = set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique(
      ctx,
      input.into(),
      None,
      None,
    ).await?;
    
    let models: Vec<UsrModel> = models.into_iter()
      .filter(|item| 
        &item.id != &id
      )
      .collect();
    
    if models.len() > 0 {
      let err_msg = i18n_dao::ns(
        ctx,
        "数据已经存在".to_owned(),
        None,
      ).await?;
      return Err(SrvErr::msg(err_msg).into());
    }
  }
  
  let table = "base_usr";
  let _method = "update_by_id";
  
  let now = ctx.get_now();
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "update_time = ?".to_owned();
  args.push(now.into());
  
  let mut field_num: usize = 0;
  // 头像
  if let Some(img) = input.img {
    field_num += 1;
    sql_fields += ",img = ?";
    args.push(img.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += ",lbl = ?";
    args.push(lbl.into());
  }
  // 用户名
  if let Some(username) = input.username {
    field_num += 1;
    sql_fields += ",username = ?";
    args.push(username.into());
  }
  // 密码
  if let Some(password) = input.password {
    field_num += 1;
    sql_fields += ",password = ?";
    args.push(get_password(password)?.into());
  }
  // 默认组织
  if let Some(default_org_id) = input.default_org_id {
    field_num += 1;
    sql_fields += ",default_org_id = ?";
    args.push(default_org_id.into());
  }
  // 锁定
  if let Some(is_locked) = input.is_locked {
    field_num += 1;
    sql_fields += ",is_locked = ?";
    args.push(is_locked.into());
  }
  // 启用
  if let Some(is_enabled) = input.is_enabled {
    field_num += 1;
    sql_fields += ",is_enabled = ?";
    args.push(is_enabled.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    field_num += 1;
    sql_fields += ",rem = ?";
    args.push(rem.into());
  }
  
  if field_num > 0 {
    
    if let Some(auth_model) = ctx.get_auth_model() {
      let usr_id = auth_model.id;
      sql_fields += ",update_usr_id = ?";
      args.push(usr_id.into());
    }
    
    let sql_where = "id = ?";
    args.push(id.clone().into());
    
    let sql = format!(
      "update {} set {} where {} limit 1",
      table,
      sql_fields,
      sql_where,
    );
    
    let args = args.into();
    
    let options = Options::from(options);
    
    let options = options.set_is_debug(false);
    
    let options = options.set_del_cache_key1s(get_foreign_tables());
    
    let options = options.into();
    
    ctx.execute(
      sql,
      args,
      options,
    ).await?;
    
  }
  
  let mut field_num = 0;
  
  // 拥有组织
  if let Some(org_ids) = input.org_ids {
    many2many_update(
      ctx,
      id.clone(),
      org_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "usr_org",
        column1: "usr_id",
        column2: "org_id",
      },
    ).await?;
    
    field_num += 1;
  }
  
  // 拥有角色
  if let Some(role_ids) = input.role_ids {
    many2many_update(
      ctx,
      id.clone(),
      role_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "usr_role",
        column1: "usr_id",
        column2: "role_id",
      },
    ).await?;
    
    field_num += 1;
  }
  
  if field_num > 0 {
    let options = Options::from(None);
    let options = options.set_del_cache_key1s(get_foreign_tables());
    if let Some(del_cache_key1s) = options.get_del_cache_key1s() {
      crate::common::cache::cache_dao::del_caches(del_cache_key1s).await?;
    }
  }
  
  Ok(id)
}

/// 获取外键关联表, 第一个是主表
#[allow(dead_code)]
fn get_foreign_tables() -> Vec<&'static str> {
  let table = "base_usr";
  vec![
    table,
    "base_org",
    "base_usr_role",
    "base_role",
  ]
}

/// 根据 ids 删除数据
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
  let _method = "delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=1,delete_time=? where id=? limit 1",
      table,
    );
    
    args.push(ctx.get_now().into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.set_del_cache_key1s(get_foreign_tables());
    
    let options = options.into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ID 查找是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let model = find_by_id(ctx, id, options).await?;
  
  let is_enabled = {
    if let Some(model) = model {
      model.is_enabled == 1
    } else {
      false
    }
  };
  
  Ok(is_enabled)
}

/// 根据 ids 启用或禁用数据
pub async fn enable_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
  let _method = "enable_by_ids";
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_foreign_tables());
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_enabled=? where id=? limit 1",
      table,
    );
    
    args.push(is_enabled.into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone().into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ID 查找是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let model = find_by_id(ctx, id, options).await?;
  
  let is_locked = {
    if let Some(model) = model {
      model.is_locked == 1
    } else {
      false
    }
  };
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁数据
pub async fn lock_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
  let _method = "lock_by_ids";
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_foreign_tables());
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_locked=? where id=? limit 1",
      table,
    );
    
    args.push(is_locked.into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone().into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ids 还原数据
pub async fn revert_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
  let _method = "revert_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=0 where id=? limit 1",
      table,
    );
    
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.set_del_cache_key1s(get_foreign_tables());
    
    let options = options.into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ids 彻底删除数据
pub async fn force_delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    
    let model = find_all(
      ctx,
      UsrSearch {
        id: id.clone().into(),
        is_deleted: 1.into(),
        ..Default::default()
      }.into(),
      None,
      None, 
      options.clone().into(),
    ).await?.into_iter().next();
    
    if model.is_none() {
      continue;
    }
    
    info!("force_delete_by_ids: {}", serde_json::to_string(&model)?);
    
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "delete from {table} where id=? and is_deleted = 1 limit 1",
    );
    
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.set_del_cache_key1s(get_foreign_tables());
    
    let options = options.into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}
