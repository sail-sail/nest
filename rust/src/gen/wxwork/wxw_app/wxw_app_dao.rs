use anyhow::Result;
use tracing::info;
use crate::common::util::string::*;

use crate::common::util::dao::encrypt;

#[allow(unused_imports)]
use crate::common::context::{
  Ctx,
  QueryArgs,
  Options,
  CountModel,
  UniqueType,
  SrvErr,
  OrderByModel,
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

use super::wxw_app_model::*;

#[allow(unused_variables)]
async fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<WxwAppSearch>,
) -> Result<String> {
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
    let id = match trim_opt(id.as_ref()) {
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
      let tenant_id = match trim_opt(tenant_id.as_ref()) {
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
    let corpid = match &search {
      Some(item) => item.corpid.clone(),
      None => None,
    };
    if let Some(corpid) = corpid {
      where_query += &format!(" and t.corpid = {}", args.push(corpid.into()));
    }
    let corpid_like = match &search {
      Some(item) => item.corpid_like.clone(),
      None => None,
    };
    if let Some(corpid_like) = corpid_like {
      where_query += &format!(" and t.corpid like {}", args.push((sql_like(&corpid_like) + "%").into()));
    }
  }
  {
    let agentid = match &search {
      Some(item) => item.agentid.clone(),
      None => None,
    };
    if let Some(agentid) = agentid {
      where_query += &format!(" and t.agentid = {}", args.push(agentid.into()));
    }
    let agentid_like = match &search {
      Some(item) => item.agentid_like.clone(),
      None => None,
    };
    if let Some(agentid_like) = agentid_like {
      where_query += &format!(" and t.agentid like {}", args.push((sql_like(&agentid_like) + "%").into()));
    }
  }
  {
    let corpsecret = match &search {
      Some(item) => item.corpsecret.clone(),
      None => None,
    };
    if let Some(corpsecret) = corpsecret {
      where_query += &format!(" and t.corpsecret = {}", args.push(corpsecret.into()));
    }
    let corpsecret_like = match &search {
      Some(item) => item.corpsecret_like.clone(),
      None => None,
    };
    if let Some(corpsecret_like) = corpsecret_like {
      where_query += &format!(" and t.corpsecret like {}", args.push((sql_like(&corpsecret_like) + "%").into()));
    }
  }
  {
    let contactsecret = match &search {
      Some(item) => item.contactsecret.clone(),
      None => None,
    };
    if let Some(contactsecret) = contactsecret {
      where_query += &format!(" and t.contactsecret = {}", args.push(contactsecret.into()));
    }
    let contactsecret_like = match &search {
      Some(item) => item.contactsecret_like.clone(),
      None => None,
    };
    if let Some(contactsecret_like) = contactsecret_like {
      where_query += &format!(" and t.contactsecret like {}", args.push((sql_like(&contactsecret_like) + "%").into()));
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
    let order_by: Vec<u32> = match &search {
      Some(item) => item.order_by.clone().unwrap_or_default(),
      None => vec![],
    };
    let order_by_gt: Option<u32> = match &order_by.len() {
      0 => None,
      _ => order_by[0].into(),
    };
    let order_by_lt: Option<u32> = match &order_by.len() {
      0 => None,
      1 => None,
      _ => order_by[1].into(),
    };
    if let Some(order_by_gt) = order_by_gt {
      where_query += &format!(" and t.order_by >= {}", args.push(order_by_gt.into()));
    }
    if let Some(order_by_lt) = order_by_lt {
      where_query += &format!(" and t.order_by <= {}", args.push(order_by_lt.into()));
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
  Ok(where_query)
}

async fn get_from_query() -> Result<String> {
  let from_query = r#"wxwork_wxw_app t"#.to_owned();
  Ok(from_query)
}

/// 根据搜索条件和分页查找数据
#[allow(unused_variables)]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<WxwAppSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwAppModel>> {
  
  #[allow(unused_variables)]
  let table = "wxwork_wxw_app";
  let _method = "find_all";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query().await?;
  let where_query = get_where_query(ctx, &mut args, search).await?;
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select
      t.*
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
  
  let mut res: Vec<WxwAppModel> = ctx.query(
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
  search: Option<WxwAppSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "wxwork_wxw_app";
  let _method = "find_count";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query().await?;
  let where_query = get_where_query(ctx, &mut args, search).await?;
  
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

/// 获取路由地址
pub fn get_route_path() -> String {
  "/wxwork/wxw_app".to_owned()
}

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path().into(),
  }
}

/// 获取字段对应的国家化后的名称
pub async fn get_field_comments<'a>(
  ctx: &mut impl Ctx<'a>,
  _options: Option<Options>,
) -> Result<WxwAppFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "名称".into(),
    "企业ID".into(),
    "应用ID".into(),
    "应用密钥".into(),
    "通讯录密钥".into(),
    "锁定".into(),
    "锁定".into(),
    "启用".into(),
    "启用".into(),
    "排序".into(),
    "备注".into(),
  ];
  
  let map = n_route.n_batch(
    ctx,
    i18n_code_maps.clone(),
  ).await?;
  
  let vec = i18n_code_maps.into_iter()
    .map(|item|
      map.get(&item.code)
        .map(|item| item.to_owned())
        .unwrap_or_default()
    )
    .collect::<Vec<String>>();
  
  let field_comments = WxwAppFieldComment {
    id: vec[0].to_owned(),
    lbl: vec[1].to_owned(),
    corpid: vec[2].to_owned(),
    agentid: vec[3].to_owned(),
    corpsecret: vec[4].to_owned(),
    contactsecret: vec[5].to_owned(),
    is_locked: vec[6].to_owned(),
    is_locked_lbl: vec[7].to_owned(),
    is_enabled: vec[8].to_owned(),
    is_enabled_lbl: vec[9].to_owned(),
    order_by: vec[10].to_owned(),
    rem: vec[11].to_owned(),
  };
  Ok(field_comments)
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<WxwAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwAppModel>> {
  
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
  
  let model: Option<WxwAppModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<WxwAppModel>> {
  
  let search = WxwAppSearch {
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
  search: WxwAppSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwAppModel>> {
  
  if let Some(id) = search.id {
    let model = find_by_id(
      ctx,
      id,
      None,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<WxwAppModel> = vec![];
  
  let mut models_tmp = {
    if
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxwAppSearch {
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
  
  let mut models_tmp = {
    if
      search.corpid.is_none() ||
      search.agentid.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxwAppSearch {
      corpid: search.corpid,
      agentid: search.agentid,
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
  input: &WxwAppInput,
  model: &WxwAppModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.lbl.as_ref().is_some() && input.lbl.as_ref().unwrap() == &model.lbl
  {
    return true;
  }
  
  if
    input.corpid.as_ref().is_some() && input.corpid.as_ref().unwrap() == &model.corpid &&
    input.agentid.as_ref().is_some() && input.agentid.as_ref().unwrap() == &model.agentid
  {
    return true;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  input: WxwAppInput,
  model: WxwAppModel,
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
    let options = Options::new();
    let options = options.set_is_encrypt(false);
    let id = update_by_id(
      ctx,
      model.id.clone(),
      input,
      Some(options),
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
  input: WxwAppInput,
) -> Result<WxwAppInput> {
  
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
      input.is_locked = is_locked_dict.iter()
        .find(|item| {
          item.lbl == is_locked_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 启用
  if input.is_enabled.is_none() {
    let is_enabled_dict = &dict_vec[1];
    if let Some(is_enabled_lbl) = input.is_enabled_lbl.clone() {
      input.is_enabled = is_enabled_dict.iter()
        .find(|item| {
          item.lbl == is_enabled_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  Ok(input)
}

/// 创建数据
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  mut input: WxwAppInput,
  options: Option<Options>,
) -> Result<String> {
  
  validate(
    &input,
  )?;
  
  let table = "wxwork_wxw_app";
  let _method = "create";
  
  let is_encrypt = options.as_ref()
    .map(|item|
      item.get_is_encrypt()
    )
    .unwrap_or(true);
  if is_encrypt {
    // 应用密钥
    if input.corpsecret.is_some() {
      input.corpsecret = input.corpsecret.as_ref().map(|item| {
        encrypt(item)
      });
    }
    // 通讯录密钥
    if input.contactsecret.is_some() {
      input.contactsecret = input.contactsecret.as_ref().map(|item| {
        encrypt(item)
      });
    }
  };
  
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
  
  if !old_models.is_empty() {
    
    let unique_type = options.as_ref()
      .map(|item|
        item.get_unique_type().unwrap_or(UniqueType::Throw)
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
    
    if let Some(id) = id {
      return Ok(id);
    }
  }
  
  let id = get_short_uuid();
  
  if input.id.is_none() {
    input.id = id.clone().into();
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
  // 名称
  if let Some(lbl) = input.lbl {
    sql_fields += ",lbl";
    sql_values += ",?";
    args.push(lbl.into());
  }
  // 企业ID
  if let Some(corpid) = input.corpid {
    sql_fields += ",corpid";
    sql_values += ",?";
    args.push(corpid.into());
  }
  // 应用ID
  if let Some(agentid) = input.agentid {
    sql_fields += ",agentid";
    sql_values += ",?";
    args.push(agentid.into());
  }
  // 应用密钥
  if let Some(corpsecret) = input.corpsecret {
    sql_fields += ",corpsecret";
    sql_values += ",?";
    args.push(corpsecret.into());
  }
  // 通讯录密钥
  if let Some(contactsecret) = input.contactsecret {
    sql_fields += ",contactsecret";
    sql_values += ",?";
    args.push(contactsecret.into());
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
  // 排序
  if let Some(order_by) = input.order_by {
    sql_fields += ",order_by";
    sql_values += ",?";
    args.push(order_by.into());
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
  
  Ok(id)
}

/// 根据id修改租户id
pub async fn update_tenant_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  tenant_id: String,
  options: Option<Options>,
) -> Result<u64> {
  let table = "wxwork_wxw_app";
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
  mut input: WxwAppInput,
  options: Option<Options>,
) -> Result<String> {
  
  let is_encrypt = options.as_ref()
    .map(|item|
      item.get_is_encrypt()
    )
    .unwrap_or(true);
  if is_encrypt {
    // 应用密钥
    if input.corpsecret.is_some() {
      input.corpsecret = input.corpsecret.as_ref().map(|item| {
        encrypt(item)
      });
    }
    // 通讯录密钥
    if input.contactsecret.is_some() {
      input.contactsecret = input.contactsecret.as_ref().map(|item| {
        encrypt(item)
      });
    }
  };
  
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
  
  validate(
    &input,
  )?;
  
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
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<WxwAppModel>>();
    
    if !models.is_empty() {
      let unique_type = {
        if let Some(options) = options.as_ref() {
          options.get_unique_type()
            .unwrap_or(UniqueType::Throw)
        } else {
          UniqueType::Throw
        }
      };
      if unique_type == UniqueType::Throw {
        let err_msg = i18n_dao::ns(
          ctx,
          "数据已经存在".to_owned(),
          None,
        ).await?;
        return Err(SrvErr::msg(err_msg).into());
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let table = "wxwork_wxw_app";
  let _method = "update_by_id";
  
  let now = ctx.get_now();
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "update_time = ?".to_owned();
  args.push(now.into());
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += ",tenant_id = ?";
    args.push(tenant_id.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += ",lbl = ?";
    args.push(lbl.into());
  }
  // 企业ID
  if let Some(corpid) = input.corpid {
    field_num += 1;
    sql_fields += ",corpid = ?";
    args.push(corpid.into());
  }
  // 应用ID
  if let Some(agentid) = input.agentid {
    field_num += 1;
    sql_fields += ",agentid = ?";
    args.push(agentid.into());
  }
  // 应用密钥
  if let Some(corpsecret) = input.corpsecret {
    field_num += 1;
    sql_fields += ",corpsecret = ?";
    args.push(corpsecret.into());
  }
  // 通讯录密钥
  if let Some(contactsecret) = input.contactsecret {
    field_num += 1;
    sql_fields += ",contactsecret = ?";
    args.push(contactsecret.into());
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
  // 排序
  if let Some(order_by) = input.order_by {
    field_num += 1;
    sql_fields += ",order_by = ?";
    args.push(order_by.into());
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
  
  Ok(id)
}

/// 获取外键关联表, 第一个是主表
#[allow(dead_code)]
fn get_foreign_tables() -> Vec<&'static str> {
  let table = "wxwork_wxw_app";
  vec![
    table,
  ]
}

/// 根据 ids 删除数据
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_app";
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
  
  let table = "wxwork_wxw_app";
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
  
  let table = "wxwork_wxw_app";
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
  
  let table = "wxwork_wxw_app";
  let _method = "revert_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=0 where id=? limit 1",
      table,
    );
    
    args.push(id.clone().into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.set_del_cache_key1s(get_foreign_tables());
    
    let options = options.into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
    
    // 检查数据的唯一索引
    {
      let old_model = find_by_id(
        ctx,
        id.clone(),
        None,
      ).await?;
      
      if old_model.is_none() {
        continue;
      }
      let old_model = old_model.unwrap();
      
      let mut input: WxwAppInput = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        ctx,
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<WxwAppModel> = models.into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = i18n_dao::ns(
          ctx,
          "数据已经存在".to_owned(),
          None,
        ).await?;
        return Err(SrvErr::msg(err_msg).into());
      }
    }
    
  }
  
  Ok(num)
}

/// 根据 ids 彻底删除数据
pub async fn force_delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_app";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    
    let model = find_all(
      ctx,
      WxwAppSearch {
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

/// 查找 order_by 字段的最大值
pub async fn find_last_order_by<'a>(
  ctx: &mut impl Ctx<'a>,
  options: Option<Options>,
) -> Result<u32> {
  
  let table = "wxwork_wxw_app";
  let _method = "find_last_order_by";
  
  #[allow(unused_mut)]
  let mut args = QueryArgs::new();
  let mut sql_where = "".to_owned();
  
  sql_where += "t.is_deleted = 0";
  
  if let Some(tenant_id) = ctx.get_auth_tenant_id() {
    sql_where += " and t.tenant_id = ?";
    args.push(tenant_id.into());
  }
  
  let sql = format!(
    "select t.order_by order_by from {} t where {} order by t.order_by desc limit 1",
    table,
    sql_where,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let model = ctx.query_one::<OrderByModel>(
    sql,
    args,
    options,
  ).await?;
  
  let order_by = {
    if let Some(model) = model {
      model.order_by
    } else {
      0
    }
  };
  
  Ok(order_by)
}

/// 校验记录是否启用
#[function_name::named]
#[allow(dead_code)]
pub async fn validate_is_enabled<'a>(
  ctx: &mut impl Ctx<'a>,
  model: &WxwAppModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let msg0 = i18n_dao::ns(
      ctx,
      "企微应用".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      ctx,
      "已禁用".to_owned(),
      None,
    ).await?;
    let err_msg = msg0 + &msg1;
    return Err(SrvErr::new(function_name!().to_owned(), err_msg).into());
  }
  Ok(())
}

/// 校验记录是否存在
#[function_name::named]
#[allow(dead_code)]
pub async fn validate_option<'a, T>(
  ctx: &mut impl Ctx<'a>,
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let msg0 = i18n_dao::ns(
      ctx,
      "企微应用".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      ctx,
      "不存在".to_owned(),
      None,
    ).await?;
    let err_msg = msg0 + &msg1;
    return Err(SrvErr::new(function_name!().to_owned(), err_msg).into());
  }
  Ok(model.unwrap())
}

/// 校验, 校验失败时抛出SrvErr异常
#[allow(unused_imports)]
pub fn validate(
  input: &WxwAppInput,
) -> Result<()> {
  
  use crate::common::validators::max_items::max_items;
  use crate::common::validators::min_items::min_items;
  use crate::common::validators::maximum::maximum;
  use crate::common::validators::minimum::minimum;
  use crate::common::validators::chars_max_length::chars_max_length;
  use crate::common::validators::chars_min_length::chars_min_length;
  use crate::common::validators::multiple_of::multiple_of;
  use crate::common::validators::regex::regex;
  use crate::common::validators::email::email;
  use crate::common::validators::url::url;
  use crate::common::validators::ip::ip;
  
  // ID
  chars_max_length(
    input.id.clone(),
    22,
    "",
  )?;
  
  // 名称
  chars_max_length(
    input.lbl.clone(),
    45,
    "",
  )?;
  
  // 企业ID
  chars_max_length(
    input.corpid.clone(),
    18,
    "",
  )?;
  
  // 应用ID
  chars_max_length(
    input.agentid.clone(),
    7,
    "",
  )?;
  
  // 应用密钥
  chars_max_length(
    input.corpsecret.clone(),
    120,
    "",
  )?;
  
  // 通讯录密钥
  chars_max_length(
    input.contactsecret.clone(),
    120,
    "",
  )?;
  
  // 备注
  chars_max_length(
    input.rem.clone(),
    100,
    "",
  )?;
  
  Ok(())
}
