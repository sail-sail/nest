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
  OrderByModel,
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

use super::options_model::*;
use crate::gen::base::usr::usr_model::UsrId;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<OptionsSearch>,
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
    let ids: Vec<OptionsId> = match &search {
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
    let ky = match &search {
      Some(item) => item.ky.clone(),
      None => None,
    };
    if let Some(ky) = ky {
      where_query += &format!(" and t.ky = {}", args.push(ky.into()));
    }
    let ky_like = match &search {
      Some(item) => item.ky_like.clone(),
      None => None,
    };
    if let Some(ky_like) = ky_like {
      where_query += &format!(
        " and t.ky like {}",
        args.push(
          format!("%{}%", sql_like(&ky_like)).into()
        ),
      );
    }
  }
  {
    let val = match &search {
      Some(item) => item.val.clone(),
      None => None,
    };
    if let Some(val) = val {
      where_query += &format!(" and t.val = {}", args.push(val.into()));
    }
    let val_like = match &search {
      Some(item) => item.val_like.clone(),
      None => None,
    };
    if let Some(val_like) = val_like {
      where_query += &format!(
        " and t.val like {}",
        args.push(
          format!("%{}%", sql_like(&val_like)).into()
        ),
      );
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
      where_query += &format!(
        " and t.rem like {}",
        args.push(
          format!("%{}%", sql_like(&rem_like)).into()
        ),
      );
    }
  }
  {
    let version: Vec<u32> = match &search {
      Some(item) => item.version.clone().unwrap_or_default(),
      None => vec![],
    };
    let version_gt: Option<u32> = match &version.len() {
      0 => None,
      _ => version[0].into(),
    };
    let version_lt: Option<u32> = match &version.len() {
      0 => None,
      1 => None,
      _ => version[1].into(),
    };
    if let Some(version_gt) = version_gt {
      where_query += &format!(" and t.version >= {}", args.push(version_gt.into()));
    }
    if let Some(version_lt) = version_lt {
      where_query += &format!(" and t.version <= {}", args.push(version_lt.into()));
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
  let from_query = r#"base_options t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id"#.to_owned();
  Ok(from_query)
}

/// 根据搜索条件和分页查找系统选项列表
#[allow(unused_variables)]
pub async fn find_all(
  search: Option<OptionsSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OptionsModel>> {
  
  #[allow(unused_variables)]
  let table = "base_options";
  let _method = "find_all";
  
  let is_deleted = search.as_ref()
    .and_then(|item| item.is_deleted);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query().await?;
  let where_query = get_where_query(&mut args, search).await?;
  
  let mut sort = sort.unwrap_or_default();
  if !sort.iter().any(|item| item.prop == "order_by") {
    sort.push(SortInput {
      prop: "order_by".into(),
      order: "asc".into(),
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
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let mut res: Vec<OptionsModel> = query(
    sql,
    args,
    options,
  ).await?;
  
  let dict_vec = get_dict(&[
    "is_locked",
    "is_enabled",
  ]).await?;
  let [
    is_locked_dict,
    is_enabled_dict,
  ]: [Vec<_>; 2] = dict_vec
    .try_into()
    .map_err(|_| anyhow::anyhow!("dict_vec.len() != 3"))?;
  
  for model in &mut res {
    
    // 锁定
    model.is_locked_lbl = {
      is_locked_dict
        .iter()
        .find(|item| item.val == model.is_locked.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_locked.to_string())
    };
    
    // 启用
    model.is_enabled_lbl = {
      is_enabled_dict
        .iter()
        .find(|item| item.val == model.is_enabled.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_enabled.to_string())
    };
    
  }
  
  Ok(res)
}

/// 根据条件查找系统选项总数
pub async fn find_count(
  search: Option<OptionsSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "base_options";
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
  "/base/options".to_owned()
}

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path().into(),
  }
}

/// 获取系统选项字段注释
pub async fn get_field_comments(
  _options: Option<Options>,
) -> Result<OptionsFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "名称".into(),
    "键".into(),
    "值".into(),
    "锁定".into(),
    "锁定".into(),
    "启用".into(),
    "启用".into(),
    "排序".into(),
    "备注".into(),
    "版本号".into(),
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
  
  let field_comments = OptionsFieldComment {
    id: vec[0].to_owned(),
    lbl: vec[1].to_owned(),
    ky: vec[2].to_owned(),
    val: vec[3].to_owned(),
    is_locked: vec[4].to_owned(),
    is_locked_lbl: vec[5].to_owned(),
    is_enabled: vec[6].to_owned(),
    is_enabled_lbl: vec[7].to_owned(),
    order_by: vec[8].to_owned(),
    rem: vec[9].to_owned(),
    version: vec[10].to_owned(),
    create_usr_id: vec[11].to_owned(),
    create_usr_id_lbl: vec[12].to_owned(),
    create_time: vec[13].to_owned(),
    create_time_lbl: vec[14].to_owned(),
    update_usr_id: vec[15].to_owned(),
    update_usr_id_lbl: vec[16].to_owned(),
    update_time: vec[17].to_owned(),
    update_time_lbl: vec[18].to_owned(),
  };
  Ok(field_comments)
}

/// 根据条件查找第一个系统选项
pub async fn find_one(
  search: Option<OptionsSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OptionsModel>> {
  
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
  
  let model: Option<OptionsModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据 id 查找系统选项
pub async fn find_by_id(
  id: OptionsId,
  options: Option<Options>,
) -> Result<Option<OptionsModel>> {
  
  let search = OptionsSearch {
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

/// 根据搜索条件判断系统选项是否存在
pub async fn exists(
  search: Option<OptionsSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let total = find_count(
    search,
    options,
  ).await?;
  
  Ok(total > 0)
}

/// 根据 id 判断系统选项是否存在
pub async fn exists_by_id(
  id: OptionsId,
  options: Option<Options>,
) -> Result<bool> {
  
  let search = OptionsSearch {
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
  search: OptionsSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OptionsModel>> {
  
  if let Some(id) = search.id {
    let model = find_by_id(
      id,
      None,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<OptionsModel> = vec![];
  
  let mut models_tmp = {
    if
      search.lbl.is_none() ||
      search.ky.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = OptionsSearch {
      lbl: search.lbl,
      ky: search.ky,
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
  input: &OptionsInput,
  model: &OptionsModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.lbl.as_ref().is_some() && input.lbl.as_ref().unwrap() == &model.lbl &&
    input.ky.as_ref().is_some() && input.ky.as_ref().unwrap() == &model.ky
  {
    return true;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique(
  input: OptionsInput,
  model: OptionsModel,
  unique_type: UniqueType,
) -> Result<Option<OptionsId>> {
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
  input: OptionsInput,
) -> Result<OptionsInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "is_locked",
    "is_enabled",
  ]).await?;
  
  // 锁定
  if input.is_locked.is_none() {
    let is_locked_dict = &dict_vec[0];
    if let Some(is_locked_lbl) = input.is_locked_lbl.clone() {
      input.is_locked = is_locked_dict
        .iter()
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
      input.is_enabled = is_enabled_dict
        .iter()
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

/// 创建系统选项
#[allow(unused_mut)]
pub async fn create(
  mut input: OptionsInput,
  options: Option<Options>,
) -> Result<OptionsId> {
  
  let table = "base_options";
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
    
    let mut id: Option<OptionsId> = None;
    
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
  
  let mut id: OptionsId;
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
  // 名称
  if let Some(lbl) = input.lbl {
    sql_fields += ",lbl";
    sql_values += ",?";
    args.push(lbl.into());
  }
  // 键
  if let Some(ky) = input.ky {
    sql_fields += ",ky";
    sql_values += ",?";
    args.push(ky.into());
  }
  // 值
  if let Some(val) = input.val {
    sql_fields += ",val";
    sql_values += ",?";
    args.push(val.into());
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
  // 版本号
  if let Some(version) = input.version {
    sql_fields += ",version";
    sql_values += ",?";
    args.push(version.into());
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

pub async fn get_version_by_id(
  id: OptionsId,
) -> Result<Option<u32>> {
  
  let model = find_by_id(id, None).await?;
  
  if let Some(model) = model {
    return Ok(model.version.into());
  }
  
  Ok(0.into())
}

/// 根据 id 修改系统选项
#[allow(unused_mut)]
pub async fn update_by_id(
  id: OptionsId,
  mut input: OptionsInput,
  options: Option<Options>,
) -> Result<OptionsId> {
  
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
      .collect::<Vec<OptionsModel>>();
    
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
  
  let table = "base_options";
  let _method = "update_by_id";
  
  let now = get_now();
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "update_time = ?".to_owned();
  args.push(now.into());
  
  let mut field_num: usize = 0;
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += ",lbl = ?";
    args.push(lbl.into());
  }
  // 键
  if let Some(ky) = input.ky {
    field_num += 1;
    sql_fields += ",ky = ?";
    args.push(ky.into());
  }
  // 值
  if let Some(val) = input.val {
    field_num += 1;
    sql_fields += ",val = ?";
    args.push(val.into());
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
  // 版本号
  if let Some(version) = input.version {
    field_num += 1;
    sql_fields += ",version = ?";
    args.push(version.into());
  }
  // 系统字段
  if let Some(is_sys) = input.is_sys {
    field_num += 1;
    sql_fields += ",is_sys = ?";
    args.push(is_sys.into());
  }
  
  if field_num > 0 {
    
    if let Some(version) = input.version {
      if version > 0 {
        let version2 = get_version_by_id(id.clone()).await?;
        if let Some(version2) = version2 {
          if version2 > version {
            let err_msg = i18n_dao::ns(
              "数据已被修改，请刷新后重试".to_owned(),
              None,
            ).await?;
            return Err(SrvErr::msg(err_msg).into());
          }
        }
        sql_fields += ",version = ?";
        args.push((version + 1).into());
      }
    }
    
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
  let table = "base_options";
  vec![
    table,
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

/// 根据 ids 删除系统选项
pub async fn delete_by_ids(
  ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_options";
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

/// 根据 id 查找系统选项是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id(
  id: OptionsId,
  options: Option<Options>,
) -> Result<bool> {
  
  let model = find_by_id(id, options).await?;
  
  let is_enabled = {
    if let Some(model) = model {
      model.is_enabled == 1
    } else {
      false
    }
  };
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用系统选项
pub async fn enable_by_ids(
  ids: Vec<OptionsId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_options";
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
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 根据 id 查找系统选项是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id(
  id: OptionsId,
  options: Option<Options>,
) -> Result<bool> {
  
  let model = find_by_id(id, options).await?;
  
  let is_locked = {
    if let Some(model) = model {
      model.is_locked == 1
    } else {
      false
    }
  };
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁系统选项
pub async fn lock_by_ids(
  ids: Vec<OptionsId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_options";
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
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ids 还原系统选项
pub async fn revert_by_ids(
  ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_options";
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
      
      let mut input: OptionsInput = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<OptionsModel> = models.into_iter()
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

/// 根据 ids 彻底删除系统选项
pub async fn force_delete_by_ids(
  ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_options";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let model = find_all(
      OptionsSearch {
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

/// 查找 系统选项 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let table = "base_options";
  let _method = "find_last_order_by";
  
  #[allow(unused_mut)]
  let mut args = QueryArgs::new();
  let mut sql_where = "".to_owned();
  
  sql_where += "t.is_deleted = 0";
  
  let sql = format!(
    "select t.order_by order_by from {} t where {} order by t.order_by desc limit 1",
    table,
    sql_where,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let model = query_one::<OrderByModel>(
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

/// 校验系统选项是否启用
#[function_name::named]
#[allow(dead_code)]
pub async fn validate_is_enabled(
  model: &OptionsModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let msg0 = i18n_dao::ns(
      "系统选项".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      "已禁用".to_owned(),
      None,
    ).await?;
    let err_msg = msg0 + &msg1;
    return Err(SrvErr::new(function_name!().to_owned(), err_msg).into());
  }
  Ok(())
}

/// 校验系统选项是否存在
#[function_name::named]
#[allow(dead_code)]
pub async fn validate_option<'a, T>(
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let msg0 = i18n_dao::ns(
      "系统选项".to_owned(),
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
