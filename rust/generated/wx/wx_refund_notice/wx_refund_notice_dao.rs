
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use serde::{Serialize, Deserialize};
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

#[allow(unused_imports)]
use smol_str::SmolStr;

use color_eyre::eyre::{Result, eyre};
#[allow(unused_imports)]
use tracing::{info, error};
#[allow(unused_imports)]
use crate::common::util::string::sql_like;
#[allow(unused_imports)]
use crate::common::gql::model::SortOrderEnum;

#[allow(unused_imports)]
use crate::common::context::{
  get_auth_id,
  get_auth_tenant_id,
  execute,
  query,
  query_one,
  get_now,
  get_req_id,
  QueryArgs,
  Options,
  FIND_ALL_IDS_LIMIT,
  MAX_SAFE_INTEGER,
  find_all_result_limit,
  CountModel,
  UniqueType,
  get_short_uuid,
  get_order_by_query,
  get_page_query,
  del_caches,
  get_is_debug,
  get_is_silent_mode,
  get_is_creating,
};
use crate::common::exceptions::service_exception::ServiceException;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use crate::common::dict_detail::dict_detail_dao::get_dict;

use super::wx_refund_notice_model::*;

use crate::base::tenant::tenant_model::TenantId;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&WxRefundNoticeSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let mut where_query = String::with_capacity(80 * 16 * 2);
  
  where_query.push_str(" 1=1");
  {
    let id = match search {
      Some(item) => item.id.as_ref(),
      None => None,
    };
    if let Some(id) = id {
      where_query.push_str(" and t.id=?");
      args.push(id.into());
    }
  }
  {
    let ids: Option<Vec<WxRefundNoticeId>> = match search {
      Some(item) => item.ids.clone(),
      None => None,
    };
    if let Some(ids) = ids {
      let arg = {
        if ids.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(ids.len());
          for id in ids {
            args.push(id.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let tenant_id = {
      let tenant_id = match search {
        Some(item) => item.tenant_id,
        None => None,
      };
      match tenant_id {
        None => get_auth_tenant_id(),
        Some(item) => match item.as_str() {
          "" => None,
          _ => item.into(),
        },
      }
    };
    if let Some(tenant_id) = tenant_id {
      where_query.push_str(" and t.tenant_id=?");
      args.push(tenant_id.into());
    }
  }
  // 开发者ID
  {
    let appid = match search {
      Some(item) => item.appid.clone(),
      None => None,
    };
    if let Some(appid) = appid {
      where_query.push_str(" and t.appid=?");
      args.push(appid.into());
    }
    let appid_like = match search {
      Some(item) => item.appid_like.clone(),
      None => None,
    };
    if let Some(appid_like) = appid_like && !appid_like.is_empty() {
      where_query.push_str(" and t.appid like ?");
      args.push(format!("%{}%", sql_like(&appid_like)).into());
    }
  }
  // 商户号
  {
    let mchid = match search {
      Some(item) => item.mchid.clone(),
      None => None,
    };
    if let Some(mchid) = mchid {
      where_query.push_str(" and t.mchid=?");
      args.push(mchid.into());
    }
    let mchid_like = match search {
      Some(item) => item.mchid_like.clone(),
      None => None,
    };
    if let Some(mchid_like) = mchid_like && !mchid_like.is_empty() {
      where_query.push_str(" and t.mchid like ?");
      args.push(format!("%{}%", sql_like(&mchid_like)).into());
    }
  }
  // 商户订单号
  {
    let out_trade_no = match search {
      Some(item) => item.out_trade_no.clone(),
      None => None,
    };
    if let Some(out_trade_no) = out_trade_no {
      where_query.push_str(" and t.out_trade_no=?");
      args.push(out_trade_no.into());
    }
    let out_trade_no_like = match search {
      Some(item) => item.out_trade_no_like.clone(),
      None => None,
    };
    if let Some(out_trade_no_like) = out_trade_no_like && !out_trade_no_like.is_empty() {
      where_query.push_str(" and t.out_trade_no like ?");
      args.push(format!("%{}%", sql_like(&out_trade_no_like)).into());
    }
  }
  // 微信支付订单号
  {
    let transaction_id = match search {
      Some(item) => item.transaction_id.clone(),
      None => None,
    };
    if let Some(transaction_id) = transaction_id {
      where_query.push_str(" and t.transaction_id=?");
      args.push(transaction_id.into());
    }
    let transaction_id_like = match search {
      Some(item) => item.transaction_id_like.clone(),
      None => None,
    };
    if let Some(transaction_id_like) = transaction_id_like && !transaction_id_like.is_empty() {
      where_query.push_str(" and t.transaction_id like ?");
      args.push(format!("%{}%", sql_like(&transaction_id_like)).into());
    }
  }
  // 商户退款单号
  {
    let out_refund_no = match search {
      Some(item) => item.out_refund_no.clone(),
      None => None,
    };
    if let Some(out_refund_no) = out_refund_no {
      where_query.push_str(" and t.out_refund_no=?");
      args.push(out_refund_no.into());
    }
    let out_refund_no_like = match search {
      Some(item) => item.out_refund_no_like.clone(),
      None => None,
    };
    if let Some(out_refund_no_like) = out_refund_no_like && !out_refund_no_like.is_empty() {
      where_query.push_str(" and t.out_refund_no like ?");
      args.push(format!("%{}%", sql_like(&out_refund_no_like)).into());
    }
  }
  // 微信退款单号
  {
    let refund_id = match search {
      Some(item) => item.refund_id.clone(),
      None => None,
    };
    if let Some(refund_id) = refund_id {
      where_query.push_str(" and t.refund_id=?");
      args.push(refund_id.into());
    }
    let refund_id_like = match search {
      Some(item) => item.refund_id_like.clone(),
      None => None,
    };
    if let Some(refund_id_like) = refund_id_like && !refund_id_like.is_empty() {
      where_query.push_str(" and t.refund_id like ?");
      args.push(format!("%{}%", sql_like(&refund_id_like)).into());
    }
  }
  // 退款状态
  {
    let refund_status: Option<Vec<WxRefundNoticeRefundStatus>> = match search {
      Some(item) => item.refund_status.clone(),
      None => None,
    };
    if let Some(refund_status) = refund_status {
      let arg = {
        if refund_status.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(refund_status.len());
          for item in refund_status {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.refund_status in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 退款成功时间
  {
    let mut success_time = match search {
      Some(item) => item.success_time.unwrap_or_default(),
      None => Default::default(),
    };
    let success_time_gt = success_time[0].take();
    let success_time_lt = success_time[1].take();
    if let Some(success_time_gt) = success_time_gt {
      where_query.push_str(" and t.success_time >= ?");
      args.push(success_time_gt.into());
    }
    if let Some(success_time_lt) = success_time_lt {
      where_query.push_str(" and t.success_time <= ?");
      args.push(success_time_lt.into());
    }
  }
  // 退款入账账户
  {
    let user_received_account = match search {
      Some(item) => item.user_received_account.clone(),
      None => None,
    };
    if let Some(user_received_account) = user_received_account {
      where_query.push_str(" and t.user_received_account=?");
      args.push(user_received_account.into());
    }
    let user_received_account_like = match search {
      Some(item) => item.user_received_account_like.clone(),
      None => None,
    };
    if let Some(user_received_account_like) = user_received_account_like && !user_received_account_like.is_empty() {
      where_query.push_str(" and t.user_received_account like ?");
      args.push(format!("%{}%", sql_like(&user_received_account_like)).into());
    }
  }
  // 订单金额(分)
  {
    let mut amount_total = match search {
      Some(item) => item.amount_total.unwrap_or_default(),
      None => Default::default(),
    };
    let amount_total_gt = amount_total[0].take();
    let amount_total_lt = amount_total[1].take();
    if let Some(amount_total_gt) = amount_total_gt {
      where_query.push_str(" and t.amount_total >= ?");
      args.push(amount_total_gt.into());
    }
    if let Some(amount_total_lt) = amount_total_lt {
      where_query.push_str(" and t.amount_total <= ?");
      args.push(amount_total_lt.into());
    }
  }
  // 退款金额(分)
  {
    let mut amount_refund = match search {
      Some(item) => item.amount_refund.unwrap_or_default(),
      None => Default::default(),
    };
    let amount_refund_gt = amount_refund[0].take();
    let amount_refund_lt = amount_refund[1].take();
    if let Some(amount_refund_gt) = amount_refund_gt {
      where_query.push_str(" and t.amount_refund >= ?");
      args.push(amount_refund_gt.into());
    }
    if let Some(amount_refund_lt) = amount_refund_lt {
      where_query.push_str(" and t.amount_refund <= ?");
      args.push(amount_refund_lt.into());
    }
  }
  // 用户实际支付金额(分)
  {
    let mut amount_payer_total = match search {
      Some(item) => item.amount_payer_total.unwrap_or_default(),
      None => Default::default(),
    };
    let amount_payer_total_gt = amount_payer_total[0].take();
    let amount_payer_total_lt = amount_payer_total[1].take();
    if let Some(amount_payer_total_gt) = amount_payer_total_gt {
      where_query.push_str(" and t.amount_payer_total >= ?");
      args.push(amount_payer_total_gt.into());
    }
    if let Some(amount_payer_total_lt) = amount_payer_total_lt {
      where_query.push_str(" and t.amount_payer_total <= ?");
      args.push(amount_payer_total_lt.into());
    }
  }
  // 用户退款金额(分)
  {
    let mut amount_payer_refund = match search {
      Some(item) => item.amount_payer_refund.unwrap_or_default(),
      None => Default::default(),
    };
    let amount_payer_refund_gt = amount_payer_refund[0].take();
    let amount_payer_refund_lt = amount_payer_refund[1].take();
    if let Some(amount_payer_refund_gt) = amount_payer_refund_gt {
      where_query.push_str(" and t.amount_payer_refund >= ?");
      args.push(amount_payer_refund_gt.into());
    }
    if let Some(amount_payer_refund_lt) = amount_payer_refund_lt {
      where_query.push_str(" and t.amount_payer_refund <= ?");
      args.push(amount_payer_refund_lt.into());
    }
  }
  // 创建时间
  {
    let mut create_time = match search {
      Some(item) => item.create_time.unwrap_or_default(),
      None => Default::default(),
    };
    let create_time_gt = create_time[0].take();
    let create_time_lt = create_time[1].take();
    if let Some(create_time_gt) = create_time_gt {
      where_query.push_str(" and t.create_time >= ?");
      args.push(create_time_gt.into());
    }
    if let Some(create_time_lt) = create_time_lt {
      where_query.push_str(" and t.create_time <= ?");
      args.push(create_time_lt.into());
    }
  }
  Ok(where_query)
}

#[allow(unused_variables)]
async fn get_from_query(
  args: &mut QueryArgs,
  search: Option<&WxRefundNoticeSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"wx_wx_refund_notice t"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_wx_refund_notice
/// 根据搜索条件和分页查找微信退款通知列表
#[allow(unused_mut, unused_variables)]
pub async fn find_all_wx_refund_notice(
  search: Option<WxRefundNoticeSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeModel>> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "find_all_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(page) = &page {
      msg += &format!(" page: {page:?}");
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids_limit = options
    .as_ref()
    .and_then(|x| x.get_ids_limit())
    .unwrap_or(FIND_ALL_IDS_LIMIT);
  
  if let Some(search) = &search {
    if let Some(id) = &search.id && id.is_empty() {
      return Ok(vec![]);
    }
    if let Some(ids) = &search.ids && ids.is_empty() {
      return Ok(vec![]);
    }
  }
  // 退款状态
  if let Some(search) = &search && let Some(refund_status) = &search.refund_status {
    let len = refund_status.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.refund_status.length > {ids_limit}"));
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let mut sort = sort.unwrap_or_default();
  
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: SortOrderEnum::Desc,
    });
  }
  
  let order_by_query = get_order_by_query(Some(sort));
  let is_result_limit = page.as_ref()
    .and_then(|item| item.is_result_limit)
    .unwrap_or(true);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let mut res: Vec<WxRefundNoticeModel> = query(
    sql,
    args,
    options,
  ).await?;
  
  let len = res.len();
  let result_limit_num = find_all_result_limit();
  
  if is_result_limit && len > result_limit_num {
    return Err(eyre!(
      ServiceException {
        message: format!("{table}.{method}: result length {len} > {result_limit_num}").into(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let dict_vec = get_dict(&[
    "wx_refund_status",
  ]).await?;
  let [
    refund_status_dict,
  ]: [Vec<_>; 1] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 退款状态
    model.refund_status_lbl = {
      refund_status_dict
        .iter()
        .find(|item| item.val == model.refund_status.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.refund_status.clone().into())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_wx_refund_notice
/// 根据条件查找微信退款通知总数
pub async fn find_count_wx_refund_notice(
  search: Option<WxRefundNoticeSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "find_count_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(0);
    }
    if search.ids.is_some() && search.ids.as_ref().unwrap().is_empty() {
      return Ok(0);
    }
  }
  // 退款状态
  if let Some(search) = &search && search.refund_status.is_some() {
    let len = search.refund_status.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.refund_status.length > {ids_limit}"));
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"select count(1) total from(select 1 from {from_query} where {where_query} group by t.id) t"#);
  
  let args = args.into();
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let res: Option<CountModel> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  let total = res
    .map(|item| item.total)
    .unwrap_or_default();
  
  if total > MAX_SAFE_INTEGER {
    return Err(eyre!("total > MAX_SAFE_INTEGER"));
  }
  
  Ok(total)
}

// MARK: get_field_comments_wx_refund_notice
/// 获取微信退款通知字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_wx_refund_notice(
  _options: Option<Options>,
) -> Result<WxRefundNoticeFieldComment> {
  
  let mut field_comments = WxRefundNoticeFieldComment {
    id: "ID".into(),
    appid: "开发者ID".into(),
    mchid: "商户号".into(),
    out_trade_no: "商户订单号".into(),
    transaction_id: "微信支付订单号".into(),
    out_refund_no: "商户退款单号".into(),
    refund_id: "微信退款单号".into(),
    refund_status: "退款状态".into(),
    refund_status_lbl: "退款状态".into(),
    success_time: "退款成功时间".into(),
    success_time_lbl: "退款成功时间".into(),
    user_received_account: "退款入账账户".into(),
    amount_total: "订单金额(分)".into(),
    amount_refund: "退款金额(分)".into(),
    amount_payer_total: "用户实际支付金额(分)".into(),
    amount_payer_refund: "用户退款金额(分)".into(),
    create_time: "创建时间".into(),
    create_time_lbl: "创建时间".into(),
  };
  Ok(field_comments)
}

// MARK: find_one_ok_wx_refund_notice
/// 根据条件查找第一个微信退款通知, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_wx_refund_notice(
  search: Option<WxRefundNoticeSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxRefundNoticeModel> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "find_one_ok_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let wx_refund_notice_model = find_one_wx_refund_notice(
    search,
    sort,
    options,
  ).await?;
  
  let Some(wx_refund_notice_model) = wx_refund_notice_model else {
    let err_msg = "此 微信退款通知 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(wx_refund_notice_model)
}

// MARK: find_one_wx_refund_notice
/// 根据条件查找第一个微信退款通知
#[allow(dead_code)]
pub async fn find_one_wx_refund_notice(
  search: Option<WxRefundNoticeSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxRefundNoticeModel>> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "find_one_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search && search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
    return Ok(None);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let page = Some(PageInput {
    pg_offset: Some(0),
    pg_size: Some(1),
    is_result_limit: Some(true),
  });
  
  let res = find_all_wx_refund_notice(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<WxRefundNoticeModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_wx_refund_notice
/// 根据 id 查找微信退款通知, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_wx_refund_notice(
  id: WxRefundNoticeId,
  options: Option<Options>,
) -> Result<WxRefundNoticeModel> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "find_by_id_ok_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let wx_refund_notice_model = find_by_id_wx_refund_notice(
    id,
    options,
  ).await?;
  
  let Some(wx_refund_notice_model) = wx_refund_notice_model else {
    let err_msg = SmolStr::new("此 微信退款通知 已被删除");
    error!(
      "{req_id} {err_msg} id: {id:?}",
      req_id = get_req_id(),
    );
    return Err(eyre!(ServiceException {
      message: err_msg,
      trace: true,
      ..Default::default()
    }));
  };
  
  Ok(wx_refund_notice_model)
}

// MARK: find_by_id_wx_refund_notice
/// 根据 id 查找微信退款通知
pub async fn find_by_id_wx_refund_notice(
  id: WxRefundNoticeId,
  options: Option<Options>,
) -> Result<Option<WxRefundNoticeModel>> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "find_by_id_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if id.is_empty() {
    return Ok(None);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let search = WxRefundNoticeSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let wx_refund_notice_model = find_one_wx_refund_notice(
    search,
    None,
    options,
  ).await?;
  
  Ok(wx_refund_notice_model)
}

// MARK: find_by_ids_ok_wx_refund_notice
/// 根据 ids 查找微信退款通知, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_wx_refund_notice(
  ids: Vec<WxRefundNoticeId>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeModel>> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "find_by_ids_ok_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(vec![]);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let len = ids.len();
  
  if len > FIND_ALL_IDS_LIMIT {
    return Err(eyre!(
      ServiceException {
        message: "ids.length > FIND_ALL_IDS_LIMIT".into(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let wx_refund_notice_models = find_by_ids_wx_refund_notice(
    ids.clone(),
    options,
  ).await?;
  
  if wx_refund_notice_models.len() != len {
    let err_msg = SmolStr::new("此 微信退款通知 已被删除");
    return Err(eyre!(err_msg));
  }
  
  let wx_refund_notice_models = ids
    .into_iter()
    .map(|id| {
      let model = wx_refund_notice_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = SmolStr::new("此 微信退款通知 已经被删除");
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<WxRefundNoticeModel>>>()?;
  
  Ok(wx_refund_notice_models)
}

// MARK: find_by_ids_wx_refund_notice
/// 根据 ids 查找微信退款通知
#[allow(dead_code)]
pub async fn find_by_ids_wx_refund_notice(
  ids: Vec<WxRefundNoticeId>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeModel>> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "find_by_ids_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(vec![]);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let len = ids.len();
  
  if len > FIND_ALL_IDS_LIMIT {
    return Err(eyre!(
      ServiceException {
        message: "ids.length > FIND_ALL_IDS_LIMIT".into(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let search = WxRefundNoticeSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let wx_refund_notice_models = find_all_wx_refund_notice(
    search,
    None,
    None,
    options,
  ).await?;
  
  let wx_refund_notice_models = ids
    .into_iter()
    .filter_map(|id| {
      wx_refund_notice_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<WxRefundNoticeModel>>();
  
  Ok(wx_refund_notice_models)
}

// MARK: exists_wx_refund_notice
/// 根据搜索条件判断微信退款通知是否存在
#[allow(dead_code)]
pub async fn exists_wx_refund_notice(
  search: Option<WxRefundNoticeSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "exists_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(false);
    }
    if search.ids.is_some() && search.ids.as_ref().unwrap().is_empty() {
      return Ok(false);
    }
  }
  // 退款状态
  if let Some(search) = &search && search.refund_status.is_some() {
    let len = search.refund_status.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.refund_status.length > {ids_limit}"));
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"select exists(select 1 from {from_query} where {where_query} group by t.id)"#);
  
  let args = args.into();
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let res: Option<(bool,)> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  Ok(res
    .map(|item| item.0)
    .unwrap_or_default())
}

// MARK: exists_by_id_wx_refund_notice
/// 根据 id 判断微信退款通知是否存在
#[allow(dead_code)]
pub async fn exists_by_id_wx_refund_notice(
  id: WxRefundNoticeId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "exists_by_id_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let search = WxRefundNoticeSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_wx_refund_notice(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_wx_refund_notice
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_wx_refund_notice(
  search: WxRefundNoticeSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeModel>> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "find_by_unique_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" search: {search:?}");
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  if let Some(id) = search.id {
    let model = find_by_id_wx_refund_notice(
      id,
      options,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  Ok(vec![])
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code, unused_variables)]
pub fn equals_by_unique(
  input: &WxRefundNoticeInput,
  model: &WxRefundNoticeModel,
  options: Option<&Options>,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  let is_silent_mode = get_is_silent_mode(options);
  false
}

// MARK: check_by_unique_wx_refund_notice
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_wx_refund_notice(
  input: WxRefundNoticeInput,
  model: WxRefundNoticeModel,
  options: Option<Options>,
) -> Result<Option<WxRefundNoticeId>> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "check_by_unique_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {input:?}");
    msg += &format!(" model: {model:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let is_equals = equals_by_unique(
    &input,
    &model,
    options.as_ref(),
  );
  if !is_equals {
    return Ok(None);
  }
  
  let unique_type = options
    .as_ref()
    .and_then(|item| item.get_unique_type())
    .unwrap_or_default();
  
  if unique_type == UniqueType::Ignore {
    return Ok(None);
  }
  if unique_type == UniqueType::Update {
    let id = update_by_id_wx_refund_notice(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "微信退款通知 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_wx_refund_notice
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_wx_refund_notice(
  input: WxRefundNoticeInput,
) -> Result<WxRefundNoticeInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  // 退款成功时间
  if input.success_time.is_none() && let Some(success_time_lbl) = input.success_time_lbl.as_ref().filter(|s| !s.is_empty()) {
    input.success_time = chrono::NaiveDateTime::parse_from_str(success_time_lbl, "%Y-%m-%d %H:%M:%S").ok();
    if input.success_time.is_none() {
      input.success_time = chrono::NaiveDateTime::parse_from_str(success_time_lbl, "%Y-%m-%d").ok();
    }
    if input.success_time.is_none() {
      let field_comments = get_field_comments_wx_refund_notice(
        None,
      ).await?;
      let column_comment = field_comments.success_time;
      
      let err_msg = "日期格式错误";
      return Err(eyre!("{column_comment} {err_msg}"));
    }
  }
  
  let dict_vec = get_dict(&[
    "wx_refund_status",
  ]).await?;
  
  // 退款状态
  if input.refund_status.is_none() {
    let refund_status_dict = &dict_vec[0];
    if let Some(refund_status_lbl) = input.refund_status_lbl.clone() {
      input.refund_status = refund_status_dict
        .iter()
        .find(|item| {
          item.lbl == refund_status_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 退款状态
  if
    input.refund_status_lbl.is_some() && !input.refund_status_lbl.as_ref().unwrap().is_empty()
    && input.refund_status.is_none()
  {
    let refund_status_dict = &dict_vec[0];
    let dict_model = refund_status_dict.iter().find(|item| {
      item.lbl == input.refund_status_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.refund_status = val.parse::<WxRefundNoticeRefundStatus>()?.into();
    }
  } else if
    (input.refund_status_lbl.is_none() || input.refund_status_lbl.as_ref().unwrap().is_empty())
    && input.refund_status.is_some()
  {
    let refund_status_dict = &dict_vec[0];
    let dict_model = refund_status_dict.iter().find(|item| {
      item.val == input.refund_status.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.refund_status_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return_wx_refund_notice
/// 批量创建微信退款通知并返回
#[allow(dead_code)]
pub async fn creates_return_wx_refund_notice(
  inputs: Vec<WxRefundNoticeInput>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeModel>> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "creates_return_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {inputs:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids = _creates(
    inputs.clone(),
    options,
  ).await?;
  
  let models_wx_refund_notice = find_by_ids_wx_refund_notice(
    ids,
    options,
  ).await?;
  
  Ok(models_wx_refund_notice)
}

// MARK: creates_wx_refund_notice
/// 批量创建微信退款通知
pub async fn creates_wx_refund_notice(
  inputs: Vec<WxRefundNoticeInput>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeId>> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "creates_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {inputs:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids = _creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 批量创建微信退款通知
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<WxRefundNoticeInput>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeId>> {
  
  let table = get_table_name_wx_refund_notice();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<WxRefundNoticeId> = vec![];
  let mut inputs2: Vec<WxRefundNoticeInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_wx_refund_notice(
      input.clone().into(),
      None,
      options,
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<WxRefundNoticeId> = None;
      
      for old_model in old_models {
        let options = Options::from(options)
          .set_unique_type(unique_type);
        
        id = check_by_unique_wx_refund_notice(
          input.clone(),
          old_model,
          Some(options),
        ).await?;
        
        if id.is_some() {
          break;
        }
      }
      if let Some(id) = id {
        ids2.push(id);
        continue;
      }
      inputs2.push(input);
    } else {
      inputs2.push(input);
    }
    
  }
  
  if inputs2.is_empty() {
    return Ok(ids2);
  }
    
  let mut args = QueryArgs::new();
  let mut sql_fields = String::with_capacity(80 * 16 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",tenant_id";
  // 开发者ID
  sql_fields += ",appid";
  // 商户号
  sql_fields += ",mchid";
  // 商户订单号
  sql_fields += ",out_trade_no";
  // 微信支付订单号
  sql_fields += ",transaction_id";
  // 商户退款单号
  sql_fields += ",out_refund_no";
  // 微信退款单号
  sql_fields += ",refund_id";
  // 退款状态
  sql_fields += ",refund_status";
  // 退款成功时间
  sql_fields += ",success_time";
  // 退款入账账户
  sql_fields += ",user_received_account";
  // 订单金额(分)
  sql_fields += ",amount_total";
  // 退款金额(分)
  sql_fields += ",amount_refund";
  // 用户实际支付金额(分)
  sql_fields += ",amount_payer_total";
  // 用户退款金额(分)
  sql_fields += ",amount_payer_refund";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 16 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: WxRefundNoticeId = get_short_uuid().into();
    ids2.push(id);
    
    inputs2_ids.push(id);
    
    sql_values += "(?";
    args.push(id.into());
    
    if !is_silent_mode {
      if let Some(create_time) = input.create_time {
        sql_values += ",?";
        args.push(create_time.into());
      } else if input.create_time_save_null == Some(true) {
        sql_values += ",null";
      } else {
        sql_values += ",?";
        args.push(get_now().into());
      }
    } else if let Some(create_time) = input.create_time {
      sql_values += ",?";
      args.push(create_time.into());
    } else {
      sql_values += ",null";
    }
    
    if let Some(tenant_id) = input.tenant_id {
      sql_values += ",?";
      args.push(tenant_id.into());
    } else if let Some(tenant_id) = get_auth_tenant_id() {
      sql_values += ",?";
      args.push(tenant_id.into());
    } else {
      sql_values += ",default";
    }
    // 开发者ID
    if let Some(appid) = input.appid {
      sql_values += ",?";
      args.push(appid.into());
    } else {
      sql_values += ",default";
    }
    // 商户号
    if let Some(mchid) = input.mchid {
      sql_values += ",?";
      args.push(mchid.into());
    } else {
      sql_values += ",default";
    }
    // 商户订单号
    if let Some(out_trade_no) = input.out_trade_no {
      sql_values += ",?";
      args.push(out_trade_no.into());
    } else {
      sql_values += ",default";
    }
    // 微信支付订单号
    if let Some(transaction_id) = input.transaction_id {
      sql_values += ",?";
      args.push(transaction_id.into());
    } else {
      sql_values += ",default";
    }
    // 商户退款单号
    if let Some(out_refund_no) = input.out_refund_no {
      sql_values += ",?";
      args.push(out_refund_no.into());
    } else {
      sql_values += ",default";
    }
    // 微信退款单号
    if let Some(refund_id) = input.refund_id {
      sql_values += ",?";
      args.push(refund_id.into());
    } else {
      sql_values += ",default";
    }
    // 退款状态
    if let Some(refund_status) = input.refund_status {
      sql_values += ",?";
      args.push(refund_status.into());
    } else {
      sql_values += ",default";
    }
    // 退款成功时间
    if let Some(success_time) = input.success_time {
      sql_values += ",?";
      args.push(success_time.into());
    } else if input.success_time_save_null == Some(true) {
      sql_values += ",null";
    } else {
      sql_values += ",default";
    }
    // 退款入账账户
    if let Some(user_received_account) = input.user_received_account {
      sql_values += ",?";
      args.push(user_received_account.into());
    } else {
      sql_values += ",default";
    }
    // 订单金额(分)
    if let Some(amount_total) = input.amount_total {
      sql_values += ",?";
      args.push(amount_total.into());
    } else {
      sql_values += ",default";
    }
    // 退款金额(分)
    if let Some(amount_refund) = input.amount_refund {
      sql_values += ",?";
      args.push(amount_refund.into());
    } else {
      sql_values += ",default";
    }
    // 用户实际支付金额(分)
    if let Some(amount_payer_total) = input.amount_payer_total {
      sql_values += ",?";
      args.push(amount_payer_total.into());
    } else {
      sql_values += ",default";
    }
    // 用户退款金额(分)
    if let Some(amount_payer_refund) = input.amount_payer_refund {
      sql_values += ",?";
      args.push(amount_payer_refund.into());
    } else {
      sql_values += ",default";
    }
    
    sql_values.push(')');
    if i < inputs2_len - 1 {
      sql_values.push(',');
    }
    
  }
  
  let sql = format!("insert into {table} ({sql_fields}) values {sql_values}");
  
  let args: Vec<_> = args.into();
  
  let affected_rows = execute(
    sql,
    args,
    options,
  ).await?;
  
  if affected_rows != inputs2_len as u64 {
    return Err(eyre!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  
  Ok(ids2)
}

// MARK: create_return_wx_refund_notice
/// 创建微信退款通知并返回
#[allow(dead_code)]
pub async fn create_return_wx_refund_notice(
  #[allow(unused_mut)]
  mut input: WxRefundNoticeInput,
  options: Option<Options>,
) -> Result<WxRefundNoticeModel> {
  
  let id = create_wx_refund_notice(
    input.clone(),
    options,
  ).await?;
  
  let model_wx_refund_notice = find_by_id_wx_refund_notice(
    id,
    options,
  ).await?;
  
  let model_wx_refund_notice = match model_wx_refund_notice {
    Some(model) => model,
    None => {
      let err_msg = "create_return_wx_refund_notice: model_wx_refund_notice.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.into(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_wx_refund_notice)
}

// MARK: create_wx_refund_notice
/// 创建微信退款通知
#[allow(dead_code)]
pub async fn create_wx_refund_notice(
  #[allow(unused_mut)]
  mut input: WxRefundNoticeInput,
  options: Option<Options>,
) -> Result<WxRefundNoticeId> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "create_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {input:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids = _creates(
    vec![input],
    options,
  ).await?;
  
  if ids.is_empty() {
    return Err(eyre!("_creates: Create failed in dao: {table}"));
  }
  let id = ids[0].clone();
  
  Ok(id)
}

// MARK: update_tenant_by_id_wx_refund_notice
/// 微信退款通知根据id修改租户id
pub async fn update_tenant_by_id_wx_refund_notice(
  id: WxRefundNoticeId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_wx_refund_notice();
  let method = "update_tenant_by_id_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    msg += &format!(" tenant_id: {tenant_id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  args.push(tenant_id.into());
  args.push(id.into());
  
  let sql = format!("update {table} set tenant_id=? where id=?");
  
  let args: Vec<_> = args.into();
  
  let num = execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(num)
}

// MARK: update_by_id_wx_refund_notice
/// 根据 id 修改微信退款通知
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_wx_refund_notice(
  id: WxRefundNoticeId,
  mut input: WxRefundNoticeInput,
  options: Option<Options>,
) -> Result<WxRefundNoticeId> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "update_by_id_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    msg += &format!(" input: {input:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let old_model = find_by_id_wx_refund_notice(
    id,
    options,
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      let err_msg = "编辑失败, 此 微信退款通知 已被删除";
      return Err(eyre!(err_msg));
    }
  };
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique_wx_refund_notice(
      input.into(),
      None,
      options,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<WxRefundNoticeModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "微信退款通知 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 16 + 20);
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += "tenant_id=?,";
    args.push(tenant_id.into());
  }
  // 开发者ID
  if let Some(appid) = input.appid {
    field_num += 1;
    sql_fields += "appid=?,";
    args.push(appid.into());
  }
  // 商户号
  if let Some(mchid) = input.mchid {
    field_num += 1;
    sql_fields += "mchid=?,";
    args.push(mchid.into());
  }
  // 商户订单号
  if let Some(out_trade_no) = input.out_trade_no {
    field_num += 1;
    sql_fields += "out_trade_no=?,";
    args.push(out_trade_no.into());
  }
  // 微信支付订单号
  if let Some(transaction_id) = input.transaction_id {
    field_num += 1;
    sql_fields += "transaction_id=?,";
    args.push(transaction_id.into());
  }
  // 商户退款单号
  if let Some(out_refund_no) = input.out_refund_no {
    field_num += 1;
    sql_fields += "out_refund_no=?,";
    args.push(out_refund_no.into());
  }
  // 微信退款单号
  if let Some(refund_id) = input.refund_id {
    field_num += 1;
    sql_fields += "refund_id=?,";
    args.push(refund_id.into());
  }
  // 退款状态
  if let Some(refund_status) = input.refund_status {
    field_num += 1;
    sql_fields += "refund_status=?,";
    args.push(refund_status.into());
  }
  // 退款成功时间
  if let Some(success_time) = input.success_time {
    field_num += 1;
    sql_fields += "success_time=?,";
    args.push(success_time.into());
  } else if input.success_time_save_null == Some(true) {
    field_num += 1;
    sql_fields += "success_time=null,";
  }
  // 退款入账账户
  if let Some(user_received_account) = input.user_received_account {
    field_num += 1;
    sql_fields += "user_received_account=?,";
    args.push(user_received_account.into());
  }
  // 订单金额(分)
  if let Some(amount_total) = input.amount_total {
    field_num += 1;
    sql_fields += "amount_total=?,";
    args.push(amount_total.into());
  }
  // 退款金额(分)
  if let Some(amount_refund) = input.amount_refund {
    field_num += 1;
    sql_fields += "amount_refund=?,";
    args.push(amount_refund.into());
  }
  // 用户实际支付金额(分)
  if let Some(amount_payer_total) = input.amount_payer_total {
    field_num += 1;
    sql_fields += "amount_payer_total=?,";
    args.push(amount_payer_total.into());
  }
  // 用户退款金额(分)
  if let Some(amount_payer_refund) = input.amount_payer_refund {
    field_num += 1;
    sql_fields += "amount_payer_refund=?,";
    args.push(amount_payer_refund.into());
  }
  
  if field_num > 0 {
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql_where = "id=?";
    args.push(id.into());
    
    let sql = format!("update {table} set {sql_fields} where {sql_where} limit 1");
    
    let args: Vec<_> = args.into();
    
    execute(
      sql,
      args,
      options,
    ).await?;
    
  }
  
  Ok(id)
}

// MARK: update_by_id_return_wx_refund_notice
/// 根据 id 更新微信退款通知, 并返回更新后的数据
#[allow(dead_code)]
pub async fn update_by_id_return_wx_refund_notice(
  id: WxRefundNoticeId,
  input: WxRefundNoticeInput,
  options: Option<Options>,
) -> Result<WxRefundNoticeModel> {
  
  update_by_id_wx_refund_notice(
    id,
    input,
    options,
  ).await?;
  
  let model = find_by_id_wx_refund_notice(
    id,
    options,
  ).await?;
  
  match model {
    Some(model) => Ok(model),
    None => Err(eyre!(
      "微信退款通知 update_by_id_return_wx_refund_notice id: {id}",
    )),
  }
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = get_table_name_wx_refund_notice();
  vec![
    table,
  ]
}

// MARK: del_cache_wx_refund_notice
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_wx_refund_notice() -> Result<()> {
  
  let cache_key1s = get_cache_tables();
  
  let cache_key1s = cache_key1s
    .into_iter()
    .map(|x|
      SmolStr::new(format!("dao.sql.{x}"))
    )
    .collect::<Vec<SmolStr>>();
  
  let cache_key1s_str = cache_key1s
    .iter()
    .map(|item| item.as_str())
    .collect::<Vec<&str>>();
  
  del_caches(
    cache_key1s_str.as_slice(),
  ).await?;
  
  Ok(())
}

// MARK: delete_by_ids_wx_refund_notice
/// 根据 ids 删除微信退款通知
#[allow(unused_variables)]
pub async fn delete_by_ids_wx_refund_notice(
  ids: Vec<WxRefundNoticeId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_wx_refund_notice();
  let method = "delete_by_ids_wx_refund_notice";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }
  
  if ids.len() as u64 > MAX_SAFE_INTEGER {
    return Err(eyre!("ids.len(): {} > MAX_SAFE_INTEGER", ids.len()));
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_by_id_wx_refund_notice(
      id,
      options,
    ).await?;
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    if !is_silent_mode {
      info!(
        "{} {}.{}: {}",
        get_req_id(),
        table,
        method,
        serde_json::to_string(&old_model)?,
      );
    }
    
    let mut args = QueryArgs::new();
    
    let sql = format!("delete from {table} where id=? limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: validate_option_wx_refund_notice
/// 校验微信退款通知是否存在
#[allow(dead_code)]
pub async fn validate_option_wx_refund_notice(
  model: Option<WxRefundNoticeModel>,
) -> Result<WxRefundNoticeModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = SmolStr::new("微信退款通知不存在");
      error!(
        "{req_id} {err_msg}",
        req_id = get_req_id(),
      );
      return Err(eyre!(
        ServiceException {
          message: err_msg,
          trace: true,
          ..Default::default()
        },
      ));
    },
  };
  
  Ok(model)
}
