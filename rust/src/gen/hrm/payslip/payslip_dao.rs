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

use super::payslip_model::*;

#[allow(unused_variables)]
async fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<PayslipSearch>,
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
    let pay_month: Vec<chrono::NaiveDate> = match &search {
      Some(item) => item.pay_month.clone().unwrap_or_default(),
      None => vec![],
    };
    let pay_month_gt: Option<chrono::NaiveDate> = match &pay_month.len() {
      0 => None,
      _ => pay_month[0].into(),
    };
    let pay_month_lt: Option<chrono::NaiveDate> = match &pay_month.len() {
      0 => None,
      1 => None,
      _ => pay_month[1].into(),
    };
    if let Some(pay_month_gt) = pay_month_gt {
      where_query += &format!(" and t.pay_month >= {}", args.push(pay_month_gt.into()));
    }
    if let Some(pay_month_lt) = pay_month_lt {
      where_query += &format!(" and t.pay_month <= {}", args.push(pay_month_lt.into()));
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
    let job_num = match &search {
      Some(item) => item.job_num.clone(),
      None => None,
    };
    if let Some(job_num) = job_num {
      where_query += &format!(" and t.job_num = {}", args.push(job_num.into()));
    }
    let job_num_like = match &search {
      Some(item) => item.job_num_like.clone(),
      None => None,
    };
    if let Some(job_num_like) = job_num_like {
      where_query += &format!(" and t.job_num like {}", args.push((sql_like(&job_num_like) + "%").into()));
    }
  }
  {
    let company = match &search {
      Some(item) => item.company.clone(),
      None => None,
    };
    if let Some(company) = company {
      where_query += &format!(" and t.company = {}", args.push(company.into()));
    }
    let company_like = match &search {
      Some(item) => item.company_like.clone(),
      None => None,
    };
    if let Some(company_like) = company_like {
      where_query += &format!(" and t.company like {}", args.push((sql_like(&company_like) + "%").into()));
    }
  }
  {
    let gross_pay = match &search {
      Some(item) => item.gross_pay.clone(),
      None => None,
    };
    if let Some(gross_pay) = gross_pay {
      where_query += &format!(" and t.gross_pay = {}", args.push(gross_pay.into()));
    }
    let gross_pay_like = match &search {
      Some(item) => item.gross_pay_like.clone(),
      None => None,
    };
    if let Some(gross_pay_like) = gross_pay_like {
      where_query += &format!(" and t.gross_pay like {}", args.push((sql_like(&gross_pay_like) + "%").into()));
    }
  }
  {
    let social_security = match &search {
      Some(item) => item.social_security.clone(),
      None => None,
    };
    if let Some(social_security) = social_security {
      where_query += &format!(" and t.social_security = {}", args.push(social_security.into()));
    }
    let social_security_like = match &search {
      Some(item) => item.social_security_like.clone(),
      None => None,
    };
    if let Some(social_security_like) = social_security_like {
      where_query += &format!(" and t.social_security like {}", args.push((sql_like(&social_security_like) + "%").into()));
    }
  }
  {
    let individual_tax = match &search {
      Some(item) => item.individual_tax.clone(),
      None => None,
    };
    if let Some(individual_tax) = individual_tax {
      where_query += &format!(" and t.individual_tax = {}", args.push(individual_tax.into()));
    }
    let individual_tax_like = match &search {
      Some(item) => item.individual_tax_like.clone(),
      None => None,
    };
    if let Some(individual_tax_like) = individual_tax_like {
      where_query += &format!(" and t.individual_tax like {}", args.push((sql_like(&individual_tax_like) + "%").into()));
    }
  }
  {
    let self_pay = match &search {
      Some(item) => item.self_pay.clone(),
      None => None,
    };
    if let Some(self_pay) = self_pay {
      where_query += &format!(" and t.self_pay = {}", args.push(self_pay.into()));
    }
    let self_pay_like = match &search {
      Some(item) => item.self_pay_like.clone(),
      None => None,
    };
    if let Some(self_pay_like) = self_pay_like {
      where_query += &format!(" and t.self_pay like {}", args.push((sql_like(&self_pay_like) + "%").into()));
    }
  }
  {
    let net_pay = match &search {
      Some(item) => item.net_pay.clone(),
      None => None,
    };
    if let Some(net_pay) = net_pay {
      where_query += &format!(" and t.net_pay = {}", args.push(net_pay.into()));
    }
    let net_pay_like = match &search {
      Some(item) => item.net_pay_like.clone(),
      None => None,
    };
    if let Some(net_pay_like) = net_pay_like {
      where_query += &format!(" and t.net_pay like {}", args.push((sql_like(&net_pay_like) + "%").into()));
    }
  }
  {
    let is_send: Vec<u8> = match &search {
      Some(item) => item.is_send.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !is_send.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(is_send.len());
        for item in is_send {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.is_send in ({})", arg);
    }
  }
  {
    let is_confirm: Vec<u8> = match &search {
      Some(item) => item.is_confirm.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !is_confirm.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(is_confirm.len());
        for item in is_confirm {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.is_confirm in ({})", arg);
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
  {
    let create_usr_id: Vec<String> = match &search {
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
    let update_usr_id: Vec<String> = match &search {
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
  let from_query = r#"hrm_payslip t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id"#.to_owned();
  Ok(from_query)
}

/// 根据搜索条件和分页查找数据
#[allow(unused_variables)]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<PayslipSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<PayslipModel>> {
  
  #[allow(unused_variables)]
  let table = "hrm_payslip";
  let _method = "find_all";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query().await?;
  let where_query = get_where_query(ctx, &mut args, search).await?;
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
  
  let mut res: Vec<PayslipModel> = ctx.query(
    sql,
    args,
    options,
  ).await?;
  
  let dict_vec = get_dict(ctx, &vec![
    "yes_no",
    "yes_no",
    "is_locked",
  ]).await?;
  
  let is_send_dict = &dict_vec[0];
  let is_confirm_dict = &dict_vec[1];
  let is_locked_dict = &dict_vec[2];
  
  for model in &mut res {
    
    // 已发送
    model.is_send_lbl = {
      is_send_dict.iter()
        .find(|item| item.val == model.is_send.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_send.to_string())
    };
    
    // 已确认
    model.is_confirm_lbl = {
      is_confirm_dict.iter()
        .find(|item| item.val == model.is_confirm.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_confirm.to_string())
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

/// 根据搜索条件查询数据总数
pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<PayslipSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "hrm_payslip";
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
  "/hrm/payslip".to_owned()
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
) -> Result<PayslipFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "发放月份".into(),
    "发放月份".into(),
    "姓名".into(),
    "工号".into(),
    "公司".into(),
    "应发工资(元)".into(),
    "代缴社保(元)".into(),
    "代缴个税(元)".into(),
    "个人自付(元)".into(),
    "实发工资(元)".into(),
    "已发送".into(),
    "已发送".into(),
    "已确认".into(),
    "已确认".into(),
    "锁定".into(),
    "锁定".into(),
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
  
  let field_comments = PayslipFieldComment {
    id: vec[0].to_owned(),
    pay_month: vec[1].to_owned(),
    pay_month_lbl: vec[2].to_owned(),
    lbl: vec[3].to_owned(),
    job_num: vec[4].to_owned(),
    company: vec[5].to_owned(),
    gross_pay: vec[6].to_owned(),
    social_security: vec[7].to_owned(),
    individual_tax: vec[8].to_owned(),
    self_pay: vec[9].to_owned(),
    net_pay: vec[10].to_owned(),
    is_send: vec[11].to_owned(),
    is_send_lbl: vec[12].to_owned(),
    is_confirm: vec[13].to_owned(),
    is_confirm_lbl: vec[14].to_owned(),
    is_locked: vec[15].to_owned(),
    is_locked_lbl: vec[16].to_owned(),
    rem: vec[17].to_owned(),
    create_usr_id: vec[18].to_owned(),
    create_usr_id_lbl: vec[19].to_owned(),
    create_time: vec[20].to_owned(),
    create_time_lbl: vec[21].to_owned(),
    update_usr_id: vec[22].to_owned(),
    update_usr_id_lbl: vec[23].to_owned(),
    update_time: vec[24].to_owned(),
    update_time_lbl: vec[25].to_owned(),
  };
  Ok(field_comments)
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<PayslipSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<PayslipModel>> {
  
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
  
  let model: Option<PayslipModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<PayslipModel>> {
  
  let search = PayslipSearch {
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
  search: PayslipSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<PayslipModel>> {
  
  if let Some(id) = search.id {
    let model = find_by_id(
      ctx,
      id,
      None,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<PayslipModel> = vec![];
  
  let mut models_tmp = {
    if
      search.pay_month.is_none() ||
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = PayslipSearch {
      pay_month: search.pay_month,
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
  input: &PayslipInput,
  model: &PayslipModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.pay_month.as_ref().is_some() && input.pay_month.as_ref().unwrap() == &model.pay_month &&
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
  input: PayslipInput,
  model: PayslipModel,
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
  input: PayslipInput,
) -> Result<PayslipInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(ctx, &vec![
    "yes_no",
    "yes_no",
    "is_locked",
  ]).await?;
  
  // 已发送
  if input.is_send.is_none() {
    let is_send_dict = &dict_vec[0];
    if let Some(is_send_lbl) = input.is_send_lbl.clone() {
      input.is_send = is_send_dict.iter()
        .find(|item| {
          item.lbl == is_send_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 已确认
  if input.is_confirm.is_none() {
    let is_confirm_dict = &dict_vec[1];
    if let Some(is_confirm_lbl) = input.is_confirm_lbl.clone() {
      input.is_confirm = is_confirm_dict.iter()
        .find(|item| {
          item.lbl == is_confirm_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 锁定
  if input.is_locked.is_none() {
    let is_locked_dict = &dict_vec[2];
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
  
  Ok(input)
}

/// 创建数据
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  mut input: PayslipInput,
  options: Option<Options>,
) -> Result<String> {
  
  validate(
    &input,
  )?;
  
  let table = "hrm_payslip";
  let _method = "create";
  
  let is_encrypt = options.as_ref()
    .map(|item|
      item.get_is_encrypt()
    )
    .unwrap_or(true);
  if is_encrypt {
    // 应发工资(元)
    if input.gross_pay.is_some() {
      input.gross_pay = input.gross_pay.as_ref().map(|item| {
        encrypt(item)
      });
    }
    // 代缴社保(元)
    if input.social_security.is_some() {
      input.social_security = input.social_security.as_ref().map(|item| {
        encrypt(item)
      });
    }
    // 代缴个税(元)
    if input.individual_tax.is_some() {
      input.individual_tax = input.individual_tax.as_ref().map(|item| {
        encrypt(item)
      });
    }
    // 个人自付(元)
    if input.self_pay.is_some() {
      input.self_pay = input.self_pay.as_ref().map(|item| {
        encrypt(item)
      });
    }
    // 实发工资(元)
    if input.net_pay.is_some() {
      input.net_pay = input.net_pay.as_ref().map(|item| {
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
  // 发放月份
  if let Some(pay_month) = input.pay_month {
    sql_fields += ",pay_month";
    sql_values += ",?";
    args.push(pay_month.into());
  }
  // 姓名
  if let Some(lbl) = input.lbl {
    sql_fields += ",lbl";
    sql_values += ",?";
    args.push(lbl.into());
  }
  // 工号
  if let Some(job_num) = input.job_num {
    sql_fields += ",job_num";
    sql_values += ",?";
    args.push(job_num.into());
  }
  // 公司
  if let Some(company) = input.company {
    sql_fields += ",company";
    sql_values += ",?";
    args.push(company.into());
  }
  // 应发工资(元)
  if let Some(gross_pay) = input.gross_pay {
    sql_fields += ",gross_pay";
    sql_values += ",?";
    args.push(gross_pay.into());
  }
  // 代缴社保(元)
  if let Some(social_security) = input.social_security {
    sql_fields += ",social_security";
    sql_values += ",?";
    args.push(social_security.into());
  }
  // 代缴个税(元)
  if let Some(individual_tax) = input.individual_tax {
    sql_fields += ",individual_tax";
    sql_values += ",?";
    args.push(individual_tax.into());
  }
  // 个人自付(元)
  if let Some(self_pay) = input.self_pay {
    sql_fields += ",self_pay";
    sql_values += ",?";
    args.push(self_pay.into());
  }
  // 实发工资(元)
  if let Some(net_pay) = input.net_pay {
    sql_fields += ",net_pay";
    sql_values += ",?";
    args.push(net_pay.into());
  }
  // 已发送
  if let Some(is_send) = input.is_send {
    sql_fields += ",is_send";
    sql_values += ",?";
    args.push(is_send.into());
  }
  // 已确认
  if let Some(is_confirm) = input.is_confirm {
    sql_fields += ",is_confirm";
    sql_values += ",?";
    args.push(is_confirm.into());
  }
  // 锁定
  if let Some(is_locked) = input.is_locked {
    sql_fields += ",is_locked";
    sql_values += ",?";
    args.push(is_locked.into());
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
  let table = "hrm_payslip";
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
  mut input: PayslipInput,
  options: Option<Options>,
) -> Result<String> {
  
  let is_encrypt = options.as_ref()
    .map(|item|
      item.get_is_encrypt()
    )
    .unwrap_or(true);
  if is_encrypt {
    // 应发工资(元)
    if input.gross_pay.is_some() {
      input.gross_pay = input.gross_pay.as_ref().map(|item| {
        encrypt(item)
      });
    }
    // 代缴社保(元)
    if input.social_security.is_some() {
      input.social_security = input.social_security.as_ref().map(|item| {
        encrypt(item)
      });
    }
    // 代缴个税(元)
    if input.individual_tax.is_some() {
      input.individual_tax = input.individual_tax.as_ref().map(|item| {
        encrypt(item)
      });
    }
    // 个人自付(元)
    if input.self_pay.is_some() {
      input.self_pay = input.self_pay.as_ref().map(|item| {
        encrypt(item)
      });
    }
    // 实发工资(元)
    if input.net_pay.is_some() {
      input.net_pay = input.net_pay.as_ref().map(|item| {
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
      .collect::<Vec<PayslipModel>>();
    
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
  
  let table = "hrm_payslip";
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
  // 发放月份
  if let Some(pay_month) = input.pay_month {
    field_num += 1;
    sql_fields += ",pay_month = ?";
    args.push(pay_month.into());
  }
  // 姓名
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += ",lbl = ?";
    args.push(lbl.into());
  }
  // 工号
  if let Some(job_num) = input.job_num {
    field_num += 1;
    sql_fields += ",job_num = ?";
    args.push(job_num.into());
  }
  // 公司
  if let Some(company) = input.company {
    field_num += 1;
    sql_fields += ",company = ?";
    args.push(company.into());
  }
  // 应发工资(元)
  if let Some(gross_pay) = input.gross_pay {
    field_num += 1;
    sql_fields += ",gross_pay = ?";
    args.push(gross_pay.into());
  }
  // 代缴社保(元)
  if let Some(social_security) = input.social_security {
    field_num += 1;
    sql_fields += ",social_security = ?";
    args.push(social_security.into());
  }
  // 代缴个税(元)
  if let Some(individual_tax) = input.individual_tax {
    field_num += 1;
    sql_fields += ",individual_tax = ?";
    args.push(individual_tax.into());
  }
  // 个人自付(元)
  if let Some(self_pay) = input.self_pay {
    field_num += 1;
    sql_fields += ",self_pay = ?";
    args.push(self_pay.into());
  }
  // 实发工资(元)
  if let Some(net_pay) = input.net_pay {
    field_num += 1;
    sql_fields += ",net_pay = ?";
    args.push(net_pay.into());
  }
  // 已发送
  if let Some(is_send) = input.is_send {
    field_num += 1;
    sql_fields += ",is_send = ?";
    args.push(is_send.into());
  }
  // 已确认
  if let Some(is_confirm) = input.is_confirm {
    field_num += 1;
    sql_fields += ",is_confirm = ?";
    args.push(is_confirm.into());
  }
  // 锁定
  if let Some(is_locked) = input.is_locked {
    field_num += 1;
    sql_fields += ",is_locked = ?";
    args.push(is_locked.into());
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
  let table = "hrm_payslip";
  vec![
    table,
    "base_usr",
  ]
}

/// 根据 ids 删除数据
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "hrm_payslip";
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
  
  let table = "hrm_payslip";
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
  
  let table = "hrm_payslip";
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
      
      let mut input: PayslipInput = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        ctx,
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<PayslipModel> = models.into_iter()
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
  
  let table = "hrm_payslip";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    
    let model = find_all(
      ctx,
      PayslipSearch {
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
      "工资条".to_owned(),
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
  input: &PayslipInput,
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
  
  // 姓名
  chars_max_length(
    input.lbl.clone(),
    22,
    "",
  )?;
  
  // 工号
  chars_max_length(
    input.job_num.clone(),
    22,
    "",
  )?;
  
  // 公司
  chars_max_length(
    input.company.clone(),
    22,
    "",
  )?;
  
  // 应发工资(元)
  chars_max_length(
    input.gross_pay.clone(),
    66,
    "",
  )?;
  
  // 代缴社保(元)
  chars_max_length(
    input.social_security.clone(),
    66,
    "",
  )?;
  
  // 代缴个税(元)
  chars_max_length(
    input.individual_tax.clone(),
    66,
    "",
  )?;
  
  // 个人自付(元)
  chars_max_length(
    input.self_pay.clone(),
    66,
    "",
  )?;
  
  // 实发工资(元)
  chars_max_length(
    input.net_pay.clone(),
    66,
    "",
  )?;
  
  // 备注
  chars_max_length(
    input.rem.clone(),
    88,
    "",
  )?;
  
  // 创建人
  chars_max_length(
    input.create_usr_id.clone(),
    22,
    "",
  )?;
  
  // 更新人
  chars_max_length(
    input.update_usr_id.clone(),
    22,
    "",
  )?;
  
  Ok(())
}
