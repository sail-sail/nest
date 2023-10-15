use anyhow::Result;
use tracing::{info, error};
use crate::common::util::string::*;

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

use super::wxw_usr_model::*;

#[allow(unused_variables)]
async fn get_where_query<'a>(
  ctx: &Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<WxwUsrSearch>,
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
    let userid = match &search {
      Some(item) => item.userid.clone(),
      None => None,
    };
    if let Some(userid) = userid {
      where_query += &format!(" and t.userid = {}", args.push(userid.into()));
    }
    let userid_like = match &search {
      Some(item) => item.userid_like.clone(),
      None => None,
    };
    if let Some(userid_like) = userid_like {
      where_query += &format!(" and t.userid like {}", args.push((sql_like(&userid_like) + "%").into()));
    }
  }
  {
    let mobile = match &search {
      Some(item) => item.mobile.clone(),
      None => None,
    };
    if let Some(mobile) = mobile {
      where_query += &format!(" and t.mobile = {}", args.push(mobile.into()));
    }
    let mobile_like = match &search {
      Some(item) => item.mobile_like.clone(),
      None => None,
    };
    if let Some(mobile_like) = mobile_like {
      where_query += &format!(" and t.mobile like {}", args.push((sql_like(&mobile_like) + "%").into()));
    }
  }
  {
    let gender = match &search {
      Some(item) => item.gender.clone(),
      None => None,
    };
    if let Some(gender) = gender {
      where_query += &format!(" and t.gender = {}", args.push(gender.into()));
    }
    let gender_like = match &search {
      Some(item) => item.gender_like.clone(),
      None => None,
    };
    if let Some(gender_like) = gender_like {
      where_query += &format!(" and t.gender like {}", args.push((sql_like(&gender_like) + "%").into()));
    }
  }
  {
    let email = match &search {
      Some(item) => item.email.clone(),
      None => None,
    };
    if let Some(email) = email {
      where_query += &format!(" and t.email = {}", args.push(email.into()));
    }
    let email_like = match &search {
      Some(item) => item.email_like.clone(),
      None => None,
    };
    if let Some(email_like) = email_like {
      where_query += &format!(" and t.email like {}", args.push((sql_like(&email_like) + "%").into()));
    }
  }
  {
    let biz_email = match &search {
      Some(item) => item.biz_email.clone(),
      None => None,
    };
    if let Some(biz_email) = biz_email {
      where_query += &format!(" and t.biz_email = {}", args.push(biz_email.into()));
    }
    let biz_email_like = match &search {
      Some(item) => item.biz_email_like.clone(),
      None => None,
    };
    if let Some(biz_email_like) = biz_email_like {
      where_query += &format!(" and t.biz_email like {}", args.push((sql_like(&biz_email_like) + "%").into()));
    }
  }
  {
    let direct_leader = match &search {
      Some(item) => item.direct_leader.clone(),
      None => None,
    };
    if let Some(direct_leader) = direct_leader {
      where_query += &format!(" and t.direct_leader = {}", args.push(direct_leader.into()));
    }
    let direct_leader_like = match &search {
      Some(item) => item.direct_leader_like.clone(),
      None => None,
    };
    if let Some(direct_leader_like) = direct_leader_like {
      where_query += &format!(" and t.direct_leader like {}", args.push((sql_like(&direct_leader_like) + "%").into()));
    }
  }
  {
    let position = match &search {
      Some(item) => item.position.clone(),
      None => None,
    };
    if let Some(position) = position {
      where_query += &format!(" and t.position = {}", args.push(position.into()));
    }
    let position_like = match &search {
      Some(item) => item.position_like.clone(),
      None => None,
    };
    if let Some(position_like) = position_like {
      where_query += &format!(" and t.position like {}", args.push((sql_like(&position_like) + "%").into()));
    }
  }
  {
    let avatar = match &search {
      Some(item) => item.avatar.clone(),
      None => None,
    };
    if let Some(avatar) = avatar {
      where_query += &format!(" and t.avatar = {}", args.push(avatar.into()));
    }
    let avatar_like = match &search {
      Some(item) => item.avatar_like.clone(),
      None => None,
    };
    if let Some(avatar_like) = avatar_like {
      where_query += &format!(" and t.avatar like {}", args.push((sql_like(&avatar_like) + "%").into()));
    }
  }
  {
    let thumb_avatar = match &search {
      Some(item) => item.thumb_avatar.clone(),
      None => None,
    };
    if let Some(thumb_avatar) = thumb_avatar {
      where_query += &format!(" and t.thumb_avatar = {}", args.push(thumb_avatar.into()));
    }
    let thumb_avatar_like = match &search {
      Some(item) => item.thumb_avatar_like.clone(),
      None => None,
    };
    if let Some(thumb_avatar_like) = thumb_avatar_like {
      where_query += &format!(" and t.thumb_avatar like {}", args.push((sql_like(&thumb_avatar_like) + "%").into()));
    }
  }
  {
    let qr_code = match &search {
      Some(item) => item.qr_code.clone(),
      None => None,
    };
    if let Some(qr_code) = qr_code {
      where_query += &format!(" and t.qr_code = {}", args.push(qr_code.into()));
    }
    let qr_code_like = match &search {
      Some(item) => item.qr_code_like.clone(),
      None => None,
    };
    if let Some(qr_code_like) = qr_code_like {
      where_query += &format!(" and t.qr_code like {}", args.push((sql_like(&qr_code_like) + "%").into()));
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
  let from_query = r#"wxwork_wxw_usr t"#.to_owned();
  Ok(from_query)
}

/// 根据搜索条件和分页查找数据
#[allow(unused_variables)]
pub async fn find_all<'a>(
  ctx: &Ctx<'a>,
  search: Option<WxwUsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrModel>> {
  
  #[allow(unused_variables)]
  let table = "wxwork_wxw_usr";
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
  
  let mut res: Vec<WxwUsrModel> = ctx.query(
    sql,
    args,
    options,
  ).await?;
  
  for model in &mut res {
    
  }
  
  Ok(res)
}

/// 根据搜索条件查询数据总数
pub async fn find_count<'a>(
  ctx: &Ctx<'a>,
  search: Option<WxwUsrSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "wxwork_wxw_usr";
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
  "/wxwork/wxw_usr".to_owned()
}

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path().into(),
  }
}

/// 获取字段对应的国家化后的名称
pub async fn get_field_comments<'a>(
  ctx: &Ctx<'a>,
  _options: Option<Options>,
) -> Result<WxwUsrFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "姓名".into(),
    "用户ID".into(),
    "手机号".into(),
    "性别".into(),
    "邮箱".into(),
    "企业邮箱".into(),
    "直属上级".into(),
    "职位".into(),
    "头像".into(),
    "头像缩略图".into(),
    "个人二维码".into(),
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
  
  let field_comments = WxwUsrFieldComment {
    id: vec[0].to_owned(),
    lbl: vec[1].to_owned(),
    userid: vec[2].to_owned(),
    mobile: vec[3].to_owned(),
    gender: vec[4].to_owned(),
    email: vec[5].to_owned(),
    biz_email: vec[6].to_owned(),
    direct_leader: vec[7].to_owned(),
    position: vec[8].to_owned(),
    avatar: vec[9].to_owned(),
    thumb_avatar: vec[10].to_owned(),
    qr_code: vec[11].to_owned(),
    rem: vec[12].to_owned(),
  };
  Ok(field_comments)
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &Ctx<'a>,
  search: Option<WxwUsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwUsrModel>> {
  
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
  
  let model: Option<WxwUsrModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<WxwUsrModel>> {
  
  let search = WxwUsrSearch {
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

/// 根据搜索条件判断数据是否存在
pub async fn exists<'a>(
  ctx: &Ctx<'a>,
  search: Option<WxwUsrSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let total = find_count(
    ctx,
    search,
    options,
  ).await?;
  
  Ok(total > 0)
}

/// 根据ID判断数据是否存在
pub async fn exists_by_id<'a>(
  ctx: &Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let search = WxwUsrSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = exists(
    ctx,
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique<'a>(
  ctx: &Ctx<'a>,
  search: WxwUsrSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwUsrModel>> {
  
  if let Some(id) = search.id {
    let model = find_by_id(
      ctx,
      id,
      None,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<WxwUsrModel> = vec![];
  
  let mut models_tmp = {
    if
      search.userid.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxwUsrSearch {
      userid: search.userid,
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
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxwUsrSearch {
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
  input: &WxwUsrInput,
  model: &WxwUsrModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.userid.as_ref().is_some() && input.userid.as_ref().unwrap() == &model.userid
  {
    return true;
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
  ctx: &Ctx<'a>,
  input: WxwUsrInput,
  model: WxwUsrModel,
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

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables)]
pub async fn set_id_by_lbl<'a>(
  ctx: &Ctx<'a>,
  input: WxwUsrInput,
) -> Result<WxwUsrInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  Ok(input)
}

/// 创建数据
#[allow(unused_mut)]
pub async fn create<'a>(
  ctx: &Ctx<'a>,
  mut input: WxwUsrInput,
  options: Option<Options>,
) -> Result<String> {
  
  let table = "wxwork_wxw_usr";
  let _method = "create";
  
  if input.id.is_some() {
    return Err(SrvErr::msg(
      format!("Can not set id when create in dao: {table}")
    ).into());
  }
  
  let now = ctx.get_now();
  
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
  
  let mut id;
  loop {
    id = get_short_uuid();
    let is_exist = exists_by_id(
      ctx,
      id.clone(),
      None,
    ).await?;
    if !is_exist {
      break;
    }
    error!(
      "{req_id} ID_COLLIDE: {table} {id}",
      req_id = ctx.get_req_id(),
    );
  }
  let id = id;
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "id,create_time".to_owned();
  
  let mut sql_values = "?,?".to_owned();
  
  args.push(id.clone().into());
  args.push(now.into());
  
  if let Some(tenant_id) = input.tenant_id {
    sql_fields += ",tenant_id";
    sql_values += ",?";
    args.push(tenant_id.into());
  } else if let Some(tenant_id) = ctx.get_auth_tenant_id() {
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
  // 姓名
  if let Some(lbl) = input.lbl {
    sql_fields += ",lbl";
    sql_values += ",?";
    args.push(lbl.into());
  }
  // 用户ID
  if let Some(userid) = input.userid {
    sql_fields += ",userid";
    sql_values += ",?";
    args.push(userid.into());
  }
  // 手机号
  if let Some(mobile) = input.mobile {
    sql_fields += ",mobile";
    sql_values += ",?";
    args.push(mobile.into());
  }
  // 性别
  if let Some(gender) = input.gender {
    sql_fields += ",gender";
    sql_values += ",?";
    args.push(gender.into());
  }
  // 邮箱
  if let Some(email) = input.email {
    sql_fields += ",email";
    sql_values += ",?";
    args.push(email.into());
  }
  // 企业邮箱
  if let Some(biz_email) = input.biz_email {
    sql_fields += ",biz_email";
    sql_values += ",?";
    args.push(biz_email.into());
  }
  // 直属上级
  if let Some(direct_leader) = input.direct_leader {
    sql_fields += ",direct_leader";
    sql_values += ",?";
    args.push(direct_leader.into());
  }
  // 职位
  if let Some(position) = input.position {
    sql_fields += ",position";
    sql_values += ",?";
    args.push(position.into());
  }
  // 头像
  if let Some(avatar) = input.avatar {
    sql_fields += ",avatar";
    sql_values += ",?";
    args.push(avatar.into());
  }
  // 头像缩略图
  if let Some(thumb_avatar) = input.thumb_avatar {
    sql_fields += ",thumb_avatar";
    sql_values += ",?";
    args.push(thumb_avatar.into());
  }
  // 个人二维码
  if let Some(qr_code) = input.qr_code {
    sql_fields += ",qr_code";
    sql_values += ",?";
    args.push(qr_code.into());
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
  ctx: &Ctx<'a>,
  id: String,
  tenant_id: String,
  options: Option<Options>,
) -> Result<u64> {
  let table = "wxwork_wxw_usr";
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
#[allow(unused_mut)]
pub async fn update_by_id<'a>(
  ctx: &Ctx<'a>,
  id: String,
  mut input: WxwUsrInput,
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
      .collect::<Vec<WxwUsrModel>>();
    
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
  
  let table = "wxwork_wxw_usr";
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
  // 姓名
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += ",lbl = ?";
    args.push(lbl.into());
  }
  // 用户ID
  if let Some(userid) = input.userid {
    field_num += 1;
    sql_fields += ",userid = ?";
    args.push(userid.into());
  }
  // 手机号
  if let Some(mobile) = input.mobile {
    field_num += 1;
    sql_fields += ",mobile = ?";
    args.push(mobile.into());
  }
  // 性别
  if let Some(gender) = input.gender {
    field_num += 1;
    sql_fields += ",gender = ?";
    args.push(gender.into());
  }
  // 邮箱
  if let Some(email) = input.email {
    field_num += 1;
    sql_fields += ",email = ?";
    args.push(email.into());
  }
  // 企业邮箱
  if let Some(biz_email) = input.biz_email {
    field_num += 1;
    sql_fields += ",biz_email = ?";
    args.push(biz_email.into());
  }
  // 直属上级
  if let Some(direct_leader) = input.direct_leader {
    field_num += 1;
    sql_fields += ",direct_leader = ?";
    args.push(direct_leader.into());
  }
  // 职位
  if let Some(position) = input.position {
    field_num += 1;
    sql_fields += ",position = ?";
    args.push(position.into());
  }
  // 头像
  if let Some(avatar) = input.avatar {
    field_num += 1;
    sql_fields += ",avatar = ?";
    args.push(avatar.into());
  }
  // 头像缩略图
  if let Some(thumb_avatar) = input.thumb_avatar {
    field_num += 1;
    sql_fields += ",thumb_avatar = ?";
    args.push(thumb_avatar.into());
  }
  // 个人二维码
  if let Some(qr_code) = input.qr_code {
    field_num += 1;
    sql_fields += ",qr_code = ?";
    args.push(qr_code.into());
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
  let table = "wxwork_wxw_usr";
  vec![
    table,
  ]
}

/// 根据 ids 删除数据
pub async fn delete_by_ids<'a>(
  ctx: &Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_usr";
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

/// 根据 ids 还原数据
pub async fn revert_by_ids<'a>(
  ctx: &Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_usr";
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
      
      let mut input: WxwUsrInput = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        ctx,
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<WxwUsrModel> = models.into_iter()
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
  ctx: &Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_usr";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    
    let model = find_all(
      ctx,
      WxwUsrSearch {
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

/// 校验记录是否存在
#[function_name::named]
#[allow(dead_code)]
pub async fn validate_option<'a, T>(
  ctx: &Ctx<'a>,
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let msg0 = i18n_dao::ns(
      ctx,
      "企微用户".to_owned(),
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
