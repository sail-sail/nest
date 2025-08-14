
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use serde::{Serialize, Deserialize};
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

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

use super::pay_transactions_jsapi_model::*;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&PayTransactionsJsapiSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 25 * 2);
  
  where_query.push_str(" t.is_deleted=?");
  args.push(is_deleted.into());
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
    let ids: Option<Vec<PayTransactionsJsapiId>> = match search {
      Some(item) => item.ids.clone(),
      None => None,
    };
    if let Some(ids) = ids {
      let arg = {
        if ids.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(ids.len());
          for id in ids {
            args.push(id.into());
            items.push("?");
          }
          items.join(",")
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
    if let Some(appid_like) = appid_like {
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
    if let Some(mchid_like) = mchid_like {
      where_query.push_str(" and t.mchid like ?");
      args.push(format!("%{}%", sql_like(&mchid_like)).into());
    }
  }
  // 商品描述
  {
    let description = match search {
      Some(item) => item.description.clone(),
      None => None,
    };
    if let Some(description) = description {
      where_query.push_str(" and t.description=?");
      args.push(description.into());
    }
    let description_like = match search {
      Some(item) => item.description_like.clone(),
      None => None,
    };
    if let Some(description_like) = description_like {
      where_query.push_str(" and t.description like ?");
      args.push(format!("%{}%", sql_like(&description_like)).into());
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
    if let Some(out_trade_no_like) = out_trade_no_like {
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
    if let Some(transaction_id_like) = transaction_id_like {
      where_query.push_str(" and t.transaction_id like ?");
      args.push(format!("%{}%", sql_like(&transaction_id_like)).into());
    }
  }
  // 交易状态
  {
    let trade_state: Option<Vec<PayTransactionsJsapiTradeState>> = match search {
      Some(item) => item.trade_state.clone(),
      None => None,
    };
    if let Some(trade_state) = trade_state {
      let arg = {
        if trade_state.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(trade_state.len());
          for item in trade_state {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.trade_state in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 交易状态描述
  {
    let trade_state_desc = match search {
      Some(item) => item.trade_state_desc.clone(),
      None => None,
    };
    if let Some(trade_state_desc) = trade_state_desc {
      where_query.push_str(" and t.trade_state_desc=?");
      args.push(trade_state_desc.into());
    }
    let trade_state_desc_like = match search {
      Some(item) => item.trade_state_desc_like.clone(),
      None => None,
    };
    if let Some(trade_state_desc_like) = trade_state_desc_like {
      where_query.push_str(" and t.trade_state_desc like ?");
      args.push(format!("%{}%", sql_like(&trade_state_desc_like)).into());
    }
  }
  // 支付完成时间
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
  // 交易限制时间
  {
    let time_expire = match search {
      Some(item) => item.time_expire.clone(),
      None => None,
    };
    if let Some(time_expire) = time_expire {
      where_query.push_str(" and t.time_expire=?");
      args.push(time_expire.into());
    }
    let time_expire_like = match search {
      Some(item) => item.time_expire_like.clone(),
      None => None,
    };
    if let Some(time_expire_like) = time_expire_like {
      where_query.push_str(" and t.time_expire like ?");
      args.push(format!("%{}%", sql_like(&time_expire_like)).into());
    }
  }
  // 附加数据
  {
    let attach = match search {
      Some(item) => item.attach.clone(),
      None => None,
    };
    if let Some(attach) = attach {
      where_query.push_str(" and t.attach=?");
      args.push(attach.into());
    }
    let attach_like = match search {
      Some(item) => item.attach_like.clone(),
      None => None,
    };
    if let Some(attach_like) = attach_like {
      where_query.push_str(" and t.attach like ?");
      args.push(format!("%{}%", sql_like(&attach_like)).into());
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
    if let Some(attach2_like) = attach2_like {
      where_query.push_str(" and t.attach2 like ?");
      args.push(format!("%{}%", sql_like(&attach2_like)).into());
    }
  }
  // 通知地址
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
    if let Some(notify_url_like) = notify_url_like {
      where_query.push_str(" and t.notify_url like ?");
      args.push(format!("%{}%", sql_like(&notify_url_like)).into());
    }
  }
  // 开发票
  {
    let receipt = match search {
      Some(item) => item.receipt.clone(),
      None => None,
    };
    if let Some(receipt) = receipt {
      where_query.push_str(" and t.receipt=?");
      args.push(receipt.into());
    }
    let receipt_like = match search {
      Some(item) => item.receipt_like.clone(),
      None => None,
    };
    if let Some(receipt_like) = receipt_like {
      where_query.push_str(" and t.receipt like ?");
      args.push(format!("%{}%", sql_like(&receipt_like)).into());
    }
  }
  // 分账
  {
    let profit_sharing = match search {
      Some(item) => item.profit_sharing.clone(),
      None => None,
    };
    if let Some(profit_sharing) = profit_sharing {
      where_query.push_str(" and t.profit_sharing=?");
      args.push(profit_sharing.into());
    }
    let profit_sharing_like = match search {
      Some(item) => item.profit_sharing_like.clone(),
      None => None,
    };
    if let Some(profit_sharing_like) = profit_sharing_like {
      where_query.push_str(" and t.profit_sharing like ?");
      args.push(format!("%{}%", sql_like(&profit_sharing_like)).into());
    }
  }
  // 订单金额(分)
  {
    let mut total_fee = match search {
      Some(item) => item.total_fee.unwrap_or_default(),
      None => Default::default(),
    };
    let total_fee_gt = total_fee[0].take();
    let total_fee_lt = total_fee[1].take();
    if let Some(total_fee_gt) = total_fee_gt {
      where_query.push_str(" and t.total_fee >= ?");
      args.push(total_fee_gt.into());
    }
    if let Some(total_fee_lt) = total_fee_lt {
      where_query.push_str(" and t.total_fee <= ?");
      args.push(total_fee_lt.into());
    }
  }
  // 货币类型
  {
    let currency: Option<Vec<PayTransactionsJsapiCurrency>> = match search {
      Some(item) => item.currency.clone(),
      None => None,
    };
    if let Some(currency) = currency {
      let arg = {
        if currency.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(currency.len());
          for item in currency {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.currency in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 用户标识
  {
    let openid = match search {
      Some(item) => item.openid.clone(),
      None => None,
    };
    if let Some(openid) = openid {
      where_query.push_str(" and t.openid=?");
      args.push(openid.into());
    }
    let openid_like = match search {
      Some(item) => item.openid_like.clone(),
      None => None,
    };
    if let Some(openid_like) = openid_like {
      where_query.push_str(" and t.openid like ?");
      args.push(format!("%{}%", sql_like(&openid_like)).into());
    }
  }
  // 预支付交易会话标识
  {
    let prepay_id = match search {
      Some(item) => item.prepay_id.clone(),
      None => None,
    };
    if let Some(prepay_id) = prepay_id {
      where_query.push_str(" and t.prepay_id=?");
      args.push(prepay_id.into());
    }
    let prepay_id_like = match search {
      Some(item) => item.prepay_id_like.clone(),
      None => None,
    };
    if let Some(prepay_id_like) = prepay_id_like {
      where_query.push_str(" and t.prepay_id like ?");
      args.push(format!("%{}%", sql_like(&prepay_id_like)).into());
    }
  }
  // 创建人
  {
    let create_usr_id: Option<Vec<UsrId>> = match search {
      Some(item) => item.create_usr_id.clone(),
      None => None,
    };
    if let Some(create_usr_id) = create_usr_id {
      let arg = {
        if create_usr_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(create_usr_id.len());
          for item in create_usr_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.create_usr_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let create_usr_id_is_null: bool = match search {
      Some(item) => item.create_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if create_usr_id_is_null {
      where_query.push_str(" and t.create_usr_id is null");
    }
  }
  {
    let create_usr_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.create_usr_id_lbl.clone(),
      None => None,
    };
    if let Some(create_usr_id_lbl) = create_usr_id_lbl {
      let arg = {
        if create_usr_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(create_usr_id_lbl.len());
          for item in create_usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.create_usr_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let create_usr_id_lbl_like = match search {
        Some(item) => item.create_usr_id_lbl_like.clone(),
        None => None,
      };
      if let Some(create_usr_id_lbl_like) = create_usr_id_lbl_like {
        if !create_usr_id_lbl_like.is_empty() {
          where_query.push_str(" and create_usr_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&create_usr_id_lbl_like)).into());
        }
      }
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
  // 更新人
  {
    let update_usr_id: Option<Vec<UsrId>> = match search {
      Some(item) => item.update_usr_id.clone(),
      None => None,
    };
    if let Some(update_usr_id) = update_usr_id {
      let arg = {
        if update_usr_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(update_usr_id.len());
          for item in update_usr_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.update_usr_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let update_usr_id_is_null: bool = match search {
      Some(item) => item.update_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if update_usr_id_is_null {
      where_query.push_str(" and t.update_usr_id is null");
    }
  }
  {
    let update_usr_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.update_usr_id_lbl.clone(),
      None => None,
    };
    if let Some(update_usr_id_lbl) = update_usr_id_lbl {
      let arg = {
        if update_usr_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(update_usr_id_lbl.len());
          for item in update_usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.update_usr_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let update_usr_id_lbl_like = match search {
        Some(item) => item.update_usr_id_lbl_like.clone(),
        None => None,
      };
      if let Some(update_usr_id_lbl_like) = update_usr_id_lbl_like {
        if !update_usr_id_lbl_like.is_empty() {
          where_query.push_str(" and update_usr_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&update_usr_id_lbl_like)).into());
        }
      }
    }
  }
  // 更新时间
  {
    let mut update_time = match search {
      Some(item) => item.update_time.unwrap_or_default(),
      None => Default::default(),
    };
    let update_time_gt = update_time[0].take();
    let update_time_lt = update_time[1].take();
    if let Some(update_time_gt) = update_time_gt {
      where_query.push_str(" and t.update_time >= ?");
      args.push(update_time_gt.into());
    }
    if let Some(update_time_lt) = update_time_lt {
      where_query.push_str(" and t.update_time <= ?");
      args.push(update_time_lt.into());
    }
  }
  Ok(where_query)
}

#[allow(unused_variables)]
async fn get_from_query(
  args: &mut QueryArgs,
  search: Option<&PayTransactionsJsapiSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"wx_pay_transactions_jsapi t"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_pay_transactions_jsapi
/// 根据搜索条件和分页查找微信JSAPI下单列表
#[allow(unused_mut)]
pub async fn find_all_pay_transactions_jsapi(
  search: Option<PayTransactionsJsapiSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<PayTransactionsJsapiModel>> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "find_all_pay_transactions_jsapi";
  
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
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
    if search.ids.is_some() && search.ids.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 交易状态
  if let Some(search) = &search && search.trade_state.is_some() {
    let len = search.trade_state.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.trade_state.length > {ids_limit}"));
    }
  }
  // 货币类型
  if let Some(search) = &search && search.currency.is_some() {
    let len = search.currency.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.currency.length > {ids_limit}"));
    }
  }
  // 创建人
  if let Some(search) = &search && search.create_usr_id.is_some() {
    let len = search.create_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.create_usr_id.length > {ids_limit}"));
    }
  }
  // 更新人
  if let Some(search) = &search && search.update_usr_id.is_some() {
    let len = search.update_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.update_usr_id.length > {ids_limit}"));
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  #[allow(unused_variables)]
  let is_deleted = search.as_ref()
    .and_then(|item| item.is_deleted);
  
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
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let mut res: Vec<PayTransactionsJsapiModel> = query(
    sql,
    args,
    Some(options),
  ).await?;
  
  let dict_vec = get_dict(&[
    "wx_pay_notice_trade_state",
    "wx_pay_notice_currency",
  ]).await?;
  let [
    trade_state_dict,
    currency_dict,
  ]: [Vec<_>; 2] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 交易状态
    model.trade_state_lbl = {
      trade_state_dict
        .iter()
        .find(|item| item.val == model.trade_state.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.trade_state.to_string())
    };
    
    // 货币类型
    model.currency_lbl = {
      currency_dict
        .iter()
        .find(|item| item.val == model.currency.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.currency.to_string())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_pay_transactions_jsapi
/// 根据条件查找微信JSAPI下单总数
pub async fn find_count_pay_transactions_jsapi(
  search: Option<PayTransactionsJsapiSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "find_count_pay_transactions_jsapi";
  
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
  // 交易状态
  if let Some(search) = &search && search.trade_state.is_some() {
    let len = search.trade_state.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.trade_state.length > {ids_limit}"));
    }
  }
  // 货币类型
  if let Some(search) = &search && search.currency.is_some() {
    let len = search.currency.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.currency.length > {ids_limit}"));
    }
  }
  // 创建人
  if let Some(search) = &search && search.create_usr_id.is_some() {
    let len = search.create_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.create_usr_id.length > {ids_limit}"));
    }
  }
  // 更新人
  if let Some(search) = &search && search.update_usr_id.is_some() {
    let len = search.update_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.update_usr_id.length > {ids_limit}"));
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

// MARK: get_field_comments_pay_transactions_jsapi
/// 获取微信JSAPI下单字段注释
pub async fn get_field_comments_pay_transactions_jsapi(
  _options: Option<Options>,
) -> Result<PayTransactionsJsapiFieldComment> {
  
  let field_comments = PayTransactionsJsapiFieldComment {
    id: "ID".into(),
    appid: "开发者ID".into(),
    mchid: "商户号".into(),
    description: "商品描述".into(),
    out_trade_no: "商户订单号".into(),
    transaction_id: "微信支付订单号".into(),
    trade_state: "交易状态".into(),
    trade_state_lbl: "交易状态".into(),
    trade_state_desc: "交易状态描述".into(),
    success_time: "支付完成时间".into(),
    success_time_lbl: "支付完成时间".into(),
    time_expire: "交易限制时间".into(),
    attach: "附加数据".into(),
    receipt: "开发票".into(),
    profit_sharing: "分账".into(),
    total_fee: "订单金额(分)".into(),
    currency: "货币类型".into(),
    currency_lbl: "货币类型".into(),
    openid: "用户标识".into(),
    create_usr_id: "创建人".into(),
    create_usr_id_lbl: "创建人".into(),
    create_time: "创建时间".into(),
    create_time_lbl: "创建时间".into(),
    update_usr_id: "更新人".into(),
    update_usr_id_lbl: "更新人".into(),
    update_time: "更新时间".into(),
    update_time_lbl: "更新时间".into(),
  };
  Ok(field_comments)
}

// MARK: find_one_ok_pay_transactions_jsapi
/// 根据条件查找第一个微信JSAPI下单, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_pay_transactions_jsapi(
  search: Option<PayTransactionsJsapiSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<PayTransactionsJsapiModel> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "find_one_ok_pay_transactions_jsapi";
  
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
  
  let pay_transactions_jsapi_model = find_one_pay_transactions_jsapi(
    search,
    sort,
    options,
  ).await?;
  
  let Some(pay_transactions_jsapi_model) = pay_transactions_jsapi_model else {
    let err_msg = "此 微信JSAPI下单 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(pay_transactions_jsapi_model)
}

// MARK: find_one_pay_transactions_jsapi
/// 根据条件查找第一个微信JSAPI下单
#[allow(dead_code)]
pub async fn find_one_pay_transactions_jsapi(
  search: Option<PayTransactionsJsapiSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<PayTransactionsJsapiModel>> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "find_one_pay_transactions_jsapi";
  
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
  
  let page = PageInput {
    pg_offset: 0.into(),
    pg_size: 1.into(),
  }.into();
  
  let res = find_all_pay_transactions_jsapi(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<PayTransactionsJsapiModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_pay_transactions_jsapi
/// 根据 id 查找微信JSAPI下单, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_pay_transactions_jsapi(
  id: PayTransactionsJsapiId,
  options: Option<Options>,
) -> Result<PayTransactionsJsapiModel> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "find_by_id_ok_pay_transactions_jsapi";
  
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
  
  let pay_transactions_jsapi_model = find_by_id_pay_transactions_jsapi(
    id,
    options,
  ).await?;
  
  let Some(pay_transactions_jsapi_model) = pay_transactions_jsapi_model else {
    let err_msg = "此 微信JSAPI下单 已被删除";
    error!(
      "{req_id} {err_msg} id: {id:?}",
      req_id = get_req_id(),
    );
    return Err(eyre!(ServiceException {
      message: err_msg.to_string(),
      trace: true,
      ..Default::default()
    }));
  };
  
  Ok(pay_transactions_jsapi_model)
}

// MARK: find_by_id_pay_transactions_jsapi
/// 根据 id 查找微信JSAPI下单
pub async fn find_by_id_pay_transactions_jsapi(
  id: PayTransactionsJsapiId,
  options: Option<Options>,
) -> Result<Option<PayTransactionsJsapiModel>> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "find_by_id_pay_transactions_jsapi";
  
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
  
  let search = PayTransactionsJsapiSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let pay_transactions_jsapi_model = find_one_pay_transactions_jsapi(
    search,
    None,
    options,
  ).await?;
  
  Ok(pay_transactions_jsapi_model)
}

// MARK: find_by_ids_ok_pay_transactions_jsapi
/// 根据 ids 查找微信JSAPI下单, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_pay_transactions_jsapi(
  ids: Vec<PayTransactionsJsapiId>,
  options: Option<Options>,
) -> Result<Vec<PayTransactionsJsapiModel>> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "find_by_ids_ok_pay_transactions_jsapi";
  
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
        message: "ids.length > FIND_ALL_IDS_LIMIT".to_string(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let pay_transactions_jsapi_models = find_by_ids_pay_transactions_jsapi(
    ids.clone(),
    options,
  ).await?;
  
  if pay_transactions_jsapi_models.len() != len {
    let err_msg = "此 微信JSAPI下单 已被删除";
    return Err(eyre!(err_msg));
  }
  
  let pay_transactions_jsapi_models = ids
    .into_iter()
    .map(|id| {
      let model = pay_transactions_jsapi_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = "此 微信JSAPI下单 已经被删除";
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<PayTransactionsJsapiModel>>>()?;
  
  Ok(pay_transactions_jsapi_models)
}

// MARK: find_by_ids_pay_transactions_jsapi
/// 根据 ids 查找微信JSAPI下单
#[allow(dead_code)]
pub async fn find_by_ids_pay_transactions_jsapi(
  ids: Vec<PayTransactionsJsapiId>,
  options: Option<Options>,
) -> Result<Vec<PayTransactionsJsapiModel>> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "find_by_ids_pay_transactions_jsapi";
  
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
        message: "ids.length > FIND_ALL_IDS_LIMIT".to_string(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let search = PayTransactionsJsapiSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let pay_transactions_jsapi_models = find_all_pay_transactions_jsapi(
    search,
    None,
    None,
    options,
  ).await?;
  
  let pay_transactions_jsapi_models = ids
    .into_iter()
    .filter_map(|id| {
      pay_transactions_jsapi_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<PayTransactionsJsapiModel>>();
  
  Ok(pay_transactions_jsapi_models)
}

// MARK: exists_pay_transactions_jsapi
/// 根据搜索条件判断微信JSAPI下单是否存在
#[allow(dead_code)]
pub async fn exists_pay_transactions_jsapi(
  search: Option<PayTransactionsJsapiSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "exists_pay_transactions_jsapi";
  
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
  // 交易状态
  if let Some(search) = &search && search.trade_state.is_some() {
    let len = search.trade_state.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.trade_state.length > {ids_limit}"));
    }
  }
  // 货币类型
  if let Some(search) = &search && search.currency.is_some() {
    let len = search.currency.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.currency.length > {ids_limit}"));
    }
  }
  // 创建人
  if let Some(search) = &search && search.create_usr_id.is_some() {
    let len = search.create_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.create_usr_id.length > {ids_limit}"));
    }
  }
  // 更新人
  if let Some(search) = &search && search.update_usr_id.is_some() {
    let len = search.update_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.update_usr_id.length > {ids_limit}"));
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
  
  let res: Option<(bool,)> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  Ok(res
    .map(|item| item.0)
    .unwrap_or_default())
}

// MARK: exists_by_id_pay_transactions_jsapi
/// 根据 id 判断微信JSAPI下单是否存在
#[allow(dead_code)]
pub async fn exists_by_id_pay_transactions_jsapi(
  id: PayTransactionsJsapiId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "exists_by_id_pay_transactions_jsapi";
  
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
  
  let search = PayTransactionsJsapiSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_pay_transactions_jsapi(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_pay_transactions_jsapi
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_pay_transactions_jsapi(
  search: PayTransactionsJsapiSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<PayTransactionsJsapiModel>> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "find_by_unique_pay_transactions_jsapi";
  
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
  
  if let Some(id) = search.id {
    let model = find_by_id_pay_transactions_jsapi(
      id,
      options.clone(),
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  Ok(vec![])
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
pub fn equals_by_unique(
  input: &PayTransactionsJsapiInput,
  model: &PayTransactionsJsapiModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  false
}

// MARK: check_by_unique_pay_transactions_jsapi
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_pay_transactions_jsapi(
  input: PayTransactionsJsapiInput,
  model: PayTransactionsJsapiModel,
  options: Option<Options>,
) -> Result<Option<PayTransactionsJsapiId>> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "check_by_unique_pay_transactions_jsapi";
  
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
    let id = update_by_id_pay_transactions_jsapi(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "此 微信JSAPI下单 已经存在";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_pay_transactions_jsapi
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_pay_transactions_jsapi(
  input: PayTransactionsJsapiInput,
) -> Result<PayTransactionsJsapiInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  // 支付完成时间
  if input.success_time.is_none() && let Some(success_time_lbl) = input.success_time_lbl.as_ref().filter(|s| !s.is_empty()) {
    input.success_time = chrono::NaiveDateTime::parse_from_str(success_time_lbl, "%Y-%m-%d %H:%M:%S").ok();
    if input.success_time.is_none() {
      input.success_time = chrono::NaiveDateTime::parse_from_str(success_time_lbl, "%Y-%m-%d").ok();
    }
    if input.success_time.is_none() {
      let field_comments = get_field_comments_pay_transactions_jsapi(
        None,
      ).await?;
      let column_comment = field_comments.success_time;
      
      let err_msg = "日期格式错误";
      return Err(eyre!("{column_comment} {err_msg}"));
    }
  }
  
  let dict_vec = get_dict(&[
    "wx_pay_notice_trade_state",
    "wx_pay_notice_currency",
  ]).await?;
  
  // 交易状态
  if input.trade_state.is_none() {
    let trade_state_dict = &dict_vec[0];
    if let Some(trade_state_lbl) = input.trade_state_lbl.clone() {
      input.trade_state = trade_state_dict
        .iter()
        .find(|item| {
          item.lbl == trade_state_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 货币类型
  if input.currency.is_none() {
    let currency_dict = &dict_vec[1];
    if let Some(currency_lbl) = input.currency_lbl.clone() {
      input.currency = currency_dict
        .iter()
        .find(|item| {
          item.lbl == currency_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 交易状态
  if
    input.trade_state_lbl.is_some() && !input.trade_state_lbl.as_ref().unwrap().is_empty()
    && input.trade_state.is_none()
  {
    let trade_state_dict = &dict_vec[0];
    let dict_model = trade_state_dict.iter().find(|item| {
      item.lbl == input.trade_state_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.trade_state = val.parse::<PayTransactionsJsapiTradeState>()?.into();
    }
  } else if
    (input.trade_state_lbl.is_none() || input.trade_state_lbl.as_ref().unwrap().is_empty())
    && input.trade_state.is_some()
  {
    let trade_state_dict = &dict_vec[0];
    let dict_model = trade_state_dict.iter().find(|item| {
      item.val == input.trade_state.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.trade_state_lbl = lbl;
  }
  
  // 货币类型
  if
    input.currency_lbl.is_some() && !input.currency_lbl.as_ref().unwrap().is_empty()
    && input.currency.is_none()
  {
    let currency_dict = &dict_vec[1];
    let dict_model = currency_dict.iter().find(|item| {
      item.lbl == input.currency_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.currency = val.parse::<PayTransactionsJsapiCurrency>()?.into();
    }
  } else if
    (input.currency_lbl.is_none() || input.currency_lbl.as_ref().unwrap().is_empty())
    && input.currency.is_some()
  {
    let currency_dict = &dict_vec[1];
    let dict_model = currency_dict.iter().find(|item| {
      item.val == input.currency.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.currency_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return_pay_transactions_jsapi
/// 批量创建微信JSAPI下单并返回
#[allow(dead_code)]
pub async fn creates_return_pay_transactions_jsapi(
  inputs: Vec<PayTransactionsJsapiInput>,
  options: Option<Options>,
) -> Result<Vec<PayTransactionsJsapiModel>> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "creates_return_pay_transactions_jsapi";
  
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
    options.clone(),
  ).await?;
  
  let models_pay_transactions_jsapi = find_by_ids_pay_transactions_jsapi(
    ids,
    options,
  ).await?;
  
  Ok(models_pay_transactions_jsapi)
}

// MARK: creates_pay_transactions_jsapi
/// 批量创建微信JSAPI下单
pub async fn creates_pay_transactions_jsapi(
  inputs: Vec<PayTransactionsJsapiInput>,
  options: Option<Options>,
) -> Result<Vec<PayTransactionsJsapiId>> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "creates_pay_transactions_jsapi";
  
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

/// 批量创建微信JSAPI下单
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<PayTransactionsJsapiInput>,
  options: Option<Options>,
) -> Result<Vec<PayTransactionsJsapiId>> {
  
  let table = "wx_pay_transactions_jsapi";
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<PayTransactionsJsapiId> = vec![];
  let mut inputs2: Vec<PayTransactionsJsapiInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_pay_transactions_jsapi(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<PayTransactionsJsapiId> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique_pay_transactions_jsapi(
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
  let mut sql_fields = String::with_capacity(80 * 25 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  sql_fields += ",tenant_id";
  // 开发者ID
  sql_fields += ",appid";
  // 商户号
  sql_fields += ",mchid";
  // 商品描述
  sql_fields += ",description";
  // 商户订单号
  sql_fields += ",out_trade_no";
  // 微信支付订单号
  sql_fields += ",transaction_id";
  // 交易状态
  sql_fields += ",trade_state";
  // 交易状态描述
  sql_fields += ",trade_state_desc";
  // 支付完成时间
  sql_fields += ",success_time";
  // 交易限制时间
  sql_fields += ",time_expire";
  // 附加数据
  sql_fields += ",attach";
  // 附加数据2
  sql_fields += ",attach2";
  // 通知地址
  sql_fields += ",notify_url";
  // 开发票
  sql_fields += ",receipt";
  // 分账
  sql_fields += ",profit_sharing";
  // 订单金额(分)
  sql_fields += ",total_fee";
  // 货币类型
  sql_fields += ",currency";
  // 用户标识
  sql_fields += ",openid";
  // 预支付交易会话标识
  sql_fields += ",prepay_id";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 25 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: PayTransactionsJsapiId = get_short_uuid().into();
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
    
    if let Some(update_time) = input.update_time {
      sql_values += ",?";
      args.push(update_time.into());
    } else {
      sql_values += ",null";
    }
    
    if !is_silent_mode {
      if input.create_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.unwrap(),
            options.clone(),
          ).await?;
          if let Some(usr_model) = usr_model {
            usr_lbl = usr_model.lbl;
          } else {
            usr_id = None;
          }
        }
        if let Some(usr_id) = usr_id {
          sql_values += ",?";
          args.push(usr_id.into());
        } else {
          sql_values += ",default";
        }
        sql_values += ",?";
        args.push(usr_lbl.into());
      } else if input.create_usr_id.unwrap().is_empty() {
        sql_values += ",default";
        sql_values += ",default";
      } else {
        let mut usr_id = input.create_usr_id;
        let mut usr_lbl = String::new();
        let usr_model = find_by_id_usr(
          usr_id.unwrap(),
          options.clone(),
        ).await?;
        if let Some(usr_model) = usr_model {
          usr_lbl = usr_model.lbl;
        } else {
          usr_id = None;
        }
        if let Some(usr_id) = usr_id {
          sql_values += ",?";
          args.push(usr_id.into());
        } else {
          sql_values += ",default";
        }
        sql_values += ",?";
        args.push(usr_lbl.into());
      }
    } else {
      if let Some(create_usr_id) = input.create_usr_id {
        sql_values += ",?";
        args.push(create_usr_id.into());
      } else {
        sql_values += ",default";
      }
      if let Some(create_usr_id_lbl) = input.create_usr_id_lbl {
        sql_values += ",?";
        args.push(create_usr_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    }
    
    if let Some(update_usr_id) = input.update_usr_id {
      sql_values += ",?";
      args.push(update_usr_id.into());
    } else {
      sql_values += ",default";
    }
    
    if let Some(update_usr_id_lbl) = input.update_usr_id_lbl {
      sql_values += ",?";
      args.push(update_usr_id_lbl.into());
    } else {
      sql_values += ",default";
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
    // 商品描述
    if let Some(description) = input.description {
      sql_values += ",?";
      args.push(description.into());
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
    // 交易状态
    if let Some(trade_state) = input.trade_state {
      sql_values += ",?";
      args.push(trade_state.into());
    } else {
      sql_values += ",default";
    }
    // 交易状态描述
    if let Some(trade_state_desc) = input.trade_state_desc {
      sql_values += ",?";
      args.push(trade_state_desc.into());
    } else {
      sql_values += ",default";
    }
    // 支付完成时间
    if let Some(success_time) = input.success_time {
      sql_values += ",?";
      args.push(success_time.into());
    } else if input.success_time_save_null == Some(true) {
      sql_values += ",null";
    } else {
      sql_values += ",default";
    }
    // 交易限制时间
    if let Some(time_expire) = input.time_expire {
      sql_values += ",?";
      args.push(time_expire.into());
    } else {
      sql_values += ",default";
    }
    // 附加数据
    if let Some(attach) = input.attach {
      sql_values += ",?";
      args.push(attach.into());
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
    // 通知地址
    if let Some(notify_url) = input.notify_url {
      sql_values += ",?";
      args.push(notify_url.into());
    } else {
      sql_values += ",default";
    }
    // 开发票
    if let Some(receipt) = input.receipt {
      sql_values += ",?";
      args.push(receipt.into());
    } else {
      sql_values += ",default";
    }
    // 分账
    if let Some(profit_sharing) = input.profit_sharing {
      sql_values += ",?";
      args.push(profit_sharing.into());
    } else {
      sql_values += ",default";
    }
    // 订单金额(分)
    if let Some(total_fee) = input.total_fee {
      sql_values += ",?";
      args.push(total_fee.into());
    } else {
      sql_values += ",default";
    }
    // 货币类型
    if let Some(currency) = input.currency {
      sql_values += ",?";
      args.push(currency.into());
    } else {
      sql_values += ",default";
    }
    // 用户标识
    if let Some(openid) = input.openid {
      sql_values += ",?";
      args.push(openid.into());
    } else {
      sql_values += ",default";
    }
    // 预支付交易会话标识
    if let Some(prepay_id) = input.prepay_id {
      sql_values += ",?";
      args.push(prepay_id.into());
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
  
  let options = Options::from(options);
  
  let options = Some(options);
  
  let affected_rows = execute(
    sql,
    args,
    options.clone(),
  ).await?;
  
  if affected_rows != inputs2_len as u64 {
    return Err(eyre!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  
  Ok(ids2)
}

// MARK: create_return_pay_transactions_jsapi
/// 创建微信JSAPI下单并返回
#[allow(dead_code)]
pub async fn create_return_pay_transactions_jsapi(
  #[allow(unused_mut)]
  mut input: PayTransactionsJsapiInput,
  options: Option<Options>,
) -> Result<PayTransactionsJsapiModel> {
  
  let id = create_pay_transactions_jsapi(
    input.clone(),
    options.clone(),
  ).await?;
  
  let model_pay_transactions_jsapi = find_by_id_pay_transactions_jsapi(
    id,
    options,
  ).await?;
  
  if model_pay_transactions_jsapi.is_none() {
    let err_msg = "create_return_pay_transactions_jsapi: model_pay_transactions_jsapi.is_none()";
    return Err(eyre!(
      ServiceException {
        message: err_msg.to_owned(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  let model_pay_transactions_jsapi = model_pay_transactions_jsapi.unwrap();
  
  Ok(model_pay_transactions_jsapi)
}

// MARK: create_pay_transactions_jsapi
/// 创建微信JSAPI下单
#[allow(dead_code)]
pub async fn create_pay_transactions_jsapi(
  #[allow(unused_mut)]
  mut input: PayTransactionsJsapiInput,
  options: Option<Options>,
) -> Result<PayTransactionsJsapiId> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "create_pay_transactions_jsapi";
  
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

// MARK: update_tenant_by_id_pay_transactions_jsapi
/// 微信JSAPI下单根据id修改租户id
pub async fn update_tenant_by_id_pay_transactions_jsapi(
  id: PayTransactionsJsapiId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = "wx_pay_transactions_jsapi";
  let method = "update_tenant_by_id_pay_transactions_jsapi";
  
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
  
  let mut args = QueryArgs::new();
  
  args.push(tenant_id.into());
  args.push(id.into());
  
  let sql = format!("update {table} set tenant_id=? where id=?");
  
  let args: Vec<_> = args.into();
  
  let num = execute(
    sql,
    args,
    Some(options.clone()),
  ).await?;
  
  Ok(num)
}

// MARK: update_by_id_pay_transactions_jsapi
/// 根据 id 修改微信JSAPI下单
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_pay_transactions_jsapi(
  id: PayTransactionsJsapiId,
  mut input: PayTransactionsJsapiInput,
  options: Option<Options>,
) -> Result<PayTransactionsJsapiId> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "update_by_id_pay_transactions_jsapi";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
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
  
  let old_model = find_by_id_pay_transactions_jsapi(
    id,
    options.clone(),
  ).await?;
  
  if old_model.is_none() {
    let err_msg = "编辑失败, 此 微信JSAPI下单 已被删除";
    return Err(eyre!(err_msg));
  }
  let old_model = old_model.unwrap();
  
  if !is_silent_mode {
    info!(
      "{} {}.{}: {}",
      get_req_id(),
      table,
      method,
      serde_json::to_string(&old_model)?,
    );
  }
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique_pay_transactions_jsapi(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<PayTransactionsJsapiModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "此 微信JSAPI下单 已经存在";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 25 + 20);
  
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
  // 商品描述
  if let Some(description) = input.description {
    field_num += 1;
    sql_fields += "description=?,";
    args.push(description.into());
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
  // 交易状态
  if let Some(trade_state) = input.trade_state {
    field_num += 1;
    sql_fields += "trade_state=?,";
    args.push(trade_state.into());
  }
  // 交易状态描述
  if let Some(trade_state_desc) = input.trade_state_desc {
    field_num += 1;
    sql_fields += "trade_state_desc=?,";
    args.push(trade_state_desc.into());
  }
  // 支付完成时间
  if let Some(success_time) = input.success_time {
    field_num += 1;
    sql_fields += "success_time=?,";
    args.push(success_time.into());
  } else if input.success_time_save_null == Some(true) {
    field_num += 1;
    sql_fields += "success_time=null,";
  }
  // 交易限制时间
  if let Some(time_expire) = input.time_expire {
    field_num += 1;
    sql_fields += "time_expire=?,";
    args.push(time_expire.into());
  }
  // 附加数据
  if let Some(attach) = input.attach {
    field_num += 1;
    sql_fields += "attach=?,";
    args.push(attach.into());
  }
  // 附加数据2
  if let Some(attach2) = input.attach2 {
    field_num += 1;
    sql_fields += "attach2=?,";
    args.push(attach2.into());
  }
  // 通知地址
  if let Some(notify_url) = input.notify_url {
    field_num += 1;
    sql_fields += "notify_url=?,";
    args.push(notify_url.into());
  }
  // 开发票
  if let Some(receipt) = input.receipt {
    field_num += 1;
    sql_fields += "receipt=?,";
    args.push(receipt.into());
  }
  // 分账
  if let Some(profit_sharing) = input.profit_sharing {
    field_num += 1;
    sql_fields += "profit_sharing=?,";
    args.push(profit_sharing.into());
  }
  // 订单金额(分)
  if let Some(total_fee) = input.total_fee {
    field_num += 1;
    sql_fields += "total_fee=?,";
    args.push(total_fee.into());
  }
  // 货币类型
  if let Some(currency) = input.currency {
    field_num += 1;
    sql_fields += "currency=?,";
    args.push(currency.into());
  }
  // 用户标识
  if let Some(openid) = input.openid {
    field_num += 1;
    sql_fields += "openid=?,";
    args.push(openid.into());
  }
  // 预支付交易会话标识
  if let Some(prepay_id) = input.prepay_id {
    field_num += 1;
    sql_fields += "prepay_id=?,";
    args.push(prepay_id.into());
  }
  
  if field_num > 0 {
    if !is_silent_mode && !is_creating {
      if input.update_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_id_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.unwrap(),
            options.clone(),
          ).await?;
          if let Some(usr_model) = usr_model {
            usr_id_lbl = usr_model.lbl;
          } else {
            usr_id = None;
          }
        }
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
        }
        if !usr_id_lbl.is_empty() {
          sql_fields += "update_usr_id_lbl=?,";
          args.push(usr_id_lbl.into());
        }
      } else if !input.update_usr_id.unwrap().is_empty() {
        let mut usr_id = input.update_usr_id;
        let mut usr_id_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.unwrap(),
            options.clone(),
          ).await?;
          if let Some(usr_model) = usr_model {
            usr_id_lbl = usr_model.lbl;
          } else {
            usr_id = None;
          }
        }
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
          sql_fields += "update_usr_id_lbl=?,";
          args.push(usr_id_lbl.into());
        }
      }
    } else {
      if input.update_usr_id.is_some() && !input.update_usr_id.unwrap().is_empty() {
        let usr_id = input.update_usr_id;
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
        }
      }
      if let Some(update_usr_id_lbl) = input.update_usr_id_lbl {
        sql_fields += "update_usr_id=?,";
        args.push(update_usr_id_lbl.into());
      }
    }
    if !is_silent_mode && !is_creating {
      if let Some(update_time) = input.update_time {
        sql_fields += "update_time=?,";
        args.push(update_time.into());
      } else {
        sql_fields += "update_time=?,";
        args.push(get_now().into());
      }
    } else if let Some(update_time) = input.update_time {
      sql_fields += "update_time=?,";
      args.push(update_time.into());
    }
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql_where = "id=?";
    args.push(id.into());
    
    let sql = format!("update {table} set {sql_fields} where {sql_where} limit 1");
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());
    
    let options = Some(options);
    
    execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
  }
  
  Ok(id)
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = "wx_pay_transactions_jsapi";
  vec![
    table,
  ]
}

// MARK: del_cache_pay_transactions_jsapi
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_pay_transactions_jsapi() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

// MARK: delete_by_ids_pay_transactions_jsapi
/// 根据 ids 删除微信JSAPI下单
#[allow(unused_variables)]
pub async fn delete_by_ids_pay_transactions_jsapi(
  ids: Vec<PayTransactionsJsapiId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "delete_by_ids_pay_transactions_jsapi";
  
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
    
    let old_model = find_by_id_pay_transactions_jsapi(
      id,
      options.clone(),
    ).await?;
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
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
    
    let mut sql_fields = String::with_capacity(30);
    sql_fields.push_str("is_deleted=1,");
    let mut usr_id = get_auth_id();
    let mut usr_lbl = String::new();
    if usr_id.is_some() {
      let usr_model = find_by_id_usr(
        usr_id.unwrap(),
        options.clone(),
      ).await?;
      if let Some(usr_model) = usr_model {
        usr_lbl = usr_model.lbl;
      } else {
        usr_id = None;
      }
    }
    
    if !is_silent_mode && !is_creating && let Some(usr_id) = usr_id {
      sql_fields.push_str("delete_usr_id=?,");
      args.push(usr_id.into());
    }
    
    if !is_silent_mode && !is_creating {
      sql_fields.push_str("delete_usr_id_lbl=?,");
      args.push(usr_lbl.into());
    }
    
    if !is_silent_mode && !is_creating {
      sql_fields.push_str("delete_time=?,");
      args.push(get_now().into());
    }
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql = format!("update {table} set {sql_fields} where id=? limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());
    
    let options = Some(options);
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: revert_by_ids_pay_transactions_jsapi
/// 根据 ids 还原微信JSAPI下单
pub async fn revert_by_ids_pay_transactions_jsapi(
  ids: Vec<PayTransactionsJsapiId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "revert_by_ids_pay_transactions_jsapi";
  
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
    return Ok(0);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_deleted=0 where id=? limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one_pay_transactions_jsapi(
      PayTransactionsJsapiSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_pay_transactions_jsapi(
        id,
        options.clone(),
      ).await?;
    }
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
    {
      let mut input: PayTransactionsJsapiInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_pay_transactions_jsapi(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<PayTransactionsJsapiModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "此 微信JSAPI下单 已经存在";
        return Err(eyre!(err_msg));
      }
    }
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
  }
  
  Ok(num)
}

// MARK: force_delete_by_ids_pay_transactions_jsapi
/// 根据 ids 彻底删除微信JSAPI下单
#[allow(unused_variables)]
pub async fn force_delete_by_ids_pay_transactions_jsapi(
  ids: Vec<PayTransactionsJsapiId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wx_pay_transactions_jsapi";
  let method = "force_delete_by_ids_pay_transactions_jsapi";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
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
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_all_pay_transactions_jsapi(
      PayTransactionsJsapiSearch {
        id: id.into(),
        is_deleted: 1.into(),
        ..Default::default()
      }.into(),
      None,
      None, 
      options.clone(),
    ).await?.into_iter().next();
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
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
    
    let sql = format!("delete from {table} where id=? and is_deleted=1 limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());
    
    let options = Some(options);
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
  }
  
  Ok(num)
}

// MARK: validate_option_pay_transactions_jsapi
/// 校验微信JSAPI下单是否存在
#[allow(dead_code)]
pub async fn validate_option_pay_transactions_jsapi(
  model: Option<PayTransactionsJsapiModel>,
) -> Result<PayTransactionsJsapiModel> {
  if model.is_none() {
    let err_msg = "微信JSAPI下单不存在";
    error!(
      "{req_id} {err_msg}",
      req_id = get_req_id(),
    );
    return Err(eyre!(
      ServiceException {
        message: err_msg.to_owned(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  let model = model.unwrap();
  Ok(model)
}
