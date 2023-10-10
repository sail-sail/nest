use anyhow::Result;
use tracing::info;
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

use crate::src::base::dict_detail::dict_detail_dao::get_dict;

use super::wxw_msg_model::*;

#[allow(unused_variables)]
async fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<WxwMsgSearch>,
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
    let wxw_app_id: Vec<String> = match &search {
      Some(item) => item.wxw_app_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !wxw_app_id.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(wxw_app_id.len());
        for item in wxw_app_id {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and wxw_app_id_lbl.id in ({})", arg);
    }
  }
  {
    let wxw_app_id_is_null: bool = match &search {
      Some(item) => item.wxw_app_id_is_null.unwrap_or(false),
      None => false,
    };
    if wxw_app_id_is_null {
      where_query += " and wxw_app_id_lbl.id is null";
    }
  }
  {
    let errcode: Vec<String> = match &search {
      Some(item) => item.errcode.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !errcode.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(errcode.len());
        for item in errcode {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.errcode in ({})", arg);
    }
  }
  {
    let touser = match &search {
      Some(item) => item.touser.clone(),
      None => None,
    };
    if let Some(touser) = touser {
      where_query += &format!(" and t.touser = {}", args.push(touser.into()));
    }
    let touser_like = match &search {
      Some(item) => item.touser_like.clone(),
      None => None,
    };
    if let Some(touser_like) = touser_like {
      where_query += &format!(" and t.touser like {}", args.push((sql_like(&touser_like) + "%").into()));
    }
  }
  {
    let title = match &search {
      Some(item) => item.title.clone(),
      None => None,
    };
    if let Some(title) = title {
      where_query += &format!(" and t.title = {}", args.push(title.into()));
    }
    let title_like = match &search {
      Some(item) => item.title_like.clone(),
      None => None,
    };
    if let Some(title_like) = title_like {
      where_query += &format!(" and t.title like {}", args.push((sql_like(&title_like) + "%").into()));
    }
  }
  {
    let description = match &search {
      Some(item) => item.description.clone(),
      None => None,
    };
    if let Some(description) = description {
      where_query += &format!(" and t.description = {}", args.push(description.into()));
    }
    let description_like = match &search {
      Some(item) => item.description_like.clone(),
      None => None,
    };
    if let Some(description_like) = description_like {
      where_query += &format!(" and t.description like {}", args.push((sql_like(&description_like) + "%").into()));
    }
  }
  {
    let url = match &search {
      Some(item) => item.url.clone(),
      None => None,
    };
    if let Some(url) = url {
      where_query += &format!(" and t.url = {}", args.push(url.into()));
    }
    let url_like = match &search {
      Some(item) => item.url_like.clone(),
      None => None,
    };
    if let Some(url_like) = url_like {
      where_query += &format!(" and t.url like {}", args.push((sql_like(&url_like) + "%").into()));
    }
  }
  {
    let btntxt = match &search {
      Some(item) => item.btntxt.clone(),
      None => None,
    };
    if let Some(btntxt) = btntxt {
      where_query += &format!(" and t.btntxt = {}", args.push(btntxt.into()));
    }
    let btntxt_like = match &search {
      Some(item) => item.btntxt_like.clone(),
      None => None,
    };
    if let Some(btntxt_like) = btntxt_like {
      where_query += &format!(" and t.btntxt like {}", args.push((sql_like(&btntxt_like) + "%").into()));
    }
  }
  {
    let create_time: Vec<chrono::NaiveDateTime> = match &search {
      Some(item) => item.create_time.clone().unwrap_or_default(),
      None => vec![],
    };
    let create_time_gt: Option<chrono::NaiveDateTime> = match &create_time.len() {
      0 => None,
      _ => create_time[0].into(),
    };
    let create_time_lt: Option<chrono::NaiveDateTime> = match &create_time.len() {
      0 => None,
      1 => None,
      _ => create_time[1].into(),
    };
    if let Some(create_time_gt) = create_time_gt {
      where_query += &format!(" and t.create_time >= {}", args.push(create_time_gt.into()));
    }
    if let Some(create_time_lt) = create_time_lt {
      where_query += &format!(" and t.create_time <= {}", args.push(create_time_lt.into()));
    }
  }
  {
    let errmsg = match &search {
      Some(item) => item.errmsg.clone(),
      None => None,
    };
    if let Some(errmsg) = errmsg {
      where_query += &format!(" and t.errmsg = {}", args.push(errmsg.into()));
    }
    let errmsg_like = match &search {
      Some(item) => item.errmsg_like.clone(),
      None => None,
    };
    if let Some(errmsg_like) = errmsg_like {
      where_query += &format!(" and t.errmsg like {}", args.push((sql_like(&errmsg_like) + "%").into()));
    }
  }
  {
    let msgid = match &search {
      Some(item) => item.msgid.clone(),
      None => None,
    };
    if let Some(msgid) = msgid {
      where_query += &format!(" and t.msgid = {}", args.push(msgid.into()));
    }
    let msgid_like = match &search {
      Some(item) => item.msgid_like.clone(),
      None => None,
    };
    if let Some(msgid_like) = msgid_like {
      where_query += &format!(" and t.msgid like {}", args.push((sql_like(&msgid_like) + "%").into()));
    }
  }
  Ok(where_query)
}

async fn get_from_query() -> Result<String> {
  let from_query = r#"wxwork_wxw_msg t
    left join wxwork_wxw_app wxw_app_id_lbl
      on wxw_app_id_lbl.id = t.wxw_app_id"#.to_owned();
  Ok(from_query)
}

/// 根据搜索条件和分页查找数据
#[allow(unused_variables)]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<WxwMsgSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwMsgModel>> {
  
  #[allow(unused_variables)]
  let table = "wxwork_wxw_msg";
  let _method = "find_all";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query().await?;
  let where_query = get_where_query(ctx, &mut args, search).await?;
  
  let mut sort = sort.unwrap_or_default();
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: "asc".into(),
    });
  }
  let sort = sort.into();
  
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select
      t.*
      ,wxw_app_id_lbl.lbl wxw_app_id_lbl
    from
      {from_query}
    where
      {where_query}
    group by t.id{order_by_query}{page_query}
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.into();
  
  let mut res: Vec<WxwMsgModel> = ctx.query(
    sql,
    args,
    options,
  ).await?;
  
  let dict_vec = get_dict(ctx, &vec![
    "wxw_msg_errcode",
  ]).await?;
  
  let errcode_dict = &dict_vec[0];
  
  for model in &mut res {
    
    // 发送状态
    model.errcode_lbl = {
      errcode_dict.iter()
        .find(|item| item.val == model.errcode)
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.errcode.to_string())
    };
    
  }
  
  Ok(res)
}

/// 根据搜索条件查询数据总数
pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<WxwMsgSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "wxwork_wxw_msg";
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
  "/wxwork/wxw_msg".to_owned()
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
) -> Result<WxwMsgFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "企微应用".into(),
    "企微应用".into(),
    "发送状态".into(),
    "发送状态".into(),
    "成员ID".into(),
    "标题".into(),
    "描述".into(),
    "链接".into(),
    "按钮文字".into(),
    "发送时间".into(),
    "发送时间".into(),
    "错误信息".into(),
    "消息ID".into(),
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
  
  let field_comments = WxwMsgFieldComment {
    id: vec[0].to_owned(),
    wxw_app_id: vec[1].to_owned(),
    wxw_app_id_lbl: vec[2].to_owned(),
    errcode: vec[3].to_owned(),
    errcode_lbl: vec[4].to_owned(),
    touser: vec[5].to_owned(),
    title: vec[6].to_owned(),
    description: vec[7].to_owned(),
    url: vec[8].to_owned(),
    btntxt: vec[9].to_owned(),
    create_time: vec[10].to_owned(),
    create_time_lbl: vec[11].to_owned(),
    errmsg: vec[12].to_owned(),
    msgid: vec[13].to_owned(),
  };
  Ok(field_comments)
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<WxwMsgSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwMsgModel>> {
  
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
  
  let model: Option<WxwMsgModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<WxwMsgModel>> {
  
  let search = WxwMsgSearch {
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
  search: WxwMsgSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwMsgModel>> {
  
  if let Some(id) = search.id {
    let model = find_by_id(
      ctx,
      id,
      None,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  Ok(vec![])
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
fn equals_by_unique(
  input: &WxwMsgInput,
  model: &WxwMsgModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  input: WxwMsgInput,
  model: WxwMsgModel,
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

#[allow(unused_variables)]
pub async fn set_id_by_lbl<'a>(
  ctx: &mut impl Ctx<'a>,
  input: WxwMsgInput,
) -> Result<WxwMsgInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(ctx, &vec![
    "wxw_msg_errcode",
  ]).await?;
  
  // 发送状态
  if input.errcode.is_none() {
    let errcode_dict = &dict_vec[0];
    if let Some(errcode_lbl) = input.errcode_lbl.clone() {
      input.errcode = errcode_dict.iter()
        .find(|item| {
          item.lbl == errcode_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 企微应用
  if input.wxw_app_id_lbl.is_some()
    && !input.wxw_app_id_lbl.as_ref().unwrap().is_empty()
    && input.wxw_app_id.is_none()
  {
    input.wxw_app_id_lbl = input.wxw_app_id_lbl.map(|item| 
      item.trim().to_owned()
    );
    let model = crate::gen::wxwork::wxw_app::wxw_app_dao::find_one(
      ctx,
      crate::gen::wxwork::wxw_app::wxw_app_model::WxwAppSearch {
        lbl: input.wxw_app_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      None,
    ).await?;
    if let Some(model) = model {
      input.wxw_app_id = model.id.into();
    }
  }
  
  Ok(input)
}

/// 创建数据
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  mut input: WxwMsgInput,
  options: Option<Options>,
) -> Result<String> {
  
  let table = "wxwork_wxw_msg";
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
  // 企微应用
  if let Some(wxw_app_id) = input.wxw_app_id {
    sql_fields += ",wxw_app_id";
    sql_values += ",?";
    args.push(wxw_app_id.into());
  }
  // 发送状态
  if let Some(errcode) = input.errcode {
    sql_fields += ",errcode";
    sql_values += ",?";
    args.push(errcode.into());
  }
  // 成员ID
  if let Some(touser) = input.touser {
    sql_fields += ",touser";
    sql_values += ",?";
    args.push(touser.into());
  }
  // 标题
  if let Some(title) = input.title {
    sql_fields += ",title";
    sql_values += ",?";
    args.push(title.into());
  }
  // 描述
  if let Some(description) = input.description {
    sql_fields += ",description";
    sql_values += ",?";
    args.push(description.into());
  }
  // 链接
  if let Some(url) = input.url {
    sql_fields += ",url";
    sql_values += ",?";
    args.push(url.into());
  }
  // 按钮文字
  if let Some(btntxt) = input.btntxt {
    sql_fields += ",btntxt";
    sql_values += ",?";
    args.push(btntxt.into());
  }
  // 错误信息
  if let Some(errmsg) = input.errmsg {
    sql_fields += ",errmsg";
    sql_values += ",?";
    args.push(errmsg.into());
  }
  // 消息ID
  if let Some(msgid) = input.msgid {
    sql_fields += ",msgid";
    sql_values += ",?";
    args.push(msgid.into());
  }
  
  let sql = format!(
    "insert into {} ({}) values ({})",
    table,
    sql_fields,
    sql_values,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  
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
  let table = "wxwork_wxw_msg";
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
  mut input: WxwMsgInput,
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
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<WxwMsgModel>>();
    
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
  
  let table = "wxwork_wxw_msg";
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
  // 企微应用
  if let Some(wxw_app_id) = input.wxw_app_id {
    field_num += 1;
    sql_fields += ",wxw_app_id = ?";
    args.push(wxw_app_id.into());
  }
  // 发送状态
  if let Some(errcode) = input.errcode {
    field_num += 1;
    sql_fields += ",errcode = ?";
    args.push(errcode.into());
  }
  // 成员ID
  if let Some(touser) = input.touser {
    field_num += 1;
    sql_fields += ",touser = ?";
    args.push(touser.into());
  }
  // 标题
  if let Some(title) = input.title {
    field_num += 1;
    sql_fields += ",title = ?";
    args.push(title.into());
  }
  // 描述
  if let Some(description) = input.description {
    field_num += 1;
    sql_fields += ",description = ?";
    args.push(description.into());
  }
  // 链接
  if let Some(url) = input.url {
    field_num += 1;
    sql_fields += ",url = ?";
    args.push(url.into());
  }
  // 按钮文字
  if let Some(btntxt) = input.btntxt {
    field_num += 1;
    sql_fields += ",btntxt = ?";
    args.push(btntxt.into());
  }
  // 错误信息
  if let Some(errmsg) = input.errmsg {
    field_num += 1;
    sql_fields += ",errmsg = ?";
    args.push(errmsg.into());
  }
  // 消息ID
  if let Some(msgid) = input.msgid {
    field_num += 1;
    sql_fields += ",msgid = ?";
    args.push(msgid.into());
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
  let table = "wxwork_wxw_msg";
  vec![
    table,
    "wxwork_wxw_app",
  ]
}

/// 根据 ids 删除数据
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_msg";
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
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_msg";
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
      
      let mut input: WxwMsgInput = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        ctx,
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<WxwMsgModel> = models.into_iter()
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
  
  let table = "wxwork_wxw_msg";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    
    let model = find_all(
      ctx,
      WxwMsgSearch {
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
  ctx: &mut impl Ctx<'a>,
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let msg0 = i18n_dao::ns(
      ctx,
      "企微消息".to_owned(),
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
