use anyhow::Result;
use tracing::{info, error};
use crate::common::id::ID;
use crate::common::util::string::*;

#[allow(unused_imports)]
use crate::common::context::{
  get_auth_model,
  get_auth_id,
  get_auth_tenant_id,
  get_auth_org_id,
  execute,
  query,
  query_one,
  get_now,
  get_req_id,
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

use super::operation_record_model::*;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<OperationRecordSearch>,
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
    let ids: Vec<ID> = match &search {
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
        None => get_auth_tenant_id(),
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
    let module = match &search {
      Some(item) => item.module.clone(),
      None => None,
    };
    if let Some(module) = module {
      where_query += &format!(" and t.module = {}", args.push(module.into()));
    }
    let module_like = match &search {
      Some(item) => item.module_like.clone(),
      None => None,
    };
    if let Some(module_like) = module_like {
      where_query += &format!(
        " and t.module like {}",
        args.push(
          format!("%{}%", sql_like(&module_like)).into()
        ),
      );
    }
  }
  {
    let module_lbl = match &search {
      Some(item) => item.module_lbl.clone(),
      None => None,
    };
    if let Some(module_lbl) = module_lbl {
      where_query += &format!(" and t.module_lbl = {}", args.push(module_lbl.into()));
    }
    let module_lbl_like = match &search {
      Some(item) => item.module_lbl_like.clone(),
      None => None,
    };
    if let Some(module_lbl_like) = module_lbl_like {
      where_query += &format!(
        " and t.module_lbl like {}",
        args.push(
          format!("%{}%", sql_like(&module_lbl_like)).into()
        ),
      );
    }
  }
  {
    let method = match &search {
      Some(item) => item.method.clone(),
      None => None,
    };
    if let Some(method) = method {
      where_query += &format!(" and t.method = {}", args.push(method.into()));
    }
    let method_like = match &search {
      Some(item) => item.method_like.clone(),
      None => None,
    };
    if let Some(method_like) = method_like {
      where_query += &format!(
        " and t.method like {}",
        args.push(
          format!("%{}%", sql_like(&method_like)).into()
        ),
      );
    }
  }
  {
    let method_lbl = match &search {
      Some(item) => item.method_lbl.clone(),
      None => None,
    };
    if let Some(method_lbl) = method_lbl {
      where_query += &format!(" and t.method_lbl = {}", args.push(method_lbl.into()));
    }
    let method_lbl_like = match &search {
      Some(item) => item.method_lbl_like.clone(),
      None => None,
    };
    if let Some(method_lbl_like) = method_lbl_like {
      where_query += &format!(
        " and t.method_lbl like {}",
        args.push(
          format!("%{}%", sql_like(&method_lbl_like)).into()
        ),
      );
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
      where_query += &format!(
        " and t.lbl like {}",
        args.push(
          format!("%{}%", sql_like(&lbl_like)).into()
        ),
      );
    }
  }
  {
    let old_data = match &search {
      Some(item) => item.old_data.clone(),
      None => None,
    };
    if let Some(old_data) = old_data {
      where_query += &format!(" and t.old_data = {}", args.push(old_data.into()));
    }
    let old_data_like = match &search {
      Some(item) => item.old_data_like.clone(),
      None => None,
    };
    if let Some(old_data_like) = old_data_like {
      where_query += &format!(
        " and t.old_data like {}",
        args.push(
          format!("%{}%", sql_like(&old_data_like)).into()
        ),
      );
    }
  }
  {
    let new_data = match &search {
      Some(item) => item.new_data.clone(),
      None => None,
    };
    if let Some(new_data) = new_data {
      where_query += &format!(" and t.new_data = {}", args.push(new_data.into()));
    }
    let new_data_like = match &search {
      Some(item) => item.new_data_like.clone(),
      None => None,
    };
    if let Some(new_data_like) = new_data_like {
      where_query += &format!(
        " and t.new_data like {}",
        args.push(
          format!("%{}%", sql_like(&new_data_like)).into()
        ),
      );
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
      where_query += &format!(
        " and t.rem like {}",
        args.push(
          format!("%{}%", sql_like(&rem_like)).into()
        ),
      );
    }
  }
  {
    let create_usr_id: Vec<ID> = match &search {
      Some(item) => item.create_usr_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !create_usr_id.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(create_usr_id.len());
        for item in create_usr_id {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and create_usr_id_lbl.id in ({})", arg);
    }
  }
  {
    let create_usr_id_is_null: bool = match &search {
      Some(item) => item.create_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if create_usr_id_is_null {
      where_query += " and create_usr_id_lbl.id is null";
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
    let update_usr_id: Vec<ID> = match &search {
      Some(item) => item.update_usr_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !update_usr_id.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(update_usr_id.len());
        for item in update_usr_id {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and update_usr_id_lbl.id in ({})", arg);
    }
  }
  {
    let update_usr_id_is_null: bool = match &search {
      Some(item) => item.update_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if update_usr_id_is_null {
      where_query += " and update_usr_id_lbl.id is null";
    }
  }
  {
    let update_time: Vec<chrono::NaiveDateTime> = match &search {
      Some(item) => item.update_time.clone().unwrap_or_default(),
      None => vec![],
    };
    let update_time_gt: Option<chrono::NaiveDateTime> = match &update_time.len() {
      0 => None,
      _ => update_time[0].into(),
    };
    let update_time_lt: Option<chrono::NaiveDateTime> = match &update_time.len() {
      0 => None,
      1 => None,
      _ => update_time[1].into(),
    };
    if let Some(update_time_gt) = update_time_gt {
      where_query += &format!(" and t.update_time >= {}", args.push(update_time_gt.into()));
    }
    if let Some(update_time_lt) = update_time_lt {
      where_query += &format!(" and t.update_time <= {}", args.push(update_time_lt.into()));
    }
  }
  Ok(where_query)
}

async fn get_from_query() -> Result<String> {
  let from_query = r#"base_operation_record t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id"#.to_owned();
  Ok(from_query)
}

/// 根据搜索条件和分页查找数据
#[allow(unused_variables)]
pub async fn find_all(
  search: Option<OperationRecordSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordModel>> {
  
  #[allow(unused_variables)]
  let table = "base_operation_record";
  let _method = "find_all";
  
  let is_deleted = search.as_ref()
    .and_then(|item| item.is_deleted);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query().await?;
  let where_query = get_where_query(&mut args, search).await?;
  
  let mut sort = sort.unwrap_or_default();
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: "desc".into(),
    });
  }
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
      ,create_usr_id_lbl.lbl create_usr_id_lbl
      ,update_usr_id_lbl.lbl update_usr_id_lbl
    from
      {from_query}
    where
      {where_query}
    group by t.id{order_by_query}{page_query}
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.into();
  
  let mut res: Vec<OperationRecordModel> = query(
    sql,
    args,
    options,
  ).await?;
  
  for model in &mut res {
    
  }
  
  Ok(res)
}

/// 根据搜索条件查询数据总数
pub async fn find_count(
  search: Option<OperationRecordSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "base_operation_record";
  let _method = "find_count";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query().await?;
  let where_query = get_where_query(&mut args, search).await?;
  
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
  
  let res: Option<CountModel> = query_one(
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
  "/base/operation_record".to_owned()
}

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path().into(),
  }
}

/// 获取字段对应的国家化后的名称
pub async fn get_field_comments(
  _options: Option<Options>,
) -> Result<OperationRecordFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "模块".into(),
    "模块名称".into(),
    "方法".into(),
    "方法名称".into(),
    "操作".into(),
    "操作前数据".into(),
    "操作后数据".into(),
    "备注".into(),
    "创建人".into(),
    "创建人".into(),
    "创建时间".into(),
    "创建时间".into(),
    "更新人".into(),
    "更新人".into(),
    "更新时间".into(),
    "更新时间".into(),
  ];
  
  let map = n_route.n_batch(
    i18n_code_maps.clone(),
  ).await?;
  
  let vec = i18n_code_maps.into_iter()
    .map(|item|
      map.get(&item.code)
        .map(|item| item.to_owned())
        .unwrap_or_default()
    )
    .collect::<Vec<String>>();
  
  let field_comments = OperationRecordFieldComment {
    id: vec[0].to_owned(),
    module: vec[1].to_owned(),
    module_lbl: vec[2].to_owned(),
    method: vec[3].to_owned(),
    method_lbl: vec[4].to_owned(),
    lbl: vec[5].to_owned(),
    old_data: vec[6].to_owned(),
    new_data: vec[7].to_owned(),
    rem: vec[8].to_owned(),
    create_usr_id: vec[9].to_owned(),
    create_usr_id_lbl: vec[10].to_owned(),
    create_time: vec[11].to_owned(),
    create_time_lbl: vec[12].to_owned(),
    update_usr_id: vec[13].to_owned(),
    update_usr_id_lbl: vec[14].to_owned(),
    update_time: vec[15].to_owned(),
    update_time_lbl: vec[16].to_owned(),
  };
  Ok(field_comments)
}

/// 根据条件查找第一条数据
pub async fn find_one(
  search: Option<OperationRecordSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  
  let page = PageInput {
    pg_offset: 0.into(),
    pg_size: 1.into(),
  }.into();
  
  let res = find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<OperationRecordModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id(
  id: ID,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  
  let search = OperationRecordSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = find_one(
    search,
    None,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据搜索条件判断数据是否存在
pub async fn exists(
  search: Option<OperationRecordSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let total = find_count(
    search,
    options,
  ).await?;
  
  Ok(total > 0)
}

/// 根据ID判断数据是否存在
pub async fn exists_by_id(
  id: ID,
  options: Option<Options>,
) -> Result<bool> {
  
  let search = OperationRecordSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = exists(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique(
  search: OperationRecordSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordModel>> {
  
  if let Some(id) = search.id {
    let model = find_by_id(
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
  input: &OperationRecordInput,
  model: &OperationRecordModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique(
  input: OperationRecordInput,
  model: OperationRecordModel,
  unique_type: UniqueType,
) -> Result<Option<ID>> {
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
      model.id.clone(),
      input,
      Some(options),
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = i18n_dao::ns(
      "记录已经存在".to_owned(),
      None,
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  Ok(None)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables)]
pub async fn set_id_by_lbl(
  input: OperationRecordInput,
) -> Result<OperationRecordInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  Ok(input)
}

/// 创建数据
#[allow(unused_mut)]
pub async fn create(
  mut input: OperationRecordInput,
  options: Option<Options>,
) -> Result<ID> {
  
  let table = "base_operation_record";
  let _method = "create";
  
  if input.id.is_some() {
    return Err(SrvErr::msg(
      format!("Can not set id when create in dao: {table}")
    ).into());
  }
  
  let now = get_now();
  
  let old_models = find_by_unique(
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
    
    let mut id: Option<ID> = None;
    
    for old_model in old_models {
      
      id = check_by_unique(
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
      id.clone(),
      None,
    ).await?;
    if !is_exist {
      break;
    }
    error!(
      "{req_id} ID_COLLIDE: {table} {id}",
      req_id = get_req_id(),
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
  } else if let Some(tenant_id) = get_auth_tenant_id() {
    sql_fields += ",tenant_id";
    sql_values += ",?";
    args.push(tenant_id.into());
  }
  
  if let Some(auth_model) = get_auth_model() {
    let usr_id = auth_model.id;
    sql_fields += ",create_usr_id";
    sql_values += ",?";
    args.push(usr_id.into());
  }
  // 模块
  if let Some(module) = input.module {
    sql_fields += ",module";
    sql_values += ",?";
    args.push(module.into());
  }
  // 模块名称
  if let Some(module_lbl) = input.module_lbl {
    sql_fields += ",module_lbl";
    sql_values += ",?";
    args.push(module_lbl.into());
  }
  // 方法
  if let Some(method) = input.method {
    sql_fields += ",method";
    sql_values += ",?";
    args.push(method.into());
  }
  // 方法名称
  if let Some(method_lbl) = input.method_lbl {
    sql_fields += ",method_lbl";
    sql_values += ",?";
    args.push(method_lbl.into());
  }
  // 操作
  if let Some(lbl) = input.lbl {
    sql_fields += ",lbl";
    sql_values += ",?";
    args.push(lbl.into());
  }
  // 操作前数据
  if let Some(old_data) = input.old_data {
    sql_fields += ",old_data";
    sql_values += ",?";
    args.push(old_data.into());
  }
  // 操作后数据
  if let Some(new_data) = input.new_data {
    sql_fields += ",new_data";
    sql_values += ",?";
    args.push(new_data.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    sql_fields += ",rem";
    sql_values += ",?";
    args.push(rem.into());
  }
  // 更新人
  if let Some(update_usr_id) = input.update_usr_id {
    sql_fields += ",update_usr_id";
    sql_values += ",?";
    args.push(update_usr_id.into());
  }
  // 更新时间
  if let Some(update_time) = input.update_time {
    sql_fields += ",update_time";
    sql_values += ",?";
    args.push(update_time.into());
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
  
  execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据id修改租户id
pub async fn update_tenant_by_id(
  id: ID,
  tenant_id: ID,
  options: Option<Options>,
) -> Result<u64> {
  let table = "base_operation_record";
  let _method = "update_tenant_by_id";
  
  let mut args = QueryArgs::new();
  
  let sql_fields = "tenant_id = ?,update_time = ?";
  args.push(tenant_id.into());
  args.push(get_now().into());
  
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
  
  let num = execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据id修改数据
#[allow(unused_mut)]
pub async fn update_by_id(
  id: ID,
  mut input: OperationRecordInput,
  options: Option<Options>,
) -> Result<ID> {
  
  let old_model = find_by_id(
    id.clone(),
    None,
  ).await?;
  
  if old_model.is_none() {
    let err_msg = i18n_dao::ns(
      "数据已删除".to_owned(),
      None,
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique(
      input.into(),
      None,
      None,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<OperationRecordModel>>();
    
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
          "数据已经存在".to_owned(),
          None,
        ).await?;
        return Err(SrvErr::msg(err_msg).into());
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let table = "base_operation_record";
  let _method = "update_by_id";
  
  let now = get_now();
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "update_time = ?".to_owned();
  args.push(now.into());
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += ",tenant_id = ?";
    args.push(tenant_id.into());
  }
  // 模块
  if let Some(module) = input.module {
    field_num += 1;
    sql_fields += ",module = ?";
    args.push(module.into());
  }
  // 模块名称
  if let Some(module_lbl) = input.module_lbl {
    field_num += 1;
    sql_fields += ",module_lbl = ?";
    args.push(module_lbl.into());
  }
  // 方法
  if let Some(method) = input.method {
    field_num += 1;
    sql_fields += ",method = ?";
    args.push(method.into());
  }
  // 方法名称
  if let Some(method_lbl) = input.method_lbl {
    field_num += 1;
    sql_fields += ",method_lbl = ?";
    args.push(method_lbl.into());
  }
  // 操作
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += ",lbl = ?";
    args.push(lbl.into());
  }
  // 操作前数据
  if let Some(old_data) = input.old_data {
    field_num += 1;
    sql_fields += ",old_data = ?";
    args.push(old_data.into());
  }
  // 操作后数据
  if let Some(new_data) = input.new_data {
    field_num += 1;
    sql_fields += ",new_data = ?";
    args.push(new_data.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    field_num += 1;
    sql_fields += ",rem = ?";
    args.push(rem.into());
  }
  
  if field_num > 0 {
    
    if let Some(auth_model) = get_auth_model() {
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
    
    execute(
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
  let table = "base_operation_record";
  vec![
    table,
    "base_usr",
  ]
}

/// 根据 ids 删除数据
pub async fn delete_by_ids(
  ids: Vec<ID>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_operation_record";
  let _method = "delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=1,delete_time=? where id=? limit 1",
      table,
    );
    
    args.push(get_now().into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ids 还原数据
pub async fn revert_by_ids(
  ids: Vec<ID>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_operation_record";
  let _method = "revert_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=0 where id=? limit 1",
      table,
    );
    
    args.push(id.clone().into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
    // 检查数据的唯一索引
    {
      let old_model = find_by_id(
        id.clone(),
        None,
      ).await?;
      
      if old_model.is_none() {
        continue;
      }
      let old_model = old_model.unwrap();
      
      let mut input: OperationRecordInput = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<OperationRecordModel> = models.into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = i18n_dao::ns(
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
pub async fn force_delete_by_ids(
  ids: Vec<ID>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_operation_record";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let model = find_all(
      OperationRecordSearch {
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
    
    num += execute(
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
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let msg0 = i18n_dao::ns(
      "操作记录".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      "不存在".to_owned(),
      None,
    ).await?;
    let err_msg = msg0 + &msg1;
    return Err(SrvErr::new(function_name!().to_owned(), err_msg).into());
  }
  Ok(model.unwrap())
}
