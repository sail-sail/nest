
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

use super::wx_refund_model::*;

use crate::base::tenant::tenant_model::TenantId;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&WxRefundSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let mut where_query = String::with_capacity(80 * 26 * 2);
  
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
    let ids: Option<Vec<WxRefundId>> = match search {
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
  // 退款原因
  {
    let reason = match search {
      Some(item) => item.reason.clone(),
      None => None,
    };
    if let Some(reason) = reason {
      where_query.push_str(" and t.reason=?");
      args.push(reason.into());
    }
    let reason_like = match search {
      Some(item) => item.reason_like.clone(),
      None => None,
    };
    if let Some(reason_like) = reason_like && !reason_like.is_empty() {
      where_query.push_str(" and t.reason like ?");
      args.push(format!("%{}%", sql_like(&reason_like)).into());
    }
  }
  // 附加数据2
  {
    let attach2 = match search {
      Some(item) => item.attach2.clone(),
      None => None,
    };
    if let Some(attach2) = attach2 {
      where_query.push_str(" and t.attach2=?");
      args.push(attach2.into());
    }
    let attach2_like = match search {
      Some(item) => item.attach2_like.clone(),
      None => None,
    };
    if let Some(attach2_like) = attach2_like && !attach2_like.is_empty() {
      where_query.push_str(" and t.attach2 like ?");
      args.push(format!("%{}%", sql_like(&attach2_like)).into());
    }
  }
  // 退款结果回调地址
  {
    let notify_url = match search {
      Some(item) => item.notify_url.clone(),
      None => None,
    };
    if let Some(notify_url) = notify_url {
      where_query.push_str(" and t.notify_url=?");
      args.push(notify_url.into());
    }
    let notify_url_like = match search {
      Some(item) => item.notify_url_like.clone(),
      None => None,
    };
    if let Some(notify_url_like) = notify_url_like && !notify_url_like.is_empty() {
      where_query.push_str(" and t.notify_url like ?");
      args.push(format!("%{}%", sql_like(&notify_url_like)).into());
    }
  }
  // 退款渠道
  {
    let channel: Option<Vec<SmolStr>> = match search {
      Some(item) => item.channel.clone(),
      None => None,
    };
    if let Some(channel) = channel {
      let arg = {
        if channel.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(channel.len());
          for item in channel {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.channel in (");
      where_query.push_str(&arg);
      where_query.push(')');
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
  // 退款状态
  {
    let status: Option<Vec<SmolStr>> = match search {
      Some(item) => item.status.clone(),
      None => None,
    };
    if let Some(status) = status {
      let arg = {
        if status.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(status.len());
          for item in status {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.status in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 资金账户
  {
    let funds_account: Option<Vec<SmolStr>> = match search {
      Some(item) => item.funds_account.clone(),
      None => None,
    };
    if let Some(funds_account) = funds_account {
      let arg = {
        if funds_account.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(funds_account.len());
          for item in funds_account {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.funds_account in (");
      where_query.push_str(&arg);
      where_query.push(')');
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
  // 应结退款金额(分)
  {
    let mut amount_settlement_refund = match search {
      Some(item) => item.amount_settlement_refund.unwrap_or_default(),
      None => Default::default(),
    };
    let amount_settlement_refund_gt = amount_settlement_refund[0].take();
    let amount_settlement_refund_lt = amount_settlement_refund[1].take();
    if let Some(amount_settlement_refund_gt) = amount_settlement_refund_gt {
      where_query.push_str(" and t.amount_settlement_refund >= ?");
      args.push(amount_settlement_refund_gt.into());
    }
    if let Some(amount_settlement_refund_lt) = amount_settlement_refund_lt {
      where_query.push_str(" and t.amount_settlement_refund <= ?");
      args.push(amount_settlement_refund_lt.into());
    }
  }
  // 优惠退款金额(分)
  {
    let mut amount_discount_refund = match search {
      Some(item) => item.amount_discount_refund.unwrap_or_default(),
      None => Default::default(),
    };
    let amount_discount_refund_gt = amount_discount_refund[0].take();
    let amount_discount_refund_lt = amount_discount_refund[1].take();
    if let Some(amount_discount_refund_gt) = amount_discount_refund_gt {
      where_query.push_str(" and t.amount_discount_refund >= ?");
      args.push(amount_discount_refund_gt.into());
    }
    if let Some(amount_discount_refund_lt) = amount_discount_refund_lt {
      where_query.push_str(" and t.amount_discount_refund <= ?");
      args.push(amount_discount_refund_lt.into());
    }
  }
  // 退款币种
  {
    let amount_currency: Option<Vec<WxRefundAmountCurrency>> = match search {
      Some(item) => item.amount_currency.clone(),
      None => None,
    };
    if let Some(amount_currency) = amount_currency {
      let arg = {
        if amount_currency.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(amount_currency.len());
          for item in amount_currency {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.amount_currency in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 手续费退款金额(分)
  {
    let mut amount_refund_fee = match search {
      Some(item) => item.amount_refund_fee.unwrap_or_default(),
      None => Default::default(),
    };
    let amount_refund_fee_gt = amount_refund_fee[0].take();
    let amount_refund_fee_lt = amount_refund_fee[1].take();
    if let Some(amount_refund_fee_gt) = amount_refund_fee_gt {
      where_query.push_str(" and t.amount_refund_fee >= ?");
      args.push(amount_refund_fee_gt.into());
    }
    if let Some(amount_refund_fee_lt) = amount_refund_fee_lt {
      where_query.push_str(" and t.amount_refund_fee <= ?");
      args.push(amount_refund_fee_lt.into());
    }
  }
  // 备注
  {
    let rem = match search {
      Some(item) => item.rem.clone(),
      None => None,
    };
    if let Some(rem) = rem {
      where_query.push_str(" and t.rem=?");
      args.push(rem.into());
    }
    let rem_like = match search {
      Some(item) => item.rem_like.clone(),
      None => None,
    };
    if let Some(rem_like) = rem_like && !rem_like.is_empty() {
      where_query.push_str(" and t.rem like ?");
      args.push(format!("%{}%", sql_like(&rem_like)).into());
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
  search: Option<&WxRefundSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"wx_wx_refund t"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_wx_refund
/// 根据搜索条件和分页查找微信退款申请列表
#[allow(unused_mut, unused_variables)]
pub async fn find_all_wx_refund(
  search: Option<WxRefundSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxRefundModel>> {
  
  let table = get_table_name_wx_refund();
  let method = "find_all_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(page) = &page {
      msg += &format!(" page: {:?}", &page);
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  // 退款渠道
  if let Some(search) = &search && let Some(channel) = &search.channel {
    let len = channel.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.channel.length > {ids_limit}"));
    }
  }
  // 退款状态
  if let Some(search) = &search && let Some(status) = &search.status {
    let len = status.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.status.length > {ids_limit}"));
    }
  }
  // 资金账户
  if let Some(search) = &search && let Some(funds_account) = &search.funds_account {
    let len = funds_account.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.funds_account.length > {ids_limit}"));
    }
  }
  // 退款币种
  if let Some(search) = &search && let Some(amount_currency) = &search.amount_currency {
    let len = amount_currency.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.amount_currency.length > {ids_limit}"));
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let mut sort = sort.unwrap_or_default();
  
  if !sort.iter().any(|item| item.prop == "success_time") {
    sort.push(SortInput {
      prop: "success_time".into(),
      order: SortOrderEnum::Desc,
    });
  }
  
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: SortOrderEnum::Asc,
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
  
  let mut res: Vec<WxRefundModel> = query(
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
    "wx_refund_channel",
    "wx_refund_status",
    "wx_refund_funds_account",
    "wx_pay_notice_currency",
  ]).await?;
  let [
    channel_dict,
    status_dict,
    funds_account_dict,
    amount_currency_dict,
  ]: [Vec<_>; 4] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 退款渠道
    model.channel_lbl = {
      channel_dict
        .iter()
        .find(|item| item.val == model.channel.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.channel.clone())
    };
    
    // 退款状态
    model.status_lbl = {
      status_dict
        .iter()
        .find(|item| item.val == model.status.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.status.clone())
    };
    
    // 资金账户
    model.funds_account_lbl = {
      funds_account_dict
        .iter()
        .find(|item| item.val == model.funds_account.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.funds_account.clone())
    };
    
    // 退款币种
    model.amount_currency_lbl = {
      amount_currency_dict
        .iter()
        .find(|item| item.val == model.amount_currency.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.amount_currency.clone().into())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_wx_refund
/// 根据条件查找微信退款申请总数
pub async fn find_count_wx_refund(
  search: Option<WxRefundSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_wx_refund();
  let method = "find_count_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  // 退款渠道
  if let Some(search) = &search && search.channel.is_some() {
    let len = search.channel.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.channel.length > {ids_limit}"));
    }
  }
  // 退款状态
  if let Some(search) = &search && search.status.is_some() {
    let len = search.status.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.status.length > {ids_limit}"));
    }
  }
  // 资金账户
  if let Some(search) = &search && search.funds_account.is_some() {
    let len = search.funds_account.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.funds_account.length > {ids_limit}"));
    }
  }
  // 退款币种
  if let Some(search) = &search && search.amount_currency.is_some() {
    let len = search.amount_currency.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.amount_currency.length > {ids_limit}"));
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

// MARK: get_field_comments_wx_refund
/// 获取微信退款申请字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_wx_refund(
  _options: Option<Options>,
) -> Result<WxRefundFieldComment> {
  
  let mut field_comments = WxRefundFieldComment {
    id: "ID".into(),
    appid: "开发者ID".into(),
    mchid: "商户号".into(),
    out_trade_no: "商户订单号".into(),
    transaction_id: "微信支付订单号".into(),
    out_refund_no: "商户退款单号".into(),
    refund_id: "微信退款单号".into(),
    reason: "退款原因".into(),
    channel: "退款渠道".into(),
    channel_lbl: "退款渠道".into(),
    user_received_account: "退款入账账户".into(),
    success_time: "退款成功时间".into(),
    success_time_lbl: "退款成功时间".into(),
    status: "退款状态".into(),
    status_lbl: "退款状态".into(),
    funds_account: "资金账户".into(),
    funds_account_lbl: "资金账户".into(),
    amount_total: "订单金额(分)".into(),
    amount_refund: "退款金额(分)".into(),
    amount_payer_total: "用户实际支付金额(分)".into(),
    amount_payer_refund: "用户退款金额(分)".into(),
    amount_settlement_refund: "应结退款金额(分)".into(),
    amount_discount_refund: "优惠退款金额(分)".into(),
    amount_currency: "退款币种".into(),
    amount_currency_lbl: "退款币种".into(),
    amount_refund_fee: "手续费退款金额(分)".into(),
    rem: "备注".into(),
    create_time: "创建时间".into(),
    create_time_lbl: "创建时间".into(),
  };
  Ok(field_comments)
}

// MARK: find_one_ok_wx_refund
/// 根据条件查找第一个微信退款申请, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_wx_refund(
  search: Option<WxRefundSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxRefundModel> {
  
  let table = get_table_name_wx_refund();
  let method = "find_one_ok_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let wx_refund_model = find_one_wx_refund(
    search,
    sort,
    options,
  ).await?;
  
  let Some(wx_refund_model) = wx_refund_model else {
    let err_msg = "此 微信退款申请 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(wx_refund_model)
}

// MARK: find_one_wx_refund
/// 根据条件查找第一个微信退款申请
#[allow(dead_code)]
pub async fn find_one_wx_refund(
  search: Option<WxRefundSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxRefundModel>> {
  
  let table = get_table_name_wx_refund();
  let method = "find_one_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  
  let res = find_all_wx_refund(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<WxRefundModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_wx_refund
/// 根据 id 查找微信退款申请, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_wx_refund(
  id: WxRefundId,
  options: Option<Options>,
) -> Result<WxRefundModel> {
  
  let table = get_table_name_wx_refund();
  let method = "find_by_id_ok_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let wx_refund_model = find_by_id_wx_refund(
    id,
    options,
  ).await?;
  
  let Some(wx_refund_model) = wx_refund_model else {
    let err_msg = SmolStr::new("此 微信退款申请 已被删除");
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
  
  Ok(wx_refund_model)
}

// MARK: find_by_id_wx_refund
/// 根据 id 查找微信退款申请
pub async fn find_by_id_wx_refund(
  id: WxRefundId,
  options: Option<Options>,
) -> Result<Option<WxRefundModel>> {
  
  let table = get_table_name_wx_refund();
  let method = "find_by_id_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  
  let search = WxRefundSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let wx_refund_model = find_one_wx_refund(
    search,
    None,
    options,
  ).await?;
  
  Ok(wx_refund_model)
}

// MARK: find_by_ids_ok_wx_refund
/// 根据 ids 查找微信退款申请, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_wx_refund(
  ids: Vec<WxRefundId>,
  options: Option<Options>,
) -> Result<Vec<WxRefundModel>> {
  
  let table = get_table_name_wx_refund();
  let method = "find_by_ids_ok_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  
  let wx_refund_models = find_by_ids_wx_refund(
    ids.clone(),
    options,
  ).await?;
  
  if wx_refund_models.len() != len {
    let err_msg = SmolStr::new("此 微信退款申请 已被删除");
    return Err(eyre!(err_msg));
  }
  
  let wx_refund_models = ids
    .into_iter()
    .map(|id| {
      let model = wx_refund_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = SmolStr::new("此 微信退款申请 已经被删除");
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<WxRefundModel>>>()?;
  
  Ok(wx_refund_models)
}

// MARK: find_by_ids_wx_refund
/// 根据 ids 查找微信退款申请
#[allow(dead_code)]
pub async fn find_by_ids_wx_refund(
  ids: Vec<WxRefundId>,
  options: Option<Options>,
) -> Result<Vec<WxRefundModel>> {
  
  let table = get_table_name_wx_refund();
  let method = "find_by_ids_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  
  let search = WxRefundSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let wx_refund_models = find_all_wx_refund(
    search,
    None,
    None,
    options,
  ).await?;
  
  let wx_refund_models = ids
    .into_iter()
    .filter_map(|id| {
      wx_refund_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<WxRefundModel>>();
  
  Ok(wx_refund_models)
}

// MARK: exists_wx_refund
/// 根据搜索条件判断微信退款申请是否存在
#[allow(dead_code)]
pub async fn exists_wx_refund(
  search: Option<WxRefundSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_wx_refund();
  let method = "exists_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  // 退款渠道
  if let Some(search) = &search && search.channel.is_some() {
    let len = search.channel.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.channel.length > {ids_limit}"));
    }
  }
  // 退款状态
  if let Some(search) = &search && search.status.is_some() {
    let len = search.status.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.status.length > {ids_limit}"));
    }
  }
  // 资金账户
  if let Some(search) = &search && search.funds_account.is_some() {
    let len = search.funds_account.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.funds_account.length > {ids_limit}"));
    }
  }
  // 退款币种
  if let Some(search) = &search && search.amount_currency.is_some() {
    let len = search.amount_currency.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.amount_currency.length > {ids_limit}"));
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

// MARK: exists_by_id_wx_refund
/// 根据 id 判断微信退款申请是否存在
#[allow(dead_code)]
pub async fn exists_by_id_wx_refund(
  id: WxRefundId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_wx_refund();
  let method = "exists_by_id_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let search = WxRefundSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_wx_refund(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_wx_refund
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_wx_refund(
  search: WxRefundSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxRefundModel>> {
  
  let table = get_table_name_wx_refund();
  let method = "find_by_unique_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" search: {:?}", &search);
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
    let model = find_by_id_wx_refund(
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
  input: &WxRefundInput,
  model: &WxRefundModel,
  options: Option<&Options>,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  let is_silent_mode = get_is_silent_mode(options);
  false
}

// MARK: check_by_unique_wx_refund
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_wx_refund(
  input: WxRefundInput,
  model: WxRefundModel,
  options: Option<Options>,
) -> Result<Option<WxRefundId>> {
  
  let table = get_table_name_wx_refund();
  let method = "check_by_unique_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {:?}", &input);
    msg += &format!(" model: {:?}", &model);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
    let id = update_by_id_wx_refund(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "微信退款申请 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_wx_refund
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_wx_refund(
  input: WxRefundInput,
) -> Result<WxRefundInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  // 退款成功时间
  if input.success_time.is_none() && let Some(success_time_lbl) = input.success_time_lbl.as_ref().filter(|s| !s.is_empty()) {
    input.success_time = chrono::NaiveDateTime::parse_from_str(success_time_lbl, "%Y-%m-%d %H:%M:%S").ok();
    if input.success_time.is_none() {
      input.success_time = chrono::NaiveDateTime::parse_from_str(success_time_lbl, "%Y-%m-%d").ok();
    }
    if input.success_time.is_none() {
      let field_comments = get_field_comments_wx_refund(
        None,
      ).await?;
      let column_comment = field_comments.success_time;
      
      let err_msg = "日期格式错误";
      return Err(eyre!("{column_comment} {err_msg}"));
    }
  }
  
  let dict_vec = get_dict(&[
    "wx_refund_channel",
    "wx_refund_status",
    "wx_refund_funds_account",
    "wx_pay_notice_currency",
  ]).await?;
  
  // 退款渠道
  if input.channel.is_none() {
    let channel_dict = &dict_vec[0];
    if let Some(channel_lbl) = input.channel_lbl.clone() {
      input.channel = channel_dict
        .iter()
        .find(|item| {
          item.lbl == channel_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 退款状态
  if input.status.is_none() {
    let status_dict = &dict_vec[1];
    if let Some(status_lbl) = input.status_lbl.clone() {
      input.status = status_dict
        .iter()
        .find(|item| {
          item.lbl == status_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 资金账户
  if input.funds_account.is_none() {
    let funds_account_dict = &dict_vec[2];
    if let Some(funds_account_lbl) = input.funds_account_lbl.clone() {
      input.funds_account = funds_account_dict
        .iter()
        .find(|item| {
          item.lbl == funds_account_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 退款币种
  if input.amount_currency.is_none() {
    let amount_currency_dict = &dict_vec[3];
    if let Some(amount_currency_lbl) = input.amount_currency_lbl.clone() {
      input.amount_currency = amount_currency_dict
        .iter()
        .find(|item| {
          item.lbl == amount_currency_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 退款渠道
  if
    input.channel_lbl.is_some() && !input.channel_lbl.as_ref().unwrap().is_empty()
    && input.channel.is_none()
  {
    let channel_dict = &dict_vec[0];
    let dict_model = channel_dict.iter().find(|item| {
      item.lbl == input.channel_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.channel = val.into();
    }
  } else if
    (input.channel_lbl.is_none() || input.channel_lbl.as_ref().unwrap().is_empty())
    && input.channel.is_some()
  {
    let channel_dict = &dict_vec[0];
    let dict_model = channel_dict.iter().find(|item| {
      item.val == input.channel.clone().unwrap_or_default()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.channel_lbl = lbl;
  }
  
  // 退款状态
  if
    input.status_lbl.is_some() && !input.status_lbl.as_ref().unwrap().is_empty()
    && input.status.is_none()
  {
    let status_dict = &dict_vec[1];
    let dict_model = status_dict.iter().find(|item| {
      item.lbl == input.status_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.status = val.into();
    }
  } else if
    (input.status_lbl.is_none() || input.status_lbl.as_ref().unwrap().is_empty())
    && input.status.is_some()
  {
    let status_dict = &dict_vec[1];
    let dict_model = status_dict.iter().find(|item| {
      item.val == input.status.clone().unwrap_or_default()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.status_lbl = lbl;
  }
  
  // 资金账户
  if
    input.funds_account_lbl.is_some() && !input.funds_account_lbl.as_ref().unwrap().is_empty()
    && input.funds_account.is_none()
  {
    let funds_account_dict = &dict_vec[2];
    let dict_model = funds_account_dict.iter().find(|item| {
      item.lbl == input.funds_account_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.funds_account = val.into();
    }
  } else if
    (input.funds_account_lbl.is_none() || input.funds_account_lbl.as_ref().unwrap().is_empty())
    && input.funds_account.is_some()
  {
    let funds_account_dict = &dict_vec[2];
    let dict_model = funds_account_dict.iter().find(|item| {
      item.val == input.funds_account.clone().unwrap_or_default()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.funds_account_lbl = lbl;
  }
  
  // 退款币种
  if
    input.amount_currency_lbl.is_some() && !input.amount_currency_lbl.as_ref().unwrap().is_empty()
    && input.amount_currency.is_none()
  {
    let amount_currency_dict = &dict_vec[3];
    let dict_model = amount_currency_dict.iter().find(|item| {
      item.lbl == input.amount_currency_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.amount_currency = val.parse::<WxRefundAmountCurrency>()?.into();
    }
  } else if
    (input.amount_currency_lbl.is_none() || input.amount_currency_lbl.as_ref().unwrap().is_empty())
    && input.amount_currency.is_some()
  {
    let amount_currency_dict = &dict_vec[3];
    let dict_model = amount_currency_dict.iter().find(|item| {
      item.val == input.amount_currency.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.amount_currency_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return_wx_refund
/// 批量创建微信退款申请并返回
#[allow(dead_code)]
pub async fn creates_return_wx_refund(
  inputs: Vec<WxRefundInput>,
  options: Option<Options>,
) -> Result<Vec<WxRefundModel>> {
  
  let table = get_table_name_wx_refund();
  let method = "creates_return_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {:?}", &inputs);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  
  let models_wx_refund = find_by_ids_wx_refund(
    ids,
    options,
  ).await?;
  
  Ok(models_wx_refund)
}

// MARK: creates_wx_refund
/// 批量创建微信退款申请
pub async fn creates_wx_refund(
  inputs: Vec<WxRefundInput>,
  options: Option<Options>,
) -> Result<Vec<WxRefundId>> {
  
  let table = get_table_name_wx_refund();
  let method = "creates_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {:?}", &inputs);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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

/// 批量创建微信退款申请
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<WxRefundInput>,
  options: Option<Options>,
) -> Result<Vec<WxRefundId>> {
  
  let table = get_table_name_wx_refund();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<WxRefundId> = vec![];
  let mut inputs2: Vec<WxRefundInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_wx_refund(
      input.clone().into(),
      None,
      options,
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<WxRefundId> = None;
      
      for old_model in old_models {
        let options = Options::from(options)
          .set_unique_type(unique_type);
        
        id = check_by_unique_wx_refund(
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
  let mut sql_fields = String::with_capacity(80 * 26 + 20);
  
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
  // 退款原因
  sql_fields += ",reason";
  // 附加数据2
  sql_fields += ",attach2";
  // 退款结果回调地址
  sql_fields += ",notify_url";
  // 退款渠道
  sql_fields += ",channel";
  // 退款入账账户
  sql_fields += ",user_received_account";
  // 退款成功时间
  sql_fields += ",success_time";
  // 退款状态
  sql_fields += ",status";
  // 资金账户
  sql_fields += ",funds_account";
  // 订单金额(分)
  sql_fields += ",amount_total";
  // 退款金额(分)
  sql_fields += ",amount_refund";
  // 用户实际支付金额(分)
  sql_fields += ",amount_payer_total";
  // 用户退款金额(分)
  sql_fields += ",amount_payer_refund";
  // 应结退款金额(分)
  sql_fields += ",amount_settlement_refund";
  // 优惠退款金额(分)
  sql_fields += ",amount_discount_refund";
  // 退款币种
  sql_fields += ",amount_currency";
  // 手续费退款金额(分)
  sql_fields += ",amount_refund_fee";
  // 备注
  sql_fields += ",rem";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 26 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: WxRefundId = get_short_uuid().into();
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
    // 退款原因
    if let Some(reason) = input.reason {
      sql_values += ",?";
      args.push(reason.into());
    } else {
      sql_values += ",default";
    }
    // 附加数据2
    if let Some(attach2) = input.attach2 {
      sql_values += ",?";
      args.push(attach2.into());
    } else {
      sql_values += ",default";
    }
    // 退款结果回调地址
    if let Some(notify_url) = input.notify_url {
      sql_values += ",?";
      args.push(notify_url.into());
    } else {
      sql_values += ",default";
    }
    // 退款渠道
    if let Some(channel) = input.channel {
      sql_values += ",?";
      args.push(channel.into());
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
    // 退款成功时间
    if let Some(success_time) = input.success_time {
      sql_values += ",?";
      args.push(success_time.into());
    } else if input.success_time_save_null == Some(true) {
      sql_values += ",null";
    } else {
      sql_values += ",default";
    }
    // 退款状态
    if let Some(status) = input.status {
      sql_values += ",?";
      args.push(status.into());
    } else {
      sql_values += ",default";
    }
    // 资金账户
    if let Some(funds_account) = input.funds_account {
      sql_values += ",?";
      args.push(funds_account.into());
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
    // 应结退款金额(分)
    if let Some(amount_settlement_refund) = input.amount_settlement_refund {
      sql_values += ",?";
      args.push(amount_settlement_refund.into());
    } else {
      sql_values += ",default";
    }
    // 优惠退款金额(分)
    if let Some(amount_discount_refund) = input.amount_discount_refund {
      sql_values += ",?";
      args.push(amount_discount_refund.into());
    } else {
      sql_values += ",default";
    }
    // 退款币种
    if let Some(amount_currency) = input.amount_currency {
      sql_values += ",?";
      args.push(amount_currency.into());
    } else {
      sql_values += ",default";
    }
    // 手续费退款金额(分)
    if let Some(amount_refund_fee) = input.amount_refund_fee {
      sql_values += ",?";
      args.push(amount_refund_fee.into());
    } else {
      sql_values += ",default";
    }
    // 备注
    if let Some(rem) = input.rem {
      sql_values += ",?";
      args.push(rem.into());
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

// MARK: create_return_wx_refund
/// 创建微信退款申请并返回
#[allow(dead_code)]
pub async fn create_return_wx_refund(
  #[allow(unused_mut)]
  mut input: WxRefundInput,
  options: Option<Options>,
) -> Result<WxRefundModel> {
  
  let id = create_wx_refund(
    input.clone(),
    options,
  ).await?;
  
  let model_wx_refund = find_by_id_wx_refund(
    id,
    options,
  ).await?;
  
  let model_wx_refund = match model_wx_refund {
    Some(model) => model,
    None => {
      let err_msg = "create_return_wx_refund: model_wx_refund.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.into(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_wx_refund)
}

// MARK: create_wx_refund
/// 创建微信退款申请
#[allow(dead_code)]
pub async fn create_wx_refund(
  #[allow(unused_mut)]
  mut input: WxRefundInput,
  options: Option<Options>,
) -> Result<WxRefundId> {
  
  let table = get_table_name_wx_refund();
  let method = "create_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {:?}", &input);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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

// MARK: update_tenant_by_id_wx_refund
/// 微信退款申请根据id修改租户id
pub async fn update_tenant_by_id_wx_refund(
  id: WxRefundId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_wx_refund();
  let method = "update_tenant_by_id_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    msg += &format!(" tenant_id: {:?}", &tenant_id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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

// MARK: update_by_id_wx_refund
/// 根据 id 修改微信退款申请
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_wx_refund(
  id: WxRefundId,
  mut input: WxRefundInput,
  options: Option<Options>,
) -> Result<WxRefundId> {
  
  let table = get_table_name_wx_refund();
  let method = "update_by_id_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    msg += &format!(" input: {:?}", &input);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let old_model = find_by_id_wx_refund(
    id,
    options,
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      let err_msg = "编辑失败, 此 微信退款申请 已被删除";
      return Err(eyre!(err_msg));
    }
  };
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique_wx_refund(
      input.into(),
      None,
      options,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<WxRefundModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "微信退款申请 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 26 + 20);
  
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
  // 退款原因
  if let Some(reason) = input.reason {
    field_num += 1;
    sql_fields += "reason=?,";
    args.push(reason.into());
  }
  // 附加数据2
  if let Some(attach2) = input.attach2 {
    field_num += 1;
    sql_fields += "attach2=?,";
    args.push(attach2.into());
  }
  // 退款结果回调地址
  if let Some(notify_url) = input.notify_url {
    field_num += 1;
    sql_fields += "notify_url=?,";
    args.push(notify_url.into());
  }
  // 退款渠道
  if let Some(channel) = input.channel {
    field_num += 1;
    sql_fields += "channel=?,";
    args.push(channel.into());
  }
  // 退款入账账户
  if let Some(user_received_account) = input.user_received_account {
    field_num += 1;
    sql_fields += "user_received_account=?,";
    args.push(user_received_account.into());
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
  // 退款状态
  if let Some(status) = input.status {
    field_num += 1;
    sql_fields += "status=?,";
    args.push(status.into());
  }
  // 资金账户
  if let Some(funds_account) = input.funds_account {
    field_num += 1;
    sql_fields += "funds_account=?,";
    args.push(funds_account.into());
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
  // 应结退款金额(分)
  if let Some(amount_settlement_refund) = input.amount_settlement_refund {
    field_num += 1;
    sql_fields += "amount_settlement_refund=?,";
    args.push(amount_settlement_refund.into());
  }
  // 优惠退款金额(分)
  if let Some(amount_discount_refund) = input.amount_discount_refund {
    field_num += 1;
    sql_fields += "amount_discount_refund=?,";
    args.push(amount_discount_refund.into());
  }
  // 退款币种
  if let Some(amount_currency) = input.amount_currency {
    field_num += 1;
    sql_fields += "amount_currency=?,";
    args.push(amount_currency.into());
  }
  // 手续费退款金额(分)
  if let Some(amount_refund_fee) = input.amount_refund_fee {
    field_num += 1;
    sql_fields += "amount_refund_fee=?,";
    args.push(amount_refund_fee.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    field_num += 1;
    sql_fields += "rem=?,";
    args.push(rem.into());
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

// MARK: update_by_id_return_wx_refund
/// 根据 id 更新微信退款申请, 并返回更新后的数据
#[allow(dead_code)]
pub async fn update_by_id_return_wx_refund(
  id: WxRefundId,
  input: WxRefundInput,
  options: Option<Options>,
) -> Result<WxRefundModel> {
  
  update_by_id_wx_refund(
    id,
    input,
    options,
  ).await?;
  
  let model = find_by_id_wx_refund(
    id,
    options,
  ).await?;
  
  match model {
    Some(model) => Ok(model),
    None => Err(eyre!(
      "微信退款申请 update_by_id_return_wx_refund id: {id}",
    )),
  }
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = get_table_name_wx_refund();
  vec![
    table,
  ]
}

// MARK: del_cache_wx_refund
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_wx_refund() -> Result<()> {
  
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

// MARK: delete_by_ids_wx_refund
/// 根据 ids 删除微信退款申请
#[allow(unused_variables)]
pub async fn delete_by_ids_wx_refund(
  ids: Vec<WxRefundId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_wx_refund();
  let method = "delete_by_ids_wx_refund";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
    
    let old_model = find_by_id_wx_refund(
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

// MARK: validate_option_wx_refund
/// 校验微信退款申请是否存在
#[allow(dead_code)]
pub async fn validate_option_wx_refund(
  model: Option<WxRefundModel>,
) -> Result<WxRefundModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = SmolStr::new("微信退款申请不存在");
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
