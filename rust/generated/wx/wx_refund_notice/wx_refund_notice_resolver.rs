
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{
  get_req_id,
  Options,
};

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{PageInput, SortInput};
#[allow(unused_imports)]
use crate::common::permit::permit_service::use_permit;

use super::wx_refund_notice_model::*;
use super::wx_refund_notice_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找微信退款通知列表
#[function_name::named]
pub async fn find_all_wx_refund_notice(
  search: Option<WxRefundNoticeSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wx_refund_notice(sort.as_deref())?;
  
  let models = wx_refund_notice_service::find_all_wx_refund_notice(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找微信退款通知总数
#[function_name::named]
pub async fn find_count_wx_refund_notice(
  search: Option<WxRefundNoticeSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wx_refund_notice_service::find_count_wx_refund_notice(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个微信退款通知
#[function_name::named]
pub async fn find_one_wx_refund_notice(
  search: Option<WxRefundNoticeSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxRefundNoticeModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wx_refund_notice(sort.as_deref())?;
  
  let model = wx_refund_notice_service::find_one_wx_refund_notice(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个微信退款通知, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_wx_refund_notice(
  search: Option<WxRefundNoticeSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxRefundNoticeModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_wx_refund_notice(sort.as_deref())?;
  
  let model = wx_refund_notice_service::find_one_ok_wx_refund_notice(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找微信退款通知
#[function_name::named]
pub async fn find_by_id_wx_refund_notice(
  id: WxRefundNoticeId,
  options: Option<Options>,
) -> Result<Option<WxRefundNoticeModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wx_refund_notice_service::find_by_id_wx_refund_notice(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找微信退款通知, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_wx_refund_notice(
  id: WxRefundNoticeId,
  options: Option<Options>,
) -> Result<WxRefundNoticeModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = wx_refund_notice_service::find_by_id_ok_wx_refund_notice(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找微信退款通知
#[function_name::named]
pub async fn find_by_ids_wx_refund_notice(
  ids: Vec<WxRefundNoticeId>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wx_refund_notice_service::find_by_ids_wx_refund_notice(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找微信退款通知, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_wx_refund_notice(
  ids: Vec<WxRefundNoticeId>,
  options: Option<Options>,
) -> Result<Vec<WxRefundNoticeModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = wx_refund_notice_service::find_by_ids_ok_wx_refund_notice(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 微信退款通知根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_wx_refund_notice(
  id: WxRefundNoticeId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = wx_refund_notice_service::update_tenant_by_id_wx_refund_notice(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取微信退款通知字段注释
#[function_name::named]
pub async fn get_field_comments_wx_refund_notice(
  options: Option<Options>,
) -> Result<WxRefundNoticeFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = wx_refund_notice_service::get_field_comments_wx_refund_notice(
    options,
  ).await?;
  
  Ok(comments)
}
