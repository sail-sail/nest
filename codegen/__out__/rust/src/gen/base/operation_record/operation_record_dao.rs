use anyhow::Result;

use crate::common::auth::auth_dao::get_password;
use crate::common::util::string::*;
use crate::common::util::dao::*;

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

use crate::common::gql::model::{PageInput, SortInput};

use super::operation_record_model::*;

fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<OperationRecordSearch>,
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
    let r#mod = match &search {
      Some(item) => item.r#mod.clone(),
      None => None,
    };
    if let Some(r#mod) = r#mod {
      where_query += &format!(" and t.r#mod = {}", args.push(r#mod.into()));
    }
    let r#mod_like = match &search {
      Some(item) => item.r#mod.clone(),
      None => None,
    };
    if let Some(r#mod_like) = r#mod_like {
      where_query += &format!(" and t.r#mod like {}", args.push((sql_like(&r#mod_like) + "%").into()));
    }
  }
  {
    let mod_lbl = match &search {
      Some(item) => item.mod_lbl.clone(),
      None => None,
    };
    if let Some(mod_lbl) = mod_lbl {
      where_query += &format!(" and t.mod_lbl = {}", args.push(mod_lbl.into()));
    }
    let mod_lbl_like = match &search {
      Some(item) => item.mod_lbl.clone(),
      None => None,
    };
    if let Some(mod_lbl_like) = mod_lbl_like {
      where_query += &format!(" and t.mod_lbl like {}", args.push((sql_like(&mod_lbl_like) + "%").into()));
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
      Some(item) => item.method.clone(),
      None => None,
    };
    if let Some(method_like) = method_like {
      where_query += &format!(" and t.method like {}", args.push((sql_like(&method_like) + "%").into()));
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
      Some(item) => item.method_lbl.clone(),
      None => None,
    };
    if let Some(method_lbl_like) = method_lbl_like {
      where_query += &format!(" and t.method_lbl like {}", args.push((sql_like(&method_lbl_like) + "%").into()));
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
    let create_usr_id: Vec<String> = match &search {
      Some(item) => item.create_usr_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !create_usr_id.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in create_usr_id {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and create_usr_id_lbl.id in ({})", arg);
    }
  }
  {
    let create_time: Vec<Option<String>> = match &search {
      Some(item) => item.create_time.clone().unwrap(),
      None => vec![],
    };
    let create_time_gt: Option<String> = match &create_time.len() {
      0 => None,
      _ => create_time[0].clone(),
    };
    let create_time_lt: Option<String> = match &create_time.len() {
      0 => None,
      1 => None,
      _ => create_time[1].clone(),
    };
    if let Some(create_time_gt) = create_time_gt {
      where_query += &format!(" and t.create_time >= {}", args.push(create_time_gt.into()));
    }
    if let Some(create_time_lt) = create_time_lt {
      where_query += &format!(" and t.create_time <= {}", args.push(create_time_lt.into()));
    }
  }
  {
    let update_usr_id: Vec<String> = match &search {
      Some(item) => item.update_usr_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !update_usr_id.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in update_usr_id {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and update_usr_id_lbl.id in ({})", arg);
    }
  }
  {
    let update_time: Vec<Option<String>> = match &search {
      Some(item) => item.update_time.clone().unwrap(),
      None => vec![],
    };
    let update_time_gt: Option<String> = match &update_time.len() {
      0 => None,
      _ => update_time[0].clone(),
    };
    let update_time_lt: Option<String> = match &update_time.len() {
      0 => None,
      1 => None,
      _ => update_time[1].clone(),
    };
    if let Some(update_time_gt) = update_time_gt {
      where_query += &format!(" and t.update_time >= {}", args.push(update_time_gt.into()));
    }
    if let Some(update_time_lt) = update_time_lt {
      where_query += &format!(" and t.update_time <= {}", args.push(update_time_lt.into()));
    }
  }
  where_query
}

fn get_from_query() -> &'static str {
  let from_query = r#"base_operation_record t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id"#;
  from_query
}

/// 根据搜索条件和分页查找数据
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<OperationRecordSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordModel>> {
  let table = "base_operation_record";
  let _method = "find_all";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query();
  let where_query = get_where_query(ctx, &mut args, search);
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
  
  let mut res: Vec<OperationRecordModel> = ctx.query(
    sql,
    args,
    options,
  ).await?;
  
  for model in &mut res {
    
  }
  
  Ok(res)
}

pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<OperationRecordSearch>,
  options: Option<Options>,
) -> Result<i64> {
  let table = "base_operation_record";
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
pub async fn get_field_comments() -> Result<OperationRecordFieldComment> {
  let field_comments = OperationRecordFieldComment {
    r#mod: "模块".to_owned(),
    mod_lbl: "模块名称".to_owned(),
    method: "方法".to_owned(),
    method_lbl: "方法名称".to_owned(),
    lbl: "操作".to_owned(),
    rem: "备注".to_owned(),
    create_usr_id: "创建人".to_owned(),
    create_usr_id_lbl: "创建人".to_owned(),
    create_time: "创建时间".to_owned(),
    update_usr_id: "更新人".to_owned(),
    update_usr_id_lbl: "更新人".to_owned(),
    update_time: "更新时间".to_owned(),
  };
  Ok(field_comments)
}

/// 获得表的唯一字段名列表
pub fn get_unique_keys() -> Vec<&'static str> {
  let unique_keys = vec![
  ];
  unique_keys
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<OperationRecordSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  
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
  
  let model: Option<OperationRecordModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  
  let search = OperationRecordSearch {
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

/// 通过唯一约束获得一行数据
pub async fn find_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  search: OperationRecordSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  Ok(None)
}

/// 根据唯一约束对比对象是否相等
pub fn equals_by_unique(
  input: OperationRecordInput,
  model: OperationRecordModel,
) -> bool {
  if input.id.is_some() {
    return input.id.unwrap() == model.id;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
pub async fn check_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  input: OperationRecordInput,
  model: OperationRecordModel,
  unique_type: UniqueType,
) -> Result<Option<String>> {
  Ok(None)
}

pub async fn set_id_by_lbl<'a>(
  ctx: &mut impl Ctx<'a>,
  input: OperationRecordInput,
) -> Result<OperationRecordInput> {
  let mut input = input;
  
  // if is_not_empty_opt(&input.default_dept_id_lbl) && input.default_dept_id.is_none() {
  //   input.default_dept_id_lbl = input.default_dept_id_lbl.map(|item| 
  //     item.trim().to_owned()
  //   );
  // }
  
  Ok(input)
}

/// 创建数据
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  mut input: OperationRecordInput,
  options: Option<Options>,
) -> Result<String> {
  
  let table = "base_operation_record";
  let _method = "create";
  
  let now = ctx.get_now();
  
  input = set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  let old_model = find_by_unique(
    ctx,
    input.clone().into(),
    None,
    None,
  ).await?;
  
  if old_model.is_some() {
    let id = check_by_unique(
      ctx,
      input.clone().into(),
      old_model.unwrap(),
      UniqueType::Throw,
    ).await?;
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
    sql_values += "?";
    args.push(tenant_id.into());
  }
  
  if let Some(auth_model) = ctx.get_auth_model() {
    let usr_id = auth_model.id;
    sql_fields += ",create_usr_id";
    sql_values += ",?";
    args.push(usr_id.into());
  }
  
  // 模块
  if let Some(r#mod) = input.r#mod {
    sql_fields += ",r#mod";
    sql_values += ",?";
    args.push(r#mod.into());
  }
  
  // 模块名称
  if let Some(mod_lbl) = input.mod_lbl {
    sql_fields += ",mod_lbl";
    sql_values += ",?";
    args.push(mod_lbl.into());
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
  
  let num = ctx.execute(
    sql,
    args,
    options,
  ).await?;
  
  if num != 1 {
    return Err(SrvErr::msg("创建失败".to_owned()).into());
  }
  
  Ok(id)
}
