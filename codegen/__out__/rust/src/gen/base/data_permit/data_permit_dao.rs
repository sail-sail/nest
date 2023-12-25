use anyhow::Result;
use tracing::{info, error};
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
  del_caches,
};

use crate::src::base::i18n::i18n_dao;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use crate::src::base::dict_detail::dict_detail_dao::get_dict;

use super::data_permit_model::*;
use crate::gen::base::menu::menu_model::MenuId;
use crate::gen::base::usr::usr_model::UsrId;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<DataPermitSearch>,
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
    let id = match id {
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
    let ids: Vec<DataPermitId> = match &search {
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
      where_query += &format!(" and t.id in ({arg})");
    }
  }
  {
    let menu_id: Vec<MenuId> = match &search {
      Some(item) => item.menu_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !menu_id.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(menu_id.len());
        for item in menu_id {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and menu_id_lbl.id in ({})", arg);
    }
  }
  {
    let menu_id_is_null: bool = match &search {
      Some(item) => item.menu_id_is_null.unwrap_or(false),
      None => false,
    };
    if menu_id_is_null {
      where_query += " and menu_id_lbl.id is null";
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
    let scope: Vec<DataPermitScope> = match &search {
      Some(item) => item.scope.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !scope.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(scope.len());
        for item in scope {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.scope in ({})", arg);
    }
  }
  {
    let r#type: Vec<DataPermitType> = match &search {
      Some(item) => item.r#type.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !r#type.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(r#type.len());
        for item in r#type {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.type in ({})", arg);
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
    let create_usr_id: Vec<UsrId> = match &search {
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
    let update_usr_id: Vec<UsrId> = match &search {
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
  let from_query = r#"base_data_permit t
    left join base_menu menu_id_lbl
      on menu_id_lbl.id = t.menu_id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id"#.to_owned();
  Ok(from_query)
}

/// 根据搜索条件和分页查找数据权限列表
#[allow(unused_variables)]
pub async fn find_all(
  search: Option<DataPermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DataPermitModel>> {
  
  #[allow(unused_variables)]
  let table = "base_data_permit";
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
      ,menu_id_lbl.lbl menu_id_lbl
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
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let mut res: Vec<DataPermitModel> = query(
    sql,
    args,
    options,
  ).await?;
  
  let dict_vec = get_dict(&[
    "data_permit_scope",
    "data_permit_type",
  ]).await?;
  let [
    scope_dict,
    type_dict,
  ]: [Vec<_>; 2] = dict_vec
    .try_into()
    .map_err(|_| anyhow::anyhow!("dict_vec.len() != 3"))?;
  
  for model in &mut res {
    
    // 范围
    model.scope_lbl = {
      scope_dict
        .iter()
        .find(|item| item.val == model.scope.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.scope.to_string())
    };
    
    // 类型
    model.r#type_lbl = {
      r#type_dict
        .iter()
        .find(|item| item.val == model.r#type.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.r#type.to_string())
    };
    
  }
  
  Ok(res)
}

/// 根据条件查找数据权限总数
pub async fn find_count(
  search: Option<DataPermitSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "base_data_permit";
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
  
  let options = options.set_cache_key(table, &sql, &args);
  
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
  "/base/data_permit".to_owned()
}

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path().into(),
  }
}

/// 获取数据权限字段注释
pub async fn get_field_comments(
  _options: Option<Options>,
) -> Result<DataPermitFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "菜单".into(),
    "菜单".into(),
    "名称".into(),
    "范围".into(),
    "范围".into(),
    "类型".into(),
    "类型".into(),
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
  
  let field_comments = DataPermitFieldComment {
    id: vec[0].to_owned(),
    menu_id: vec[1].to_owned(),
    menu_id_lbl: vec[2].to_owned(),
    lbl: vec[3].to_owned(),
    scope: vec[4].to_owned(),
    scope_lbl: vec[5].to_owned(),
    r#type: vec[6].to_owned(),
    type_lbl: vec[7].to_owned(),
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

/// 根据条件查找第一个数据权限
pub async fn find_one(
  search: Option<DataPermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DataPermitModel>> {
  
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
  
  let model: Option<DataPermitModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据 id 查找数据权限
pub async fn find_by_id(
  id: DataPermitId,
  options: Option<Options>,
) -> Result<Option<DataPermitModel>> {
  
  let search = DataPermitSearch {
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

/// 根据搜索条件判断数据权限是否存在
pub async fn exists(
  search: Option<DataPermitSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let total = find_count(
    search,
    options,
  ).await?;
  
  Ok(total > 0)
}

/// 根据 id 判断数据权限是否存在
pub async fn exists_by_id(
  id: DataPermitId,
  options: Option<Options>,
) -> Result<bool> {
  
  let search = DataPermitSearch {
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
  search: DataPermitSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DataPermitModel>> {
  
  if let Some(id) = search.id {
    let model = find_by_id(
      id,
      None,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<DataPermitModel> = vec![];
  
  let mut models_tmp = {
    if
      search.menu_id.is_none() ||
      search.scope.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = DataPermitSearch {
      menu_id: search.menu_id,
      scope: search.scope,
      ..Default::default()
    };
    
    find_all(
      search.into(),
      None,
      sort.clone(),
      options.clone(),
    ).await?
  };
  models.append(&mut models_tmp);
  
  Ok(models)
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
fn equals_by_unique(
  input: &DataPermitInput,
  model: &DataPermitModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.menu_id.as_ref().is_some() && input.menu_id.as_ref().unwrap() == &model.menu_id &&
    input.scope.as_ref().is_some() && input.scope.as_ref().unwrap() == &model.scope
  {
    return true;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique(
  input: DataPermitInput,
  model: DataPermitModel,
  unique_type: UniqueType,
) -> Result<Option<DataPermitId>> {
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
  input: DataPermitInput,
) -> Result<DataPermitInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "data_permit_scope",
    "data_permit_type",
  ]).await?;
  
  // 范围
  if input.scope.is_none() {
    let scope_dict = &dict_vec[0];
    if let Some(scope_lbl) = input.scope_lbl.clone() {
      input.scope = scope_dict
        .iter()
        .find(|item| {
          item.lbl == scope_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 类型
  if input.r#type.is_none() {
    let type_dict = &dict_vec[1];
    if let Some(type_lbl) = input.type_lbl.clone() {
      input.r#type = type_dict
        .iter()
        .find(|item| {
          item.lbl == type_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 菜单
  if input.menu_id_lbl.is_some()
    && !input.menu_id_lbl.as_ref().unwrap().is_empty()
    && input.menu_id.is_none()
  {
    input.menu_id_lbl = input.menu_id_lbl.map(|item| 
      item.trim().to_owned()
    );
    let model = crate::gen::base::menu::menu_dao::find_one(
      crate::gen::base::menu::menu_model::MenuSearch {
        lbl: input.menu_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      None,
    ).await?;
    if let Some(model) = model {
      input.menu_id = model.id.into();
    }
  }
  
  Ok(input)
}

/// 创建数据权限
#[allow(unused_mut)]
pub async fn create(
  mut input: DataPermitInput,
  options: Option<Options>,
) -> Result<DataPermitId> {
  
  let table = "base_data_permit";
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
    
    let mut id: Option<DataPermitId> = None;
    
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
  
  let mut id: DataPermitId;
  loop {
    id = get_short_uuid().into();
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
  
  if let Some(auth_model) = get_auth_model() {
    let usr_id = auth_model.id;
    sql_fields += ",create_usr_id";
    sql_values += ",?";
    args.push(usr_id.into());
  }
  // 菜单
  if let Some(menu_id) = input.menu_id {
    sql_fields += ",menu_id";
    sql_values += ",?";
    args.push(menu_id.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    sql_fields += ",lbl";
    sql_values += ",?";
    args.push(lbl.into());
  }
  // 范围
  if let Some(scope) = input.scope {
    sql_fields += ",scope";
    sql_values += ",?";
    args.push(scope.into());
  }
  // 类型
  if let Some(r#type) = input.r#type {
    sql_fields += ",type";
    sql_values += ",?";
    args.push(r#type.into());
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
  // 系统字段
  if let Some(is_sys) = input.is_sys {
    sql_fields += ",is_sys";
    sql_values += ",?";
    args.push(is_sys.into());
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
  
  execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据 id 修改数据权限
#[allow(unused_mut)]
pub async fn update_by_id(
  id: DataPermitId,
  mut input: DataPermitInput,
  options: Option<Options>,
) -> Result<DataPermitId> {
  
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
      .collect::<Vec<DataPermitModel>>();
    
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
  
  let table = "base_data_permit";
  let _method = "update_by_id";
  
  let now = get_now();
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "update_time = ?".to_owned();
  args.push(now.into());
  
  let mut field_num: usize = 0;
  // 菜单
  if let Some(menu_id) = input.menu_id {
    field_num += 1;
    sql_fields += ",menu_id = ?";
    args.push(menu_id.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += ",lbl = ?";
    args.push(lbl.into());
  }
  // 范围
  if let Some(scope) = input.scope {
    field_num += 1;
    sql_fields += ",scope = ?";
    args.push(scope.into());
  }
  // 类型
  if let Some(r#type) = input.r#type {
    field_num += 1;
    sql_fields += ",type = ?";
    args.push(r#type.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    field_num += 1;
    sql_fields += ",rem = ?";
    args.push(rem.into());
  }
  // 系统字段
  if let Some(is_sys) = input.is_sys {
    field_num += 1;
    sql_fields += ",is_sys = ?";
    args.push(is_sys.into());
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
    
    let options = options.set_del_cache_key1s(get_foreign_tables());
    
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
  let table = "base_data_permit";
  vec![
    table,
    "base_menu",
    "base_usr",
  ]
}

/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache() -> Result<()> {
  let cache_key1s = get_foreign_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

/// 根据 ids 删除数据权限
pub async fn delete_by_ids(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_data_permit";
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
    
    let options = options.set_del_cache_key1s(get_foreign_tables());
    
    let options = options.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ids 还原数据权限
pub async fn revert_by_ids(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_data_permit";
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
    
    let options = options.set_del_cache_key1s(get_foreign_tables());
    
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
      
      let mut input: DataPermitInput = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<DataPermitModel> = models.into_iter()
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

/// 根据 ids 彻底删除数据权限
pub async fn force_delete_by_ids(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_data_permit";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let model = find_all(
      DataPermitSearch {
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
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 校验数据权限是否存在
#[function_name::named]
#[allow(dead_code)]
pub async fn validate_option<'a, T>(
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let msg0 = i18n_dao::ns(
      "数据权限".to_owned(),
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
